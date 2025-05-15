import { cookies } from 'next/headers'

export function getAuthHeader(): string | null {
  const cookieStore = cookies()
  const token = cookieStore.get('auth_token')
  return token ? `Bearer ${token.value}` : null
} 