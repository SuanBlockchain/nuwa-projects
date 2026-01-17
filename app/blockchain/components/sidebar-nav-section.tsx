import type { ReactNode } from 'react';

interface SidebarNavSectionProps {
  title: string;
  children: ReactNode;
}

export function SidebarNavSection({ title, children }: SidebarNavSectionProps) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 pl-3">
        {title}
      </h3>
      <nav className="space-y-1">
        {children}
      </nav>
    </div>
  );
}
