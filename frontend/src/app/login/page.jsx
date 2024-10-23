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

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: '',
  });

  // Handle input change
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handle role selection
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
        console.error('Login failed:', errorData);
        errorToast('Login failed:' + (errorData.detail || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error during login:', error);
      errorToast('An error occurred during login. Please try again.');
    }
  };

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-cover bg-fixed bg-center bg-no-repeat px-4"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(11, 5, 29, 0.95), rgba(28, 17, 50, 0.95)), url('/bgpic.png')",
      }}
    >
      <Card className="w-[350px] max-w-md items-center rounded-lg bg-opacity-40 shadow-lg backdrop-blur-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Select onValueChange={handleRoleChange}>
                  <SelectTrigger id="userType">
                    <SelectValue placeholder="I am a..."></SelectValue>
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="admin">Tournament Organizer</SelectItem>
                    <SelectItem value="player">Competitive Player</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">User ID</Label>
                <Input
                  id="username"
                  placeholder=""
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  autoComplete="off"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder=""
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  autoComplete="off"
                />
              </div>
            </div>
            <CardFooter className="mt-6 flex flex-col items-start space-y-2">
              <div className="flex w-full items-center justify-center space-x-2">
                <Link href="/">
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-[#1e0b38] text-white hover:bg-gray-300/70"
                  >
                    {' '}
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  variant="outline"
                  className="bg-white text-[#1e0b38] hover:bg-gray-300/70"
                >
                  {' '}
                  Sign in
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Forgot your password?{' '}
                <a href="/forgot-password" className="hover:underline">
                  Reset it here
                </a>
              </p>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
