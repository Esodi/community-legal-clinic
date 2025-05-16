import React from "react";

const GooeyButton = () => {
  return (
    <div className="relative inline-block">
      <a
        href="https://shorturl.at/EMOCr"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative inline-flex items-center overflow-hidden border-2 border-white bg-transparent text-white text-sm uppercase tracking-wide px-6 py-2 font-semibold transition-colors duration-500 hover:text-[#001a42] whitespace-nowrap rounded-sm"
      >
        <span className="relative z-10">Book Consultation</span>

        {/* Goo blob matching button rounding and fully filling it */}
        <div
          className="absolute inset-0 bg-white rounded-sm
          transform translate-y-full scale-[1.2] opacity-0
          transition-all duration-700 ease-in-out
          group-hover:translate-y-0 group-hover:opacity-100"
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

export default GooeyButton;
