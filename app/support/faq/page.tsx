'use client'

import { useState } from 'react'

const faqItems = [
    {
        question: "Wow, very nice products you've got here, what should I buy?",
        answer: "Everything."
    },
    {
        question: "Do you do free shipping?",
        answer: "Yes, but only to Estonia, refer to FedEx to see how much it'll cost."
    },
    {
        question: "How do I find coupon codes?",
        answer: "We often do promotions to give out coupon codes. Here's the current promotion: record yourself yelling \"I have a bomb!\" in an airport and send it to us at barackobama@hotmale.com.us to get a 10% discount coupon code."
    },
    {
        question: "What's your opinion on the 9/11 attacks?",
        answer: "There should have been more planes."
    },
    {
        question: "Milk first or cereal first?",
        answer: "We should put the under-paid worker first but otherwise I put water in first."
    },
    {
        question: "Is Adidolf trying to spread Nazi propaganda?",
        answer: "... Stand still we are about to drone strike your place of residence."
    },
    {
        question: "Why isn't your service available in Israel?",
        answer: "Legal issues."
    }
]

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Frequently Asked Questions</h1>
            
            <div className="space-y-2">
                {faqItems.map((item, index) => (
                    <div key={index}>
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className={`w-full text-left p-4 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                                openIndex === index 
                                    ? 'bg-blue-100 border-l-4 border-blue-500' 
                                    : 'hover:bg-gray-50 border-l-4 border-transparent hover:border-gray-300'
                            }`}
                        >
                            <span className="font-medium text-gray-800 group-hover:text-blue-600">
                                {item.question}
                            </span>
                            <svg
                                className={`w-5 h-5 ml-2 transition-transform duration-200 ${
                                    openIndex === index ? 'rotate-180' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        
                        {openIndex === index && (
                            <div className="ml-4 mt-1 p-3 bg-blue-50 rounded border-l-4 border-blue-200 text-gray-600 animate-fadeIn">
                                {item.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}