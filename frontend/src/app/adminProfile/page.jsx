'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar.jsx';
import { DataTable } from '@/components/ui/data-table';
import { useAuthStore } from '@/store/authStore';
import ToggleButtons from '@/components/ui/toggle';

const tournaments = [
    {
      id: '1',
      tournament_name: 'Tetris Championship 2024',
      start: 'June 1, 2024',
      end: 'June 10, 2024',
      status: 'Ongoing',
      recommendedRating: 2000,
      players: [{username: "p1", tier: "Master", color: 'text-purple-500', rating: 2000}, {username: "p2", tier: "Gold", color: 'text-yellow-500', rating: 1200}, {username: "p3", tier: "Gold", color: 'text-yellow-500', rating: 1200}],
    },
    {
      id: '2',
      tournament_name: 'Spring Showdown',
      start: 'October 5, 2024',
      end: 'October 15, 2024',
      status: 'Upcoming',
      recommendedRating: 1200,
      players: [{username: "p1", tier: "Master", color: 'text-purple-500', rating: 2000}, {username: "p2", tier: "Gold", color: 'text-yellow-500', rating: 1200}, {username: "p3", tier: "Gold", color: 'text-yellow-500', rating: 1200}],
    },
    {
      id: '3',
      tournament_name: 'Championship Series 1',
      start: 'June 1, 2024',
      end: 'June 9, 2024',
      status: 'Ongoing',
      recommendedRating: 1200,
      players: [{username: "p1", tier: "Master", color: 'text-purple-500', rating: 2000}, {username: "p2", tier: "Gold", color: 'text-yellow-500', rating: 1200}, {username: "p3", tier: "Gold", color: 'text-yellow-500', rating: 1200}],
    }
];

export default function AdminProfile() {
  const username = useAuthStore((state) => state.username); // Get username from the auth store

  return (
    <div
      className="flex min-h-screen flex-col items-center bg-cover bg-fixed bg-center bg-no-repeat px-4 text-white"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(11, 5, 29, 0.95), rgba(28, 17, 50, 0.95)), url('/bgpic.png')",
      }}
    >
      {/* Navbar */}
      <div className="sticky top-0 z-50 flex w-full justify-center">
        <Navbar />
      </div>

      {/* Profile Section */}
      <div className="mt-8 flex w-full flex-col items-center justify-start space-y-6 py-10">
        {/* Profile Card */}
        <div className="mx-4 flex w-full max-w-4xl flex-col items-center space-y-6 rounded-lg bg-[#1c1132] p-6 shadow-md md:p-8">
          {/* Profile Picture */}
          <div className="group relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-[#6d28d9] bg-gray-500 md:h-40 md:w-40">
            <img
              src="/user.png"
              alt="Profile Picture"
              className="h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-50"
            />
          </div>

          <div className="flex w-full flex-col items-center space-y-4 px-2">
            <h1 className="text-3xl font-semibold md:text-4xl">{username}</h1>
            <div className="flex w-full flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0 md:px-6">
              <p className="text-xl text-gray-400 md:text-2xl">Tournaments Hosted: 3</p>
            </div>
          </div>

            <div className="w-full transform rounded-lg bg-[#1c1132] p-4 shadow-lg transition-all duration-300 hover:scale-105 md:p-6">
            <h2 className="mb-4 text-center text-lg font-semibold text-white md:text-2xl">
              Tournament List
            </h2>
            <div className="custom-scrollbar w-full overflow-x-auto">
              <div className="min-w-[600px]">
                <DataTable type="created" data={tournaments} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
