import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader, Mail, Phone, Send, Users, X } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { weddingConfig } from "../config/weddingConfig";
import { eventOptions } from "../config/weddingEvents";
import {
  clearStoredSubmissions,
  describeEvents,
  EMPTY_RSVP,
  getStoredSubmissions,
  isRsvpValid,
  MAX_MESSAGE_LENGTH,
  submitRsvp,
  validateRsvp,
  type AttendingChoice,
  type RsvpErrors,
  type RsvpPayload,
  type RsvpResult,
} from "../services/rsvpService";
import { cn } from "../utils/cn";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const INPUT_CLASS =
  "w-full rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-soft focus:border-accent focus:ring-2 focus:ring-accent/25";

function Field({
  htmlFor,
  label,
  error,
  hint,
  required,
  children,
}: {
  htmlFor: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-[0.6rem] uppercase tracking-[0.26em] text-ink-soft"
      >
        {label}
        {required && <span className="text-accent"> *</span>}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="text-[0.7rem] text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p className="text-[0.68rem] text-ink-soft">{hint}</p>
      ) : null}
    </div>
  );
}

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Front-end RSVP form.
 * Validation, error messaging, a simulated submit state and a success
 * confirmation are all handled here; persistence/delivery lives in
 * src/services/rsvpService.ts. With no backend configured the answer is
 * kept in this browser only — the panel says so explicitly.
 */
