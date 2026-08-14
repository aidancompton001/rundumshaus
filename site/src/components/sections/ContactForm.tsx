"use client";

import { useState, FormEvent } from "react";
import contactFormData from "@/data/contact-form.json";
import servicesData from "@/data/services.json";
import siteData from "@/data/site.json";
import type { ContactFormData, SiteConfig } from "@/data/types";
import { FORMSUBMIT_ACTION } from "@/lib/formsubmit";
import { ScrollReveal, Stagger } from "@/components/motion";
import { motion, AnimatePresence } from "motion/react";
import BrushDivider from "@/components/ui/BrushDivider";
import {
  PhoneIcon,
  WhatsAppIcon,
  EnvelopeIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@/components/ContactIcons";

const form = contactFormData as ContactFormData;
// Варианты в поле «Leistung» — названия услуг клиента из services.json
// плюс «Sonstiges». Своего списка услуг сайт не выдумывает.
const SERVICE_OPTIONS = [...(servicesData as { services: { title: string }[] }).services.map((x) => x.title), "Sonstiges"];
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

  // PX-046 F16: 7 MB PNG → responsive webp. Mobile (default) 51 KB,
  // tablet 94 KB, desktop 190 KB via CSS media queries in globals.css.
  // Fixed mobile LCP from 39s to <3s.
  return (
    <>
      {/* Шапка страницы по макету (kontakt.html, .page-hero): тёмная полоса
          с крошками и H1. Прежде H1 стоял внутри колонки формы. */}
      <section className="bg-dark text-white relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 md:pt-12 md:pb-16">
          <nav className="flex flex-wrap gap-1.5 text-sm text-white/70 mb-4" aria-label="Brotkrumen-Navigation">
            <a href="/" className="hover:text-white">Startseite</a>
            <span aria-hidden="true">›</span>
            <span aria-current="page">Kontakt</span>
          </nav>
          <h1 className="font-heading font-black text-3xl md:text-[2.875rem] leading-tight max-w-[24ch] mb-3">
            {form.heading}
          </h1>
          <p className="text-white/70 max-w-[62ch] text-lg">{form.body}</p>
        </div>
        <BrushDivider />
      </section>

    <section className="contact-form-bg py-14 md:py-20 relative">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Карточка формы — белая, с радиусом и тенью макета */}
          <div className="bg-white rounded-[14px] shadow-[0_6px_22px_rgba(16,23,31,0.07)] p-6 md:p-8">
            <ScrollReveal>
              <h2 className="font-heading text-[1.1875rem] font-extrabold text-ink mb-6">
                Anfrage senden
              </h2>
            </ScrollReveal>

            <AnimatePresence mode="wait">
              {state === "success" ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-16"
                >
                  <CheckCircleIcon className="w-16 h-16 mx-auto mb-4" />
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
                  <XCircleIcon className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-charcoal text-lg mb-4">
                    {form.errorMessage}
                  </p>
                  <button
                    onClick={() => setState("idle")}
                    className="bg-copper hover:bg-copper-dark text-white px-6 py-2 rounded-[10px] font-semibold transition-colors"
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
                        {/* Макет (kontakt.html): подпись СТОИТ НАД полем и
                            не исчезает при вводе. Прежде подписи жили внутри
                            поля и пропадали, стоило начать печатать. */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
                          {section.fields.map((field) => {
                            const id = `f-${field.name}`;
                            const wide = field.type === "textarea" || field.type === "checkbox";
                            const box =
                              "w-full border border-sand/40 rounded-[10px] px-4 py-3 text-ink " +
                              "bg-paper focus:ring-2 focus:ring-copper/40 focus:border-copper " +
                              "outline-none transition-all";
                            return (
                              <div key={field.name} className={wide ? "sm:col-span-2" : ""}>
                                {field.type === "checkbox" ? (
                                  <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      name={field.name}
                                      required={field.required}
                                      className="mt-1 w-5 h-5 rounded border-sand accent-[color:var(--color-copper)]"
                                    />
                                    <span className="text-sand text-sm">{field.label}</span>
                                  </label>
                                ) : (
                                  <>
                                    <label htmlFor={id} className="block text-sm font-semibold text-ink mb-1.5">
                                      {field.label}
                                      {field.required && " *"}
                                    </label>
                                    {field.type === "textarea" ? (
                                      <textarea
                                        id={id}
                                        name={field.name}
                                        required={field.required}
                                        rows={5}
                                        aria-required={field.required}
                                        className={box + " resize-none"}
                                      />
                                    ) : field.type === "select" ? (
                                      <select
                                        id={id}
                                        name={field.name}
                                        required={field.required}
                                        aria-required={field.required}
                                        defaultValue=""
                                        className={box}
                                      >
                                        <option value="">Bitte wählen …</option>
                                        {SERVICE_OPTIONS.map((o) => (
                                          <option key={o} value={o}>{o}</option>
                                        ))}
                                      </select>
                                    ) : (
                                      <input
                                        id={id}
                                        type={field.type}
                                        name={field.name}
                                        required={field.required}
                                        aria-required={field.required}
                                        autoComplete={
                                          field.type === "email"
                                            ? "email"
                                            : field.type === "tel"
                                              ? "tel"
                                              : field.name === "name"
                                                ? "name"
                                                : undefined
                                        }
                                        className={box}
                                      />
                                    )}
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </fieldset>
                    ))}

                    <div>
                      <button
                        type="submit"
                        disabled={state === "submitting"}
                        className="bg-copper hover:bg-copper-dark disabled:opacity-50 text-white px-8 py-3.5 rounded-[10px] font-semibold text-lg transition-colors w-full sm:w-auto"
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
            <div className="bg-white rounded-[14px] shadow-[0_6px_22px_rgba(16,23,31,0.07)] p-6 md:p-8 sticky top-[98px]">
              <h2 className="font-heading text-2xl font-extrabold text-charcoal mb-6">
                Direkt erreichen
              </h2>
              <div className="space-y-4">
                <a
                  href={`tel:${site.phone}`}
                  className="flex items-center gap-3 bg-gold hover:bg-gold-light text-white rounded-xl px-5 py-3 font-semibold transition-colors"
                >
                  <PhoneIcon className="w-5 h-5" variant="mono" />
                  <span className="font-body">Jetzt anrufen</span>
                </a>
                <a
                  href="https://wa.me/4915239603175"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-xl px-5 py-3 font-semibold transition-colors"
                >
                  <WhatsAppIcon className="w-5 h-5" variant="mono" />
                  <span className="font-body">WhatsApp schreiben</span>
                </a>
                <a
                  href={`tel:${site.phone}`}
                  className="flex items-center gap-3 text-charcoal hover:text-copper transition-colors"
                >
                  <PhoneIcon className="w-6 h-6" />
                  <span className="font-body">{site.phone}</span>
                </a>
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-center gap-3 text-charcoal hover:text-copper transition-colors"
                >
                  <EnvelopeIcon className="w-6 h-6" />
                  <span className="font-body">{site.email}</span>
                </a>
                <div className="flex items-start gap-3 text-charcoal-light">
                  <MapPinIcon className="w-6 h-6 flex-shrink-0 mt-0.5" />
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
    </>
  );
}
