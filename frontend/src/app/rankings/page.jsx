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

export default function RankingsPage() {
  const [topPlayers, setTopPlayers] = useState([]);

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
        <div className="mb-12 flex w-full flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
          <Podium players={topPlayers.slice(0, 3)} />
        </div>

        {/* Rest of the Top 50 Table inside a modern, borderless Card */}
        <Card className="w-full rounded-lg border-none bg-transparent shadow-lg">
          <CardContent className="p-4 sm:p-6">
            <div className="overflow-x-auto">
              <table className="w-full table-auto text-white">
                <thead className="border-b border-gray-600 bg-transparent">
                  <tr>
                    <th className="w-16 p-2 text-left font-semibold text-gray-400 sm:p-4">
                      Rank
                    </th>
                    <th className="p-2 text-left font-semibold text-gray-400 sm:p-4">
                      Player
                    </th>
                    <th className="p-2 text-left font-semibold text-gray-400 sm:p-4">
                      WHR Rating
                    </th>
                    <th className="p-2 text-left font-semibold text-gray-400 sm:p-4">
                      Tier
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {playersToDisplay.map((player, index) => (
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
                      } transition-all duration-200 hover:bg-gray-600`}
                    >
                      <td className="p-2 sm:p-4">{player.rank}</td>
                      <td className="flex items-center p-2 sm:p-4">
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
                        <span className="text-sm sm:text-base">
                          {player.username || 'Empty'}
                        </span>
                      </td>
                      <td className="p-2 text-sm sm:p-4 sm:text-base">
                        {player.rating || '-'}
                      </td>
                      <td className="p-2 text-sm sm:p-4 sm:text-base">
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
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </BackgroundWrapper>
  );
}
