/* Sections de contenu — Hero, Countdown, Infos, Lieu, About, DressCode, Programme */
import { useState, useEffect } from 'react';
import { EVENT, PROGRAMME, DRESSCODE, GALLERIES, INFOS_PRATIQUES } from '../data.js';
import { Rule, SectionTitle, PhotoImg, Icon, Reveal } from './ui.jsx';

/* ============ Compte à rebours ============ */
function calc(iso) {
  const diff = Math.max(0, new Date(iso).getTime() - Date.now());
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { d, h, m, s, done: diff === 0 };
}
function useCountdown(targetISO) {
  const [t, setT] = useState(() => calc(targetISO));
  useEffect(() => {
    const id = setInterval(() => setT(calc(targetISO)), 1000);
    return () => clearInterval(id);
  }, [targetISO]);
  return t;
}
export function Countdown({ targetISO, tone = "light" }) {
  const { d, h, m, s } = useCountdown(targetISO);
  const cells = [
    { v: d, l: "jours" }, { v: h, l: "heures" },
    { v: m, l: "min" }, { v: s, l: "sec" },
  ];
  const dark = tone === "dark";
  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
      {cells.map((c, i) => (
        <div key={i} style={{
          minWidth: 62, padding: "12px 8px 9px", borderRadius: 14,
          background: dark ? "rgba(252,239,226,0.12)" : "rgba(255,255,255,0.66)",
          border: `1px solid ${dark ? "rgba(252,239,226,0.28)" : "var(--line)"}`,
          backdropFilter: "blur(6px)", textAlign: "center",
        }}>
          <div className="serif" style={{ fontSize: 30, fontWeight: 600, lineHeight: 1, color: dark ? "var(--on-dark)" : "var(--terracotta-d)", fontVariantNumeric: "tabular-nums" }}>
            {String(c.v).padStart(2, "0")}
          </div>
          <div style={{ fontSize: 9.5, letterSpacing: "0.18em", textTransform: "uppercase", marginTop: 5, color: dark ? "rgba(252,239,226,0.75)" : "var(--ink-faint)" }}>{c.l}</div>
        </div>
      ))}
    </div>
  );
}

