"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LogoutButton from "@/components/LogoutButton";
import { checkAuth } from "@/lib/auth-api";
import { useAuth } from "@/app/contexts/AuthContext";

interface NavigationLink {
  id: number;
  label: string;
  href: string;
}

export default function Header({
  navigationLinks,
}: {
  navigationLinks: NavigationLink[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { user, isAuthenticated: authStatus } = useAuth();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setIsAuthenticated(authStatus);
        setUserRole(user?.role || null);
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsAuthenticated(false);
        setUserRole(null);
      }
    };

    checkAuthStatus();

    // Check auth status when localStorage changes
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const allNavigationLinks = [...navigationLinks];

  // Add dynamic links based on auth status and role
  // if (isAuthenticated) {
  //   allNavigationLinks.push({
  //     id: 5,
  //     label: 'Dashboard',
  //     href: '/dashboard'
  //   });

  // } else {
  //   allNavigationLinks.push({
  //     id: 5,
  //     label: 'Login',
  //     href: '/login'
  //   });
  // }

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-[#001a42] text-white z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center group transition-all duration-200 hover:opacity-90 active:scale-95"
          >
            <Image
              src={logo}
              alt="Logo"
              className="w-12 h-12 object-contain transition-transform group-hover:scale-105"
            />
            <span className="font-bold text-xl whitespace-nowrap ml-2 group-hover:text-amber-300 transition-colors">
              {window.innerWidth < 1111
                ? "Community Legal Clinic"
                : "Community Legal Clinic (CLC)"}
            </span>
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-[#002a62] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-expanded={isOpen}
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <nav>
              <ul className="flex items-center space-x-6">
                {allNavigationLinks.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-amber-300 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-[#001a42] transition-colors whitespace-nowrap"
                asChild
              >
                <a
                  href="https://shorturl.at/EMOCr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  Book Consultation
                </a>
              </Button>
              {isAuthenticated && (
                <div className="w-full flex">
                  <LogoutButton />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 md:hidden bg-[#001a42] border-t border-[#002a62]"
            >
              <div className="px-4 py-3 space-y-3">
                {allNavigationLinks.map((link) => (
                  <Link
                    key={link.id}
                    href={link.href}
                    className="block px-3 py-2 text-base font-medium hover:text-amber-300 transition-colors duration-200 rounded-md hover:bg-[#002a62]"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="px-3 py-2 space-y-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-2 border-white bg-transparent text-white hover:bg-white hover:text-[#001a42] transition-colors whitespace-nowrap"
                    asChild
                  >
                    <a
                      href="https://shorturl.at/EMOCr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center"
                      onClick={() => setIsOpen(false)}
                    >
                      Book Consultation
                    </a>
                  </Button>
                  {isAuthenticated && (
                    <div className="w-full flex">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsOpen(false);
                          const logoutBtn = document.querySelector(
                            '[data-testid="logout-button"]'
                          ) as HTMLButtonElement;
                          if (logoutBtn) logoutBtn.click();
                        }}
                        className="w-full border-2 border-red-500 bg-red-500 text-white hover:bg-red-500 hover:text-black transition-colors whitespace-nowrap"
                      >
                        Logout
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
