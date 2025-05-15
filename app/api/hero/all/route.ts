import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

interface ChatOption {
  id?: number
  text: string
  icon: string
}

interface ChatData {
  userMessage: string
  botResponse: string
  userName: string
  options: ChatOption[]
}

interface HeroData {
  id?: number
  headline: string
  subheadline: string
  ctaText: string
  chatData: ChatData
  status?: string
}

const API_URL = 'http://0.0.0.0:8000'

export async function GET() {
  try {
    const headersList = headers()
    const authHeader = headersList.get('Authorization')

    if (!authHeader) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const response = await fetch(`${API_URL}/hero/all`, {
      headers: {
        'Authorization': authHeader
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch all heroes')
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    //console.error('Error reading all heroes:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 