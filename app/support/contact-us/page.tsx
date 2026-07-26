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
        <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
        <p className="text-gray-500 text-sm mt-2">
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
            className="border border-gray-100 rounded-xl p-5 bg-white hover:shadow-sm transition-shadow"
          >
            <p className="text-xs uppercase tracking-widest text-blue-500 font-semibold mb-2">
              {label}
            </p>
            <p className="font-semibold text-gray-900 text-sm">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{note}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Send us a message
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          Fill out the form below and our team will be in touch shortly.
        </p>

        {submitted ? (
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 text-center">
            <p className="font-semibold text-gray-800 mb-1">Message received.</p>
            <p className="text-sm text-gray-500">
              Thanks for reaching out — we'll reply to your email within 1–2 business days.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-400 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Subject
              </label>
              <input
                type="text"
                required
                placeholder="What's this about?"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Message
              </label>
              <textarea
                required
                rows={5}
                placeholder="How can we help?"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-400 transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              className="bg-black text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}