'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar.jsx';
import { DataTable } from '@/components/ui/data-table';
import ToggleButtons from '@/components/ui/toggle';
import PlayerStatistics from '@/components/PlayerStatistics';
import { getPlayerTier } from '@/utils/getPlayerTier';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

// Sample match history data
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

export default function ViewPlayerProfile() {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [visiblePlot, setVisiblePlot] = useState('playstyle');

  const fetchProfileData = async () => {
    try {
      const response = await fetch(`http://localhost:8002/players/${id}`);
      const playerData = await response.json();

      const ratingResponse = await fetch(`http://localhost:8005/ratings/${id}`);
      const ratingData = await ratingResponse.json();

      setProfileData({
        username: playerData.username,
        rating: ratingData.rating,
      });
    } catch (error) {
      console.error('Error fetching player data:', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProfileData();
    }
  }, [id]);

  if (!profileData) {
    return <div>Loading...</div>;
  }

  const { username, rating } = profileData;
  const { tier, color } = getPlayerTier(rating);

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
      <div className="sticky top-0 z-50 flex w-full justify-center">
        <Navbar />
      </div>

      <div className="mt-8 flex w-full flex-col items-center justify-start space-y-6 py-10">
        <div className="mx-4 flex w-full max-w-4xl flex-col items-center space-y-6 rounded-lg bg-[#1c1132] p-6 shadow-md md:p-8">
          <div className="group relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-[#6d28d9] bg-gray-500 md:h-40 md:w-40">
            <img
              src="/user.png"
              alt="Profile Picture"
              className="h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-50"
            />
          </div>

          <div className="flex w-full flex-col items-center space-y-4 px-2">
            <h1 className="text-3xl font-semibold md:text-4xl">{username}</h1>
            <p className="text-xl text-gray-400 md:text-2xl">WHR: {rating}</p>
            <Link href="/tierInfo">
              <Badge
                className={`mt-2 rounded-lg px-3 py-1 ${color} hover:shadow-[0_0_10px_var(--tw-shadow-color)]`}
                style={{ '--tw-shadow-color': color }}
              >
                {tier}
              </Badge>
            </Link>
          </div>

          {/* Toggle Buttons for Analytics */}
          <ToggleButtons
            options={plotOptions}
            activeOption={visiblePlot}
            onToggle={(plot) => setVisiblePlot(plot)}
          />

          {/* Analytics Section */}
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
