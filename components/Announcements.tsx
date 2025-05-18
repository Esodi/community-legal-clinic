"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Star from "@/assets/star.svg";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
};

type AnnouncementsProps = {
  data: {
    title: string;
    announcements: Announcement[];
  };
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

export default function Announcements({ data }: AnnouncementsProps) {
  const router = useRouter();

  // Smooth scrolling for #announcements
  useEffect(() => {
    if (window.location.hash === "#announcements") {
      const announcementsSection = document.getElementById("announcements");
      if (announcementsSection) {
        setTimeout(() => {
          announcementsSection.scrollIntoView({ behavior: "smooth" });
        }, 100); // Slight delay to ensure DOM is ready
      }
    }
  }, []);

  const handleAnnouncementClick = (id: number) => {
    if (typeof id !== "number" || id <= 0) {
      console.error("Invalid announcement ID:", id);
      return;
    }
    router.push(`/announcement?id=${id}`);
  };

  return (
    <Section id="announcements" className="bg-white py-16">
      <style jsx global>{`
        .no-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }
      `}</style>

      <Div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-bold text-[#001a42] mb-12 text-center sm:text-left">
          {data.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.announcements.map((announcement, index) => (
            <motion.div
              key={announcement.id}
              className="w-full cursor-pointer transform transition-transform hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              onClick={() => handleAnnouncementClick(announcement.id)}
            >
              <div className="bg-transparent hover:bg-gray-50 rounded-lg p-4 transition-colors duration-200">
                <div className="flex items-start gap-4">
                  {/* Date Circle */}
                  <div className="flex-none w-[60px] h-[60px] rounded-full bg-[#7BA7E8] text-white flex flex-col items-center justify-center text-center p-1">
                    <span className="text-lg font-bold leading-none">
                      {announcement.date.day}
                    </span>
                    <span className="text-xs font-medium mt-0.5">
                      {announcement.date.month}
                    </span>
                    <span className="text-[10px] leading-none">
                      {announcement.date.year}
                    </span>
                  </div>

                  {/* Title and NEW badge */}
                  <div className="flex-1">
                    <div className="relative">
                      <h3 className="text-[#001a42] font-semibold text-lg leading-tight pr-6">
                        {announcement.title}
                      </h3>
                      {announcement.isNew && <NewBadge />}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Div>
    </Section>
  );
}
