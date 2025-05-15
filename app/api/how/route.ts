import { NextResponse } from 'next/server'
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:8000'

// GET /api/how - Get all how sections
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 })
    }

    const response = await axios.get(`${API_BASE_URL}/how`, {
      headers: {
        Authorization: authHeader
      }
    })

    // Ensure we always return an array
    const data = Array.isArray(response.data) ? response.data : [response.data]
    return NextResponse.json(data)
  } catch (error: any) {
    //console.error('Error fetching how section:', error)
    return NextResponse.json(
      { error: error.response?.data?.detail || 'Failed to fetch how sections' },
      { status: error.response?.status || 500 }
    )
  }
}

// POST /api/how - Create new how section
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 })
    }

    const data = await request.json()
    const response = await axios.post(
      `${API_BASE_URL}/how`,
      data,
      {
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json'
        }
      }
    )

    return NextResponse.json(response.data)
  } catch (error: any) {
    //console.error('Error creating how section:', error)
    return NextResponse.json(
      { error: error.response?.data?.detail || 'Failed to create how section' },
      { status: error.response?.status || 500 }
    )
  }
}

// PUT /api/how/[id] - Update how section
export async function PUT(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 })
    }

    // Extract ID from URL
    const id = request.url.split('/').pop()
    const data = await request.json()

    const response = await axios.put(
      `${API_BASE_URL}/how/${id}`,
      data,
      {
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json'
        }
      }
    )

    return NextResponse.json(response.data)
  } catch (error: any) {
    //console.error('Error updating how section:', error)
    return NextResponse.json(
      { error: error.response?.data?.detail || 'Failed to update how section' },
      { status: error.response?.status || 500 }
    )
  }
}

// DELETE /api/how/[id] - Delete how section
export async function DELETE(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 })
    }

    // Extract ID from URL
    const id = request.url.split('/').pop()

    const response = await axios.delete(`${API_BASE_URL}/how/${id}`, {
      headers: {
        Authorization: authHeader
      }
    })

    return NextResponse.json(response.data)
  } catch (error: any) {
    //console.error('Error deleting how section:', error)
    return NextResponse.json(
      { error: error.response?.data?.detail || 'Failed to delete how section' },
      { status: error.response?.status || 500 }
    )
  }
} 