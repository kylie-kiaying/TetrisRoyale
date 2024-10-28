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
  const username = useAuthStore((state) => state.username);
  const toggleTable = (table) => {
    setVisibleTable(table);
  };

  const [hotPosts, setHotPosts] = useState([]);

  useEffect(() => {
    async function loadHotPosts() {
      const posts = await fetchHotPosts();
      setHotPosts(posts);
    }
    loadHotPosts();
  }, []);

  return (
    <>
      <BackgroundWrapper>
        <Navbar />

        {/* Main Content Container */}
        <div className="mt-4 flex max-w-full flex-col space-y-6 overflow-x-hidden overflow-y-hidden px-4 md:flex-row md:space-x-6 md:space-y-0">
          {/* Left Sidebar for Trending Posts */}
          <aside className="order-1 w-full max-w-full md:w-1/4 md:pr-4">
            <div className="rounded-lg bg-[#1a1a1b] p-4 shadow-lg md:p-6">
              <h2 className="mb-4 text-lg font-semibold text-[#d7dadc]">
                Trending on r/tetris
              </h2>

              {/* Scrollable Post List */}
              <ul className="custom-scrollbar max-h-[300px] space-y-4 overflow-y-auto">
                {hotPosts.slice(0, 5).map((post, index) => (
                  <li
                    key={index}
                    className="relative flex w-full max-w-full items-start rounded-lg bg-[#272729] p-4 shadow-sm transition hover:bg-[#333335]"
                  >
                    {/* Reddit Logo */}
                    <img
                      src="/reddit-logo.png" // Path to Reddit logo in the public folder
                      alt="Reddit Logo"
                      className="absolute right-2 top-2 h-4 w-4 md:h-5 md:w-5"
                    />

                    {/* Thumbnail or Fallback Image */}
                    <div className="mr-4 h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-[#d7dadc] bg-[#1a1a1b]">
                      <img
                        src={post.thumbnail || '/path-to-fallback-image.png'}
                        alt="Post Thumbnail"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Post Details */}
                    <div className="flex w-full max-w-[calc(100%-4rem)] flex-col justify-between">
                      <a
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate text-sm font-semibold text-[#ff4500] hover:underline md:text-base"
                        style={{ maxWidth: '100%' }}
                      >
                        {post.title}
                      </a>
                      <p className="mt-1 text-xs text-gray-400 md:text-sm">
                        Score: {post.score}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main Content */}
          <main className="order-2 flex w-full max-w-full flex-col items-center space-y-4 md:w-1/2 md:space-y-6">
            {/* Toggle Buttons */}
            <div className="mb-4 flex w-full justify-center gap-3 overflow-hidden px-4 md:gap-4 md:px-0">
              <Button
                variant={visibleTable === 'enrolled' ? 'solid' : 'outline'}
                className={`text-sm transition-all duration-200 hover:shadow-lg md:text-base ${
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
                className={`text-sm transition-all duration-200 hover:shadow-lg md:text-base ${
                  visibleTable === 'completed'
                    ? 'bg-purple-700 text-white'
                    : 'border-purple-500 text-purple-500'
                }`}
                onClick={() => toggleTable('completed')}
              >
                Recent Tournaments
              </Button>
            </div>

            {/* Conditional Rendering of Tables */}
            <div className="w-full max-w-full transform overflow-hidden rounded-lg bg-[#1c1132] p-4 shadow-lg transition-all duration-300 hover:scale-105 md:p-6">
              <h2 className="mb-4 text-center text-lg font-semibold text-white md:text-xl">
                {visibleTable === 'enrolled'
                  ? 'Currently Enrolled Tournaments'
                  : 'Recently Completed Tournaments'}
              </h2>
              <div className="table-scrollbar w-full overflow-x-auto">
                <div className="min-w-[500px] md:min-w-[600px]">
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
            </div>
          </main>

          {/* Right Sidebar Placeholder for Future Content */}
          <aside className="order-3 w-full max-w-full md:w-1/4 md:pl-4">
            <div className="rounded-lg bg-[#1c1132] p-4 text-center text-white shadow-lg md:p-6">
              <h2 className="mb-4 text-lg font-semibold">More coming soon!</h2>
              <p className="text-sm md:text-base">
                Reserved for future content
              </p>
            </div>
          </aside>
        </div>

        {/* Custom Scrollbar Styling */}
        <style jsx global>{`
          .custom-scrollbar {
            scrollbar-width: thin;
          }
          .custom-scrollbar::-webkit-scrollbar {
            height: 8px;
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
              overflow-x: scroll;
            }
            .custom-scrollbar::-webkit-scrollbar {
              height: 10px;
            }
          }
        `}</style>
      </BackgroundWrapper>
    </>
  );
}