/* ============ HERO — Photo plein écran (direction par défaut) ============ */
export function Hero({ onRSVP }) {
  const E = EVENT;
  return (
    <section data-screen-label="Accueil" style={{ position: "relative", minHeight: "100svh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <PhotoImg id="hero-main" label="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", borderRadius: 0 }} />
      {/* voile chaud pour lisibilité */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(45,22,16,0.46) 0%, rgba(45,22,16,0.12) 32%, rgba(40,20,14,0.55) 66%, rgba(35,17,12,0.92) 100%)" }}></div>

      <div style={{ position: "relative", marginTop: "auto", padding: "54px 24px 104px", textAlign: "center", color: "var(--on-dark)", background: "linear-gradient(180deg, transparent, rgba(30,14,10,0.55) 42%, rgba(30,14,10,0.78))", textShadow: "0 2px 18px rgba(25,12,8,0.6)" }}>
        <div className="hero-anim" style={{ "--i": 0 }}>
          <div className="eyebrow" style={{ color: "var(--gold-soft)" }}>Save the date · 04.09.2026</div>
        </div>
        <h1 className="script hero-anim" style={{ "--i": 1, fontSize: 78, color: "var(--on-dark)", margin: "10px 0 4px", textShadow: "0 4px 30px rgba(40,20,14,0.5)" }}>
          Aline <span style={{ fontSize: 52, color: "var(--gold-soft)" }}>&</span> Julie
        </h1>
        <p className="serif hero-anim" style={{ "--i": 2, fontSize: 21, fontWeight: 500, letterSpacing: "0.04em", margin: "0 0 6px" }}>fêtent leurs 30 ans</p>
        <p className="hero-anim" style={{ "--i": 3, fontFamily: "var(--f-serif)", fontStyle: "italic", fontSize: 16, opacity: 0.92, maxWidth: 300, margin: "0 auto 22px", lineHeight: 1.5 }}>{E.subtitle}</p>
        <div className="hero-anim" style={{ "--i": 4, marginBottom: 24 }}>
          <Countdown targetISO={E.dateISO} tone="dark" />
        </div>
        <div className="hero-anim" style={{ "--i": 5 }}>
          <button className="btn btn-primary" onClick={onRSVP}><Icon name="heart" size={17} /> Je réponds à l'invitation</button>
        </div>
      </div>
    </section>
  );
}

/* ============ INFOS — Quand / Où ============ */
function InfoCard({ icon, kicker, children }) {
  return (
    <div style={{ display: "flex", gap: 16, padding: "22px 20px", background: "#fff", borderRadius: "var(--r-lg)", boxShadow: "var(--sh-soft)", border: "1px solid var(--line)" }}>
      <div style={{ flexShrink: 0, width: 46, height: 46, borderRadius: 14, display: "grid", placeItems: "center", background: "linear-gradient(135deg, var(--rose), var(--coral-soft))", color: "#fff" }}>
        <Icon name={icon} size={22} stroke="#fff" />
      </div>
      <div>
        <div className="eyebrow" style={{ marginBottom: 6 }}>{kicker}</div>
        {children}
      </div>
    </div>
  );
}
export function Infos() {
  const E = EVENT;
  return (
    <section className="section" data-screen-label="Infos pratiques" style={{ background: "var(--cream)" }}>
      <Reveal><SectionTitle eyebrow="L'essentiel" title="Quand & où" script sub="Note bien la date, on ne fait pas ça deux fois !" /></Reveal>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Reveal delay={60}>
          <InfoCard icon="cal" kicker="Quand">
            <div className="serif" style={{ fontSize: 23, fontWeight: 600, color: "var(--terracotta-d)" }}>{E.dateLabel}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 6, color: "var(--ink-soft)" }}>
              <Icon name="clock" size={16} /> <span style={{ fontSize: 15 }}>{E.timeLabel}</span>
            </div>
          </InfoCard>
        </Reveal>
        <Reveal delay={120}>
          <InfoCard icon="pin" kicker="Où">
            <div className="serif" style={{ fontSize: 23, fontWeight: 600, color: "var(--terracotta-d)" }}>{E.venue}</div>
            <div style={{ marginTop: 6, color: "var(--ink-soft)", fontSize: 15 }}>{E.city} · Vallée de Chevreuse</div>
            <button className="btn btn-ghost" style={{ marginTop: 14, padding: "10px 18px", fontSize: 13 }}
              onClick={() => window.open(E.mapsUrl, "_blank")}>
              <Icon name="route" size={15} /> Itinéraire
            </button>
          </InfoCard>
        </Reveal>
      </div>
    </section>
  );
}

