'use client';

import { useEffect } from 'react';
import { initialiseUser } from '../store/authStore.js';

export default function ClientInitialiser() {
  useEffect(() => {
    initialiseUser();
  }, []);

  return null;
}
