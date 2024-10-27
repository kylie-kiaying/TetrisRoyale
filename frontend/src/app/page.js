import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/bgvid.mp4" type="video/mp4" />
        Your browser does not support the video tag
      </video>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center p-4 text-center">
        <h1 className="mb-4 font-bebas text-4xl text-white/90 sm:text-6xl md:text-7xl">
          Welcome to TetriTracker
        </h1>
        <p className="mb-4 font-serif text-base text-white/75 sm:text-lg md:text-xl lg:text-2xl">
          Your Hub for Competitive Tetris – Rankings, Tournaments, Community.
        </p>
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Link href="/login">
            <Button className="rounded bg-white px-4 py-2 font-bold text-[#1e0b38] hover:bg-gray-300">
              Sign in
            </Button>
          </Link>
          <Link href="/register">
            <Button className="rounded bg-white px-4 py-2 font-bold text-[#1e0b38] hover:bg-gray-300">
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
