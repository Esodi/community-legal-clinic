import { NextResponse } from 'next/server'
import { getAuthHeader } from '@/utils/auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:8000'

export async function PUT(request: Request) {
  try {
    const authHeader = getAuthHeader()

    if (!authHeader) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const data = await request.json()
    const response = await fetch(`${API_URL}/company-details/contact`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.detail || 'Failed to update contact section')
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating contact section:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 