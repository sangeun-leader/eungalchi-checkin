import { useState, useEffect } from "react";

const SHEET_ID = "1ExoxPex-v2QYHYd92vpWqMYnkcDFkJTG_r_ktqZg6sI";
const getSheetName = () => { const n=new Date(); return `${n.getFullYear()}.${String(n.getMonth()+1).padStart(2,"0")}`; };
const getSheetUrl = s => `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(s)}`;

function parseCSVLine(line) {
  const r=[];let c="",inQ=false;
  for(let i=0;i<line.length;i++){const ch=line[i];if(ch==='"'){inQ=!inQ;}else if(ch===","&&!inQ){r.push(c);c="";}else c+=ch;}
  r.push(c);return r;
}
function parseStudents(csv) {
  const lines=csv.split("\n").map(l=>l.trim()).filter(Boolean);
  const students=[];
  for(let i=7;i<lines.length;i++){
    const cols=parseCSVLine(lines[i]);
    const name=(cols[4]||"").trim().replace(/"/g,"");
    if(!name||name==="이름")continue;
    const cls=(cols[1]||"").trim().replace(/"/g,"");
    const grade=(cols[2]||"").trim().replace(/"/g,"");
    const school=(cols[3]||"").trim().replace(/"/g,"");
    const teacher=(cols[5]||"").trim().replace(/"/g,"");
    const parent=(cols[8]||"").trim().replace(/"/g,"");
    if(!cls&&!grade)continue;
    students.push({id:`${name}||${cls}`,name,class:cls,grade,school,teacher,parent});
  }
  return students;
}
async function fetchStudents(){
  const res=await fetch(getSheetUrl(getSheetName()));
  if(!res.ok)throw new Error(`시트 로드 실패 (${res.status})`);
  return parseStudents(await res.text());
}

// ── 모던 인디고 팔레트 ──
const C={
  bg:"#F1F5F9", bgCard:"#FFFFFF", bgSub:"#F8FAFC",
  border:"#E2E8F0", borderSub:"#EEF2FF",
  primary:"#4F46E5", primaryDk:"#4338CA", primaryLt:"#EEF2FF",
  green:"#059669", greenLt:"#ECFDF5", greenBd:"#A7F3D0",
  amber:"#D97706", amberLt:"#FFFBEB", amberBd:"#FCD34D",
  red:"#DC2626", redLt:"#FEF2F2",
  purple:"#7C3AED", purpleLt:"#F5F3FF",
  text:"#0F172A", textMd:"#475569", textSub:"#94A3B8", textFaint:"#CBD5E1",
};
const GRADE_CLR={"중1":"#3B82F6","중2":"#10B981","중3":"#8B5CF6","고1":"#F97316","고2":"#EC4899","고3":"#EF4444"};
const TEACHERS=["전체","노미진","박혜린","김상은","김도은"];
const todayStr=()=>new Date().toISOString().slice(0,10);
const fmt=d=>new Date(d).toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
const fmtShort=d=>{const dt=new Date(d);const days=["일","월","화","수","목","금","토"];return `${String(dt.getMonth()+1).padStart(2,"0")}월 ${String(dt.getDate()).padStart(2,"0")}일(${days[dt.getDay()]})`};
const fmtNotif=d=>{const dt=new Date(d);const days=["일","월","화","수","목","금","토"];return `${String(dt.getMonth()+1).padStart(2,"0")}월 ${String(dt.getDate()).padStart(2,"0")}일(${days[dt.getDay()]}) ${String(dt.getHours()).padStart(2,"0")}:${String(dt.getMinutes()).padStart(2,"0")}:${String(dt.getSeconds()).padStart(2,"0")}`;};
const elapsed=(a,b)=>{const m=Math.floor((new Date(b)-new Date(a))/60000),s=Math.floor(((new Date(b)-new Date(a))%60000)/1000);return m>0?`${m}분 ${s}초`:`${s}초`;};
const toE164=p=>p.replace(/-/g,"").replace(/^0/,"82");
const CHOSUNG=['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const toCs=str=>[...str].map(c=>{const code=c.charCodeAt(0);return(code>=0xAC00&&code<=0xD7A3)?CHOSUNG[Math.floor((code-0xAC00)/588)]:c;}).join('');
const kmatch=(q,t)=>!q?false:t.includes(q)||toCs(t).includes(toCs(q));
const stor={get:k=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):null;}catch{return null;}},set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}}};

async function sendSMS(key,secret,from,to,text){
  const date=new Date().toISOString(),salt=Math.random().toString(36).slice(2,18);
  const enc=new TextEncoder(),k=await crypto.subtle.importKey("raw",enc.encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
  const sig=await crypto.subtle.sign("HMAC",k,enc.encode(date+salt));
  const hex=Array.from(new Uint8Array(sig)).map(b=>b.toString(16).padStart(2,"0")).join("");
  const res=await fetch("https://api.solapi.com/messages/v4/send",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`HMAC-SHA256 apiKey=${key}, date=${date}, salt=${salt}, signature=${hex}`},body:JSON.stringify({message:{to:toE164(to),from:toE164(from),text}})});
  if(!res.ok){const e=await res.json().catch(()=>({}));throw new Error(e.errorMessage||`HTTP ${res.status}`);}
}

function exportCSV(date,records,retakeIds,students){
  const header="날짜,이름,반,학년,학교,담당강사,재시대상,입실시각,퇴실시각,소요시간,상태";
  const rows=[];
  records.forEach(r=>{const s=students.find(x=>x.id===r.studentId);if(!s)return;const isRt=retakeIds.includes(s.id);rows.push([date,s.name,s.class,s.grade,s.school,s.teacher,isRt?"O":"",r.inTime?fmt(r.inTime):"",r.outTime?fmt(r.outTime):"",r.outTime?elapsed(r.inTime,r.outTime):"",r.outTime?"퇴실완료":"입실중"].join(","));});
  retakeIds.forEach(id=>{if(!records.find(r=>r.studentId===id)){const s=students.find(x=>x.id===id);if(!s)return;rows.push([date,s.name,s.class,s.grade,s.school,s.teacher,"O","","","","미응시"].join(","));}});
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob(["\uFEFF"+header+"\n"+rows.join("\n")],{type:"text/csv;charset=utf-8;"}));a.download=`은갈치영어학원_재시_${date}.csv`;a.click();
}

