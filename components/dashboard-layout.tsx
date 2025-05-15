"use client"

import Sidebar from "@/components/kokonutui/sidebar"
import TopNav from "@/components/kokonutui/topnav"

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-gray-200 dark:border-[#1F1F23]">
          <TopNav />
        </header>
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-[#0F0F12]">
          {children}
        </main>
      </div>
    </div>
  )
} 