import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { setPlayerAsWinner } from '@/utils/adminTournamentManagement';
import { FaTrophy } from 'react-icons/fa';

export default function MatchDialog({ match, players, onClose }) {
  const player1 = players.find((player) => player.user_id === match.player1_id);
  const player2 = players.find((player) => player.user_id === match.player2_id);

  const [player1Status, setPlayer1Status] = useState(
    match.status === 'completed' && match.winner_id === player1.user_id
      ? 'Win'
      : 'Lose'
  );
  const [player2Status, setPlayer2Status] = useState(
    match.status === 'completed' && match.winner_id === player2.user_id
      ? 'Win'
      : 'Lose'
  );

  const toggleWinner = (winnerId) => {
    setPlayer1Status(winnerId === player1.user_id ? 'Win' : 'Lose');
    setPlayer2Status(winnerId === player2.user_id ? 'Win' : 'Lose');
  };

  return (
    <Card className="relative flex w-full max-w-lg flex-col items-center rounded-2xl border-none bg-gradient-to-b from-[#141027] to-[#1f1835] px-8 py-6 text-white shadow-2xl">
      <CardHeader className="mb-4 flex w-full justify-center">
        <CardTitle className="text-2xl font-bold text-gray-100">
          Submit/Edit Match Details
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center text-center">
        {/* Centered Player 1 vs Player 2 Section */}
        <div className="mb-6 grid grid-cols-5 items-center gap-4">
          {/* Player 1 Section */}
          <div
            className="col-span-2 flex cursor-pointer items-center justify-end space-x-2"
            onClick={() => toggleWinner(player1.user_id)}
          >
            <FaTrophy
              className={
                player1Status === 'Win' ? 'text-yellow-400' : 'text-gray-500'
              }
              size={20}
            />
            <span className="truncate text-lg font-semibold text-gray-200">
              {player1.username}
            </span>
          </div>

          {/* "vs" Divider */}
          <div className="col-span-1 flex items-center justify-center">
            <span className="text-lg font-semibold text-gray-300">vs</span>
          </div>

          {/* Player 2 Section */}
          <div
            className="col-span-2 flex cursor-pointer items-center justify-start space-x-2"
            onClick={() => toggleWinner(player2.user_id)}
          >
            <span className="truncate text-lg font-semibold text-gray-200">
              {player2.username}
            </span>
            <FaTrophy
              className={
                player2Status === 'Win' ? 'text-yellow-400' : 'text-gray-500'
              }
              size={20}
            />
          </div>
        </div>
      </CardContent>
      {/* Button Section aligned to the right bottom */}
      <div className="mt-auto flex w-full justify-end space-x-3 px-2">
        <Button
          variant="outline"
          className="rounded-lg border-none bg-purple-700 px-4 py-2 font-semibold text-white transition-all duration-200 hover:bg-purple-600"
          onClick={() => {
            setPlayerAsWinner(
              match.id,
              player1Status === 'Win' ? player1.user_id : player2.user_id
            );
            onClose();
          }}
        >
          {match.status === 'completed' ? 'Edit Result' : 'Submit Result'}
        </Button>
        <Button
          variant="outline"
          className="rounded-lg border-none bg-gray-300 px-4 py-2 font-semibold text-purple-700 transition-all duration-200 hover:bg-gray-400 hover:text-white"
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    </Card>
  );
}
