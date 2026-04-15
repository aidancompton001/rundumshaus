"use client";

import { useState, FormEvent } from "react";
import contactFormData from "@/data/contact-form.json";
import siteData from "@/data/site.json";
import type { ContactFormData, SiteConfig } from "@/data/types";
import { FORMSUBMIT_ACTION } from "@/lib/formsubmit";
import { ScrollReveal, Stagger } from "@/components/motion";
import { motion, AnimatePresence } from "motion/react";

const form = contactFormData as ContactFormData;
const site = siteData as SiteConfig;

type FormState = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [state, setState] = useState<FormState>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch(FORMSUBMIT_ACTION, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setState("success");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <ScrollReveal>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-charcoal mb-4">
                {form.heading}
              </h1>
              <p className="text-charcoal-light text-lg mb-10">
                {form.body}
              </p>
            </ScrollReveal>

            <AnimatePresence mode="wait">
              {state === "success" ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-16"
                >
                  <span className="text-6xl block mb-4">✅</span>
                  <p className="text-charcoal text-lg font-semibold">
                    {form.successMessage}
                  </p>
                </motion.div>
              ) : state === "error" ? (
                <motion.div
                  key="error"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-16"
                >
                  <span className="text-6xl block mb-4">❌</span>
                  <p className="text-charcoal text-lg mb-4">
                    {form.errorMessage}
                  </p>
                  <button
                    onClick={() => setState("idle")}
                    className="bg-copper hover:bg-copper-light text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Erneut versuchen
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  action={FORMSUBMIT_ACTION}
                  method="POST"
                >
                  {/* Honeypot — off-screen, NOT display:none */}
                  <input
                    type="text"
                    name="_honey"
                    className="absolute left-[-9999px]"
                    aria-hidden="true"
                    tabIndex={-1}
                  />
                  {/* FormSubmit config */}
                  <input type="hidden" name="_captcha" value="false" />
                  <input
                    type="hidden"
                    name="_subject"
                    value="Neue Anfrage über rundumshaus-littawe.de"
                  />
                  <input type="hidden" name="_template" value="table" />

                  <Stagger staggerDelay={0.15} className="space-y-8">
                    {form.sections.map((section) => (
                      <fieldset key={section.heading}>
                        <legend className="font-heading text-lg font-semibold text-charcoal mb-4">
                          {section.heading}
                        </legend>
                        <div className="space-y-5">
                          {section.fields.map((field) =>
                            field.type === "checkbox" ? (
                              <label
                                key={field.name}
                                className="flex items-start gap-3 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  name={field.name}
                                  required={field.required}
                                  className="mt-1 w-5 h-5 rounded border-sand accent-copper"
                                />
                                <span className="text-charcoal-light text-sm">
                                  {field.label}
                                </span>
                              </label>
                            ) : field.type === "textarea" ? (
                              <div key={field.name} className="relative">
                                <textarea
                                  name={field.name}
                                  required={field.required}
                                  placeholder=" "
                                  rows={4}
                                  className="peer w-full border border-sand/40 rounded-xl px-4 pt-6 pb-3 text-charcoal bg-white focus:ring-2 focus:ring-copper/50 focus:border-copper outline-none transition-all resize-none"
                                />
                                <label className="absolute left-4 top-4 text-charcoal-light text-sm transition-all duration-200 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-copper peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs pointer-events-none">
                                  {field.label}
                                  {field.required && " *"}
                                </label>
                              </div>
                            ) : (
                              <div key={field.name} className="relative">
                                <input
                                  type={field.type}
                                  name={field.name}
                                  required={field.required}
                                  placeholder=" "
                                  className="peer w-full border border-sand/40 rounded-xl px-4 pt-6 pb-3 text-charcoal bg-white focus:ring-2 focus:ring-copper/50 focus:border-copper outline-none transition-all"
                                />
                                <label className="absolute left-4 top-4 text-charcoal-light text-sm transition-all duration-200 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-copper peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs pointer-events-none">
                                  {field.label}
                                  {field.required && " *"}
                                </label>
                              </div>
                            )
                          )}
                        </div>
                      </fieldset>
                    ))}

                    <div>
                      <button
                        type="submit"
                        disabled={state === "submitting"}
                        className="bg-copper hover:bg-copper-light disabled:opacity-50 text-white px-8 py-3.5 rounded-xl font-semibold text-lg transition-colors w-full sm:w-auto"
                      >
                        {state === "submitting"
                          ? "Wird gesendet..."
                          : form.submitLabel}
                      </button>
                    </div>
                  </Stagger>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar — contact info */}
          <ScrollReveal direction="right" className="lg:pt-20">
            <div className="bg-cream-dark/50 border border-sand/20 rounded-2xl p-8 sticky top-24">
              <h2 className="font-heading text-2xl font-bold text-charcoal mb-6">
                Direkt erreichen
              </h2>
              <div className="space-y-4">
                <a
                  href={`tel:${site.phone}`}
                  className="flex items-center gap-3 text-charcoal hover:text-copper transition-colors"
                >
                  <span className="text-2xl">📞</span>
                  <span className="font-body">{site.phone}</span>
                </a>
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-center gap-3 text-charcoal hover:text-copper transition-colors"
                >
                  <span className="text-2xl">✉️</span>
                  <span className="font-body">{site.email}</span>
                </a>
                <div className="flex items-start gap-3 text-charcoal-light">
                  <span className="text-2xl">📍</span>
                  <span className="font-body">
                    {site.address.street}
                    <br />
                    {site.address.zip} {site.address.city}
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
