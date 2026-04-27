import { useState, useEffect } from "react";
import { useTheme } from "../theme";
import { card, bigBtn } from "../styles";
import { STRAVA_CLIENT_ID } from "../config";
import { StravaService } from "../services/stravaService";
import { AuthService } from "../services/authService";

export default function StravaScreen({ runs, user, stravaTokens, setStravaTokens, onExportGPX }) {
  const V = useTheme();
  const [status, setStatus] = useState(stravaTokens ? "connected" : "disconnected");
  const [athlete, setAthlete] = useState(stravaTokens?.athlete || null);
  const [uploading, setUploading] = useState(null);
  const [uploadedRuns, setUploadedRuns] = useState(new Set());
  const [autoUpload, setAutoUpload] = useState(stravaTokens?.autoUpload || false);
  const [error, setError] = useState("");
  const [recentActivities, setRecentActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  // Check for OAuth callback code in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const scope = params.get("scope");
    if (code && scope?.includes("activity:write")) {
      setStatus("connecting");
      window.history.replaceState({}, document.title, window.location.pathname);
      StravaService.exchangeToken(code).then(async (tokens) => {
        const tokenData = {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_at: tokens.expires_at,
          athlete: tokens.athlete,
          autoUpload: false,
          connectedAt: new Date().toISOString(),
        };
        setStravaTokens(tokenData);
        setAthlete(tokens.athlete);
        setStatus("connected");
        if (user) await AuthService.saveStravaTokens(user.uid, tokenData);
      }).catch(() => {
        setError("Failed to connect to Strava. Please try again.");
        setStatus("disconnected");
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load recent Strava activities when connected
  useEffect(() => {
    if (status === "connected" && stravaTokens) {
      setLoadingActivities(true);
      StravaService.getValidToken(stravaTokens).then((token) => {
        if (token) return StravaService.getActivities(token, 1, 5);
        return [];
      }).then((activities) => {
        setRecentActivities(activities || []);
        setLoadingActivities(false);
      }).catch(() => setLoadingActivities(false));
    }
  }, [status, stravaTokens]);

  const handleConnect = () => {
    const redirectUri = encodeURIComponent(window.location.origin + window.location.pathname);
    const scope = "activity:write,activity:read_all,profile:read_all";
    const authUrl = `https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&approval_prompt=auto`;
    window.location.href = authUrl;
  };

  const handleDisconnect = async () => {
    setStravaTokens(null);
    setAthlete(null);
    setStatus("disconnected");
    setRecentActivities([]);
    if (user) await AuthService.saveStravaTokens(user.uid, null);
  };

  const handleUploadRun = async (run) => {
    if (!stravaTokens) return;
    setUploading(run.id);
    setError("");
    try {
      const token = await StravaService.getValidToken(stravaTokens);
      if (!token) throw new Error("Could not get valid token");
      await StravaService.uploadActivity(token, run);
      setUploadedRuns(prev => new Set([...prev, run.id]));
      setUploading(null);
    } catch (err) {
      setError(`Upload failed: ${err.message}`);
      setUploading(null);
    }
  };

  const handleToggleAutoUpload = async () => {
    const newVal = !autoUpload;
    setAutoUpload(newVal);
    if (stravaTokens) {
      const updated = { ...stravaTokens, autoUpload: newVal };
      setStravaTokens(updated);
      if (user) await AuthService.saveStravaTokens(user.uid, updated);
    }
  };

  return (
    <div>
      {/* Connection Status Card */}
      <div style={{ ...card(V), textAlign: "center", padding: 32 }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="#FC4C02" style={{ marginBottom: 14 }}>
          <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
        </svg>

        {status === "disconnected" && (
          <div>
            <h3 style={{ fontFamily: "'Outfit'", fontWeight: 700, fontSize: 18, color: V.text, marginBottom: 6 }}>Connect Strava</h3>
            <p style={{ color: V.textSec, fontSize: 13, fontFamily: "'Satoshi'", marginBottom: 20, lineHeight: 1.6 }}>
              Sync your runs to Strava automatically after each workout. Your GPS data, pace, and distance are uploaded directly.
            </p>
            <button onClick={handleConnect} style={{ ...bigBtn("#FC4C02"), marginBottom: 0 }}
              onMouseOver={e => { e.target.style.opacity = "0.9"; }} onMouseOut={e => { e.target.style.opacity = "1"; }}>
              Connect with Strava
            </button>
          </div>
        )}

        {status === "connecting" && (
          <div>
            <h3 style={{ fontFamily: "'Outfit'", fontWeight: 700, fontSize: 18, color: V.text, marginBottom: 6 }}>Connecting...</h3>
            <p style={{ color: V.dim, fontSize: 13, fontFamily: "'Satoshi'" }}>Exchanging authorization with Strava</p>
            <div style={{ marginTop: 16, width: 32, height: 32, border: `3px solid ${V.border}`, borderTopColor: "#FC4C02", borderRadius: "50%", margin: "16px auto 0", animation: "spin 0.8s linear infinite" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {status === "connected" && athlete && (
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 14px", background: `${V.green}15`, borderRadius: 20, marginBottom: 12 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: V.green }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: V.green, fontFamily: "'DM Mono', monospace" }}>CONNECTED</span>
            </div>
            <h3 style={{ fontFamily: "'Outfit'", fontWeight: 700, fontSize: 18, color: V.text, marginBottom: 4 }}>
              {athlete.firstname} {athlete.lastname}
            </h3>
            <p style={{ color: V.dim, fontSize: 12, fontFamily: "'Satoshi'" }}>Strava Athlete ID: {athlete.id}</p>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 16, padding: "10px 16px", background: V.surface, borderRadius: 10 }}>
              <span style={{ fontSize: 12, color: V.textSec, fontFamily: "'Satoshi'" }}>Auto-upload runs</span>
              <button onClick={handleToggleAutoUpload} style={{
                width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
                background: autoUpload ? "#FC4C02" : V.muted, position: "relative", transition: "background 0.2s",
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3,
                  left: autoUpload ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }} />
              </button>
            </div>

            <button onClick={handleDisconnect} style={{ background: "none", border: "none", color: V.dim, fontSize: 11, cursor: "pointer", fontFamily: "'Satoshi'", marginTop: 14, textDecoration: "underline", textDecorationColor: V.muted, textUnderlineOffset: 3 }}>
              Disconnect Strava
            </button>
          </div>
        )}
      </div>

      {error && (
        <div style={{ padding: "10px 14px", background: `${V.red}12`, border: `1px solid ${V.red}25`, borderRadius: 10, color: V.red, fontSize: 12, fontFamily: "'Satoshi'", marginTop: 12 }}>{error}</div>
      )}

      {/* Upload Runs to Strava */}
      {status === "connected" && runs.length > 0 && (
        <div style={{ ...card(V), padding: 16, marginTop: 12 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: V.dim, fontFamily: "'DM Mono'", marginBottom: 12 }}>UPLOAD RUNS TO STRAVA</div>
          {runs.slice().reverse().map(run => {
            const uploaded = uploadedRuns.has(run.id);
            const isUploading = uploading === run.id;
            return (
              <div key={run.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${V.border}` }}>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: V.text, fontFamily: "'Outfit'" }}>{run.distance.toFixed(2)} km</span>
                  <span style={{ fontSize: 11, color: V.dim, marginLeft: 8, fontFamily: "'DM Mono'" }}>{new Date(run.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  <span style={{ fontSize: 11, color: V.dim, marginLeft: 8, fontFamily: "'DM Mono'" }}>{run.avgPace}/km</span>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {run.coords?.length > 0 && (
                    <button onClick={() => onExportGPX(run)} style={{ padding: "4px 10px", background: V.surface, border: `1px solid ${V.border}`, borderRadius: 6, color: V.dim, fontSize: 10, cursor: "pointer", fontFamily: "'DM Mono'" }}>GPX</button>
                  )}
                  {uploaded ? (
                    <span style={{ padding: "4px 10px", background: `${V.green}15`, borderRadius: 6, color: V.green, fontSize: 10, fontFamily: "'DM Mono'", fontWeight: 600 }}>Synced</span>
                  ) : (
                    <button onClick={() => handleUploadRun(run)} disabled={isUploading} style={{
                      padding: "4px 10px", background: "#FC4C02", border: "none", borderRadius: 6,
                      color: "#fff", fontSize: 10, cursor: isUploading ? "wait" : "pointer", fontFamily: "'DM Mono'", fontWeight: 600,
                      opacity: isUploading ? 0.6 : 1,
                    }}>
                      {isUploading ? "..." : "Upload"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Recent Strava Activities */}
      {status === "connected" && (
        <div style={{ ...card(V), padding: 16, marginTop: 12 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: V.dim, fontFamily: "'DM Mono'", marginBottom: 12 }}>RECENT STRAVA ACTIVITIES</div>
          {loadingActivities ? (
            <div style={{ textAlign: "center", padding: 20, color: V.dim, fontSize: 12, fontFamily: "'Satoshi'" }}>Loading activities...</div>
          ) : recentActivities.length > 0 ? (
            recentActivities.map((a, i) => (
              <div key={a.id || i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < recentActivities.length - 1 ? `1px solid ${V.border}` : "none" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: V.text, fontFamily: "'Outfit'" }}>{a.name}</div>
                  <div style={{ fontSize: 10, color: V.dim, fontFamily: "'DM Mono'", marginTop: 2 }}>
                    {(a.distance / 1000).toFixed(2)} km · {Math.round(a.elapsed_time / 60)} min
                  </div>
                </div>
                <span style={{ fontSize: 10, color: V.dim, fontFamily: "'DM Mono'" }}>{new Date(a.start_date_local).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", padding: 16, color: V.dim, fontSize: 12, fontFamily: "'Satoshi'" }}>
              {stravaTokens ? "No recent activities found" : "Connect to see your activities"}
            </div>
          )}
        </div>
      )}

      {/* Setup guide for disconnected state */}
      {status === "disconnected" && (
        <div style={{ ...card(V), padding: 16, marginTop: 12 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: V.dim, fontFamily: "'DM Mono'", marginBottom: 14 }}>HOW IT WORKS</div>
          {[
            "Click 'Connect with Strava' to authorize RunForge",
            "Strava will ask you to grant permission for activity uploads",
            "Once connected, upload individual runs or enable auto-upload",
            "Your GPS data, distance, and pace are synced to Strava",
            "You can disconnect at any time — your Strava data stays",
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
              <span style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", background: V.v100, borderRadius: 7, fontSize: 11, fontWeight: 700, color: V.v600, fontFamily: "'Outfit'", flexShrink: 0 }}>{i + 1}</span>
              <span style={{ fontSize: 13, color: V.textSec, fontFamily: "'Satoshi'", lineHeight: 1.6 }}>{s}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
