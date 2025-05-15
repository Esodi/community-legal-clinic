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
    const response = await fetch(`${API_URL}/company-details/social-links`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorDetail = 'Failed to update social links'
      
      try {
        const errorData = JSON.parse(errorText)
        errorDetail = errorData.detail || errorDetail
      } catch (e) {
        // Text wasn't JSON, use as is
        if (errorText) errorDetail = errorText
      }
      
      console.error('API error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })
      
      throw new Error(errorDetail)
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating social links:', error)
    return new NextResponse(error instanceof Error ? error.message : 'Internal Server Error', { status: 500 })
  }
} 