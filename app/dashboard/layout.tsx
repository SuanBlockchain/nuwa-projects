'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    // Add dashboard-page class to body
    document.body.classList.add('dashboard-page');
    
    // Clean up by removing the class when the component unmounts
    return () => {
      document.body.classList.remove('dashboard-page');
    };
  }, []);
  
  return (
    <>
      {/* Background wrapper with inline styles to ensure it works */}
      <div
        className="fixed inset-0"
        style={{
          zIndex: -1,
          backgroundImage: resolvedTheme === 'dark'
            ? 'linear-gradient(135deg, #053230 0%, #064641 25%, #085c56 50%, #0A5E5C 75%, #0d7b77 100%)'
            : 'linear-gradient(135deg, #edfaf6 0%, #def7ef 25%, #c7f2e6 50%, #a9ebd9 75%, #7ee0c6 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradient 15s ease infinite',
        }}
      >
        {/* Optional overlay */}
        <div className="absolute inset-0 bg-black opacity-10"></div>
      </div>
      {children}
    </>
  );
}