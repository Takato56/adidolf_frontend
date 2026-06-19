"use client";

import { useState } from "react";

const faqItems = [
  {
    question: "How do I track my order?",
    answer:
      "Once your order ships, you'll receive a confirmation email with a tracking number. You can use it directly on the carrier's website to follow your package in real time.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We accept returns within 30 days of delivery, provided the item is unworn, unwashed, and in its original packaging. To start a return, contact us at support@adidolf.com with your order number.",
  },
  {
    question: "Do you offer free shipping?",
    answer:
      "Yes — orders over $200 qualify for free standard shipping. Orders below that threshold are subject to a flat shipping fee calculated at checkout based on your location.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Standard shipping typically takes 5–10 business days. Express options are available at checkout. International delivery times vary by destination.",
  },
  {
    question: "Can I change or cancel my order after placing it?",
    answer:
      "Orders can be modified or cancelled within 1 hour of placement. After that, the order enters processing and we're unable to make changes. Contact us immediately at support@adidolf.com if you need to act fast.",
  },
  {
    question: "How do I find my size?",
    answer:
      "Each product page includes a size guide with measurements in both cm and inches. If you're between sizes, we generally recommend sizing up for outerwear and true-to-size for fitted pieces.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes, we ship to select countries. Available destinations are shown at checkout. International orders may be subject to customs duties and import taxes, which are the responsibility of the customer.",
  },
  {
    question: "How do I apply a voucher or discount code?",
    answer:
      "Enter your code in the voucher field at checkout before completing your purchase. Codes are case-sensitive and can only be applied once per order. They cannot be combined with other promotions.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards (Visa, Mastercard, Amex), as well as PayPal. All transactions are processed securely.",
  },
  {
    question: "My item arrived damaged. What should I do?",
    answer:
      "We're sorry to hear that. Please email support@adidolf.com within 7 days of delivery with your order number and a photo of the damage. We'll arrange a replacement or refund promptly.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8 text-center">
        <p className="text-xs uppercase tracking-widest text-blue-500 font-semibold mb-2">
          Support
        </p>
        <h1 className="text-3xl font-bold text-text-primary">
          Frequently Asked Questions
        </h1>
        <p className="text-text-muted text-sm mt-2">
          Everything you were afraid to ask.
        </p>
      </div>

      <div className="space-y-1">
        {faqItems.map((item, index) => (
          <div key={index} className="w-full">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className={`w-full text-left p-4 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                openIndex === index
                  ? "bg-blue-50 border-l-4 border-blue-500"
                  : "hover:bg-surface-secondary border-l-4 border-transparent hover:border-border-strong"
              }`}
            >
              <span className="font-medium text-text-primary group-hover:text-text-accent pr-4">
                {item.question}
              </span>
              <svg
                className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 text-gray-400 ${
                  openIndex === index ? "rotate-180 text-blue-500" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {openIndex === index && (
              <div className="mx-4 mb-1 p-4 bg-blue-50 rounded-b-lg border-l-4 border-blue-200 text-text-muted text-sm leading-relaxed">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}