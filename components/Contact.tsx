"use client";

import { useState } from "react";
import { property } from "@/config/property";
import { useReveal } from "./useReveal";

type FormState = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full border-b border-white/15 bg-transparent px-0 py-3 text-bone placeholder:text-bone-dim/50 transition-colors duration-700 ease-luxe focus:border-gold focus:outline-none";

export default function Contact() {
  const ref = useReveal<HTMLElement>();
  const [state, setState] = useState<FormState>("idle");
  const { agent } = property;

  const initials = agent.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setState("submitting");
    try {
      const response = await fetch(property.formspreeEndpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (!response.ok) throw new Error(`Formspree responded ${response.status}`);
      setState("success");
      form.reset();
    } catch {
      setState("error");
    }
  }

  return (
    <section
      id="contact"
      ref={ref}
      aria-label="Request a private showing"
      className="border-t border-white/5 bg-ink-soft px-6 py-24 md:py-36"
    >
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1fr_minmax(280px,380px)]">
        <div>
          <p className="reveal text-[10px] uppercase tracking-luxe text-gold">Contact</p>
          <h2 className="reveal mt-4 font-serif text-3xl font-light text-bone md:text-5xl">
            Request a Private Showing
          </h2>

          {state === "success" ? (
            <p
              className="mt-12 max-w-md font-serif text-xl font-light italic text-gold"
              role="status"
            >
              Thank you. Your request has been received — we will be in touch
              within the day.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="reveal mt-12 max-w-xl">
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="text-[10px] uppercase tracking-luxe text-bone-dim">
                    Name
                  </label>
                  <input id="contact-name" name="name" type="text" required autoComplete="name" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="contact-email" className="text-[10px] uppercase tracking-luxe text-bone-dim">
                    Email
                  </label>
                  <input id="contact-email" name="email" type="email" required autoComplete="email" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="contact-phone" className="text-[10px] uppercase tracking-luxe text-bone-dim">
                    Phone
                  </label>
                  <input id="contact-phone" name="phone" type="tel" autoComplete="tel" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="contact-date" className="text-[10px] uppercase tracking-luxe text-bone-dim">
                    Preferred Date
                  </label>
                  <input id="contact-date" name="preferred_date" type="date" className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="contact-message" className="text-[10px] uppercase tracking-luxe text-bone-dim">
                    Message
                  </label>
                  <textarea id="contact-message" name="message" rows={4} className={inputClass} />
                </div>
              </div>

              <button
                type="submit"
                disabled={state === "submitting"}
                className="mt-12 border border-gold/40 px-10 py-4 text-[11px] uppercase tracking-luxe text-gold transition-colors duration-700 ease-luxe hover:border-gold hover:bg-gold/5 disabled:opacity-40"
              >
                {state === "submitting" ? "Sending…" : "Send Request"}
              </button>

              {state === "error" && (
                <p className="mt-6 text-sm text-red-300/80" role="alert">
                  Something went wrong sending your request. Please try again,
                  or contact {agent.name} directly at {agent.email}.
                </p>
              )}
            </form>
          )}
        </div>

        {/* Agent card */}
        <aside
          className="reveal h-fit border border-white/10 p-10 text-center lg:mt-24"
          style={{ "--reveal-delay": "200ms" } as React.CSSProperties}
          aria-label="Listing agent"
        >
          {agent.photo ? (
            <img
              src={agent.photo}
              alt={`Portrait of ${agent.name}`}
              width={112}
              height={112}
              loading="lazy"
              className="mx-auto h-28 w-28 rounded-full object-cover"
            />
          ) : (
            <div
              aria-hidden="true"
              className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-gold/30 font-serif text-3xl font-light text-gold"
            >
              {initials}
            </div>
          )}
          <p className="mt-6 font-serif text-2xl font-light text-bone">{agent.name}</p>
          <p className="mt-1 text-[10px] uppercase tracking-luxe text-bone-dim">
            {agent.title}
          </p>
          <div className="gold-rule mx-auto my-8 w-16" />
          <p>
            <a
              href={`tel:${agent.phone.replace(/\s/g, "")}`}
              className="text-sm text-bone-dim transition-colors duration-700 hover:text-gold"
            >
              {agent.phone}
            </a>
          </p>
          <p className="mt-2">
            <a
              href={`mailto:${agent.email}`}
              className="text-sm text-bone-dim transition-colors duration-700 hover:text-gold"
            >
              {agent.email}
            </a>
          </p>
        </aside>
      </div>
    </section>
  );
}
