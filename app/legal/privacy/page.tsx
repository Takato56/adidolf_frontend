export default function PrivacyPolicy() {
  const sections = [
    {
      title: "What We Collect",
      body: "We collect information you provide directly when creating an account or placing an order: name, email address, shipping address, payment details, and phone number. We also collect standard browsing data such as pages visited, device type, and referral source to help us improve the site.",
    },
    {
      title: "How We Use Your Data",
      body: "Your data is used to process and fulfil orders, send order and shipping confirmations, respond to support requests, and improve our services. We may also use your email to send occasional promotional communications — you can opt out at any time.",
    },
    {
      title: "Cookies",
      body: "We use cookies to maintain your session, remember preferences, and collect anonymised analytics. You can manage cookie preferences through your browser settings. Disabling cookies may affect certain site functionality.",
    },
    {
      title: "Data Sharing",
      body: "We do not sell your personal data. We share it only with third parties necessary to operate our services: payment processors, shipping carriers, and our hosting and analytics providers. All third parties are bound by data processing agreements.",
    },
    {
      title: "Data Retention",
      body: "We retain your personal data for as long as necessary to fulfil your orders and comply with legal obligations. You may request deletion of your account and associated data at any time by contacting support@adidolf.com.",
    },
    {
      title: "Your Rights",
      body: "Depending on your jurisdiction, you may have the right to access, correct, export, or delete your personal data. To exercise any of these rights, contact us at support@adidolf.com. We will respond within 30 days.",
    },
    {
      title: "Security",
      body: "We take reasonable technical and organisational measures to protect your personal data from unauthorised access, loss, or misuse. Payment data is handled exclusively by our PCI-compliant payment processor and is never stored on our servers.",
    },
    {
      title: "Changes to This Policy",
      body: "We may update this Privacy Policy from time to time. When we do, we'll update the date at the top of this page. We encourage you to review it periodically. Continued use of the site after changes constitutes acceptance.",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-10 text-center">
        <p className="text-xs uppercase tracking-widest text-blue-500 font-semibold mb-2">
          Legal
        </p>
        <h1 className="text-3xl font-bold text-text-primary">Privacy Policy</h1>
        <p className="text-text-muted text-sm mt-2">
          Last updated: June 2026
        </p>
      </div>

      <div className="bg-surface-accent border-l-4 border-blue-500 rounded-r-xl px-5 py-4 mb-8 text-sm text-text-secondary leading-relaxed">
        This policy explains what personal data Adidolf collects, how we use
        it, and your rights regarding that data. We are committed to handling
        your information responsibly and transparently.
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
        For privacy-related inquiries, contact support@adidolf.com.
      </p>
    </div>
  );
}