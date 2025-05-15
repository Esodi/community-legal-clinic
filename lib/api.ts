const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// Helper function to handle "not found" cases since we might not have access to Next.js's notFound
function handleNotFound(condition: boolean, message: string = 'Not found') {
  if (!condition) {
    throw new Error(message);
  }
}

// Types
interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: string;
}

interface Session {
  username: string;
  token: string;
  role: string;
  lastActive: string;
}

export interface WebpagesData {
  headerData: {
    navigationLinks: Array<{
      label: string;
      href: string;
    }>;
  };
  footerData: {
    aboutUs: any;
    contactUs: any;
    ourServices: any;
    usefulLinks: any;
    socialLinks: any;
  };
  heroData: any;
  servicesData: {
    title: string;
    description: string;
    packages: Array<{
      id: number;
      title: string;
      description?: string;
      videoThumbnail: string;
      videoUrl: string;
      offerings: Array<{
        id: number;
        text: string;
      }>;
    }>;
  };
  howData: any;
  announcementsData: any;
  testimonialsData: any;
  stats: {
    testimonialCount: number;
    serviceCount: number;
    userCount: number;
  };
}

// Token management
let cachedToken: string | null = null;

async function getToken(): Promise<string> {
  try {
    // Always fetch a fresh token for now (we can add caching later if needed)
    const response = await fetch(`${API_URL}/generate-test-token`);
    if (!response.ok) {
      throw new Error('Failed to get token');
    }
    const data = await response.json();
    cachedToken = data.token;
    return data.token;
  } catch (error) {
    //console.error('Error getting token:', error);
    throw new Error('Failed to get authentication token');
  }
}

// Cache for auth data
let cachedAuthData: any = null;
let cachedWebpagesData: WebpagesData | null = null;

// Data getter functions with automatic token handling
export async function fetchData<T>(endpoint: string): Promise<T> {
  try {
    // Determine the correct URL to use
    let url: string;
    
    if (endpoint.startsWith('/api')) {
      // For local API endpoints (proxied through Next.js)
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      url = `${baseUrl}${endpoint}`;
    } else {
      // For direct external API access
      url = `${API_URL}${endpoint}`;
    }
    
    console.log('Fetching from:', url);
    
    // Fetch with no caching to always get fresh data
    const response = await fetch(url, { 
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${endpoint} (${response.status})`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
}

// Function to get all website data from the webpages endpoint
export async function getWebpagesData(): Promise<WebpagesData> {
  
  try {
    // For local development, use the API endpoint with full URL
    const data = await fetchData<WebpagesData>('/api/webpages');
    return data;
  } catch (error) {
    console.error('WebpagesData fetch error:', error);
    throw new Error('Failed to fetch website data');
  }
}

// Get statistics only
export async function getStatsData() {
  try {
    return await fetchData<WebpagesData['stats']>('/api/webpages/stats');
  } catch (error) {
    throw new Error('Failed to fetch stats data');
  }
}

// Helper functions to extract specific sections from the webpages data
export async function getHeaderData() {
  const data = await getWebpagesData();
  return data.headerData;
}

export async function getHeroData() {
  const data = await getWebpagesData();
  return data.heroData;
}

export async function getServicesData() {
  const data = await getWebpagesData();
  return data.servicesData;
}

export async function getHowData() {
  const data = await getWebpagesData();
  return data.howData;
}

export async function getAnnouncementsData() {
  const data = await getWebpagesData();
  return data.announcementsData;
}

export async function getFooterData() {
  const data = await getWebpagesData();
  return data.footerData;
}

export async function getTestimonialsData() {
  const data = await getWebpagesData();
  return data.testimonialsData;
}

// Auth related functions with token handling
async function fetchAuthData() {
  if (cachedAuthData) return cachedAuthData;
  
  const token = await getToken();
  const response = await fetch(`${API_URL}/auth`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch auth data');
  }
  
  cachedAuthData = await response.json();
  return cachedAuthData;
}

export async function getUsersData() {
  const data = await fetchAuthData();
  handleNotFound(!data.users, 'No users found');
  return { users: data.users };
}

export async function getAuthData() {
  const data = await fetchAuthData();
  handleNotFound(!data.auth, 'No auth data found');
  return { sessions: data.auth.sessions };
}

export async function updateAuthData(data: { sessions: Session[] }) {
  const token = await getToken();
  const response = await fetch(`${API_URL}/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update auth data');
  }

  // Invalidate cache
  cachedAuthData = null;
}

export async function findUserByUsername(username: string): Promise<User | null> {
  const { users } = await getUsersData();
  return users.find((u: User) => u.username === username) || null;
}

// Function to clear token cache (useful for logout)
export function clearTokenCache() {
  cachedToken = null;
  cachedAuthData = null;
  cachedWebpagesData = null;
}