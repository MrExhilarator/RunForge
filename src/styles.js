export const lbl = (V) => ({ display: "block", fontSize: 12, fontWeight: 500, color: V.textSec, marginBottom: 5, fontFamily: "'Satoshi', sans-serif" });

export const inp = (V) => ({ width: "100%", padding: "12px 14px", background: V.white, border: `1.5px solid ${V.border}`, borderRadius: 10, color: V.text, fontSize: 14, fontFamily: "'Satoshi', sans-serif", outline: "none", boxSizing: "border-box", transition: "border 0.2s" });

export const card = (V) => ({ background: V.card, border: `1px solid ${V.border}`, borderRadius: 14, padding: 16 });

export const tag = (c) => ({ display: "inline-block", padding: "3px 10px", background: `${c}12`, color: c, fontSize: 10, fontWeight: 600, borderRadius: 6, fontFamily: "'DM Mono', monospace", letterSpacing: 0.5 });

export const bigBtn = (c) => ({ width: "100%", padding: "15px", background: c, border: "none", color: "#fff", fontSize: 13, fontWeight: 600, borderRadius: 10, cursor: "pointer", fontFamily: "'Satoshi', sans-serif", boxShadow: `0 2px 12px ${c}40`, transition: "all 0.2s" });

export const sBox = (V) => ({ background: V.surface, borderRadius: 10, padding: 14, textAlign: "center" });

export const sVal = (V) => ({ fontSize: 26, fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: V.text, lineHeight: 1 });

export const sLbl = (V) => ({ fontSize: 9, letterSpacing: 2, color: V.dim, marginTop: 6, fontFamily: "'DM Mono', monospace", textTransform: "uppercase" });

export const chip = (active, color, V) => ({ padding: "7px 14px", border: `1.5px solid ${active ? color : V.border}`, borderRadius: 8, fontSize: 11, fontWeight: active ? 600 : 400, cursor: "pointer", fontFamily: "'DM Mono', monospace", whiteSpace: "nowrap", flexShrink: 0, background: active ? `${color}12` : V.white, color: active ? color : V.dim, transition: "all 0.2s" });
