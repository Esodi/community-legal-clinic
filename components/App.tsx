'use client';

import { useEffect, useState } from 'react';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import How from '@/components/How';
import Announcements from '@/components/Announcements';
import Footer from '@/components/Footer';
import Testimonials from '@/components/Testimonials';
import GradientBackground from '@/components/GradientBackground';
import Header from '@/components/Header';
import { getWebpagesData } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

type PageData = {
  heroData: any;
  servicesData: any;
  howData: any;
  announcementsData: any;
  footerData: any;
  testimonialsData: any;
  headerData: any;
}

export default function App() {
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    setRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pageData = await getWebpagesData();
        setData(pageData);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load website data');
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="flex items-center bg-[#001a42] justify-center min-h-screen">
        <LoadingSpinner initial={true} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen flex-col">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>Error: {error}</p>
        </div>
        <button
          onClick={handleRefresh}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <main className="relative overflow-hidden">
      <Header navigationLinks={data.headerData?.navigationLinks || []} />
      <GradientBackground />
      <Hero data={data.heroData} />
      <Testimonials data={data.testimonialsData} />
      <Services data={data.servicesData} />
      <How data={data.howData} />
      <Announcements data={data.announcementsData} />
      <Footer data={data.footerData} />
    </main>
  );
} 