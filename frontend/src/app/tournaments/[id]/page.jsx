'use client';

import BackgroundWrapper from '@/components/BackgroundWrapper';
import Navbar from '@/components/Navbar';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { FaGamepad, FaCalendarAlt, FaUser, FaStar } from 'react-icons/fa';
import { getPlayerTier } from '@/utils/getPlayerTier';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import { FaTrophy } from 'react-icons/fa'

export default function TournamentDetails() {
  const router = useRouter();
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [tournamentPlayers, setTournamentPlayers] = useState([]);
  const username = useAuthStore((state) => state.username);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    if (id) {
      async function fetchTournamentDetails() {
        try {
          const response = await fetch(
            `http://localhost:8003/tournaments/${id}`
          );
          const data = await response.json();
          setTournament(data);

          const playerPromises = data.registrants.map(async (registrant) => {
            const playerResponse = await fetch(
              `http://localhost:8002/players/${registrant.player_id}`
            );
            const playerData = await playerResponse.json();
            return {
              player_id: registrant.player_id,
              username: playerData.username,
              rating: playerData.rating,
            };
          });

          const players = await Promise.all(playerPromises);
          setTournamentPlayers(players);

          const tournamentMatchesResponse = await fetch(
            `http://localhost:8004/matchmaking/tournaments/${id}/matches`
          );

            const tournamentMatchesData = await tournamentMatchesResponse.json();
            setMatches(tournamentMatchesData);
        } catch (error) {
          console.error('Error fetching tournament details:', error);
        }
      }
      fetchTournamentDetails();
    }
  }, [id]);

  const isRegistered = tournament?.registrants.some(
    (registrant) => registrant.username === username
  );

  if (!tournament) return <div>Loading...</div>;

  const getPlayerUsername = (playerId) => {
    const player = tournamentPlayers.find((p) => p.player_id === playerId);
    return player ? player.username : 'Unknown Player';
  };

