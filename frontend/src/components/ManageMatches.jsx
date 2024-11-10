'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogPanel, DialogBackdrop } from '@headlessui/react';
import MatchDialog from './MatchDialog';
import { Bracket } from 'react-tournament-bracket';
import { FaTrophy } from 'react-icons/fa';

const createPlaceholderMatch = (id) => {
  return {
    id: id.toString(),
    // name: `Stage ${id}`,
    sides: {
      home: {
        team: {
          id: 'TBD-home',
          name: 'TBD',
        },
        score: {
          score: 0,
        },
      },
      visitor: {
        team: {
          id: 'TBD-visitor',
          name: 'TBD',
        },
        score: {
          score: 0,
        },
      },
    },
  };
};

export default function ManageMatches({ matches, players }) {
  const [openMatch, setOpenMatch] = useState(null); // Stores the match to open in the dialog
  const [rootGame, setRootGame] = useState(null);

  const sortedMatches = [...matches].sort((a, b) => {
    if (a.status === 'pending' && b.status === 'completed') return -1;
    if (a.status === 'completed' && b.status === 'pending') return 1;
    return 0;
  });

  const openDialog = (match) => {
    setOpenMatch(match);
  };

  const closeDialog = () => {
    setOpenMatch(null);
  };

  // Helper function to get player details or placeholder
  const getPlayer = (playerId) => {
    return players.find((p) => p.user_id === playerId) || { username: 'TBD' };
  };

  // Function to generate all levels with placeholders, then populate with real data
  const buildBracketWithPlaceholders = () => {
    const totalLevels = Math.log2(players.length); // Number of levels in the bracket
    let currentNumStagesInLevel = players.length / 2; // Number of stages in the current level
    let stage = players.length - 1; // Current stage number
    const matchMap = {}; // Maps each match ID to its game object

    const stagesTracker = [];
    for (let i = 0; i < currentNumStagesInLevel; i++) {
      stagesTracker.push(stage.toString());
      stage--;
    }

    // Generate placeholder matches and link stages
    while (stagesTracker.length > 1) {
      const currNumStages = stagesTracker.length;
      for (let i = 0; i < currNumStages; i += 2) {
        const stageId1 = stagesTracker.shift();
        const stageId2 = stagesTracker.shift();

        let placeholderMatch1 = null;
        if (!matchMap[stageId1]) {
          placeholderMatch1 = createPlaceholderMatch(stageId1);
          matchMap[stageId1] = placeholderMatch1;
        } else {
          placeholderMatch1 = matchMap[stageId1];
        }
        let placeholderMatch2 = null;
        if (!matchMap[stageId2]) {
          placeholderMatch2 = createPlaceholderMatch(stageId2);
          matchMap[stageId2] = placeholderMatch2;
        } else {
          placeholderMatch2 = matchMap[stageId2];
        }

        const nextStageId = Math.floor(stageId1 / 2);
        const placeholderMatch3 = createPlaceholderMatch(nextStageId);
        placeholderMatch3.sides.home.seed = {
          displayName: `top stage`,
          rank: 1,
          sourceGame: placeholderMatch2,
          sourcePool: {},
        };
        placeholderMatch3.sides.visitor.seed = {
          displayName: `bottom stage`,
          rank: 1,
          sourceGame: placeholderMatch1,
          sourcePool: {},
        };
        matchMap[nextStageId] = placeholderMatch3;

        stagesTracker.push(nextStageId.toString());
      }
    }
    // Populate placeholder matches with real match data
    matches.forEach((match) => {
      const player1 = getPlayer(match.player1_id);
      const player2 = getPlayer(match.player2_id);
      const matchStage = match.stage.toString();
      const gameObject = matchMap[matchStage];

      gameObject.id = match.id.toString();
      gameObject.scheduled = match.scheduled_at
        ? Number(new Date(match.scheduled_at))
        : new Date();
      gameObject.sides.home.team.id = match.player1_id.toString();
      gameObject.sides.home.team.name = player1.username;
      if (
        match.status === 'completed' &&
        match.winner_id === match.player1_id
      ) {
        gameObject.sides.home.score.score = 1;
      }

      gameObject.sides.visitor.team.id = match.player2_id.toString();
      gameObject.sides.visitor.team.name = player2.username;
      if (
        match.status === 'completed' &&
        match.winner_id === match.player2_id
      ) {
        gameObject.sides.visitor.score.score = 1;
      }

      // Override placeholder with real match data
      matchMap[gameObject.id] = gameObject;
    });

    return matchMap['1'];
  };

  // Root game for the bracket visualization
  useEffect(() => {
    setRootGame(buildBracketWithPlaceholders());
  }, [matches, players]);

  return (
    <div className="flex flex-col items-center px-4">
      {/* Bracket Viewer at the Top */}
      <Card className="rounded-3xl border-none bg-gradient-to-br from-[#1c1132] to-[#2a1b4b] p-6 shadow-2xl backdrop-blur-lg">
        <CardHeader />
        <CardContent className="border-none">
          <div className="mb-8 w-full max-w-7xl">
            {rootGame && <Bracket game={rootGame} />}
          </div>
        </CardContent>
      </Card>

      {/* Match List Below */}
      <div className="mt-8 w-full max-w-4xl">
        <Card className="rounded-3xl border-none bg-gradient-to-br from-[#1c1132] to-[#2a1b4b] p-6 shadow-2xl backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-semibold tracking-wide text-white">
              Match List
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[400px] space-y-2 overflow-y-auto">
            <ul className="space-y-1">
              {sortedMatches.map((match, index) => {
                const isCompleted = match.status === 'completed';

                // Retrieve player usernames using getPlayer function
                const player1Username = getPlayer(match.player1_id).username;
                const player2Username =
                  getPlayer(match.player2_id)?.username || 'TBD';

                return (
                  <li
                    key={match.id}
                    onClick={() => openDialog(match)}
                    className={`flex cursor-pointer items-center rounded-lg px-3 py-2 transition-all duration-200 ${
                      index % 2 === 0 ? 'bg-[#332054]' : 'bg-[#2a1a46]'
                    } ${isCompleted ? 'border-l-4 border-green-500' : ''} shadow-md hover:bg-purple-700`}
                    style={{ opacity: isCompleted ? 1 : 0.7 }}
                  >
                    {/* Player 1 Section */}
                    <div className="flex w-1/3 items-center space-x-2">
                      <FaTrophy
                        className={
                          match.winner_id === match.player1_id
                            ? 'text-yellow-400'
                            : 'text-gray-500'
                        }
                        size={14}
                      />
                      <span className="truncate text-xs font-semibold text-gray-200 sm:text-sm md:text-base lg:text-lg">
                        {player1Username}
                      </span>
                    </div>

                    {/* "vs" Section */}
                    <div className="w-1/6 text-center">
                      <span className="text-xs font-semibold text-gray-300 sm:text-sm md:text-base lg:text-lg">
                        vs
                      </span>
                    </div>

                    {/* Player 2 Section */}
                    <div className="flex w-1/3 items-center justify-end space-x-2">
                      <span className="truncate text-xs font-semibold text-gray-200 sm:text-sm md:text-base lg:text-lg">
                        {player2Username}
                      </span>
                      <FaTrophy
                        className={
                          match.winner_id === match.player2_id
                            ? 'text-yellow-400'
                            : 'text-gray-500'
                        }
                        size={14}
                      />
                    </div>

                    {/* Status Section */}
                    <div className="w-1/6 text-right">
                      <span
                        className={`text-xs font-semibold sm:text-sm md:text-base ${isCompleted ? 'text-green-400' : 'text-yellow-400'}`}
                      >
                        {isCompleted ? 'completed' : 'pending'}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Match Dialog */}
      {openMatch && (
        <Dialog
          open={!!openMatch}
          onClose={closeDialog}
          className="relative z-10 rounded-lg"
        >
          {/* Dialog Backdrop */}
          <DialogBackdrop className="fixed inset-0 bg-gradient-to-br from-[#1c1132]/70 to-[#2a1b4b]/70 backdrop-blur-md transition-opacity duration-300 ease-out" />

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              {/* Dialog Panel */}
              <DialogPanel className="relative transform overflow-hidden rounded-2xl bg-gradient-to-br from-[#1c1132] to-[#2a1b4b] text-white shadow-2xl backdrop-blur-lg transition-transform duration-300 ease-in-out sm:my-8 sm:w-full sm:max-w-lg">
                <div
                  className="absolute right-0 top-0 cursor-pointer p-3 text-gray-400 hover:text-white"
                  onClick={closeDialog}
                >
                  <span className="material-icons">close</span>
                </div>
                <MatchDialog
                  match={openMatch}
                  players={players}
                  onClose={closeDialog}
                />
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}

function renderMatchSummary(match, players) {
  const player1 = players.find((player) => player.user_id === match.player1_id);
  const player2 = players.find((player) => player.user_id === match.player2_id);

  const player1Status =
    match.status === 'completed' && match.winner_id === match.player1_id
      ? 'Win'
      : match.status === 'completed'
        ? 'Lose'
        : '';

  const player2Status =
    match.status === 'completed' && match.winner_id === match.player2_id
      ? 'Win'
      : match.status === 'completed'
        ? 'Lose'
        : '';

  return (
    <>
      <span
        className={player1Status === 'Win' ? 'text-green-200' : 'text-red-200'}
      >
        {player1?.username} {player1Status && `(${player1Status})`}
      </span>
      {' vs '}
      <span
        className={player2Status === 'Win' ? 'text-green-200' : 'text-red-200'}
      >
        {player2?.username} {player2Status && `(${player2Status})`}
      </span>
      <span className="float-right">
        {match.status === 'completed' ? (
          <span className="text-green-300">completed</span>
        ) : (
          <span className="text-yellow-200">pending</span>
        )}
      </span>
    </>
  );
}
