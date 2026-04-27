import { useTheme, TYPE_COLORS } from "../theme";
import { card, tag, sBox, sVal, sLbl } from "../styles";
import { formatPace, formatDur } from "../utils";

export default function HistoryScreen({ runs, onExportGPX }) {
  const V = useTheme();
  const total = runs.reduce((a,r)=>a+r.distance,0);
  const totalTime = runs.reduce((a,r)=>a+r.duration,0);
  return (
    <div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:20 }}>
        <div style={sBox(V)}><div style={{ ...sVal(V),color:V.v600 }}>{runs.length}</div><div style={sLbl(V)}>Runs</div></div>
        <div style={sBox(V)}><div style={sVal(V)}>{total.toFixed(1)}</div><div style={sLbl(V)}>Total KM</div></div>
        <div style={sBox(V)}><div style={{ ...sVal(V),color:V.green }}>{total>0?formatPace((total/totalTime)*3600):"--"}</div><div style={sLbl(V)}>Avg Pace</div></div>
      </div>
      {runs.length===0?(
        <div style={{ ...card(V),textAlign:"center",padding:48 }}>
          <div style={{ fontSize:36,marginBottom:12 }}>🏃</div>
          <div style={{ fontSize:12,color:V.dim,fontFamily:"'DM Mono'",letterSpacing:2 }}>NO RUNS YET</div>
          <div style={{ fontSize:13,color:V.textSec,marginTop:8,fontFamily:"'Satoshi'" }}>Complete your first run from the Track tab</div>
        </div>
      ):runs.slice().reverse().map(run=>(
        <div key={run.id} style={{ ...card(V),marginBottom:10 }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
            <div>
              <div style={{ display:"flex",gap:8,alignItems:"center",marginBottom:8 }}>
                <span style={{ fontSize:11,color:V.dim,fontFamily:"'DM Mono'" }}>{new Date(run.date).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}</span>
                {run.workoutType&&<span style={tag(TYPE_COLORS[run.workoutType]||V.dim)}>{run.workoutType}</span>}
              </div>
              <div style={{ display:"flex",gap:20 }}>
                <div><div style={{ fontSize:20,fontWeight:800,color:V.v600,fontFamily:"'Outfit'" }}>{run.distance.toFixed(2)}</div><div style={sLbl(V)}>KM</div></div>
                <div><div style={{ fontSize:20,fontWeight:800,color:V.text,fontFamily:"'Outfit'" }}>{formatDur(run.duration)}</div><div style={sLbl(V)}>TIME</div></div>
                <div><div style={{ fontSize:20,fontWeight:800,color:V.green,fontFamily:"'Outfit'" }}>{run.avgPace}</div><div style={sLbl(V)}>PACE</div></div>
              </div>
            </div>
            {run.coords?.length>0&&<button onClick={()=>onExportGPX(run)} style={{ padding:"6px 12px",background:V.surface,border:`1px solid ${V.border}`,borderRadius:6,color:V.dim,fontSize:10,cursor:"pointer",fontFamily:"'DM Mono'" }}>GPX ↓</button>}
          </div>
        </div>
      ))}
    </div>
  );
}
