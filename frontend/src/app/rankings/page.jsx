'use client';

import { useState, useEffect } from 'react';
import BackgroundWrapper from '@/components/BackgroundWrapper';
import Navbar from '@/components/Navbar';
import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Podium from '@/components/Podium';
import Image from 'next/image';
import { getPlayerTier } from '@/utils/getPlayerTier';
import { fetchLeaderboard } from '@/utils/fetchRankings';
import { useAuthStore } from '@/store/authStore';
import { FaUser } from 'react-icons/fa';

export default function RankingsPage() {
  const [topPlayers, setTopPlayers] = useState([]);
  const currentPlayerId = useAuthStore((state) => state.user.userId);

  useEffect(() => {
    const fetchData = async () => {
      const players = await fetchLeaderboard();
      setTopPlayers(players);
    };
    fetchData();
  }, []);

  // Fill the rest of the rows with empty data to display up to 50 players
  const maxPlayers = 50;
  const playersToDisplay = [...topPlayers];
  while (playersToDisplay.length < maxPlayers) {
    playersToDisplay.push({
      rank: playersToDisplay.length + 1,
      username: '',
      rating: '',
    });
  }

  return (
    <BackgroundWrapper>
      <Navbar />
      <div className="flex min-h-screen flex-col px-4 py-8 sm:px-6 lg:px-12">
        {/* Podium for Top 3 - responsive adjustments */}
        <div className="mb-8 flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
          <Podium players={topPlayers.slice(0, 3)} />
        </div>

        {/* Rest of the Top 50 Table inside a modern, borderless Card */}
        <Card className="w-full rounded-lg border-none bg-transparent shadow-lg">
          <CardContent className="p-4 sm:p-6">
            <div className="overflow-x-auto">
              <table className="w-full table-auto text-white">
                <thead className="border-b border-gray-600 bg-transparent">
                  <tr>
                    <th className="w-16 p-2 text-left text-xs font-semibold text-gray-400 sm:text-sm md:text-base lg:text-lg">
                      Rank
                    </th>
                    <th className="p-2 text-left text-xs font-semibold text-gray-400 sm:text-sm md:text-base lg:text-lg">
                      Player
                    </th>
                    <th className="p-2 text-left text-xs font-semibold text-gray-400 sm:text-sm md:text-base lg:text-lg">
                      WHR Rating
                    </th>
                    <th className="p-2 text-left text-xs font-semibold text-gray-400 sm:text-sm md:text-base lg:text-lg">
                      Tier
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {playersToDisplay.map((player, index) => {
                    const isCurrentUser = player.player_id === currentPlayerId;
                    return (
                      <tr
                        key={index}
                        className={`${
                          player.rank === 1
                            ? 'border-l-4 border-yellow-500 bg-gray-800 font-bold text-yellow-500'
                            : player.rank === 2
                              ? 'border-l-4 border-gray-300 bg-gray-700 font-bold text-gray-300'
                              : player.rank === 3
                                ? 'border-l-4 border-orange-500 bg-gray-800 font-bold text-orange-500'
                                : index % 2 === 0
                                  ? 'bg-gray-800 text-gray-300'
                                  : 'bg-gray-700 text-gray-300'
                        } ${
                          isCurrentUser
                            ? 'border-2 border-blue-500 bg-blue-900/80 shadow-lg'
                            : ''
                        } transition-all duration-200 hover:bg-gray-600`}
                      >
                        <td className="p-2 text-xs sm:p-4 sm:text-sm md:text-base">
                          {player.rank}
                        </td>
                        <td
                          className={`flex items-center p-2 text-xs sm:p-4 sm:text-sm md:text-base ${
                            isCurrentUser ? 'font-bold text-blue-300' : ''
                          }`}
                        >
                          {isCurrentUser && (
                            <FaUser className="mr-2 text-blue-400" />
                          )}
                          {player.avatar && (
                            <div className="mr-3 h-6 w-6 overflow-hidden rounded-full sm:h-8 sm:w-8">
                              <Image
                                src={player.avatar}
                                alt={player.username}
                                width={32}
                                height={32}
                                className="object-cover"
                              />
                            </div>
                          )}
                          <span className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap text-sm sm:max-w-[150px] sm:text-base md:max-w-[200px] lg:max-w-[250px]">
                            {player.username || 'Empty'}
                          </span>
                        </td>
                        <td
                          className={`p-2 text-xs sm:p-4 sm:text-sm md:text-base ${
                            isCurrentUser ? 'font-bold text-blue-300' : ''
                          }`}
                        >
                          {player.rating || '-'}
                        </td>
                        <td className="p-2 text-xs sm:p-4 sm:text-sm md:text-base">
                          <span
                            className={
                              player.rating
                                ? getPlayerTier(player.rating).colorClass
                                : ''
                            }
                          >
                            {player.rating
                              ? getPlayerTier(player.rating).tier
                              : '-'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </BackgroundWrapper>
  );
}
