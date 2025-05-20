import { NextResponse } from 'next/server'
import { getAuthHeader } from '@/utils/auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:8000'

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = getAuthHeader()

    if (!authHeader) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const response = await fetch(`${API_URL}/company-details/social-links/${params.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.detail || 'Failed to delete social link')
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting social link:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 