/* ============ LIEU — galerie + carte ============ */
function MapVisual() {
  return (
    <div style={{ position: "relative", height: 168, background: "linear-gradient(135deg, #EDE3D2, #E6D7C0)", overflow: "hidden" }}>
      <svg viewBox="0 0 400 168" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0 }}>
        <rect width="400" height="168" fill="#EAE0CE" />
        <path d="M-20 60 Q120 20 200 70 T 420 50" stroke="#D8C6A8" strokeWidth="14" fill="none" opacity="0.6" />
        <path d="M-20 120 Q150 90 260 130 T 430 110" stroke="#D8C6A8" strokeWidth="10" fill="none" opacity="0.5" />
        <path d="M60 -10 L120 180" stroke="#CDB799" strokeWidth="6" fill="none" opacity="0.5" />
        <path d="M300 -10 L250 180" stroke="#CDB799" strokeWidth="6" fill="none" opacity="0.5" />
        <circle cx="200" cy="84" r="60" fill="#B5543A" opacity="0.08" />
        <circle cx="320" cy="40" r="26" fill="#7FA06A" opacity="0.25" />
        <circle cx="70" cy="135" r="20" fill="#7FA06A" opacity="0.25" />
      </svg>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-100%)", textAlign: "center" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50% 50% 50% 4px", background: "linear-gradient(135deg, var(--coral), var(--terracotta))", transform: "rotate(45deg)", boxShadow: "0 8px 18px -6px rgba(140,62,41,0.7)", display: "grid", placeItems: "center" }}>
          <span style={{ transform: "rotate(-45deg)", color: "#fff" }}><Icon name="heart" size={18} stroke="#fff" /></span>
        </div>
      </div>
    </div>
  );
}
export function Lieu() {
  const E = EVENT;
  const photos = GALLERIES.lieu;
  return (
    <section className="section" data-screen-label="Le lieu" style={{ background: "var(--cream-deep)" }}>
      <Reveal><SectionTitle eyebrow="Le décor" title="Le domaine" script sub="Un lieu canon à 45 min de Paris, parfait pour y faire la fiesta toute la noche !" /></Reveal>

      <Reveal delay={60}>
        <div style={{ display: "grid", gap: 10, marginBottom: 16 }}>
          <PhotoImg id={photos[0].slot} label={photos[0].label} style={{ width: "100%", height: 230, borderRadius: "var(--r-lg)" }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <PhotoImg id={photos[1].slot} label={photos[1].label} style={{ width: "100%", height: 150, borderRadius: "var(--r-md)" }} />
            <PhotoImg id={photos[2].slot} label={photos[2].label} style={{ width: "100%", height: 150, borderRadius: "var(--r-md)" }} />
          </div>
        </div>
      </Reveal>

      <Reveal delay={120}>
        <div style={{ borderRadius: "var(--r-lg)", overflow: "hidden", boxShadow: "var(--sh-soft)", border: "1px solid var(--line)", background: "#fff" }}>
          <MapVisual />
          <div style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div className="serif" style={{ fontSize: 18, fontWeight: 600, color: "var(--terracotta-d)" }}>{E.venue}</div>
              <div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 2 }}>{E.address}</div>
            </div>
            <button className="btn btn-primary" style={{ padding: "12px 18px", fontSize: 13, flexShrink: 0 }} onClick={() => window.open(E.mapsUrl, "_blank")}>
              <Icon name="route" size={15} stroke="#fff" /> Y aller
            </button>
          </div>
        </div>
      </Reveal>

      <Reveal delay={160}>
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          {INFOS_PRATIQUES.map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "18px 18px", background: "rgba(255,255,255,0.7)", borderRadius: "var(--r-md)", border: "1px solid var(--line)" }}>
              <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 12, display: "grid", placeItems: "center", background: "linear-gradient(135deg, var(--rose), var(--coral-soft))", color: "#fff" }}>
                <Icon name={p.icon || "pin"} size={20} stroke="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <div className="eyebrow" style={{ color: "var(--terracotta)", marginBottom: 5 }}>{p.title}</div>
                <div style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.5 }}>{p.text}</div>
                {p.link && (
                  <button className="btn btn-ghost" style={{ marginTop: 12, padding: "9px 16px", fontSize: 13 }} onClick={() => window.open(p.link.url, "_blank")}>
                    <Icon name="pin" size={15} /> {p.link.label}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ============ ALINE & JULIE — scrapbook ============ */
export function About() {
  const duo = GALLERIES.duo;
  const confetti = [["8%", "6%", "var(--fuchsia)", 10], ["88%", "10%", "var(--apricot)", 8], ["12%", "60%", "var(--coral)", 9], ["90%", "68%", "var(--rose-deep)", 11], ["50%", "94%", "var(--gold-soft)", 8]];
  return (
    <section className="section" data-screen-label="Aline & Julie" style={{ background: "linear-gradient(180deg, var(--cream) 0%, var(--cream-deep) 100%)", position: "relative", overflow: "hidden" }}>
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.5 }}>
        {confetti.map((c, i) => (
          <span key={i} style={{ position: "absolute", left: c[0], top: c[1], width: c[3], height: c[3], borderRadius: i % 2 ? "50%" : 2, background: c[2], transform: `rotate(${i * 35}deg)` }}></span>
        ))}
      </div>

      <Reveal><SectionTitle eyebrow="Les Queens du jour" title="Aline & Julie" script sub="30 ans d'amitié, pas de mode d'emploi, mais beaucoup de vécu !" /></Reveal>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 8 }}>
        {duo.slice(0, 5).map((p, i) => {
          const rot = [-3, 2.5, -2, 3, -2.5][i % 5];
          const tape = ["var(--fuchsia)", "var(--apricot)", "var(--coral)", "var(--rose-deep)", "var(--gold)"][i % 5];
          const big = i === 0;
          return (
            <Reveal key={p.slot} delay={i * 70} style={big ? { gridColumn: "1 / -1" } : undefined}>
              <figure style={{ margin: 0, background: "#fff", padding: "10px 10px 16px", borderRadius: 6, boxShadow: "var(--sh-card)", transform: `rotate(${rot}deg)`, position: "relative", transition: "transform .3s" }}>
                <span style={{ position: "absolute", top: -9, left: "50%", transform: "translateX(-50%) rotate(-4deg)", width: 56, height: 18, background: tape, opacity: 0.85, borderRadius: 2, boxShadow: "0 2px 4px -2px rgba(0,0,0,0.3)", zIndex: 1 }}></span>
                <PhotoImg id={p.slot} label={p.label} objectPosition={big ? "center top" : "center"} style={{ width: "100%", height: big ? 240 : 150, borderRadius: 3 }} />
              </figure>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ============ DRESS CODE — moodboard ============ */
export function DressCode() {
  const dc = DRESSCODE;
  return (
    <section className="section" data-screen-label="Dress code" style={{ background: "linear-gradient(165deg, #C9197D 0%, #EC5B2E 48%, #F07F23 72%, #FBDC3F 100%)", color: "var(--on-dark)" }}>
      <Reveal>
        <header style={{ textAlign: "center", marginBottom: 26 }}>
          <div className="eyebrow" style={{ color: "#FBDC3F" }}>Dress code</div>
          <h2 className="script" style={{ fontSize: 60, color: "var(--on-dark)", margin: "8px 0 6px", textShadow: "0 2px 18px rgba(120,10,70,0.35)" }}>Sunset Gala</h2>
          <p className="serif" style={{ fontStyle: "italic", fontSize: 18, opacity: 0.96, margin: 0 }}>Chic, coloré, et légèrement trop stylé pour être raisonnable.</p>
        </header>
      </Reveal>

      <Reveal delay={50}>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 24, flexWrap: "wrap" }}>
          {dc.palette.map((c, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 8, padding: 4, boxShadow: "0 6px 16px -8px rgba(80,10,50,0.5)", width: 60 }}>
              <div style={{ height: 58, borderRadius: 5, background: c.hex }}></div>
              <div style={{ fontSize: 8, fontWeight: 700, color: "#3C2A22", margin: "5px 3px 0", letterSpacing: "0.02em", lineHeight: 1.2 }}>PANTONE&reg;</div>
              <div style={{ fontSize: 7.5, color: "#755F54", margin: "1px 3px 4px", lineHeight: 1.2 }}>{c.name}</div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={90}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {dc.cards.map((c, i) => (
            <div key={i} style={{ borderRadius: "var(--r-md)", overflow: "hidden", background: "rgba(252,239,226,0.1)", border: "1px solid rgba(252,239,226,0.22)" }}>
              <PhotoImg id={c.slot} label={c.label} style={{ width: "100%", height: 220, borderRadius: 0 }} />
              <div style={{ padding: "10px 12px 12px" }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{c.label}</div>
                <div style={{ fontSize: 11, opacity: 0.78, marginTop: 3, lineHeight: 1.4 }}>{c.hint}</div>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={120}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 22 }}>
          <div style={{ background: "rgba(255,255,255,0.16)", borderRadius: "var(--r-md)", padding: "16px 16px" }}>
            <div className="eyebrow" style={{ color: "#FBDC3F", marginBottom: 10 }}>On veut</div>
            {dc.do.map((x, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, marginBottom: 8, lineHeight: 1.35 }}>
                <span style={{ color: "#FBDC3F", marginTop: 1 }}><Icon name="check" size={15} stroke="#FBDC3F" /></span>{x}
              </div>
            ))}
          </div>
          <div style={{ background: "rgba(90,10,52,0.32)", borderRadius: "var(--r-md)", padding: "16px 16px" }}>
            <div className="eyebrow" style={{ color: "#E8A6D6", marginBottom: 10 }}>On évite</div>
            {dc.avoid.map((x, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, marginBottom: 8, lineHeight: 1.35, opacity: 0.92 }}>
                <span style={{ color: "#E8A6D6", marginTop: 1 }}>✕</span>{x}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ============ PROGRAMME ============ */
export function Programme() {
  const prog = PROGRAMME;
  const [going, setGoing] = useState(() => {
    try { return JSON.parse(localStorage.getItem("aj_participe") || "false"); } catch { return false; }
  });
  function sendRcs() {
    const E = EVENT;
    let nom = "";
    try { const r = JSON.parse(localStorage.getItem("aj_rsvp_done") || "null"); if (r && r.name) nom = r.name; } catch {}
    const body = `Coucou ${E.names} ! ${nom ? nom + " — " : ""}je veux participer aux animations / discours de la soirée des 30 ans 🎉 Comptez sur moi !`;
    const num = (E.organisersPhone || "").replace(/\s+/g, "");
    const href = `sms:${num}?&body=${encodeURIComponent(body)}`;
    try { window.location.href = href; } catch {}
  }
  function toggle() {
    setGoing((g) => {
      const n = !g;
      try { localStorage.setItem("aj_participe", JSON.stringify(n)); } catch {}
      if (n) sendRcs();
      return n;
    });
  }
  return (
    <section className="section" data-screen-label="Programme" style={{ background: "var(--cream)" }}>
      <Reveal><SectionTitle eyebrow="Le déroulé" title="Le programme" script sub="De l'apéro au dancefloor — voici le plan de bataille 🍾" /></Reveal>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {prog.map((p, i) => (
          <Reveal key={i} delay={i * 60}>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "16px 18px", background: "#fff", borderRadius: "var(--r-lg)", boxShadow: "var(--sh-soft)", border: "1px solid var(--line)" }}>
              <div style={{ flexShrink: 0, width: 50, height: 50, borderRadius: 16, display: "grid", placeItems: "center", background: "var(--cream-deep)", color: "var(--terracotta)" }}>
                <Icon name={p.icon} size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <span className="serif" style={{ fontSize: 22, fontWeight: 600, color: "var(--terracotta-d)" }}>{p.time}</span>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>{p.title}</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: "3px 0 0", lineHeight: 1.4 }}>{p.desc}</p>
                {p.cta && (
                  <>
                    <button className={going ? "btn" : "btn btn-primary"} onClick={toggle}
                      style={going
                        ? { marginTop: 12, padding: "9px 16px", fontSize: 13, background: "var(--cream-deep)", color: "var(--terracotta-d)", border: "1.5px solid var(--coral)" }
                        : { marginTop: 12, padding: "9px 18px", fontSize: 13 }}>
                      {going ? <><Icon name="check" size={15} stroke="var(--terracotta-d)" /> Je participe !</> : <><Icon name="heart" size={15} stroke="#fff" /> {p.cta}</>}
                    </button>
                    <p style={{ fontSize: 11.5, color: "var(--ink-faint)", margin: "8px 0 0", lineHeight: 1.4 }}>
                      {going ? "Message envoyé à Aline & Julie ✦ (réappuie pour annuler)" : "Un message sera préparé pour prévenir Aline & Julie."}
                    </p>
                  </>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
