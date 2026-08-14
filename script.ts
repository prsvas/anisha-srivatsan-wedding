/**
 * Anisha & Srivatsan — Wedding RSVP Frontend
 *
 * IMPORTANT:
 * A GitHub Pages website cannot directly write to Gmail or Google Drive.
 * This TypeScript file sends the RSVP securely to a deployed Google Apps
 * Script Web App. The Apps Script then:
 *   1. Writes the RSVP to Google Sheets
 *   2. Sends an email to prsvas@gmail.com
 *   3. Updates the RSVP summary in Google Drive
 *
 * Replace RSVP_API_URL with your deployed Apps Script Web App URL.
 */

export const RSVP_API_URL =
  "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

export const WEDDING_WHATSAPP =
  "PASTE_WHATSAPP_NUMBER_WITH_COUNTRY_CODE_HERE";

export interface RSVPData {
  name: string;
  mobile: string;
  attendance: "Yes" | "No";
  adults: number;
  kids: number;
  kidsUnder5: number;
  kids5to12: number;
  kids13Plus: number;
  accommodation: "Yes" | "No";
  note: string;
  source: "Wedding Website";
}

export interface RSVPResponse {
  success: boolean;
  message?: string;
  data?: {
    totalGuests?: number;
  };
}

/**
 * Submit RSVP to Google Apps Script.
 */
export async function submitRSVP(data: RSVPData): Promise<RSVPResponse> {
  if (
    !RSVP_API_URL ||
    RSVP_API_URL.includes("PASTE_YOUR_GOOGLE_APPS_SCRIPT")
  ) {
    throw new Error(
      "RSVP backend is not configured. Add the Google Apps Script Web App URL to RSVP_API_URL."
    );
  }

  const payload: RSVPData = {
    ...data,
    name: data.name.trim(),
    mobile: data.mobile.trim(),
    note: data.note.trim(),
    source: "Wedding Website",
  };

  validateRSVP(payload);

  const response = await fetch(RSVP_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`RSVP server returned HTTP ${response.status}`);
  }

  const result: RSVPResponse = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Unable to submit RSVP.");
  }

  return result;
}

/**
 * Client-side validation.
 */
function validateRSVP(data: RSVPData): void {
  if (data.name.length < 2) {
    throw new Error("Please enter your name or family name.");
  }

  if (data.mobile.length < 5) {
    throw new Error("Please enter a valid mobile number.");
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

/**
 * Calculate the number of guests shown to the visitor.
 */
export function calculateTotalGuests(
  attendance: "Yes" | "No",
  adults: number,
  kids: number
): number {
  if (attendance !== "Yes") return 0;
  return Math.max(0, Number(adults || 0) + Number(kids || 0));
}

/**
 * WhatsApp contact link.
 */
export function getWhatsAppURL(
  message =
    "Dear Anisha & Srivatsan, thank you for inviting us. We are delighted to celebrate your wedding with you!"
): string {
  const number = WEDDING_WHATSAPP.replace(/\D/g, "");

  if (!number) {
    throw new Error("WhatsApp number has not been configured.");
  }

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * Example RSVP form integration.
 *
 * Expected HTML:
 *
 * <form id="rsvpForm">
 *   <input name="name">
 *   <input name="mobile">
 *   <input name="attendance">
 *   ...
 * </form>
 */
export async function handleRSVPFormSubmit(
  form: HTMLFormElement,
  statusElement?: HTMLElement,
  submitButton?: HTMLButtonElement
): Promise<void> {
  const formData = new FormData(form);

  const attendance =
    (formData.get("attendance") as "Yes" | "No") || "Yes";

  const adults =
    attendance === "Yes"
      ? Number(formData.get("adults") || 0)
      : 0;

  const kids =
    attendance === "Yes"
      ? Number(formData.get("kids") || 0)
      : 0;

  const payload: RSVPData = {
    name: String(formData.get("name") || ""),
    mobile: String(formData.get("mobile") || ""),
    attendance,
    adults,
    kids,
    kidsUnder5: formData.get("kidsUnder5") === "on" ? 1 : 0,
    kids5to12: formData.get("kids5to12") === "on" ? 1 : 0,
    kids13Plus: formData.get("kids13Plus") === "on" ? 1 : 0,
    accommodation:
      attendance === "Yes"
        ? ((formData.get("accommodation") as "Yes" | "No") || "No")
        : "No",
    note: String(formData.get("note") || ""),
    source: "Wedding Website",
  };

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "SENDING…";
  }

  if (statusElement) {
    statusElement.textContent = "Sending your RSVP…";
  }

  try {
    const result = await submitRSVP(payload);

    if (statusElement) {
      statusElement.textContent =
        result.message || "Your RSVP has been received. Thank you!";
    }

    form.reset();

    const total = calculateTotalGuests(
      payload.attendance,
      payload.adults,
      payload.kids
    );

    console.info(
      `RSVP confirmed for ${payload.name}. Total guests: ${total}`
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to submit RSVP.";

    if (statusElement) {
      statusElement.textContent =
        `${message} Please try again or contact us on WhatsApp.`;
    }

    throw error;
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = "CONFIRM RSVP";
    }
  }
}
