import BackgroundWrapper from '@/components/BackgroundWrapper';
import Navbar from '@/components/Navbar';
import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Podium from '@/components/Podium';
import Image from 'next/image';

export default function RankingsPage() {
  // Sample data for the top players with real names
  const topPlayers = [
    {
      rank: 1,
      username: 'TwitchNightz1x',
      rating: 2800,
      avatar: '/path-to-image',
    },
    { rank: 2, username: 'Penny', rating: 2750, avatar: '/path-to-image' },
    { rank: 3, username: 'NeedMimis', rating: 2700, avatar: '/path-to-image' },
    { rank: 4, username: 'Muted', rating: 2650, avatar: '/path-to-image' },
    { rank: 5, username: 'Snake', rating: 2600, avatar: '/path-to-image' },
    {
      rank: 6,
      username: 'PoppinsGuide',
      rating: 2550,
      avatar: '/path-to-image',
    },
    { rank: 7, username: '100TZander', rating: 2500, avatar: '/path-to-image' },
    { rank: 8, username: 'Paul', rating: 2450, avatar: '/path-to-image' },
    { rank: 9, username: 'Nabil', rating: 2400, avatar: '/path-to-image' },
    { rank: 10, username: 'PopSmoke', rating: 2350, avatar: '/path-to-image' },
  ];

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
                    <th className="p-2 text-left font-semibold text-gray-400 sm:p-4">
                      Rank
                    </th>
                    <th className="p-2 text-left font-semibold text-gray-400 sm:p-4">
                      Player
                    </th>
                    <th className="p-2 text-left font-semibold text-gray-400 sm:p-4">
                      ELO Rating
                    </th>
                    <th className="p-2 text-left font-semibold text-gray-400 sm:p-4">
                      Tier
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {playersToDisplay.map((player, index) => (
                   <tr key={index} className={`${
                    player.rank === 1
                      ? 'border-l-4 border-yellow-500 bg-gray-800 text-yellow-500 font-bold'
                      : player.rank === 2
                      ? 'border-l-4 border-gray-300 bg-gray-700 text-gray-300 font-bold'
                      : player.rank === 3
                      ? 'border-l-4 border-orange-500 bg-gray-800 text-orange-500 font-bold'
                      : index % 2 === 0
                      ? 'bg-gray-800 text-gray-300'
                      : 'bg-gray-700 text-gray-300'
                  } transition-all duration-200 hover:bg-gray-600`}>
                  
                      <td className="p-2 sm:p-4">
                        {player.rank}
                      </td>
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
                        {/* Placeholder for Tier Logic */}
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
