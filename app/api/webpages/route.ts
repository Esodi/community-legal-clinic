import { NextResponse } from 'next/server';

// The external API URL
const API_URL = 'http://127.0.0.1:8000';

export async function GET() {
  try {
    //console.log(`Fetching data from: ${API_URL}/webpages`);
    
    // Fetch data from the external API with no-store cache option
    const response = await fetch(`${API_URL}/webpages`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    
    // Parse the JSON response
    const data = await response.json();
    //console.log('Successfully fetched data from external API' , data);
    
    // Return the data directly with no-cache headers
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    //console.error('Error in webpages API route:', error);
    
    // Return error response
    return NextResponse.json(
      { error: 'Failed to fetch website data from external API' },
      { status: 500 }
    );
  }
} 