import { useState, useEffect, useRef } from "react";
import { useTheme } from "../theme";

export default function LandingPage({ onLogin, onSignUp, dark, toggleDark }) {
  const V = useTheme();
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const sectionRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY || 0);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setVisibleSections((p) => new Set([...p, e.target.dataset.section]));
      });
    }, { threshold: 0.15 });
    sectionRefs.current.forEach((r) => r && obs.observe(r));
    return () => obs.disconnect();
  }, []);

  const isVisible = (id) => visibleSections.has(id);

  const features = [
    { icon: "📋", title: "Smart Training Plans", desc: "Choose from proven presets for 5K, 10K, Half Marathon, and Marathon — or build your own week-by-week plan from scratch." },
    { icon: "📡", title: "Live GPS Tracking", desc: "Real-time distance, pace, and speed powered by your phone's GPS. Watch your progress against today's workout target." },
    { icon: "📊", title: "Run History & Stats", desc: "Every run logged with splits, pace, and duration. Track your improvement over weeks and months of training." },
    { icon: "🔗", title: "Strava Integration", desc: "Connect your Strava account to auto-sync runs, or export GPX files for manual upload. Your miles, everywhere." },
  ];

  const stats = [
    { num: "4", label: "Race Plans", sub: "5K to Marathon" },
    { num: "∞", label: "Custom Plans", sub: "Build your own" },
    { num: "0", label: "Cost", sub: "Free forever" },
  ];

  return (
    <div style={{ background: V.white, color: V.text, fontFamily: "'Satoshi', 'General Sans', sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        @import url('https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&f[]=general-sans@400,500,600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
        @keyframes slideRight { from{opacity:0;transform:translateX(-30px)} to{opacity:1;transform:translateX(0)} }
        @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .vis { opacity: 1 !important; transform: translateY(0) !important; }
        .section-anim { opacity: 0; transform: translateY(40px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .gradient-text {
          background: linear-gradient(135deg, ${V.v500}, ${V.v700}, ${V.v500});
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
        }
        .landing-nav { padding: 16px 24px; }
        .landing-nav-buttons { gap: 8px; }
        .landing-nav-login { padding: 8px 16px; font-size: 13px; }
        .landing-nav-signup { padding: 8px 16px; font-size: 12px; white-space: nowrap; }
        .landing-stats-row { gap: 48px; }
        .landing-features-grid { grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
        @media (max-width: 600px) {
          .landing-nav { padding: 12px 16px; }
          .landing-nav-buttons { gap: 6px; }
          .landing-nav-logo-text { display: none; }
          .landing-nav-login { padding: 8px 12px; font-size: 12px; }
          .landing-nav-signup { padding: 8px 12px; font-size: 11px; }
          .landing-nav-dark { width: 32px !important; height: 32px !important; font-size: 14px !important; }
          .landing-stats-row { gap: 24px; }
          .landing-features-grid { grid-template-columns: 1fr; }
          .landing-hero-buttons { flex-direction: column; align-items: center; }
          .landing-hero-buttons button { width: 100%; max-width: 320px; }
          .landing-phone-mock { width: 240px !important; height: 440px !important; }
          .landing-cta-box { padding: 40px 20px !important; }
        }
        @media (max-width: 400px) {
          .landing-nav-login { display: none; }
          .landing-nav-signup { padding: 8px 14px; font-size: 11px; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav className="landing-nav" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: scrollY > 50 ? V.navScrollBg : "transparent",
        backdropFilter: scrollY > 50 ? "blur(20px)" : "none",
        borderBottom: scrollY > 50 ? `1px solid ${V.border}` : "1px solid transparent",
        transition: "all 0.3s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div style={{ width: 32, height: 32, background: `linear-gradient(135deg, ${V.v500}, ${V.v700})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 900, fontFamily: "'Outfit', sans-serif", flexShrink: 0 }}>R</div>
          <span className="landing-nav-logo-text" style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.5, fontFamily: "'Outfit', sans-serif", color: V.text }}>RunForge</span>
        </div>
        <div className="landing-nav-buttons" style={{ display: "flex", alignItems: "center" }}>
          <button className="landing-nav-dark" onClick={toggleDark} aria-label="Toggle dark mode" style={{
            width:36,height:36,borderRadius:8,border:`1px solid ${V.border}`,background:scrollY>50?V.surface:"transparent",
            display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:16,transition:"all 0.3s",color:V.dim,flexShrink:0,
          }}
            onMouseOver={e=>{e.currentTarget.style.background=V.v50;e.currentTarget.style.borderColor=V.v300}}
            onMouseOut={e=>{e.currentTarget.style.background=scrollY>50?V.surface:"transparent";e.currentTarget.style.borderColor=V.border}}>
            {dark ? "☀️" : "🌙"}
          </button>
          <button className="landing-nav-login" onClick={onLogin} style={{ background: "transparent", border: `1.5px solid ${V.v300}`, color: V.v700, fontWeight: 600, borderRadius: 8, cursor: "pointer", fontFamily: "'Satoshi', sans-serif", transition: "all 0.2s", whiteSpace: "nowrap" }}
            onMouseOver={e=>{e.target.style.borderColor=V.v500;e.target.style.background=V.v50}} onMouseOut={e=>{e.target.style.borderColor=V.v300;e.target.style.background="transparent"}}>
            Log in
          </button>
          <button className="landing-nav-signup" onClick={onSignUp} style={{ background: V.v600, border: "none", color: "#fff", fontWeight: 600, borderRadius: 8, cursor: "pointer", fontFamily: "'Satoshi', sans-serif", transition: "all 0.2s", boxShadow: `0 2px 12px ${V.v500}40` }}
            onMouseOver={e=>e.target.style.background=V.v700} onMouseOut={e=>e.target.style.background=V.v600}>
            Get Started
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "120px 24px 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 600, height: 600, background: `radial-gradient(circle, ${V.v200}60, transparent 70%)`, top: -100, right: -200, borderRadius: "50%", animation: "float 8s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: 400, height: 400, background: `radial-gradient(circle, ${V.v100}80, transparent 70%)`, bottom: -50, left: -100, borderRadius: "50%", animation: "float 6s ease-in-out infinite 1s" }} />
        <div style={{ position: "absolute", width: 200, height: 200, background: `radial-gradient(circle, ${V.v300}40, transparent 70%)`, top: "40%", left: "20%", borderRadius: "50%", animation: "float 10s ease-in-out infinite 2s" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 800 }}>
          <h1 style={{ fontSize: "clamp(40px, 7vw, 76px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: -2, fontFamily: "'Outfit', sans-serif", color: V.text, animation: "fadeUp 0.8s ease-out 0.1s both" }}>
            Train smarter.<br />
            <span className="gradient-text">Run stronger.</span>
          </h1>

          <p style={{ fontSize: "clamp(16px, 2.2vw, 20px)", color: V.textSec, lineHeight: 1.7, marginTop: 24, maxWidth: 560, marginLeft: "auto", marginRight: "auto", fontWeight: 400, animation: "fadeUp 0.8s ease-out 0.2s both" }}>
            Your free running companion with GPS tracking, structured training plans, and Strava sync. No subscriptions, no paywalls.
          </p>

          <div className="landing-hero-buttons" style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 36, animation: "fadeUp 0.8s ease-out 0.3s both", flexWrap: "wrap" }}>
            <button onClick={onSignUp} style={{
              padding: "16px 36px", background: V.v600, border: "none", color: "#fff", fontSize: 15, fontWeight: 600, borderRadius: 12, cursor: "pointer", fontFamily: "'Satoshi', sans-serif",
              boxShadow: `0 4px 24px ${V.v500}50, 0 1px 3px rgba(0,0,0,0.1)`, transition: "all 0.3s",
            }} onMouseOver={e=>{e.target.style.transform="translateY(-2px)";e.target.style.boxShadow=`0 8px 32px ${V.v500}60`}} onMouseOut={e=>{e.target.style.transform="translateY(0)";e.target.style.boxShadow=`0 4px 24px ${V.v500}50`}}>
              Start Training — It's Free
            </button>
            <button onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })} style={{
              padding: "16px 36px", background: V.white, border: `1.5px solid ${V.border}`, color: V.textSec, fontSize: 15, fontWeight: 500, borderRadius: 12, cursor: "pointer", fontFamily: "'Satoshi', sans-serif", transition: "all 0.2s",
            }} onMouseOver={e=>e.target.style.borderColor=V.v300} onMouseOut={e=>e.target.style.borderColor=V.border}>
              See How It Works ↓
            </button>
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 1, marginTop: 64, animation: "fadeUp 1s ease-out 0.5s both" }}>
          <div className="landing-phone-mock" style={{ width: 280, height: 520, background: V.card, borderRadius: 32, border: `1px solid ${V.border}`, boxShadow: `0 20px 60px rgba(91,33,182,0.12), 0 4px 20px rgba(0,0,0,0.06)`, overflow: "hidden", position: "relative" }}>
            <div style={{ height: 44, background: V.surface, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: `1px solid ${V.border}` }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: V.v600, fontFamily: "'DM Mono', monospace", letterSpacing: 3 }}>⬡ RUNFORGE</span>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ textAlign: "center", padding: "20px 0 16px" }}>
                <div style={{ fontSize: 48, fontWeight: 900, color: V.v600, fontFamily: "'Outfit', sans-serif", lineHeight: 1 }}>5.24</div>
                <div style={{ fontSize: 9, letterSpacing: 3, color: V.dim, marginTop: 4, fontFamily: "'DM Mono', monospace" }}>KILOMETERS</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[["23:41","TIME"],["4:31","PACE"],["12.8","KM/H"],["142","BPM"]].map(([v,l])=>(
                  <div key={l} style={{ background: V.surface, borderRadius: 10, padding: 12, textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: V.text, fontFamily: "'Outfit', sans-serif" }}>{v}</div>
                    <div style={{ fontSize: 7, letterSpacing: 2, color: V.dim, marginTop: 2, fontFamily: "'DM Mono', monospace" }}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, background: V.surface, borderRadius: 10, padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 8, letterSpacing: 2, color: V.dim, fontFamily: "'DM Mono', monospace" }}>WORKOUT PROGRESS</span>
                  <span style={{ fontSize: 9, fontWeight: 600, color: V.v600, fontFamily: "'DM Mono', monospace" }}>87%</span>
                </div>
                <div style={{ height: 4, background: V.v100, borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: "87%", height: "100%", background: `linear-gradient(90deg, ${V.v500}, ${V.v400})`, borderRadius: 2 }} />
                </div>
              </div>
              <div style={{ marginTop: 12, background: `linear-gradient(135deg, ${V.v600}, ${V.v700})`, borderRadius: 10, padding: 14, textAlign: "center" }}>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 7, letterSpacing: 3, fontFamily: "'DM Mono', monospace", marginBottom: 2 }}>TODAY'S WORKOUT</div>
                <div style={{ color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>Tempo Run · 7 km</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{ borderTop: `1px solid ${V.border}`, borderBottom: `1px solid ${V.border}`, padding: "14px 0", overflow: "hidden", background: V.bg }}>
        <div style={{ display: "flex", animation: "marquee 20s linear infinite", whiteSpace: "nowrap" }}>
          {[...Array(2)].map((_, i) => (
            <div key={i} style={{ display: "flex", gap: 48, paddingRight: 48 }}>
              {["GPS TRACKING", "TRAINING PLANS", "STRAVA SYNC", "GPX EXPORT", "PACE ANALYTICS", "FREE FOREVER"].map((t) => (
                <span key={t+i} style={{ fontSize: 11, letterSpacing: 4, color: V.dim, fontFamily: "'DM Mono', monospace", fontWeight: 400 }}>◆ {t}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <section ref={el => sectionRefs.current[0] = el} data-section="stats"
        className={`section-anim ${isVisible("stats") ? "vis" : ""}`}
        style={{ padding: "80px 24px", background: V.bg }}>
        <div className="landing-stats-row" style={{ maxWidth: 800, margin: "0 auto", display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: "center", minWidth: 160, transition: `all 0.6s ease ${i * 0.15}s` }}>
              <div className="gradient-text" style={{ fontSize: 56, fontWeight: 900, fontFamily: "'Outfit', sans-serif", lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: V.text, marginTop: 8, fontFamily: "'Satoshi', sans-serif" }}>{s.label}</div>
              <div style={{ fontSize: 12, color: V.dim, marginTop: 2, fontFamily: "'Satoshi', sans-serif" }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" ref={el => sectionRefs.current[1] = el} data-section="features"
        className={`section-anim ${isVisible("features") ? "vis" : ""}`}
        style={{ padding: "80px 24px 100px", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontSize: 11, letterSpacing: 4, color: V.v500, fontFamily: "'DM Mono', monospace", marginBottom: 12 }}>FEATURES</div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: V.text, letterSpacing: -1 }}>Everything you need to train</h2>
          <p style={{ color: V.textSec, fontSize: 16, marginTop: 12, fontFamily: "'Satoshi', sans-serif", maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>No bloat. No premium tiers. Just the tools runners actually use.</p>
        </div>
        <div className="landing-features-grid" style={{ display: "grid", gap: 16 }}>
          {features.map((f, i) => (
            <div key={i} style={{
              background: V.card, border: `1px solid ${V.border}`, borderRadius: 16, padding: 28,
              transition: `all 0.6s ease ${i * 0.1}s`, cursor: "default",
            }}
              onMouseOver={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=`0 12px 40px ${V.v500}12`}}
              onMouseOut={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, fontFamily: "'Outfit', sans-serif", color: V.text, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: V.textSec, lineHeight: 1.7, fontFamily: "'Satoshi', sans-serif" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section ref={el => sectionRefs.current[2] = el} data-section="how"
        className={`section-anim ${isVisible("how") ? "vis" : ""}`}
        style={{ padding: "80px 24px 100px", background: V.bg }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 11, letterSpacing: 4, color: V.v500, fontFamily: "'DM Mono', monospace", marginBottom: 12 }}>HOW IT WORKS</div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: V.text, letterSpacing: -1 }}>Three steps to race day</h2>
          </div>
          {[
            { n: "01", title: "Pick your plan", desc: "Choose a preset race plan or build a custom schedule that matches your fitness level and goals.", color: V.v500 },
            { n: "02", title: "Track every run", desc: "Hit start and let GPS do the work. See live pace, distance, and progress against your workout target.", color: V.v600 },
            { n: "03", title: "Share & improve", desc: "Sync to Strava, export GPX files, and watch your fitness build week over week.", color: V.v700 },
          ].map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 24, marginBottom: 36, alignItems: "flex-start", transition: `all 0.6s ease ${i * 0.15}s` }}>
              <div style={{ width: 52, height: 52, background: `${step.color}12`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: step.color, fontFamily: "'Outfit', sans-serif", flexShrink: 0 }}>{step.n}</div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Outfit', sans-serif", color: V.text, marginBottom: 6 }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: V.textSec, lineHeight: 1.7, fontFamily: "'Satoshi', sans-serif" }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section ref={el => sectionRefs.current[3] = el} data-section="cta"
        className={`section-anim ${isVisible("cta") ? "vis" : ""}`}
        style={{ padding: "80px 24px 100px" }}>
        <div className="landing-cta-box" style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", background: `linear-gradient(135deg, ${V.v600}, ${V.v800})`, borderRadius: 24, padding: "56px 32px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", width: 300, height: 300, background: "rgba(255,255,255,0.06)", borderRadius: "50%", top: -100, right: -80 }} />
          <div style={{ position: "absolute", width: 200, height: 200, background: "rgba(255,255,255,0.04)", borderRadius: "50%", bottom: -60, left: -40 }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: "#fff", letterSpacing: -1, marginBottom: 12 }}>Ready to start running?</h2>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 16, fontFamily: "'Satoshi', sans-serif", marginBottom: 28, lineHeight: 1.6 }}>Free forever. No credit card. Just sign up and pick a plan.</p>
            <button onClick={onSignUp} style={{ padding: "16px 40px", background: "#fff", border: "none", color: V.v700, fontSize: 15, fontWeight: 700, borderRadius: 12, cursor: "pointer", fontFamily: "'Satoshi', sans-serif", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", transition: "all 0.3s" }}
              onMouseOver={e=>e.target.style.transform="translateY(-2px)"} onMouseOut={e=>e.target.style.transform="translateY(0)"}>
              Create Free Account →
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: `1px solid ${V.border}`, padding: "32px 24px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
          <div style={{ width: 20, height: 20, background: `linear-gradient(135deg, ${V.v500}, ${V.v700})`, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 9, fontWeight: 900, fontFamily: "'Outfit'" }}>R</div>
          <span style={{ fontSize: 13, fontWeight: 600, fontFamily: "'Outfit', sans-serif", color: V.text }}>RunForge</span>
        </div>
        <p style={{ fontSize: 12, color: V.dim, fontFamily: "'Satoshi', sans-serif" }}>Built for runners, by runners</p>
      </footer>
    </div>
  );
}
