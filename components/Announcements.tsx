"use client";

import Image from "next/image";
import { motion, useScroll } from "framer-motion";
import Star from "@/assets/star.svg";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaWhatsapp, FaFacebook, FaComment, FaCopy } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

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

// ShareButtons component (integrated inline)
function ShareButtons({ url }: { url: string }) {
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    url
  )}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    url
  )}`;
  const xUrl = `https://x.com/intent/post?url=${encodeURIComponent(url)}`;
  const smsUrl = `sms:?body=${encodeURIComponent(url)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link: ", err);
      alert("Failed to copy link. Please copy it manually.");
    }
  };

  console.log({ FaWhatsapp, FaFacebook, FaXTwitter, FaComment, FaCopy });

  return (
    <div className="flex gap-2 mt-4">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-600 hover:text-green-700"
        onClick={(e) => e.stopPropagation()}
      >
        {FaWhatsapp ? <FaWhatsapp size={16} /> : <span>WhatsApp</span>}
      </a>
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-700"
        onClick={(e) => e.stopPropagation()}
      >
        {FaFacebook ? <FaFacebook size={16} /> : <span>Facebook</span>}
      </a>
      <a
        href={xUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-800 hover:text-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {FaXTwitter ? <FaXTwitter size={16} /> : <span>X</span>}
      </a>
      <a
        href={smsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-white hover:bg-gray-100 text-blue-600 hover:text-blue-700 border border-white rounded-full p-2"
        onClick={(e) => e.stopPropagation()}
      >
        {FaComment ? <FaComment size={16} /> : <span>SMS</span>}
      </a>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleCopyLink();
        }}
        className="bg-white hover:bg-gray-100 text-blue-600 hover:text-blue-700 border border-white rounded-full p-2"
        title="Copy link to clipboard"
      >
        {FaCopy ? <FaCopy size={16} /> : <span>Copy</span>}
      </button>
    </div>
  );
}

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

  useEffect(() => {
    if (window.location.hash === "#announcements") {
      const element = document.getElementById("announcements");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  const handleAnnouncementClick = (id: number) => {
    router.push(`/announcement?id=${id}`);
  };

  return (
    <Section id="announcements" className="bg-white py-16">
      <style jsx global>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
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

                  {/* Title, NEW badge, and ShareButtons */}
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
