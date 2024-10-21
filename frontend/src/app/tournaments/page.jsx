'use client';

import Navbar from '@/components/Navbar.jsx';
import { DataTable } from '@/components/ui/data-table';
import { IoCalendar } from 'react-icons/io5';

// Sample data for all tournaments
const tournaments = [
  {
    id: '1',
    tournament_name: 'Tetris World Championship',
    start: 'July 1',
    end: 'July 10',
    status: 'Upcoming',
    organizer: 'WTFC',
  },
  {
    id: '2',
    tournament_name: 'Spring Showdown',
    start: 'March 5',
    end: 'March 15',
    status: 'Completed',
    organizer: 'Spring Events',
  },
  {
    id: '3',
    tournament_name: 'Winter Bash',
    start: 'January 10',
    end: 'January 20',
    status: 'Completed',
    organizer: 'Winter Games',
  },
  {
    id: '4',
    tournament_name: 'Summer Sizzle',
    start: 'August 1',
    end: 'August 15',
    status: 'Ongoing',
    organizer: 'Summer Events',
  },
  {
    id: '5',
    tournament_name: 'Autumn Clash',
    start: 'October 5',
    end: 'October 15',
    status: 'Upcoming',
    organizer: 'Autumn League',
  },
];

export default function TournamentsPage() {
  return (
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
        <div className="flex w-full max-w-6xl items-center justify-between px-6">
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            All Tournaments
          </h1>
          <button className="rounded-full bg-purple-700 p-2 text-3xl text-white transition duration-300 hover:bg-purple-600">
            <IoCalendar />
          </button>
        </div>
        <div className="w-full max-w-6xl transform rounded-lg bg-[#1c1132] p-6 shadow-lg transition-all duration-300 hover:scale-105">
          <div className="custom-scrollbar w-full overflow-x-auto">
            <div className="min-w-[600px]">
              <DataTable type="all" data={tournaments} />
            </div>
          </div>
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
  );
}
