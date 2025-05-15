import { NextResponse } from 'next/server';

// The external API URL
const API_URL = 'http://127.0.0.1:8000';

export async function GET() {
  try {
    console.log(`Fetching stats data from: ${API_URL}/webpages`);
    
    // Fetch complete data from the external API
    const response = await fetch(`${API_URL}/webpages`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    
    // Parse the JSON response
    const data = await response.json();
    console.log('Successfully fetched data for stats');
    
    // Extract just the stats section
    const stats = data.stats || {
      testimonialCount: 0,
      serviceCount: 0,
      userCount: 0
    };
    
    // Return just the stats data
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error in stats API route:', error);
    
    // Return error response
    return NextResponse.json(
      { 
        testimonialCount: 0,
        serviceCount: 0,
        userCount: 0,
        error: 'Failed to fetch stats data'
      },
      { status: 500 }
    );
  }
} 