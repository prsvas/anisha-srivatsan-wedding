/* =========================================================
   ANISHA & SRIVATSAN — GITHUB PAGES WEDDING INVITATION
   Browser-ready JavaScript
   ========================================================= */

const RSVP_API_URL =
  "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

const WEDDING_WHATSAPP =
  "PASTE_WHATSAPP_NUMBER_WITH_COUNTRY_CODE_HERE";

const weddingData = {
  bride: "Anisha Srinivas",
  groom: "Srivatsan Srikanth",
  date: "25 October 2026",
  venue: "Haryana Bhavan, Secunderabad",
  rsvpDeadline: "01 October 2026",
  rsvpMessage:
    "Dear Anisha & Srivatsan, thank you for inviting us. We are delighted to celebrate your wedding with you!"
};

/* ---------- Page-load reveal ---------- */
window.addEventListener("load", () => {
  window.setTimeout(() => {
    const loader = document.getElementById("loader");
    if (loader) loader.classList.add("hidden");
  }, 700);
});

/* ---------- Sticky navigation ---------- */
const nav = document.getElementById("nav");

window.addEventListener("scroll", () => {
  if (nav) nav.classList.toggle("scrolled", window.scrollY > 50);
}, { passive: true });

/* ---------- Mobile navigation ---------- */
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    menuBtn.setAttribute(
      "aria-expanded",
      String(navLinks.classList.contains("open"))
    );
  });

  document.querySelectorAll("#navLinks a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------- Scroll reveal ---------- */
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach((el) => {
    revealObserver.observe(el);
  });
} else {
  document.querySelectorAll(".reveal").forEach((el) => {
    el.classList.add("visible");
  });
}

/* ---------- WhatsApp ---------- */
function getWhatsAppURL(message) {
  const number = String(WEDDING_WHATSAPP || "").replace(/\D/g, "");
  if (!number) return "#";
  return "https://wa.me/" + number + "?text=" +
    encodeURIComponent(message || weddingData.rsvpMessage);
}

const whatsappLink = document.getElementById("whatsappLink");
if (whatsappLink) {
  whatsappLink.href = getWhatsAppURL(weddingData.rsvpMessage);
}

/* ---------- RSVP modal ---------- */
const modal = document.getElementById("rsvpModal");
const openRsvp = document.getElementById("openRsvp");
const closeRsvp = document.getElementById("closeRsvp");
const successClose = document.getElementById("successClose");
const form = document.getElementById("rsvpForm");
const formView = document.getElementById("formView");
const successView = document.getElementById("successView");
const successName = document.getElementById("successName");
const formStatus = document.getElementById("formStatus");
const submitButton = document.getElementById("submitRsvp");
const attendingFields = document.getElementById("attendingFields");
const totalGuests = document.getElementById("totalGuests");

function openRSVPModal() {
  if (!modal) return;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  if (formView) formView.hidden = false;
  if (successView) successView.hidden = true;
  if (formStatus) formStatus.textContent = "";
}

function closeRSVPModal() {
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

openRsvp?.addEventListener("click", openRSVPModal);
closeRsvp?.addEventListener("click", closeRSVPModal);
successClose?.addEventListener("click", closeRSVPModal);

modal?.addEventListener("click", (event) => {
  if (event.target === modal) closeRSVPModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (modal?.classList.contains("open")) closeRSVPModal();
    document.getElementById("lightbox")?.classList.remove("open");
  }
});

/* ---------- Guest counters ---------- */
function updateGuestTotal() {
  const adultsInput = document.getElementById("adults");
  const kidsInput = document.getElementById("kids");

  if (!adultsInput || !kidsInput) return;

  const adults = Number(adultsInput.value || 0);
  const kids = Number(kidsInput.value || 0);

  if (totalGuests) totalGuests.textContent = String(adults + kids);
}

document.querySelectorAll(".counter button").forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.target;
    const step = Number(button.dataset.step || 0);
    if (!target) return;

    const input = document.getElementById(target);
    if (!input) return;

    let value = Number(input.value || 0) + step;
    const minimum = target === "adults" ? 1 : 0;

    value = Math.max(minimum, Math.min(10, value));
    input.value = String(value);
    updateGuestTotal();
  });
});

