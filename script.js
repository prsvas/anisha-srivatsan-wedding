
const RSVP_API_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
const WEDDING_WHATSAPP = "PASTE_YOUR_WHATSAPP_NUMBER_HERE";

window.addEventListener("load", () => {
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:.12});
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
});

const siteNav=document.getElementById("siteNav");
window.addEventListener("scroll",()=>siteNav?.classList.toggle("scrolled",window.scrollY>50),{passive:true});

const menuButton=document.getElementById("menuButton");
const menu=document.getElementById("menu");
menuButton?.addEventListener("click",()=>menu?.classList.toggle("open"));
document.querySelectorAll("#menu a").forEach(a=>a.addEventListener("click",()=>menu?.classList.remove("open")));

const whatsapp=document.getElementById("whatsapp");
if(whatsapp){
  const number=String(WEDDING_WHATSAPP).replace(/\D/g,"");
  const message="Dear Anisha & Srivatsan, thank you for inviting us. We are delighted to celebrate your wedding with you!";
  whatsapp.href=number?`https://wa.me/${number}?text=${encodeURIComponent(message)}`:"#";
}

const modal=document.getElementById("rsvpModal");
const form=document.getElementById("rsvpForm");
const formView=document.getElementById("rsvpFormView");
const success=document.getElementById("success");
const status=document.getElementById("status");
const submit=document.getElementById("submitRsvp");
const guestFields=document.getElementById("guestFields");
const total=document.getElementById("total");

function openModal(){modal?.classList.add("open");modal?.setAttribute("aria-hidden","false");document.body.style.overflow="hidden"}
function closeModal(){modal?.classList.remove("open");modal?.setAttribute("aria-hidden","true");document.body.style.overflow=""}
document.getElementById("rsvpButton")?.addEventListener("click",openModal);
document.getElementById("closeModal")?.addEventListener("click",closeModal);
document.getElementById("done")?.addEventListener("click",closeModal);
modal?.addEventListener("click",e=>{if(e.target===modal)closeModal()});

function updateTotal(){
  const adults=Number(document.getElementById("adults")?.value||0);
  const kids=Number(document.getElementById("kids")?.value||0);
  if(total)total.textContent=String(adults+kids);
}
document.querySelectorAll(".counter button").forEach(button=>{
  button.addEventListener("click",()=>{
    const input=document.getElementById(button.dataset.field);
    if(!input)return;
    let value=Number(input.value||0)+Number(button.dataset.change||0);
    const min=button.dataset.field==="adults"?1:0;
    input.value=String(Math.max(min,Math.min(10,value)));
    updateTotal();
  });
});

document.querySelectorAll('input[name="attendance"]').forEach(radio=>{
  radio.addEventListener("change",()=>{
    const yes=document.querySelector('input[name="attendance"]:checked')?.value==="Yes";
    if(guestFields)guestFields.style.display=yes?"block":"none";
    const adults=document.getElementById("adults");
    const kids=document.getElementById("kids");
    if(yes){if(adults&&Number(adults.value)<1)adults.value="1"}
    else{if(adults)adults.value="0";if(kids)kids.value="0"}
    updateTotal();
  });
});

form?.addEventListener("submit",async e=>{
  e.preventDefault();
  if(RSVP_API_URL.includes("PASTE_YOUR")){
    if(status)status.textContent="The RSVP connection will be added in the next step. The invitation itself is ready.";
    return;
  }
  const fd=new FormData(form);
  const attendance=fd.get("attendance")==="No"?"No":"Yes";
  const payload={
    name:String(fd.get("name")||"").trim(),
    mobile:String(fd.get("mobile")||"").trim(),
    attendance,
    adults:attendance==="Yes"?Number(fd.get("adults")||0):0,
    kids:attendance==="Yes"?Number(fd.get("kids")||0):0,
    kidsUnder5:fd.get("kidsUnder5")==="on"?1:0,
    kids5to12:fd.get("kids5to12")==="on"?1:0,
    kids13Plus:fd.get("kids13Plus")==="on"?1:0,
    accommodation:attendance==="Yes"?String(fd.get("accommodation")||"No"):"No",
    note:String(fd.get("note")||"").trim(),
    source:"Wedding Website"
  };
  if(!payload.name||!payload.mobile){if(status)status.textContent="Please enter your name and mobile number.";return}
  submit.disabled=true;submit.textContent="SENDING…";if(status)status.textContent="Sending your RSVP…";
  try{
    const response=await fetch(RSVP_API_URL,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(payload)});
    if(!response.ok)throw new Error("Server error");
    const result=await response.json();
    if(!result.success)throw new Error(result.message||"Unable to submit RSVP");
    document.getElementById("successName").textContent=`Thank you, ${payload.name}.`;
    formView.hidden=true;success.hidden=false;form.reset();
    document.getElementById("adults").value="1";document.getElementById("kids").value="0";updateTotal();
  }catch(err){if(status)status.textContent="We couldn't complete your RSVP. Please try again or contact us on WhatsApp.";console.error(err)}
  finally{submit.disabled=false;submit.textContent="CONFIRM RSVP"}
});
updateTotal();
