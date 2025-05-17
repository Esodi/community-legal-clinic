"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MessageSquare, Calendar, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import heroImage from "@/assets/hero-img.png";
import phoneImage from "@/assets/phone.svg";
import AnimatedChat from "@/components/animatedChat";
import Whatsapp from "./Whatsapp";

type HeroDataType = {
  headline: string;
  subheadline: string;
  ctaText: string;
  chatData: {
    userMessage: string;
    botResponse: string;
    userName: string;
    options: Array<{
      id: number;
      text: string;
      icon: "calendar" | "chat";
    }>;
  };
};

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(15,23,42,${0.1 + i * 0.03})`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full text-slate-950/10 dark:text-white/10"
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.03}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export default function Hero({ data }: { data: HeroDataType }) {
  const handleChatClick = () => {
    window.open("https://shorturl.at/UJAb8", "_blank", "noopener,noreferrer");
  };

  return (
    <section className="relative bg-[#001a42] text-white overflow-hidden pt-24 min-h-screen flex items-center">
      {/* Add the floating paths background */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative w-full">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center pt-8 lg:pt-12">
          {/* Text content - Pushed to the left */}
          <div className="relative z-10 lg:pr-8">
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 lg:mb-8 relative leading-[1.1] drop-shadow-lg"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="relative w-30 inline-block">
                {/* Main text layer */}
                <span className="relative z-30">{data.headline}</span>

                {/* First glitch layer */}
                <span className="absolute inset-0 z-20 text-cyan-400 opacity-70 transform translate-x-[4px] translate-y-[4px]">
                  {data.headline}
                </span>

                {/* Second glitch layer */}
                <span className="absolute inset-0 z-10 text-pink-500 opacity-50 transform -translate-x-[2px] translate-y-[2px]">
                  {data.headline}
                </span>
              </span>
            </motion.h1>

            <motion.p
              className="text-base sm:text-lg mb-6 lg:mb-8 max-w-md relative z-10 drop-shadow-lg"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            >
              {data.subheadline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
              className="relative z-10"
            >
              <Button
                size="lg"
                className="relative overflow-hidden bg-[#00c02c] text-white px-6 sm:px-8 py-4 sm:py-6 rounded-sm text-sm sm:text-base flex items-center cursor-pointer select-none group"
                onClick={handleChatClick}
              >
                {/* White background that appears on hover */}
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out z-0"></span>

                {/* Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="mr-2 z-10 group-hover:text-[#00c02c] transition-colors duration-300"
                >
                  <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.18 2.095 3.195 5.076 4.483.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.57-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.884-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>

                {/* Text */}
                <span className="z-10 group-hover:text-[#00c02c] transition-colors duration-300">
                  {data.ctaText}
                </span>
              </Button>
            </motion.div>
          </div>

          {/* Hero Image - Pushed to the far right and made larger */}
          <motion.div
            className="relative w-full mt-8 lg:mt-0 lg:ml-auto lg:pr-0"
            initial={{ opacity: 0, y: 20, x: 0 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {/* Mobile transparent container */}
            <div className="lg:hidden relative rounded-xl overflow-hidden bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm p-4 border border-white/10">
              <div className="relative h-[400px] sm:h-[500px]">
                <Image
                  src={heroImage}
                  alt="Hero Illustration"
                  className="w-full h-full object-contain object-center"
                  priority
                  fill
                  sizes="100vw"
                />
              </div>
            </div>

            {/* Desktop version - Larger and aligned to the far right */}
            <div className="hidden lg:block relative h-[800px] xl:h-[900px] w-full max-w-[700px] ml-auto">
              <motion.div
                key="chat"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full h-full"
              >
                <AnimatedChat />
              </motion.div>

              {/* Decorative circles - Reverted to original animation */}
              <motion.div
                className="absolute top-[-5%] right-[-14%]"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <div className="w-20 h-20 lg:w-20 lg:h-20 rounded-full bg-amber-500 opacity-70"></div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile decorative circle */}
      <div className="absolute top-0 right-0 lg:hidden">
        <div className="w-32 h-32 rounded-full bg-amber-500 opacity-70 blur-sm transform translate-x-1/2 -translate-y-1/2"></div>
      </div>
    </section>
  );
}
