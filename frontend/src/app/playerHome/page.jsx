"use client";

import { useState } from "react";
import Navbar from '@/components/Navbar.jsx';
import { DataTable } from '@/components/ui/data-table';
import { Button } from "@/components/ui/button";

// Sample data for enrolled and completed tournaments
const enrolledTournaments = [
    { id: "1", tournament_name: "Tetris Championship", start: "June 1", end: "June 10", status: "Ongoing", organizer: "WTFC" },
    { id: "2", tournament_name: "Spring Showdown", start: "October 5", end: "October 15", status: "Upcoming", organizer: "WTFC" },
    { id: "3", tournament_name: "Championship Series 1", start: "June 1", end: "June 9", status: "Ongoing", organizer: "Tetr.io"},
    { id: "4", tournament_name: "World Tetris Tournament", start: "June 1", end: "June 5", status: "Ongoing", organizer: "WTT" },
    { id: "5", tournament_name: "TetriTracker Champs", start: "June 2", end: "June 4", status: "Ongoing", organizer: "Tetritracker" },
    { id: "6", tournament_name: "Tetrix", start: "June 1", end: "June 10", status: "Ongoing", organizer: "Tetrix.io" },
];

const completedTournaments = [
    { id: "1", tournament_name: "Winter Blast", start: "February 1", end: "February 5", status: "Completed" },
];

export default function HomePage() {
    const [visibleTable, setVisibleTable] = useState('enrolled');

    const toggleTable = (table) => {
        setVisibleTable(table);
    };

    return (
        <>
            <div className="min-h-screen bg-gradient-to-b from-[#0b051d] to-[#1c1132] flex flex-col items-center px-4">

                {/* Sticky Navbar */}
                <div className="w-full sticky top-0 z-50">
                    <Navbar />
                </div>

                {/* Main Content */}
                <div className="flex flex-col items-center w-full flex-grow mt-8 space-y-6">

                    {/* Toggle Buttons */}
                    <div className="flex flex-wrap gap-4 justify-center mb-4">
                        <Button
                            variant={visibleTable === 'enrolled' ? "solid" : "outline"}
                            className={`transition-all duration-200 ${
                                visibleTable === 'enrolled' ? "bg-purple-700 text-white" : "border-purple-500 text-purple-500"
                            }`}
                            onClick={() => toggleTable('enrolled')}
                        >
                            Enrolled Tournaments
                        </Button>
                        <Button
                            variant={visibleTable === 'completed' ? "solid" : "outline"}
                            className={`transition-all duration-200 ${
                                visibleTable === 'completed' ? "bg-purple-700 text-white" : "border-purple-500 text-purple-500"
                            }`}
                            onClick={() => toggleTable('completed')}
                        >
                            Recent Tournaments
                        </Button>
                    </div>

                    {/* Conditional Rendering of Tables */}
                    <div className="w-full max-w-4xl">
                        {visibleTable === 'enrolled' && (
                            <div className="w-full bg-[#1c1132] p-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
                                <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 text-center">Currently Enrolled Tournaments</h2>
                                <div className="overflow-x-hidden md:overflow-x-auto w-full custom-scrollbar">
                                    <div className="min-w-[600px]">
                                        <DataTable type="enrolled" data={enrolledTournaments} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {visibleTable === 'completed' && (
                            <div className="w-full bg-[#1c1132] p-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
                                <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 text-center">Recently Completed Tournaments</h2>
                                <div className="overflow-x-hidden md:overflow-x-auto w-full custom-scrollbar">
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