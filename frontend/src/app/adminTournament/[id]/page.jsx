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
} from '@/utils/adminTournamentManagement';
import { useEffect, useState } from 'react';
import BackgroundWrapper from '@/components/BackgroundWrapper';

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
  const [canBeStarted, setCanBeStarted] = useState(false);
  const [registrants, setRegistrants] = useState([]);
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [matchesLoading, setMatchesLoading] = useState(true);

  useEffect(() => {
    getTournamentData(id).then((data) => {
      if (data) {
        setTournamentData(data);
        setTournamentPlayable(data.status === 'ongoing');
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
  }, [id]);

  useEffect(() => {
    if (tournamentPlayable) {
      Promise.all([
        fetchAdminTournamentPlayableMatches(id),
        fetchPlayersFromRegistrants(registrants),
      ])
        .then(([fetchedMatches, fetchedPlayers]) => {
          setMatches(fetchedMatches);
          setPlayers(fetchedPlayers);
          setMatchesLoading(false);
        })
        .catch(() => {
          setMatchesLoading(false);
        });
    }
  }, [id, tournamentPlayable, registrants]);

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
          <h1 className="mb-6 text-center text-3xl font-bold text-pink-200">
            {tournamentData?.tournament_name || 'Tournament Title'}
          </h1>
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
              content={tournamentData?.recommendedRating || 'None'}
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
                  <ManageMatches matches={matches} players={players} />
                )
              ) : canBeStarted ? (
                <div className="space-y-2 text-center">
                  <CardDescription className="font-medium text-green-400">
                    Tournament is ready to start.
                  </CardDescription>
                  <CardDescription className="text-sm text-gray-400">
                    Number of registrants: {registrants.length}
                  </CardDescription>
                </div>
              ) : (
                <div className="space-y-2 text-center">
                  <CardDescription className="font-medium text-yellow-500">
                    Tournament cannot be started with the current number of
                    players or the current date.
                  </CardDescription>
                  <CardDescription className="text-sm text-gray-400">
                    Number of registrants: {registrants.length}
                  </CardDescription>
                  <CardDescription className="text-sm text-gray-400">
                    Supposed Start Date:{' '}
                    {tournamentData?.tournament_start || 'N/A'}
                  </CardDescription>
                  <CardDescription className="text-sm text-gray-400">
                    Current Date: {new Date().toLocaleDateString()}
                  </CardDescription>
                </div>
              )}
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
