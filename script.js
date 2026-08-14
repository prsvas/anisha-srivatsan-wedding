/* Anisha & Srivatsan — Wedding Invitation interactions */
const GOOGLE_RSVP_URL = "https://docs.google.com/forms/d/e/1FAIpQLSf7F9U-8WirBwNMF10VO0LnKeDXTvqlBp_xLOjisa4AF6TtcQ/viewform";

function initNavigation(){
  const header=document.querySelector("header");
  const onScroll=()=>header?.classList.toggle("scrolled",window.scrollY>30);
  window.addEventListener("scroll",onScroll,{passive:true}); onScroll();
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener("click",e=>{
    const id=a.getAttribute("href"); if(!id||id==="#")return;
    const target=document.querySelector(id); if(target){e.preventDefault();target.scrollIntoView({behavior:"smooth",block:"start"});}
  }));
}

function initReveal(){
  const items=document.querySelectorAll(".reveal,.fade");
  if(!("IntersectionObserver" in window)){items.forEach(x=>x.classList.add("visible"));return;}
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target);}}),{threshold:.12});
  items.forEach(x=>observer.observe(x));
}

function initCounters(){
  const heroEl=document.getElementById("countdown");
  const closingEl=document.getElementById("closingCountdown");
  if(!heroEl && !closingEl)return;

  // Wedding ceremony start: 25 October 2026, 08:00 IST (Asia/Kolkata).
  const target=Date.parse("2026-10-25T08:00:00+05:30");

  const format=(ms)=>{
    if(ms<=0)return "The day has arrived";
    const totalSeconds=Math.floor(ms/1000);
    const days=Math.floor(totalSeconds/86400);
    const hours=Math.floor((totalSeconds%86400)/3600);
    const mins=Math.floor((totalSeconds%3600)/60);
    const secs=totalSeconds%60;
    return `${days} days · ${String(hours).padStart(2,"0")}h ${String(mins).padStart(2,"0")}m ${String(secs).padStart(2,"0")}s`;
  };

  const tick=()=>{
    const text=format(target-Date.now());
    if(heroEl)heroEl.textContent=text;
    if(closingEl)closingEl.textContent=text;
  };

  tick();
  window.setInterval(tick,1000);
}


document.addEventListener("DOMContentLoaded",()=>{
  const formLink=document.getElementById("googleRsvp"); if(formLink)formLink.href=GOOGLE_RSVP_URL;
  initNavigation(); initReveal(); initCounters();
});

/* Wedding music — user-initiated ON/OFF toggle */
function initWeddingMusic(){
  const music=document.getElementById("weddingMusic");
  const toggle=document.getElementById("musicToggle");
  if(!music||!toggle)return;
  const setState=(playing)=>{
    toggle.classList.toggle("playing",playing);
    toggle.setAttribute("aria-pressed",String(playing));
    toggle.setAttribute("aria-label",playing?"Pause wedding music":"Play wedding music");
  };
  toggle.addEventListener("click",async()=>{
    if(music.paused){
      try{await music.play();setState(true);}catch(e){console.warn("Wedding music could not start:",e);}
    }else{
      music.pause();setState(false);
    }
  });
  music.addEventListener("ended",()=>setState(false));
}


document.addEventListener("DOMContentLoaded", initWeddingMusic);


// Section down-arrow navigation
document.querySelectorAll(".slide-down").forEach(link=>link.addEventListener("click",e=>{
  const id=link.getAttribute("href");
  const target=id?document.querySelector(id):null;
  if(target){e.preventDefault();target.scrollIntoView({behavior:"smooth",block:"start"});}
}));
