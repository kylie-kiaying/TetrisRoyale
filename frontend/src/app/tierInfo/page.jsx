'use client';

import Navbar from '@/components/Navbar.jsx';
import BackgroundWrapper from '@/components/BackgroundWrapper';
import { Badge } from '@/components/ui/badge';

const tiers = [
  {
    name: 'Champion',
    range: '2200+',
    color: 'text-yellow-500',
    description:
      'The pinnacle of Tetris mastery, Champions display flawless skill, unmatched speed, and superior strategic depth.',
  },
  {
    name: 'Master',
    range: '1900 - 2199',
    color: 'text-purple-500',
    description:
      'Masters are elite players with refined technique and adaptability, thriving in even the most intense matches.',
  },
  {
    name: 'Diamond',
    range: '1600 - 1899',
    color: 'text-cyan-400',
    description:
      'Diamonds are rising stars with sharp precision and advanced tactics, consistently pushing towards mastery.',
  },
  {
    name: 'Platinum',
    range: '1400 - 1599',
    color: 'text-blue-300',
    description:
      'Platinum players balance competitive spirit with adaptive strategies, making them a formidable presence in the arena.',
  },
  {
    name: 'Gold',
    range: '1200 - 1399',
    color: 'text-yellow-400',
    description:
      'Gold players showcase strong dedication and have mastered essential skills, aiming to break into higher ranks',
  },
  {
    name: 'Silver',
    range: '1000 - 1199',
    color: 'text-gray-500',
    description:
      'Starting out at Silver, new players bring enthusiasm and potential, learning the ropes while building solid fundamentals.',
  },
  {
    name: 'Bronze',
    range: '800 - 999',
    color: 'text-orange-400',
    description:
      'Bronze players are beginning their journey, focusing on developing core skills to climb the ranks and improve their game.',
  },
];

export default function TierInfoPage() {
  return (
    <BackgroundWrapper>
      <Navbar />
      <div className="flex flex-col items-center px-4 pb-20 pt-16 text-white">
        <h1 className="mb-8 text-3xl font-bold sm:text-4xl">
          Tier Information
        </h1>
        <div className="grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="flex flex-col items-start rounded-lg bg-[#1c1132] p-6 shadow-md transition-transform duration-200 hover:scale-105 hover:shadow-lg"
            >
              <h2 className={`text-xl font-semibold sm:text-2xl ${tier.color}`}>
                {tier.name}
              </h2>
              <p className="mt-2 text-sm text-gray-400 sm:text-base">
                {tier.description}
              </p>
              <Badge
                className={`mt-4 rounded-md px-3 py-1 text-sm sm:text-base ${tier.color}`}
              >
                {tier.range}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </BackgroundWrapper>
  );
}
