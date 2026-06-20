import Link from "next/link";

function Footer() {
  return (
    <footer className="bg-surface-footer text-text-muted text-sm">
      <div className="max-w-6xl px-4 pt-8 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-text-muted font-semibold mb-3">
              About
            </h3>
            <ul className="flex flex-col space-y-2 margin-left-0">
              <li>
                <Link href="/about/company" className="hover:text-text-inverse transition-colors">
                  Company
                </Link>
              </li>
              <li>
                <Link href="/about/mission" className="hover:text-text-inverse transition-colors">
                  Our Mission Statement
                </Link>
              </li>
              <li>
                <Link href="/about/careers" className="hover:text-text-inverse transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-widest text-text-muted font-semibold mb-3">
              Support
            </h3>
            <ul className="flex flex-col space-y-2">
              <li>
                <Link
                  href="/support/contact-us"
                  className="hover:text-text-inverse transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/support/faq"
                  className="hover:text-text-inverse transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-widest text-text-muted font-semibold mb-3">
              Legal
            </h3>
            <ul className="flex flex-col space-y-2">
              <li>
                <Link
                  href="/legal/terms-of-service"
                  className="hover:text-text-inverse transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="hover:text-text-inverse transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-border-strong">
        <div className="max-w-6xl px-4 pt-4 pb-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-text-muted">
          <p>
            © 2026 Adidolf. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
