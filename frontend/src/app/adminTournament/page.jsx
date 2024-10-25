import Navbar from '@/components/Navbar.jsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const matches = [
  { player1_id: 1, player2_id: 2, status: 'Upcoming' },
  { player1_id: 3, player2_id: 4, status: 'Finished', winner_id: 3 },
];

const players = [
  { user_id: 1, username: 'P1' },
  { user_id: 2, username: 'P2' },
  { user_id: 3, username: 'P3' },
  { user_id: 4, username: 'P4' },
];

export default function adminPage() {
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
              <CardTitle>Tournament 1</CardTitle>
            </span>
          </CardHeader>
          <CardContent>
            <Card className="max-w-[1000px] items-center justify-center rounded-lg border-none bg-black/25 shadow-lg backdrop-blur-md">
              <CardHeader>
                <span className="absolute right-48 top-3">
                  <CardTitle>Match List</CardTitle>
                </span>
              </CardHeader>
              <img
                src="/tournamentPlaceholder.png"
                className="absolute left-40 top-2 max-w-48"
              />
              <CardContent className="grid grid-cols-4 gap-4">
                {matches.map(function (match, i) {
                  return (
                    <Link
                      href="/adminTournament/match"
                      className="col-span-2 col-start-3"
                      key={i}
                    >
                      <div className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        {match.status === 'Finished' ? (
                          match.player1_id === match.winner_id ? (
                            <span className="text-green-200">
                              {
                                players.find(
                                  (player) =>
                                    player.user_id === match.player1_id
                                ).username
                              }{' '}
                              (Win)
                            </span>
                          ) : (
                            <span className="text-red-200">
                              {
                                players.find(
                                  (player) =>
                                    player.user_id === match.player1_id
                                ).username
                              }{' '}
                              (Lose)
                            </span>
                          )
                        ) : (
                          <span>
                            {
                              players.find(
                                (player) => player.user_id === match.player1_id
                              ).username
                            }
                          </span>
                        )}
                        {' vs '}
                        {match.status === 'Finished' ? (
                          match.player2_id === match.winner_id ? (
                            <span className="text-green-200">
                              {
                                players.find(
                                  (player) =>
                                    player.user_id === match.player2_id
                                ).username
                              }{' '}
                              (Win)
                            </span>
                          ) : (
                            <span className="text-red-200">
                              {
                                players.find(
                                  (player) =>
                                    player.user_id === match.player2_id
                                ).username
                              }{' '}
                              (Lose)
                            </span>
                          )
                        ) : (
                          <span>
                            {
                              players.find(
                                (player) => player.user_id === match.player2_id
                              ).username
                            }
                          </span>
                        )}

                        <span className="float-right">{match.status}</span>
                      </div>
                    </Link>
                  );
                })}
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
