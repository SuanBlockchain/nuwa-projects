'use client';

import dynamic from 'next/dynamic';

const Page = dynamic(() => import('./upload'), { ssr: false });

export default function UploadPage() {
  return (
    <div>
      <Page />
    </div>
  );
}