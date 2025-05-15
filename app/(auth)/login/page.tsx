"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { User, Lock, Eye, EyeOff } from "lucide-react"
import logo from '@/assets/logo.png';

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (!formData.username || !formData.password) {
        throw new Error("Please fill in all fields")
      }

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store token and user data in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Set auth cookie for middleware
      document.cookie = `auth_token=${data.token}; path=/`;
      document.cookie = 'isAuthenticated=true; path=/';

      // Set auth header for subsequent requests
      const authCheck = await fetch('/api/auth/check', {
        headers: {
          'Authorization': `Bearer ${data.token}`
        }
      });

      if (!authCheck.ok) {
        throw new Error('Auth check failed after login');
      }

      // Use window.location for a full page reload to trigger middleware
      window.location.href = '/dashboard';
    } catch (err) {
      //console.error("Login error:", err)
      setError(err instanceof Error ? err.message : "An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="min-h-screen bg-[#0F0F12] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center">
          <Link href="/" className="mb-8">
            <Image
              src={logo}
              alt="Logo"
              width={150}
              height={40}
              className="cursor-pointer"
            />
          </Link>
          <h2 className="text-2xl font-semibold text-white mb-2">
            Sign in to your account
          </h2>
          <p className="text-gray-400 text-sm">
            Welcome back! Please enter your details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-[#001845] p-8 rounded-lg">
          <div className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  autoComplete="username"
                  className="block w-full pl-10 pr-3 py-2.5 bg-[#162542] text-white rounded-md border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-sm"
                  placeholder="Enter your username or email"
                  value={formData.username}
                  onChange={(e) => {
                    setFormData({ ...formData, username: e.target.value })
                    setError("")
                  }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full pl-10 pr-10 py-2.5 bg-[#162542] text-white rounded-md border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-sm"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value })
                    setError("")
                  }}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded-md">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full py-2.5 bg-[#D4A537] hover:bg-[#C29432] text-white font-medium rounded-md transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Signing in...
              </div>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </div>
    </div>
  )
} 