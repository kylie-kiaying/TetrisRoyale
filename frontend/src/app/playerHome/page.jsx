"use client";

import { useState } from "react";
import Navbar from '@/components/Navbar.jsx';
import { DataTable } from '@/components/ui/data-table'; // Import the DataTable component
import { Button } from "@/components/ui/button"; // Import ShadCN button component

// Sample data for enrolled and completed tournaments
const enrolledTournaments = [
    { id: "1", tournament_name: "Tetris Championship", start: "June 1", end: "June 10", status: "Ongoing" },
    { id: "2", tournament_name: "Spring Showdown", start: "April 5", end: "April 15", status: "Upcoming" },
];

const completedTournaments = [
    { id: "1", tournament_name: "Winter Blast", start: "February 1", end: "February 5", status: "Completed" },
];

export default function HomePage() {
    // State to track which table is currently visible
    const [visibleTable, setVisibleTable] = useState('enrolled');

    // Function to switch between tables
    const toggleTable = (table) => {
        setVisibleTable(table);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0b051d] to-[#1c1132] flex flex-col items-center">

            {/* Sticky Navbar */}
            <div className="w-full sticky top-0 z-50 flex justify-center">
                <Navbar />
            </div>

            {/* Main Content */}
            <div className="flex flex-col items-center justify-center flex-grow mt-12 space-y-8">
                <h1 className="text-6xl font-extrabold text-white mb-6 tracking-tight">Welcome back User</h1>
                <p className="text-lg text-gray-300">Track your Tetris progress, stay competitive!</p>

                {/* Toggle Buttons */}
                <div className="flex gap-4 mb-8">
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
                        <div className="w-full bg-[#2e1f4d] p-6 rounded-lg shadow-2xl transition-all duration-300 transform hover:scale-105">
                            <h2 className="text-2xl font-semibold text-white mb-4 text-center">Currently Enrolled Tournaments</h2>
                            <DataTable type="enrolled" data={enrolledTournaments} />
                        </div>
                    )}

                    {visibleTable === 'completed' && (
                        <div className="w-full bg-[#2e1f4d] p-6 rounded-lg shadow-2xl transition-all duration-300 transform hover:scale-105">
                            <h2 className="text-2xl font-semibold text-white mb-4 text-center">Recently Completed Tournaments</h2>
                            <DataTable type="completed" data={completedTournaments} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
