import { useState, useEffect } from "react";

// ── 구글 시트 설정 ──
const SHEET_ID = "1ExoxPex-v2QYHYd92vpWqMYnkcDFkJTG_r_ktqZg6sI";
const getSheetName = () => {
  const now = new Date();
  return `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}`;
};
const getSheetUrl = (sheetName) =>
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;

// CSV 파싱 → 학생 배열
function parseStudents(csvText) {
  const lines = csvText.split("\n").map(l => l.trim()).filter(Boolean);
  const students = [];
  // 7행(index 6)부터 헤더, 8행(index 7)부터 데이터
  for (let i = 7; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    const name = (cols[4] || "").trim().replace(/"/g, "");
    if (!name || name === "이름") continue;
    const cls   = (cols[1] || "").trim().replace(/"/g, "");
    const grade = (cols[2] || "").trim().replace(/"/g, "");
    const school= (cols[3] || "").trim().replace(/"/g, "");
    const teacher=(cols[5] || "").trim().replace(/"/g, "");
    const parent= (cols[8] || "").trim().replace(/"/g, "");
    if (!cls && !grade) continue;
    students.push({ id: `${name}||${cls}`, name, class: cls, grade, school, teacher, parent });
  }
  return students;
}

function parseCSVLine(line) {
  const result = [];
  let cur = "", inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { inQ = !inQ; }
    else if (ch === "," && !inQ) { result.push(cur); cur = ""; }
    else cur += ch;
  }
  result.push(cur);
  return result;
}

async function fetchStudents() {
  const sheetName = getSheetName();
  const url = getSheetUrl(sheetName);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`시트 로드 실패: ${res.status}`);
  const text = await res.text();
  return parseStudents(text);
}

// ── 색상 팔레트 ──
const C = {
  bg:"#FFF8F0", bgCard:"#FFFFFF", bgSub:"#FFF3E6", border:"#FDDCB5", borderSub:"#FFE8CC",
  primary:"#F97316", primaryDk:"#EA6A0A", primaryLt:"#FFF0E6",
  amber:"#F59E0B", amberLt:"#FFFBEB",
  green:"#16A34A", greenLt:"#F0FDF4",
  blue:"#2563EB", blueLt:"#EFF6FF",
  red:"#DC2626", redLt:"#FEF2F2",
  text:"#1C0A00", textMd:"#7C4A1E", textSub:"#A87650", textFaint:"#D4A97A",
};
const GRADE_CLR = {"중1":"#3B82F6","중2":"#10B981","중3":"#8B5CF6","고1":"#F97316","고2":"#EC4899","고3":"#EF4444"};
const TEACHERS = ["전체","노미진","박혜린","김상은","김도은"];
const todayStr = () => new Date().toISOString().slice(0,10);
const fmt = d => new Date(d).toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
const fmtDateShort = d => { const dt=new Date(d); const days=["일","월","화","수","목","금","토"]; return `${String(dt.getMonth()+1).padStart(2,"0")}월 ${String(dt.getDate()).padStart(2,"0")}일(${days[dt.getDay()]})`; };
const fmtNotif = d => { const dt=new Date(d); const days=["일","월","화","수","목","금","토"]; return `${String(dt.getMonth()+1).padStart(2,"0")}월 ${String(dt.getDate()).padStart(2,"0")}일(${days[dt.getDay()]}) ${String(dt.getHours()).padStart(2,"0")}:${String(dt.getMinutes()).padStart(2,"0")}:${String(dt.getSeconds()).padStart(2,"0")}`; };
const elapsed = (a,b) => { const m=Math.floor((new Date(b)-new Date(a))/60000),s=Math.floor(((new Date(b)-new Date(a))%60000)/1000); return m>0?`${m}분 ${s}초`:`${s}초`; };
const toE164 = p => p.replace(/-/g,"").replace(/^0/,"82");
const CHOSUNG = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const toCs = str => [...str].map(c=>{ const code=c.charCodeAt(0); return (code>=0xAC00&&code<=0xD7A3)?CHOSUNG[Math.floor((code-0xAC00)/588)]:c; }).join('');
const kmatch = (q,t) => !q?false:t.includes(q)||toCs(t).includes(toCs(q));

const stor = {
  get: k => { try { const v=localStorage.getItem(k); return v?JSON.parse(v):null; } catch { return null; } },
  set: (k,v) => { try { localStorage.setItem(k,JSON.stringify(v)); } catch {} },
};

async function sendSMS(apiKey,apiSecret,from,to,text) {
  const date=new Date().toISOString(), salt=Math.random().toString(36).slice(2,18);
  const enc=new TextEncoder(), k=await crypto.subtle.importKey("raw",enc.encode(apiSecret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
  const sig=await crypto.subtle.sign("HMAC",k,enc.encode(date+salt));
  const hex=Array.from(new Uint8Array(sig)).map(b=>b.toString(16).padStart(2,"0")).join("");
  const res=await fetch("https://api.solapi.com/messages/v4/send",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${hex}`},body:JSON.stringify({message:{to:toE164(to),from:toE164(from),text}})});
  if(!res.ok){const e=await res.json().catch(()=>({}));throw new Error(e.errorMessage||`HTTP ${res.status}`);}
}

function exportCSV(date, records, retakeIds, students) {
  const header="날짜,이름,반,학년,학교,담당강사,재시대상,입실시각,퇴실시각,소요시간,상태";
  const rows=[];
  records.forEach(r=>{const s=students.find(x=>x.id===r.studentId);if(!s)return;const isRt=retakeIds.includes(s.id);rows.push([date,s.name,s.class,s.grade,s.school,s.teacher,isRt?"O":"",r.inTime?fmt(r.inTime):"",r.outTime?fmt(r.outTime):"",r.outTime?elapsed(r.inTime,r.outTime):"",r.outTime?"퇴실완료":"입실중"].join(","));});
  retakeIds.forEach(id=>{if(!records.find(r=>r.studentId===id)){const s=students.find(x=>x.id===id);if(!s)return;rows.push([date,s.name,s.class,s.grade,s.school,s.teacher,"O","","","","미응시"].join(","));}});
  const csv="\uFEFF"+header+"\n"+rows.join("\n");
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8;"}));a.download=`은갈치영어학원_재시_${date}.csv`;a.click();
}

export default function App() {
  const [students, setStudents] = useState([]);
  const [loadState, setLoadState] = useState("loading"); // loading | ok | error
  const [loadError, setLoadError] = useState("");
  const [sheetName, setSheetName] = useState(getSheetName());
  const [lastUpdated, setLastUpdated] = useState("");

  const [view,setView]=useState("checkin");
  const [mode,setMode]=useState("in");
  const [search,setSearch]=useState("");
  const [retakeSearch,setRetakeSearch]=useState("");
  const [selDate,setSelDate]=useState(todayStr());
  const [records,setRecords]=useState([]);
  const [retakeIds,setRetakeIds]=useState([]);
  const [now,setNow]=useState(new Date());
  const [successInfo,setSuccessInfo]=useState(null);
  const [teacherFilter,setTeacherFilter]=useState("전체");
  const [adminUnlocked,setAdminUnlocked]=useState(false);
  const [adminPass,setAdminPass]=useState("");
  const [adminError,setAdminError]=useState(false);
  const [settings,setSettings]=useState({apiKey:"",apiSecret:"",from:"",adminPass:"1234"});
  const [tmpSettings,setTmpSettings]=useState({apiKey:"",apiSecret:"",from:"",adminPass:"1234"});
  const [savedMsg,setSavedMsg]=useState(false);
  const [refreshing,setRefreshing]=useState(false);

  // 학생 데이터 로드
  const loadStudents = async (sheet) => {
    setRefreshing(true);
    try {
      // 캐시 확인 (1시간)
      const cacheKey = `students:${sheet}`;
      const cached = stor.get(cacheKey);
      if (cached && cached.ts && Date.now() - cached.ts < 3600000 && cached.data?.length > 0) {
        setStudents(cached.data);
        setLastUpdated(new Date(cached.ts).toLocaleDateString("ko-KR",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}));
        setLoadState("ok");
        setRefreshing(false);
        return;
      }
      const data = await fetchStudents();
      stor.set(cacheKey, { data, ts: Date.now() });
      setStudents(data);
      setLastUpdated(new Date().toLocaleDateString("ko-KR",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}));
      setLoadState("ok");
    } catch (e) {
      // 캐시라도 사용
      const cached = stor.get(`students:${sheet}`);
      if (cached?.data?.length > 0) {
        setStudents(cached.data);
        setLoadState("ok");
        setLoadError("캐시 데이터 사용 중 (인터넷 연결 확인)");
      } else {
        setLoadState("error");
        setLoadError(e.message);
      }
    }
    setRefreshing(false);
  };

  const forceRefresh = async () => {
    setRefreshing(true);
    stor.set(`students:${sheetName}`, null);
    await loadStudents(sheetName);
  };

  useEffect(()=>{
    const s=stor.get("settings:eungalchi")||{apiKey:"",apiSecret:"",from:"",adminPass:"1234"};
    setSettings(s);setTmpSettings(s);
    loadStudents(sheetName);
  },[]);

  useEffect(()=>{setRecords(stor.get(`checkins:${selDate}`)||[]);setRetakeIds(stor.get(`retake:${selDate}`)||[]);},[selDate]);
  useEffect(()=>{const t=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(t);},[]);

  const isConfigured=settings.apiKey&&settings.apiSecret&&settings.from;
  const getRecord=id=>records.find(r=>r.studentId===id);
  const isInside=id=>{const r=getRecord(id);return r&&!r.outTime;};
  const isDone=id=>{const r=getRecord(id);return r&&!!r.outTime;};

  const handleCheckin=async student=>{
    const rec=getRecord(student.id);
    if(rec&&!rec.outTime){setSuccessInfo({type:"already_in",student,time:rec.inTime});setView("success");setSearch("");return;}
    if(rec&&rec.outTime){setSuccessInfo({type:"already_out",student,inTime:rec.inTime,outTime:rec.outTime});setView("success");setSearch("");return;}
    const inTime=new Date().toISOString();
    const updated=[{id:Date.now(),studentId:student.id,inTime,outTime:null},...records];
    setRecords(updated);stor.set(`checkins:${selDate}`,updated);
    let ns="simulated";
    if(isConfigured&&student.parent){try{await sendSMS(settings.apiKey,settings.apiSecret,settings.from,student.parent,`은갈치영어학원 ${student.name} 학생이 ${fmtNotif(inTime)}에 재시실에 입실하였습니다.`);ns="sent";}catch{ns="failed";}}
    else if(!student.parent)ns="no_parent";
    setSuccessInfo({type:"in",student,time:inTime,notifStatus:ns});setView("success");setSearch("");
  };

  const handleCheckout=async student=>{
    const rec=getRecord(student.id);
    if(!rec||rec.outTime){setSuccessInfo({type:"not_in",student});setView("success");setSearch("");return;}
    const outTime=new Date().toISOString();
    const updated=records.map(r=>r.studentId===student.id?{...r,outTime}:r);
    setRecords(updated);stor.set(`checkins:${selDate}`,updated);
    let ns="simulated";
    if(isConfigured&&student.parent){try{await sendSMS(settings.apiKey,settings.apiSecret,settings.from,student.parent,`은갈치영어학원 ${student.name} 학생이 ${fmtNotif(outTime)}에 재시실에 퇴실하였습니다.`);ns="sent";}catch{ns="failed";}}
    else if(!student.parent)ns="no_parent";
    setSuccessInfo({type:"out",student,inTime:rec.inTime,outTime,notifStatus:ns});setView("success");setSearch("");
  };

  const handleSelect=s=>mode==="in"?handleCheckin(s):handleCheckout(s);
  const addToRetake=s=>{if(retakeIds.includes(s.id))return;const u=[...retakeIds,s.id];setRetakeIds(u);stor.set(`retake:${selDate}`,u);setRetakeSearch("");};
  const removeFromRetake=id=>{const u=retakeIds.filter(x=>x!==id);setRetakeIds(u);stor.set(`retake:${selDate}`,u);};
  const handleAdminLogin=()=>{if(adminPass===settings.adminPass){setAdminUnlocked(true);setAdminError(false);setTmpSettings({...settings});setView("dashboard");}else setAdminError(true);};
  const saveSettings=()=>{setSettings({...tmpSettings});stor.set("settings:eungalchi",tmpSettings);setSavedMsg(true);setTimeout(()=>setSavedMsg(false),2000);};

  const filteredStudents=search.length>0?students.filter(s=>kmatch(search,s.name)||kmatch(search,s.class)):[];
  const retakeFiltered=retakeSearch.length>0?students.filter(s=>(kmatch(retakeSearch,s.name)||kmatch(retakeSearch,s.class))&&!retakeIds.includes(s.id)):[];
  const allIds=[...new Set([...retakeIds,...records.map(r=>r.studentId)])];
  const unified=allIds.map(id=>{const student=students.find(s=>s.id===id);const rec=records.find(r=>r.studentId===id);const inRetake=retakeIds.includes(id);const status=rec?.outTime?"done":rec?"inside":inRetake?"pending":"extra";return{student,rec,inRetake,status};}).filter(x=>x.student).filter(x=>teacherFilter==="전체"||x.student.teacher===teacherFilter);
  const pending=unified.filter(x=>x.status==="pending");
  const inside=unified.filter(x=>x.status==="inside");
  const done=unified.filter(x=>x.status==="done");
  const dateShortcuts=[{label:"오늘",val:todayStr()},{label:"어제",val:new Date(Date.now()-86400000).toISOString().slice(0,10)},{label:"그제",val:new Date(Date.now()-172800000).toISOString().slice(0,10)}];
  const TABS=[{k:"checkin",l:"✏️ 체크인"},{k:"retake",l:"📋 재시명단"},{k:"dashboard",l:"📊 현황판"}];

  const S={
    page:{minHeight:"100vh",background:C.bg,fontFamily:"'Noto Sans KR','Apple SD Gothic Neo',sans-serif",color:C.text,maxWidth:800,margin:"0 auto"},
    card:{background:C.bgCard,borderRadius:16,border:`1px solid ${C.border}`,overflow:"hidden",marginBottom:16,boxShadow:"0 2px 8px rgba(249,115,22,0.08)"},
    cardHead:{padding:"13px 20px",background:C.bgSub,borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"},
    btn:{cursor:"pointer",transition:"all 0.2s",border:"none"},
  };

  // 로딩 화면
  if(loadState==="loading") return (
    <div style={{...S.page,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:52,marginBottom:16}}>🐟</div>
        <div style={{fontSize:18,fontWeight:700,color:C.primary,marginBottom:8}}>은갈치영어학원</div>
        <div style={{fontSize:15,color:C.textSub}}>구글 시트에서 학생 명단을 불러오는 중...</div>
        <div style={{marginTop:20,width:48,height:48,border:`4px solid ${C.border}`,borderTop:`4px solid ${C.primary}`,borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"20px auto"}}/>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  // 에러 화면
  if(loadState==="error") return (
    <div style={{...S.page,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{textAlign:"center",maxWidth:400}}>
        <div style={{fontSize:52,marginBottom:16}}>😅</div>
        <div style={{fontSize:18,fontWeight:700,color:C.red,marginBottom:8}}>명단을 불러올 수 없어요</div>
        <div style={{fontSize:14,color:C.textSub,marginBottom:6}}>구글 시트 연결에 실패했습니다</div>
        <div style={{fontSize:12,color:C.textFaint,background:C.redLt,borderRadius:10,padding:"8px 12px",marginBottom:20}}>{loadError}</div>
        <div style={{fontSize:13,color:C.textMd,marginBottom:20,lineHeight:1.7}}>
          ① 구글 시트 → 파일 → 웹에 게시 확인<br/>
          ② 탭 이름이 <b>{sheetName}</b> 인지 확인<br/>
          ③ 인터넷 연결 확인
        </div>
        <button onClick={()=>{setLoadState("loading");loadStudents(sheetName);}}
          style={{padding:"12px 32px",background:C.primary,color:"#fff",borderRadius:12,fontSize:15,fontWeight:700,border:"none",cursor:"pointer"}}>
          다시 시도
        </button>
      </div>
    </div>
  );

  return (
    <div style={S.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px}
        input,select,button{font-family:inherit;outline:none;-webkit-tap-highlight-color:transparent;}
        input::placeholder{color:${C.textFaint}}
        input:focus{outline:none !important;box-shadow:none;}
        button:focus{outline:none !important;box-shadow:none;}
        button{-webkit-appearance:none;}
        .row:hover{background:${C.primaryLt} !important;transform:translateX(4px)}
        .btn:hover{opacity:0.85}
        .pulse{animation:pulse 2s infinite}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        .pop{animation:pop 0.4s cubic-bezier(.34,1.56,.64,1)}@keyframes pop{from{transform:scale(0.6);opacity:0}to{transform:scale(1);opacity:1}}
        .fish{animation:swim 3s ease-in-out infinite;display:inline-block}@keyframes swim{0%,100%{transform:translateX(0)}50%{transform:translateX(6px) rotate(5deg)}}
        .spin{animation:spin 0.8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      {/* 헤더 */}
      <div style={{background:"linear-gradient(135deg,#FFF0E0,#FFE4C8)",borderBottom:`2px solid ${C.border}`,padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 12px rgba(249,115,22,0.12)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span className="fish" style={{fontSize:28}}>🐟</span>
          <div>
            <div style={{fontWeight:900,fontSize:20,color:C.primary}}>은갈치영어학원</div>
            <div style={{fontSize:11,color:C.textSub}}>
              {sheetName} 시트 · 명단 업데이트: {lastUpdated || "로딩중..."}
              {loadError && <span style={{color:C.amber}}> · {loadError}</span>}
            </div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button className="btn" onClick={forceRefresh} disabled={refreshing}
            style={{background:C.primaryLt,border:`1px solid ${C.border}`,borderRadius:10,padding:"6px 12px",fontSize:13,color:C.primary,fontWeight:700}}>
            {refreshing ? <span className="spin" style={{display:"inline-block"}}>🔄</span> : "🔄 새로고침"}
          </button>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:14,fontWeight:700,color:C.textMd,fontVariantNumeric:"tabular-nums"}}>{fmt(now)}</div>
            <div style={{fontSize:11,color:C.textSub}}>{fmtDateShort(now)}</div>
          </div>
        </div>
      </div>

      {/* 탭 */}
      <div style={{display:"flex",background:C.bgCard,borderBottom:`2px solid ${C.border}`}}>
        {TABS.map(t=>{const a=view===t.k||(view==="success"&&t.k==="checkin");return<button key={t.k} className="btn" onClick={()=>{if((t.k==="retake"||t.k==="dashboard")&&!adminUnlocked){setView("adminLogin");}else setView(t.k);}} style={{flex:1,padding:"14px 0",fontSize:15,fontWeight:700,background:a?C.primaryLt:"transparent",color:a?C.primary:C.textSub,borderBottom:a?`3px solid ${C.primary}`:"3px solid transparent"}}>{t.l}</button>;})}
      </div>

      {/* ── 체크인 ── */}
      {view==="checkin"&&(
        <div style={{padding:18,maxWidth:600,margin:"0 auto"}}>
          <div style={{display:"flex",gap:8,marginBottom:16,background:C.bgCard,borderRadius:14,padding:6,border:`1px solid ${C.border}`,boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
            {[{k:"in",l:"🚪 입실 체크인",bg:C.primary},{k:"out",l:"🏃 퇴실 체크아웃",bg:C.green}].map(m=>(
              <button key={m.k} className="btn" onClick={()=>setMode(m.k)} style={{flex:1,padding:"12px 0",borderRadius:10,fontSize:15,fontWeight:700,background:mode===m.k?m.bg:"transparent",color:mode===m.k?"#fff":C.textSub,boxShadow:mode===m.k?"0 2px 8px rgba(0,0,0,0.15)":"none"}}>{m.l}</button>
            ))}
          </div>

          {!isConfigured&&<div style={{background:"#FFFBEB",border:`1px solid ${C.amber}`,borderRadius:12,padding:"10px 14px",marginBottom:14,fontSize:13,color:"#92400E",fontWeight:500}}>⚠️ 알림톡 미설정 — 현황판 설정에서 솔라피 API를 입력해주세요</div>}

          {mode==="in"&&retakeIds.length>0&&(
            <div style={{...S.card,marginBottom:14}}>
              <div style={S.cardHead}><span style={{fontSize:14,fontWeight:700,color:C.amber}}>📋 오늘 재시 대상 ({retakeIds.length}명)</span></div>
              <div style={{padding:"10px 14px",display:"flex",flexWrap:"wrap",gap:8}}>
                {retakeIds.map(id=>{const s=students.find(x=>x.id===id);if(!s)return null;const insd=isInside(id),dnd=isDone(id);return<span key={id} style={{fontSize:14,padding:"6px 14px",borderRadius:20,cursor:insd||dnd?"default":"pointer",fontWeight:600,background:dnd?C.greenLt:insd?"#F0FFF4":C.amberLt,color:dnd?C.green:insd?"#15803D":C.amber,border:`1px solid ${dnd?"#86EFAC":insd?"#4ADE80":"#FCD34D"}`}} onClick={()=>!insd&&!dnd&&handleCheckin(s)}>{dnd?"✅":insd?"🟢":"⏳"} {s.name}</span>;})}
              </div>
            </div>
          )}

          <div style={{background:C.bgCard,borderRadius:14,padding:16,border:`1px solid ${C.border}`,marginBottom:14,boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
            <div style={{position:"relative"}}>
              <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:18}}>🔍</span>
              <input autoFocus value={search} onChange={e=>setSearch(e.target.value)} placeholder="이름/반 검색 (초성 가능 — ㄱㅈㅎ)"
                style={{width:"100%",background:C.bgSub,border:`2px solid ${C.border}`,borderRadius:12,color:C.text,fontSize:17,outline:"none",padding:"13px 14px 13px 44px"}}/>
            </div>
          </div>

          {search.length>0&&(
            <div style={S.card}>
              {filteredStudents.length===0
                ?<div style={{padding:40,textAlign:"center",color:C.textFaint,fontSize:16}}>😅 검색 결과가 없어요</div>
                :filteredStudents.map((s,i)=>{
                  const insd=isInside(s.id),dnd=isDone(s.id),isRt=retakeIds.includes(s.id),rec=getRecord(s.id);
                  let action;
                  if(mode==="in"){if(insd)action=<span style={{fontSize:13,color:C.green,fontWeight:700}}>🟢 {fmt(rec.inTime)}</span>;else if(dnd)action=<span style={{fontSize:13,color:C.textFaint}}>✅ 퇴실완료</span>;else action=<div style={{background:C.primary,color:"#fff",padding:"8px 18px",borderRadius:20,fontSize:14,fontWeight:700,boxShadow:"0 2px 6px rgba(249,115,22,0.4)"}}>입실</div>;}
                  else{if(insd)action=<div style={{background:C.green,color:"#fff",padding:"8px 18px",borderRadius:20,fontSize:14,fontWeight:700,boxShadow:"0 2px 6px rgba(22,163,74,0.4)"}}>퇴실</div>;else if(dnd)action=<span style={{fontSize:13,color:C.textFaint}}>이미퇴실</span>;else action=<span style={{fontSize:13,color:C.textFaint}}>미입실</span>;}
                  const clickable=mode==="in"?!insd&&!dnd:insd;
                  return(
                    <div key={s.id} className={clickable?"row btn":""} onClick={()=>clickable&&handleSelect(s)}
                      style={{padding:"14px 18px",borderBottom:i<filteredStudents.length-1?`1px solid ${C.borderSub}`:"none",display:"flex",alignItems:"center",justifyContent:"space-between",background:dnd?"#F9FAFB":insd?C.greenLt:C.bgCard,opacity:!clickable&&!insd?0.5:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:12}}>
                        <div style={{width:42,height:42,borderRadius:12,background:(GRADE_CLR[s.grade]||"#999")+"18",border:`2px solid ${(GRADE_CLR[s.grade]||"#999")}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:GRADE_CLR[s.grade]||"#999"}}>{s.grade||"??"}</div>
                        <div>
                          <div style={{fontWeight:700,fontSize:17,display:"flex",alignItems:"center",gap:6,color:C.text}}>
                            {s.name}
                            {isRt&&<span style={{fontSize:11,background:C.amberLt,color:C.amber,borderRadius:6,padding:"1px 7px",border:`1px solid #FCD34D`}}>재시</span>}
                          </div>
                          <div style={{fontSize:13,color:C.textSub,marginTop:1}}>{s.class} · {s.teacher}</div>
                        </div>
                      </div>
                      {action}
                    </div>
                  );
                })}
            </div>
          )}
          {search.length===0&&<div style={{textAlign:"center",padding:"48px 0",color:C.textFaint}}><div style={{fontSize:52,marginBottom:10}}>🐟</div><div style={{fontSize:15,color:C.textSub}}>재시대상 {retakeIds.length}명 · 입실중 {records.filter(r=>!r.outTime).length}명 · 퇴실완료 {records.filter(r=>r.outTime).length}명</div></div>}
        </div>
      )}

      {/* 성공 화면 */}
      {view==="success"&&successInfo&&(
        <div style={{padding:20,maxWidth:440,margin:"48px auto"}}>
          <div className="pop" style={{background:C.bgCard,border:`2px solid ${successInfo.type==="in"?C.green:successInfo.type==="out"?C.primary:C.amber}`,borderRadius:24,padding:"36px 28px",textAlign:"center",boxShadow:"0 8px 32px rgba(249,115,22,0.15)"}}>
            <div style={{fontSize:60,marginBottom:12}}>{successInfo.type==="in"?"🚪":successInfo.type==="out"?"🏃":"⚠️"}</div>
            <div style={{fontSize:26,fontWeight:900,color:C.text,marginBottom:4}}>{successInfo.student.name}</div>
            <div style={{fontSize:14,color:C.textSub,marginBottom:20}}>{successInfo.student.class}</div>
            {successInfo.type==="in"&&<div style={{background:C.greenLt,border:"1px solid #86EFAC",borderRadius:14,padding:"14px 16px",marginBottom:14}}><div style={{color:C.green,fontWeight:800,fontSize:18}}>✅ 입실 완료!</div><div style={{color:"#15803D",fontSize:14,marginTop:4}}>{fmt(successInfo.time)}</div></div>}
            {successInfo.type==="out"&&<div style={{background:C.primaryLt,border:`1px solid ${C.border}`,borderRadius:14,padding:"14px 16px",marginBottom:14}}><div style={{color:C.primary,fontWeight:800,fontSize:18}}>🏃 퇴실 완료!</div><div style={{color:C.primaryDk,fontSize:14,marginTop:4}}>{fmt(successInfo.outTime)}</div><div style={{color:C.textMd,fontSize:13,marginTop:4}}>소요시간: {elapsed(successInfo.inTime,successInfo.outTime)}</div></div>}
            {successInfo.type==="already_in"&&<div style={{background:C.amberLt,border:"1px solid #FCD34D",borderRadius:14,padding:"14px 16px",marginBottom:14}}><div style={{color:C.amber,fontWeight:700,fontSize:16}}>이미 입실 중입니다</div><div style={{color:"#92400E",fontSize:13,marginTop:4}}>{fmt(successInfo.time)}</div></div>}
            {successInfo.type==="already_out"&&<div style={{background:"#F9FAFB",border:`1px solid ${C.border}`,borderRadius:14,padding:"14px 16px",marginBottom:14}}><div style={{color:C.textSub,fontWeight:700,fontSize:16}}>이미 퇴실 완료</div></div>}
            {successInfo.type==="not_in"&&<div style={{background:C.amberLt,border:"1px solid #FCD34D",borderRadius:14,padding:"14px 16px",marginBottom:14}}><div style={{color:C.amber,fontWeight:700,fontSize:16}}>입실 기록이 없어요</div></div>}
            {(successInfo.type==="in"||successInfo.type==="out")&&<div style={{background:C.bgSub,border:`1px solid ${C.borderSub}`,borderRadius:12,padding:"10px 14px",marginBottom:16,textAlign:"left"}}><span style={{fontSize:13,color:C.textSub}}>📱 알림톡 </span><span style={{fontSize:13,fontWeight:700,color:successInfo.notifStatus==="sent"?C.green:successInfo.notifStatus==="failed"?C.red:C.amber}}>{successInfo.notifStatus==="sent"?"✅ 발송완료":successInfo.notifStatus==="failed"?"❌ 실패":successInfo.notifStatus==="no_parent"?"— 번호없음":"🔵 시뮬레이션"}</span></div>}
            <button className="btn" onClick={()=>setView("checkin")} style={{width:"100%",padding:15,background:C.primary,color:"#fff",borderRadius:14,fontSize:16,fontWeight:700,boxShadow:"0 4px 12px rgba(249,115,22,0.4)"}}>확인</button>
          </div>
        </div>
      )}

      {/* 관리자 로그인 */}
      {view==="adminLogin"&&(
        <div style={{padding:20,maxWidth:360,margin:"72px auto"}}>
          <div style={{background:C.bgCard,borderRadius:22,padding:36,border:`1px solid ${C.border}`,textAlign:"center",boxShadow:"0 4px 20px rgba(249,115,22,0.1)"}}>
            <div style={{fontSize:44,marginBottom:14}}>🔒</div>
            <div style={{fontWeight:900,fontSize:20,color:C.text,marginBottom:22}}>관리자 인증</div>
            <input type="password" value={adminPass} onChange={e=>setAdminPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAdminLogin()} placeholder="비밀번호"
              style={{width:"100%",background:C.bgSub,border:`2px solid ${adminError?C.red:C.border}`,borderRadius:12,color:C.text,fontSize:18,outline:"none",padding:"13px 16px",textAlign:"center",letterSpacing:8,marginBottom:10}}/>
            {adminError&&<div style={{color:C.red,fontSize:14,marginBottom:10,fontWeight:600}}>비밀번호가 틀렸습니다</div>}
            <button className="btn" onClick={handleAdminLogin} style={{width:"100%",padding:14,background:C.primary,color:"#fff",borderRadius:12,fontSize:16,fontWeight:700,boxShadow:"0 4px 12px rgba(249,115,22,0.35)",marginBottom:10}}>로그인</button>
            <button className="btn" onClick={()=>setView("checkin")} style={{background:"none",color:C.textSub,fontSize:14}}>취소</button>
          </div>
        </div>
      )}

      {/* 재시 명단 */}
      {view==="retake"&&(
        <div style={{padding:18,maxWidth:600,margin:"0 auto"}}>
          <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
            {dateShortcuts.map(d=>(<button key={d.val} className="btn" onClick={()=>setSelDate(d.val)} style={{padding:"9px 18px",borderRadius:20,fontSize:14,fontWeight:700,background:selDate===d.val?C.primary:C.bgCard,color:selDate===d.val?"#fff":C.textMd,border:`1px solid ${selDate===d.val?C.primary:C.border}`,boxShadow:selDate===d.val?"0 2px 8px rgba(249,115,22,0.3)":"none"}}>{d.label}</button>))}
            <input type="date" value={selDate} onChange={e=>setSelDate(e.target.value)} style={{flex:1,minWidth:140,background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:10,color:C.text,fontSize:14,outline:"none",padding:"9px 12px"}}/>
          </div>
          <div style={S.card}>
            <div style={S.cardHead}><span style={{fontSize:15,fontWeight:700,color:C.amber}}>📋 {selDate} 재시 대상자</span><span style={{fontSize:14,color:C.textSub,fontWeight:600}}>{retakeIds.length}명</span></div>
            <div style={{padding:16}}>
              <div style={{position:"relative",marginBottom:12}}>
                <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:16}}>➕</span>
                <input value={retakeSearch} onChange={e=>setRetakeSearch(e.target.value)} placeholder="학생 이름 검색 후 추가 (초성 가능)"
                  style={{width:"100%",background:C.bgSub,border:`2px solid ${C.border}`,borderRadius:12,color:C.text,fontSize:16,outline:"none",padding:"12px 14px 12px 42px"}}/>
              </div>
              {retakeSearch.length>0&&(<div style={{background:C.bgSub,borderRadius:12,border:`1px solid ${C.border}`,marginBottom:12,maxHeight:200,overflowY:"auto"}}>{retakeFiltered.length===0?<div style={{padding:20,textAlign:"center",color:C.textFaint,fontSize:14}}>검색 결과 없음</div>:retakeFiltered.slice(0,8).map((s,i)=>(<div key={s.id} className="row btn" onClick={()=>addToRetake(s)} style={{padding:"12px 16px",borderBottom:i<Math.min(retakeFiltered.length,8)-1?`1px solid ${C.borderSub}`:"none",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><span style={{fontWeight:700,fontSize:16,color:C.text}}>{s.name}</span><span style={{color:C.textSub,fontSize:13,marginLeft:8}}>{s.class}</span></div><span style={{fontSize:13,background:C.primary,color:"#fff",borderRadius:8,padding:"4px 12px",fontWeight:700}}>추가</span></div>))}</div>)}
              {retakeIds.length===0?<div style={{padding:32,textAlign:"center",color:C.textFaint,fontSize:15}}>등록된 학생이 없습니다<br/><span style={{fontSize:13}}>위에서 검색해 추가하세요</span></div>
              :retakeIds.map(id=>{const s=students.find(x=>x.id===id);if(!s)return null;const insd=isInside(id),dnd=isDone(id);return(<div key={id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 4px",borderBottom:`1px solid ${C.borderSub}`}}><div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:18}}>{dnd?"✅":insd?"🟢":"⏳"}</span><div><span style={{fontWeight:700,fontSize:16,color:dnd?C.green:insd?"#15803D":C.amber}}>{s.name}</span><span style={{color:C.textSub,fontSize:13,marginLeft:8}}>{s.class}</span></div></div><button className="btn" onClick={()=>removeFromRetake(id)} style={{background:C.redLt,color:C.red,border:`1px solid #FECACA`,borderRadius:8,padding:"5px 14px",fontSize:13,fontWeight:700}}>삭제</button></div>);})}
            </div>
          </div>
        </div>
      )}

      {/* 현황판 */}
      {view==="dashboard"&&(
        <div style={{padding:18,maxWidth:700,margin:"0 auto"}}>
          <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
            {dateShortcuts.map(d=>(<button key={d.val} className="btn" onClick={()=>setSelDate(d.val)} style={{padding:"9px 18px",borderRadius:20,fontSize:14,fontWeight:700,background:selDate===d.val?C.primary:C.bgCard,color:selDate===d.val?"#fff":C.textMd,border:`1px solid ${selDate===d.val?C.primary:C.border}`,boxShadow:selDate===d.val?"0 2px 8px rgba(249,115,22,0.3)":"none"}}>{d.label}</button>))}
            <input type="date" value={selDate} onChange={e=>setSelDate(e.target.value)} style={{flex:1,minWidth:140,background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:10,color:C.text,fontSize:14,outline:"none",padding:"9px 12px"}}/>
            <button className="btn" onClick={()=>exportCSV(selDate,records,retakeIds,students)} style={{padding:"9px 18px",borderRadius:20,fontSize:14,fontWeight:700,background:C.green,color:"#fff",border:"none",boxShadow:"0 2px 8px rgba(22,163,74,0.35)"}}>⬇️ CSV</button>
          </div>
          <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
            {TEACHERS.map(t=>(<button key={t} className="btn" onClick={()=>setTeacherFilter(t)} style={{padding:"7px 16px",borderRadius:20,fontSize:14,fontWeight:700,background:teacherFilter===t?"#7C3AED":C.bgCard,color:teacherFilter===t?"#fff":C.textMd,border:`1px solid ${teacherFilter===t?"#7C3AED":C.border}`,boxShadow:teacherFilter===t?"0 2px 8px rgba(124,58,237,0.3)":"none"}}>{t}</button>))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
            {[{l:"미응시",v:pending.length,c:C.amber,bg:C.amberLt,bd:"#FCD34D",icon:"⏳"},{l:"입실중",v:inside.length,c:C.green,bg:C.greenLt,bd:"#86EFAC",icon:"🟢"},{l:"퇴실완료",v:done.length,c:C.primary,bg:C.primaryLt,bd:C.border,icon:"✅"}].map(s=>(<div key={s.l} style={{background:s.bg,borderRadius:14,padding:"16px 12px",border:`1px solid ${s.bd}`,textAlign:"center"}}><div style={{fontSize:32,fontWeight:900,color:s.c}}>{s.v}</div><div style={{fontSize:13,color:s.c,marginTop:3,fontWeight:600}}>{s.l}</div></div>))}
          </div>
          {selDate===todayStr()&&<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><div className="pulse" style={{width:8,height:8,borderRadius:"50%",background:C.green}}/><span style={{fontSize:13,color:C.textSub,fontWeight:600}}>실시간 · {fmtDateShort(now)}</span></div>}
          {pending.length>0&&(<div style={S.card}><div style={{...S.cardHead,background:C.amberLt,borderBottom:"1px solid #FCD34D"}}><span style={{fontSize:14,fontWeight:700,color:C.amber}}>응시예정 (미입실)</span><span style={{fontSize:14,color:C.amber,fontWeight:700}}>{pending.length}명</span></div>{pending.map((x,i)=>(<div key={x.student.id} style={{padding:"13px 18px",borderBottom:i<pending.length-1?`1px solid ${C.borderSub}`:"none",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:8,height:8,borderRadius:"50%",background:C.amber}}/><span style={{fontWeight:700,fontSize:16,color:C.text}}>{x.student.name}</span><span style={{color:C.textSub,fontSize:13}}>{x.student.class}</span></div><span style={{fontSize:13,color:C.textMd,fontWeight:600}}>{x.student.teacher}</span></div>))}</div>)}
          {inside.length>0&&(<div style={S.card}><div style={{...S.cardHead,background:C.greenLt,borderBottom:"1px solid #86EFAC"}}><span style={{fontSize:14,fontWeight:700,color:C.green}}>입실 중</span><span style={{fontSize:14,color:C.green,fontWeight:700}}>{inside.length}명</span></div>{inside.map((x,i)=>(<div key={x.student.id} style={{padding:"13px 18px",borderBottom:i<inside.length-1?`1px solid ${C.borderSub}`:"none",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:8,height:8,borderRadius:"50%",background:C.green}}/><div><span style={{fontWeight:700,fontSize:16,color:C.text}}>{x.student.name}</span><span style={{color:C.textSub,fontSize:13,marginLeft:8}}>{x.student.class}</span></div></div><div style={{textAlign:"right"}}><div style={{fontSize:14,color:C.green,fontWeight:600}}>입실 {fmt(x.rec.inTime)}</div><div style={{fontSize:12,color:C.textFaint}}>경과 {elapsed(x.rec.inTime,now)}</div></div></div>))}</div>)}
          {done.length>0&&(<div style={S.card}><div style={{...S.cardHead,background:C.primaryLt,borderBottom:`1px solid ${C.border}`}}><span style={{fontSize:14,fontWeight:700,color:C.primary}}>퇴실 완료</span><span style={{fontSize:14,color:C.textSub,fontWeight:600}}>{done.length}명</span></div>{done.map((x,i)=>(<div key={x.student.id} style={{padding:"13px 18px",borderBottom:i<done.length-1?`1px solid ${C.borderSub}`:"none",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:8,height:8,borderRadius:"50%",background:C.primary}}/><div><span style={{fontWeight:700,fontSize:16,color:C.text}}>{x.student.name}</span><span style={{color:C.textSub,fontSize:13,marginLeft:8}}>{x.student.class}</span></div></div><div style={{textAlign:"right"}}><div style={{fontSize:13,color:C.textMd}}>{fmt(x.rec.inTime)} → {fmt(x.rec.outTime)}</div><div style={{fontSize:12,color:C.textFaint}}>{elapsed(x.rec.inTime,x.rec.outTime)}</div></div></div>))}</div>)}
          {unified.length===0&&<div style={{padding:56,textAlign:"center",color:C.textFaint}}><div style={{fontSize:44,marginBottom:12}}>📋</div><div style={{fontSize:16}}>해당 날짜에 기록이 없습니다</div></div>}

          {/* 설정 */}
          <div style={S.card}>
            <div style={S.cardHead}><span style={{fontSize:15,fontWeight:700,color:C.primary}}>⚙️ 솔라피 알림톡 설정</span></div>
            <div style={{padding:18}}>
              {[{l:"API Key",k:"apiKey",t:"text",p:"NCSNXXXXXXXXXXXXXX"},{l:"API Secret",k:"apiSecret",t:"password",p:"••••••••"},{l:"발신번호",k:"from",t:"text",p:"010-0000-0000"},{l:"관리자 비밀번호",k:"adminPass",t:"password",p:"기본: 1234"}].map(f=>(<div key={f.k} style={{marginBottom:14}}><div style={{fontSize:14,fontWeight:700,color:C.textMd,marginBottom:6}}>{f.l}</div><input type={f.t} placeholder={f.p} value={tmpSettings[f.k]||""} onChange={e=>setTmpSettings(p=>({...p,[f.k]:e.target.value}))} style={{width:"100%",background:C.bgSub,border:`2px solid ${C.border}`,borderRadius:12,color:C.text,fontSize:15,outline:"none",padding:"12px 14px"}}/></div>))}
              <button className="btn" onClick={saveSettings} style={{width:"100%",padding:14,background:savedMsg?C.green:C.primary,color:"#fff",borderRadius:12,fontSize:16,fontWeight:700,boxShadow:"0 4px 12px rgba(249,115,22,0.35)"}}>{savedMsg?"✅ 저장됐습니다!":"저장"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
