'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import BackgroundWrapper from '@/components/BackgroundWrapper';
import { successToast, errorToast } from '@/utils/toastUtils';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous error

    try {
      const response = await fetch('http://localhost:8001/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recovery_email: email }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        successToast(
          'If an account with this email exists, you will receive a reset link shortly.'
        );
      } else {
        const result = await response.json();
        setError(result.message || 'Something went wrong. Please try again.');
        errorToast('Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again later.');
      errorToast('Failed to connect to the server. Please try again later.');
    }
  };

  return (
    <BackgroundWrapper>
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md rounded-2xl border-none bg-opacity-50 p-6 shadow-lg backdrop-blur-lg">
          <CardHeader className="mb-4 text-center">
            <CardTitle className="text-3xl font-semibold text-white">
              Forgot your password?
            </CardTitle>
            <p className="mt-2 text-sm text-gray-300">
              Please enter the email address you'd like your password reset
              information sent to
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {isSubmitted ? (
              <div>
                <p className="text-center text-lg text-gray-300">
                  If an account with this email exists, you will receive a reset
                  link shortly.
                </p>
                <Button
                  className="w-full rounded-lg bg-[#4e4e70] px-4 py-2 text-white transition duration-300 hover:bg-[#5c5c8d]"
                  onClick={() => router.push('/login')}
                >
                  Back to Login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300"
                >
                  Enter email address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="yourname@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-md border border-gray-500 bg-white px-4 py-2 text-gray-700 placeholder-gray-400 transition duration-200 focus:border-primary focus:outline-none focus:ring-primary"
                />
                {error && (
                  <p className="text-center text-sm text-red-500">{error}</p>
                )}
                <Button
                  type="submit"
                  className="w-full rounded-lg bg-[#4e4e70] px-4 py-2 text-white transition duration-300 hover:bg-[#5c5c8d]"
                >
                  Request reset link
                </Button>
              </form>
            )}
            {!isSubmitted && (
              <p className="mt-4 text-center text-sm text-gray-300">
                <a href="/login" className="hover:underline">
                  Back to Login
                </a>
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </BackgroundWrapper>
  );
}