/* ---------- Attendance Yes / No ---------- */
document.querySelectorAll('input[name="attendance"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    const selected = document.querySelector(
      'input[name="attendance"]:checked'
    );

    const attending = selected?.value === "Yes";

    if (attendingFields) {
      attendingFields.style.display = attending ? "block" : "none";
    }

    const adults = document.getElementById("adults");
    const kids = document.getElementById("kids");

    if (attending) {
      if (adults && Number(adults.value) < 1) adults.value = "1";
    } else {
      if (adults) adults.value = "0";
      if (kids) kids.value = "0";
    }

    updateGuestTotal();
  });
});

/* ---------- RSVP validation ---------- */
function validateRSVP(data) {
  if (!data.name || data.name.trim().length < 2) {
    throw new Error("Please enter your name or family name.");
  }

  if (!data.mobile || data.mobile.trim().length < 5) {
    throw new Error("Please enter a valid mobile number.");
  }

  if (data.attendance !== "Yes" && data.attendance !== "No") {
    throw new Error("Please select your attendance.");
  }

  if (data.attendance === "Yes") {
    if (!Number.isInteger(data.adults) || data.adults < 1 || data.adults > 10) {
      throw new Error("Adults must be between 1 and 10.");
    }

    if (!Number.isInteger(data.kids) || data.kids < 0 || data.kids > 10) {
      throw new Error("Children must be between 0 and 10.");
    }
  }
}

/* ---------- Send RSVP to Google Apps Script ---------- */
async function submitRSVP(data) {
  if (
    !RSVP_API_URL ||
    RSVP_API_URL.includes("PASTE_YOUR_GOOGLE_APPS_SCRIPT")
  ) {
    throw new Error(
      "The RSVP system is not configured yet. Please add the Google Apps Script Web App URL."
    );
  }

  validateRSVP(data);

  const response = await fetch(RSVP_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(
      "RSVP server returned HTTP " + response.status + "."
    );
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(
      result.message || "Unable to submit RSVP."
    );
  }

  return result;
}

/* ---------- RSVP form ---------- */
form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form) return;

  if (formStatus) formStatus.textContent = "";

  const formData = new FormData(form);

  const attendance =
    formData.get("attendance") === "No" ? "No" : "Yes";

  const adults =
    attendance === "Yes"
      ? Number(formData.get("adults") || 0)
      : 0;

  const kids =
    attendance === "Yes"
      ? Number(formData.get("kids") || 0)
      : 0;

  const payload = {
    name: String(formData.get("name") || "").trim(),
    mobile: String(formData.get("mobile") || "").trim(),
    attendance: attendance,
    adults: adults,
    kids: kids,
    kidsUnder5: formData.get("kidsUnder5") === "on" ? 1 : 0,
    kids5to12: formData.get("kids5to12") === "on" ? 1 : 0,
    kids13Plus: formData.get("kids13Plus") === "on" ? 1 : 0,
    accommodation:
      attendance === "Yes"
        ? (formData.get("accommodation") || "No")
        : "No",
    note: String(formData.get("note") || "").trim(),
    source: "Wedding Website"
  };

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "SENDING…";
  }

  if (formStatus) {
    formStatus.textContent = "Sending your RSVP…";
  }

  try {
    const result = await submitRSVP(payload);

    if (successName) {
      successName.textContent =
        "Thank you, " + payload.name + ".";
    }

    if (formView) formView.hidden = true;
    if (successView) successView.hidden = false;

    form.reset();

    const adultsInput = document.getElementById("adults");
    const kidsInput = document.getElementById("kids");

    if (adultsInput) adultsInput.value = "1";
    if (kidsInput) kidsInput.value = "0";

    if (attendingFields) attendingFields.style.display = "block";

    updateGuestTotal();

    console.info("RSVP successfully recorded.", result);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to submit RSVP.";

    if (formStatus) {
      formStatus.textContent =
        message +
        " Please try again or contact us on WhatsApp.";
    }

    console.error("RSVP submission error:", error);
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = "CONFIRM RSVP";
    }
  }
});

/* ---------- Gallery lightbox ---------- */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const closeLightbox = document.getElementById("closeLightbox");

document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("click", () => {
    if (!lightbox || !lightboxImg) return;

    const background =
      getComputedStyle(item).backgroundImage;

    const match =
      background.match(/url\(["']?(.*?)["']?\)/);

    if (!match || !match[1]) return;

    lightboxImg.src = match[1];
    lightbox.classList.add("open");
  });
});

closeLightbox?.addEventListener("click", () => {
  lightbox?.classList.remove("open");
});

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    lightbox.classList.remove("open");
  }
});

/* ---------- Initial state ---------- */
updateGuestTotal();
