// app/components/Proxy.tsx
"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthProxy({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'authorized' | 'unauthorized'>('loading');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Call your backend to verify the session
        const response = await fetch('http://127.0.0.1:8000/apps/imanifund/api/v2/auth/verify'); 
        
        if (response.ok) {
          setStatus('authorized');
        } else {
          // Token is expired or invalid
          setStatus('unauthorized');
          router.push('/login');
        }
      } catch (error) {
        setStatus('unauthorized');
        router.push('/login');
      }
    };

    verifyToken();
  }, [router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-sky-100 border-t-sky-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return status === 'authorized' ? <>{children}</> : null;
}