'use client';

import { useAuthenticator } from '@aws-amplify/ui-react';
import { useRouter } from 'next/navigation';

export function SignOutButton({ className = '' }) {
  const { signOut } = useAuthenticator();
  const router = useRouter();
  
  const handleSignOut = async () => {
    await signOut();
    
    // Redirect to home page after sign out
    router.push('/');
  };
  
  return (
    <button 
      onClick={handleSignOut}
      className={className}
    >
      Sign Out
    </button>
  );
}