return (
    <BackgroundWrapper>
        <Navbar />
        <div className="container mx-auto mt-10 flex flex-col space-y-8 px-4 md:flex-row md:space-x-8 md:space-y-0">

            {/* Upcoming/Completed Matches Card */}
            <Card className="w-full flex-shrink-0 space-y-4 rounded-xl border-none bg-gradient-to-br from-[#3b1a56] to-[#1c1132] p-4 text-center text-white shadow-lg md:w-1/4">
                <CardHeader className="mb-4 text-gray-200">
                    <h2 className="text-xl font-bold tracking-wide text-purple-200 md:text-2xl">
                        Matches
                    </h2>
                    <p className="text-sm opacity-75">Upcoming or Completed Matches</p>
                </CardHeader>
                <CardContent className="space-y-2">
                    {/* <p className="text-gray-300">No matches available at this time.</p> */}
                    <ul className="space-y-1">
                        {matches.map((match, index) => (
                            <li
                            key={match.id}
                            className={`flex items-center justify-between rounded-lg px-4 py-2 transition-all duration-200 ${
                                index % 2 === 0 ? 'bg-[#332054]' : 'bg-[#2a1a46]'
                            } shadow-md hover:scale-105 hover:bg-purple-700`}
                            >
                            <div className="flex w-full items-center">
                                {/* Trophy Icon and Player 1 */}
                                <div className="flex items-center space-x-1 flex-1 text-left">
                                <FaTrophy className="text-yellow-400" size={14} /> {/* Trophy Icon */}
                                <span className="text-sm font-semibold sm:text-xs md:text-sm lg:text-base">
                                    {getPlayerUsername(match.player1_id)}
                                </span>
                                </div>
                                
                                {/* "vs" in the center */}
                                <span className="mx-2 text-sm font-semibold text-gray-300 sm:text-xs md:text-sm lg:text-base">
                                vs
                                </span>
                                
                                {/* Player 2 and Trophy Icon */}
                                <div className="flex items-center space-x-1 flex-1 text-right justify-end">
                                <span className="text-sm font-semibold sm:text-xs md:text-sm lg:text-base">
                                    {getPlayerUsername(match.player2_id)}
                                </span>
                                <FaTrophy className="text-yellow-400" size={14} /> {/* Trophy Icon */}
                                </div>
                            </div>
                            </li>
                        ))}
                        </ul>
                </CardContent>
            </Card>

            {/* Tournament Details Section */}
            <div className="flex-1 rounded-lg bg-gradient-to-br from-[#45234d] to-[#23132c] p-6 shadow-md md:w-1/2">
                <h1 className="mb-6 text-center text-4xl font-bold text-pink-100">
                    {tournament.tournament_name}
                </h1>
                <div className="space-y-4 text-gray-300">
                    {/* Tournament details items */}
                    <DetailItem
                        icon={<FaUser />}
                        label="Organizer"
                        content={tournament.organizer}
                    />
                    <DetailItem
                        icon={<FaCalendarAlt />}
                        label="Start Date"
                        content={tournament.tournament_start}
                    />
                    <DetailItem
                        icon={<FaCalendarAlt />}
                        label="End Date"
                        content={tournament.tournament_end}
                    />
                    <DetailItem
                        icon={<FaStar />}
                        label="Recommended Rating"
                        content={tournament.recommendedRating || 'None'}
                    />
                    <DetailItem
                        icon={<FaGamepad />}
                        label="Remarks"
                        content={tournament.remarks}
                    />
                </div>

                {/* Register Button */}
                <div className="mt-6 flex justify-end">
                    <button
                        className={`rounded-full px-6 py-2 font-semibold transition-all duration-200 ${isRegistered ? 'cursor-not-allowed bg-gray-600 text-gray-400' : 'transform bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-lg hover:scale-105 hover:from-purple-600 hover:to-purple-800'}`}
                        disabled={isRegistered}
                        onClick={() => {
                            if (!isRegistered) {
                                console.log('User registered for tournament');
                            }
                        }}
                    >
                        {isRegistered ? 'Registered' : 'Register'}
                    </button>
                </div>
            </div>

            {/* Players List Section */}
            <Card className="mx-auto w-full max-w-xs flex-shrink-0 space-y-4 rounded-xl border-none bg-gradient-to-br from-[#2a1c48] to-[#1b112e] p-4 shadow-lg sm:max-w-full md:mx-0 md:w-1/4 md:p-4">
            <CardHeader className="mb-4 flex items-center justify-between pb-2 text-gray-200">
                <h2 className="text-lg font-bold tracking-wide text-blue-200 md:text-2xl">
                Player List
                </h2>
                <span className="text-xs opacity-75 md:text-sm">
                {tournamentPlayers.length} Players
                </span>
            </CardHeader>
            <CardContent className="space-y-2">
                <ul className="space-y-1">
                {tournamentPlayers.map((player, index) => {
                    const { tier, color } = getPlayerTier(player.rating);
                    return (
                    <li
                        key={player.player_id}
                        className={`flex items-center justify-between rounded-lg px-2 py-2 transition-all duration-200 ${
                        index % 2 === 0 ? 'bg-[#332054]' : 'bg-[#2a1a46]'
                        } shadow-md hover:scale-105 hover:bg-purple-700`}
                    >
                        <div className="flex items-center space-x-2 truncate">
                        <span className="truncate text-sm font-semibold sm:text-xs md:text-sm lg:text-base">
                            {player.username}
                        </span>
                        <Badge
                            className={`rounded-md px-2 py-1 text-xs sm:text-[10px] md:text-xs lg:text-sm ${color}`}
                        >
                            {tier}
                        </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                        <FaGamepad className="text-purple-400" size={14} />
                        <span className="text-xs font-semibold text-gray-300 sm:text-[10px] md:text-sm lg:text-base">
                            {player.rating}
                        </span>
                        </div>
                    </li>
                    );
                })}
                </ul>
            </CardContent>
            </Card>
        </div>
    </BackgroundWrapper>
);
}

function DetailItem({ icon, label, content }) {
  return (
    <div className="flex items-start space-x-3">
      <div className="mt-1 text-purple-400">{icon}</div>
      <div>
        <p className="text-lg font-semibold text-white">{label}</p>
        <p className="text-gray-300">{content || 'None'}</p>
      </div>
    </div>
  );
}
