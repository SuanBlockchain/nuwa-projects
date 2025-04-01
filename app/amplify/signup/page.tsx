'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Box } from '@radix-ui/themes';

export default function SignUp() {
  const { user } = useAuthenticator((context) => [context.route, context.user]);
  const router = useRouter();

  useEffect(() => {
    // If user is already authenticated, redirect to home
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  // The actual auth UI is rendered by the Auth wrapper component
  return (
    <Box className="auth-page">
      <div className="flex-1 w-full" />
    </Box>
  );
}