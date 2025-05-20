import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

const API_URL = 'http://0.0.0.0:8000'

import { NextRequest } from 'next/server'

export async function PUT(
  request: NextRequest
) {
  try {
    const headersList = await headers()
    const authHeader = headersList.get('Authorization')
    if (!authHeader) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    const data = await request.json()
    const { pathname } = new URL(request.url)
    const idMatch = pathname.match(/\/footer\/([^/]+)/)
    const id = idMatch ? idMatch[1] : null
    if (!id) {
      return new NextResponse('Bad Request: Missing ID', { status: 400 })
    }
    const response = await fetch(`${API_URL}/company-details/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.detail || 'Failed to update footer section')
    }
    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating footer section:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest
) {
  try {
    await request.arrayBuffer(); // or any other method to consume the request
    const headersList = await headers()
    const authHeader = headersList.get('Authorization')
    if (!authHeader) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    const { pathname } = new URL(request.url)
    const idMatch = pathname.match(/\/footer\/([^/]+)/)
    const id = idMatch ? idMatch[1] : null
    if (!id) {
      return new NextResponse('Bad Request: Missing ID', { status: 400 })
    }
    const response = await fetch(`${API_URL}/company-details/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader
      }
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.detail || 'Failed to delete footer section')
    }
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting footer section:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}