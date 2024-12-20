'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function EmailVerification() {
  const [email, setEmail] = useState('');
  const [censoredEmail, setCensoredEmail] = useState('');

  useEffect(() => {
    // Retrieve email from local storage
    const savedEmail = localStorage.getItem('verificationEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      const [localPart, domain] = savedEmail.split('@');
      const censoredLocalPart =
        localPart.slice(0, 2) + '****' + localPart.slice(-1);
      setCensoredEmail(`${censoredLocalPart}@${domain}`);
    }
  }, []);

  return (
    <div
      className="flex min-h-screen flex-col items-center bg-cover bg-fixed bg-center bg-no-repeat px-4 text-white"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(11, 5, 29, 0.95), rgba(28, 17, 50, 0.95)), url('/bgpic.png')",
      }}
    >
      {/* Verification Card Section */}
      <div className="mt-20 flex w-full flex-grow flex-col items-center justify-center">
        {/* Verification Card */}
        <div className="mx-4 w-full max-w-lg space-y-6 rounded-lg bg-[#1c1132] p-8 text-center shadow-lg">
          <h1 className="text-3xl font-bold">Verify Your Email</h1>
          <p className="text-lg text-gray-300">
            To access TetriTracker, please verify your email address. We have
            sent a verification email to{' '}
            <span className="font-semibold text-white">{censoredEmail}</span>.
            Check your inbox to proceed.
          </p>
          <Button
            variant="solid"
            className="mt-4 w-full bg-purple-700 text-white hover:bg-purple-600"
            onClick={() => (window.location.href = '/login')}
          >
            Go to Login
          </Button>
        </div>
      </div>
    </div>
  );
}
