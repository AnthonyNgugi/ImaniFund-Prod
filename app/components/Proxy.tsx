"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthProxy({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // Check for your production auth token in cookies
    const hasToken = document.cookie.includes('auth_token');

    if (!hasToken) {
      router.push('/login'); // Redirect to your top-level login
    } else {
      setIsVerified(true);
    }
  }, [router]);

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-sky-100 border-t-sky-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}