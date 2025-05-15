import { NextResponse } from 'next/server'
import { getAuthHeader } from '@/utils/auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:8000'

interface NavigationLink {
  id: number
  label: string
  href: string
  status?: string
}

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
    //console.error('Error fetching footer data:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}


export async function PUT(request: Request) {
  try {
    const authHeader = getAuthHeader()

    if (!authHeader) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { navigationLinks } = await request.json()
    
    // Format the data according to the API's expected structure
    const formattedData = {
      title: "USEFUL LINKS",
      items: navigationLinks.map((link: NavigationLink) => ({
        label: link.label,
        href: link.href
      }))
    }

    const response = await fetch(`${API_URL}/company-details/useful-links`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(formattedData)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.detail || 'Failed to update header links')
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    //console.error('Error updating header links:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 