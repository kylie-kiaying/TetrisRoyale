'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { successToast, errorToast } from '@/utils/toastUtils';
import BackgroundWrapper from '@/components/BackgroundWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { id } = useSearchParams(); // Access the id from URL params
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      errorToast('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8001/auth/reset-password/${id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ new_password: password }),
        }
      );

      if (response.ok) {
        successToast('Your password has been reset successfully.');
        router.push('/login'); // Redirect to login after success
      } else {
        const result = await response.json();
        errorToast(result.message || 'An error occurred');
      }
    } catch (err) {
      errorToast('Failed to connect to the server. Please try again later.');
    }
  };

  return (
    <BackgroundWrapper>
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md rounded-2xl border-none bg-opacity-50 p-6 shadow-lg backdrop-blur-lg">
          <CardHeader className="mb-4 text-center">
            <CardTitle className="text-3xl font-semibold text-white">
              Reset your password
            </CardTitle>
            <p className="mt-2 text-sm text-gray-300">
              Enter a new password for your account
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                New password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-md border border-gray-500 bg-white px-4 py-2 text-gray-700 placeholder-gray-400 transition duration-200 focus:border-primary focus:outline-none focus:ring-primary"
              />

              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-300"
              >
                Confirm new password
              </label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-md border border-gray-500 bg-white px-4 py-2 text-gray-700 placeholder-gray-400 transition duration-200 focus:border-primary focus:outline-none focus:ring-primary"
              />

              <Button
                type="submit"
                className="w-full rounded-lg bg-[#4e4e70] px-4 py-2 text-white transition duration-300 hover:bg-[#5c5c8d]"
              >
                Reset Password
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-300">
              <a href="/login" className="hover:underline">
                Back to Login
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </BackgroundWrapper>
  );
}
