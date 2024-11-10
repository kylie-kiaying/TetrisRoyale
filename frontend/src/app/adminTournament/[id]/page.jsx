'use client';

import { formatDateMedium } from '@/utils/dateUtils';
import { Button } from '@/components/ui/button';
import ManageMatches from '@/components/ManageMatches';
import Navbar from '@/components/Navbar';
import { useParams, useRouter } from 'next/navigation';
import {
  FaGamepad,
  FaCalendarAlt,
  FaUser,
  FaStar,
  FaTrophy,
} from 'react-icons/fa';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  fetchAdminTournamentPlayableMatches,
  fetchPlayersFromRegistrants,
  getTournamentData,
  startTournament,
  endTournament
} from '@/utils/adminTournamentManagement';
import { useEffect, useState } from 'react';
import BackgroundWrapper from '@/components/BackgroundWrapper';
import { set } from 'date-fns';

const isPowerOfTwo = (num) => {
  if (num < 1) return false;
  while (num % 2 === 0) {
    num /= 2;
  }
  return num === 1;
};

const isAfterStartDate = (startDate) => {
  const today = new Date();
  const start = new Date(startDate);
  return today >= start;
};

export default function TournamentDetails() {
  const router = useRouter();
  const { id } = useParams();

  const [tournamentData, setTournamentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tournamentPlayable, setTournamentPlayable] = useState(false);
  const [tournamentEnded, setTournamentEnded] = useState(false);
  const [winner, setWinner] = useState(null);
  const [canBeStarted, setCanBeStarted] = useState(false);
  const [registrants, setRegistrants] = useState([]);
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [refreshMatches, setRefreshMatches] = useState(false);
  const [canEndTournament, setCanEndTournament] = useState(false);

  useEffect(() => {
    getTournamentData(id).then((data) => {
      if (data) {
        setTournamentData(data);
        setTournamentPlayable(data.status === 'ongoing');
        setTournamentEnded(data.status === 'completed');
        setRegistrants(data.registrants);

        if (
          data.status === 'upcoming' &&
          isPowerOfTwo(data.registrants.length) &&
          isAfterStartDate(data.tournament_start)
        ) {
          setCanBeStarted(true);
        }
      }
      setLoading(false);
    });
  }, [id, refreshMatches]);

  useEffect(() => {
    if (tournamentPlayable || tournamentEnded) {
      Promise.all([
        fetchAdminTournamentPlayableMatches(id),
        fetchPlayersFromRegistrants(registrants),
      ])
        .then(([fetchedMatches, fetchedPlayers]) => {
          setMatches(fetchedMatches);
          setPlayers(fetchedPlayers);
          setMatchesLoading(false);
          if (tournamentPlayable) {
            let allCompleted = true;
            for (const match of fetchedMatches) {
              if (match.status != 'completed') {
                allCompleted = false;
                break;
              }
            }
            setCanEndTournament(allCompleted);
          } else {
            let winnerId = null;
            for (const match of fetchedMatches) {
              if (match.stage === 1) {
                winnerId = match.winner_id;
                break;
              }
            }
            if (winnerId) {
              const winner = fetchedPlayers.find(
                (player) => player.user_id === winnerId
              );
              setWinner(winner);
            }
          }
        })
        .catch(() => {
          setMatchesLoading(false);
        });
    }
  }, [id, tournamentPlayable, registrants, refreshMatches]);

  if (loading) {
    return (
      <BackgroundWrapper>
        <Navbar />
        <div className="flex h-screen items-center justify-center">
          <p className="text-lg text-gray-300">Loading tournament details...</p>
        </div>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      <Navbar />
      <div className="flex w-full flex-grow flex-col items-center space-y-8 pb-10 pt-14">
        {/* Tournament Info Card */}
        <div className="w-full max-w-[800px] rounded-xl bg-gradient-to-br from-[#45234d] to-[#23132c] p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="mb-6 text-center text-3xl font-bold">
              <span className="text-pink-200">{tournamentData?.tournament_name || 'Tournament Title'}</span> <span className="text-gray-300">#{tournamentData?.tournament_id}</span>
            </h1>
            {canBeStarted && <Button
              variant="outline"
              className="rounded-lg border-none bg-green-700 px-4 py-2 font-semibold text-white transition-all duration-200 hover:bg-purple-600"
              onClick={async () => {
                  await startTournament(tournamentData);
                  setRefreshMatches((refreshMatches) => !refreshMatches);
                  setCanBeStarted(false);
                }
              }
            >
              Start Tournament
            </Button>}
            {canEndTournament && 
            <Button
              variant="outline"
              className="rounded-lg border-none bg-yellow-700 px-4 py-2 font-semibold text-white transition-all duration-200 hover:bg-purple-600"
              onClick={async () => {
                  await endTournament(tournamentData);
                  setRefreshMatches((refreshMatches) => !refreshMatches);
                }
              }
            >
              End Tournament
            </Button>}
          </div>
          <div className="space-y-4 text-gray-300">
            <DetailItem
              icon={<FaUser />}
              label="Organizer"
              content={tournamentData?.organiser || 'N/A'}
            />
            <DetailItem
              icon={<FaCalendarAlt />}
              label="Start Date"
              content={
                formatDateMedium(tournamentData?.tournament_start) || 'N/A'
              }
            />
            <DetailItem
              icon={<FaCalendarAlt />}
              label="End Date"
              content={
                formatDateMedium(tournamentData?.tournament_end) || 'N/A'
              }
            />
            <DetailItem
              icon={<FaStar />}
              label="Recommended Rating"
              content={tournamentData?.recommended_rating || 'None'}
            />
            <DetailItem
              icon={<FaGamepad />}
              label="Remarks"
              content={
                tournamentData?.remarks && tournamentData.remarks !== 'string'
                  ? tournamentData.remarks
                  : 'No remarks'
              }
            />
          </div>
        </div>

        {/* Main Tournament Content */}
        <div className="w-full max-w-[1000px]">
          <Card className="w-full rounded-xl border-0 bg-[#1c1132] p-8 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-semibold text-purple-200">
                Tournament Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tournamentPlayable ? (
                loading ? (
                  <div className="text-center">
                    <CardDescription className="text-gray-400">
                      Loading matches and players...
                    </CardDescription>
                  </div>
                ) : (
                  <ManageMatches
                    matches={matches}
                    players={players}
                    onMatchUpdated={() => setRefreshMatches((prev) => !prev)} // Toggling to trigger re-fetch
                  />
                )
              ) : canBeStarted ? (
                <div className="space-y-2 text-center">
                  <CardDescription className="text-lg text-green-400">
                    Tournament is ready to start.
                  </CardDescription>
                  <CardDescription className="text-lg text-gray-400">
                    Number of registrants: {registrants.length}
                  </CardDescription>
                </div>
              ) : (
                tournamentEnded ? (
                  <div className="space-y-2 text-center">
                    <CardDescription className="text-lg text-green-400">
                      Tournament has ended!
                    </CardDescription>
                    <CardDescription className="text-lg text-white-400">
                      Winner: {winner? <div>{winner.username} 🎉</div>  : 'N/A'}
                    </CardDescription>
                  </div>
                ) : (
                  <div className="space-y-2 text-center">
                    <CardDescription className="text-lg text-yellow-500">
                      Tournament cannot be started with the current number of
                      players or the current date.
                    </CardDescription>
                    <CardDescription className="text-lg text-gray-400">
                      Number of registrants: {registrants.length}
                    </CardDescription>
                    <CardDescription className="text-lg text-gray-400">
                      Supposed Start Date:{' '}
                      {formatDateMedium(tournamentData?.tournament_start) ||
                        'N/A'}
                    </CardDescription>
                    <CardDescription className="text-lg text-gray-400">
                      Current Date:{' '}
                      {formatDateMedium(new Date().toLocaleDateString())}
                    </CardDescription>
                  </div>
              ))}
            </CardContent>
          </Card>
        </div>
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
