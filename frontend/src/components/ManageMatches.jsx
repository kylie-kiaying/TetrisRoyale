'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Dialog, DialogPanel, DialogBackdrop } from '@headlessui/react';
import MatchDialog from './MatchDialog';
import { Bracket } from 'react-tournament-bracket';

const createPlaceholderMatch = (id) => {
    return {
        id: id.toString(),
        name: `Stage ${id}`,
        sides: {
            home: {
                team: {
                    id: 'TBD-home',
                    name: 'TBD',
                },
                score: {
                    score: 0
                },
            },
            visitor: {
                team: {
                    id: 'TBD-visitor',
                    name: 'TBD',
                },
                score: {
                    score: 0
                },
            },
        },
    }
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
        return players.find(p => p.user_id === playerId) || { username: 'TBD' };
    };

    // Function to generate all levels with placeholders, then populate with real data
    const buildBracketWithPlaceholders = () => {
        const totalLevels = Math.log2(players.length); // Number of levels in the bracket
        let currentNumStagesInLevel = players.length / 2; // Number of stages in the current level
        let stage = players.length - 1; // Current stage number
        const matchMap = {}; // Maps each match ID to its game object

        const stagesTracker = []
        for (let i = 0; i < currentNumStagesInLevel; i++) {
            stagesTracker.push(stage.toString());
            stage--;
        }

        // Generate placeholder matches and link stages
        while (stagesTracker.length > 1) {
            const currNumStages = stagesTracker.length;
            for (let i = 0; i < currNumStages; i+=2) {
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
            gameObject.scheduled = match.scheduled_at ? Number(new Date(match.scheduled_at)) : new Date();
            gameObject.sides.home.team.id = match.player1_id.toString();
            gameObject.sides.home.team.name = player1.username;
            if (match.status === 'completed' && match.winner_id === match.player1_id) {
                gameObject.sides.home.score.score = 1;
            }

            gameObject.sides.visitor.team.id = match.player2_id.toString();
            gameObject.sides.visitor.team.name = player2.username;
            if (match.status === 'completed' && match.winner_id === match.player2_id) {
                gameObject.sides.visitor.score.score = 1;
            }

            // Override placeholder with real match data
            matchMap[gameObject.id] = gameObject;
        });

        return matchMap["1"];
    };


    // Root game for the bracket visualization
    useEffect(() => {
        setRootGame(buildBracketWithPlaceholders());
    }, [matches, players]);

    return (
        <div className="flex flex-col items-center px-4">
        {/* Bracket Viewer at the Top */}
        <div className="w-full max-w-7xl mb-8">
            {rootGame && <Bracket game={rootGame} />}
        </div>

        {/* Match List Below */}
        <div className="w-full max-w-4xl">
            <Card>
            <CardHeader>
                <CardTitle>Match List</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-4 gap-4">
                {sortedMatches.map((match, i) => (
                <div
                    key={i}
                    onClick={() => openDialog(match)}
                    className="col-span-4 cursor-pointer border-b transition-colors hover:bg-muted/50 p-2"
                >
                    {renderMatchSummary(match, players)}
                </div>
                ))}
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
            <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                <DialogPanel className="relative transform overflow-hidden rounded-lg bg-[#1c1132] text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
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
      <span className={player1Status === 'Win' ? 'text-green-200' : 'text-red-200'}>
        {player1?.username} {player1Status && `(${player1Status})`}
      </span>
      {' vs '}
      <span className={player2Status === 'Win' ? 'text-green-200' : 'text-red-200'}>
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
