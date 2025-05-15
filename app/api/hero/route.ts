import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

interface ChatOption {
  id?: number
  text: string
  icon: string
}

interface ChatData {
  userMessage: string
  botResponse: string
  userName: string
  options: ChatOption[]
}

interface HeroData {
  id?: number
  headline: string
  subheadline: string
  ctaText: string
  chatData: ChatData
  status?: string
}

const API_URL = 'http://0.0.0.0:8000'

export async function GET() {
  try {
    const headersList = headers()
    const authHeader = headersList.get('Authorization')

    if (!authHeader) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const response = await fetch(`${API_URL}/hero`, {
      headers: {
        'Authorization': authHeader
      }
    })
    if (!response.ok) {
      throw new Error('Failed to fetch hero')
    }
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    //console.error('Error reading hero:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const headersList = headers()
    const authHeader = headersList.get('Authorization')

    if (!authHeader) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const data = await request.json()
    const response = await fetch(`${API_URL}/hero`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.detail || 'Failed to create hero')
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    //console.error('Error adding hero:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
 