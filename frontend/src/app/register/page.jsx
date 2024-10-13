"use client";

import { successToast, errorToast } from "@/utils/toastUtils";
import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  // State to store form data
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "",
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      
      // alert("Passwords do not match");
      errorToast("Passwords do not match");
      return;
    }

    const payload = {
      username: formData.username,
      password: formData.password,
      email: formData.email,
      role: formData.role,
    };

    try {
      const response = await fetch("http://localhost:8001/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // alert("Registration successful!");
        successToast("Registration successful!");
        // Save email in local storage before redirecting
        localStorage.setItem("verificationEmail", payload.email);
        // Redirect to the verify email page
        router.push('/verifyEmail');
      } else {
        const errorData = await response.json();
        console.error("Registration failed:", errorData);
        // alert("Registration failed");
        errorToast("Registration failed, email or username taken")
      }
    } catch (error) {
      console.error("Error during registration:", error);
      // alert("An error occurred. Please try again.");
      errorToast("An error occurred. Please try again.")
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 bg-fixed bg-center bg-cover bg-no-repeat justify-center"
                style={{
                    backgroundImage: "linear-gradient(to bottom, rgba(11, 5, 29, 0.95), rgba(28, 17, 50, 0.95)), url('/bgpic.png')"
                }}>
      <Card className="bg-opacity-40 w-[350px] max-w-md backdrop-blur-md rounded-lg shadow-lg items-center">
        <CardHeader>
          <CardTitle>Register new account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Select onValueChange={handleRoleChange}>
                  <SelectTrigger id="userType">
                    <SelectValue placeholder="I am a..." />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="admin">Tournament Organizer</SelectItem>
                    <SelectItem value="player">Competitive Player</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your personal email"
                  required
                  auto
                  autoComplete="off"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">User ID</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Your unique username"
                  required
                  autoComplete="off"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="8-16 Alphanumeric Characters"
                  required
                  autoComplete="off"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Enter your password again"
                  required
                  autoComplete="off"
                />
              </div>
            </div>
            <CardFooter className="flex flex-col items-start space-y-2 mt-10">
              <div className="flex w-full space-x-2 items-center justify-center">
                <Link href="/">
                  <Button
                    type="button"
                    variant="outline"
                    className="text-white bg-[#1e0b38] hover:bg-gray-300/70"
                  >
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  variant="outline"
                  className="bg-white text-[#1e0b38] hover:bg-gray-300/70"
                >
                  Register
                </Button>
              </div>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
