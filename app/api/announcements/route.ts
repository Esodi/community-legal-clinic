import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

interface AnnouncementDate {
  day: string
  month: string
  year: string
}

interface Announcement {
  title: string
  description: string
  date: AnnouncementDate
  isNew: boolean
  status?: string
}

interface AnnouncementResponse {
  id: number
  title: string
  description: string
  date: AnnouncementDate
  isNew: boolean
  status: string
  created_at: string
  updated_at: string
}

interface AnnouncementsListResponse {
  announcements: AnnouncementResponse[]
  title: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:8000'

export async function GET() {
  try {
    const headersList = headers()
    const authHeader = headersList.get('Authorization')

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization required' },
        { status: 401 }
      )
    }

    const response = await fetch(`${API_URL}/announcements`, {
      headers: {
        'Authorization': authHeader
      }
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch announcements' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    //console.error('Error fetching announcements:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const headersList = headers()
    const authHeader = headersList.get('Authorization')
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization required' },
        { status: 401 }
      )
    }

    const data = await request.json()
    
    const response = await fetch(`${API_URL}/announcements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      return NextResponse.json(
        { error: errorData?.detail || 'Failed to create announcement' },
        { status: response.status }
      )
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    //console.error('Error creating announcement:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const headersList = headers()
    const authHeader = headersList.get('Authorization')
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Announcement ID is required' },
        { status: 400 }
      )
    }

    const data = await request.json()
    
    const response = await fetch(`${API_URL}/announcements/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      return NextResponse.json(
        { error: errorData?.detail || 'Failed to update announcement' },
        { status: response.status }
      )
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    //console.error('Error updating announcement:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const headersList = headers()
    const authHeader = headersList.get('Authorization')
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Announcement ID is required' },
        { status: 400 }
      )
    }

    const response = await fetch(`${API_URL}/announcements/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      return NextResponse.json(
        { error: errorData?.detail || 'Failed to delete announcement' },
        { status: response.status }
      )
    }

    return NextResponse.json({ message: 'Announcement deleted successfully' })
  } catch (error) {
    //console.error('Error deleting announcement:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// Additional endpoint for updating announcement status
export async function PATCH(request: Request) {
  try {
    const headersList = headers()
    const authHeader = headersList.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Announcement ID is required' },
        { status: 400 }
      )
    }

    const { status }: { status: string } = await request.json()
    
    const response = await fetch(`${API_URL}/announcements/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({ status })
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail || 'Failed to update announcement status' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    //console.error('Error updating announcement status:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 