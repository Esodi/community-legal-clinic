"use client"

import { useState, useEffect } from "react"
import LoadingSpinner from "@/components/LoadingSpinner"
import { useAuth } from "@/app/contexts/AuthContext"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { authApi } from "@/app/api/auth/authApi"
import { Eye, EyeOff, Plus } from "lucide-react"

interface User {
  id: string
  username: string
  email: string
  role: string
  status: string
  createdAt: string
}

interface EditUserForm {
  username: string
  email: string
  role: string
  status: string
  password?: string
  confirmPassword?: string
}

interface AddUserForm {
  username: string
  email: string
  role: string
  password: string
  confirmPassword: string
}

export default function UsersPage() {
  const { token, isAuthenticated, loading: authLoading, user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [addForm, setAddForm] = useState<AddUserForm>({
    username: "",
    email: "",
    role: "user",
    password: "",
    confirmPassword: ""
  })
  const [editForm, setEditForm] = useState<EditUserForm>({ 
    username: "", 
    email: "", 
    role: "", 
    status: "active",
    password: "",
    confirmPassword: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  useEffect(() => {
    if (token) {
      fetchUsers()
    }
  }, [token])

  useEffect(() => {
    if (editingUser) {
      console.log('Current user:', user)
      console.log('Editing user:', editingUser)
      console.log('Is same user?', user?.username === editingUser.username)
    }
  }, [editingUser, user])

  async function fetchUsers() {
    try {
      if (!token) return
      const data = await authApi.getAllUsers(token)
      setUsers(data.users || [])
      setLoading(false)
    } catch (err: any) {
      setError(err.message || "Failed to load users")
      setLoading(false)
      console.error("Fetch error:", err)
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setEditForm({
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status || "active",
      password: "",
      confirmPassword: ""
    })
  }

  const handleEditSubmit = async () => {
    if (!editingUser || !token) return

    // Reset password error
    setPasswordError("")

    // Validate passwords if either password field is filled
    if (editForm.password || editForm.confirmPassword) {
      if (editForm.password !== editForm.confirmPassword) {
        setPasswordError("Passwords do not match")
        return
      }
      if (editForm.password && editForm.password.length < 8) {
        setPasswordError("Password must be at least 8 characters long")
        return
      }
    }

    try {
      const updatedUsers = users.map(user => 
        user.id === editingUser.id 
          ? { 
              ...user, 
              ...editForm,
              // Only include password if it was changed
              ...(editForm.password ? { password: editForm.password } : {})
            }
          : user
      )
      
      await authApi.updateUser(updatedUsers, token)
      setUsers(updatedUsers)
      setEditingUser(null)
      toast.success("User updated successfully")
    } catch (err: any) {
      console.error("Update error:", err)
      toast.error(err.message || "Failed to update user")
    }
  }

  const handleDelete = (user: User) => {
    setUserToDelete(user)
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    if (!userToDelete || !token) return

    try {
      await authApi.deleteUser(Number(userToDelete.id), token)
      setUsers(users.filter(u => u.id !== userToDelete.id))
      setShowDeleteDialog(false)
      setUserToDelete(null)
      toast.success("User deleted successfully")
    } catch (err: any) {
      console.error("Delete error:", err)
      toast.error(err.message || "Failed to delete user")
    }
  }

  const handleAddUser = async () => {
    // Reset password error
    setPasswordError("")

    // Validate form
    if (!addForm.username || !addForm.email || !addForm.password || !addForm.confirmPassword) {
      toast.error("Please fill in all required fields")
      return
    }

    // Validate passwords
    if (addForm.password !== addForm.confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }

    if (addForm.password.length < 8) {
      setPasswordError("Password must be at least 8 characters long")
      return
    }

    try {
      if (!token) return
      
      const response = await authApi.createUser({
        username: addForm.username,
        email: addForm.email,
        password: addForm.password,
        role: addForm.role
      }, token)

      // Add the new user to the list
      setUsers([...users, response.user])
      
      // Reset form and close modal
      setAddForm({
        username: "",
        email: "",
        role: "user",
        password: "",
        confirmPassword: ""
      })
      setShowAddModal(false)
      toast.success("User created successfully")
    } catch (err: any) {
      console.error("Create user error:", err)
      toast.error(err.message || "Failed to create user")
    }
  }

  if (authLoading || loading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <div className="p-6 text-red-500">Please log in to access this page</div>
  }

  if (error) {
    return (
      <div className="p-6">
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
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          Users Management
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Manage user accounts and roles</p>
      </div>

      <div className="bg-white dark:bg-[#1F1F23] rounded-xl shadow-lg border border-gray-100 dark:border-gray-800">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">All Users</h2>
            <Button 
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add User
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#2D2D33] border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Username
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Created At
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-[#2D2D33] transition-colors duration-150">
                  <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
                    {user.username}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : user.status === 'inactive'
                        ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}>
                      {user.status === 'active' ? 'Active' : user.status === 'inactive' ? 'Inactive' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-sm space-x-3">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium inline-flex items-center gap-1 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
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

      {/* Add User Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={addForm.username}
                onChange={(e) => setAddForm({ ...addForm, username: e.target.value })}
                placeholder="Enter username"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={addForm.email}
                onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                placeholder="Enter email"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={addForm.role}
                onValueChange={(value) => setAddForm({ ...addForm, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={addForm.password}
                  onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={addForm.confirmPassword}
                  onChange={(e) => setAddForm({ ...addForm, confirmPassword: e.target.value })}
                  placeholder="Confirm password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {passwordError && (
              <p className="text-sm text-red-600 dark:text-red-400">{passwordError}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={editForm.username}
                onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </div>
            {/* Optional Password Fields */}
            <div className="space-y-2">
              <Label htmlFor="password">Password (Optional)</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  placeholder="Leave blank to keep current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={editForm.confirmPassword}
                  onChange={(e) => setEditForm({ ...editForm, confirmPassword: e.target.value })}
                  placeholder="Leave blank to keep current password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            {passwordError && (
              <div className="text-sm text-red-500 dark:text-red-400">
                {passwordError}
              </div>
            )}
            {/* Only show role and status fields if admin is not editing their own profile */}
            {!(user?.role === 'admin' && user?.username === editingUser?.username) && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={editForm.role} onValueChange={(value) => setEditForm({ ...editForm, role: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={editForm.status} onValueChange={(value) => setEditForm({ ...editForm, status: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUser(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}