'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar.jsx';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';

const enrolledTournaments = [
  {
    id: '1',
    tournament_name: 'Tetris Championship',
    start: 'June 1',
    end: 'June 10',
    status: 'Ongoing',
    organizer: 'WTFC',
  },
  {
    id: '2',
    tournament_name: 'Spring Showdown',
    start: 'October 5',
    end: 'October 15',
    status: 'Upcoming',
    organizer: 'WTFC',
  },
  {
    id: '3',
    tournament_name: 'Championship Series 1',
    start: 'June 1',
    end: 'June 9',
    status: 'Ongoing',
    organizer: 'Tetr.io',
  },
  {
    id: '4',
    tournament_name: 'World Tetris Tournament',
    start: 'June 1',
    end: 'June 5',
    status: 'Ongoing',
    organizer: 'WTT',
  },
  {
    id: '5',
    tournament_name: 'TetriTracker Champs',
    start: 'June 2',
    end: 'June 4',
    status: 'Ongoing',
    organizer: 'Tetritracker',
  },
  {
    id: '6',
    tournament_name: 'Tetrix',
    start: 'June 1',
    end: 'June 10',
    status: 'Ongoing',
    organizer: 'Tetrix.io',
  },
];

const completedTournaments = [
  {
    id: '1',
    tournament_name: 'Winter Blast',
    start: 'February 1',
    end: 'February 5',
    status: 'Completed',
  },
];

export default function HomePage() {
  const [visibleTable, setVisibleTable] = useState('enrolled');
  const username = useAuthStore((state) => state.username);
  const toggleTable = (table) => {
    setVisibleTable(table);
  };

  return (
    <>
      {/* Background image with color gradient overlay */}
      <div
        className="flex min-h-screen flex-col items-center bg-cover bg-fixed bg-center bg-no-repeat px-4"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(11, 5, 29, 0.95), rgba(28, 17, 50, 0.95)), url('/bgpic.png')",
        }}
      >
        {/* Sticky Navbar */}
        <div className="sticky top-0 z-50 w-full">
          <Navbar />
        </div>

        {/* Main Content */}
        <div className="mt-8 flex w-full flex-grow flex-col items-center space-y-6">
          {/* Toggle Buttons */}
          <div className="mb-4 flex flex-wrap justify-center gap-4">
            <Button
              variant={visibleTable === 'enrolled' ? 'solid' : 'outline'}
              className={`transition-all duration-200 ${
                visibleTable === 'enrolled'
                  ? 'bg-purple-700 text-white'
                  : 'border-purple-500 text-purple-500'
              }`}
              onClick={() => toggleTable('enrolled')}
            >
              Enrolled Tournaments
            </Button>
            <Button
              variant={visibleTable === 'completed' ? 'solid' : 'outline'}
              className={`transition-all duration-200 ${
                visibleTable === 'completed'
                  ? 'bg-purple-700 text-white'
                  : 'border-purple-500 text-purple-500'
              }`}
              onClick={() => toggleTable('completed')}
            >
              Recent Tournaments
            </Button>
          </div>

          {/* Conditional Rendering of Tables */}
          <div className="w-full max-w-4xl">
            {visibleTable === 'enrolled' && (
              <div className="w-full transform rounded-lg bg-[#1c1132] p-6 shadow-lg transition-all duration-300 hover:scale-105">
                <h2 className="mb-4 text-center text-xl font-semibold text-white md:text-2xl">
                  Currently Enrolled Tournaments
                </h2>
                <div className="custom-scrollbar w-full overflow-x-hidden md:overflow-x-auto">
                  <div className="min-w-[600px]">
                    <DataTable type="enrolled" data={enrolledTournaments} />
                  </div>
                </div>
              </div>
            )}

            {visibleTable === 'completed' && (
              <div className="w-full transform rounded-lg bg-[#1c1132] p-6 shadow-lg transition-all duration-300 hover:scale-105">
                <h2 className="mb-4 text-center text-xl font-semibold text-white md:text-2xl">
                  Recently Completed Tournaments
                </h2>
                <div className="custom-scrollbar w-full overflow-x-hidden md:overflow-x-auto">
                  <div className="min-w-[600px]">
                    <DataTable type="completed" data={completedTournaments} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add custom CSS for scrollbar */}
        <style jsx global>{`
          .custom-scrollbar {
            scrollbar-width: thin;
          }

          .custom-scrollbar::-webkit-scrollbar {
            height: 10px;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: #1c1132;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #6b7280;
            border-radius: 10px;
            border: 2px solid #1c1132;
          }

          @media (max-width: 768px) {
            .custom-scrollbar {
              overflow-x: scroll; /* Force scrollbar visibility on mobile */
            }

            .custom-scrollbar::-webkit-scrollbar {
              height: 12px; /* Larger scrollbar for better visibility on mobile */
            }
          }
        `}</style>
      </div>
    </>
  );
}
