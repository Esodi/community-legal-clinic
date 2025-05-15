"use client"

import { useState, useEffect } from "react"
import { User } from "lucide-react"
import { useRouter } from "next/navigation"

interface UserProfile {
  id: string
  username: string
  email: string
  role: string
  createdAt: string
}

function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/50 dark:bg-[#0F0F12]/50 backdrop-blur-sm">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
        <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-blue-600 dark:border-blue-400 border-t-transparent animate-spin"></div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  })

  useEffect(() => {
    checkAuthAndFetchProfile()
  }, [])

  async function checkAuthAndFetchProfile() {
    try {
      // First, check if user is authenticated
      const authResponse = await fetch("/api/auth/check")
      if (!authResponse.ok) {
        // If not authenticated, redirect to login
        router.push("/login")
        return
      }
      const { userId } = await authResponse.json()

      // Then fetch the specific user's profile
      const response = await fetch(`/api/users/${userId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch profile")
      }
      const userData = await response.json()
      setProfile(userData)
      setFormData({
        username: userData.username,
        email: userData.email,
      })
    } catch (err) {
      setError("Failed to load profile")
      console.error("Fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdateProfile() {
    if (!profile) return

    try {
      const response = await fetch(`/api/users/${profile.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      const updatedData = await response.json()
      setProfile(updatedData)
      setIsEditing(false)
      // Show success message
      alert("Profile updated successfully!")
    } catch (err) {
      console.error("Update error:", err)
      alert("Failed to update profile. Please try again.")
    }
  }

  if (loading) return <LoadingSpinner />
  if (error) return <div className="p-6 text-red-500">{error}</div>
  if (!profile) return <div className="p-6 text-red-500">Profile not found</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Profile</h1>

      <div className="max-w-2xl">
        <div className="bg-white dark:bg-[#1F1F23] rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-[#2D2D33] flex items-center justify-center">
                <User className="h-10 w-10 text-gray-500 dark:text-gray-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {profile.username}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Member since {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {profile.role}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <p className="text-gray-900 dark:text-gray-100">{profile.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Account ID
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400">{profile.id}</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 dark:bg-[#2D2D33] border-t border-gray-200 dark:border-[#3D3D43]">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Need to update your information?
              </p>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1F1F23] rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Edit Profile
              </h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md dark:bg-[#2D2D33] dark:border-[#3D3D43] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md dark:bg-[#2D2D33] dark:border-[#3D3D43] dark:text-white"
                  />
                </div>
              </form>
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-[#2D2D33] border-t dark:border-[#3D3D43] flex justify-end space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#3D3D43] rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProfile}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 