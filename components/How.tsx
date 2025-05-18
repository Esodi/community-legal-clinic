"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

type Step = {
  id: number;
  title: string;
  description: string;
  icon: string;
};

type HowProps = {
  data: {
    title: string;
    subtitle: string;
    steps: Step[];
  };
};

const Section = motion.section;
const Div = motion.div;
const H2 = motion.h2;

export default function How({ data }: HowProps) {
  return (
    <Section className="relative bg-[#001a42] text-white py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#001a42] to-[#001a42]/90"></div>

      <Div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-16">
          <H2
            className="text-5xl md:text-6xl font-bold mb-4 relative inline-block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="relative z-30">{data.title}</span>
            <span className="absolute inset-0 z-20 text-[#ff00ff] opacity-70 transform translate-x-[4px] translate-y-[4px]">
              {data.title}
            </span>
            <span className="absolute inset-0 z-10 text-[#00ffff] opacity-50 transform -translate-x-[2px] translate-y-[2px]">
              {data.title}
            </span>
          </H2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {data.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
          {data.steps.map((step, index) => (
            <motion.div
              key={step.id}
              className="text-center md:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              <div className="flex flex-col items-center">
                <div className="w-full">
                  <h3 className="text-2xl font-semibold mb-4 text-left flex items-center gap-2">
                    <div className="flex items-center">
                      <span className="text-[#B8860B] mr-2">{step.id}.</span>
                      <span className="text-[#B8860B]">{step.title}</span>
                    </div>
                  </h3>
                </div>
                <div className="flex flex-row items-center justify-between">
                  <p className="text-gray-300 text-lg leading-relaxed w-3/4">
                    {step.description}
                  </p>
                  <div className="flex-shrink-0 w-32 h-32 relative">
                    <Image
                      src={step.icon}
                      alt={`Step ${step.id}`}
                      width={200}
                      height={200}
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            size="lg"
            className="relative overflow-hidden bg-[#00c02c] text-white px-6 sm:px-8 py-4 sm:py-6 rounded-sm text-sm sm:text-base flex items-center cursor-pointer select-none group w-full sm:w-auto mx-auto max-w-[90%] sm:max-w-none"
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
              className="mr-2 z-10 group-hover:text-[#00c02c] transition-colors duration-300 flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8"
            >
              <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.18 2.095 3.195 5.076 4.483.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.57-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>

            {/* Text */}
            <span className="z-10 group-hover:text-[#00c02c] transition-colors duration-300">
              Start Now on WhatsApp
            </span>
          </Button>
        </div>
      </Div>
    </Section>
  );
}
