"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/kokonutui/sidebar"
import TopNav from "@/components/kokonutui/topnav"
import LoadingSpinner from "@/components/LoadingSpinner"
import { useAuth } from "@/app/contexts/AuthContext"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [loading, user, router])

  // Show loading state while checking auth
  if (loading || !user) {
    return <LoadingSpinner initial={false} />
  }

  // Convert role to expected type
  const userRole = user.role === 'admin' ? 'admin' : 'user'

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#0A0A0C]">
      <Sidebar userRole={userRole} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav userData={user} />
        <main className="flex-1 overflow-y-auto">
          <div className="">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 