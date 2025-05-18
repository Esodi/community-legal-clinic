"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Star from "@/assets/star.svg";
import LoadingSpinner from "@/components/LoadingSpinner";
import { CalendarDays, Share2, ArrowLeft } from "lucide-react";
import Link from "next/link";
// import ShareButtons from "@/components/ShareButtons1";

type Announcement = {
  id: number;
  title: string;
  description: string;
  date: {
    day: string;
    month: string;
    year: string;
  };
  isNew?: boolean;
  image?: string;
};

const Section = motion.section;
const Div = motion.div;

const NewBadge = () => (
  <motion.div
    className="inline-flex items-center absolute -right-2 -top-3"
    initial={{ opacity: 0.4, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1.1 }}
    transition={{
      repeat: Infinity,
      repeatType: "reverse",
      duration: 2,
      ease: "easeInOut",
    }}
  >
    <Image
      src={Star}
      alt="New"
      width={40}
      height={40}
      className="object-contain"
      priority
    />
  </motion.div>
);

const sampleData = {
  image:
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1470&auto=format&fit=crop" as string,
};

const ShareButton = () => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm"
    >
      <Share2 size={16} />
      <span className="hidden sm:inline">Share</span>
    </button>
  );
};

export default function AnnouncementPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [loading, setLoading] = useState(true);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await fetch("/api/webpages");
        if (!response.ok) {
          throw new Error("Failed to fetch announcement");
        }
        const data = await response.json();
        const foundAnnouncement = data.announcementsData.announcements.find(
          (a: Announcement) => a.id === Number(id)
        );

        if (!foundAnnouncement) {
          throw new Error("Announcement not found");
        }

        setAnnouncement({
          ...foundAnnouncement,
          image: foundAnnouncement.image || sampleData.image,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load announcement"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAnnouncement();
    } else {
      setError("No announcement ID provided");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col bg-white py-8 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-600">{error}</p>
            <Link
              href="/#announcements"
              className="mt-6 sm:mt-8 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Announcements
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!announcement) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Section className="flex-grow py-8 sm:py-16">
        <Div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-4xl mx-auto">
            {/* Navigation */}
            <div className="flex justify-between items-center mb-6 sm:mb-8">
              <Link
                href="/#announcements"
                className="inline-flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base"
              >
                <ArrowLeft size={18} />
                <span className="hidden sm:inline">Back to Announcements</span>
                <span className="sm:hidden">Back</span>
              </Link>
              {/* <ShareButtons /> */}
            </div>

            <div className="bg-white shadow-xl rounded-xl overflow-hidden">
              {/* Title */}
              <div className="p-4 sm:p-8">
                <div className="relative mb-6">
                  <h1 className="text-[#001a42] font-bold text-2xl sm:text-4xl leading-tight pr-8">
                    {announcement.title}
                  </h1>
                  {announcement.isNew && <NewBadge />}
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 mb-6 sm:mb-8 text-gray-600 text-sm sm:text-base">
                  <CalendarDays size={18} />
                  <span>{`${announcement.date.month} ${announcement.date.day}, ${announcement.date.year}`}</span>
                </div>

                {/* Image */}
                {announcement.image && (
                  <div className="relative w-full h-[200px] sm:h-[400px] mb-6 sm:mb-8 rounded-xl overflow-hidden">
                    <Image
                      src={announcement.image}
                      alt={announcement.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                )}

                {/* Content */}
                <div className="prose prose-sm sm:prose-lg max-w-none text-gray-600">
                  <p className="leading-relaxed whitespace-pre-wrap">
                    {announcement.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Div>
      </Section>
    </div>
  );
}
