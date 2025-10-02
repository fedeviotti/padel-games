'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { stackClientApp } from '@/stack/client';

export function useProtectedRoute() {
  const router = useRouter();
  const user = stackClientApp.useUser();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (user === null) {
      router.push('/');
    } else if (user !== undefined) {
      setIsChecking(false);
    }
  }, [user, router]);

  return { user, isChecking };
}
