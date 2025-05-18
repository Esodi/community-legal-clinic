"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import AppointmentButton from "@/components/consultation";

// Dynamically import ReactPlayer with proper configuration
const ReactPlayer = dynamic(
  () => import("react-player").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    ),
  }
);

// VideoPlayer component to handle the player rendering
const VideoPlayer = ({ url }: { url: string }) => {
  return (
    <div className="relative w-full h-full">
      <ReactPlayer
        url={url}
        playing
        controls
        width="100%"
        height="100%"
        config={{
          youtube: {
            playerVars: {
              autoplay: 1,
              modestbranding: 1,
              rel: 0,
            },
          },
        }}
      />
    </div>
  );
};

type Offering = {
  id: number;
  text: string;
};

type Service = {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  videoThumbnail: string;
  offerings: Offering[];
};

export default function ServicePage() {
  const searchParams = useSearchParams();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiData, setApiData] = useState<any>(null);
  const idParam = searchParams.get("id");
  const id = idParam ? Number(idParam) : NaN;
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (!idParam || isNaN(id)) {
      setError("Invalid or missing service ID in URL");
      setLoading(false);
      setService(null);
      return;
    }

    const fetchService = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/webpages");
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }
        const data = await response.json();
        setApiData(data);

        const foundService = data.servicesData?.packages?.find(
          (s: Service) => s.id === id
        );
        if (!foundService) {
          throw new Error("Service not found");
        }

        setService(foundService);
      } catch (error) {
        console.error("Error fetching service:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch service"
        );
        setService(null);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id, idParam]);

  // Show video player after thumbnail click or immediately if no thumbnail
  useEffect(() => {
    if (service && (!service.videoThumbnail || !service.videoUrl)) {
      setShowVideo(true);
    } else {
      setShowVideo(false);
    }
  }, [service]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#001a42] via-[#001a42] to-[#2a1a42] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#001a42] via-[#001a42] to-[#2a1a42] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl mb-4">Service not found</div>
          <div className="text-gray-400">{error}</div>
          {apiData && (
            <pre className="text-xs text-left mt-4 bg-black/50 p-2 rounded max-w-xl overflow-x-auto">
              {JSON.stringify(apiData, null, 2)}
            </pre>
          )}
        </div>
      </div>
    );
  }

  const isYoutube =
    service.videoUrl?.includes("youtube.com") ||
    service.videoUrl?.includes("youtu.be");
  const isVimeo = service.videoUrl?.includes("vimeo.com");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001a42] via-[#001a42] to-[#2a1a42] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/#services"
          className="inline-flex items-center text-white hover:text-blue-400 mb-8 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
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
          Back to Our Services
        </Link>

        <div className="bg-black/20 rounded-lg overflow-hidden shadow-xl">
          <div className="aspect-video relative">
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center bg-black">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
              }
            >
              {service.videoUrl &&
              (showVideo || !service.videoThumbnail) &&
              (isYoutube || isVimeo) ? (
                <VideoPlayer url={service.videoUrl} />
              ) : service.videoThumbnail ? (
                <button
                  type="button"
                  className="w-full h-full absolute inset-0 focus:outline-none"
                  onClick={() => setShowVideo(true)}
                  aria-label="Play video"
                  style={{ zIndex: 2 }}
                >
                  <Image
                    src={service.videoThumbnail}
                    alt={service.title}
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                      <circle cx="40" cy="40" r="40" fill="rgba(0,0,0,0.5)" />
                      <polygon points="32,25 60,40 32,55" fill="#fff" />
                    </svg>
                  </span>
                </button>
              ) : null}
            </Suspense>
          </div>

          <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">{service.title}</h1>

            <div className="bg-white/10 rounded-lg p-6 mb-8 border border-white/20">
              {service.description.split("\n").map((paragraph, index) => (
                <p
                  key={index}
                  className="text-gray-300 leading-relaxed mb-4 last:mb-0"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">What We Offer:</h2>
              <div className="grid gap-6">
                {service.offerings.map((offering, index) => (
                  <div key={offering.id} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {index + 1}
                      </span>
                    </div>
                    <p className="text-gray-300 flex-1 pt-1">{offering.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 space-y-4">
              <motion.a
                href="https://shorturl.at/UJAb8"
                target="_blank"
                rel="noopener noreferrer"
                className="relative overflow-hidden w-full bg-[#25D366] hover:bg-[#22c35e] text-white h-12 flex items-center justify-center gap-2 text-base font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 isolate group"
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

              <div className="text-center">
                <span className="text-white/80">Or</span>
              </div>
              <AppointmentButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
