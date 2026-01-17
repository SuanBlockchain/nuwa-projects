'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ForwardRefExoticComponent, SVGProps, RefAttributes } from 'react';

interface SidebarNavLinkProps {
  href: string;
  icon: ForwardRefExoticComponent<Omit<SVGProps<SVGSVGElement>, "ref"> & {
    title?: string;
    titleId?: string;
  } & RefAttributes<SVGSVGElement>>;
  label: string;
}

export function SidebarNavLink({ href, icon: Icon, label }: SidebarNavLinkProps) {
  const pathname = usePathname();

  // Exact match for the current page
  // This prevents parent routes from being highlighted when on child routes
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
        isActive
          ? 'bg-mint-9/10 text-mint-9 font-medium'
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon className="w-5 h-5" />
      {label}
    </Link>
  );
}
