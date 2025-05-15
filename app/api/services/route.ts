import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

// Simple interfaces without complex validation
interface Offering {
  id: number
  text: string
}

interface Service {
  id: number
  title: string
  description: string
  videoThumbnail: string
  videoUrl: string
  offerings: Offering[]
}

interface ServicesData {
  title: string
  packages: Service[]
} 

const API_URL = 'http://0.0.0.0:8000/services'

export async function GET() {
  try {
    const headersList = headers()
    const authHeader = headersList.get('Authorization')

    if (!authHeader) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const response = await fetch(API_URL, {
      headers: {
        'Authorization': authHeader
      }
    })
    if (!response.ok) {
      throw new Error('Failed to fetch services')
    }
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    //console.error('Error reading services:', error)
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
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.detail || 'Failed to create service')
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    //console.error('Error adding service:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}