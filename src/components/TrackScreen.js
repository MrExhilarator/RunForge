import { useState, useRef, useCallback, useMemo } from "react";
import { useTheme, TYPE_COLORS } from "../theme";
import { card, tag, bigBtn, sBox, sVal, sLbl, chip } from "../styles";
import { haversine, formatPace, formatDur } from "../utils";

export default function TrackScreen({ activePlan, completedWorkouts, onSaveRun }) {
  const V = useTheme();
  const [tracking, setTracking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [coords, setCoords] = useState([]);
  const [distance, setDistance] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [gps, setGps] = useState("idle");
  const [selWk, setSelWk] = useState(null);
  const wRef = useRef(null);
  const tRef = useRef(null);
  const sRef = useRef(null);

  const start = useCallback(() => {
    if (!navigator.geolocation) return setGps("unsupported");
    setGps("acquiring"); setTracking(true); setPaused(false); setCoords([]); setDistance(0); setElapsed(0); setSpeed(0);
    sRef.current = Date.now();
    tRef.current = setInterval(() => setElapsed((Date.now()-sRef.current)/1000), 1000);
    wRef.current = navigator.geolocation.watchPosition(p => {
      setGps("locked");
      const c = { lat:p.coords.latitude,lng:p.coords.longitude,alt:p.coords.altitude,speed:p.coords.speed,time:Date.now() };
      setCoords(prev => { const u=[...prev,c]; if(u.length>1){const d=haversine(u[u.length-2].lat,u[u.length-2].lng,c.lat,c.lng);if(d>0.003)setDistance(pr=>pr+d);} return u; });
      if(p.coords.speed>0) setSpeed(p.coords.speed*3.6);
    }, ()=>setGps("error"), { enableHighAccuracy:true,maximumAge:3000,timeout:10000 });
  }, []);

  const pause = () => { setPaused(true); if(wRef.current)navigator.geolocation.clearWatch(wRef.current); if(tRef.current)clearInterval(tRef.current); };
  const resume = () => {
    setPaused(false); sRef.current=Date.now()-elapsed*1000;
    tRef.current=setInterval(()=>setElapsed((Date.now()-sRef.current)/1000),1000);
    wRef.current=navigator.geolocation.watchPosition(p=>{const c={lat:p.coords.latitude,lng:p.coords.longitude,alt:p.coords.altitude,speed:p.coords.speed,time:Date.now()};setCoords(prev=>{const u=[...prev,c];if(u.length>1){const d=haversine(u[u.length-2].lat,u[u.length-2].lng,c.lat,c.lng);if(d>0.003)setDistance(pr=>pr+d);}return u;});if(p.coords.speed>0)setSpeed(p.coords.speed*3.6);},()=>{},{enableHighAccuracy:true,maximumAge:3000,timeout:10000});
  };
  const stop = () => {
    if(wRef.current)navigator.geolocation.clearWatch(wRef.current); if(tRef.current)clearInterval(tRef.current);
    setTracking(false); setPaused(false); setGps("idle");
    if(distance>0.01) onSaveRun({ id:Date.now(),date:new Date().toISOString(),distance,duration:elapsed,avgPace:formatPace((distance/elapsed)*3600),coords,workoutType:selWk?.type||"Free Run" });
  };

  const avgKmh = elapsed>0&&distance>0?(distance/elapsed)*3600:0;
  const target = selWk?.distance||0;
  const workouts = useMemo(()=> activePlan ? activePlan.workouts.filter(w=>w.type!=="Rest") : [],[activePlan]);

  return (
    <div>
      {activePlan&&!tracking&&(
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:10,letterSpacing:3,color:V.dim,fontFamily:"'DM Mono'",marginBottom:8 }}>{activePlan.name.toUpperCase()}</div>
          <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:8 }}>
            <button onClick={()=>setSelWk(null)} style={chip(!selWk,V.v500,V)}>Free Run</button>
            {workouts.slice(0,12).map((w,i)=>{const k=`${w.week}-${w.day}-${i}`;const done=completedWorkouts.includes(k);return(
              <button key={k} onClick={()=>setSelWk(w)} style={{...chip(selWk===w,TYPE_COLORS[w.type],V),opacity:done?0.5:1,textDecoration:done?"line-through":"none"}}>W{w.week} {w.day} · {w.distance}km</button>
            );})}
          </div>
          {selWk&&(
            <div style={{ ...card(V),borderLeft:`3px solid ${TYPE_COLORS[selWk.type]}`,borderRadius:"0 14px 14px 0",marginTop:8,padding:14 }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                <div><span style={tag(TYPE_COLORS[selWk.type])}>{selWk.type}</span><span style={{ fontSize:18,fontWeight:700,marginLeft:12,fontFamily:"'Outfit'",color:V.text }}>{selWk.distance} km</span></div>
                <span style={{ fontSize:10,color:V.dim,fontFamily:"'DM Mono'" }}>W{selWk.week} · {selWk.day}</span>
              </div>
              <div style={{ fontSize:12,color:V.textSec,marginTop:8,fontFamily:"'Satoshi'",lineHeight:1.6 }}>{selWk.notes}</div>
            </div>
          )}
        </div>
      )}

      <div style={{ ...card(V),borderLeft:`3px solid ${gps==="locked"?V.green:gps==="acquiring"?V.v400:V.muted}`,borderRadius:"0 14px 14px 0",padding:12,marginBottom:12 }}>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <div style={{ width:8,height:8,borderRadius:"50%",background:gps==="locked"?V.green:gps==="acquiring"?V.v400:V.muted,boxShadow:gps==="locked"?`0 0 12px ${V.green}40`:"none" }} />
          <span style={{ fontSize:10,letterSpacing:2,color:V.dim,textTransform:"uppercase",fontFamily:"'DM Mono'" }}>
            {gps==="idle"?"GPS Ready":gps==="acquiring"?"Acquiring...":gps==="locked"?`Locked · ${coords.length} pts`:gps==="error"?"Error — Check Permissions":"Not Supported"}
          </span>
        </div>
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12 }}>
        <div style={sBox(V)}><div style={{ ...sVal(V),fontSize:36,color:V.v600 }}>{distance.toFixed(2)}</div><div style={sLbl(V)}>Kilometers</div></div>
        <div style={sBox(V)}><div style={{ ...sVal(V),fontSize:36 }}>{formatDur(elapsed)}</div><div style={sLbl(V)}>Duration</div></div>
        <div style={sBox(V)}><div style={sVal(V)}>{formatPace(avgKmh)}</div><div style={sLbl(V)}>Avg Pace /km</div></div>
        <div style={sBox(V)}><div style={sVal(V)}>{formatPace(speed)}</div><div style={sLbl(V)}>Current /km</div></div>
      </div>

      {target>0&&(
        <div style={{ ...card(V),padding:14,marginBottom:12 }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
            <span style={{ fontSize:10,letterSpacing:2,color:V.dim,fontFamily:"'DM Mono'" }}>WORKOUT PROGRESS</span>
            <span style={{ fontSize:11,fontWeight:600,color:V.v600,fontFamily:"'DM Mono'" }}>{((distance/target)*100).toFixed(0)}%</span>
          </div>
          <div style={{ background:V.v100,height:5,borderRadius:3,overflow:"hidden" }}>
            <div style={{ height:"100%",width:`${Math.min(100,(distance/target)*100)}%`,background:`linear-gradient(90deg, ${V.v500}, ${V.v400})`,borderRadius:3,transition:"width 0.5s" }} />
          </div>
          <div style={{ fontSize:10,color:V.dim,marginTop:6,textAlign:"right",fontFamily:"'DM Mono'" }}>{Math.max(0,target-distance).toFixed(2)} km to go</div>
        </div>
      )}

      {!tracking ? (
        <button onClick={start} style={bigBtn(V.v600)} onMouseOver={e=>e.target.style.background=V.v700} onMouseOut={e=>e.target.style.background=V.v600}>
          ▶ Start Run {selWk?`· ${selWk.distance}km ${selWk.type}`:""}
        </button>
      ) : (
        <div style={{ display:"flex",gap:10 }}>
          {!paused ? <button onClick={pause} style={{...bigBtn(V.blue),flex:1}}>⏸ Pause</button> : <button onClick={resume} style={{...bigBtn(V.green),flex:1}}>▶ Resume</button>}
          <button onClick={stop} style={{...bigBtn(V.red),flex:1}}>⏹ Finish</button>
        </div>
      )}
    </div>
  );
}
