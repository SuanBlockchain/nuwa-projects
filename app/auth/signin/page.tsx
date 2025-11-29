import { SignInForm } from '@/app/auth/signin/signin-form';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-mint-light dark:bg-gradient-mint-dark">
      <div className="w-full max-w-md">
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 font-display">
              Welcome Back
            </h1>
            <p className="text-slate-600 dark:text-slate-400 font-display">
              Sign in to your account to continue
            </p>
          </div>

          <SignInForm />

          <div className="mt-6 text-center text-sm font-display">
            <span className="text-slate-600 dark:text-slate-400">
              Don&apos;t have an account?{' '}
            </span>
            <Link
              href="/auth/signup"
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
