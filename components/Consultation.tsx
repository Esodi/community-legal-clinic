import React from "react";

const ConsultationButton = () => {
  return (
    <div className="relative w-full">
      <a
        href="https://shorturl.at/EMOCr"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-full h-8 lg:h-9 bg-black text-white border border-gray-700 group-hover:border-white rounded-md overflow-hidden transition-all duration-300 font-medium text-xs lg:text-sm shadow-md"
      >
        {/* Goo blob fills the entire button on hover */}
        <div
          className="absolute inset-0 bg-white rounded-md scale-0 group-hover:scale-100 transition-transform duration-500 ease-in-out"
          style={{
            filter: "url(#goo)",
            transformOrigin: "center",
          }}
        />

        {/* Text stays visible on top */}
        <span className="relative z-10 transition-colors duration-300 group-hover:text-black">
          Book Consultation
        </span>

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
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="8"
                result="blur"
              />
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

        {/* Remove border + shadow on hover */}
        <style jsx>{`
          a:hover {
            box-shadow: none;
          }
        `}</style>
      </a>
    </div>
  );
};

export default ConsultationButton;
