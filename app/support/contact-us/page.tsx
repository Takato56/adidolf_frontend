"use client";

import { useState } from "react";

export default function ContactUs() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8 text-center">
        <p className="text-xs uppercase tracking-widest text-blue-500 font-semibold mb-2">
          Support
        </p>
        <h1 className="text-3xl font-bold text-text-primary">Contact Us</h1>
        <p className="text-text-muted text-sm mt-2">
          We're here to help. Reach out and we'll get back to you within 1–2 business days.
        </p>
      </div>

      {/* Contact cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          {
            label: "Phone",
            value: "12345676767",
            note: "Mon–Fri, 9am–6pm CET",
          },
          {
            label: "Email",
            value: "support@adidolf.com",
            note: "Response within 1–2 business days",
          },
          {
            label: "HQ",
            value: "Hanoi, Vietnam",
            note: "Not open to walk-ins",
          },
        ].map(({ label, value, note }) => (
          <div
            key={label}
            className="border border-border rounded-xl p-5 bg-surface-card hover:shadow-sm transition-shadow"
          >
            <p className="text-xs uppercase tracking-widest text-blue-500 font-semibold mb-2">
              {label}
            </p>
            <p className="font-semibold text-text-primary text-sm">{value}</p>
            <p className="text-xs text-text-muted mt-1">{note}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-border-divider pt-8">
        <h2 className="text-lg font-semibold text-text-primary mb-1">
          Send us a message
        </h2>
        <p className="text-sm text-text-muted mb-6">
          Fill out the form below and our team will be in touch shortly.
        </p>

        {submitted ? (
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 text-center">
            <p className="font-semibold text-text-primary mb-1">Message received.</p>
            <p className="text-sm text-text-muted">
              Thanks for reaching out — we'll reply to your email within 1–2 business days.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  className="w-full border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder-text-muted bg-surface-input outline-none focus:border-blue-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder-text-muted bg-surface-input outline-none focus:border-blue-400 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">
                Subject
              </label>
              <input
                type="text"
                required
                placeholder="What's this about?"
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder-text-muted bg-surface-input outline-none focus:border-blue-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">
                Message
              </label>
              <textarea
                required
                rows={5}
                placeholder="How can we help?"
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder-text-muted bg-surface-input outline-none focus:border-blue-400 transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              className="bg-text-primary text-surface-header text-sm font-semibold px-6 py-3 rounded-lg hover:bg-text-secondary transition-colors cursor-pointer"
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}