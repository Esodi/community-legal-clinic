"use client";

import { FaWhatsapp, FaFacebook, FaComment, FaCopy } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

type ShareButtonsProps = {
  url?: string; // Optional URL prop
};

export default function ShareButtons({ url }: ShareButtonsProps) {
  const currentUrl =
    url || (typeof window !== "undefined" ? window.location.href : "");

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    currentUrl
  )}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    currentUrl
  )}`;
  const xUrl = `https://x.com/intent/post?url=${encodeURIComponent(
    currentUrl
  )}`;
  const smsUrl = `sms:?body=${encodeURIComponent(currentUrl)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link: ", err);
      alert("Failed to copy link. Please copy it manually.");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-600 hover:text-green-700"
        aria-label="Share on WhatsApp"
      >
        <FaWhatsapp size={20} />
      </a>
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-700"
        aria-label="Share on Facebook"
      >
        <FaFacebook size={20} />
      </a>
      <a
        href={xUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-800 hover:text-gray-900"
        aria-label="Share on X"
      >
        <FaXTwitter size={20} />
      </a>
      <a
        href={smsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-700"
        aria-label="Share via SMS"
      >
        <FaComment size={20} />
      </a>
      <button
        onClick={handleCopyLink}
        className="text-blue-600 hover:text-blue-700"
        title="Copy link to clipboard"
        aria-label="Copy link to clipboard"
      >
        <FaCopy size={20} />
      </button>
    </div>
  );
}
