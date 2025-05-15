import { findUserByUsername, getAuthData, updateAuthData } from './api'

interface Session {
  username: string
  token: string
  role: string
  lastActive: string
}

interface AuthData {
  sessions: Session[]
}

// Add a new session
export async function addSession(username: string, token: string): Promise<Session | null> {
  const user = await findUserByUsername(username)
  if (!user) return null

  const session: Session = {
    username,
    token,
    role: user.role,
    lastActive: new Date().toISOString()
  }

  const authData = await getAuthData() as AuthData
  
  // Remove any existing session for this user
  authData.sessions = authData.sessions.filter((s: Session) => s.username !== username)
  
  // Add new session
  authData.sessions.push(session)
  await updateAuthData(authData)

  return session
}

// Get session by token
export async function getSessionByToken(token: string): Promise<Session | null> {
  const authData = await getAuthData() as AuthData
  const session = authData.sessions.find((s: Session) => s.token === token)
  
  if (session) {
    // Update last active time
    session.lastActive = new Date().toISOString()
    await updateAuthData(authData)
  }
  
  return session || null
}

// Get session by username
export async function getSessionByUsername(username: string): Promise<Session | null> {
  const authData = await getAuthData() as AuthData
  return authData.sessions.find((s: Session) => s.username === username) || null
}

// Remove session by username and/or token
export async function removeSession(username?: string, token?: string): Promise<void> {
  const authData = await getAuthData() as AuthData
  
  if (username && token) {
    // Remove specific session
    authData.sessions = authData.sessions.filter((s: Session) => 
      s.username !== username && s.token !== token
    )
  } else if (username) {
    // Remove all sessions for username
    authData.sessions = authData.sessions.filter((s: Session) => s.username !== username)
  } else if (token) {
    // Remove session by token
    authData.sessions = authData.sessions.filter((s: Session) => s.token !== token)
  }
  
  await updateAuthData(authData)
}

// Validate session
export async function validateSession(token: string, username: string): Promise<boolean> {
  const session = await getSessionByToken(token)
  if (!session) return false
  
  // Check if session belongs to user and is not expired (24 hours)
  const lastActive = new Date(session.lastActive)
  const now = new Date()
  const hoursSinceActive = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60)
  
  return session.username === username && hoursSinceActive < 24
}

// Check if user is authenticated
export async function checkAuth(): Promise<{ isAuthenticated: boolean; user?: { username: string; role: string } }> {
  try {
    const response = await fetch('/api/auth/check', {
      credentials: 'include'
    });
    
    if (!response.ok) {
      return { isAuthenticated: false };
    }

    const data = await response.json();
    return {
      isAuthenticated: true,
      user: data.user
    };
  } catch (error) {
    return { isAuthenticated: false };
  }
} 