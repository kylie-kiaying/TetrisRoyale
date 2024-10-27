'use client';

import { successToast, errorToast } from '@/utils/toastUtils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
// Import Google icon from a library like react-icons
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: '',
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleRoleChange = (role) => {
    setFormData((prevData) => ({
      ...prevData,
      role: role,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      username: formData.username,
      password: formData.password,
      role: formData.role,
    };

    try {
      const response = await fetch('http://localhost:8001/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        useAuthStore.getState().setToken(data.access_token);
        useAuthStore.getState().setUsername(payload.username);
        useAuthStore.getState().setUsertype(payload.role);
        successToast('Login successful!');
        if (payload.role === 'admin') {
          router.push('/adminHome');
        } else {
          router.push('/playerHome');
        }
      } else {
        const errorData = await response.json();
        errorToast('Login failed:' + (errorData.detail || 'Unknown error'));
      }
    } catch (error) {
      errorToast('An error occurred during login. Please try again.');
    }
  };

  const handleGoogleSignIn = () => {
    // You would replace this with your Google OAuth logic
    successToast('Redirecting to Google Sign-In...');
    // Perform redirection or initiate Google sign-in here
  };

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-cover bg-fixed bg-center bg-no-repeat px-6 py-12"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(11, 5, 29, 0.95), rgba(28, 17, 50, 0.95)), url('/bgpic.png')",
      }}
    >
      <Card className="w-full max-w-md rounded-2xl bg-opacity-50 p-6 shadow-lg backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">
            Sign in
          </CardTitle>
          <CardDescription className="text-sm text-gray-400">
            Access your account and stay updated.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full gap-6">
              <div>
                <Select onValueChange={handleRoleChange}>
                  <SelectTrigger className="bg-white text-gray-700">
                    <SelectValue placeholder="I am a..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Tournament Organizer</SelectItem>
                    <SelectItem value="player">Competitive Player</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="username" className="text-sm text-gray-300">
                  User ID
                </Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="bg-white text-gray-700"
                  required
                  autoComplete="off"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-sm text-gray-300">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-white text-gray-700"
                  required
                  autoComplete="off"
                />
              </div>
            </div>
            <CardFooter className="mt-8 flex flex-col items-center space-y-4">
              <Button
                type="submit"
                className="w-full rounded-lg bg-[#4e4e70] px-4 py-2 text-white transition duration-300 hover:bg-[#5c5c8d]"
              >
                Sign in
              </Button>
              <Button
                type="button"
                onClick={handleGoogleSignIn}
                className="flex w-full items-center justify-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition duration-300 hover:bg-gray-100"
              >
                <FcGoogle className="h-5 w-5" />
                <span>Sign in with Google</span>
              </Button>
              <Link href="/">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-lg border border-gray-500 bg-transparent px-4 py-2 text-gray-300 transition duration-300 hover:bg-gray-500/40"
                >
                  Cancel
                </Button>
              </Link>
              <p className="text-sm text-gray-400">
                Forgot your password?{' '}
                <Link
                  href="/forgot-password"
                  className="text-white underline hover:text-gray-300"
                >
                  Reset it here
                </Link>
              </p>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
