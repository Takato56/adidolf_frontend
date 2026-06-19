'use client';

import { usePathname } from 'next/navigation';

interface Breadcrumb {
  label: string;
  href?: string;
}

export function AdminHeader() {
  const pathname = usePathname();

  const getBreadcrumbs = (): Breadcrumb[] => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: Breadcrumb[] = [{ label: 'Dashboard', href: '/admin' }];

    if (segments.length > 1) {
      const lastSegment = segments[segments.length - 1];
      const label =
        lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
      breadcrumbs.push({ label });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  const pageTitle =
    breadcrumbs[breadcrumbs.length - 1]?.label || 'Dashboard';

  return (
    <header className="bg-surface-elevated border-b border-border px-6 py-4 md:ml-0">
      <div className="flex flex-col space-y-2">
        {/* Breadcrumbs */}
        <nav className="text-sm text-text-muted">
          {breadcrumbs.map((crumb, index) => (
            <span key={index}>
              {index > 0 && <span className="mx-2">/</span>}
              <span className={index === breadcrumbs.length - 1 ? 'text-text-primary font-medium' : ''}>
                {crumb.label}
              </span>
            </span>
          ))}
        </nav>

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-text-primary">{pageTitle}</h1>
      </div>
    </header>
  );
}
