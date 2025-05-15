"use client"

import LoadingSpinner from "@/components/LoadingSpinner"
import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { useAuth } from "@/app/contexts/AuthContext"
interface NavigationLink {
  id: number
  label: string
  href: string
  status?: string
  created_at?: string
  updated_at?: string
}

interface HeaderContent {
  navigationLinks: NavigationLink[]
}

export default function HeaderPage() {
  const { token, isAuthenticated, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const { register, handleSubmit, reset, control } = useForm<HeaderContent>({
    defaultValues: {
      navigationLinks: []
    }
  })
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "navigationLinks"
  })

  useEffect(() => {
    fetchHeaderContent()
  }, [])

  async function fetchHeaderContent() {
    try {
      const response = await fetch("/api/header")
      const data = await response.json()
      
      // Transform the data to match the HeaderContent structure
      const formattedData: HeaderContent = {
        navigationLinks: data.usefulLinks?.items || []
      }
      
      reset(formattedData)
      setLoading(false)
    } catch (err) {
      setError("Failed to load header content")
      setLoading(false)
      console.error("Fetch error:", err)
    }
  }

  async function onSubmit(data: HeaderContent) {
    try {
      // Ensure IDs are properly set
      data.navigationLinks = data.navigationLinks.map((link, index) => ({
        ...link,
        id: index + 1
      }))

      const response = await fetch("/api/header", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Failed to save header content")
      setSuccess("Header content saved successfully!")
      await fetchHeaderContent() // Refresh the data
    } catch (err) {
      setError("Failed to save header content")
      console.error("Submit error:", err)
    }
  }

  function handleAddLink() {
    append({ id: fields.length + 1, label: "", href: "" })
  }

  if (authLoading || loading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <div className="p-6 text-red-500">Please log in to access this page</div>
  }

  if (error) return <div className="p-6 text-red-500">{error}</div>

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          Manage Header
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Configure your website's navigation links</p>
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
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Navigation Links */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Navigation Links</h2>
              <button
                type="button"
                onClick={handleAddLink}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Link
              </button>
            </div>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-4 p-4 border rounded-md dark:border-[#3D3D43]">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Label</label>
                      <input
                        {...register(`navigationLinks.${index}.label`)}
                        className="w-full px-3 py-2 border rounded-md dark:bg-[#2D2D33] dark:border-[#3D3D43]"
                        placeholder="e.g. Home"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">URL</label>
                      <input
                        {...register(`navigationLinks.${index}.href`)}
                        className="w-full px-3 py-2 border rounded-md dark:bg-[#2D2D33] dark:border-[#3D3D43]"
                        placeholder="e.g. / or #about"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="mt-7 px-3 py-1 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {fields.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No navigation links added. Click "Add Link" to add one.
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  )
} 