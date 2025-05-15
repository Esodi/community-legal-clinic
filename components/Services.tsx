'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Cog } from 'lucide-react';

type ServicePackage = {
  id: number;
  title: string;
  description: string;
  videoThumbnail: string;
  videoUrl: string;
  offerings: Array<{
    id: number;
    text: string;
  }>;
};

type ServicesProps = {
  data: {
    title: string;
    packages: ServicePackage[];
  };
};

const Section = motion.section;
const Div = motion.div;
const H2 = motion.h2;

export default function Services({ data }: ServicesProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(data.packages.length / itemsPerPage);

  // Function to extract video ID from YouTube URL
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Function to handle service click
  const handleServiceClick = (service: ServicePackage) => {
    // Navigate to service page with only the ID
    router.push(`/service?id=${service.id}`);
  };

  // Navigation functions
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalPages) % totalPages);
  };

  // Get current visible services
  const visibleServices = data.packages.slice(
    currentIndex * itemsPerPage,
    (currentIndex * itemsPerPage) + itemsPerPage
  );

  return (
    <Section id="services" className="relative bg-gradient-to-br from-[#001a42] via-[#001a42] to-[#2a1a42] text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#001a42]/90"></div>
      
      <Div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-8 lg:py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mt-12 lg:mt-16">
          <H2 
            className="text-4xl md:text-5xl font-bold mb-6 relative inline-block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="relative z-30">{data.title}</span>
            <span className="absolute inset-0 z-20 text-[#00ffff] opacity-70 transform translate-x-[4px] translate-y-[4px]">
              {data.title}
            </span>
            <span className="absolute inset-0 z-10 text-[#ff00ff] opacity-50 transform -translate-x-[2px] translate-y-[2px]">
              {data.title}
            </span>
          </H2>
        </div>

        {/* Slideshow Navigation */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={prevSlide}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex gap-2 items-center">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-white w-4' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
          <button
            onClick={nextSlide}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Grid Layout with Animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <AnimatePresence mode="sync">
            {visibleServices.map((service, index) => (
              <motion.div
                key={service.id}
                className="flex flex-col h-full"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <div className="bg-[#f8faff] backdrop-blur-sm rounded-lg overflow-hidden shadow-lg flex flex-col h-full border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300">
                  <div 
                    className="relative aspect-[16/9] bg-gray-900 cursor-pointer group overflow-hidden"
                    onClick={() => handleServiceClick(service)}
                  >
                    <Image
                      src={service.videoUrl 
                        ? `https://img.youtube.com/vi/${getYouTubeVideoId(service.videoUrl)}/hqdefault.jpg`
                        : service.videoThumbnail}
                      alt={service.title}
                      className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {service.videoUrl && (
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-20 h-20 rounded-full bg-red-600/20 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                            <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center">
                              <svg className="w-8 h-8 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col h-full">
                    <div className="h-[180px] overflow-hidden">
                      <h3 className="text-gray-900 text-2xl font-semibold mb-4 line-clamp-2">{service.title}</h3>
                      <div className="text-gray-600 text-lg font-normal">
                        <div className="line-clamp-2">
                          {service.description || "No description available"}
                        </div>
                        <button
                          onClick={() => handleServiceClick(service)}
                          className="text-blue-600 hover:text-blue-700 text-base font-medium mt-2 inline-flex items-center"
                        >
                          See More
                          <svg 
                            className="w-4 h-4 ml-1" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl shadow-sm border-2 border-gray-500">
                      <div className="flex items-center mb-4">
                        <div className="flex items-center w-full">
                          <Cog className="h-8 w-8 mr-2 text-gray-900 flex-shrink-0" />
                          <h4 className="text-gray-900 text-lg font-semibold">What We Offer:</h4>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {service.offerings.slice(0, 3).map((offering, index) => (
                          <div key={offering.id} className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-blue-500/30 flex items-center justify-center bg-white">
                              <span className="text-blue-600 text-sm font-semibold">{index + 1}</span>
                            </div>
                            <p className="text-gray-600 text-base leading-relaxed flex-1">{offering.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-auto pt-6">
                      <a 
                        href="https://shorturl.at/UJAb8"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#25D366] hover:bg-[#22c35e] text-white h-12 flex items-center justify-center gap-2 text-base font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="20" 
                          height="20" 
                          viewBox="0 0 24 24" 
                          fill="currentColor" 
                          className="flex-shrink-0"
                        >
                          <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.18 2.095 3.195 5.076 4.483.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.57-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        Chat with Legal Expert
                      </a>
                      <div className="text-center my-2">
                        <span className="text-gray-600">Or</span>
                      </div>
                      <a 
                        href="https://shorturl.at/EMOCr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full h-12 bg-black text-white border border-gray-700 rounded-lg hover:bg-gray-900 transition-all duration-300 font-medium text-base flex items-center justify-center shadow-md hover:shadow-lg"
                      >
                        Book Consultation
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Div>
    </Section>
  );
} 