"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import LoadingSpinner from "@/components/LoadingSpinner"
import { useAuth } from "@/app/contexts/AuthContext"

interface ContactItem {
  id: number
  label: string
  value: string | null
  isMain: boolean
  isAddress: boolean
  isContact: boolean
  status: string
}

interface ServiceItem {
  id: number
  label: string
  href: string
  status: string
}

interface LinkItem {
  id: number
  label: string
  href: string
  status: string
}

interface SocialLink {
  id: number
  platform: string
  url: string
  icon: string
  ariaLabel: string
  status: string
}

interface FooterContent {
  aboutUs: {
    id: number | null
    title: string
    description: string
    status: string
  }
  contactUs: {
    id: number | null
    title: string
    status: string
    items: ContactItem[]
  }
  ourServices: {
    title: string
    items: ServiceItem[]
  }
  usefulLinks: {
    id: number | null
    title: string
    status: string
    items: LinkItem[]
  }
  socialLinks: SocialLink[]
}

export default function FooterPage() {
  const { isAuthenticated, loading: authLoading, token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const { register, handleSubmit, reset, setValue } = useForm<FooterContent>()
  const [footerData, setFooterData] = useState<FooterContent | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      fetchFooterContent()
    }
  }, [isAuthenticated])

  async function fetchFooterContent() {
    try {
      if (!token) {
        throw new Error("No authentication token available")
      }

      const response = await fetch("/api/footer", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) {
        throw new Error("Failed to fetch footer content")
      }
      const data = await response.json()
      setFooterData(data)
      reset(data)
      setLoading(false)
    } catch (err) {
      console.error("Fetch error:", err)
      setError("Failed to load footer content")
      setLoading(false)
    }
  }

  async function handleStatusChange(section: string, id: number | null, newStatus: string) {
    try {
      if (!token) {
        throw new Error("No authentication token available")
      }

      setLoading(true)
      setError("")

      const sectionData = footerData?.[section as keyof FooterContent]
      if (!sectionData) return

      const response = await fetch(`/api/footer/${section}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ ...sectionData, status: newStatus })
      })

      if (!response.ok) {
        throw new Error("Failed to update status")
      }

      await fetchFooterContent()
      setSuccess("Status updated successfully")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update status")
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(data: FooterContent) {
    try {
      if (!token) {
        throw new Error("No authentication token available")
      }

      setLoading(true)
      setError("")
      setSuccess("")

      const response = await fetch("/api/footer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || "Failed to save footer content")
      }

      await fetchFooterContent()
      setSuccess("Footer content saved successfully")
      setIsModalOpen(false)
      setEditingSection(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save footer content")
      console.error("Submit error:", err)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <div className="p-6 text-red-500">Please log in to access this page</div>
  }

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          Footer Management
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your website's footer sections</p>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg animate-fade-in">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded-r-lg animate-fade-in">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700 dark:text-green-400">{success}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-[#1F1F23] rounded-xl shadow-lg border border-gray-100 dark:border-gray-800">
        {/* About Us Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">About Us</h2>
            <div className="relative inline-block">
              <select
                value={footerData?.aboutUs?.status || 'active'}
                onChange={(e) => handleStatusChange('aboutUs', footerData?.aboutUs?.id || null, e.target.value)}
                className="appearance-none bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg pl-3 pr-10 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer min-w-[120px]"
              >
                <option value="active" className="bg-white dark:bg-[#2D2D33]">Active</option>
                <option value="draft" className="bg-white dark:bg-[#2D2D33]">Draft</option>
                <option value="archived" className="bg-white dark:bg-[#2D2D33]">Archived</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Title</p>
              <p className="mt-1 text-gray-900 dark:text-white">{footerData?.aboutUs?.title}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</p>
              <p className="mt-1 text-gray-900 dark:text-white">{footerData?.aboutUs?.description}</p>
            </div>
          </div>
        </div>

        {/* Contact Us Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Contact Us</h2>
            <div className="relative inline-block">
              <select
                value={footerData?.contactUs?.status || 'active'}
                onChange={(e) => handleStatusChange('contactUs', footerData?.contactUs?.id || null, e.target.value)}
                className="appearance-none bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg pl-3 pr-10 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer min-w-[120px]"
              >
                <option value="active" className="bg-white dark:bg-[#2D2D33]">Active</option>
                <option value="draft" className="bg-white dark:bg-[#2D2D33]">Draft</option>
                <option value="archived" className="bg-white dark:bg-[#2D2D33]">Archived</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#2D2D33] text-left">
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Label</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {footerData?.contactUs?.items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-[#2D2D33]">
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{item.label}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{item.value || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {item.isMain ? 'Main' : item.isAddress ? 'Address' : item.isContact ? 'Contact' : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative inline-block">
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange('contactUs', item.id, e.target.value)}
                          className="appearance-none bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg pl-3 pr-10 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer min-w-[120px]"
                        >
                          <option value="active" className="bg-white dark:bg-[#2D2D33]">Active</option>
                          <option value="draft" className="bg-white dark:bg-[#2D2D33]">Draft</option>
                          <option value="archived" className="bg-white dark:bg-[#2D2D33]">Archived</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Our Services Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Our Services</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#2D2D33] text-left">
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Label</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Link</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {footerData?.ourServices?.items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-[#2D2D33]">
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{item.label}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{item.href}</td>
                    <td className="px-6 py-4">
                      <div className="relative inline-block">
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange('ourServices', item.id, e.target.value)}
                          className="appearance-none bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg pl-3 pr-10 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer min-w-[120px]"
                        >
                          <option value="active" className="bg-white dark:bg-[#2D2D33]">Active</option>
                          <option value="draft" className="bg-white dark:bg-[#2D2D33]">Draft</option>
                          <option value="archived" className="bg-white dark:bg-[#2D2D33]">Archived</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Useful Links Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Useful Links</h2>
            <div className="relative inline-block">
              <select
                value={footerData?.usefulLinks?.status || 'active'}
                onChange={(e) => handleStatusChange('usefulLinks', footerData?.usefulLinks?.id || null, e.target.value)}
                className="appearance-none bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg pl-3 pr-10 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer min-w-[120px]"
              >
                <option value="active" className="bg-white dark:bg-[#2D2D33]">Active</option>
                <option value="draft" className="bg-white dark:bg-[#2D2D33]">Draft</option>
                <option value="archived" className="bg-white dark:bg-[#2D2D33]">Archived</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#2D2D33] text-left">
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Label</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Link</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {footerData?.usefulLinks?.items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-[#2D2D33]">
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{item.label}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{item.href}</td>
                    <td className="px-6 py-4">
                      <div className="relative inline-block">
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange('usefulLinks', item.id, e.target.value)}
                          className="appearance-none bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg pl-3 pr-10 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer min-w-[120px]"
                        >
                          <option value="active" className="bg-white dark:bg-[#2D2D33]">Active</option>
                          <option value="draft" className="bg-white dark:bg-[#2D2D33]">Draft</option>
                          <option value="archived" className="bg-white dark:bg-[#2D2D33]">Archived</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Social Links Section */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Social Links</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#2D2D33] text-left">
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Platform</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">URL</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Icon</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {footerData?.socialLinks.map((link) => (
                  <tr key={link.id} className="hover:bg-gray-50 dark:hover:bg-[#2D2D33]">
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{link.platform}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{link.url}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{link.icon}</td>
                    <td className="px-6 py-4">
                      <div className="relative inline-block">
                        <select
                          value={link.status}
                          onChange={(e) => handleStatusChange('socialLinks', link.id, e.target.value)}
                          className="appearance-none bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg pl-3 pr-10 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer min-w-[120px]"
                        >
                          <option value="active" className="bg-white dark:bg-[#2D2D33]">Active</option>
                          <option value="draft" className="bg-white dark:bg-[#2D2D33]">Draft</option>
                          <option value="archived" className="bg-white dark:bg-[#2D2D33]">Archived</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 