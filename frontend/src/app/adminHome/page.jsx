import Navbar from '@/components/Navbar.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const tournaments = [
  {
    tournament_id: '1',
    tournament_name: 'Tetris Championship',
    tournament_start: 'June 1',
    tournament_end: 'June 10',
    status: 'Ongoing',
  },
  {
    tournament_id: '2',
    tournament_name: 'Spring Showdown',
    tournament_start: 'October 5',
    tournament_end: 'October 15',
    status: 'Upcoming',
  },
  {
    tournament_id: '3',
    tournament_name: 'Championship Series 1',
    tournament_start: 'May 25',
    tournament_end: 'May 31',
    status: 'Finished',
  },
];

export default function AdminPage() {
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
        <Card className="w-full max-w-4xl rounded-lg border-none bg-[#1c1132] bg-opacity-90 shadow-lg backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="align-middle">Your Tournaments</CardTitle>
            <Link href="/adminCreate">
              <Button
                variant="outline"
                className="border-none bg-purple-700 text-white transition-all duration-200 hover:bg-purple-600"
              >
                Create
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {tournaments.map((tournament) => (
              <Card
                key={tournament.tournament_id}
                className="mb-6 rounded-lg border-none bg-black/25 p-4 shadow-lg backdrop-blur-md"
              >
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{tournament.tournament_name}</CardTitle>
                  <Link href="/adminTournament">
                    <Button
                      variant="outline"
                      className="border-none bg-purple-700 text-white transition-all duration-200 hover:bg-purple-600"
                    >
                      Details
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div>
                    <span className="hidden sm:inline">
                      Estimated Start-End Date:{' '}
                    </span>
                    <span>
                      {tournament.tournament_start} -{' '}
                      {tournament.tournament_end}
                    </span>
                    <div className="mt-2 text-xs">
                      Status:{' '}
                      {tournament.status === 'Ongoing' ? (
                        <span className="text-yellow-200"> Ongoing</span>
                      ) : tournament.status === 'Upcoming' ? (
                        <span className="text-green-200"> Upcoming</span>
                      ) : (
                        <span className="text-red-200"> Finished</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/adminEdit">
                      <Button
                        variant="outline"
                        className="border-purple-500 text-purple-500 transition-all duration-200 hover:bg-gray-300/70"
                      >
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="border-purple-500 text-purple-500 transition-all duration-200 hover:bg-gray-300/70"
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
