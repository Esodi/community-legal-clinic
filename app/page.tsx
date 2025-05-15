import dynamic from 'next/dynamic';

// Dynamically import the App component with SSR disabled
const AppComponent = dynamic(() => import('@/components/App'), {
  ssr: false,
});

// Set revalidation time to 1 hour (3600 seconds)
export const revalidate = 3600;

// This is a server component
export default function Home() {
  return (
    <div className="min-h-screen">
      <AppComponent />
    </div>
  );
}