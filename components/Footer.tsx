import Link from 'next/link';

function Footer() {
    return (
        <footer className="bg-[#111827] text-gray-300 text-sm">
            <div className="max-w-6xl px-4 py-8">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h3 className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-3">
                            About
                        </h3>
                        <ul className="flex flex-col space-y-2 margin-left-0">
                            <li><Link href="#" className="hover:text-white transition-colors">Company</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Our Mission Statement</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-3">
                            Support
                        </h3>
                        <ul className="flex flex-col space-y-2">
                            <li><Link href="/support/contact-us" className="hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link href="/support/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-3">
                            Legal
                        </h3>
                        <ul className="flex flex-col space-y-2">
                            <li><Link href="/legal/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="pt-4 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
                    <p>© 2026 <Link href="/support/nuremberg">Adidolf</Link>. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;