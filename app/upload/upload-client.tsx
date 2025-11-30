'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import the Upload component with client-side rendering only
const FileUploadForm = dynamic(() => import('./upload'), { ssr: false });

export default function UploadClient() {
  return (
    <Suspense fallback={
      <div className="w-full h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mint-9"></div>
      </div>
    }>
      <FileUploadForm />
    </Suspense>
  );
}