export function RSVPForm() {
  const [values, setValues] = useState<RsvpPayload>(EMPTY_RSVP);
  const [errors, setErrors] = useState<RsvpErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof RsvpPayload, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<RsvpResult | null>(null);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    setSavedCount(getStoredSubmissions().length);
  }, []);

  const eventLabels = useMemo(
    () => Object.fromEntries(eventOptions.map((option) => [option.id, option.title])),
    [],
  );

  function update<K extends keyof RsvpPayload>(key: K, value: RsvpPayload[K]) {
    setValues((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  }

  function toggleEvent(id: string, checked: boolean) {
    setValues((previous) => ({
      ...previous,
      events: checked
        ? [...previous.events, id]
        : previous.events.filter((eventId) => eventId !== id),
    }));
    setErrors((previous) => ({ ...previous, events: undefined }));
  }

  function handleBlur(key: keyof RsvpPayload) {
    setTouched((previous) => ({ ...previous, [key]: true }));
    setErrors(validateRsvp(values));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateRsvp(values);
    setErrors(nextErrors);
    setTouched({
      name: true,
      contact: true,
      attending: true,
      guestCount: true,
      events: true,
      message: true,
    });

    if (!isRsvpValid(nextErrors)) return;

    setStatus("submitting");
    const response = await submitRsvp(values);
    setResult(response);
    setStatus(response.ok ? "success" : "error");
    setSavedCount(getStoredSubmissions().length);
  }

  function resetForm() {
    setValues(EMPTY_RSVP);
    setErrors({});
    setTouched({});
    setResult(null);
    setStatus("idle");
  }

  const attending: AttendingChoice = values.attending;
  const showError = (key: keyof RsvpPayload) => (touched[key] ? errors[key] : undefined);

  return (
    <section id="rsvp" className="section-pad relative overflow-hidden bg-bg">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-accent-soft to-transparent opacity-60"
      />

      <div className="shell relative">
        <SectionHeading
          eyebrow="Join Us"
          title="RSVP"
          subtitle={`Let us know whether you can make it. ${weddingConfig.rsvpDeadlineLabel}.`}
          goldTitle
        />

        <Reveal className="mx-auto mt-14 max-w-3xl">
          <AnimatePresence mode="wait" initial={false}>
            {status === "success" && result?.submission ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="card-royal flex flex-col items-center gap-5 p-8 text-center sm:p-10"
              >
                <span className="grid h-14 w-14 place-items-center rounded-full bg-accent-soft text-accent">
                  <Check className="h-7 w-7" strokeWidth={2} />
                </span>
                <div>
                  <h3 className="section-title text-2xl sm:text-3xl">
                    Thank you, {result.submission.name}
                  </h3>
                  <p className="mt-2 text-sm text-ink-soft">{result.message}</p>
                </div>

                <dl className="grid w-full gap-3 text-left sm:grid-cols-2">
                  {[
                    {
                      term: "Attending",
                      detail: result.submission.attending === "yes" ? "Yes" : "Not attending",
                    },
                    {
                      term: "Guests",
                      detail: String(result.submission.guestCount),
                    },
                    {
                      term: "Functions",
                      detail: describeEvents(result.submission.events, eventLabels),
                    },
                    {
                      term: "Contact",
                      detail: result.submission.contact || "Not provided",
                    },
                  ].map((row) => (
                    <div
                      key={row.term}
                      className="rounded-2xl border border-line bg-bg-alt px-4 py-3"
                    >
                      <dt className="text-[0.56rem] uppercase tracking-[0.26em] text-ink-soft">
                        {row.term}
                      </dt>
                      <dd className="mt-0.5 text-sm text-ink">{row.detail}</dd>
                    </div>
                  ))}
                </dl>

                {result.submission.message && (
                  <p className="text-sm italic text-ink-soft">
                    “{result.submission.message}”
                  </p>
                )}

                <p className="rounded-2xl bg-bg-alt px-4 py-3 text-[0.7rem] leading-relaxed text-ink-soft">
                  Note: this invitation is front-end only, so your RSVP is saved in this
                  browser and has not been sent to the couple. To deliver responses, connect an
                  endpoint in <code>src/services/rsvpService.ts</code>.
                </p>

                <button type="button" className="btn btn-outline" onClick={resetForm}>
                  Submit another response
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                noValidate
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="card-royal flex flex-col gap-6 p-6 sm:p-9"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    htmlFor="rsvp-name"
                    label="Your name"
                    required
                    error={showError("name")}
                  >
                    <input
                      id="rsvp-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      className={INPUT_CLASS}
                      placeholder="e.g. Ananya Verma"
                      value={values.name}
                      onChange={(event) => update("name", event.target.value)}
                      onBlur={() => handleBlur("name")}
                      aria-invalid={Boolean(showError("name"))}
                      aria-describedby={showError("name") ? "rsvp-name-error" : undefined}
                    />
                  </Field>

                  <Field
                    htmlFor="rsvp-contact"
                    label="Email or phone (optional)"
                    error={showError("contact")}
                    hint="Only if you'd like a reminder from us."
                  >
                    <input
                      id="rsvp-contact"
                      name="contact"
                      type="text"
                      autoComplete="email"
                      className={INPUT_CLASS}
                      placeholder="you@example.com or +91 98765 43210"
                      value={values.contact}
                      onChange={(event) => update("contact", event.target.value)}
                      onBlur={() => handleBlur("contact")}
                      aria-invalid={Boolean(showError("contact"))}
                      aria-describedby={showError("contact") ? "rsvp-contact-error" : undefined}
                    />
                  </Field>
                </div>

                <fieldset className="flex flex-col gap-2.5 border-0 p-0">
                  <legend className="mb-1 text-[0.6rem] uppercase tracking-[0.26em] text-ink-soft">
                    Will you be joining us? <span className="text-accent">*</span>
                  </legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(
                      [
                        { value: "yes", label: "Yes, count me in", icon: Check },
                        { value: "no", label: "Sorry, I can't make it", icon: X },
                      ] as const
                    ).map((option) => {
                      const isSelected = attending === option.value;
                      const Icon = option.icon;
                      return (
                        <label
                          key={option.value}
                          className={cn(
                            "flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm transition",
                            isSelected
                              ? "border-accent bg-accent-soft text-ink"
                              : "border-line bg-surface text-ink-soft hover:border-accent",
                          )}
                        >
                          <input
                            type="radio"
                            name="attending"
                            value={option.value}
                            checked={isSelected}
                            onChange={() => update("attending", option.value)}
                            className="sr-only"
                          />
                          <span
                            className={cn(
                              "grid h-6 w-6 shrink-0 place-items-center rounded-full border",
                              isSelected
                                ? "border-accent bg-accent text-white"
                                : "border-line",
                            )}
                          >
                            {isSelected && <Icon className="h-3.5 w-3.5" />}
                          </span>
                          {option.label}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <AnimatePresence initial={false}>
                  {attending === "yes" && (
                    <motion.div
                      key="attending-details"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-6 pt-1">
                        <div className="grid gap-5 sm:grid-cols-[220px_1fr] sm:items-start">
                          <Field
                            htmlFor="rsvp-guests"
                            label="Number of guests"
                            required
                            error={showError("guestCount")}
                          >
                            <div className="relative">
                              <Users
                                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
                                aria-hidden="true"
                              />
                              <input
                                id="rsvp-guests"
                                name="guestCount"
                                type="number"
                                inputMode="numeric"
                                min={1}
                                max={10}
                                className={cn(INPUT_CLASS, "pl-11")}
                                value={values.guestCount}
                                onChange={(event) =>
                                  update("guestCount", Number(event.target.value))
                                }
                                onBlur={() => handleBlur("guestCount")}
                                aria-invalid={Boolean(showError("guestCount"))}
                              />
                            </div>
                          </Field>

                          <Field
                            htmlFor="rsvp-events"
                            label="Functions you'll attend"
                            required
                            error={showError("events")}
                          >
                            <div
                              id="rsvp-events"
                              className="flex flex-wrap gap-2"
                              role="group"
                              aria-label="Functions you will attend"
                            >
                              {eventOptions.map((option) => {
                                const isChecked = values.events.includes(option.id);
                                return (
                                  <label
                                    key={option.id}
                                    className={cn(
                                      "inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-[0.72rem] transition",
                                      isChecked
                                        ? "border-accent bg-accent-soft text-ink"
                                        : "border-line bg-surface text-ink-soft hover:border-accent",
                                    )}
                                  >
                                    <input
                                      type="checkbox"
                                      className="sr-only"
                                      checked={isChecked}
                                      onChange={(event) =>
                                        toggleEvent(option.id, event.target.checked)
                                      }
                                    />
                                    {isChecked && <Check className="h-3.5 w-3.5 text-accent" />}
                                    {option.title}
                                  </label>
                                );
                              })}
                            </div>
                          </Field>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Field
                  htmlFor="rsvp-message"
                  label="A message for the couple (optional)"
                  error={showError("message")}
                  hint={`${values.message.length}/${MAX_MESSAGE_LENGTH} characters`}
                >
                  <textarea
                    id="rsvp-message"
                    name="message"
                    rows={3}
                    maxLength={MAX_MESSAGE_LENGTH + 50}
                    className={cn(INPUT_CLASS, "resize-none")}
                    placeholder="Blessings, a favourite memory, or a song request for the sangeet…"
                    value={values.message}
                    onChange={(event) => update("message", event.target.value)}
                    onBlur={() => handleBlur("message")}
                  />
                </Field>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      className="btn btn-solid"
                      disabled={status === "submitting"}
                    >
                      {status === "submitting" ? (
                        <>
                          <Loader className="h-3.5 w-3.5 animate-spin" />
                          Sending
                        </>
                      ) : (
                        <>
                          Send RSVP
                          <Send className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>

                    <span className="inline-flex items-center gap-2 text-[0.68rem] text-ink-soft">
                      {values.contact.includes("@") ? (
                        <Mail className="h-3.5 w-3.5 text-accent" />
                      ) : (
                        <Phone className="h-3.5 w-3.5 text-accent" />
                      )}
                      {weddingConfig.rsvpDeadlineLabel}
                    </span>
                  </div>

                  {status === "error" && result && (
                    <p role="alert" className="text-[0.74rem] text-red-600">
                      {result.message}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4 text-[0.68rem] text-ink-soft">
                    <span>
                      {savedCount > 0
                        ? `${savedCount} response${savedCount > 1 ? "s" : ""} saved in this browser`
                        : "No responses saved in this browser yet"}
                    </span>
                    {savedCount > 0 && (
                      <button
                        type="button"
                        className="underline decoration-dotted underline-offset-2 transition hover:text-ink"
                        onClick={() => {
                          clearStoredSubmissions();
                          setSavedCount(0);
                        }}
                      >
                        Clear saved responses
                      </button>
                    )}
                  </div>

                  <p className="text-[0.68rem] leading-relaxed text-ink-soft">
                    This is a front-end demo, so responses are not delivered anywhere. Connect a
                    form service in <code>src/services/rsvpService.ts</code> to receive them.
                  </p>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}

export default RSVPForm;
