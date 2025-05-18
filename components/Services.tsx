"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Cog } from "lucide-react";
import ConsultationButton from "./Consultation";

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
  const [itemsPerPage, setItemsPerPage] = useState(1);

  // Responsive items per page
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setItemsPerPage(
        width >= 1280 ? 3 : width >= 1024 ? 3 : width >= 640 ? 2 : 1
      );
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(data.packages.length / itemsPerPage);

  // Clamp currentIndex if itemsPerPage changes
  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, totalPages - 1));
  }, [itemsPerPage, totalPages]);

  // Smooth scroll to #services when the page loads with the hash
  useEffect(() => {
    if (window.location.hash === "#services") {
      const servicesSection = document.getElementById("services");
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  const handleServiceClick = useCallback(
    (service: ServicePackage) => router.push(`/service?id=${service.id}`),
    [router]
  );

  const nextSlide = () => setCurrentIndex((i) => (i + 1) % totalPages);
  const prevSlide = () =>
    setCurrentIndex((i) => (i - 1 + totalPages) % totalPages);

  const visibleServices = data.packages.slice(
    currentIndex * itemsPerPage,
    currentIndex * itemsPerPage + itemsPerPage
  );

  return (
    <Section
      id="services"
      className="relative bg-gradient-to-br from-[#001a42] via-[#001a42] to-[#2a1a42] text-white overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#001a42]/90" />
      <Div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-8"
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
            <span className="absolute inset-0 z-20 text-[#00ffff] opacity-70 translate-x-[4px] translate-y-[4px]">
              {data.title}
            </span>
            <span className="absolute inset-0 z-10 text-[#ff00ff] opacity-50 -translate-x-[2px] translate-y-[2px]">
              {data.title}
            </span>
          </H2>
        </div>

        {/* Page indicators */}
        <div className="flex justify-center gap-2 mb-8">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentIndex ? "bg-white w-4" : "bg-white/50"
              }`}
              aria-label={`Go to page ${idx + 1}`}
            />
          ))}
        </div>

        {/* Slideshow */}
        <div className="relative">
          {/* Desktop nav buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-[-40px] lg:left-[-60px] top-1/2 -translate-y-1/2 z-20 hidden md:block"
            aria-label="Previous slide"
          >
            <svg
              className="w-8 h-8 text-white hover:text-gray-300 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mt-12 mb-12 min-h-[600px]"
            style={{ position: "relative" }}
          >
            <AnimatePresence mode="sync">
              {Array.from({ length: itemsPerPage }).map((_, idx) => {
                const circularIndex =
                  (currentIndex * itemsPerPage + idx) % data.packages.length;
                const service = data.packages[circularIndex];
                return (
                  <motion.div
                    key={service.id}
                    className="flex flex-col h-full"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{
                      delay: idx * 0.1,
                      duration: 0.4,
                      ease: "easeInOut",
                    }}
                  >
                    <div className="bg-gradient-to-br from-[#f8faff] to-[#e0e7ff] rounded-lg overflow-hidden shadow-lg flex flex-col h-full border border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all duration-300">
                      {/* Image */}
                      <div
                        className="relative aspect-[16/9] bg-gray-900 cursor-pointer group overflow-hidden"
                        onClick={() => handleServiceClick(service)}
                      >
                        <Image
                          src={service.videoThumbnail}
                          alt={service.title}
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        {service.videoUrl && (
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all flex items-center justify-center">
                            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-red-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-red-600 flex items-center justify-center">
                                <svg
                                  className="w-5 h-5 text-white ml-1"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      {/* Content */}
                      <div className="p-4 lg:p-6 flex-1 flex flex-col h-full">
                        <div className="min-h-[160px] overflow-hidden flex flex-col justify-between">
                          <h3 className="text-gray-900 text-lg lg:text-xl font-bold mb-1 lg:mb-2 line-clamp-2">
                            {service.title}
                          </h3>
                          <div className="text-gray-600 text-sm lg:text-base font-normal">
                            <div className="line-clamp-2">
                              {service.description ||
                                "No description available"}
                            </div>
                            <button
                              onClick={() => handleServiceClick(service)}
                              className="text-blue-600 hover:text-blue-700 text-xs lg:text-sm font-medium mt-1 inline-flex items-center"
                            >
                              learn more
                              <svg
                                className="w-3 h-3 ml-1"
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
                        {/* Offerings */}
                        <div className="bg-gray-50 p-2 lg:p-3 rounded-xl shadow-sm border border-gray-300 mt-3">
                          <div className="flex items-center mb-1 lg:mb-2">
                            <Cog className="h-4 w-4 lg:h-5 lg:w-5 mr-1 text-gray-900 flex-shrink-0" />
                            <h4 className="text-gray-900 text-sm lg:text-base font-semibold">
                              What We Offer:
                            </h4>
                          </div>
                          <div className="space-y-1 lg:space-y-2">
                            {service.offerings
                              .slice(0, 2)
                              .map((offering, i) => (
                                <div
                                  key={offering.id}
                                  className="flex items-start gap-2"
                                >
                                  <div className="flex-shrink-0 w-4 h-4 lg:w-5 lg:h-5 rounded-full border border-blue-500/30 flex items-center justify-center bg-white">
                                    <span className="text-blue-600 text-xs font-semibold">
                                      {i + 1}
                                    </span>
                                  </div>
                                  <p className="text-gray-600 text-xs lg:text-sm leading-tight flex-1">
                                    {offering.text}
                                  </p>
                                </div>
                              ))}
                          </div>
                        </div>
                        {/* CTA */}
                        <div className="mt-auto pt-3 lg:pt-4">
                          <motion.a
                            href="https://shorturl.at/UJAb8"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative overflow-hidden bg-[#00c02c] text-white h-8 lg:h-9 rounded-sm text-xs lg:text-sm flex items-center justify-center gap-2 cursor-pointer select-none group w-full px-4 isolate"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {/* White background that appears on hover */}
                            <motion.span
                              className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out z-0"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              whileHover={{ opacity: 1 }}
                            />

                            {/* WhatsApp Icon */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="mr-2 z-10 text-white group-hover:text-[#00c02c] transition-colors duration-300 shrink-0 pointer-events-none"
                            >
                              <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.18 2.095 3.195 5.076 4.483.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.57-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>

                            {/* Text */}
                            <span className="z-10 text-white group-hover:text-[#00c02c] transition-colors duration-300 pointer-events-none">
                              Chat with Legal Expert
                            </span>
                          </motion.a>
                          <div className="text-center my-2">
                            <span className="text-gray-600 text-xs">Or</span>
                          </div>
                          <ConsultationButton />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          <button
            onClick={nextSlide}
            className="absolute right-[-40px] lg:right-[-60px] top-1/2 -translate-y-1/2 z-20 hidden md:block"
            aria-label="Next slide"
          >
            <svg
              className="w-8 h-8 text-white hover:text-gray-300 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
        {/* Mobile nav buttons */}
        <div className="flex md:hidden justify-between mt-8 mb-4 px-4">
          <button
            onClick={prevSlide}
            className="z-20"
            aria-label="Previous slide"
          >
            <svg
              className="w-6 h-6 text-white hover:text-gray-300 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button onClick={nextSlide} className="z-20" aria-label="Next slide">
            <svg
              className="w-6 h-6 text-white hover:text-gray-300 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </Div>
    </Section>
  );
}
