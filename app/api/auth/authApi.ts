import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

interface User {
  id: string | number;
  username: string;
  email: string;
  role: string;
  status: string;
  password?: string;
}

interface CreateUserData {
  username: string;
  email: string;
  password: string;
  role: string;
}

export const authApi = {
  // Get all users (admin only)
  getAllUsers: async (token: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Transform the response to match the existing interface
      return {
        users: response.data.users.map((user: any) => ({
          ...user,
          id: String(user.id), // Ensure ID is string
          status: user.status || 'active',
          createdAt: user.createdAt || new Date().toISOString()
        }))
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch users');
    }
  },

  // Create user (admin only)
  createUser: async (userData: CreateUserData, token: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/users`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to create user');
    }
  },

  // Delete user (admin only)
  deleteUser: async (userId: string | number, token: string) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/auth/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to delete user');
    }
  },

  // Update user (admin only)
  updateUser: async (users: User[], token: string) => {
    try {
      // Ensure all user IDs are strings
      const formattedUsers = users.map(user => ({
        ...user,
        id: String(user.id)
      }));

      const response = await axios.put(
        `${API_BASE_URL}/auth/users`,
        { users: formattedUsers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to update user');
    }
  }
}; 