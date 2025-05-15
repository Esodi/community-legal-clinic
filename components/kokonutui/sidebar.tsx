"use client"

import { BarChart2, CreditCard, Wallet, Settings, HelpCircle, Menu, Clock, FileText, Home, Share2, CreditCard as Subscription, ChevronDown, ChevronRight, Users } from "lucide-react"

import Link from "next/link"
import { useState } from "react"
import type React from "react" // Added import for React
import logo from '@/assets/logo.png';
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation"

interface SidebarProps {
  userRole?: 'admin' | 'user' | 'employee'
}

interface NavItemProps {
  href: string
  icon: any
  children: React.ReactNode
  hasDropdown?: boolean
  isOpen?: boolean
  onClick?: () => void
}

interface SubNavItemProps {
  href: string
  children: React.ReactNode
}

export default function Sidebar({ userRole = 'user' }: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isFooterOpen, setIsFooterOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  function handleNavigation() {
    setIsMobileMenuOpen(false)
  }

  function SubNavItem({ href, children }: SubNavItemProps) {
    const isActive = pathname === href

    return (
      <Link
        href={href}
        onClick={handleNavigation}
        className={`flex items-center px-3 py-2 text-sm rounded-md transition-all duration-200 group pl-11
          ${isActive 
            ? "bg-[#1F1F23] text-white shadow-sm" 
            : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1F1F23] hover:shadow-sm"
          }`}
      >
        <span className="transition-all duration-200 group-hover:translate-x-1">{children}</span>
      </Link>
    )
  }

  function NavItem({
    href,
    icon: Icon,
    children,
    hasDropdown,
    isOpen,
    onClick
  }: NavItemProps) {
    const isActive = pathname === href || (hasDropdown && pathname.startsWith(href))
    const router = useRouter()

    const handleClick = () => {
      if (hasDropdown) {
        onClick?.()
        router.push(href)
      }
      handleNavigation()
    }

    const content = (
      <div
        className={`flex items-center px-3 py-2 text-sm rounded-md transition-all duration-200 group
          ${isActive 
            ? "bg-[#1F1F23] text-white shadow-sm" 
            : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1F1F23] hover:shadow-sm"
          }`}
      >
        <Icon className={`h-4 w-4 mr-3 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-[#D4A537]" : ""}`} />
        <span className="transition-all duration-200 group-hover:translate-x-1 flex-1">{children}</span>
        {hasDropdown && (
          isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
        )}
      </div>
    )

    if (hasDropdown) {
      return (
        <div onClick={handleClick} className="cursor-pointer">
          {content}
        </div>
      )
    }

    return (
      <Link href={href} onClick={handleNavigation}>
        {content}
      </Link>
    )
  }

  return (
    <>
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-20 p-2 rounded-lg bg-white dark:bg-[#0F0F12] shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </button>
      <nav
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-[#0F0F12] transform transition-transform duration-200 ease-in-out
          lg:translate-x-0 lg:static lg:w-auto border-r border-gray-200 dark:border-[#1F1F23]
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="h-full flex flex-col">
          <Link
            href="/"
            className="h-16 px-6 flex items-center border-b border-gray-200 dark:border-[#1F1F23] transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/30"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center transition-transform duration-200 hover:scale-110">
                <Image src={logo} alt="Logo" className="w-12 h-12 object-contain" />
              </div>
              <span className="text-lg font-semibold hover:cursor-pointer text-gray-900 dark:text-white transition-colors duration-200 hover:text-blue-600 dark:hover:text-blue-400">
                Community LC
              </span>
            </div>
          </Link>

          <div className="flex-1 overflow-y-auto py-4 px-4">
            <div className="space-y-6">
              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Dashboard
                </div>
                <div className="space-y-1">
                  <NavItem href="/dashboard" icon={Home}>
                    Home
                  </NavItem>
                  <NavItem href="/workflow" icon={Share2}>
                    Workflow
                  </NavItem>
                  {userRole === 'admin' && (
                    <>
                      <NavItem href="/users" icon={Users}>
                        Users
                      </NavItem>
                      <NavItem href="/services" icon={Settings}>
                        Services
                      </NavItem>
                    </>
                  )}
                  {userRole === 'employee' && (
                    <>
                      <NavItem href="/subscription" icon={Subscription}>
                        Subscription
                      </NavItem>
                      <NavItem href="/portfolio" icon={BarChart2}>
                        Portfolio
                      </NavItem>
                      <NavItem href="/invest" icon={Wallet}>
                        Invest
                      </NavItem>
                      <NavItem href="/wallets" icon={CreditCard}>
                        Wallets
                      </NavItem>
                      <NavItem href="/history" icon={Clock}>
                        History
                      </NavItem>
                    </>
                  )}
                </div>
              </div>

              {userRole === 'admin' && (
                <div className="mt-6">
                  <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Website Management
                  </div>
                  <div className="space-y-1">
                    <NavItem href="/website/header" icon={FileText}>
                      Header
                    </NavItem>
                    <NavItem href="/website/hero" icon={FileText}>
                      Hero
                    </NavItem>
                    <NavItem href="/website/testimonials" icon={FileText}>
                      Testimonials
                    </NavItem>
                    <NavItem href="/website/how" icon={FileText}>
                      How It Works
                    </NavItem>
                    <NavItem href="/website/announcements" icon={FileText}>
                      Announcements
                    </NavItem>
                    <div>
                      <NavItem 
                        href="/website/footer" 
                        icon={FileText} 
                        hasDropdown={true}
                        isOpen={isFooterOpen}
                        onClick={() => setIsFooterOpen(!isFooterOpen)}
                      >
                        Footer
                      </NavItem>
                      {isFooterOpen && (
                        <div className="mt-1 space-y-1">
                          <SubNavItem href="/website/footer/about">About Us</SubNavItem>
                          <SubNavItem href="/website/footer/contact">Contact Us</SubNavItem>
                          <SubNavItem href="/website/footer/social-links">Social Links</SubNavItem>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="px-4 py-4 border-t border-gray-200 dark:border-[#1F1F23]">
            <div className="space-y-1">
              <NavItem href="/settings" icon={Settings}>
                Settings
              </NavItem>
              {/*<NavItem href="/help" icon={HelpCircle}>
                Help
              </NavItem>*/}
            </div>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-25 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
