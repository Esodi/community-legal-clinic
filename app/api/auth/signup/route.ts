import { NextResponse } from "next/server"

interface SignupRequest {
  username: string
  email: string
  password: string
}

interface SignupResponse {
  message: string
  user_id: number
}

export async function POST(request: Request) {
  try {
    const body: SignupRequest = await request.json()
    const { username, email, password } = body

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      )
    }

    // Call FastAPI backend signup endpoint
    const response = await fetch('http://0.0.0.0:8000/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail || 'Registration failed' },
        { status: response.status }
      );
    }

    // Return the FastAPI response directly
    return NextResponse.json(data);

  } catch (error) {
    //console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 