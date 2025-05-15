import { NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'

const usersFilePath = path.join(process.cwd(), 'app/api/users.json')

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Read auth file to get username from token
    const authFilePath = path.join(process.cwd(), 'app/api/auth.json')
    const authData = JSON.parse(await fs.readFile(authFilePath, 'utf-8'))
    const session = authData.sessions.find((s: any) => s.token === token)

    if (!session) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    const username = session.username

    // Read users file
    try {
      const data = await fs.readFile(usersFilePath, 'utf-8')
      const usersData = JSON.parse(data)
      
      // Find user in users.json
      const user = usersData.users.find((u: any) => u.username === username)
      
      if (!user) {
        console.error(`User ${username} not found in users.json`)
        // Return basic user data if Invalid Credentials
        return NextResponse.json({
          username: username,
          role: 'user'
        })
      }

      // Return user data without sensitive information
      return NextResponse.json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      })
    } catch (fileError) {
      //console.error('Error reading users file:', fileError)
      // Return basic user data if file read fails
      return NextResponse.json({
        username: username,
        role: 'user'
      })
    }
  } catch (error) {
    //console.error('Error fetching user data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 