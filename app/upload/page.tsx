import { requireAuth } from '@/app/lib/auth-utils';
import UploadClient from './upload-client';

export default async function UploadPage() {
  await requireAuth();

  return (
    <main className="min-h-screen w-full">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-12">
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg rounded-xl shadow-md border border-mint-5 dark:border-mint-8">
          <div className="p-4 md:p-6 lg:p-8">
            <UploadClient />
          </div>
        </div>
      </div>
    </main>
  );
}