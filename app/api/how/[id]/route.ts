import { NextResponse } from 'next/server'
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:8000'

// GET /api/how/[id] - Get specific how section
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 })
    }

    const response = await axios.get(`${API_BASE_URL}/how/${params.id}`, {
      headers: {
        Authorization: authHeader
      }
    })

    return NextResponse.json(response.data)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.detail || 'Failed to fetch how section' },
      { status: error.response?.status || 500 }
    )
  }
}

// PUT /api/how/[id] - Update how section
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 })
    }

    const data = await request.json()
    const response = await axios.put(
      `${API_BASE_URL}/how/${params.id}`,
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
    return NextResponse.json(
      { error: error.response?.data?.detail || 'Failed to update how section' },
      { status: error.response?.status || 500 }
    )
  }
}

// DELETE /api/how/[id] - Delete how section
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 })
    }

    const response = await axios.delete(`${API_BASE_URL}/how/${params.id}`, {
      headers: {
        Authorization: authHeader
      }
    })

    return NextResponse.json(response.data)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.detail || 'Failed to delete how section' },
      { status: error.response?.status || 500 }
    )
  }
} 