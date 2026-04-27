import { useState } from "react";
import { useTheme, TYPE_COLORS } from "../theme";
import { card, tag, bigBtn, lbl, inp } from "../styles";
import { PRESET_PLANS } from "../data/presetPlans";

export default function PlansBrowser({ activePlan, onSelectPlan }) {
  const V = useTheme();
  const [preview, setPreview] = useState(null);
  const [custom, setCustom] = useState(false);
  const [cName, setCName] = useState("");
  const [cWeeks, setCWeeks] = useState(8);
  const [cWk, setCWk] = useState([]);
  const [adding, setAdding] = useState(false);
  const [nw, setNw] = useState({ week:1,day:"Mon",type:"Easy Run",distance:5,notes:"" });

  if (preview) {
    const weeks = [...new Set(preview.workouts.map(w=>w.week))].sort((a,b)=>a-b);
    return (
      <div>
        <button onClick={()=>setPreview(null)} style={{ background:"none",border:"none",color:V.v500,fontSize:13,cursor:"pointer",fontFamily:"'Satoshi'",fontWeight:500,padding:0,marginBottom:16 }}>← Back to plans</button>
        <div style={{ textAlign:"center",marginBottom:28 }}>
          <div style={{ fontSize:48,marginBottom:8 }}>{preview.icon}</div>
          <h2 style={{ fontSize:24,fontFamily:"'Outfit'",fontWeight:800,color:V.text }}>{preview.name}</h2>
          <div style={{ display:"flex",gap:8,justifyContent:"center",marginTop:8 }}>
            <span style={tag(preview.color)}>{preview.distance}</span>
            <span style={tag(V.dim)}>{preview.level}</span>
            <span style={tag(V.dim)}>{preview.weeks} weeks</span>
          </div>
          <p style={{ color:V.textSec,fontSize:13,marginTop:10,lineHeight:1.6,fontFamily:"'Satoshi'" }}>{preview.description}</p>
        </div>
        {weeks.map(w=>(
          <div key={w} style={{ marginBottom:18 }}>
            <div style={{ fontSize:10,letterSpacing:3,color:V.dim,fontFamily:"'DM Mono'",marginBottom:8 }}>WEEK {w}</div>
            {preview.workouts.filter(x=>x.week===w).map((wk,i)=>(
              <div key={i} style={{ ...card(V),borderLeft:`3px solid ${TYPE_COLORS[wk.type]||V.dim}`,borderRadius:"0 14px 14px 0",marginBottom:8,padding:12 }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                  <div><span style={tag(TYPE_COLORS[wk.type])}>{wk.type}</span><span style={{ color:V.dim,fontSize:11,marginLeft:8,fontFamily:"'DM Mono'" }}>{wk.day}</span></div>
                  <span style={{ fontSize:16,fontWeight:700,fontFamily:"'Outfit'",color:V.text }}>{wk.distance} km</span>
                </div>
                <div style={{ fontSize:12,color:V.textSec,marginTop:6,fontFamily:"'Satoshi'" }}>{wk.notes}</div>
              </div>
            ))}
          </div>
        ))}
        <button onClick={()=>{onSelectPlan(preview);setPreview(null)}} style={bigBtn(preview.color)}>Start This Plan</button>
      </div>
    );
  }

  if (custom) {
    return (
      <div>
        <button onClick={()=>setCustom(false)} style={{ background:"none",border:"none",color:V.v500,fontSize:13,cursor:"pointer",fontFamily:"'Satoshi'",fontWeight:500,padding:0,marginBottom:16 }}>← Back</button>
        <h2 style={{ fontSize:22,fontFamily:"'Outfit'",fontWeight:800,color:V.text,marginBottom:20 }}>Build Custom Plan</h2>
        <div style={{ marginBottom:12 }}>
          <label style={lbl(V)}>Plan Name</label>
          <input value={cName} onChange={e=>setCName(e.target.value)} placeholder="My Training Plan" style={inp(V)} />
        </div>
        <div style={{ marginBottom:18 }}>
          <label style={lbl(V)}>Total Weeks</label>
          <input type="number" value={cWeeks} onChange={e=>setCWeeks(parseInt(e.target.value)||1)} style={{...inp(V),width:100}} />
        </div>
        <div style={{ fontSize:10,letterSpacing:3,color:V.dim,fontFamily:"'DM Mono'",marginBottom:10 }}>WORKOUTS ({cWk.length})</div>
        {cWk.map((w,i)=>(
          <div key={i} style={{ ...card(V),borderLeft:`3px solid ${TYPE_COLORS[w.type]}`,borderRadius:"0 14px 14px 0",marginBottom:8,padding:10,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
            <div><span style={tag(TYPE_COLORS[w.type])}>{w.type}</span><span style={{ color:V.dim,fontSize:10,marginLeft:6,fontFamily:"'DM Mono'" }}>W{w.week} {w.day}</span><span style={{ color:V.text,fontSize:13,marginLeft:8,fontWeight:700,fontFamily:"'Outfit'" }}>{w.distance}km</span></div>
            <button onClick={()=>setCWk(p=>p.filter((_,j)=>j!==i))} style={{ background:"none",border:"none",color:V.red,cursor:"pointer",fontSize:18 }}>×</button>
          </div>
        ))}
        {adding?(
          <div style={{ ...card(V),padding:14,marginBottom:12 }}>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8 }}>
              <div><label style={lbl(V)}>Week</label><input type="number" value={nw.week} onChange={e=>setNw({...nw,week:parseInt(e.target.value)||1})} style={inp(V)} /></div>
              <div><label style={lbl(V)}>Day</label><select value={nw.day} onChange={e=>setNw({...nw,day:e.target.value})} style={inp(V)}>{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=><option key={d}>{d}</option>)}</select></div>
              <div><label style={lbl(V)}>Type</label><select value={nw.type} onChange={e=>setNw({...nw,type:e.target.value})} style={inp(V)}>{Object.keys(TYPE_COLORS).map(t=><option key={t}>{t}</option>)}</select></div>
              <div><label style={lbl(V)}>Distance (km)</label><input type="number" value={nw.distance} onChange={e=>setNw({...nw,distance:parseFloat(e.target.value)||0})} style={inp(V)} /></div>
            </div>
            <input placeholder="Notes..." value={nw.notes} onChange={e=>setNw({...nw,notes:e.target.value})} style={{...inp(V),marginBottom:10}} />
            <div style={{ display:"flex",gap:8 }}>
              <button onClick={()=>{setCWk(p=>[...p,{...nw}]);setAdding(false)}} style={{...bigBtn(V.green),flex:1,padding:10,fontSize:12}}>Add</button>
              <button onClick={()=>setAdding(false)} style={{...bigBtn(V.muted),flex:1,padding:10,fontSize:12,boxShadow:"none"}}>Cancel</button>
            </div>
          </div>
        ):(
          <button onClick={()=>setAdding(true)} style={{ width:"100%",padding:12,background:V.surface,border:`1.5px dashed ${V.border}`,borderRadius:10,color:V.dim,fontSize:12,cursor:"pointer",fontFamily:"'Satoshi'",marginBottom:16 }}>+ Add Workout</button>
        )}
        {cName&&cWk.length>0&&(
          <button onClick={()=>{onSelectPlan({id:"c_"+Date.now(),name:cName,distance:"Custom",level:"Custom",weeks:cWeeks,description:`Custom ${cWeeks}-week plan`,icon:"✏️",color:V.v500,workouts:cWk,isCustom:true});setCustom(false)}} style={bigBtn(V.v600)}>Save & Start Plan</button>
        )}
      </div>
    );
  }

  return (
    <div>
      {activePlan&&(
        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:10,letterSpacing:3,color:V.dim,fontFamily:"'DM Mono'",marginBottom:10 }}>ACTIVE PLAN</div>
          <div style={{ ...card(V),borderLeft:`3px solid ${activePlan.color||V.v500}`,borderRadius:"0 14px 14px 0",display:"flex",alignItems:"center",gap:14 }}>
            <span style={{ fontSize:32 }}>{activePlan.icon}</span>
            <div>
              <div style={{ fontSize:16,fontWeight:700,fontFamily:"'Outfit'",color:V.text }}>{activePlan.name}</div>
              <div style={{ display:"flex",gap:6,marginTop:4 }}><span style={tag(activePlan.color)}>{activePlan.distance}</span><span style={tag(V.dim)}>{activePlan.weeks} weeks</span></div>
            </div>
          </div>
        </div>
      )}
      <div style={{ fontSize:10,letterSpacing:3,color:V.dim,fontFamily:"'DM Mono'",marginBottom:10 }}>{activePlan?"SWITCH PLAN":"CHOOSE A PLAN"}</div>
      {PRESET_PLANS.map(p=>(
        <div key={p.id} onClick={()=>setPreview(p)} style={{ ...card(V),marginBottom:10,cursor:"pointer",transition:"all 0.2s",display:"flex",alignItems:"center",gap:14 }}
          onMouseOver={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 6px 20px ${V.v500}10`}}
          onMouseOut={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
          <span style={{ fontSize:32 }}>{p.icon}</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15,fontWeight:700,fontFamily:"'Outfit'",color:V.text }}>{p.name}</div>
            <div style={{ fontSize:12,color:V.textSec,marginTop:2,fontFamily:"'Satoshi'" }}>{p.description.slice(0,55)}...</div>
            <div style={{ display:"flex",gap:6,marginTop:6 }}><span style={tag(p.color)}>{p.distance}</span><span style={tag(V.dim)}>{p.level}</span><span style={tag(V.dim)}>{p.weeks}wk</span></div>
          </div>
          <span style={{ color:V.muted,fontSize:18 }}>›</span>
        </div>
      ))}
      <button onClick={()=>setCustom(true)} style={{ width:"100%",padding:14,background:V.surface,border:`1.5px dashed ${V.v300}`,borderRadius:12,color:V.v600,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Satoshi'",marginTop:12,transition:"all 0.2s" }}
        onMouseOver={e=>e.target.style.background=V.v50} onMouseOut={e=>e.target.style.background=V.surface}>
        ✏ Build Custom Plan
      </button>
    </div>
  );
}
