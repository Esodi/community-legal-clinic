import React from "react";

const AppointmentButton = () => {
  return (
    <div className="relative w-full">
      <a
        href="https://shorturl.at/EMOCr"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-full h-12 bg-white text-black border border-gray-700 rounded-lg hover:bg-black hover:text-white hover:border-black transition-all duration-300 font-medium text-base shadow-md hover:shadow-lg overflow-hidden"
      >
        <span className="relative z-10 group-hover:text-white">
          Book Consultation
        </span>

        {/* Goo blob fully filling the button */}
        <div
          className="absolute inset-0 bg-black rounded-lg transform translate-y-full opacity-0 transition-all duration-700 ease-in-out group-hover:translate-y-0 group-hover:opacity-100"
          style={{ filter: "url(#goo)" }}
        />
      </a>

      {/* Goo filter */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter
            id="goo"
            x="0"
            y="0"
            width="200%"
            height="200%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="
                1 0 0 0 0  
                0 1 0 0 0  
                0 0 1 0 0  
                0 0 0 18 -7"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default AppointmentButton;
