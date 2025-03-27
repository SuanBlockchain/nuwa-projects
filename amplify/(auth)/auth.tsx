'use client';
import { Authenticator, Heading, Radio, RadioGroupField, useAuthenticator, View } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: "us-east-2_B8PlrPumH",
        userPoolClientId: "48cr50230aq1mfrjlgsha3iudm",
      },
    }
  });

  const components = {
    Header() {
      return (
        <View className="mt-4 mb-7">
          <Heading level={3} className="!text-2xl !font-bold">
            RENT
            <span className="text-secondary-500 font-light hover:!text-primary-300">
              IFUL
            </span>
          </Heading>
          <p className="text-muted-foreground mt-2">
            <span className="font-bold">Welcome!</span> Please sign in to continue
          </p>
        </View>
      );
    },
    SignIn: {
      Footer() {
        const { toSignUp } = useAuthenticator();
        return (
          <View className="text-center mt-4">
            <p className="text-muted-foreground">
              Don&apos;t have an account?{" "}
              <button
                onClick={toSignUp}
                className="text-primary hover:underline bg-transparent border-none p-0"
              >
                Sign up here
              </button>
            </p>
          </View>
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
          <View className="text-center mt-4">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <button
                onClick={toSignIn}
                className="text-primary hover:underline bg-transparent border-none p-0"
              >
                Sign in
              </button>
            </p>
          </View>
        );
      },
    },
  };

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
  const { user } = useAuthenticator((context) => [context.user]);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage = pathname.match(/^\/(signin|signup)$/);
  const isDashboardPage = pathname.match(/^\/dashboard/);

  useEffect(() => {
    if (user && isAuthPage) {
      router.push("/");
    }
  }, [user, isAuthPage, router]);

  if (!isAuthPage && !isDashboardPage) {
    return <>{children}</>;
  }

  return (
    <Authenticator initialState={pathname.includes("signup") ? "signUp" : "signIn"} components={components} formFields={formFields}>
      {() => <>{children}</>}
    </Authenticator>
  );
}