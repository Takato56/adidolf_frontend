export default function TermsOfService() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      body: "By accessing or purchasing from Adidolf, you agree to these Terms of Service in their entirety. If you do not agree with any part of these terms, please discontinue use of the site.",
    },
    {
      title: "2. Products",
      body: "All products are sold as described on their respective product pages. Adidolf makes no warranty beyond what is stated in each listing. Product images are representative; minor variations in colour may occur due to screen calibration.",
    },
    {
      title: "3. Payments",
      body: "All prices are listed in USD unless otherwise stated. Payment is due at the time of order. We accept all major credit and debit cards. Transactions are processed securely through our payment provider.",
    },
    {
      title: "4. Shipping & Delivery",
      body: "We ship to select countries. Standard delivery typically takes 5–10 business days. Express options are available at checkout. Delivery windows may vary for international orders due to customs processing.",
    },
    {
      title: "5. Returns & Refunds",
      body: "We accept returns within 30 days of delivery on unworn, unwashed items in original packaging. To initiate a return, contact support@adidolf.com with your order number. Refunds are issued to the original payment method within 5–7 business days of receiving the return.",
    },
    {
      title: "6. User Conduct",
      body: "Users agree not to misuse this platform, attempt to circumvent security measures, impersonate Adidolf staff, or submit fraudulent orders. We reserve the right to cancel orders and suspend accounts that violate these terms.",
    },
    {
      title: "7. Intellectual Property",
      body: "All designs, branding, copy, and imagery on this site are the property of Adidolf and may not be reproduced or used without written permission.",
    },
    {
      title: "8. Limitation of Liability",
      body: "Adidolf is not liable for any indirect, incidental, or consequential damages arising from the use of our products or services. Our liability is limited to the value of the order in question.",
    },
    {
      title: "9. Governing Law",
      body: "These Terms are governed by the laws of Germany. Any disputes will be subject to the exclusive jurisdiction of the courts of Nuremberg.",
    },
    {
      title: "10. Changes to Terms",
      body: "We reserve the right to update these Terms at any time. Continued use of the site following any changes constitutes acceptance of the revised Terms. We recommend reviewing this page periodically.",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-10 text-center">
        <p className="text-xs uppercase tracking-widest text-blue-500 font-semibold mb-2">
          Legal
        </p>
        <h1 className="text-3xl font-bold text-text-primary">Terms of Service</h1>
        <p className="text-text-muted text-sm mt-2">
          Last updated: January 2025
        </p>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl px-5 py-4 mb-8 text-sm text-text-primary leading-relaxed">
        Please read these Terms carefully before using Adidolf. By placing an
        order or using this site, you agree to be bound by the terms below.
      </div>

      <div className="space-y-6">
        {sections.map(({ title, body }) => (
          <div key={title} className="border-b border-border-divider last:border-0 pb-6 last:pb-0">
            <h2 className="font-semibold text-text-primary text-sm mb-2">{title}</h2>
            <p className="text-sm text-text-muted leading-relaxed">{body}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-text-muted text-center mt-10">
        Questions about these Terms? Contact us at support@adidolf.com.
      </p>
    </div>
  );
}