export default function App(){
  const [students,setStudents]=useState([]);
  const [loadState,setLoadState]=useState("loading");
  const [loadError,setLoadError]=useState("");
  const [lastUpdated,setLastUpdated]=useState("");
  const [sheetName]=useState(getSheetName());
  const [refreshing,setRefreshing]=useState(false);

  const [view,setView]=useState("checkin");
  const [mode,setMode]=useState("in");
  const [search,setSearch]=useState("");

  // 재시명단 관련
  const [retakeSearch,setRetakeSearch]=useState("");
  const [selectedIds,setSelectedIds]=useState(new Set()); // 체크된 학생들
  const [retakeTab,setRetakeTab]=useState("name"); // "name" | "class"

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

  const loadStudents=async(useCache=true)=>{
    setRefreshing(true);
    try{
      const cacheKey=`students:${sheetName}`;
      const cached=stor.get(cacheKey);
      if(useCache&&cached?.ts&&Date.now()-cached.ts<3600000&&cached.data?.length>0){
        setStudents(cached.data);
        setLastUpdated(new Date(cached.ts).toLocaleDateString("ko-KR",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}));
        setLoadState("ok");setRefreshing(false);return;
      }
      const data=await fetchStudents();
      stor.set(cacheKey,{data,ts:Date.now()});
      setStudents(data);
      setLastUpdated(new Date().toLocaleDateString("ko-KR",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}));
      setLoadState("ok");
    }catch(e){
      const cached=stor.get(`students:${sheetName}`);
      if(cached?.data?.length>0){setStudents(cached.data);setLastUpdated(new Date(cached.ts).toLocaleDateString("ko-KR",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}));setLoadState("ok");setLoadError("캐시 사용 중");}
      else{setLoadState("error");setLoadError(e.message);}
    }
    setRefreshing(false);
  };

  useEffect(()=>{
    const s=stor.get("settings:eungalchi")||{apiKey:"",apiSecret:"",from:"",adminPass:"1234"};
    setSettings(s);setTmpSettings(s);loadStudents();
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

  // ── 재시명단 ──
  const addToRetake=ids=>{
    const arr=Array.isArray(ids)?ids:[ids];
    const updated=[...new Set([...retakeIds,...arr])];
    setRetakeIds(updated);stor.set(`retake:${selDate}`,updated);
    setSelectedIds(new Set());setRetakeSearch("");
  };
  const removeFromRetake=id=>{const u=retakeIds.filter(x=>x!==id);setRetakeIds(u);stor.set(`retake:${selDate}`,u);};

  const toggleSelect=id=>{
    const s=new Set(selectedIds);
    if(s.has(id))s.delete(id);else s.add(id);
    setSelectedIds(s);
  };
  const toggleClass=(classStudents)=>{
    const ids=classStudents.map(s=>s.id);
    const allSelected=ids.every(id=>selectedIds.has(id));
    const s=new Set(selectedIds);
    if(allSelected)ids.forEach(id=>s.delete(id));else ids.forEach(id=>s.add(id));
    setSelectedIds(s);
  };

  // 반명 검색 결과 - 반별로 그룹핑
  const classSearchResults=()=>{
    if(!retakeSearch)return {};
    const filtered=students.filter(s=>(kmatch(retakeSearch,s.class)||kmatch(retakeSearch,s.name))&&!retakeIds.includes(s.id));
    const grouped={};
    filtered.forEach(s=>{
      if(!grouped[s.class])grouped[s.class]=[];
      grouped[s.class].push(s);
    });
    return grouped;
  };

  const handleAdminLogin=()=>{if(adminPass===settings.adminPass){setAdminUnlocked(true);setAdminError(false);setTmpSettings({...settings});setView("dashboard");}else setAdminError(true);};
  const saveSettings=()=>{setSettings({...tmpSettings});stor.set("settings:eungalchi",tmpSettings);setSavedMsg(true);setTimeout(()=>setSavedMsg(false),2000);};

  const filteredStudents=search.length>0?students.filter(s=>kmatch(search,s.name)||kmatch(search,s.class)):[];
  const allIds=[...new Set([...retakeIds,...records.map(r=>r.studentId)])];
  const unified=allIds.map(id=>{const student=students.find(s=>s.id===id);const rec=records.find(r=>r.studentId===id);const inRetake=retakeIds.includes(id);const status=rec?.outTime?"done":rec?"inside":inRetake?"pending":"extra";return{student,rec,inRetake,status};}).filter(x=>x.student).filter(x=>teacherFilter==="전체"||x.student.teacher===teacherFilter);
  const pending=unified.filter(x=>x.status==="pending");
  const inside=unified.filter(x=>x.status==="inside");
  const done=unified.filter(x=>x.status==="done");
  const dateShortcuts=[{l:"오늘",v:todayStr()},{l:"어제",v:new Date(Date.now()-86400000).toISOString().slice(0,10)},{l:"그제",v:new Date(Date.now()-172800000).toISOString().slice(0,10)}];
  const TABS=[{k:"checkin",l:"체크인"},{k:"retake",l:"재시명단"},{k:"dashboard",l:"현황판"}];

  const groupedResults=classSearchResults();
  const selectedArr=[...selectedIds];

  if(loadState==="loading")return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Noto Sans KR',sans-serif"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:16}}>🐟</div>
        <div style={{fontSize:17,fontWeight:700,color:C.primary,marginBottom:6}}>은갈치영어학원</div>
        <div style={{fontSize:14,color:C.textSub,marginBottom:24}}>구글 시트에서 학생 명단을 불러오는 중...</div>
        <div style={{width:40,height:40,border:`3px solid ${C.border}`,borderTop:`3px solid ${C.primary}`,borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto"}}/>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );
  if(loadState==="error")return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"'Noto Sans KR',sans-serif"}}>
      <div style={{textAlign:"center",maxWidth:380}}>
        <div style={{fontSize:44,marginBottom:12}}>😅</div>
        <div style={{fontSize:16,fontWeight:700,color:C.red,marginBottom:8}}>명단을 불러올 수 없어요</div>
        <div style={{fontSize:12,color:C.textSub,background:C.redLt,borderRadius:10,padding:"8px 12px",marginBottom:16}}>{loadError}</div>
        <div style={{fontSize:13,color:C.textMd,marginBottom:20,lineHeight:1.8}}>① 구글 시트 → 파일 → 웹에 게시 확인<br/>② 탭 이름이 <b>{sheetName}</b> 인지 확인</div>
        <button onClick={()=>{setLoadState("loading");loadStudents(false);}} style={{padding:"11px 28px",background:C.primary,color:"#fff",borderRadius:10,fontSize:14,fontWeight:700,border:"none",cursor:"pointer"}}>다시 시도</button>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'Noto Sans KR','Apple SD Gothic Neo',sans-serif",color:C.text,maxWidth:800,margin:"0 auto"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        input,select,button{font-family:inherit;outline:none !important;-webkit-tap-highlight-color:transparent;}
        button{-webkit-appearance:none;cursor:pointer;}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px}
        input::placeholder{color:${C.textFaint}}
        .row:hover{background:${C.primaryLt} !important}
        .row{transition:background 0.12s;cursor:pointer}
        .btn{transition:all 0.15s;border:none;cursor:pointer}
        .btn:hover{filter:brightness(0.93)}
        .btn:active{transform:scale(0.97)}
        .chip{transition:all 0.12s;cursor:pointer;user-select:none}
        .chip:hover{filter:brightness(0.95)}
        .pop{animation:pop 0.35s cubic-bezier(.34,1.56,.64,1)}
        @keyframes pop{from{transform:scale(0.7);opacity:0}to{transform:scale(1);opacity:1}}
        .fish{animation:swim 3s ease-in-out infinite;display:inline-block}
        @keyframes swim{0%,100%{transform:translateX(0)}50%{transform:translateX(5px) rotate(4deg)}}
        .pulse{animation:pulse 2s infinite}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        .spin{animation:spin2 0.8s linear infinite}@keyframes spin2{to{transform:rotate(360deg)}}
        .cb{width:20px;height:20px;border-radius:5px;border:2px solid ${C.border};display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.12s}
        .cb.on{background:${C.primary};border-color:${C.primary}}
      `}</style>

      {/* 헤더 */}
      <div style={{background:"#FFFFFF",borderBottom:`1px solid ${C.border}`,padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,boxShadow:"0 1px 6px rgba(0,0,0,0.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span className="fish" style={{fontSize:26}}>🐟</span>
          <div>
            <div style={{fontWeight:900,fontSize:18,color:C.primary,letterSpacing:-0.5}}>은갈치영어학원</div>
            <div style={{fontSize:11,color:C.textSub}}>명단 업데이트: {lastUpdated||"—"}{loadError&&<span style={{color:C.amber}}> · {loadError}</span>}</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button className="btn" onClick={()=>loadStudents(false)} disabled={refreshing}
            style={{background:C.primaryLt,border:`1px solid ${C.borderSub}`,borderRadius:8,padding:"6px 12px",fontSize:12,color:C.primary,fontWeight:700}}>
            {refreshing?<span className="spin" style={{display:"inline-block",fontSize:14}}>↻</span>:"↻ 새로고침"}
          </button>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:13,fontWeight:700,color:C.textMd,fontVariantNumeric:"tabular-nums"}}>{fmt(now)}</div>
            <div style={{fontSize:10,color:C.textSub}}>{fmtShort(now)}</div>
          </div>
        </div>
      </div>

      {/* 탭 */}
      <div style={{display:"flex",background:"#FFFFFF",borderBottom:`1px solid ${C.border}`}}>
        {TABS.map(t=>{const a=view===t.k||(view==="success"&&t.k==="checkin");return(
          <button key={t.k} className="btn" onClick={()=>{if((t.k==="retake"||t.k==="dashboard")&&!adminUnlocked){setView("adminLogin");}else setView(t.k);}}
            style={{flex:1,padding:"13px 0",fontSize:14,fontWeight:700,background:"transparent",color:a?C.primary:C.textSub,borderBottom:a?`2px solid ${C.primary}`:"2px solid transparent"}}>
            {t.l}
          </button>
        );})}
      </div>

      {/* ── 체크인 ── */}
      {view==="checkin"&&(
        <div style={{padding:18,maxWidth:600,margin:"0 auto"}}>
          {/* 모드 토글 */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:18}}>
            {[{k:"in",l:"입실 체크인",sub:"학생이 들어올 때",c:C.primary},{k:"out",l:"퇴실 체크아웃",sub:"학생이 나갈 때",c:C.green}].map(m=>(
              <button key={m.k} className="btn" onClick={()=>setMode(m.k)}
                style={{padding:"14px 16px",borderRadius:12,textAlign:"left",border:`2px solid ${mode===m.k?m.c:C.border}`,background:mode===m.k?m.c+"10":"#fff"}}>
                <div style={{fontSize:15,fontWeight:700,color:mode===m.k?m.c:C.textMd}}>{m.l}</div>
                <div style={{fontSize:11,color:mode===m.k?m.c:C.textSub,marginTop:2}}>{m.sub}</div>
              </button>
            ))}
          </div>

          {!isConfigured&&<div style={{background:"#FFFBEB",border:`1px solid ${C.amberBd}`,borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:13,color:"#92400E"}}>알림톡 미설정 — 현황판 설정에서 솔라피 API를 입력해주세요</div>}

          {/* 재시 대상 빠른 뱃지 */}
          {mode==="in"&&retakeIds.length>0&&(
            <div style={{background:"#fff",borderRadius:12,border:`1px solid ${C.border}`,padding:14,marginBottom:14}}>
              <div style={{fontSize:13,fontWeight:700,color:C.amber,marginBottom:10}}>오늘 재시 대상 ({retakeIds.length}명)</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {retakeIds.map(id=>{const s=students.find(x=>x.id===id);if(!s)return null;const insd=isInside(id),dnd=isDone(id);
                  return<span key={id} className={insd||dnd?"":"chip"} onClick={()=>!insd&&!dnd&&handleCheckin(s)}
                    style={{fontSize:13,padding:"5px 12px",borderRadius:20,fontWeight:600,
                      background:dnd?C.greenLt:insd?C.greenLt:C.amberLt,
                      color:dnd?C.green:insd?C.green:C.amber,
                      border:`1px solid ${dnd?C.greenBd:insd?C.greenBd:C.amberBd}`}}>
                    {dnd?"✓":insd?"●":"○"} {s.name}
                  </span>;
                })}
              </div>
            </div>
          )}

          {/* 검색창 - 크게 */}
          <div style={{background:"#fff",borderRadius:14,border:`2px solid ${search.length>0?C.primary:C.border}`,marginBottom:14,display:"flex",alignItems:"center",padding:"0 18px",boxShadow:search.length>0?`0 0 0 3px ${C.primaryLt}`:"none",transition:"all 0.2s"}}>
            <span style={{fontSize:20,color:C.textSub,marginRight:12}}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="이름 또는 반명 검색 (초성 가능)"
              style={{flex:1,border:"none",background:"transparent",fontSize:18,padding:"18px 0",color:C.text}}/>
            {search&&<button className="btn" onClick={()=>setSearch("")} style={{background:"none",color:C.textFaint,fontSize:18,padding:"0 4px"}}>✕</button>}
          </div>

          {search.length>0&&(
            <div style={{background:"#fff",borderRadius:14,border:`1px solid ${C.border}`,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
              {filteredStudents.length===0
                ?<div style={{padding:40,textAlign:"center",color:C.textFaint,fontSize:15}}>검색 결과가 없어요</div>
                :filteredStudents.map((s,i)=>{
                  const insd=isInside(s.id),dnd=isDone(s.id),isRt=retakeIds.includes(s.id),rec=getRecord(s.id);
                  let action;
                  if(mode==="in"){
                    if(insd)action=<span style={{fontSize:13,color:C.green,fontWeight:600,whiteSpace:"nowrap"}}>입실중 {fmt(rec.inTime)}</span>;
                    else if(dnd)action=<span style={{fontSize:13,color:C.textFaint}}>퇴실완료</span>;
                    else action=<div style={{background:C.primary,color:"#fff",padding:"8px 18px",borderRadius:20,fontSize:14,fontWeight:700,whiteSpace:"nowrap"}}>입실</div>;
                  }else{
                    if(insd)action=<div style={{background:C.green,color:"#fff",padding:"8px 18px",borderRadius:20,fontSize:14,fontWeight:700,whiteSpace:"nowrap"}}>퇴실</div>;
                    else if(dnd)action=<span style={{fontSize:13,color:C.textFaint}}>이미퇴실</span>;
                    else action=<span style={{fontSize:13,color:C.textFaint}}>미입실</span>;
                  }
                  const clickable=mode==="in"?!insd&&!dnd:insd;
                  return(
                    <div key={s.id} className={clickable?"row":""} onClick={()=>clickable&&handleSelect(s)}
                      style={{padding:"14px 18px",borderBottom:i<filteredStudents.length-1?`1px solid ${C.border}`:"none",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,background:insd?C.greenLt:"#fff",opacity:!clickable&&!insd?0.45:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:12,minWidth:0}}>
                        <div style={{width:40,height:40,borderRadius:10,background:(GRADE_CLR[s.grade]||"#999")+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:GRADE_CLR[s.grade]||"#999",flexShrink:0}}>{s.grade}</div>
                        <div style={{minWidth:0}}>
                          <div style={{fontWeight:700,fontSize:17,display:"flex",alignItems:"center",gap:6}}>
                            {s.name}
                            {isRt&&<span style={{fontSize:10,background:C.amberLt,color:C.amber,borderRadius:5,padding:"1px 6px",border:`1px solid ${C.amberBd}`,fontWeight:700}}>재시</span>}
                          </div>
                          <div style={{fontSize:12,color:C.textSub,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.class} · {s.teacher}</div>
                        </div>
                      </div>
                      <div style={{flexShrink:0}}>{action}</div>
                    </div>
                  );
                })}
            </div>
          )}
          {!search&&<div style={{textAlign:"center",padding:"52px 0",color:C.textFaint}}><div style={{fontSize:44,marginBottom:10}}>🐟</div><div style={{fontSize:14,color:C.textSub}}>재시대상 {retakeIds.length}명 · 입실중 {records.filter(r=>!r.outTime).length}명 · 퇴실완료 {records.filter(r=>r.outTime).length}명</div></div>}
        </div>
      )}

      {/* ── 성공 ── */}
      {view==="success"&&successInfo&&(
        <div style={{padding:20,maxWidth:420,margin:"48px auto"}}>
          <div className="pop" style={{background:"#fff",border:`2px solid ${successInfo.type==="in"?C.green:successInfo.type==="out"?C.primary:C.amber}`,borderRadius:20,padding:"32px 24px",textAlign:"center",boxShadow:"0 8px 32px rgba(0,0,0,0.10)"}}>
            <div style={{fontSize:52,marginBottom:10}}>{successInfo.type==="in"?"🚪":successInfo.type==="out"?"🏃":"⚠️"}</div>
            <div style={{fontSize:24,fontWeight:900,marginBottom:2}}>{successInfo.student.name}</div>
            <div style={{fontSize:13,color:C.textSub,marginBottom:18}}>{successInfo.student.class}</div>
            {successInfo.type==="in"&&<div style={{background:C.greenLt,border:`1px solid ${C.greenBd}`,borderRadius:12,padding:14,marginBottom:12}}><div style={{color:C.green,fontWeight:800,fontSize:17}}>입실 완료</div><div style={{color:C.green,fontSize:13,marginTop:3,opacity:0.8}}>{fmt(successInfo.time)}</div></div>}
            {successInfo.type==="out"&&<div style={{background:C.primaryLt,border:`1px solid #C7D2FE`,borderRadius:12,padding:14,marginBottom:12}}><div style={{color:C.primary,fontWeight:800,fontSize:17}}>퇴실 완료</div><div style={{color:C.primaryDk,fontSize:13,marginTop:3}}>{fmt(successInfo.outTime)}</div><div style={{color:C.textSub,fontSize:12,marginTop:4}}>소요: {elapsed(successInfo.inTime,successInfo.outTime)}</div></div>}
            {successInfo.type==="already_in"&&<div style={{background:C.amberLt,border:`1px solid ${C.amberBd}`,borderRadius:12,padding:14,marginBottom:12}}><div style={{color:C.amber,fontWeight:700,fontSize:15}}>이미 입실 중입니다</div><div style={{color:C.amber,fontSize:12,marginTop:3,opacity:0.8}}>{fmt(successInfo.time)}</div></div>}
            {successInfo.type==="already_out"&&<div style={{background:C.bg,borderRadius:12,padding:14,marginBottom:12}}><div style={{color:C.textSub,fontWeight:700,fontSize:15}}>이미 퇴실 완료</div></div>}
            {successInfo.type==="not_in"&&<div style={{background:C.amberLt,border:`1px solid ${C.amberBd}`,borderRadius:12,padding:14,marginBottom:12}}><div style={{color:C.amber,fontWeight:700,fontSize:15}}>입실 기록 없음</div></div>}
            {(successInfo.type==="in"||successInfo.type==="out")&&<div style={{background:C.bg,borderRadius:10,padding:"8px 12px",marginBottom:14,textAlign:"left",fontSize:12,color:C.textSub}}>알림톡: <span style={{fontWeight:700,color:successInfo.notifStatus==="sent"?C.green:successInfo.notifStatus==="failed"?C.red:C.amber}}>{successInfo.notifStatus==="sent"?"발송완료":successInfo.notifStatus==="failed"?"실패":successInfo.notifStatus==="no_parent"?"번호없음":"시뮬레이션"}</span></div>}
            <button className="btn" onClick={()=>setView("checkin")} style={{width:"100%",padding:14,background:C.primary,color:"#fff",borderRadius:12,fontSize:15,fontWeight:700}}>확인</button>
          </div>
        </div>
      )}

      {/* ── 관리자 로그인 ── */}
      {view==="adminLogin"&&(
        <div style={{padding:20,maxWidth:340,margin:"72px auto"}}>
          <div style={{background:"#fff",borderRadius:18,padding:32,border:`1px solid ${C.border}`,textAlign:"center",boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}}>
            <div style={{fontSize:40,marginBottom:12}}>🔒</div>
            <div style={{fontWeight:900,fontSize:18,marginBottom:20}}>관리자 인증</div>
            <input type="password" value={adminPass} onChange={e=>setAdminPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAdminLogin()} placeholder="비밀번호"
              style={{width:"100%",background:C.bgSub,border:`1px solid ${adminError?C.red:C.border}`,borderRadius:10,fontSize:17,padding:"13px 16px",textAlign:"center",letterSpacing:8,marginBottom:10,color:C.text}}/>
            {adminError&&<div style={{color:C.red,fontSize:13,marginBottom:10,fontWeight:600}}>비밀번호가 틀렸습니다</div>}
            <button className="btn" onClick={handleAdminLogin} style={{width:"100%",padding:13,background:C.primary,color:"#fff",borderRadius:10,fontSize:15,fontWeight:700,marginBottom:8}}>로그인</button>
            <button className="btn" onClick={()=>setView("checkin")} style={{background:"none",color:C.textSub,fontSize:13}}>취소</button>
          </div>
        </div>
      )}

      {/* ── 재시명단 ── */}
      {view==="retake"&&(
        <div style={{padding:18,maxWidth:600,margin:"0 auto"}}>
          {/* 날짜 */}
          <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
            {dateShortcuts.map(d=>(<button key={d.v} className="btn" onClick={()=>setSelDate(d.v)}
              style={{padding:"8px 16px",borderRadius:20,fontSize:13,fontWeight:700,background:selDate===d.v?C.primary:"#fff",color:selDate===d.v?"#fff":C.textMd,border:`1px solid ${selDate===d.v?C.primary:C.border}`}}>{d.l}</button>))}
            <input type="date" value={selDate} onChange={e=>setSelDate(e.target.value)}
              style={{flex:1,minWidth:130,background:"#fff",border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:13,padding:"8px 10px"}}/>
          </div>

          {/* 검색 탭 */}
          <div style={{display:"flex",gap:0,marginBottom:12,background:C.bg,borderRadius:10,padding:4,border:`1px solid ${C.border}`}}>
            {[{k:"name",l:"이름으로 추가"},{k:"class",l:"반 전체 선택"}].map(t=>(
              <button key={t.k} className="btn" onClick={()=>{setRetakeTab(t.k);setRetakeSearch("");setSelectedIds(new Set());}}
                style={{flex:1,padding:"9px 0",borderRadius:8,fontSize:13,fontWeight:700,background:retakeTab===t.k?"#fff":C.bg,color:retakeTab===t.k?C.primary:C.textSub,boxShadow:retakeTab===t.k?"0 1px 4px rgba(0,0,0,0.08)":"none"}}>
                {t.l}
              </button>
            ))}
          </div>

          {/* 검색 입력 */}
          <div style={{background:"#fff",borderRadius:12,border:`2px solid ${retakeSearch?C.primary:C.border}`,marginBottom:10,display:"flex",alignItems:"center",padding:"0 14px",transition:"all 0.2s"}}>
            <span style={{fontSize:16,color:C.textSub,marginRight:10}}>🔍</span>
            <input value={retakeSearch} onChange={e=>setRetakeSearch(e.target.value)}
              placeholder={retakeTab==="name"?"학생 이름 검색 (초성 가능)":"반명 검색 (예: 도원중3, 최강4실)"}
              style={{flex:1,border:"none",background:"transparent",fontSize:16,padding:"13px 0",color:C.text}}/>
            {retakeSearch&&<button className="btn" onClick={()=>{setRetakeSearch("");setSelectedIds(new Set());}} style={{background:"none",color:C.textFaint,fontSize:16}}>✕</button>}
          </div>

          {/* 이름 검색 모드 */}
          {retakeTab==="name"&&retakeSearch&&(
            <div style={{background:"#fff",borderRadius:12,border:`1px solid ${C.border}`,overflow:"hidden",marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,0.05)"}}>
              {students.filter(s=>kmatch(retakeSearch,s.name)&&!retakeIds.includes(s.id)).length===0
                ?<div style={{padding:24,textAlign:"center",color:C.textFaint,fontSize:14}}>검색 결과 없음</div>
                :students.filter(s=>kmatch(retakeSearch,s.name)&&!retakeIds.includes(s.id)).slice(0,10).map((s,i,arr)=>(
                  <div key={s.id} className="row" onClick={()=>addToRetake(s.id)}
                    style={{padding:"12px 16px",borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <span style={{fontWeight:700,fontSize:15}}>{s.name}</span>
                      <span style={{color:C.textSub,fontSize:12,marginLeft:8}}>{s.class} · {s.teacher}</span>
                    </div>
                    <span style={{fontSize:12,background:C.primaryLt,color:C.primary,borderRadius:6,padding:"3px 10px",fontWeight:700}}>추가</span>
                  </div>
                ))}
            </div>
          )}

          {/* 반 전체 선택 모드 */}
          {retakeTab==="class"&&retakeSearch&&(
            <div style={{marginBottom:12}}>
              {Object.keys(groupedResults).length===0
                ?<div style={{background:"#fff",borderRadius:12,padding:24,textAlign:"center",color:C.textFaint,fontSize:14,border:`1px solid ${C.border}`}}>검색 결과 없음</div>
                :Object.entries(groupedResults).map(([cls,clsStudents])=>{
                  const allSelected=clsStudents.every(s=>selectedIds.has(s.id));
                  const someSelected=clsStudents.some(s=>selectedIds.has(s.id));
                  return(
                    <div key={cls} style={{background:"#fff",borderRadius:12,border:`1px solid ${C.border}`,overflow:"hidden",marginBottom:10,boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
                      {/* 반 헤더 */}
                      <div style={{padding:"12px 16px",background:C.bgSub,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <div className={`cb${allSelected?" on":someSelected?" on":""}`}
                            style={{background:allSelected?C.primary:someSelected?"#A5B4FC":"transparent",borderColor:allSelected||someSelected?C.primary:C.border}}
                            onClick={()=>toggleClass(clsStudents)}>
                            {(allSelected||someSelected)&&<span style={{color:"#fff",fontSize:12,fontWeight:700}}>✓</span>}
                          </div>
                          <div>
                            <div style={{fontWeight:700,fontSize:14,color:C.text}}>{cls}</div>
                            <div style={{fontSize:11,color:C.textSub}}>{clsStudents.length}명</div>
                          </div>
                        </div>
                        <button className="btn" onClick={()=>toggleClass(clsStudents)}
                          style={{padding:"5px 12px",borderRadius:8,fontSize:12,fontWeight:700,background:allSelected?C.primaryLt:"#fff",color:allSelected?C.primary:C.textMd,border:`1px solid ${allSelected?C.primary:C.border}`}}>
                          {allSelected?"전체해제":"전체선택"}
                        </button>
                      </div>
                      {/* 학생 목록 */}
                      {clsStudents.map((s,i)=>(
                        <div key={s.id} className="row" onClick={()=>toggleSelect(s.id)}
                          style={{padding:"10px 16px",borderBottom:i<clsStudents.length-1?`1px solid ${C.border}`:"none",display:"flex",alignItems:"center",gap:12,background:selectedIds.has(s.id)?C.primaryLt:"#fff"}}>
                          <div className={`cb${selectedIds.has(s.id)?" on":""}`}>
                            {selectedIds.has(s.id)&&<span style={{color:"#fff",fontSize:12,fontWeight:700}}>✓</span>}
                          </div>
                          <div style={{flex:1}}>
                            <span style={{fontWeight:600,fontSize:14}}>{s.name}</span>
                            <span style={{fontSize:12,color:C.textSub,marginLeft:6}}>{s.teacher}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              {/* 선택 후 등록 버튼 */}
              {selectedArr.length>0&&(
                <div style={{position:"sticky",bottom:16,padding:"0 4px"}}>
                  <button className="btn" onClick={()=>addToRetake(selectedArr)}
                    style={{width:"100%",padding:"14px 0",background:C.primary,color:"#fff",borderRadius:12,fontSize:15,fontWeight:700,boxShadow:"0 4px 16px rgba(79,70,229,0.4)"}}>
                    선택한 {selectedArr.length}명 재시명단에 등록
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 등록된 명단 */}
          <div style={{background:"#fff",borderRadius:14,border:`1px solid ${C.border}`,overflow:"hidden"}}>
            <div style={{padding:"12px 16px",background:C.bgSub,borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:14,fontWeight:700,color:C.text}}>{selDate} 재시 대상자</span>
              <span style={{fontSize:13,color:C.textSub,fontWeight:600}}>{retakeIds.length}명</span>
            </div>
            {retakeIds.length===0
              ?<div style={{padding:32,textAlign:"center",color:C.textFaint,fontSize:14}}>등록된 학생이 없습니다<br/><span style={{fontSize:12}}>위에서 검색해 추가하세요</span></div>
              :retakeIds.map(id=>{
                const s=students.find(x=>x.id===id);if(!s)return null;
                const insd=isInside(id),dnd=isDone(id);
                return(
                  <div key={id} style={{padding:"11px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:dnd?C.green:insd?C.green:C.amber,flexShrink:0}}/>
                      <div>
                        <span style={{fontWeight:700,fontSize:14,color:dnd?C.green:insd?C.green:C.text}}>{s.name}</span>
                        <span style={{color:C.textSub,fontSize:12,marginLeft:6}}>{s.class}</span>
                      </div>
                      {dnd&&<span style={{fontSize:11,color:C.green,fontWeight:600}}>퇴실완료</span>}
                      {insd&&!dnd&&<span style={{fontSize:11,color:C.green,fontWeight:600}}>입실중</span>}
                    </div>
                    <button className="btn" onClick={()=>removeFromRetake(id)} style={{background:C.redLt,color:C.red,borderRadius:7,padding:"4px 12px",fontSize:12,fontWeight:700}}>삭제</button>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ── 현황판 ── */}
      {view==="dashboard"&&(
        <div style={{padding:18,maxWidth:700,margin:"0 auto"}}>
          <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
            {dateShortcuts.map(d=>(<button key={d.v} className="btn" onClick={()=>setSelDate(d.v)}
              style={{padding:"8px 16px",borderRadius:20,fontSize:13,fontWeight:700,background:selDate===d.v?C.primary:"#fff",color:selDate===d.v?"#fff":C.textMd,border:`1px solid ${selDate===d.v?C.primary:C.border}`}}>{d.l}</button>))}
            <input type="date" value={selDate} onChange={e=>setSelDate(e.target.value)}
              style={{flex:1,minWidth:130,background:"#fff",border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:13,padding:"8px 10px"}}/>
            <button className="btn" onClick={()=>exportCSV(selDate,records,retakeIds,students)}
              style={{padding:"8px 16px",borderRadius:20,fontSize:13,fontWeight:700,background:C.green,color:"#fff",boxShadow:"0 2px 8px rgba(5,150,105,0.3)"}}>
              CSV 다운로드
            </button>
          </div>

          {/* 강사 필터 */}
          <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
            {TEACHERS.map(t=>(<button key={t} className="btn" onClick={()=>setTeacherFilter(t)}
              style={{padding:"6px 14px",borderRadius:20,fontSize:13,fontWeight:700,background:teacherFilter===t?C.purple:"#fff",color:teacherFilter===t?"#fff":C.textMd,border:`1px solid ${teacherFilter===t?C.purple:C.border}`}}>{t}</button>))}
          </div>

          {/* 통계 */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
            {[{l:"미응시",v:pending.length,c:C.amber,bg:C.amberLt,bd:C.amberBd},{l:"입실중",v:inside.length,c:C.green,bg:C.greenLt,bd:C.greenBd},{l:"퇴실완료",v:done.length,c:C.primary,bg:C.primaryLt,bd:"#C7D2FE"}].map(s=>(
              <div key={s.l} style={{background:s.bg,borderRadius:14,padding:"18px 12px",border:`1px solid ${s.bd}`,textAlign:"center"}}>
                <div style={{fontSize:34,fontWeight:900,color:s.c}}>{s.v}</div>
                <div style={{fontSize:13,color:s.c,marginTop:4,fontWeight:600,opacity:0.8}}>{s.l}</div>
              </div>
            ))}
          </div>

          {selDate===todayStr()&&<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:12}}><div className="pulse" style={{width:7,height:7,borderRadius:"50%",background:C.green}}/><span style={{fontSize:12,color:C.textSub,fontWeight:600}}>실시간 · {fmtShort(now)}</span></div>}

          {[{title:"응시예정 (미입실)",list:pending,c:C.amber,bg:C.amberLt,bd:C.amberBd},{title:"현재 입실 중",list:inside,c:C.green,bg:C.greenLt,bd:C.greenBd},{title:"퇴실 완료",list:done,c:C.primary,bg:C.primaryLt,bd:"#C7D2FE"}].map(section=>
            section.list.length>0&&(
              <div key={section.title} style={{background:"#fff",borderRadius:14,border:`1px solid ${C.border}`,overflow:"hidden",marginBottom:12,boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
                <div style={{padding:"11px 16px",background:section.bg,borderBottom:`1px solid ${section.bd}`,display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontSize:13,fontWeight:700,color:section.c}}>{section.title}</span>
                  <span style={{fontSize:13,fontWeight:700,color:section.c}}>{section.list.length}명</span>
                </div>
                {section.list.map((x,i)=>(
                  <div key={x.student.id} style={{padding:"12px 16px",borderBottom:i<section.list.length-1?`1px solid ${C.border}`:"none",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:7,height:7,borderRadius:"50%",background:section.c,flexShrink:0}}/>
                      <div>
                        <span style={{fontWeight:700,fontSize:15}}>{x.student.name}</span>
                        <span style={{color:C.textSub,fontSize:12,marginLeft:6}}>{x.student.class}</span>
                      </div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      {x.rec?.inTime&&<div style={{fontSize:13,color:section.c,fontWeight:500}}>{fmt(x.rec.inTime)}{x.rec?.outTime&&` → ${fmt(x.rec.outTime)}`}</div>}
                      {x.rec?.outTime&&<div style={{fontSize:11,color:C.textFaint}}>{elapsed(x.rec.inTime,x.rec.outTime)}</div>}
                      {!x.rec&&<div style={{fontSize:12,color:C.textSub}}>{x.student.teacher}</div>}
                      {x.rec&&!x.rec.outTime&&<div style={{fontSize:11,color:C.textFaint}}>경과 {elapsed(x.rec.inTime,now)}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {unified.length===0&&<div style={{padding:52,textAlign:"center",color:C.textFaint}}><div style={{fontSize:40,marginBottom:10}}>📋</div><div style={{fontSize:15}}>해당 날짜에 기록이 없습니다</div></div>}

          {/* 설정 */}
          <div style={{background:"#fff",borderRadius:14,border:`1px solid ${C.border}`,overflow:"hidden",marginTop:8}}>
            <div style={{padding:"12px 16px",background:C.bgSub,borderBottom:`1px solid ${C.border}`}}><span style={{fontSize:14,fontWeight:700,color:C.text}}>솔라피 알림톡 설정</span></div>
            <div style={{padding:18}}>
              {[{l:"API Key",k:"apiKey",t:"text",p:"NCSNXXXXXXXXXXXXXX"},{l:"API Secret",k:"apiSecret",t:"password",p:"••••••••"},{l:"발신번호",k:"from",t:"text",p:"010-0000-0000"},{l:"관리자 비밀번호",k:"adminPass",t:"password",p:"기본: 1234"}].map(f=>(
                <div key={f.k} style={{marginBottom:12}}>
                  <div style={{fontSize:13,fontWeight:600,color:C.textMd,marginBottom:5}}>{f.l}</div>
                  <input type={f.t} placeholder={f.p} value={tmpSettings[f.k]||""} onChange={e=>setTmpSettings(p=>({...p,[f.k]:e.target.value}))}
                    style={{width:"100%",background:C.bgSub,border:`1px solid ${C.border}`,borderRadius:9,color:C.text,fontSize:14,padding:"10px 13px"}}/>
                </div>
              ))}
              <button className="btn" onClick={saveSettings}
                style={{width:"100%",padding:13,background:savedMsg?C.green:C.primary,color:"#fff",borderRadius:10,fontSize:14,fontWeight:700,marginTop:4}}>
                {savedMsg?"저장됐습니다!":"저장"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
