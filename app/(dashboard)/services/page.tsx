"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import LoadingSpinner from "@/components/LoadingSpinner"
import { useAuth } from "@/app/contexts/AuthContext"

interface Offering {
  id?: number
  text: string
}

interface Service {
  id?: number
  title: string
  description: string
  videoThumbnail: string
  videoUrl: string
  offerings: Offering[]
  status?: string
}

interface ServiceFormData {
  title: string
  description: string
  videoThumbnail: string
  videoUrl: string
  offerings: string[]
  status: string
}

export default function ServicesPage() {
  const { isAuthenticated, loading: authLoading, token } = useAuth()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ServiceFormData>({
    defaultValues: {
      offerings: [""]
    }
  })
  const offerings = watch("offerings")

  useEffect(() => {
    if (isAuthenticated) {
      fetchServices()
    }
  }, [isAuthenticated])

  const fetchServices = async () => {
    try {
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch("/api/services", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) {
        throw new Error("Failed to fetch services")
      }
      const data = await response.json()
      setServices(data.packages || [])
    } catch (error) {
      console.error("Error fetching services:", error)
      setError("Failed to fetch services")
    }
  }

  const addOffering = () => {
    setValue("offerings", [...offerings, ""])
  }

  const removeOffering = (index: number) => {
    const newOfferings = offerings.filter((_, i) => i !== index)
    setValue("offerings", newOfferings)
  }

  const onSubmit = async (formData: ServiceFormData) => {
    try {
      if (!token) {
        throw new Error("No authentication token available");
      }

      setLoading(true)
      setError("")
      setSuccess("")

      const serviceData = {
        title: formData.title,
        description: formData.description,
        videoThumbnail: formData.videoThumbnail || "",
        videoUrl: formData.videoUrl || "",
        status: formData.status,
        offerings: formData.offerings
          .filter(text => text.trim() !== "")
          .map((text, index) => ({ text }))
      }

      const url = editingService 
        ? `/api/services/${editingService.id}` 
        : "/api/services"

      const response = await fetch(url, {
        method: editingService ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(serviceData)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Failed to ${editingService ? 'update' : 'create'} service`);
      }

      await fetchServices()
      setSuccess(`Service ${editingService ? 'updated' : 'created'} successfully`)
      reset()
      setEditingService(null)
      setIsModalOpen(false)
    } catch (error) {
      setError(error instanceof Error ? error.message : `Failed to ${editingService ? 'update' : 'create'} service`)
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setValue("title", service.title)
    setValue("description", service.description)
    setValue("videoThumbnail", service.videoThumbnail)
    setValue("videoUrl", service.videoUrl)
    setValue("status", service.status || "active")
    setValue("offerings", service.offerings.map(o => o.text))
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      if (!token) {
        throw new Error("No authentication token available");
      }

      setLoading(true)
      setError("")
      setSuccess("")

      const response = await fetch(`/api/services/${id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error("Failed to delete service")
      }

      await fetchServices()
      setSuccess("Service deleted successfully")
    } catch (error) {
      setError("Failed to delete service")
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setEditingService(null)
    setIsModalOpen(false)
    reset()
  }

  const filteredServices = services.filter(service => 
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.offerings.some(offering => offering.text.toLowerCase().includes(searchTerm.toLowerCase()))
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
          Services Management
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your service offerings and packages</p>
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
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">All Services</h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search services..."
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
                  setEditingService(null)
                  reset()
                  setIsModalOpen(true)
                }}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Service
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
                  Description
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
              {filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-[#2D2D33] transition-colors duration-150">
                  <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
                    {service.title}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400">
                    {service.description}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      service.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : service.status === 'inactive'
                        ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}>
                      {service.status === 'active' ? 'Active' : service.status === 'inactive' ? 'Inactive' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm space-x-3">
                    <button
                      onClick={() => handleEdit(service)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium inline-flex items-center gap-1 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => service.id && handleDelete(service.id)}
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
                  {editingService ? 'Edit Service' : 'Create New Service'}
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
                    placeholder="Enter service title"
                  />
                  {errors.title && <span className="text-red-500 text-sm mt-1 block">{errors.title.message}</span>}
                  <label className="mt-2 block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                  <input
                    {...register("description", { required: "Description is required" })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2D2D33] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter service description"
                  />
                  {errors.description && <span className="text-red-500 text-sm mt-1 block">{errors.description.message}</span>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Video Thumbnail URL</label>
                  <input
                    {...register("videoThumbnail")}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2D2D33] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="/services/1.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Video URL</label>
                  <input
                    {...register("videoUrl")}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2D2D33] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter video URL (optional)"
                  />
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

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Service Offerings</h3>
                    <button
                      type="button"
                      onClick={addOffering}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Add Offering
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {offerings.map((_, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-blue-500/30 flex items-center justify-center bg-blue-50">
                          <span className="text-blue-600 text-sm font-medium">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <input
                              {...register(`offerings.${index}` as const, {
                                required: index === 0 ? "At least one offering is required" : false
                              })}
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2D2D33] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              placeholder={`Enter offering ${index + 1}`}
                            />
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => removeOffering(index)}
                                className="p-2 text-red-600 hover:text-red-800 focus:outline-none"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </div>
                          {errors.offerings?.[index] && (
                            <p className="mt-1 text-sm text-red-600">{errors.offerings[index]?.message}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
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
                        {editingService ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {editingService ? "Update Service" : "Create Service"}
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