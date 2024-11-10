'use client';

import { successToast, errorToast } from '@/utils/toastUtils';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
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

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
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

    if (formData.password !== formData.confirmPassword) {
      errorToast('Passwords do not match');
      return;
    }

    const payload = {
      username: formData.username,
      password: formData.password,
      email: formData.email,
      role: formData.role,
    };

    try {
      const response = await fetch('http://localhost:8001/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        successToast('Registration successful!');
        localStorage.setItem('verificationEmail', payload.email);
        router.push('/verifyEmail');
      } else {
        const errorData = await response.json();
        errorToast('Registration failed, email or username taken');
      }
    } catch (error) {
      errorToast('An error occurred. Please try again.');
    }
  };

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-cover bg-fixed bg-center bg-no-repeat px-6 py-12"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(11, 5, 29, 0.95), rgba(28, 17, 50, 0.95)), url('/bgpic.png')",
      }}
    >
      <Card className="w-full max-w-md rounded-2xl border-none bg-opacity-50 p-6 shadow-lg backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">
            Register new account
          </CardTitle>
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
                <Label htmlFor="email" className="text-sm text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your personal email"
                  required
                  className="bg-white text-gray-700"
                  autoComplete="off"
                />
              </div>
              <div>
                <Label htmlFor="username" className="text-sm text-gray-300">
                  User ID
                </Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Your unique username"
                  required
                  className="bg-white text-gray-700"
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
                  placeholder="8-16 Alphanumeric Characters"
                  required
                  className="bg-white text-gray-700"
                  autoComplete="off"
                />
              </div>
              <div>
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm text-gray-300"
                >
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Enter your password again"
                  required
                  className="bg-white text-gray-700"
                  autoComplete="off"
                />
              </div>
            </div>
            <CardFooter className="mt-8 flex flex-col items-center space-y-4">
              <Button
                type="submit"
                className="w-full rounded-lg bg-[#4e4e70] px-4 py-2 text-white transition duration-300 hover:bg-[#5c5c8d]"
              >
                Register
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
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
