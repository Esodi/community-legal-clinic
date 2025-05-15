import { promises as fs } from 'fs'
import { NextResponse } from 'next/server'
import path from 'path'
import bcrypt from 'bcryptjs'

// Add dynamic export to ensure this is always treated as a server-side route
 ;

const dataFilePath = path.join(process.cwd(), 'app/api/users.json')

interface User {
  id: string
  username: string
  email: string
  password?: string
  role: string
  createdAt: string
}

interface UsersData {
  users: User[]
}

function isValidUser(user: any): user is User {
  return (
    typeof user === 'object' &&
    typeof user.id === 'string' &&
    typeof user.username === 'string' &&
    typeof user.email === 'string' &&
    typeof user.role === 'string' &&
    typeof user.createdAt === 'string' &&
    (user.password === undefined || typeof user.password === 'string')
  )
}

function isValidUsersData(data: any): data is UsersData {
  return (
    typeof data === 'object' &&
    Array.isArray(data.users) &&
    data.users.every(isValidUser)
  )
}

export async function GET() {
  try {
    // Read the users file directly instead of importing
    const fileContent = await fs.readFile(dataFilePath, 'utf8')
    const data = JSON.parse(fileContent) as UsersData
    
    if (!data.users || !Array.isArray(data.users)) {
      //console.error('Invalid users data format:', data)
      return NextResponse.json({ error: 'Invalid data format' }, { status: 500 })
    }
    
    // Return users without passwords
    const safeUsers = data.users.map(({ password, ...rest }) => rest)
    return NextResponse.json(safeUsers)
  } catch (error) {
    //console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const newUser = await request.json()
    const fileContent = await fs.readFile(dataFilePath, 'utf8')
    const data = JSON.parse(fileContent)
    
    // Basic validation
    if (!newUser.username || !newUser.email || !newUser.password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check for duplicate email
    if (data.users.some((user: User) => user.email === newUser.email)) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }

    // Check for duplicate username
    if (data.users.some((user: User) => user.username === newUser.username)) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 })
    }
    
    // Generate a unique ID
    const maxId = Math.max(...data.users.map((user: User) => parseInt(user.id)), 0)
    
    // Hash password
    const hashedPassword = await bcrypt.hash(newUser.password, 12)
    
    const userToAdd: User = {
      id: String(maxId + 1),
      username: newUser.username,
      email: newUser.email,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date().toISOString()
    }
    
    data.users.push(userToAdd)
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2))

    // Don't send password back
    const { password, ...userWithoutPassword } = userToAdd
    return NextResponse.json({ user: userWithoutPassword }, { status: 201 })
  } catch (error) {
    //console.error('Error adding user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const updatedData = await request.json()
    const currentData = JSON.parse(await fs.readFile(dataFilePath, 'utf-8'))
    
    // Validate the structure
    if (!isValidUsersData(updatedData)) {
      return NextResponse.json({ error: 'Invalid data structure' }, { status: 400 })
    }

    // Merge current data with updates, preserving passwords and other sensitive data
    const mergedData = {
      users: updatedData.users.map((updatedUser: User) => {
        const currentUser = currentData.users.find((u: User) => u.id === updatedUser.id)
        return {
          ...updatedUser,
          password: currentUser?.password || updatedUser.password,
          role: currentUser?.role || updatedUser.role,
          createdAt: currentUser?.createdAt || updatedUser.createdAt
        }
      })
    }

    await fs.writeFile(dataFilePath, JSON.stringify(mergedData, null, 2))

    // Don't send passwords back
    const sanitizedData = {
      users: mergedData.users.map(({ password, ...rest }: User) => rest)
    }
    return NextResponse.json(sanitizedData)
  } catch (error) {
    //console.error('Error updating users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    const fileContent = await fs.readFile(dataFilePath, 'utf8')
    const data = JSON.parse(fileContent)
    
    if (!id) {
      return NextResponse.json({ error: 'Missing user ID' }, { status: 400 })
    }
    
    data.users = data.users.filter((user: User) => user.id !== id)
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2))

    // Don't send passwords back
    const sanitizedData = {
      users: data.users.map(({ password, ...rest }: User) => rest)
    }
    return NextResponse.json(sanitizedData)
  } catch (error) {
    //console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 