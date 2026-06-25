/* Composants UI partagés */
import { useEffect, useRef, useState } from 'react';
import { PHOTOS } from '../data.js';

/* ---- Filet décoratif ---- */
export function Rule() {
  return (
    <div className="rule" aria-hidden="true">
      <span className="diamond"></span>
    </div>
  );
}

/* ---- Titre de section ---- */
export function SectionTitle({ eyebrow, title, script, sub, align = "center" }) {
  return (
    <header style={{ textAlign: align, marginBottom: 30 }}>
      {eyebrow && <div className="eyebrow" style={{ marginBottom: 14 }}>{eyebrow}</div>}
      {script
        ? <h2 className="script" style={{ fontSize: 52, margin: "0 0 8px" }}>{title}</h2>
        : <h2 className="serif" style={{ fontSize: 34, fontWeight: 600, letterSpacing: "0.01em", margin: "0 0 10px", lineHeight: 1.1 }}>{title}</h2>}
      <Rule />
      {sub && <p style={{ fontFamily: "var(--f-serif)", fontSize: 18, color: "var(--ink-soft)", margin: "16px auto 0", maxWidth: 340, lineHeight: 1.5, fontStyle: "italic" }}>{sub}</p>}
    </header>
  );
}

/* ---- Photo : vraie image avec repli élégant "Photo à venir" ----
   Déposez l'image correspondante dans public/photos/ (voir data.js → PHOTOS). */
export function PhotoImg({ id, label, src, radius, style, className, objectPosition }) {
  const [failed, setFailed] = useState(false);
  const url = src || PHOTOS[id];
  const showImg = url && !failed;
  const r = radius != null ? (typeof radius === "number" ? radius : radius) : undefined;
  return (
    <div
      className={className}
      style={{ overflow: "hidden", background: "var(--cream-deep)", position: "relative", ...(r != null ? { borderRadius: r } : null), ...style }}
    >
      {showImg ? (
        <img
          src={url}
          alt={label || ""}
          onError={() => setFailed(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: objectPosition || "center", display: "block" }}
        />
      ) : (
        <div style={{
          width: "100%", height: "100%", minHeight: 80, display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--ink-faint)", fontFamily: "var(--f-serif)", fontStyle: "italic", fontSize: 13, textAlign: "center", padding: 12,
          background: "repeating-linear-gradient(135deg, rgba(181,84,58,0.06) 0 10px, rgba(181,84,58,0) 10px 20px), var(--cream-deep)",
        }}>
          {label || "Photo à venir"}
        </div>
      )}
    </div>
  );
}

/* ---- Lightbox simple ---- */
export function Lightbox({ open, onClose, children, caption }) {
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(40,24,18,0.78)", backdropFilter: "blur(6px)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: 24, animation: "fadeIn .25s ease",
      }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 380 }}>
        {children}
        {caption && <p style={{ color: "var(--on-dark)", textAlign: "center", fontFamily: "var(--f-serif)", fontStyle: "italic", marginTop: 16, fontSize: 17 }}>{caption}</p>}
      </div>
      <button className="btn btn-ghost" onClick={onClose} style={{ marginTop: 22, color: "var(--on-dark)", borderColor: "rgba(252,239,226,0.4)" }}>Fermer</button>
    </div>
  );
}

/* ---- Reveal au scroll ---- */
export function Reveal({ children, delay = 0, as = "div", className = "", style }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let done = false;
    const show = () => { if (!done) { done = true; el.classList.add("in"); } };

    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
      requestAnimationFrame(show);
    }

    let io;
    try {
      io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) show(); });
      }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
      io.observe(el);
    } catch { /* ignore */ }

    const onScroll = () => {
      const b = el.getBoundingClientRect();
      if (b.top < window.innerHeight * 0.92) show();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const fallback = setTimeout(() => { onScroll(); }, 1200);

    return () => { io && io.disconnect(); window.removeEventListener("scroll", onScroll); clearTimeout(fallback); };
  }, []);
  const Tag = as;
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms`, ...style }}>
      {children}
    </Tag>
  );
}

/* ---- Icônes (traits simples) ---- */
export function Icon({ name, size = 22, stroke = "currentColor" }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke, strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "arrive": return <svg {...common}><path d="M4 20h16M7 20V8l5-3 5 3v12M10 13h4" /></svg>;
    case "glass": return <svg {...common}><path d="M7 4h10l-1.5 7a3.5 3.5 0 0 1-7 0L7 4ZM12 18v2M9 22h6" /></svg>;
    case "plate": return <svg {...common}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3.5" /></svg>;
    case "cake": return <svg {...common}><path d="M4 21h16M5 21v-6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6M12 9V6M9 6h6" /></svg>;
    case "note": return <svg {...common}><path d="M9 18V5l10-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="16" cy="16" r="3" /></svg>;
    case "pin": return <svg {...common}><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" /><circle cx="12" cy="9" r="2.5" /></svg>;
    case "cal": return <svg {...common}><rect x="4" y="5" width="16" height="16" rx="2" /><path d="M4 9h16M8 3v4M16 3v4" /></svg>;
    case "clock": return <svg {...common}><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></svg>;
    case "route": return <svg {...common}><circle cx="6" cy="19" r="2" /><circle cx="18" cy="5" r="2" /><path d="M8 19h6a3 3 0 0 0 0-6H10a3 3 0 0 1 0-6h6" /></svg>;
    case "heart": return <svg {...common}><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z" /></svg>;
    case "camera": return <svg {...common}><path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" /><circle cx="12" cy="13" r="3.5" /></svg>;
    case "search": return <svg {...common}><circle cx="11" cy="11" r="6" /><path d="m20 20-3.5-3.5" /></svg>;
    case "plus": return <svg {...common}><path d="M12 5v14M5 12h14" /></svg>;
    case "check": return <svg {...common}><path d="M5 12.5 10 17l9-10" /></svg>;
    case "menu": return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
    case "quote": return <svg {...common} strokeWidth="1.2"><path d="M9 8H6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2v-2M20 8h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2v-2" /></svg>;
    default: return null;
  }
}
