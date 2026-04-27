import { useState, useEffect } from "react";
import { LIGHT, DARK, ThemeContext } from "./theme";
import { card } from "./styles";
import { genGPX } from "./utils";
import { AuthService } from "./services/authService";
import { StravaService } from "./services/stravaService";
import LandingPage from "./components/LandingPage";
import AuthScreen from "./components/AuthScreen";
import PlansBrowser from "./components/PlansBrowser";
import TrackScreen from "./components/TrackScreen";
import HistoryScreen from "./components/HistoryScreen";
import StravaScreen from "./components/StravaScreen";

export default function RunForge() {
  const [dark, setDark] = useState(false);
  const [screen, setScreen] = useState("landing"); // landing | auth | app
  const [authMode, setAuthMode] = useState("login");
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("track");
  const [activePlan, setActivePlan] = useState(null);
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const [runs, setRuns] = useState([]);
  const [stravaTokens, setStravaTokens] = useState(null);
  const [, setDataLoaded] = useState(false);

  const theme = dark ? DARK : LIGHT;
  const toggleDark = () => setDark(d => !d);

  useEffect(() => {
    if (!user) return;
    setDataLoaded(false);
    Promise.all([
      AuthService.loadPlan(user.uid),
      AuthService.loadRuns(user.uid),
      AuthService.loadCompletedWorkouts(user.uid),
      AuthService.loadStravaTokens(user.uid),
    ]).then(([plan, savedRuns, savedWorkouts, savedStrava]) => {
      if (plan && plan.length > 0) setActivePlan(plan[0]);
      if (savedRuns && savedRuns.length > 0) setRuns(savedRuns);
      if (savedWorkouts && savedWorkouts.length > 0) setCompletedWorkouts(savedWorkouts);
      if (savedStrava) setStravaTokens(savedStrava);
      setDataLoaded(true);
    }).catch(() => setDataLoaded(true));
  }, [user]);

  const goToAuth = (mode) => { setAuthMode(mode); setScreen("auth"); };

  const handleLogin = (u) => { setUser(u); setScreen("app"); };

  const handleLogout = async () => {
    await AuthService.signOut();
    setUser(null); setActivePlan(null); setRuns([]); setCompletedWorkouts([]); setStravaTokens(null); setScreen("landing");
  };

  const handleSelectPlan = async (p) => {
    setActivePlan(p); setCompletedWorkouts([]); setTab("track");
    if (user) {
      await AuthService.savePlan(user.uid, p);
      await AuthService.saveCompletedWorkouts(user.uid, []);
    }
  };

  const handleSaveRun = async (run) => {
    setRuns(p => [...p, run]);
    if (user) await AuthService.saveRun(user.uid, run);

    if (stravaTokens?.autoUpload) {
      try {
        const token = await StravaService.getValidToken(stravaTokens);
        if (token) await StravaService.uploadActivity(token, run);
      } catch (err) {
        console.error("[RunForge] Auto-upload to Strava failed:", err);
      }
    }
  };

  const handleCompleteWorkout = async (updated) => {
    setCompletedWorkouts(updated);
    if (user) await AuthService.saveCompletedWorkouts(user.uid, updated);
  };

  const handleExportGPX = (run) => {
    const g = genGPX(run.coords, `Run ${new Date(run.date).toLocaleDateString()}`);
    const b = new Blob([g], { type: "application/gpx+xml" });
    const u = URL.createObjectURL(b);
    const a = document.createElement("a");
    a.href = u;
    a.download = `runforge-${new Date(run.date).toISOString().split("T")[0]}.gpx`;
    a.click();
    URL.revokeObjectURL(u);
  };

  if (screen === "landing") return <ThemeContext.Provider value={theme}><LandingPage onLogin={() => goToAuth("login")} onSignUp={() => goToAuth("signup")} dark={dark} toggleDark={toggleDark} /></ThemeContext.Provider>;
  if (screen === "auth") return <ThemeContext.Provider value={theme}><AuthScreen onLogin={handleLogin} onBack={() => setScreen("landing")} initialMode={authMode} dark={dark} toggleDark={toggleDark} /></ThemeContext.Provider>;

  const tabs = [
    { id:"track",label:"Track",icon:"◉" },
    { id:"plans",label:"Plans",icon:"☰" },
    { id:"history",label:"History",icon:"◷" },
    { id:"strava",label:"Strava",icon:"⬡" },
  ];

  return (
    <ThemeContext.Provider value={theme}>
    <div style={{ minHeight:"100vh",background:theme.bg,color:theme.text,fontFamily:"'Satoshi', 'General Sans', sans-serif",transition:"background 0.3s, color 0.3s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Outfit:wght@300;400;600;700;800;900&display=swap');
        @import url('https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&f[]=general-sans@400,500,600&display=swap');
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: ${theme.bg}; }
        ::-webkit-scrollbar-thumb { background: ${theme.muted}; border-radius: 4px; }
        input::placeholder { color: ${theme.placeholder}; }
        select option { background: ${theme.white}; color: ${theme.text}; }
      `}</style>

      <div style={{ maxWidth:480,margin:"0 auto",padding:"0 16px 100px" }}>
        {/* Header */}
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 0 14px",borderBottom:`1px solid ${theme.border}`,marginBottom:20 }}>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ width:28,height:28,background:`linear-gradient(135deg, ${theme.v500}, ${theme.v700})`,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:12,fontWeight:900,fontFamily:"'Outfit'" }}>R</div>
            <div>
              <div style={{ fontSize:13,fontWeight:700,fontFamily:"'Outfit'",color:theme.text,letterSpacing:-0.3 }}>RunForge</div>
              <div style={{ fontSize:10,color:theme.dim,fontFamily:"'Satoshi'" }}>Hi, {user?.name}</div>
            </div>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <button onClick={toggleDark} aria-label="Toggle dark mode" style={{
              width:36,height:36,borderRadius:8,border:`1px solid ${theme.border}`,background:theme.surface,
              display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",
              fontSize:16,transition:"all 0.3s",color:theme.dim,
            }}
              onMouseOver={e=>{e.currentTarget.style.background=theme.v50;e.currentTarget.style.borderColor=theme.v300}}
              onMouseOut={e=>{e.currentTarget.style.background=theme.surface;e.currentTarget.style.borderColor=theme.border}}>
              {dark ? "☀️" : "🌙"}
            </button>
            <button onClick={handleLogout} style={{ background:theme.surface,border:`1px solid ${theme.border}`,borderRadius:6,color:theme.dim,padding:"6px 12px",fontSize:11,cursor:"pointer",fontFamily:"'Satoshi'",fontWeight:500 }}>Sign Out</button>
          </div>
        </div>

        {!activePlan&&tab==="track"&&(
          <div style={{ ...card(theme),textAlign:"center",padding:36,marginBottom:20 }}>
            <div style={{ fontSize:36,marginBottom:12 }}>📋</div>
            <div style={{ fontSize:15,fontWeight:700,fontFamily:"'Outfit'",color:theme.text,marginBottom:6 }}>No Active Plan</div>
            <div style={{ fontSize:13,color:theme.textSec,fontFamily:"'Satoshi'",marginBottom:16 }}>Pick a training plan or start a free run.</div>
            <button onClick={()=>setTab("plans")} style={{ padding:"10px 20px",background:theme.v50,border:`1.5px solid ${theme.v300}`,borderRadius:8,color:theme.v600,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'Satoshi'" }}>Browse Plans →</button>
          </div>
        )}

        <div style={{ animation:"fadeIn 0.3s ease-out" }}>
          {tab==="track"&&<TrackScreen activePlan={activePlan} completedWorkouts={completedWorkouts} setCompletedWorkouts={handleCompleteWorkout} onSaveRun={handleSaveRun} />}
          {tab==="plans"&&<PlansBrowser activePlan={activePlan} onSelectPlan={handleSelectPlan} />}
          {tab==="history"&&<HistoryScreen runs={runs} onExportGPX={handleExportGPX} />}
          {tab==="strava"&&<StravaScreen runs={runs} user={user} stravaTokens={stravaTokens} setStravaTokens={setStravaTokens} onExportGPX={handleExportGPX} />}
        </div>
      </div>

      {/* Bottom Nav */}
      <div style={{ position:"fixed",bottom:0,left:0,right:0,display:"flex",background:theme.navBg,backdropFilter:"blur(20px)",borderTop:`1px solid ${theme.border}`,zIndex:100,padding:"6px 0 env(safe-area-inset-bottom, 8px)" }}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"8px 0",
            background:"none",border:"none",color:tab===t.id?theme.v600:theme.muted,
            fontSize:9,letterSpacing:2,textTransform:"uppercase",cursor:"pointer",
            fontFamily:"'DM Mono', monospace",fontWeight:tab===t.id?500:400,transition:"color 0.2s",
          }}>
            <span style={{ fontSize:18,lineHeight:1 }}>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
    </ThemeContext.Provider>
  );
}
