'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiPackage, FiGrid, FiShoppingCart, FiUsers, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: '/admin', label: 'Overview', icon: FiHome },
    { href: '/admin/products', label: 'Products', icon: FiPackage },
    { href: '/admin/categories', label: 'Categories', icon: FiGrid },
    { href: '/admin/orders', label: 'Orders', icon: FiShoppingCart },
    { href: '/admin/users', label: 'Users', icon: FiUsers },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static left-0 top-0 h-screen w-64 bg-gray-900 text-white flex flex-col z-40 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo/Brand */}
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-blue-400">Admin</h1>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-6 space-y-2">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(href)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-6 border-t border-gray-700">
          <button className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors">
            <FiLogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
        />
      )}
    </>
  );
}
