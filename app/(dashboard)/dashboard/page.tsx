"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import LoadingSpinner from "@/components/LoadingSpinner"

interface User {
  id: number
  username: string
  email: string
  role: string
  createdAt: string
}

interface Stats {
  testimonialCount: number
  serviceCount: number
  userCount: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [stats, setStats] = useState<Stats>({
    testimonialCount: 0,
    serviceCount: 0,
    userCount: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user data from localStorage
        const userStr = localStorage.getItem("user")
        if (userStr) {
          const user = JSON.parse(userStr)
          setUserData(user)
        }

        // Fetch stats data
        const response = await fetch('/api/webpages/stats')
        if (!response.ok) {
          throw new Error('Failed to fetch stats')
        }
        const statsData = await response.json()
        setStats(statsData)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-600 dark:text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Welcome, {userData?.username || 'User'}!</h1>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 bg-white dark:bg-[#1F1F23] rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Total Users</h2>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.userCount}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Registered users</p>
        </div>
        <div className="p-6 bg-white dark:bg-[#1F1F23] rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Total Services</h2>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.serviceCount}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Available legal services</p>
        </div>
        <div className="p-6 bg-white dark:bg-[#1F1F23] rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Total Testimonials</h2>
          <p className="text-3xl font-bold text-green-600">{stats.testimonialCount}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Client testimonials</p>
        </div>
      </div>

      <div className="mt-8 p-6 bg-white dark:bg-[#1F1F23] rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Quick Stats Overview</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-4 bg-gray-50 dark:bg-[#2D2D33] rounded-lg">
            <h3 className="font-medium text-gray-700 dark:text-gray-300">User Engagement</h3>
            <p className="mt-2 text-2xl font-semibold">{((stats.testimonialCount / stats.userCount) * 100).toFixed(1)}%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Testimonial participation rate</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-[#2D2D33] rounded-lg">
            <h3 className="font-medium text-gray-700 dark:text-gray-300">Service Utilization</h3>
            <p className="mt-2 text-2xl font-semibold">{(stats.serviceCount)} services</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Available for clients</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-[#2D2D33] rounded-lg">
            <h3 className="font-medium text-gray-700 dark:text-gray-300">Community Size</h3>
            <p className="mt-2 text-2xl font-semibold">{stats.userCount} members</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Growing community</p>
          </div>
        </div>
      </div>
    </div>
  )
} 