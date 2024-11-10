'use client';

import { Button } from '@/components/ui/button';
import ManageMatches from '@/components/ManageMatches';
import Navbar from '@/components/Navbar';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { fetchAdminTournamentPlayableMatches, fetchPlayersFromRegistrants, getTournamentData, startTournament } from '@/utils/adminTournamentManagement';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';


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
  const [tournamentPlayable, setTournamentPlayable] = useState(false);
  const [canBeStarted, setCanBeStarted] = useState(false);
  const [registrants, setRegistrants] = useState([]);

  useEffect(() => {
    getTournamentData(id).then((data) => {
      if (data) {
        setTournamentData(data);
        // tournament has already started
        setTournamentPlayable(data.status == 'ongoing');
        setRegistrants(data.registrants);

        // tournament can be started if it is upcoming and the number of registrants is a power of 2, and today's date is after the start date
        if (data.status == 'upcoming' && isPowerOfTwo(data.registrants.length) && isAfterStartDate(data.tournament_start)) {
          setCanBeStarted(true);
        }
      }
    });
  }, [id]);

  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);  // New loading state
  // const players = registrants.map((registrant) => ({
  //   user_id: registrant.user_id,
  //   username: registrant.username,
  // }));

  useEffect(() => {
    if (tournamentPlayable) {
      // Fetch both matches and players and wait until both are resolved to set loading to false
      Promise.all([
        fetchAdminTournamentPlayableMatches(id),
        fetchPlayersFromRegistrants(registrants)
      ]).then(([fetchedMatches, fetchedPlayers]) => {
        setMatches(fetchedMatches);
        setPlayers(fetchedPlayers);
        setLoading(false); 
      }).catch(() => {
        setLoading(false);
      });
    }
  }, [id, tournamentPlayable, registrants]);
  
  return (
    <div
      className="flex min-h-screen flex-col items-center bg-cover bg-fixed bg-center bg-no-repeat px-4"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(11, 5, 29, 0.95), rgba(28, 17, 50, 0.95)), url('/bgpic.png')",
      }}
    >
      <div className="w-full">
        <Navbar />
      </div>
      <div className="flex w-full flex-grow items-start justify-center pb-10 pt-14">
        <Card className="w-[1000px] max-w-screen-xl items-center rounded-lg border-0 shadow-lg backdrop-blur-md">
          <CardHeader>
            <span>
              <CardTitle>Tournament {id}</CardTitle>
            </span>
            {
              canBeStarted &&
              <span className="absolute right-4">
                <Button
                    variant="outline"
                    className="border-none bg-purple-700 text-white transition-all duration-200 hover:bg-purple-600"
                    onClick={() => startTournament(tournamentData)}
                >
                  Start Tournament
                </Button>
              </span>
            }  
          </CardHeader>
          <CardContent>
            <Card className="max-w-[1000px] items-center justify-center rounded-lg border-none bg-black/25 shadow-lg backdrop-blur-md">
              {
                tournamentPlayable ? 
                (
                  loading ? (
                    <div className="text-center">
                      <CardDescription>Loading matches and players...</CardDescription>
                    </div>
                  ) : (
                    <ManageMatches matches={matches} players={players} />
                  )
                ) : (
                  canBeStarted ?
                    (
                      <div className="text-center">
                        <CardDescription>
                          Tournament is ready to start.
                        </CardDescription>
                        <CardDescription>
                          Number of registrants: {registrants.length}
                        </CardDescription>
                      </div>
                    ) : (
                      <div className="text-center">
                        <CardDescription>
                          Tournament cannot be started with current number of players or current date.
                        </CardDescription>
                        <CardDescription>
                          Number of registrants: {registrants.length}
                        </CardDescription>
                        <CardDescription>
                          Supposed Start Date: {tournamentData ? tournamentData.tournament_start : "N/A"}
                        </CardDescription>
                        <CardDescription>
                          Current Date: {new Date().toLocaleDateString()}
                        </CardDescription>
                      </div>
                    )
                )
            }
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

