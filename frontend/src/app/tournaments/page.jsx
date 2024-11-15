'use client';

import Navbar from '@/components/Navbar.jsx';
import { DataTable } from '@/components/ui/data-table';
import { IoCalendar } from 'react-icons/io5';
import React, { useEffect, useState } from 'react';
import BackgroundWrapper from '@/components/BackgroundWrapper';
import { tournamentService } from '@/services/tournamentService';

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await tournamentService.getAllTournaments();
        setTournaments(data);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <BackgroundWrapper>
      <Navbar />
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
    </BackgroundWrapper>
  );
}
