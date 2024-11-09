'use client';

import { useAuthStore } from '../store/authStore.js';
import { useEffect } from 'react';
// import { initialiseUser } from '../store/authStore.js';

export default function ClientInitialiser() {
  const initialiseUser = useAuthStore((state) => state.initialiseUser);
  useEffect(() => {
    initialiseUser();
  }, [initialiseUser]);

  return null;
}
