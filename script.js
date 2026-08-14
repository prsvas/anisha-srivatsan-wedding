/* Anisha & Srivatsan — Wedding Invitation interactions */
const GOOGLE_RSVP_URL = "https://docs.google.com/forms/d/e/1FAIpQLSf7F9U-8WirBwNMF10VO0LnKeDXTvqlBp_xLOjisa4AF6TtcQ/viewform";
const WHATSAPP_CONTACTS = {
  father: "917730097225",
  mother: "919701897225"
};
const WHATSAPP_MESSAGE = "Dear Anisha & Srivatsan, thank you for inviting us. We are delighted to celebrate your wedding with you!";

function initWhatsAppChooser(){
  const chooser=document.getElementById("whatsappChooser");
  const open=document.getElementById("whatsappRsvpBtn");
  const close=document.getElementById("whatsappClose");
  const father=document.getElementById("whatsappFather");
  const mother=document.getElementById("whatsappMother");
  if(!chooser||!open)return;
  const text=encodeURIComponent(WHATSAPP_MESSAGE);
  father.href=`https://wa.me/${WHATSAPP_CONTACTS.father}?text=${text}`;
  mother.href=`https://wa.me/${WHATSAPP_CONTACTS.mother}?text=${text}`;
  const hide=()=>{chooser.hidden=true;document.body.classList.remove("modal-open");open.focus();};
  open.addEventListener("click",()=>{chooser.hidden=false;document.body.classList.add("modal-open");close?.focus();});
  close?.addEventListener("click",hide);
  chooser.addEventListener("click",e=>{if(e.target===chooser)hide();});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!chooser.hidden)hide();});
}

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
  const el=document.getElementById("countdown");
  if(!el)return;
  const target=new Date("2026-10-25T08:00:00+05:30").getTime();
  const tick=()=>{
    const d=target-Date.now(); if(d<=0){el.textContent="The day has arrived";return;}
    const days=Math.floor(d/86400000),hours=Math.floor(d%86400000/3600000),mins=Math.floor(d%3600000/60000),secs=Math.floor(d%60000/1000);
    el.textContent=`${days} days · ${String(hours).padStart(2,"0")}h ${String(mins).padStart(2,"0")}m ${String(secs).padStart(2,"0")}s`;
  };
  tick();setInterval(tick,1000);
}

document.addEventListener("DOMContentLoaded",()=>{
  const formLink=document.getElementById("googleRsvp"); if(formLink)formLink.href=GOOGLE_RSVP_URL;
  initWhatsAppChooser(); initNavigation(); initReveal(); initCounters();
});
