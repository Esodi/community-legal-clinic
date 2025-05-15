import { NextResponse } from 'next/server'
import { getAuthHeader } from '@/utils/auth'
import { headers } from 'next/headers'

interface ContactItem {
  id: number
  label: string
  value: string | null
  isMain: boolean
  isAddress: boolean
  isContact: boolean
  status: string
  created_at: string
  updated_at: string
}

interface ServiceItem {
  id: number
  label: string
  href: string
  status: string
  created_at: string
  updated_at: string
}

interface LinkItem {
  id: number
  label: string
  href: string
  status: string
  created_at: string
  updated_at: string
}

interface SocialLink {
  id: number
  platform: string
  url: string
  icon: string
  ariaLabel: string
  status: string
  created_at: string
  updated_at: string
}

interface FooterData {
  aboutUs: {
    id: number | null
    title: string
    description: string
    status: string
    created_at: string
    updated_at: string
  }
  contactUs: {
    id: number | null
    title: string
    status: string
    created_at: string
    updated_at: string
    items: ContactItem[]
  }
  ourServices: {
    title: string
    items: ServiceItem[]
  }
  usefulLinks: {
    id: number | null
    title: string
    status: string
    created_at: string
    updated_at: string
    items: LinkItem[]
  }
  socialLinks: SocialLink[]
}

const API_URL = 'http://0.0.0.0:8000'

export async function GET() {
  try {
    const authHeader = getAuthHeader()

    if (!authHeader) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const response = await fetch(`${API_URL}/company-details`, {
      headers: {
        'Authorization': authHeader
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch footer data')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching footer data:', error)
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
    const response = await fetch(`${API_URL}/company-details`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.detail || 'Failed to create footer')
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error adding footer:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 