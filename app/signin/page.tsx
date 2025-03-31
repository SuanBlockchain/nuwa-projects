"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Box } from '@radix-ui/themes';

export default function SignIn() {
  const { user } = useAuthenticator((context) => [context.route, context.user]);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  return (
    <Box className="auth-page">
      {/* Auth UI will be rendered by the Auth wrapper component */}
      <div className="flex-1 w-full" />
    </Box>
  );
}