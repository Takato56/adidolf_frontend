// FILE: takato56-adidolf_frontend/app/admin/layout.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { getAccessToken, getUserSession } from '@/lib/auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const accessToken = getAccessToken();
    const session = getUserSession();

    if (!accessToken || session?.role !== 'admin') {
      router.replace('/');
      return;
    }

    setIsAllowed(true);
    setChecked(true);
  }, [router]);

  if (!checked || !isAllowed) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden md:ml-0">
        <AdminHeader />

        <main className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}