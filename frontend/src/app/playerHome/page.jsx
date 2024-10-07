"use client";

import Navbar from '@/components/Navbar.jsx';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-[#0b051d] items-center">

            {/* Navbar component */}
            <div className="w-full absolute top-3 z-50 flex justify-center">
            <Navbar></Navbar>
            </div>

            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-5xl font-bold text-white">Welcome to TetriTracker</h1>
                <p className="text-xl text-white">The best place to track your Tetris progress</p>
            </div>

        </div>
        
    );
}