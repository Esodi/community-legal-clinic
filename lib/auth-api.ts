// Check if in Tauri/desktop mode where API routes aren't available
export const isDesktopMode = () => {
  // Check if running in a Tauri environment
  return typeof window !== 'undefined' && 'Tauri' in window;
};

interface User {
  username: string;
  role: string;
  id?: string;
  email?: string;
}

interface LoginResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

// In-memory storage for desktop mode (will be lost on refresh)
let desktopAuthState = {
  isAuthenticated: false,
  user: {
    username: '',
    role: ''
  }
};

// Check if user is authenticated
export async function checkAuth(): Promise<{ isAuthenticated: boolean; user?: User }> {
  try {
    // If in desktop mode, use local state instead of server API
    if (isDesktopMode()) {
      //console.log('Using desktop auth mode');
      return {
        isAuthenticated: desktopAuthState.isAuthenticated,
        user: desktopAuthState.user || undefined
      };
    }
    
    // For web mode, use server API
    const token = localStorage.getItem('token');
    if (!token) {
      return { isAuthenticated: false };
    }

    // Make the actual server-side check
    const response = await fetch('/api/auth/check', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      },
    });
    
    if (!response.ok) {
      //console.log(`Auth check failed with status: ${response.status}`);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { isAuthenticated: false };
    }

    const data = await response.json();
    return {
      isAuthenticated: true,
      user: data.user
    };
  } catch (error) {
    //console.error('Authentication check error:', error);
    return { isAuthenticated: false };
  }
}

// Login function
export async function login(username: string, password: string): Promise<LoginResponse> {
  try {
    // If in desktop mode, use simple auth without server
    if (isDesktopMode()) {
      //console.log('Using desktop login mode');
      // In a real app, you would validate against a local database
      // Here we're just doing a simple check for demo purposes
      if (username === 'admin' && password === 'admin') {
        desktopAuthState = {
          isAuthenticated: true,
          user: {
            username: 'admin',
            role: 'admin'
          }
        };
        
        return {
          success: true,
          user: desktopAuthState.user,
          token: 'desktop-mode-token'
        };
      }
      
      return { success: false, error: 'Invalid credentials' };
    }
    
    // For web mode, use server API
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error || 'Login failed' };
    }
    
    return { 
      success: true, 
      user: data.user,
      token: data.token 
    };
  } catch (error) {
    //console.error('Login error:', error);
    return { success: false, error: 'Network error' };
  }
}

// Logout function
export async function logout() {
  try {
    // If in desktop mode, clear local state
    if (isDesktopMode()) {
      //console.log('Using desktop logout mode');
      desktopAuthState = {
        isAuthenticated: false,
        user: {
          username: '',
          role: ''
        }
      };
      
      return { success: true };
    }
    
    // For web mode, use server API
    const token = localStorage.getItem('token');
    if (token) {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        return { success: false, error: 'Logout failed' };
      }
    }

    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Remove the temporary cookie used by middleware
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    
    return { success: true };
  } catch (error) {
    //console.error('Logout error:', error);
    return { success: false, error: 'Network error' };
  }
}

// Get session
export async function getSession(token: string) {
  try {
    const response = await fetch(`/api/auth/session`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    return null;
  }
}

// Remove session
export async function removeSession(username?: string, token?: string) {
  try {
    const storedToken = token || localStorage.getItem('token');
    
    if (storedToken) {
      await fetch('/api/auth/session', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      });
    }
  } catch (error) {
    //console.error('Error removing session:', error);
  }
} 