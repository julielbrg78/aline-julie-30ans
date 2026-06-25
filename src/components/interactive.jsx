/* Sections interactives — RSVP, Mur de photos, Livre d'or (Supabase + repli local) */
import { useState, useEffect, useRef } from 'react';
import { EVENT } from '../data.js';
import { SectionTitle, Icon, Reveal, Lightbox } from './ui.jsx';
import {
  getLocalRsvp, clearLocalRsvp, submitRsvp,
  fetchGuestbook, addGuestbook,
  fetchPhotos, addPhoto,
} from '../lib/store.js';

/* --- Helpers calendrier --- */
function icsDate(d) {
  return d.getUTCFullYear()
    + String(d.getUTCMonth() + 1).padStart(2, "0")
    + String(d.getUTCDate()).padStart(2, "0") + "T"
    + String(d.getUTCHours()).padStart(2, "0")
    + String(d.getUTCMinutes()).padStart(2, "0") + "00Z";
}
function eventDates() {
  const start = new Date(EVENT.dateISO);
  const end = new Date(start.getTime() + 8 * 3600000);
  return { start, end };
}
function gcalLink() {
  const { start, end } = eventDates();
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "🎉 Les 30 ans d'Aline & Julie",
    dates: icsDate(start) + "/" + icsDate(end),
    details: "On vous attend pour fêter nos 30 ans en mode Sunset Gala ! Dress code coloré, ambiance festive.",
    location: EVENT.venue + ", " + EVENT.address,
  });
  return "https://calendar.google.com/calendar/render?" + params.toString();
}
function downloadIcs() {
  const { start, end } = eventDates();
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Aline & Julie//30 ans//FR",
    "BEGIN:VEVENT",
    "UID:" + Date.now() + "@aline-julie-30ans",
    "DTSTAMP:" + icsDate(new Date()),
    "DTSTART:" + icsDate(start),
    "DTEND:" + icsDate(end),
    "SUMMARY:🎉 Les 30 ans d'Aline & Julie",
    "DESCRIPTION:On vous attend pour fêter nos 30 ans en mode Sunset Gala !",
    "LOCATION:" + EVENT.venue + "\\, " + EVENT.address,
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "30ans-aline-julie.ics";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Field({ label, children }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--terracotta)", marginBottom: 8 }}>{label}</span>
      {children}
    </label>
  );
}

