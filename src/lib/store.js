/* Couche de données — bascule automatiquement entre Supabase (partagé)
   et localStorage (par appareil) selon la configuration. */
import { supabase, hasBackend, SUPABASE_URL, SUPABASE_KEY } from './supabase.js';

/* ---------- helpers localStorage ---------- */
function loadLS(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function saveLS(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

/* ---------- temps relatif (fr) ---------- */
export function relativeTime(iso) {
  if (!iso) return "à l'instant";
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "à l'instant";
  if (min < 60) return `il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `il y a ${h} h`;
  const j = Math.floor(h / 24);
  if (j < 7) return `il y a ${j} j`;
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
}

/* ============================================================
   RSVP
   ============================================================ */
export function getLocalRsvp() { return loadLS("aj_rsvp_done", null); }
export function clearLocalRsvp() { saveLS("aj_rsvp_done", null); }

export async function submitRsvp(form) {
  const rec = { ...form, at: Date.now() };
  // Si la base partagée est branchée, on EXIGE que l'enregistrement réussisse.
  // Sinon on lève une erreur pour que l'invité puisse réessayer (au lieu d'un faux "c'est confirmé").
  if (hasBackend) {
    // Écriture SEULE (return=minimal) : la table rsvps est privée (pas de lecture),
    // donc on ne demande PAS à relire la ligne — sinon la RLS renvoie une erreur.
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rsvps`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        name: form.name,
        presence: form.presence,
        message: form.message || null,
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error("Enregistrement impossible (" + res.status + ") " + detail);
    }
  }
  // Enregistrement OK (ou mode local sans base) : on garde une copie locale pour l'état "confirmé".
  saveLS("aj_rsvp_done", rec);
  return rec;
}

/* ============================================================
   LIVRE D'OR
   ============================================================ */
export async function fetchGuestbook() {
  if (hasBackend) {
    try {
      const { data, error } = await supabase
        .from("guestbook")
        .select("id,name,text,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map((r) => ({ id: r.id, name: r.name, text: r.text, when: relativeTime(r.created_at) }));
    } catch (e) { console.warn("Livre d'or Supabase échoué (bascule locale) :", e); }
  }
  return loadLS("aj_guestbook_v2", []);
}

export async function addGuestbook({ name, text }) {
  const clean = { name: name.trim(), text: text.trim() };
  if (hasBackend) {
    try {
      const { data, error } = await supabase
        .from("guestbook")
        .insert({ name: clean.name, text: clean.text })
        .select("id,name,text,created_at")
        .single();
      if (error) throw error;
      return { id: data.id, name: data.name, text: data.text, when: relativeTime(data.created_at) };
    } catch (e) { console.warn("Ajout livre d'or Supabase échoué (bascule locale) :", e); }
  }
  const item = { id: "g" + Date.now(), ...clean, when: "à l'instant" };
  const list = loadLS("aj_guestbook_v2", []);
  saveLS("aj_guestbook_v2", [item, ...list]);
  return item;
}

/* ============================================================
   MUR DE PHOTOS
   ============================================================ */
export async function fetchPhotos() {
  if (hasBackend) {
    try {
      const { data, error } = await supabase
        .from("photos")
        .select("id,author,label,tag,url,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map((r) => ({ id: r.id, author: r.author, label: r.label, tag: r.tag, url: r.url }));
    } catch (e) { console.warn("Mur de photos Supabase échoué (bascule locale) :", e); }
  }
  return loadLS("aj_photowall_v2", []);
}

export async function addPhoto(file, { author = "Invité·e", tag = "en direct" } = {}) {
  const label = (file.name.replace(/\.[^.]+$/, "") || "Souvenir").slice(0, 24);
  if (hasBackend) {
    try {
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const up = await supabase.storage.from("photos").upload(path, file, { upsert: false });
      if (up.error) throw up.error;
      const { data: pub } = supabase.storage.from("photos").getPublicUrl(path);
      const { data, error } = await supabase
        .from("photos")
        .insert({ author, label, tag, url: pub.publicUrl })
        .select("id,author,label,tag,url")
        .single();
      if (error) throw error;
      return { id: data.id, author: data.author, label: data.label, tag: data.tag, url: data.url };
    } catch (e) { console.warn("Upload photo Supabase échoué (bascule locale) :", e); }
  }
  // Fallback local : on lit le fichier en data URL.
  const dataUrl = await new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
  const item = { id: "u" + Date.now(), author: "Toi", tag, label, url: dataUrl };
  const list = loadLS("aj_photowall_v2", []);
  saveLS("aj_photowall_v2", [item, ...list]);
  return item;
}
