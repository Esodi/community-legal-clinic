'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

type TestimonialType = {
  id: number;
  name: string;
  location: string;
  text: string;
  image: string;
};

type TestimonialsDataType = {
  title: string;
  subtitle: string;
  testimonials: TestimonialType[];
};

const Section = motion.section;
const Div = motion.div;
const H2 = motion.h2;

export default function Testimonials({ data }: { data: TestimonialsDataType }) {
  return (
    <Section id="testimonials" className="relative bg-[#001a42] text-white overflow-hidden pt-20 lg:pt-16 pb-16">
      {/* Removed the dark gradient overlay since it was making content hard to read */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          {/* Title with improved contrast */}
          <H2
            className="text-5xl md:text-6xl lg:text-6xl font-bold mb-6 relative inline-block max-w-[1100px] mx-auto"
            style={{ lineHeight: 1.2, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
          >
            <span className="relative z-30">{data.title}</span>
            <span className="absolute inset-0 z-20 text-[#00ffff] opacity-50 transform translate-x-[3px] translate-y-[3px]">
              {data.title}
            </span>
            <span className="absolute inset-0 z-10 text-[#ff00ff] opacity-40 transform -translate-x-[2px] translate-y-[2px]">
              {data.title}
            </span>
          </H2>

          {/* Subtitle with improved visibility */}
          <div className="max-w-[1100px] mx-auto">
            {/* Mobile plain text with better contrast */}
            <motion.p 
              className="md:hidden text-gray-100 text-lg px-4 leading-relaxed font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {data.subtitle}
            </motion.p>

            {/* Desktop/Tablet curved text with better visibility */}
            <div className="hidden md:block">
              <svg width="100%" height="150" viewBox="0 0 1100 150" className="block">
                <path
                  id="curvePath"
                  d="M 50 120 Q 550 20 1050 120"
                  fill="none"
                  stroke="none"
                />
                <text
                  fill="#f3f4f6"
                  fontSize="32"
                  className="text-2xl font-medium"
                  textLength="1000"
                  lengthAdjust="spacing"
                >
                  <textPath href="#curvePath" startOffset="0%">
                    <motion.tspan
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      {data.subtitle}
                    </motion.tspan>
                  </textPath>
                </text>
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {data.testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 lg:p-8 flex flex-col items-center text-center shadow-lg ${
                index === 2 ? 'md:col-span-2 md:mx-auto md:max-w-[640px] lg:col-span-1' : ''
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="relative w-24 h-24 rounded-full overflow-hidden mb-6 ring-2 ring-white/20">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
              <blockquote className="mb-4">
                <p className="text-gray-100 leading-relaxed text-sm">&ldquo;{testimonial.text}&rdquo;</p>
              </blockquote>
              <div className="mt-auto">
                <h3 className="font-semibold text-lg text-white">{testimonial.name}</h3>
                <p className="text-sm text-gray-200">{testimonial.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
} 