/* ============ RSVP ============ */
export function Rsvp() {
  const [done, setDone] = useState(() => getLocalRsvp());
  const [form, setForm] = useState({ name: "", presence: "oui", diet: "", message: "" });
  const [sending, setSending] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    if (!form.name.trim() || sending) return;
    setSending(true);
    const rec = await submitRsvp(form);
    setDone(rec);
    setSending(false);
  }

  if (done) {
    const oui = done.presence === "oui";
    return (
      <section className="section" data-screen-label="RSVP" style={{ background: "linear-gradient(180deg, var(--rose), var(--coral-soft))", textAlign: "center" }}>
        <Reveal>
          <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: "var(--r-xl)", padding: "44px 26px", border: "1px solid rgba(255,255,255,0.7)", boxShadow: "var(--sh-card)" }}>
            <div style={{ width: 64, height: 64, margin: "0 auto 18px", borderRadius: "50%", background: "linear-gradient(135deg, var(--coral), var(--terracotta))", display: "grid", placeItems: "center" }}>
              <Icon name={oui ? "glass" : "heart"} size={30} stroke="#fff" />
            </div>
            <h2 className="script" style={{ fontSize: 50, margin: "0 0 8px" }}>{oui ? "Youpiii ❤️" : "Merci ✨"}</h2>
            <p className="serif" style={{ fontSize: 19, fontStyle: "italic", color: "var(--terracotta-d)", margin: "0 auto 6px", maxWidth: 300, lineHeight: 1.45 }}>
              {oui ? "On a tellement hâte de fêter ça avec toi. Bloque vite la date 👇" : "Tu vas nous manquer… mais merci de nous avoir prévenues ❤️"}
            </p>
            {oui && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 22 }}>
                <button className="btn btn-primary" onClick={() => window.open(gcalLink(), "_blank")}>
                  <Icon name="cal" size={17} stroke="#fff" /> Ajouter à Google Agenda
                </button>
                <button className="btn btn-ghost" onClick={downloadIcs}>
                  <Icon name="cal" size={16} /> Télécharger l'invitation (.ics)
                </button>
              </div>
            )}
            <button style={{ marginTop: 16, background: "none", border: "none", color: "var(--ink-soft)", fontSize: 13, textDecoration: "underline", textUnderlineOffset: 3, cursor: "pointer", fontFamily: "var(--f-sans)" }} onClick={() => { clearLocalRsvp(); setDone(null); }}>
              Modifier ma réponse
            </button>
          </div>
        </Reveal>
      </section>
    );
  }

  return (
    <section className="section" data-screen-label="RSVP" style={{ background: "linear-gradient(180deg, var(--rose), var(--coral-soft))" }}>
      <Reveal><SectionTitle eyebrow="On compte sur toi ✨" title="Tu viens ?" script sub="Dis-nous si tu viens, on doit gérer un minimum d'organisation (et de champagne) ! 🍾" /></Reveal>
      <Reveal delay={60}>
        <form onSubmit={submit} style={{ background: "rgba(255,255,255,0.78)", borderRadius: "var(--r-xl)", padding: "24px 22px 26px", border: "1px solid rgba(255,255,255,0.8)", boxShadow: "var(--sh-card)", display: "flex", flexDirection: "column", gap: 18 }}>
          <Field label="Ton nom">
            <input className="aj-input" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Prénom & nom" required />
          </Field>

          <Field label="Tu seras là ?">
            <div style={{ display: "flex", gap: 10 }}>
              {[["oui", "Carrément ! 🎉"], ["non", "Je ne peux pas"]].map(([v, l]) => (
                <button type="button" key={v} onClick={() => set("presence", v)}
                  style={{
                    flex: 1, padding: "13px 8px", borderRadius: 14, fontSize: 14, fontWeight: 600, fontFamily: "var(--f-sans)",
                    border: form.presence === v ? "1.5px solid var(--terracotta)" : "1.5px solid var(--line)",
                    background: form.presence === v ? "linear-gradient(135deg, var(--coral), var(--terracotta))" : "#fff",
                    color: form.presence === v ? "#fff" : "var(--ink-soft)", transition: "all .2s",
                  }}>{l}</button>
              ))}
            </div>
          </Field>

          {form.presence === "oui" && (
            <Field label="Restrictions alimentaires">
              <input className="aj-input" value={form.diet} onChange={(e) => set("diet", e.target.value)} placeholder="Végé, allergies, sans alcool…" />
            </Field>
          )}

          <Field label="Un petit mot aux organisatrices">
            <textarea className="aj-input" rows={3} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Hâte d'y être ! …" style={{ resize: "none" }} />
          </Field>

          <button type="submit" className="btn btn-primary" style={{ marginTop: 4, opacity: sending ? 0.7 : 1 }} disabled={sending}>
            <Icon name="check" size={17} stroke="#fff" /> {sending ? "Envoi…" : "C'est envoyé !"}
          </button>
        </form>
      </Reveal>
    </section>
  );
}

