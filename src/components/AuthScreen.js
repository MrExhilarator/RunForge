import { useState } from "react";
import { useTheme } from "../theme";
import { lbl, inp } from "../styles";
import { AuthService } from "../services/authService";

export default function AuthScreen({ onLogin, onBack, initialMode = "login", dark, toggleDark }) {
  const V = useTheme();
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!email.includes("@")) return setError("Enter a valid email");
    if (password.length < 6) return setError("Password must be 6+ characters");
    if (mode === "signup" && !name.trim()) return setError("Enter your name");
    setLoading(true);
    try {
      let user;
      if (mode === "signup") {
        user = await AuthService.signUp(email, password, name.trim());
        await AuthService.saveUserProfile(user.uid, { name: user.name, email: user.email, createdAt: new Date().toISOString() });
      } else {
        user = await AuthService.signIn(email, password);
      }
      setLoading(false);
      onLogin(user);
    } catch (err) {
      setLoading(false);
      const msg = err?.message?.includes("Invalid login") ? "Incorrect email or password"
        : err?.message?.includes("already registered") ? "An account with this email already exists"
        : err?.message?.includes("rate limit") ? "Too many attempts. Try again later"
        : err?.message?.includes("invalid email") ? "Please enter a valid email address"
        : err?.message || "Something went wrong. Please try again.";
      setError(msg);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.includes("@")) return setError("Enter your email first, then click forgot password");
    try {
      await AuthService.resetPassword(email);
      setError("");
      setForgotSent(true);
    } catch (err) {
      setError("Could not send reset email. Check the address and try again.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: V.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Outfit:wght@300;400;600;700;800&display=swap');
        @import url('https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        input::placeholder { color: ${V.placeholder}; }
      `}</style>

      <button onClick={onBack} style={{ position: "absolute", top: 20, left: 20, background: "none", border: "none", color: V.dim, fontSize: 13, cursor: "pointer", fontFamily: "'Satoshi', sans-serif" }}>← Back</button>

      <button onClick={toggleDark} aria-label="Toggle dark mode" style={{
        position:"absolute",top:20,right:20,width:36,height:36,borderRadius:8,border:`1px solid ${V.border}`,
        background:V.surface,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:16,color:V.dim,transition:"all 0.3s",
      }}
        onMouseOver={e=>{e.currentTarget.style.background=V.v50;e.currentTarget.style.borderColor=V.v300}}
        onMouseOut={e=>{e.currentTarget.style.background=V.surface;e.currentTarget.style.borderColor=V.border}}>
        {dark ? "☀️" : "🌙"}
      </button>

      <div style={{ animation: "fadeUp 0.5s ease-out", textAlign: "center", marginBottom: 40 }}>
        <div style={{ width: 48, height: 48, background: `linear-gradient(135deg, ${V.v500}, ${V.v700})`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 20, fontWeight: 900, fontFamily: "'Outfit'", margin: "0 auto 16px" }}>R</div>
        <h1 style={{ fontSize: 28, fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: V.text }}>{mode === "login" ? "Welcome back" : "Create account"}</h1>
        <p style={{ color: V.dim, fontSize: 14, marginTop: 6, fontFamily: "'Satoshi', sans-serif" }}>{mode === "login" ? "Sign in to your RunForge account" : "Start your free running journey"}</p>
      </div>

      <div style={{ width: "100%", maxWidth: 380, animation: "fadeUp 0.5s ease-out 0.1s both" }}>
        {mode === "signup" && (
          <div style={{ marginBottom: 14 }}>
            <label style={lbl(V)}>Name</label>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" style={inp(V)} onFocus={e=>e.target.style.borderColor=V.v400} onBlur={e=>e.target.style.borderColor=V.border} />
          </div>
        )}
        <div style={{ marginBottom: 14 }}>
          <label style={lbl(V)}>Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" style={inp(V)} onFocus={e=>e.target.style.borderColor=V.v400} onBlur={e=>e.target.style.borderColor=V.border} />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={lbl(V)}>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Min 6 characters" style={inp(V)} onFocus={e=>e.target.style.borderColor=V.v400} onBlur={e=>e.target.style.borderColor=V.border} />
        </div>

        {error && <div style={{ padding: "10px 14px", background: V.redBg, border: `1px solid ${V.red}25`, color: V.red, fontSize: 13, borderRadius: 8, marginBottom: 14, fontFamily: "'Satoshi'" }}>{error}</div>}

        <button onClick={handleSubmit} disabled={loading} style={{
          width: "100%", padding: "15px", background: loading ? V.muted : V.v600, border: "none", color: "#fff",
          fontSize: 14, fontWeight: 600, borderRadius: 10, cursor: loading?"wait":"pointer", fontFamily: "'Satoshi', sans-serif",
          transition: "all 0.2s", boxShadow: loading ? "none" : `0 2px 12px ${V.v500}40`,
        }}>
          {loading ? "···" : mode === "login" ? "Sign In" : "Create Account"}
        </button>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          {mode === "login" && (
            <div style={{ marginBottom: 12 }}>
              {forgotSent ? (
                <span style={{ color: V.green, fontSize: 12, fontFamily: "'Satoshi'" }}>Reset link sent to {email}</span>
              ) : (
                <button onClick={handleForgotPassword} style={{ background: "none", border: "none", color: V.dim, fontSize: 12, cursor: "pointer", fontFamily: "'Satoshi'", textDecoration: "underline", textDecorationColor: V.muted, textUnderlineOffset: 3 }}>
                  Forgot password?
                </button>
              )}
            </div>
          )}
          <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setForgotSent(false); }} style={{ background: "none", border: "none", color: V.v500, fontSize: 13, cursor: "pointer", fontFamily: "'Satoshi'", fontWeight: 500 }}>
            {mode === "login" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
