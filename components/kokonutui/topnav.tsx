"use client"

import { Bell, ChevronRight, User, Sun, Moon } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import Profile01 from "./profile-01"

interface User {
  username: string;
  role: string;
}

interface TopNavProps {
  userData?: User;
}

export default function TopNav({ userData: propUserData }: TopNavProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [userData, setUserData] = useState<User | null>(null)

  // useEffect to handle mounting state
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle initial theme
  useEffect(() => {
    if (!mounted) return;
    
    // If no theme is set, default to system preference
    if (!theme) {
      setTheme('system');
    }
  }, [mounted, theme, setTheme]);

  // Get current theme value
  const currentTheme = useMemo(() => {
    if (!mounted) return 'light'; // Prevent hydration mismatch
    return theme === 'system' ? systemTheme : theme;
  }, [mounted, theme, systemTheme]);

  useEffect(() => {
    // If we have user data from props, use it
    if (propUserData) {
      setUserData(propUserData);
      return;
    }
    
    // Otherwise get user data from localStorage
    const userStr = localStorage.getItem("user")
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        setUserData(user)
      } catch (err) {
        console.error("Error parsing user data:", err)
      }
    }
  }, [propUserData])

  const breadcrumbs = useMemo(() => {
    const paths = pathname.split("/").filter(Boolean)
    return paths.map((path, index) => ({
      label: path.charAt(0).toUpperCase() + path.slice(1),
      href: "/" + paths.slice(0, index + 1).join("/")
    }))
  }, [pathname])

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Navigate to login page with full page refresh
        window.location.href = "/login"
      }
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <nav className="bg-white dark:bg-[#0F0F12] shadow-sm border-b border-gray-200 dark:border-[#1F1F23]">
        <div className="px-4 h-16 flex items-center justify-between">
          <div className="w-5 h-5" /> {/* Placeholder for theme icon */}
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white dark:bg-[#0F0F12] shadow-sm border-b border-gray-200 dark:border-[#1F1F23]">
      <div className="px-4 h-16 flex items-center justify-between">
        <div className="font-medium text-sm flex items-center space-x-1">
          {breadcrumbs.map((item, index) => (
            <div key={item.label} className="flex items-center">
              <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400 mx-1" />
              {item.href && item.href !== "/dashboard" ? (
                <Link
                  href={item.href}
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900 dark:text-gray-100">{item.label}</span>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-[#1F1F23] transition-colors"
            aria-label="Toggle theme"
          >
            {currentTheme === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-gray-900 dark:text-gray-400" />
            )}
          </button>
          {/*<button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-[#1F1F23]">
            <Bell className="h-5 w-5" />
          </button>*/}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-[#1F1F23]"
            >
              <User className="h-5 w-5" />
            </button>
            {showProfileMenu && (
              <>
                <div className="fixed inset-0 z-[60]" onClick={() => setShowProfileMenu(false)} />
                <div className="absolute right-0 mt-2 w-80 z-[70] transform transition-all duration-200 ease-out">
                  <Profile01 
                    name={userData?.username || "User"}
                    role={userData?.role || "user"}
                    avatar="https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-02-albo9B0tWOSLXCVZh9rX9KFxXIVWMr.png"
                    subscription="Pro"
                    onClose={() => setShowProfileMenu(false)}
                    onLogout={handleLogout}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 