/* ============ MUR DE PHOTOS ============ */
export function PhotoWall() {
  const [items, setItems] = useState([]);
  const [lb, setLb] = useState(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => { let on = true; fetchPhotos().then((d) => { if (on) setItems(d); }); return () => { on = false; }; }, []);

  // Le QR pointe vers l'adresse réelle du site : les invités l'ouvrent sur leur téléphone et ajoutent leurs photos.
  const qrTarget = typeof window !== "undefined" ? window.location.origin + "/#s-photos" : "";
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=360x360&margin=10&qzone=1&color=3C2A22&bgcolor=FFFFFF&data=${encodeURIComponent(qrTarget)}`;

  async function onPick(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file || busy) return;
    setBusy(true);
    try {
      const rec = await addPhoto(file, { author: "Toi" });
      setItems((prev) => [rec, ...prev]);
    } catch (err) { console.warn(err); }
    setBusy(false);
  }

  return (
    <section className="section" data-screen-label="Mur de photos" style={{ background: "var(--cream-deep)" }}>
      <Reveal><SectionTitle eyebrow="En direct" title="Mur de photos" script sub="On veut vos plus beaux clichés de la soirée !" /></Reveal>

      <Reveal delay={50}>
        <div style={{ background: "#fff", borderRadius: "var(--r-xl)", padding: "26px 22px 24px", border: "1px solid var(--line)", boxShadow: "var(--sh-card)", textAlign: "center", marginBottom: 22 }}>
          <div className="eyebrow" style={{ color: "var(--terracotta)", marginBottom: 12 }}>Ajoute tes photos en direct</div>
          <div style={{ display: "inline-block", padding: 14, borderRadius: "var(--r-lg)", background: "linear-gradient(135deg, var(--cream-deep), #fff)", border: "1px solid var(--line)" }}>
            <img src={qrUrl} alt="QR code pour ajouter des photos" width="190" height="190" style={{ display: "block", borderRadius: 10 }} />
          </div>
          <p style={{ fontFamily: "var(--f-serif)", fontStyle: "italic", fontSize: 16, color: "var(--ink-soft)", margin: "16px auto 4px", maxWidth: 280, lineHeight: 1.5 }}>
            Scanne ce QR code avec ton téléphone pour déposer tes photos. Elles rejoignent le mur ci-dessous instantanément.
          </p>
          <button onClick={() => fileRef.current && fileRef.current.click()} disabled={busy}
            style={{ marginTop: 8, background: "none", border: "none", color: "var(--gold)", fontFamily: "var(--f-sans)", fontSize: 12.5, fontWeight: 600, letterSpacing: "0.04em", textDecoration: "underline", textUnderlineOffset: 3, cursor: "pointer" }}>
            {busy ? "Ajout en cours…" : "Ajouter une photo depuis cet appareil"}
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={onPick} style={{ display: "none" }} />
        </div>
      </Reveal>

      <Reveal delay={110}>
        <div style={{ columnCount: 2, columnGap: 10 }}>
          {items.map((it, i) => (
            <button key={it.id} onClick={() => setLb(it)}
              style={{ display: "block", width: "100%", marginBottom: 10, breakInside: "avoid", border: "none", padding: 0, borderRadius: "var(--r-md)", overflow: "hidden", background: "var(--cream)", boxShadow: "var(--sh-soft)", textAlign: "left" }}>
              <div style={{ position: "relative" }}>
                {it.url
                  ? <img src={it.url} alt={it.label} style={{ width: "100%", display: "block", height: [150, 200, 170, 220][i % 4], objectFit: "cover" }} />
                  : <div className="ph" style={{ height: [150, 200, 170, 220][i % 4] }}>{it.label}</div>}
              </div>
              <div style={{ padding: "8px 10px 10px" }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--terracotta-d)" }}>{it.label}</div>
                <div style={{ fontSize: 11, color: "var(--ink-faint)", marginTop: 2 }}>par {it.author} · {it.tag}</div>
              </div>
            </button>
          ))}
        </div>
        {items.length === 0 && <p style={{ textAlign: "center", color: "var(--ink-faint)", fontStyle: "italic", fontFamily: "var(--f-serif)", padding: 30 }}>Les premières photos arrivent bientôt…</p>}
      </Reveal>

      <Lightbox open={!!lb} onClose={() => setLb(null)} caption={lb ? `${lb.label} · par ${lb.author}` : ""}>
        {lb && (lb.url
          ? <img src={lb.url} alt={lb.label} style={{ width: "100%", borderRadius: "var(--r-md)", maxHeight: "70vh", objectFit: "contain" }} />
          : <div className="ph" style={{ height: 300, borderRadius: "var(--r-md)", background: "var(--cream)" }}>{lb.label}</div>)}
      </Lightbox>
    </section>
  );
}

/* ============ LIVRE D'OR ============ */
export function Guestbook() {
  const [msgs, setMsgs] = useState([]);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ name: "", text: "" });
  const [sending, setSending] = useState(false);

  useEffect(() => { let on = true; fetchGuestbook().then((d) => { if (on) setMsgs(d); }); return () => { on = false; }; }, []);

  async function add(e) {
    e.preventDefault();
    if (!draft.name.trim() || !draft.text.trim() || sending) return;
    setSending(true);
    const item = await addGuestbook(draft);
    setMsgs((m) => [item, ...m]);
    setDraft({ name: "", text: "" });
    setOpen(false);
    setSending(false);
  }

  const rotations = [-1.4, 1.1, -0.8, 1.5, -1.1, 0.9];

  return (
    <section className="section" data-screen-label="Livre d'or" style={{ background: "var(--cream)" }}>
      <Reveal><SectionTitle eyebrow="Vos mots doux" title="Livre d'or" script sub="Messages doux, drôles ou légèrement compromettants bienvenus." /></Reveal>

      <Reveal delay={50}>
        <button className="btn btn-primary" style={{ width: "100%", marginBottom: 18 }} onClick={() => setOpen(true)}>
          <Icon name="quote" size={18} stroke="#fff" /> Laisser un message
        </button>
      </Reveal>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {msgs.map((m, i) => (
          <Reveal key={m.id || i} delay={Math.min(i, 4) * 60}>
            <figure style={{ margin: 0, position: "relative", background: "#fff", borderRadius: "var(--r-lg)", padding: "22px 22px 20px", boxShadow: "var(--sh-card)", border: "1px solid var(--line)", transform: `rotate(${rotations[i % rotations.length]}deg)` }}>
              <span style={{ position: "absolute", top: -10, left: 22, color: "var(--rose-deep)", opacity: 0.6 }}><Icon name="quote" size={26} stroke="var(--rose-deep)" /></span>
              <blockquote style={{ margin: "6px 0 14px", fontFamily: "var(--f-serif)", fontSize: 18, lineHeight: 1.5, color: "var(--ink)", fontStyle: "italic" }}>
                {m.text}
              </blockquote>
              <figcaption style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 34, height: 34, borderRadius: "50%", display: "grid", placeItems: "center", background: "linear-gradient(135deg, var(--rose), var(--coral-soft))", color: "#fff", fontWeight: 600, fontSize: 14, fontFamily: "var(--f-sans)" }}>
                  {m.name.trim().charAt(0).toUpperCase()}
                </span>
                <span>
                  <span style={{ display: "block", fontWeight: 600, fontSize: 14, color: "var(--terracotta-d)" }}>{m.name}</span>
                  <span style={{ display: "block", fontSize: 11, color: "var(--ink-faint)" }}>{m.when}</span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
        {msgs.length === 0 && (
          <div style={{ textAlign: "center", padding: "30px 20px", border: "1.5px dashed var(--line)", borderRadius: "var(--r-lg)" }}>
            <div style={{ color: "var(--rose-deep)", marginBottom: 10, display: "flex", justifyContent: "center" }}><Icon name="quote" size={30} stroke="var(--rose-deep)" /></div>
            <p className="serif" style={{ fontStyle: "italic", fontSize: 17, color: "var(--ink-soft)", margin: 0, lineHeight: 1.5 }}>
              Sois le premier à laisser un petit mot doux 💌
            </p>
          </div>
        )}
      </div>

      {open && (
        <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 210, background: "rgba(40,24,18,0.6)", backdropFilter: "blur(6px)", display: "flex", alignItems: "flex-end", justifyContent: "center", animation: "fadeIn .25s ease" }}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={add}
            style={{ width: "100%", maxWidth: "var(--maxw)", background: "var(--cream)", borderRadius: "var(--r-xl) var(--r-xl) 0 0", padding: "26px 22px 30px", boxShadow: "0 -20px 50px -20px rgba(0,0,0,0.5)", animation: "sheetUp .35s cubic-bezier(.2,.8,.3,1)" }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: "var(--line)", margin: "0 auto 18px" }}></div>
            <h3 className="serif" style={{ fontSize: 24, fontWeight: 600, color: "var(--terracotta-d)", margin: "0 0 16px", textAlign: "center" }}>Un mot pour Aline & Julie</h3>
            <Field label="Ton nom">
              <input className="aj-input" value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} placeholder="Prénom" required />
            </Field>
            <div style={{ height: 14 }}></div>
            <Field label="Ton message">
              <textarea className="aj-input" rows={4} value={draft.text} onChange={(e) => setDraft((d) => ({ ...d, text: e.target.value }))} placeholder="Vœux, souvenir, anecdote…" style={{ resize: "none" }} required />
            </Field>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setOpen(false)}>Annuler</button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1.4, opacity: sending ? 0.7 : 1 }} disabled={sending}><Icon name="heart" size={16} stroke="#fff" /> {sending ? "Envoi…" : "Publier"}</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
