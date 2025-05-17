import React from "react";

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

// Define the props type for the Whatsapp button component
type WhatsappButtonProps = {
  onClick: () => void;
  data: HeroDataType;
};

const Whatsapp: React.FC<WhatsappButtonProps> = ({ onClick, data }) => {
  if (!data) return null;

  return (
    <button
      onClick={onClick}
      className="bg-green-500 hover:bg-green-600 text-white px-6 sm:px-8 py-4 sm:py-6 rounded-md text-sm sm:text-base flex items-center shadow-lg hover:shadow-xl transition-all"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="white"
        className="mr-2"
      >
        <path d="M5.026 23c9.038 0 14.341-7.503 14.341-14.334 0-.14 0-.282-.006-.422A10.685 10.685 0 0 0 24 3.542a10.658 10.658 0 0 1-3.111.853A5.301 5.301 0 0 0 22.447 2.58a10.533 10.533 0 0 1-3.481 1.324A5.286 5.286 0 0 0 11.875 9.03a14.325 14.325 0 0 1-10.767-5.429 5.289 5.289 0 0 0 1.638 7.045A5.323 5.323 0 0 1 .64 10.575v.045a5.288 5.288 0 0 0 4.232 5.18 5.203 5.203 0 0 1-1.392.185 5.23 5.23 0 0 1-.984-.092 5.283 5.283 0 0 0 4.937 3.677A10.588 10.588 0 0 1 .78 21.58a10.32 10.32 0 0 1-1.07-.058A14.344 14.344 0 0 0 5.026 23z" />
      </svg>
      {data.ctaText}
    </button>
  );
};

export default Whatsapp;
