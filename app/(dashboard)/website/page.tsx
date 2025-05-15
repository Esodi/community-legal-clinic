'use client'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/');
  }, [router]);

  return (
    <div className="text-center">
      Navigating to Website view
    </div>
  );
};

export default HomePage;


