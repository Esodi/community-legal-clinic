"use client"
import Image from "next/image"
import logo from "@/assets/logo.png"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import BackgroundPaths from "./BackgroundPaths"

interface LoadingSpinnerProps {
  initial?: boolean;
}

function LoadingSpinner({ initial = false }: LoadingSpinnerProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (initial) {
    const [windowWidth, setWindowWidth] = useState(0);
    
    useEffect(() => {
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };
      
      // Set initial width
      if (typeof window !== 'undefined') {
        setWindowWidth(window.innerWidth);
      }
      
      // Add event listener
      window.addEventListener('resize', handleResize);
      
      // Clean up
      return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const title = windowWidth > 1111 ? "Community Legal Clinic" : "CLC";
    
    return (
      <div className="relative min-h-screen w-full">
        <BackgroundPaths title={title} />
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent z-50">
      <div className="relative flex flex-col items-center bg-white dark:bg-[#1F1F23] rounded-md shadow-lg p-5 w-[180px]">
        <Image 
          src={logo} 
          alt="Logo" 
          width={40} 
          height={40} 
          className="mb-3"
        />
        <div className="relative h-12 w-12 mb-1">
          <div className="h-12 w-12 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
          <div 
            className="absolute top-0 left-0 h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"
          ></div>
        </div>
      </div>
    </div>
  )
}

export default LoadingSpinner;