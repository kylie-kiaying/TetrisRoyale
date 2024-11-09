'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar.jsx';
import { DataTable } from '@/components/ui/data-table';
import { useAuthStore } from '@/store/authStore';
import PlayerStatistics from '@/components/PlayerStatistics';
import ToggleButtons from '@/components/ui/toggle';
import { getPlayerTier } from '@/utils/getPlayerTier'; // Import the getPlayerTier function
import { Badge } from '@/components/ui/badge';

const matchHistory = [
  {
    id: '1',
    opponent: 'Username2',
    opponent_img: '/user.png',
    result: 'Win',
    tournament: 'Tetris Championship',
    date: 'October 5, 2024',
    pieces_placed: 101,
    pps: 5.97,
    kpp: 2.85,
    apm: 50,
    finesse_percentage: '98.02%',
    lines_cleared: 40,
  },
  {
    id: '2',
    opponent: 'Username3',
    opponent_img: '/user.png',
    result: 'Lost',
    tournament: 'Spring Showdown',
    date: 'June 1, 2024',
    pieces_placed: 95,
    pps: 5.5,
    kpp: 3.01,
    apm: 45,
    finesse_percentage: '95.00%',
    lines_cleared: 38,
  },
];

export default function PlayerProfile() {
  const username = useAuthStore((state) => state.user.username); // Get username from the auth store
  const playerRating = useAuthStore((state) => state.user.rating); // Get player rating from the auth store
  const { tier, color } = getPlayerTier(playerRating); // Get the tier and color based on the rating
  const [visiblePlot, setVisiblePlot] = useState('playstyle'); // State to track the visible plot

  const togglePlot = (plot) => {
    setVisiblePlot(plot);
  };

  const plotOptions = [
    { value: 'playstyle', label: 'Playstyle' },
    { value: 'elo', label: 'ELO Over Time' },
    { value: 'wins', label: 'Wins Over Time' },
  ];

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
              <p className="text-xl text-gray-400 md:text-2xl">
                WHR: {playerRating}
              </p>
              {/* Display Tier Badge */}
              <Badge className={`text-xl ${color} hover:glow-${color}`}>
                {tier}
              </Badge>
              <div className="flex flex-col items-center space-y-2 md:items-start">
                <p className="text-base text-gray-400 md:text-lg">
                  Matches won: 1
                </p>
                <p className="text-base text-gray-400 md:text-lg">
                  Matches lost: 1
                </p>
                <p className="text-base text-gray-400 md:text-lg">
                  Winrate: 50%
                </p>
              </div>
            </div>
          </div>

          {/* Toggle Buttons for Plots */}
          <ToggleButtons
            options={plotOptions}
            activeOption={visiblePlot}
            onToggle={togglePlot}
          />

          {/* ELO Analytics Section */}
          <div className="w-full rounded-lg bg-[#2c1f4c] p-4 md:p-6">
            {visiblePlot === 'playstyle' && (
              <PlayerStatistics type="playstyle" />
            )}
            {visiblePlot === 'elo' && <PlayerStatistics type="elo" />}
            {visiblePlot === 'wins' && <PlayerStatistics type="wins" />}
          </div>

          {/* Match History Section */}
          <div className="w-full transform rounded-lg bg-[#1c1132] p-4 shadow-lg transition-all duration-300 hover:scale-105 md:p-6">
            <h2 className="mb-4 text-center text-lg font-semibold text-white md:text-2xl">
              Match History
            </h2>
            <div className="custom-scrollbar w-full overflow-x-auto">
              <div className="min-w-[600px]">
                <DataTable type="match_history" data={matchHistory} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
