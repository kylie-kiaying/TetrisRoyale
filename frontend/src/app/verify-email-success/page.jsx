'use client';

import BackgroundWrapper from '@/components/BackgroundWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function VerifyEmailSuccessPage() {
  const router = useRouter();

  return (
    <BackgroundWrapper>
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md rounded-2xl border-none bg-opacity-50 p-6 shadow-lg backdrop-blur-lg">
          <CardHeader className="mb-4 text-center">
            <CardTitle className="text-3xl font-semibold text-white">
              Email Verified Successfully
            </CardTitle>
            <p className="mt-2 text-sm text-gray-300">
              Your email has been verified. You may now proceed to login.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <Button
              onClick={() => router.push('/login')}
              className="w-full rounded-lg bg-[#4e4e70] px-4 py-2 text-white transition duration-300 hover:bg-[#5c5c8d]"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    </BackgroundWrapper>
  );
}
