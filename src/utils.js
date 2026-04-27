export function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371, dLat = ((lat2 - lat1) * Math.PI) / 180, dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatPace(kmh) {
  if (!kmh || kmh <= 0) return "--:--";
  const m = 60 / kmh;
  return `${Math.floor(m)}:${Math.round((m % 1) * 60).toString().padStart(2, "0")}`;
}

export function formatDur(s) {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sc = Math.floor(s % 60);
  return h > 0
    ? `${h}:${m.toString().padStart(2, "0")}:${sc.toString().padStart(2, "0")}`
    : `${m}:${sc.toString().padStart(2, "0")}`;
}

export function genGPX(coords, name) {
  return `<?xml version="1.0"?>\n<gpx version="1.1" creator="RunForge">\n<trk><n>${name}</n><trkseg>\n${coords.map(c => `<trkpt lat="${c.lat}" lon="${c.lng}"><ele>${c.alt || 0}</ele><time>${new Date(c.time).toISOString()}</time></trkpt>`).join("\n")}\n</trkseg></trk></gpx>`;
}
