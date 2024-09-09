import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
        {/* Background Video */}
        <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover">
            <source src="/bgvid.mp4" type="video/mp4" />
            Your browser does not support the video tag
        </video>

    
    {/* Content */}
    <div className="relative z-10 flex flex-col justify-center items-center h-full">

        <h1 className="text-white/90 text-3xl sm:text-6xl font-bebas mb-4 text-nowrap overflow-hidden"> Welcome to TetriTracker</h1>
        <p className = "text-white/75 text-l sm:text-xl font-serif mb-4 text-nowrap overflow-hidden">Your Hub for Competitive Tetris – Rankings, Tournaments, Community.</p>
        <div className="flex space-x-4">
            <Link href="/login">
                <Button className="bg-white text-[#1e0b38] hover:bg-gray-300 font-bold py-2 px-4 rounded" >
                    Sign in
                </Button>
            </Link>
            <Link href="/register">
                <Button className="bg-white text-[#1e0b38] hover:bg-gray-300 font-bold py-2 px-4 rounded" >
                    Register new account
                </Button>
            </Link>
        </div>
    </div>

     {/* Overlay for darker effect */}
     <div className="absolute inset-0 bg-[#0b051d] opacity-80"></div>
     </div>

  );
}
