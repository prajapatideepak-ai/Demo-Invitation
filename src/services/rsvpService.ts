/**
 * RSVP service
 * ------------------------------------------------------------------
 * All RSVP side effects live here so the form component only deals with
 * UI state. Today responses are simulated + kept in localStorage for the
 * current browser only. To connect a real backend or an external form
 * service later, set RSVP_ENDPOINT (or replace `deliver()`) — the form
 * markup does not have to change.
 *
 * IMPORTANT: with no backend configured, responses are NOT sent to the
 * couple. They stay in this browser (and are cleared when site data is
 * cleared). The UI states this to the guest.
 */

export type AttendingChoice = "yes" | "no";

export interface RsvpPayload {
  name: string;
  contact: string;
  attending: AttendingChoice;
  guestCount: number;
  /** ids from `weddingEvents` */
  events: string[];
  message: string;
}

export interface RsvpSubmission extends RsvpPayload {
  id: string;
  submittedAt: string;
}

export interface RsvpResult {
  ok: boolean;
  message: string;
  /** True when delivery was only simulated (no backend configured). */
  storedLocally: boolean;
  submission?: RsvpSubmission;
}

export type RsvpErrors = Partial<Record<keyof RsvpPayload, string>>;

/** Set this to your endpoint (e.g. a form service) to enable real delivery. */
export const RSVP_ENDPOINT: string | null = null;

const STORAGE_KEY = "wedding.rsvp.responses";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^[+]?[\d][\d\s-]{6,15}$/;

export const EMPTY_RSVP: RsvpPayload = {
  name: "",
  contact: "",
  attending: "yes",
  guestCount: 1,
  events: [],
  message: "",
};

export const MAX_MESSAGE_LENGTH = 500;

export function validateRsvp(values: RsvpPayload): RsvpErrors {
  const errors: RsvpErrors = {};

  const name = values.name.trim();
  if (!name) {
    errors.name = "Please tell us your name so we know who to expect.";
  } else if (name.length < 2) {
    errors.name = "That name looks a little short.";
  }

  const contact = values.contact.trim();
  if (contact && !EMAIL_PATTERN.test(contact) && !PHONE_PATTERN.test(contact)) {
    errors.contact = "Enter a valid email address or phone number, or leave it blank.";
  }

  if (values.attending === "yes") {
    if (!Number.isFinite(values.guestCount) || values.guestCount < 1) {
      errors.guestCount = "At least one guest, please.";
    } else if (values.guestCount > 10) {
      errors.guestCount = "For more than 10 guests, please call us directly.";
    }
    if (values.events.length === 0) {
      errors.events = "Pick at least one function you'll be joining.";
    }
  }

  if (values.message.length > MAX_MESSAGE_LENGTH) {
    errors.message = `Please keep it under ${MAX_MESSAGE_LENGTH} characters.`;
  }

  return errors;
}

export function isRsvpValid(errors: RsvpErrors): boolean {
  return Object.keys(errors).length === 0;
}

function readStored(): RsvpSubmission[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as RsvpSubmission[]) : [];
  } catch {
    return [];
  }
}

export function getStoredSubmissions(): RsvpSubmission[] {
  return readStored();
}

export function clearStoredSubmissions(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage can be unavailable in private mode — nothing to do */
  }
}

function persist(submission: RsvpSubmission): void {
  if (typeof window === "undefined") return;
  try {
    const next = [...readStored(), submission].slice(-30);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* quota / private mode: the in-memory confirmation still stands */
  }
}

async function deliver(payload: RsvpPayload): Promise<RsvpSubmission> {
  const submission: RsvpSubmission = {
    ...payload,
    name: payload.name.trim(),
    contact: payload.contact.trim(),
    message: payload.message.trim(),
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `rsvp-${Date.now()}`,
    submittedAt: new Date().toISOString(),
  };

  if (RSVP_ENDPOINT) {
    const response = await fetch(RSVP_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission),
    });
    if (!response.ok) {
      throw new Error(`RSVP endpoint responded with ${response.status}`);
    }
    return submission;
  }

  // No backend configured: simulate the round trip so the UI can be
  // reviewed end to end, then keep the answer in this browser only.
  await new Promise((resolve) => window.setTimeout(resolve, 900));
  persist(submission);
  return submission;
}

export async function submitRsvp(payload: RsvpPayload): Promise<RsvpResult> {
  const errors = validateRsvp(payload);
  if (!isRsvpValid(errors)) {
    return { ok: false, message: "Please fix the highlighted fields.", storedLocally: false };
  }

  try {
    const submission = await deliver(payload);
    return {
      ok: true,
      storedLocally: !RSVP_ENDPOINT,
      submission,
      message: RSVP_ENDPOINT
        ? "Thank you — your RSVP has been sent."
        : "Thank you! Your RSVP is saved in this browser.",
    };
  } catch {
    return {
      ok: false,
      storedLocally: false,
      message: "Something went wrong while sending your RSVP. Please try again.",
    };
  }
}

/** Small helper for a readable summary of the chosen functions. */
export function describeEvents(ids: string[], labels: Record<string, string>): string {
  if (ids.length === 0) return "None selected";
  return ids.map((id) => labels[id] ?? id).join(" · ");
}
