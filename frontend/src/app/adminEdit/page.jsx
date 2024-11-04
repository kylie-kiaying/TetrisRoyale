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

export default function EditPage() {
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
            Edit Tournament
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full gap-6">
              <div className="flex flex-col space-y-1.5 mb-3">
                <Label htmlFor="name">Tournament Name</Label>
                <Input id="name" className="bg-white text-gray-700" />
              </div>
              <div className="flex flex-col space-y-1.5 mb-3">
                <Label htmlFor="remark">Remarks</Label>
                <Input id="remark" className="bg-white text-gray-700" />
              </div>
              <div className="flex flex-col space-y-1.5 mb-3 w-full">
                <Label htmlFor="startTime">Tournament Start DateTime</Label>
                <Input id="startTime" type="datetime-local" className="text-center pl-16 bg-white text-gray-700" />
              </div>
              <div className="flex flex-col space-y-1.5 mb-3 w-full">
                <Label htmlFor="endTime">Tournament End DateTime</Label>
                <Input id="endTime" type="datetime-local" className="text-center pl-16 bg-white text-gray-700" />
              </div>
            </div>
            <CardFooter className="mt-8 flex flex-row-reverse justify-center items-center">
              <Link href="/adminHome">
                <Button
                  type="submit"
                  className="inline-flex w-full justify-center rounded-md bg-purple-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-600 sm:ml-3 sm:w-auto"
                >
                  Edit
                </Button>
              </Link>
              <Link href="/adminHome">
                <Button
                  type="button"
                  variant="outline"
                  className="mt-3 border border-purple-500 text-purple-500 transition-all duration-200 hover:bg-gray-300/70 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm sm:mt-0 sm:w-auto"
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
