"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Phone, Mail, MapPin, Clock, Send, MessageCircle, Smartphone,
  ChevronDown, ChevronUp, Check, ArrowRight, RefreshCw, Compass,
  Headphones, ExternalLink, Globe, Camera, Users, Video,
  Loader2,
} from "lucide-react";
import { ContactInfo, ContactFormData } from "@/types";
import ReCAPTCHA from "react-google-recaptcha";
import { sanitize, sanitizeEmail, sanitizeName, sanitizePhone } from "@/lib/sanitize";

const SUPPORT_ICONS: Record<string, typeof MessageCircle> = {
  MessageCircle, Mail, Phone, Smartphone,
};

export default function ContactClient() {
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState<ContactFormData>({ name: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [emailSub, setEmailSub] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    fetch("/api/contact")
      .then((r) => r.json())
      .then((d) => setContact(d.contact))
      .catch(() => setError("Failed to load contact info"))
      .finally(() => setLoading(false));
  }, []);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.subject.trim()) e.subject = "Required";
    if (!form.message.trim()) e.message = "Required";
    else if (form.message.trim().length < 10) e.message = "Minimum 10 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!recaptchaToken) { setErrors({ _form: "Please complete the reCAPTCHA verification." }); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: sanitizeName(form.name),
          email: sanitizeEmail(form.email),
          phone: sanitizePhone(form.phone),
          subject: sanitize(form.subject),
          message: sanitize(form.message),
          recaptchaToken,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        setErrors(data.errors || {});
      }
    } catch {
      console.warn("Failed to submit contact form");
      setErrors({ _form: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <Compass size={32} className="text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Failed to load content</h3>
        <p className="text-sm text-gray-400 mb-5">{error}</p>
        <button onClick={() => window.location.reload()} className="px-5 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
          <RefreshCw size={15} /> Retry
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-[350px] bg-gray-200" />
        <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 bg-gray-100 rounded-2xl" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-80 bg-gray-100 rounded-2xl" />
            <div className="h-80 bg-gray-100 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden min-h-[350px] flex items-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1920&q=80')] bg-cover bg-center opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/70 to-transparent" />
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-3">
              <Headphones size={16} /> We&apos;re Here to Help
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight">Contact <span className="text-emerald-400">Us</span></h1>
            <p className="text-gray-300 mt-3 text-sm sm:text-base leading-relaxed max-w-lg">
              Have a question, need assistance, or want to provide feedback? Our team is ready to help you 24/7.
            </p>
            <a href="#form" className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-emerald-500 text-white rounded-full text-sm font-semibold hover:bg-emerald-400 transition-all">
              <Mail size={16} /> Send a Message
            </a>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Contact Info Cards */}
        {contact && (
          <section className="-mt-8 relative z-10 mb-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[
                { icon: Phone, label: "Phone", value: contact.phone, href: `tel:${contact.phone}`, color: "bg-emerald-500" },
                { icon: Mail, label: "Email", value: contact.email, href: `mailto:${contact.email}`, color: "bg-blue-500" },
                { icon: MapPin, label: "Address", value: contact.address, color: "bg-amber-500" },
                { icon: Clock, label: "Working Hours", value: contact.workingHours, color: "bg-purple-500" },
              ].map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-2xl border border-gray-100 p-4 hover:border-gray-200 hover:shadow-sm transition-all"
                >
                  <div className={`w-9 h-9 ${card.color} rounded-xl flex items-center justify-center mb-2.5`}>
                    <card.icon size={16} className="text-white" />
                  </div>
                  <p className="text-xs text-gray-400 font-medium">{card.label}</p>
                  {card.href ? (
                    <a href={card.href} className="text-sm font-semibold text-gray-900 hover:text-emerald-600 transition-colors mt-0.5 block leading-snug">{card.value}</a>
                  ) : (
                    <p className="text-sm font-semibold text-gray-900 mt-0.5 leading-snug">{card.value}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Form + Map */}
        <section className="py-6 pb-16" id="form">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Get in Touch</span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 mb-6">Send Us a Message</h2>

              {submitted ? (
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
                  <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Check size={28} className="text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Message Sent!</h3>
                  <p className="text-sm text-gray-500 mt-1">Thank you for reaching out. Our team will respond within 2 hours.</p>
                  <button onClick={() => { setSubmitted(false); setErrors({}); }} className="mt-4 px-5 py-2 bg-gray-900 text-white text-sm rounded-full hover:bg-gray-800 transition-colors">
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-medium text-gray-500 mb-1">Full Name *</label>
                      <input id="contact-name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`w-full px-3.5 py-2.5 text-sm bg-white border ${errors.name ? "border-red-300" : "border-gray-200"} rounded-xl focus:outline-none focus:border-gray-900 transition-colors`} placeholder="John Doe" />
                      {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-medium text-gray-500 mb-1">Email *</label>
                      <input id="contact-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={`w-full px-3.5 py-2.5 text-sm bg-white border ${errors.email ? "border-red-300" : "border-gray-200"} rounded-xl focus:outline-none focus:border-gray-900 transition-colors`} placeholder="john@email.com" />
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-phone" className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                      <input id="contact-phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors" placeholder="+1 (555) 000-0000" />
                    </div>
                    <div>
                      <label htmlFor="contact-subject" className="block text-xs font-medium text-gray-500 mb-1">Subject *</label>
                      <select id="contact-subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={`w-full px-3.5 py-2.5 text-sm bg-white border ${errors.subject ? "border-red-300" : "border-gray-200"} rounded-xl focus:outline-none focus:border-gray-900 transition-colors ${form.subject ? "text-gray-900" : "text-gray-400"}`}>
                        <option value="" disabled>Select a subject</option>
                        <option value="Booking Inquiry">Booking Inquiry</option>
                        <option value="Cancellation">Cancellation</option>
                        <option value="Refund">Refund</option>
                        <option value="Partnership">Partnership</option>
                        <option value="Feedback">Feedback</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-medium text-gray-500 mb-1">Message *</label>
                    <textarea id="contact-message" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={`w-full px-3.5 py-2.5 text-sm bg-white border ${errors.message ? "border-red-300" : "border-gray-200"} rounded-xl focus:outline-none focus:border-gray-900 transition-colors resize-none`} placeholder="How can we help you?" />
                    {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                  </div>
                  {errors._form && <p className="text-sm text-red-500 text-center">{errors._form}</p>}
                  <button type="submit" disabled={submitting} className="w-full py-3 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    {submitting ? "Sending..." : "Send Message"}
                  </button>
                  <div className="flex justify-center">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                      onChange={setRecaptchaToken}
                    />
                  </div>
                </form>
              )}
            </motion.div>

            {/* Map */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Our Location</span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 mb-6">Find Us Here</h2>
              {contact && (
                <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="relative h-[320px] sm:h-[400px] bg-gray-200">
                    <Image
                      src={`https://maps.googleapis.com/maps/api/staticmap?center=${contact.lat},${contact.lng}&zoom=14&size=800x400&markers=color:red%7C${contact.lat},${contact.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "YOUR_API_KEY"}`}
                      alt="Office location map showing LuminaStay headquarters in San Francisco"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1569336415962-a4bd9f18cdb3?w=800&q=80"; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">LuminaStay Headquarters</p>
                        <p className="text-xs text-gray-500 mt-0.5">{contact.address}</p>
                      </div>
                    </div>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${contact.lat},${contact.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gray-900 text-white text-xs rounded-full hover:bg-gray-800 transition-colors flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <ExternalLink size={13} /> Directions
                    </a>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Support Options */}
        {contact && (
          <section className="py-10 border-t border-gray-100">
            <div className="text-center mb-8">
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Support</span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">Other Ways to Reach Us</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {contact.supportOptions.map((opt, i) => {
                const Icon = SUPPORT_ICONS[opt.icon] || MessageCircle;
                return (
                  <motion.div
                    key={opt.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-white rounded-2xl border border-gray-100 p-5 text-center hover:border-gray-200 hover:shadow-sm transition-all group cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-gray-900 group-hover:text-white transition-all">
                      <Icon size={20} className="text-gray-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">{opt.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{opt.description}</p>
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium mt-2 hover:text-emerald-700 transition-colors">
                      {opt.action} <ArrowRight size={11} />
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* FAQ */}
        {contact && (
          <section className="py-10 border-t border-gray-100">
            <div className="text-center mb-8">
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">FAQ</span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">Frequently Asked Questions</h2>
            </div>
            <div className="max-w-2xl mx-auto space-y-2">
              {contact.faqs.map((faq) => (
                <div key={faq.question} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 transition-colors">
                  <button
                    onClick={() => setOpenFaq(openFaq === faq.question ? null : faq.question)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left"
                    aria-expanded={openFaq === faq.question}
                  >
                    <span className="text-sm font-medium text-gray-900 pr-4">{faq.question}</span>
                    {openFaq === faq.question ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
                  </button>
                  {openFaq === faq.question && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="px-5 pb-4">
                      <p className="text-sm text-gray-500 leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-4">
              <Link href="/listing" className="inline-flex items-center gap-1 text-sm text-emerald-600 font-medium hover:text-emerald-700 transition-colors">
                View All FAQs <ArrowRight size={14} />
              </Link>
            </div>
          </section>
        )}

        {/* Social Media */}
        {contact && (
          <section className="py-10 border-t border-gray-100">
            <div className="text-center mb-6">
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Follow Us</span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">Stay Connected</h2>
            </div>
            <div className="flex items-center justify-center gap-3">
              {contact.socials.map((s) => {
                const iconMap: Record<string, typeof Globe> = { Facebook: Globe, Instagram: Camera, Twitter: Globe, Linkedin: Users, Youtube: Video };
                const Icon = iconMap[s.icon] || Globe;
                return (
                  <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all" aria-label={s.platform}>
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Newsletter */}
      <section className="bg-gray-900 mt-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail size={24} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Stay in the Loop</h2>
            <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">Subscribe for exclusive deals, travel tips, and updates from LuminaStay.</p>
            {subscribed ? (
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="flex items-center justify-center gap-2 mt-6 text-emerald-400 text-sm font-medium">
                <Check size={18} /> Subscribed! Check your email.
              </motion.div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); if (emailSub) { setSubscribed(true); setEmailSub(""); } }} className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6 max-w-md mx-auto">
                <div className="flex-1 w-full">
                  <input type="email" aria-label="Email" placeholder="Enter your email" value={emailSub} onChange={(e) => setEmailSub(e.target.value)} required className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 transition-colors" />
                </div>
                <button type="submit" className="px-6 py-3 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-400 transition-colors flex items-center gap-2 whitespace-nowrap">
                  <Mail size={15} /> Subscribe
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}
