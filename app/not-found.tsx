"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowLeft, Send } from 'lucide-react'

export default function NotFound() {
  const pathname = usePathname()
  const [showSupport, setShowSupport] = useState(false)
  const [supportForm, setSupportForm] = useState({
    email: '',
    description: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Here you would typically send this to your API
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated API call
      setSubmitSuccess(true)
    } catch (error) {
      console.error('Failed to submit support ticket:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#001233] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">404</h1>
          <h2 className="text-xl text-gray-400 mb-4">Page Not Found</h2>
          <div className="bg-[#001845] rounded-lg p-4 mb-6">
            <p className="text-gray-400 text-sm font-mono break-all">
              Route: {pathname}
            </p>
          </div>
          <p className="text-gray-400 mb-8">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>

          {!showSupport ? (
            <div className="space-y-4">
              <Link href="/">
                <Button className="w-full bg-[#D4A537] hover:bg-[#C29432] text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="w-full border-gray-700 text-gray-400 hover:bg-gray-800"
                onClick={() => setShowSupport(true)}
              >
                Report this problem
              </Button>
            </div>
          ) : (
            <div className="bg-[#001845] rounded-lg p-6">
              {!submitSuccess ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      className="w-full px-3 py-2 bg-[#002855] text-white rounded-md border border-gray-600 focus:border-[#D4A537] focus:ring-1 focus:ring-[#D4A537] placeholder-gray-400 text-sm"
                      placeholder="Enter your email"
                      value={supportForm.email}
                      onChange={(e) => setSupportForm({ ...supportForm, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                      What were you trying to do?
                    </label>
                    <textarea
                      id="description"
                      required
                      rows={3}
                      className="w-full px-3 py-2 bg-[#002855] text-white rounded-md border border-gray-600 focus:border-[#D4A537] focus:ring-1 focus:ring-[#D4A537] placeholder-gray-400 text-sm"
                      placeholder="Describe what happened..."
                      value={supportForm.description}
                      onChange={(e) => setSupportForm({ ...supportForm, description: e.target.value })}
                    />
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 border-gray-700 text-gray-400 hover:bg-gray-800"
                      onClick={() => setShowSupport(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-[#D4A537] hover:bg-[#C29432] text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Sending...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Send className="w-4 h-4 mr-2" />
                          Send Report
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-4">
                  <p className="text-green-400 mb-4">
                    Thank you for your report! We'll look into this issue.
                  </p>
                  <Button
                    className="bg-[#D4A537] hover:bg-[#C29432] text-white"
                    onClick={() => {
                      setShowSupport(false)
                      setSubmitSuccess(false)
                      setSupportForm({ email: '', description: '' })
                    }}
                  >
                    Close
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 