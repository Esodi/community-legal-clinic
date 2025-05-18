// app/page.tsx
'use client';

import dynamic from 'next/dynamic';

// Dynamically import the App component with SSR disabled
const AppComponent = dynamic(() => import('@/components/App'), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="min-h-screen">
      <AppComponent />
    </div>
  );
}