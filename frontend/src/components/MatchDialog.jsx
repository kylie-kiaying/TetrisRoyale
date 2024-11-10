import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { setPlayerAsWinner } from '@/utils/adminTournamentManagement';

export default function MatchDialog({ match, players, onClose }) {
  const player1 = players.find((player) => player.user_id === match.player1_id);
  const player2 = players.find((player) => player.user_id === match.player2_id);

  const [player1Status, setPlayer1Status] = useState(
    match.status === 'completed' && match.winner_id === player1.user_id ? 'Win' : 'Lose'
  );
  const [player2Status, setPlayer2Status] = useState(
    match.status === 'completed' && match.winner_id === player2.user_id ? 'Win' : 'Lose'
  );

  const toggleWinner = (winnerId) => {
    setPlayer1Status(winnerId === player1.user_id ? 'Win' : 'Lose');
    setPlayer2Status(winnerId === player2.user_id ? 'Win' : 'Lose');
  };

  return (
    <Card className="w-full items-center rounded-lg border-none shadow-lg backdrop-blur-md px-6 py-4 relative">
      <CardHeader className="flex justify-between w-full">
        <CardTitle>Match Details</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-5 gap-4 text-center">
        <div
          className="col-span-2 flex items-center justify-end space-x-2 cursor-pointer"
          onClick={() => toggleWinner(player1.user_id)}
        >
          <img
            src={player1Status === 'Win' ? '/trophyOn.png' : '/trophyOff.png'}
            alt="Trophy"
            className="w-6"
          />
          <span className="truncate">{player1.username}</span>
        </div>
        <div className="col-span-1 flex items-center justify-center">vs</div>
        <div
          className="col-span-2 flex items-center justify-start space-x-2 cursor-pointer"
          onClick={() => toggleWinner(player2.user_id)}
        >
          <span className="truncate">{player2.username}</span>
          <img
            src={player2Status === 'Win' ? '/trophyOn.png' : '/trophyOff.png'}
            alt="Trophy"
            className="w-6"
          />
        </div>
      </CardContent>
      <div className="flex justify-end mt-4 w-full">
        <Button
          variant="outline"
          className="border-none bg-purple-700 text-white transition-all duration-200 hover:bg-purple-600 mr-2"
          onClick={() => {
            setPlayerAsWinner(match.id, player1Status === 'Win' ? player1.user_id : player2.user_id);
            onClose();
          }}
        >
          {match.status === 'completed' ? 'Edit Result' : 'Submit Result'}
        </Button>
        <Button
            variant="outline"
            className="border-none bg-white text-purple-600 transition-all duration-200 hover:bg-purple-600"
            onClick={onClose}
          >
            Close
        </Button>
      </div>
    </Card>
  );
}
