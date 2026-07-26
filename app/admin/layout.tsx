'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    const userRole = sessionStorage.getItem('userRole');

    if (!accessToken || userRole !== 'admin') {
      router.replace('/');
      return;
    }

    setIsAllowed(true);
    setChecked(true);
  }, [router]);

  // Nothing is rendered until the check passes, so admin content never
  // flashes on screen for a logged-out or non-admin visitor.
  if (!checked || !isAllowed) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-0">
        {/* Header */}
        <AdminHeader />

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}