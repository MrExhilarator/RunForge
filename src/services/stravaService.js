import { STRAVA_CLIENT_ID, STRAVA_TOKEN_WORKER_URL } from "../config";
import { genGPX } from "../utils";

export const StravaService = {
  // Exchange authorization code for tokens via Cloudflare Worker
  async exchangeToken(code) {
    try {
      const res = await fetch(`${STRAVA_TOKEN_WORKER_URL}/exchange`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, client_id: STRAVA_CLIENT_ID }),
      });
      if (!res.ok) throw new Error("Token exchange failed");
      return await res.json();
    } catch (err) {
      console.error("[Strava] Token exchange error:", err);
      throw err;
    }
  },

  // Refresh expired access token
  async refreshToken(refreshToken) {
    try {
      const res = await fetch(`${STRAVA_TOKEN_WORKER_URL}/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken, client_id: STRAVA_CLIENT_ID }),
      });
      if (!res.ok) throw new Error("Token refresh failed");
      return await res.json();
    } catch (err) {
      console.error("[Strava] Token refresh error:", err);
      throw err;
    }
  },

  // Get valid access token (auto-refresh if expired)
  async getValidToken(tokens) {
    if (!tokens) return null;
    const now = Math.floor(Date.now() / 1000);
    if (tokens.expires_at > now + 300) return tokens.access_token;
    const refreshed = await this.refreshToken(tokens.refresh_token);
    return refreshed.access_token;
  },

  // Upload activity to Strava
  async uploadActivity(accessToken, run) {
    try {
      const res = await fetch("https://www.strava.com/api/v3/activities", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${run.workoutType || "Run"} — RunForge`,
          type: "Run",
          sport_type: "Run",
          start_date_local: run.date,
          elapsed_time: Math.round(run.duration),
          distance: Math.round(run.distance * 1000),
          description: `Tracked with RunForge. Avg pace: ${run.avgPace}/km`,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Upload failed");
      }
      const activity = await res.json();

      if (run.coords && run.coords.length > 0) {
        await this.uploadGPX(accessToken, run, activity.id);
      }

      return activity;
    } catch (err) {
      console.error("[Strava] Upload error:", err);
      throw err;
    }
  },

  async uploadGPX(accessToken, run) {
    const gpxContent = genGPX(run.coords, `RunForge ${new Date(run.date).toLocaleDateString()}`);
    const blob = new Blob([gpxContent], { type: "application/gpx+xml" });
    const formData = new FormData();
    formData.append("file", blob, "activity.gpx");
    formData.append("data_type", "gpx");
    formData.append("activity_type", "run");

    const res = await fetch("https://www.strava.com/api/v3/uploads", {
      method: "POST",
      headers: { "Authorization": `Bearer ${accessToken}` },
      body: formData,
    });
    return await res.json();
  },

  async getAthlete(accessToken) {
    const res = await fetch("https://www.strava.com/api/v3/athlete", {
      headers: { "Authorization": `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error("Failed to fetch athlete");
    return await res.json();
  },

  async getActivities(accessToken, page = 1, perPage = 10) {
    const res = await fetch(`https://www.strava.com/api/v3/athlete/activities?page=${page}&per_page=${perPage}`, {
      headers: { "Authorization": `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error("Failed to fetch activities");
    return await res.json();
  },
};
