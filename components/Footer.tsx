"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaWhatsapp,
  FaTwitter,
  FaFacebook,
  FaYoutube,
  FaArrowUp,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

interface FooterProps {
  data: {
    aboutUs: {
      title: string;
      description: string;
    };
    contactUs: {
      title: string;
      items: Array<{
        id: number;
        label: string;
        value?: string;
        isMain?: boolean;
        isAddress?: boolean;
        isContact?: boolean;
      }>;
    };
    ourServices: {
      title: string;
      items: Array<{
        id: number;
        label: string;
      }>;
    };
    usefulLinks: {
      title: string;
      items: Array<{
        id: number;
        label: string;
        href: string;
      }>;
    };
    socialLinks: Array<{
      id: number;
      platform: string;
      url: string;
      icon: string;
      ariaLabel: string;
    }>;
  };
}

const socialIcons = {
  whatsapp: FaWhatsapp,
  twitter: FaXTwitter,
  facebook: FaFacebook,
  youtube: FaYoutube,
  linkedin: FaLinkedin,
  instagram: FaInstagram,
};

export default function Footer({ data }: FooterProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="about" className="relative bg-[#003087] text-white pt-16 pb-8">
      {/* Light grey-blue top section */}
      <div className="absolute top-0 inset-x-0 h-16 bg-[#EAF4F5]"></div>

      {/* Top Arrow Icon */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ top: "64px" }}
      >
        <div
          className="relative w-12 h-12 -mt-6 cursor-pointer group"
          onClick={scrollToTop}
        >
          <div className="absolute inset-0 bg-[#003087] rounded-full flex items-center justify-center border-2 border-white">
            <FaArrowUp
              className="text-white z-10 group-hover:scale-110 transition-transform"
              size={20}
            />
          </div>
        </div>
      </div>

      {/* Main content with relative positioning to appear above the background */}
      <div className="container mx-auto px-4 pt-10 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12">
          {/* About Us Section with Social Links */}
          <div className="flex flex-col mb-8 lg:mb-0">
            <div>
              <h3 className="text-lg font-bold mb-4 uppercase tracking-wide border-b border-white/20 pb-2">
                {data.aboutUs.title}
              </h3>
              <p className="text-sm text-white/90 leading-relaxed mb-6">
                {data.aboutUs.description}
              </p>
            </div>
            {/* Social Links */}
            <div className="flex space-x-6">
              {data.socialLinks.map((link) => {
                const Icon =
                  socialIcons[link.platform as keyof typeof socialIcons];
                return (
                  <Link
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/90 hover:text-white transition-colors transform hover:scale-110"
                    aria-label={link.ariaLabel}
                  >
                    {Icon && <Icon size={24} className="hover:opacity-100" />}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Contact Us Section */}
          <div className="mb-8 lg:mb-0">
            <h3 className="text-lg font-bold mb-4 uppercase tracking-wide border-b border-white/20 pb-2">
              {data.contactUs.title}
            </h3>
            <div className="text-sm">
              {data.contactUs.items.map((item) => (
                <div key={item.id} className="mb-2 last:mb-0">
                  {item.isMain && (
                    <div className="text-base font-semibold text-white">
                      {item.label}
                    </div>
                  )}
                  {item.isAddress && (
                    <div className="text-white/90">{item.label}</div>
                  )}
                  {item.isContact && (
                    <div className="text-white/90">
                      <span className="text-white/70">{item.label}: </span>
                      <span>{item.value}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Our Services Section */}
          <div className="mb-8 lg:mb-0">
            <h3 className="text-lg font-bold mb-4 uppercase tracking-wide border-b border-white/20 pb-2">
              {data.ourServices.title}
            </h3>
            <ul className="text-sm">
              {data.ourServices.items.map((item) => (
                <li key={item.id} className="mb-2 last:mb-0">
                  <Link
                    href="#services"
                    className="text-white/90 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links Section */}
          <div className="mb-8 lg:mb-0">
            <h3 className="text-lg font-bold mb-4 uppercase tracking-wide border-b border-white/20 pb-2">
              {data.usefulLinks.title}
            </h3>
            <ul className="text-sm">
              {data.usefulLinks.items.map((item) => (
                <li key={item.id} className="mb-2 last:mb-0">
                  {item.href.startsWith("http") ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/90 hover:text-white transition-colors"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-white/90 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 text-center text-sm text-white/70 border-t border-white/10 pt-8">
          © {new Date().getFullYear()} Community Legal Clinic. All Rights
          Reserved.
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 z-50 right-8 bg-[#003087] text-white p-3 rounded-full shadow-lg hover:bg-[#002670] transition-colors"
          aria-label="Scroll to top"
        >
          <FaArrowUp size={20} />
        </button>
      )}
    </footer>
  );
}
