'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Call logout API with credentials to ensure cookies are sent
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }
      
      // Redirect to login page and force a full page refresh
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      // In case of error, still try to redirect
      router.push('/login');
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleLogout}
      className="text-gray-400 hover:text-gray-600"
    >
      <LogOut className="h-5 w-5" />
    </Button>
  );
} 