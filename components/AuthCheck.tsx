'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { checkAuth, isDesktopMode } from '@/lib/auth-api';

export default function AuthCheck() {
  const router = useRouter();
  const pathname = usePathname();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkAuthentication() {
      try {
        // First check for the isAuthenticated cookie that is not httpOnly
        const isAuthenticatedFromCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('isAuthenticated='))
          ?.split('=')[1];
        
        // If cookie exists and indicates authenticated, we can proceed without API call
        if (isAuthenticatedFromCookie === 'true') {
          // If authenticated user tries to access login/signup pages
          if (pathname === '/login' || pathname === '/signup') {
            router.push('/dashboard');
          }
          setIsCheckingAuth(false);
          return;
        }
        
        // Use our centralized auth check function
        const { isAuthenticated } = await checkAuth();
        
        // If trying to access protected routes without authentication
        if ((pathname?.startsWith('/dashboard') || pathname?.startsWith('/website')) && !isAuthenticated) {
          console.log("AuthCheck - Redirecting to login page");
          router.push('/login');
        }

        // If authenticated user tries to access login/signup pages
        if (isAuthenticated && (pathname === '/login' || pathname === '/signup')) {
          console.log("AuthCheck - Redirecting to dashboard");
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // On error, assume not authenticated
        if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/website')) {
          router.push('/login');
        }
      } finally {
        setIsCheckingAuth(false);
      }
    }

    checkAuthentication();
  }, [pathname, router]);

  // Return null during authentication check to prevent flash of content
  return null;
} 