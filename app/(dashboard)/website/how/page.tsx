"use client"

import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import LoadingSpinner from "@/components/LoadingSpinner"
import { useAuth } from "@/app/contexts/AuthContext"
import { toast } from "sonner"

interface Step {
  id: number
  title: string
  description: string
  icon: string
}

interface HowItWorksData {
  id?: number
  title: string
  subtitle: string
  status: string
  steps: Step[]
  created_at?: string
  updated_at?: string
}

export default function HowItWorksPage() {
  const { token, isAuthenticated, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [howSections, setHowSections] = useState<HowItWorksData[]>([])
  const [editingSection, setEditingSection] = useState<HowItWorksData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const { register, handleSubmit, reset, control, watch, setValue } = useForm<HowItWorksData>({
    defaultValues: {
      steps: [],
      status: "active"
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "steps"
  })

  useEffect(() => {
    if (token) {
      fetchHowSections()
    }
  }, [token])

  async function fetchHowSections() {
    try {
      const response = await fetch("/api/how", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error("Failed to load how-it-works data")
      }
      
      const data = await response.json()
      setHowSections(data)
      setLoading(false)
    } catch (err) {
      console.error("Fetch error:", err)
      toast.error("Failed to load how-it-works data")
      setLoading(false)
    }
  }

  async function onSubmit(data: HowItWorksData) {
    try {
      if (!token) {
        throw new Error("Not authenticated")
      }

      // Ensure IDs are sequential
      data.steps = data.steps.map((step, index) => ({
        ...step,
        id: index + 1
      }))

      const method = editingSection ? "PUT" : "POST"
      const url = editingSection ? `/api/how/${editingSection.id}` : "/api/how"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || `Failed to ${editingSection ? 'update' : 'create'} section`)
      }

      toast.success(`Section ${editingSection ? 'updated' : 'created'} successfully!`)
      setIsModalOpen(false)
      setEditingSection(null)
      reset()
      fetchHowSections()
    } catch (err) {
      console.error("Submit error:", err)
      toast.error(err instanceof Error ? err.message : "Failed to save how-it-works section")
    }
  }

  async function handleDelete(id: number) {
    try {
      if (!token) {
        throw new Error("Not authenticated")
      }

      const response = await fetch(`/api/how/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || "Failed to delete section")
      }

      toast.success("Section deleted successfully!")
      fetchHowSections()
    } catch (err) {
      console.error("Delete error:", err)
      toast.error(err instanceof Error ? err.message : "Failed to delete section")
    }
  }

  function handleEdit(section: HowItWorksData) {
    setEditingSection(section)
    setValue("title", section.title)
    setValue("subtitle", section.subtitle)
    setValue("status", section.status)
    setValue("steps", section.steps)
    setIsModalOpen(true)
  }

  function handleAdd() {
    setEditingSection(null)
    reset({
      title: "",
      subtitle: "",
      status: "active",
      steps: []
    })
    setIsModalOpen(true)
  }

  function handleCancel() {
    setEditingSection(null)
    setIsModalOpen(false)
    reset()
  }

  function handleAddStep() {
    append({
      id: fields.length + 1,
      title: "",
      description: "",
      icon: `/images/how/${fields.length + 1}.png`
    })
  }

  const filteredSections = howSections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (authLoading || loading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <div className="p-6 text-red-500">Please log in to access this page</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage How It Works Sections</h1>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add New Section
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search sections..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-md dark:bg-[#2D2D33] dark:border-[#3D3D43]"
        />
      </div>

      {/* List View */}
      <div className="grid gap-4">
        {filteredSections.map((section) => (
          <div
            key={section.id}
            className="bg-white dark:bg-[#1F1F23] rounded-lg shadow p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{section.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{section.subtitle}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Status: <span className="capitalize">{section.status}</span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Steps: {section.steps.length}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(section)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(section.id!)}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1F1F23] rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingSection ? "Edit Section" : "Add New Section"}
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Section Header */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <input
                        {...register("title", { required: true })}
                        className="w-full px-3 py-2 border rounded-md dark:bg-[#2D2D33] dark:border-[#3D3D43]"
                        placeholder="e.g. How it works"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Subtitle</label>
                      <input
                        {...register("subtitle", { required: true })}
                        className="w-full px-3 py-2 border rounded-md dark:bg-[#2D2D33] dark:border-[#3D3D43]"
                        placeholder="e.g. Start your legal Service in Four Simple Steps."
                      />
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Status</h3>
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        {...register("status")}
                        value="active"
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2">Active</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        {...register("status")}
                        value="inactive"
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2">Inactive</span>
                    </label>
                  </div>
                </div>

                {/* Steps */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Steps</h3>
                    <button
                      type="button"
                      onClick={handleAddStep}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Add Step
                    </button>
                  </div>
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div key={field.id} className="p-4 border rounded-md dark:border-[#3D3D43] space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <input
                                  {...register(`steps.${index}.title`, { required: true })}
                                  className="w-full px-3 py-2 border rounded-md dark:bg-[#2D2D33] dark:border-[#3D3D43]"
                                  placeholder="Enter step title"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">Icon Path</label>
                                <input
                                  {...register(`steps.${index}.icon`, { required: true })}
                                  className="w-full px-3 py-2 border rounded-md dark:bg-[#2D2D33] dark:border-[#3D3D43]"
                                  placeholder="/images/how/1.png"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Description</label>
                              <textarea
                                {...register(`steps.${index}.description`, { required: true })}
                                className="w-full px-3 py-2 border rounded-md dark:bg-[#2D2D33] dark:border-[#3D3D43]"
                                rows={3}
                                placeholder="Enter step description"
                              />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="ml-4 px-3 py-1 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                    {fields.length === 0 && (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                        No steps added. Click "Add Step" to add one.
                      </p>
                    )}
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {editingSection ? "Update" : "Create"}
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