'use client';
import { Authenticator, Heading, Radio, RadioGroupField, useAuthenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import '@/app/amplify/(auth)/auth-theme.css'
import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import Image from 'next/image';

// Amplify configuration
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "us-east-2_B8PlrPumH",
      userPoolClientId: "48cr50230aq1mfrjlgsha3iudm",
    },
  }
});

// Custom components for the Authenticator
const components = {
  Header() {
    const { resolvedTheme } = useTheme();
    const isDarkMode = resolvedTheme === 'dark';
    
    const logoPath = isDarkMode 
      ? '/nuwa-logo1.png'  // Path to your light version logo for dark mode
      : '/nuwa-logo1.png';  // Path to your dark version logo for light mode
      
    return (
      <div className="mt-4 mb-7 text-center">
        <div className="mb-2 flex items-center justify-center">
          <Image 
            src={logoPath} 
            alt="NUWA Logo" 
            width={80} 
            height={80} 
            className="mb-3"
          />
        </div>
        <Heading level={3} className="text-2xl font-bold text-mint-8 dark:text-mint-8">
          NUWA
        </Heading>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          <span className="font-semibold">Welcome!</span> Please sign in to continue
        </p>
      </div>
    );
  },
  Footer() {
    return (
      <div className="pt-4 pb-3 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Nuwa. All rights reserved.
        </p>
      </div>
    );
  },
  SignIn: {
    Footer() {
      const { toSignUp } = useAuthenticator();
      return (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Don&apos;t have an account?{" "}
            <button
              onClick={toSignUp}
              className="text-mint-9 hover:text-mint-10 hover:underline bg-transparent border-none p-0 font-medium transition-colors dark:text-mint-8"
            >
              Sign up here
            </button>
          </p>
        </div>
      );
    },
  },
  SignUp: {
    FormFields() {
      const { validationErrors } = useAuthenticator();
  
      return (
        <>
          <Authenticator.SignUp.FormFields />
          <RadioGroupField
            legend="Role"
            name="custom:role"
            errorMessage={validationErrors?.["custom:role"]}
            hasError={!!validationErrors?.["custom:role"]}
            isRequired
            className="custom-radio-group"
          >
            <Radio value="ADMIN">ADMIN</Radio>
            <Radio value="GESTOR">GESTOR</Radio>
          </RadioGroupField>
        </>
      );
    },
    Footer() {
      const { toSignIn } = useAuthenticator();
      return (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Already have an account?{" "}
            <button
              onClick={toSignIn}
              className="text-mint-9 hover:text-mint-10 hover:underline bg-transparent border-none p-0 font-medium transition-colors dark:text-mint-8"
            >
              Sign in
            </button>
          </p>
        </div>
      );
    },
  },
};

// Form fields configuration
const formFields = {
  signIn: {
    username: {
      placeholder: "Enter your email",
      label: "Email",
      isRequired: true,
    },
    password: {
      placeholder: "Enter your password",
      label: "Password",
      isRequired: true,
    },
  },
  signUp: {
    username: {
      order: 1,
      placeholder: "Choose a username",
      label: "Username",
      isRequired: true,
    },
    email: {
      order: 2,
      placeholder: "Enter your email address",
      label: "Email",
      isRequired: true,
    },
    password: {
      order: 3,
      placeholder: "Create a password",
      label: "Password",
      isRequired: true,
    },
    confirm_password: {
      order: 4,
      placeholder: "Confirm your password",
      label: "Confirm Password",
      isRequired: true,
    },
  },
};

export default function Auth({ children }: { children: React.ReactNode }) {
  return (
    <Authenticator.Provider>
      <AuthContent>{children}</AuthContent>
    </Authenticator.Provider>
  );
}

function AuthContent({ children }: { children: React.ReactNode }) {
  const { user } = useAuthenticator((context) => [context.user, context.route]);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage = pathname === '/signin' || pathname === '/signup';
  const isDashboardPage = pathname.startsWith('/dashboard');

  useEffect(() => {
    // Redirect authenticated users away from auth pages
    if (user && isAuthPage) {
      router.push('/');
    }
    
    // Redirect unauthenticated users away from protected pages
    if (!user && isDashboardPage) {
      router.push('/signin');
    }
  }, [user, isAuthPage, isDashboardPage, router]);

  // Render the authentication UI on auth pages
  if (isAuthPage) {
    return (
      <div className=" min-h-screen w-full flex items-center justify-center">
        <div className="py-8 px-4 w-full">
          <div className="auth-card-container auth-gradient-background">
            <Authenticator 
              initialState={pathname === '/signup' ? 'signUp' : 'signIn'} 
              components={components} 
              formFields={formFields}
            >
              {() => {
                return <div></div>;
              }}
            </Authenticator>
          </div>
        </div>
      </div>
    );
  }

  // Protected routes check
  if (isDashboardPage && !user) {
    // This will be handled by the useEffect redirect
    return null;
  }

  // For all other routes, render the children
  return <>{children}</>;
}