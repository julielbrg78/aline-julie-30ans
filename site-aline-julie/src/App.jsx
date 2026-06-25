/* App — assemblage, navigation, pied de page */
import { useState, useEffect } from 'react';
import { EVENT } from './data.js';
import { Icon } from './components/ui.jsx';
import { Hero, Infos, Lieu, About, DressCode, Programme } from './components/content.jsx';
import { Rsvp, PhotoWall, Guestbook } from './components/interactive.jsx';

const NAV = [
  { id: "s-accueil", label: "Accueil", icon: "heart" },
  { id: "s-lieu", label: "Lieu", icon: "pin" },
  { id: "s-prog", label: "Programme", icon: "clock" },
  { id: "s-rsvp", label: "RSVP", icon: "check" },
  { id: "s-photos", label: "Photos", icon: "camera" },
];

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 4;
  window.scrollTo({ top, behavior: "smooth" });
}

function Footer({ E }) {
  return (
    <footer style={{ background: "var(--terracotta-d)", color: "var(--on-dark)", textAlign: "center", padding: "54px 24px 96px" }}>
      <div className="script" style={{ fontSize: 56, color: "var(--on-dark)", lineHeight: 0.9 }}>Aline &amp; Julie</div>
      <div className="rule" style={{ color: "var(--gold-soft)", margin: "16px 0" }}><span className="diamond" style={{ background: "var(--gold-soft)" }}></span></div>
      <p className="serif" style={{ fontStyle: "italic", fontSize: 18, opacity: 0.9, margin: "0 0 4px" }}>{E.dateLabel}</p>
      <p style={{ fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.7, margin: 0 }}>{E.venue} · {E.city}</p>
      <button className="btn" style={{ marginTop: 22, background: "var(--on-dark)", color: "var(--terracotta-d)", padding: "13px 26px", fontWeight: 600 }} onClick={() => scrollToId("s-rsvp")}>
        <Icon name="heart" size={16} stroke="var(--terracotta-d)" /> Confirmer ma présence
      </button>
      <p style={{ marginTop: 30, fontSize: 11, opacity: 0.45 }}>Fait avec ❤️ pour nos 30 ans</p>
    </footer>
  );
}

export default function App() {
  const [active, setActive] = useState("s-accueil");
  const [showBar, setShowBar] = useState(false);

  /* filet de sécurité : garantit l'affichage du hero même si l'animation d'entrée ne tourne pas */
  useEffect(() => {
    document.body.classList.remove("hero-ready");
    const id = setTimeout(() => document.body.classList.add("hero-ready"), 1700);
    return () => clearTimeout(id);
  }, []);

  /* nav active + barre haute au scroll */
  useEffect(() => {
    const ids = NAV.map((n) => n.id);
    function onScroll() {
      setShowBar(window.scrollY > window.innerHeight * 0.7);
      let cur = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) cur = id;
      }
      setActive(cur);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const E = EVENT;

  return (
    <div className="app-shell">
      <div style={{
        position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", zIndex: 90,
        width: "100%", maxWidth: "var(--maxw)",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        padding: "12px 18px", background: "rgba(251,245,236,0.86)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--line)",
        transition: "opacity .35s, transform .35s",
        opacity: showBar ? 1 : 0, pointerEvents: showBar ? "auto" : "none",
        transformOrigin: "top",
      }}>
        <span className="script" style={{ fontSize: 30, color: "var(--terracotta)" }}>Aline &amp; Julie</span>
        <span style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--gold)", marginLeft: 6 }}>· 30 ans</span>
      </div>

      <main>
        <div id="s-accueil"><Hero onRSVP={() => scrollToId("s-rsvp")} /></div>
        <div id="s-infos"><Infos /></div>
        <div id="s-lieu"><Lieu /></div>
        <div id="s-duo"><About /></div>
        <div id="s-dress"><DressCode /></div>
        <div id="s-prog"><Programme /></div>
        <div id="s-rsvp"><Rsvp /></div>
        <div id="s-photos"><PhotoWall /></div>
        <div id="s-livre"><Guestbook /></div>
        <Footer E={E} />
      </main>

      <nav style={{
        position: "fixed", bottom: 14, left: "50%", transform: "translateX(-50%)", zIndex: 95,
        display: "flex", gap: 2, padding: 6,
        background: "rgba(60,30,22,0.86)", backdropFilter: "blur(14px)", borderRadius: 999,
        boxShadow: "0 14px 38px -10px rgba(60,30,22,0.6)", border: "1px solid rgba(252,239,226,0.12)",
      }}>
        {NAV.map((n) => {
          const on = active === n.id;
          return (
            <button key={n.id} onClick={() => scrollToId(n.id)} aria-label={n.label}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                padding: "8px 12px", borderRadius: 999, border: "none",
                background: on ? "linear-gradient(135deg, var(--coral), var(--terracotta))" : "transparent",
                color: on ? "#fff" : "rgba(252,239,226,0.62)", transition: "all .25s",
              }}>
              <Icon name={n.icon} size={19} stroke="currentColor" />
              <span style={{ fontSize: 9, letterSpacing: "0.04em", fontWeight: 600 }}>{n.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
