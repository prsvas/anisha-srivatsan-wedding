/* Anisha & Srivatsan — Wedding Invitation interactions */
const GOOGLE_RSVP_URL = "https://docs.google.com/forms/d/e/1FAIpQLSf7F9U-8WirBwNMF10VO0LnKeDXTvqlBp_xLOjisa4AF6TtcQ/viewform";
const WHATSAPP_CONTACTS = {
  father: "917730097225",
  mother: "919701897225"
};
const WHATSAPP_MESSAGE = "Dear Anisha & Srivatsan, thank you for inviting us. We are delighted to celebrate your wedding with you!";



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
  const dEl=document.getElementById("countDays");
  const hEl=document.getElementById("countHours");
  const mEl=document.getElementById("countMinutes");
  const sEl=document.getElementById("countSeconds");
  if(!dEl||!hEl||!mEl||!sEl)return;
  const target=new Date("2026-10-25T08:00:00+05:30").getTime();
  const tick=()=>{
    const d=target-Date.now();
    if(d<=0){dEl.textContent="00";hEl.textContent="00";mEl.textContent="00";sEl.textContent="00";return;}
    dEl.textContent=String(Math.floor(d/86400000)).padStart(2,"0");
    hEl.textContent=String(Math.floor((d%86400000)/3600000)).padStart(2,"0");
    mEl.textContent=String(Math.floor((d%3600000)/60000)).padStart(2,"0");
    sEl.textContent=String(Math.floor((d%60000)/1000)).padStart(2,"0");
  };
  tick(); setInterval(tick,1000);
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

/* Mobile navigation */
document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.getElementById("menuButton");
  const menu = document.getElementById("menu");
  if (!menuButton || !menu) return;

  const closeMenu = () => {
    menu.classList.remove("open");
    menuButton.setAttribute("aria-label", "Open menu");
    menuButton.setAttribute("aria-expanded", "false");
  };

  menuButton.setAttribute("aria-expanded", "false");

  menuButton.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });
});
