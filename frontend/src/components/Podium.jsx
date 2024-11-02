import { Trophy, Medal } from 'lucide-react';
import Image from 'next/image';

export default function Podium({ players }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 text-white">
      {/* Podium layout */}
      <div className="flex w-full max-w-3xl flex-col items-center justify-center gap-4 md:flex-row">
        {/* Second Place */}
        <div className="flex transform flex-col items-center transition-all duration-300 hover:scale-105">
          <Medal className="mb-2 h-12 w-12 text-gray-300" />
          <div className="w-64 rounded-lg bg-gray-800 p-4 text-center">
            <div className="relative mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full border-4 border-gray-300">
              <Image
                src={players[1]?.avatar}
                alt={`${players[1]?.username}'s avatar`}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <p className="mb-2 text-xl font-semibold">{players[1]?.username}</p>
            <p className="text-gray-400">Rating: {players[1]?.rating}</p>
          </div>
        </div>

        {/* First Place (Center on mobile, but elevated on desktop) */}
        <div className="z-10 flex transform flex-col items-center transition-all duration-300 hover:scale-110 md:translate-y-[-20px]">
          <Trophy className="mb-2 h-16 w-16 text-yellow-400" />
          <div className="w-72 rounded-lg bg-gradient-to-b from-yellow-400 to-yellow-600 p-6 text-center shadow-lg">
            <div className="relative mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-yellow-200">
              <Image
                src={players[0]?.avatar}
                alt={`${players[0]?.username}'s avatar`}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <p className="mb-2 text-2xl font-bold text-gray-900">
              {players[0]?.username}
            </p>
            <p className="font-semibold text-gray-800">
              Rating: {players[0]?.rating}
            </p>
          </div>
        </div>

        {/* Third Place */}
        <div className="flex transform flex-col items-center transition-all duration-300 hover:scale-105">
          <Medal className="mb-2 h-12 w-12 text-amber-700" />
          <div className="w-64 rounded-lg bg-gray-800 p-4 text-center">
            <div className="relative mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full border-4 border-amber-700">
              <Image
                src={players[2]?.avatar}
                alt={`${players[2]?.username}'s avatar`}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <p className="mb-2 text-xl font-semibold">{players[2]?.username}</p>
            <p className="text-gray-400">Rating: {players[2]?.rating}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
