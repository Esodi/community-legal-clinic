"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import LoadingSpinner from "@/components/LoadingSpinner"
import { useAuth } from "@/app/contexts/AuthContext"

interface Announcement {
  id?: number
  title: string
  description: string
  date: {
  day: string
  month: string
  year: string
  }
  isNew: boolean
  status?: string
  created_at?: string
  updated_at?: string
}

interface AnnouncementFormData {
  title: string
  description: string
  day: string
  month: string
  year: string
  isNew: boolean
  status: string
}

export default function AnnouncementsPage() {
  const { isAuthenticated, loading: authLoading, token } = useAuth()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<AnnouncementFormData>()

  useEffect(() => {
    if (isAuthenticated) {
    fetchAnnouncements()
    }
  }, [isAuthenticated])

  const fetchAnnouncements = async () => {
    try {
      if (!token) {
        throw new Error("No authentication token available")
      }

      const response = await fetch("/api/announcements", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) {
        throw new Error("Failed to fetch announcements")
      }
      const data = await response.json()
      setAnnouncements(data.announcements || [])
    } catch (error) {
      console.error("Error fetching announcements:", error)
      setError("Failed to fetch announcements")
    }
  }

  const onSubmit = async (formData: AnnouncementFormData) => {
    try {
      if (!token) {
        throw new Error("No authentication token available")
      }

      setLoading(true)
      setError("")
      setSuccess("")

      const announcementData = {
        title: formData.title,
        description: formData.description,
        date: {
          day: formData.day,
          month: formData.month.toUpperCase(),
          year: formData.year
        },
        isNew: formData.isNew,
        status: formData.status
      }

      const url = editingAnnouncement 
        ? `/api/announcements?id=${editingAnnouncement.id}` 
        : "/api/announcements"

      const response = await fetch(url, {
        method: editingAnnouncement ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(announcementData)
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || `Failed to ${editingAnnouncement ? 'update' : 'create'} announcement`)
      }

      await fetchAnnouncements()
      setSuccess(`Announcement ${editingAnnouncement ? 'updated' : 'created'} successfully`)
      reset()
      setEditingAnnouncement(null)
      setIsModalOpen(false)
    } catch (error) {
      setError(error instanceof Error ? error.message : `Failed to ${editingAnnouncement ? 'update' : 'create'} announcement`)
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement)
    setValue("title", announcement.title)
    setValue("description", announcement.description)
    setValue("day", announcement.date.day)
    setValue("month", announcement.date.month)
    setValue("year", announcement.date.year)
    setValue("isNew", announcement.isNew)
    setValue("status", announcement.status || "active")
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      if (!token) {
        throw new Error("No authentication token available")
      }

      setLoading(true)
      setError("")
      setSuccess("")

      const response = await fetch(`/api/announcements?id=${id}`, {
        method: "DELETE",
            headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error("Failed to delete announcement")
      }

      await fetchAnnouncements()
      setSuccess("Announcement deleted successfully")
    } catch (error) {
      setError("Failed to delete announcement")
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setEditingAnnouncement(null)
    setIsModalOpen(false)
    reset()
  }

  const filteredAnnouncements = announcements.filter(announcement => 
    announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announcement.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          Announcements Management
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your announcements and updates</p>
      </div>

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
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">All Announcements</h2>
            <div className="flex items-center gap-4">
              <div className="relative">
              <input
                  type="text"
                  placeholder="Search announcements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2D2D33] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-full sm:w-64"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
          </div>
              <button
                onClick={() => {
                  setEditingAnnouncement(null)
                  reset()
                  setIsModalOpen(true)
                }}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Announcement
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#2D2D33] border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Title
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAnnouncements.map((announcement) => (
                <tr key={announcement.id} className="hover:bg-gray-50 dark:hover:bg-[#2D2D33] transition-colors duration-150">
                  <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
                    {announcement.title}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400">
                    {announcement.date.day} {announcement.date.month} {announcement.date.year}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      announcement.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : announcement.status === 'inactive'
                        ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}>
                      {announcement.status === 'active' ? 'Active' : announcement.status === 'inactive' ? 'Inactive' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm space-x-3">
                    <button
                      onClick={() => handleEdit(announcement)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium inline-flex items-center gap-1 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => announcement.id && handleDelete(announcement.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium inline-flex items-center gap-1 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div 
            className="bg-white dark:bg-[#1F1F23] rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700"
            style={{ margin: '2rem' }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                  {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
                </h2>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                        <input
                    {...register("title", { required: "Title is required" })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2D2D33] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter announcement title"
                        />
                  {errors.title && <span className="text-red-500 text-sm mt-1 block">{errors.title.message}</span>}
                      </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                        <textarea
                    {...register("description", { required: "Description is required" })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2D2D33] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    rows={4}
                          placeholder="Enter announcement description"
                        />
                  {errors.description && <span className="text-red-500 text-sm mt-1 block">{errors.description.message}</span>}
                      </div>

                <div className="grid grid-cols-3 gap-4">
                        <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Day</label>
                          <input
                      {...register("day", { required: "Day is required" })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2D2D33] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="DD"
                          />
                        </div>
                        <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Month</label>
                          <input
                      {...register("month", { required: "Month is required" })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2D2D33] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="MMM"
                          />
                        </div>
                        <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Year</label>
                          <input
                      {...register("year", { required: "Year is required" })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2D2D33] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="YYYY"
                          />
                        </div>
                </div>

                        <div className="flex items-center">
                            <input
                              type="checkbox"
                    {...register("isNew")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                  <label className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    Mark as New
                          </label>
                        </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                  <select
                    {...register("status", { required: "Status is required" })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2D2D33] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    defaultValue="active"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                  {errors.status && <span className="text-red-500 text-sm mt-1 block">{errors.status.message}</span>}
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2D2D33] transition-all duration-200 shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {editingAnnouncement ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {editingAnnouncement ? "Update Announcement" : "Create Announcement"}
                      </>
                    )}
                    </button>
                </div>
              </form>
            </div>
          </div>
      </div>
      )}
    </div>
  )
} 