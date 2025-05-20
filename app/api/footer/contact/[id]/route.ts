import { NextResponse } from 'next/server'
import { getAuthHeader } from '@/utils/auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:8000'

export async function DELETE(request: Request) {
  try {
    const authHeader = getAuthHeader()

    if (!authHeader) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Extract id from the URL
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()

    if (!id) {
      return new NextResponse('Bad Request: Missing id', { status: 400 })
    }

    const response = await fetch(`${API_URL}/company-details/contact/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.detail || 'Failed to delete contact item')
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting contact item:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}