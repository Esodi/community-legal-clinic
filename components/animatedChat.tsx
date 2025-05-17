"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import girlImage from "@/assets/hero-img-image.png";
import logoImage from "@/assets/hero-img-image2.png";
import whatsappImage from "@/assets/hero-img-image3.png";
import calendarIcon from "@/assets/calendar-icon.png";

const messages = {
  greeting:
    "Hello, Emma! Thanks for reaching out! Please choose the option below:",
  greenBubble: "Hi, I need legal Service Can you help?",
  tsa: "Book an Appointment",
  otherServices: "Other Legal Services",
  clinicName: "Community Legal Clinic",
};

export default function AnimatedChat() {
  const [displayedText, setDisplayedText] = useState("");
  const [showGreeting, setShowGreeting] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [showGreenBubble, setShowGreenBubble] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const animateText = async () => {
      setIsAnimating(true);
      setDisplayedText("");
      setShowGreeting(false);
      setShowButtons(false);
      setShowGreenBubble(false);

      // Show green bubble with animation
      await new Promise((resolve) => setTimeout(resolve, 300));
      setShowGreenBubble(true);

      // Start typing animation after bubble appears
      await new Promise((resolve) => setTimeout(resolve, 400));

      // Animate green bubble text with smoother typing
      for (let i = 0; i <= messages.greenBubble.length; i++) {
        if (!isAnimating) break;
        await new Promise((resolve) => setTimeout(resolve, 40));
        setDisplayedText(messages.greenBubble.slice(0, i));
      }

      // Show greeting message after green bubble animation
      await new Promise((resolve) => setTimeout(resolve, 500));
      setShowGreeting(true);

      // Show buttons after greeting
      await new Promise((resolve) => setTimeout(resolve, 500));
      setShowButtons(true);

      // Wait before restarting
      await new Promise((resolve) => setTimeout(resolve, 3000));
      animateText();
    };

    animateText();

    return () => {
      setIsAnimating(false);
      setDisplayedText("");
      setShowGreeting(false);
      setShowButtons(false);
      setShowGreenBubble(false);
    };
  }, []);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="634"
      height="675"
      viewBox="0 0 634 675"
    >
      <defs>
        <linearGradient
          id="linear-gradient"
          x1="1"
          y1="0.5"
          x2="0"
          y2="0.5"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0" stopColor="#99c0fb" />
          <stop offset="1" stopColor="#cafcd9" />
        </linearGradient>
        <filter
          id="Rectangle_1"
          x="70"
          y="0"
          width="408"
          height="599"
          filterUnits="userSpaceOnUse"
        >
          <feOffset dy="3" in="SourceAlpha" />
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feFlood floodOpacity="0.161" />
          <feComposite operator="in" in2="blur" />
          <feComposite in="SourceGraphic" />
        </filter>
        <filter
          id="GIRL_IMAGE"
          x="282"
          y="184"
          width="352"
          height="491"
          filterUnits="userSpaceOnUse"
        >
          <feOffset dy="3" in="SourceAlpha" />
          <feGaussianBlur stdDeviation="3" result="blur-2" />
          <feFlood floodOpacity="0.161" />
          <feComposite operator="in" in2="blur-2" />
          <feComposite in="SourceGraphic" />
        </filter>
        <pattern
          id="pattern"
          preserveAspectRatio="none"
          width="100%"
          height="100%"
          viewBox="0 0 1097 512"
        >
          <image width="1097" height="512" xlinkHref={logoImage.src} />
        </pattern>
        <pattern
          id="pattern-2"
          preserveAspectRatio="none"
          width="100%"
          height="100%"
          viewBox="0 0 1174 478"
        >
          <image width="1174" height="478" xlinkHref={whatsappImage.src} />
        </pattern>
      </defs>
      <g id="hero-img" transform="translate(-603 -99)">
        <g transform="matrix(1, 0, 0, 1, 603, 99)" filter="url(#Rectangle_1)">
          <rect
            id="Rectangle_1-2"
            data-name="Rectangle 1"
            width="390"
            height="581"
            rx="50"
            transform="translate(79 6)"
            fill="url(#linear-gradient)"
          />
        </g>
        <g transform="matrix(1, 0, 0, 1, 603, 99)" filter="url(#GIRL_IMAGE)">
          <motion.g
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          >
            <image
              id="GIRL_IMAGE-2"
              data-name="GIRL IMAGE"
              width="334"
              height="473"
              transform="translate(291 190)"
              xlinkHref={girlImage.src}
            />
          </motion.g>
        </g>
        <g id="chat">
          <g
            id="Group_3"
            data-name="Group 3"
            style={{
              opacity: showGreeting ? 1 : 0,
              transition: "opacity 0.5s ease-in",
            }}
          >
            <rect
              id="Rectangle_2"
              data-name="Rectangle 2"
              width="267"
              height="101"
              rx="30"
              transform="translate(616 300)"
              fill="#fff"
            />
            <text
              id="Hello_Emma_Thanks_for_reaching_out_Please_choose_the_option_below:"
              data-name="Hello, Emma! Thanks for reaching out! Please choose the option below:"
              transform="translate(636 310)"
              fontSize="20"
              fontFamily="SegoeUI, Segoe UI"
            >
              <tspan x="0" y="22">
                Hello,{" "}
              </tspan>
              <tspan
                y="22"
                fontFamily="SegoeUI-Bold, Segoe UI"
                fontWeight="700"
              >
                Emma!
              </tspan>
              <tspan y="22" xmlSpace="preserve">
                {" "}
                Thanks for{" "}
              </tspan>
              <tspan x="0" y="49">
                reaching out! Please{" "}
              </tspan>
              <tspan x="0" y="76">
                choose the option below:
              </tspan>
            </text>
          </g>
          <g
            id="GREEN_BUBB:E"
            data-name="GREEN BUBB:E"
            transform="translate(0 9.944)"
            style={{
              opacity: showGreenBubble ? 1 : 0,
              transform: `scale(${showGreenBubble ? 1 : 0.9})`,
              transition:
                "opacity 0.4s ease-out, transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            }}
          >
            <rect
              id="Rectangle_5"
              data-name="Rectangle 5"
              width="339"
              height="100"
              rx="30"
              transform="translate(791 170.056)"
              fill="#00c02c"
            />
            <path
              id="Path_1"
              data-name="Path 1"
              d="M15.932,0,0,35.265s.759,5.7,27.313,9.162c.19.519-11.57-6.915-11.38-25.239Z"
              transform="matrix(0.995, -0.105, 0.105, 0.995, 1112.93, 228.842)"
              fill="#00c02c"
            />
            <text
              id="Hi_I_need_legal_Service_Can_you_help_"
              data-name="Hi, I need legal Service Can you help?"
              transform="translate(804 175.056)"
              fontSize="31"
              fontFamily="SegoeUI-Bold, Segoe UI"
              fontWeight="700"
            >
              <tspan x="0" y="33">
                {displayedText.slice(
                  0,
                  messages.greenBubble.indexOf("Service")
                )}
              </tspan>
              <tspan x="0" y="74">
                {displayedText.slice(messages.greenBubble.indexOf("Service"))}
              </tspan>
            </text>
          </g>
          <g
            id="Group_1"
            data-name="Group 1"
            transform="translate(22 -6)"
            style={{
              opacity: showButtons ? 1 : 0,
              transition: "opacity 0.8s ease-in",
            }}
          >
            <g id="tsa_bubble">
              <rect
                id="Rectangle_3"
                data-name="Rectangle 3"
                width="230"
                height="50"
                rx="20"
                transform="translate(594 419)"
                fill="#fff"
              />

              {/* calendar icon */}
              <image
                href="https://img.icons8.com/color/48/calendar--v1.png"
                x="600"
                y="428"
                width="24"
                height="24"
              />
              <text
                id="TSA"
                transform="translate(630 448)"
                fontSize="16"
                fontFamily="Segoe UI"
                fontWeight="700"
                fill="#000"
              >
                <tspan x="0" y="0">
                  Book an Appointment
                </tspan>
              </text>
            </g>
          </g>
          <g
            id="Group_2"
            data-name="Group 2"
            transform="translate(2 12)"
            style={{
              opacity: showButtons ? 1 : 0,
              transition: "opacity 0.8s ease-in",
            }}
          >
            <g id="other_services_bubble">
              <rect
                id="Rectangle_4"
                data-name="Rectangle_4"
                width="230"
                height="50"
                rx="20"
                transform="translate(614 459)"
                fill="#fff"
              />

              <image
                href="https://img.icons8.com/color/48/chat--v1.png"
                x="620"
                y="468"
                width="24"
                height="24"
              />
              <text
                id="Chat_with_Support"
                transform="translate(650 490)"
                fontSize="16"
                fontFamily="Segoe UI"
                fontWeight="700"
                fill="#000"
              >
                <tspan x="0" y="0">
                  Chat with Support
                </tspan>
              </text>

              <path
                id="Path_2"
                data-name="Path_2"
                fill="#fff"
                d="M14.932,44.453,0,9.187S.759,3.483,27.313.025c.19-.519-11.57,6.915-11.38,25.239Z"
                transform="matrix(-0.995, -0.105, 0.105, -0.995, 630.165, 513.532)"
              />
            </g>
          </g>
        </g>
        <g id="contact" transform="translate(136 -814)">
          <rect
            id="logo"
            width="42"
            height="20"
            transform="translate(587 935)"
            fill="url(#pattern)"
          />
          <text
            id="Community_Legal_Clinic"
            data-name="Community Legal Clinic"
            transform="translate(742 953)"
            fontSize="20"
            fontFamily="SegoeUI-Bold, Segoe UI"
            fontWeight="700"
          >
            <tspan x="-110.957" y="0">
              Community Legal Clinic
            </tspan>
          </text>
          <rect
            id="whatsapp-badge"
            width="79"
            height="32"
            transform="translate(830 929)"
            fill="url(#pattern-2)"
          />
        </g>
      </g>
    </svg>
  );
}
