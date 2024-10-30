'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar.jsx';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import BackgroundWrapper from '@/components/BackgroundWrapper';
import { fetchHotPosts } from '@/utils/fetchRedditPosts';

const enrolledTournaments = [
  {
    id: '1',
    tournament_name: 'Tetris Championship 2024',
    start: 'June 1, 2024',
    end: 'June 10, 2024',
    status: 'Ongoing',
    organizer: 'World Tetris Federation',
  },
  {
    id: '2',
    tournament_name: 'Spring Showdown',
    start: 'October 5, 2024',
    end: 'October 15, 2024',
    status: 'Upcoming',
    organizer: 'Tetris Club',
  },
  {
    id: '3',
    tournament_name: 'Championship Series 1',
    start: 'June 1, 2024',
    end: 'June 9, 2024',
    status: 'Ongoing',
    organizer: 'Tetr.io League',
  },
  {
    id: '4',
    tournament_name: 'World Tetris Tournament',
    start: 'June 1, 2024',
    end: 'June 5, 2024',
    status: 'Ongoing',
    organizer: 'Global Tetris Org',
  },
  {
    id: '5',
    tournament_name: 'TetriTracker Champs',
    start: 'June 2, 2024',
    end: 'June 4, 2024',
    status: 'Ongoing',
    organizer: 'TetriTracker',
  },
  {
    id: '6',
    tournament_name: 'Tetrix Open',
    start: 'July 1, 2024',
    end: 'July 10, 2024',
    status: 'Upcoming',
    organizer: 'Tetrix.io',
  },
];

const completedTournaments = [
  {
    id: '1',
    tournament_name: 'Winter Blast',
    start: 'February 1, 2024',
    end: 'February 5, 2024',
    status: 'Completed',
    organizer: 'Winter Games Federation',
  },
  {
    id: '2',
    tournament_name: 'Autumn Arena',
    start: 'September 10, 2023',
    end: 'September 20, 2023',
    status: 'Completed',
    organizer: 'Autumn Tetris League',
  },
  {
    id: '3',
    tournament_name: 'New Year Knockout',
    start: 'January 2, 2024',
    end: 'January 12, 2024',
    status: 'Completed',
    organizer: 'Tetris Masters',
  },
  {
    id: '4',
    tournament_name: 'Spring Bash',
    start: 'April 15, 2024',
    end: 'April 25, 2024',
    status: 'Completed',
    organizer: 'Spring Showdown Inc.',
  },
];

export default function HomePage() {
  const [visibleTable, setVisibleTable] = useState('enrolled');
  const toggleTable = (table) => setVisibleTable(table);

  const [hotPosts, setHotPosts] = useState([]);

  useEffect(() => {
    async function loadHotPosts() {
      const posts = await fetchHotPosts();
      setHotPosts(posts);
    }
    loadHotPosts();
  }, []);

  return (
    <BackgroundWrapper className="w-full overflow-hidden">
      <Navbar />

      {/* Centered Toggle Buttons */}
      <div className="mt-8 flex justify-center">
        <div className="flex gap-3">
          <Button
            variant={visibleTable === 'enrolled' ? 'solid' : 'outline'}
            className={`text-sm transition-all duration-200 hover:shadow-lg ${
              visibleTable === 'enrolled'
                ? 'bg-purple-700 text-white'
                : 'border-purple-500 text-purple-500'
            }`}
            onClick={() => toggleTable('enrolled')}
          >
            Enrolled
          </Button>
          <Button
            variant={visibleTable === 'completed' ? 'solid' : 'outline'}
            className={`text-sm transition-all duration-200 hover:shadow-lg ${
              visibleTable === 'completed'
                ? 'bg-purple-700 text-white'
                : 'border-purple-500 text-purple-500'
            }`}
            onClick={() => toggleTable('completed')}
          >
            Recent Tournaments
          </Button>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="mt-4 flex w-full max-w-full flex-col items-center space-y-6 overflow-hidden px-4 md:flex-row md:justify-center md:space-x-6">
        {/* Responsive Wrapper for Aligned Height of Sidebar and DataTable */}
        <div className="flex w-full max-w-full flex-col items-center overflow-hidden md:flex-row md:items-start md:space-x-6">
          {/* Left Sidebar - Reddit Content */}
          <div className="w-full max-w-full overflow-hidden rounded-lg bg-[#1a1a1b] p-4 shadow-lg md:w-1/3 lg:w-1/4">
            <h2 className="mb-4 text-lg font-semibold text-[#d7dadc]">
              Trending on r/tetris
            </h2>
            {/* Reddit Posts */}
            <ul className="custom-scrollbar max-h-[300px] space-y-4 overflow-y-auto">
              {hotPosts.slice(0, 10).map((post, index) => (
                <li
                  key={index}
                  className="flex items-start rounded-lg bg-[#272729] p-4 hover:bg-[#333335]"
                >
                  {post.thumbnail &&
                    post.thumbnail !== 'self' &&
                    post.thumbnail !== 'default' && (
                      <img
                        src={post.thumbnail}
                        alt="Thumbnail"
                        className="mr-4 h-16 w-16 rounded-md border border-[#d7dadc]"
                      />
                    )}
                  <div className="flex flex-col">
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#ff4500]"
                    >
                      {post.title}
                    </a>
                    <p className="text-sm text-gray-400">Score: {post.score}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Centered DataTable */}
          <div className="mt-6 w-full max-w-full overflow-hidden rounded-lg bg-[#1c1132] p-4 shadow-lg md:mt-0 md:w-1/3 lg:w-1/2">
            <h2 className="mb-4 text-center text-lg font-semibold text-white">
              {visibleTable === 'enrolled'
                ? 'Currently Enrolled Tournaments'
                : 'Recently Completed Tournaments'}
            </h2>
            <div className="w-full overflow-x-auto">
              <DataTable
                type={visibleTable}
                data={
                  visibleTable === 'enrolled'
                    ? enrolledTournaments
                    : completedTournaments
                }
              />
            </div>
          </div>

          {/* Right Sidebar - Future Content */}
          <div className="mt-6 w-full max-w-full overflow-hidden rounded-lg bg-[#1c1132] p-4 text-center text-white shadow-lg md:mt-0 md:w-1/3 lg:w-1/4">
            <h2 className="mb-4 text-lg font-semibold">More coming soon!</h2>
            <p className="text-sm">Reserved for future content</p>
          </div>
        </div>
      </div>
    </BackgroundWrapper>
  );
}
