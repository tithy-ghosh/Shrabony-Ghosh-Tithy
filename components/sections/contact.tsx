"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Loader2, Mail, MapPin, Send } from "lucide-react";
import { sendContactMessage } from "@/app/actions";
import type { ContactState } from "@/app/actions";
import { site } from "@/content/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/effects/reveal";
import { MagneticLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fadeUp } from "@/lib/variants";

const initialState: ContactState = { status: "idle" };

const inputClasses =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted/60 transition-all outline-none focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-soft)]";

export function Contact() {
  const [state, formAction, pending] = useActionState(
    sendContactMessage,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [dismissed, setDismissed] = useState(false);
  const sent = state.status === "success" && !dismissed;

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <section id="contact" className="relative py-16 sm:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Contact"
          title="Let's build something together"
          description="Freelance work, full-time roles, or just a good technical chat — my inbox is open."
        />

        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          {/* left column */}
          <Reveal variants={fadeUp} className="flex flex-col gap-6">
            <div className="glass rounded-3xl p-6">
              <h3 className="font-display text-lg font-semibold">
                Reach me directly
              </h3>

              <div className="mt-5 space-y-4">
                <a
                  href={`mailto:${site.email}`}
                  className="group flex items-center gap-3 text-sm text-muted transition-colors hover:text-foreground"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors group-hover:border-accent group-hover:text-accent">
                    <Mail className="h-4 w-4" />
                  </span>
                  {site.email}
                </a>

                <div className="flex items-center gap-3 text-sm text-muted">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border">
                    <MapPin className="h-4 w-4" />
                  </span>
                  {site.location}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {site.socials.map((s) => (
                  <MagneticLink
                    key={s.label}
                    href={s.url}
                    external={!s.url.startsWith("mailto:")}
                    className="rounded-full border border-border px-4 py-2 text-xs"
                  >
                    {s.label}
                  </MagneticLink>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <p className="text-sm text-muted">
                Currently <span className="text-foreground">{site.availability.toLowerCase()}</span> —
                average reply time under 24h.
              </p>
            </div>
          </Reveal>

          {/* form */}
          <Reveal variants={fadeUp} delay={0.1}>
            <div className="glow-ring relative overflow-hidden rounded-3xl border border-border bg-surface p-6 sm:p-8">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent-soft blur-3xl" />

              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    className="relative flex min-h-[24rem] flex-col items-center justify-center gap-4 text-center"
                  >
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
                      <CheckCircle2 className="h-8 w-8" />
                    </span>
                    <h3 className="font-display text-2xl font-semibold">
                      Message sent!
                    </h3>
                    <p className="max-w-sm text-sm text-muted">
                      {state.message ??
                        "Thanks for reaching out — I'll reply soon."}
                    </p>
                    <button
                      onClick={() => setDismissed(true)}
                      className="mt-2 rounded-full border border-border px-5 py-2.5 text-sm transition-colors hover:border-accent hover:text-accent"
                    >
                      Send another
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    ref={formRef}
                    action={formAction}
                    onSubmit={() => setDismissed(false)}
                    initial={false}
                    exit={{ opacity: 0, y: -8 }}
                    className="relative flex flex-col gap-4"
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="flex flex-col gap-2 text-sm font-medium">
                        Name
                        <input
                          name="name"
                          required
                          minLength={2}
                          autoComplete="name"
                          placeholder="Jordan Doe"
                          className={inputClasses}
                        />
                      </label>

                      <label className="flex flex-col gap-2 text-sm font-medium">
                        Email
                        <input
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          placeholder="jordan@company.com"
                          className={inputClasses}
                        />
                      </label>
                    </div>

                    <label className="flex flex-col gap-2 text-sm font-medium">
                      Message
                      <textarea
                        name="message"
                        required
                        minLength={10}
                        rows={6}
                        placeholder="Tell me about the role, project, or idea..."
                        className={cn(inputClasses, "resize-none")}
                      />
                    </label>

                    {/* honeypot */}
                    <input
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden
                      className="absolute -left-[9999px] h-0 w-0 opacity-0"
                    />

                    <AnimatePresence>
                      {state.status === "error" && (
                        <motion.p
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-sm text-rose-500"
                        >
                          {state.message}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <button
                      type="submit"
                      disabled={pending}
                      className="group mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_30px_-8px_var(--accent-glow)] transition-all hover:shadow-[0_12px_38px_-6px_var(--accent-glow)] disabled:opacity-70"
                    >
                      {pending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          Send Message
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
