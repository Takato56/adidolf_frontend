// components/Footer.tsx
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
                            <li><a href="#" className="hover:text-white transition-colors">Company</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Our Mission Statement</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-3">
                            Support
                        </h3>
                        <ul className="flex flex-col space-y-2">
                            <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-3">
                            Legal
                        </h3>
                        <ul className="flex flex-col space-y-2">
                            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>
                <div className="pt-4 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
                    <p>© 2026 Adidolf. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;