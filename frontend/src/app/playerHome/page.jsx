'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar.jsx';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import BackgroundWrapper from '@/components/BackgroundWrapper';
import { fetchHotPosts } from '@/utils/fetchRedditPosts';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { getRecommendedTournaments } from '@/utils/fetchRecommendedTournaments';
import { fetchRecentCompletedTournaments } from '@/utils/fetchRecentlyCompletedTournaments';
import { fetchUserTournaments } from '@/utils/fetchEnrolledTournaments';
import { formatDateMedium } from '@/utils/dateUtils';

export default function HomePage() {
  const user = useAuthStore((state) => state.user);
  const userId = user.userId;
  const userRating = user.rating;

  const [recommendedTournaments, setRecommendedTournaments] = useState([]);
  const [enrolledTournaments, setEnrolledTournaments] = useState([]); // State for enrolled tournaments
  const [completedTournaments, setCompletedTournaments] = useState([]); // State for completed tournaments
  const [visibleTable, setVisibleTable] = useState('enrolled');
  const [hotPosts, setHotPosts] = useState([]);

  // Fetch recommended tournaments
  useEffect(() => {
    const fetchRecommendedTournaments = async () => {
      try {
        const tournaments = await getRecommendedTournaments(userRating, userId);
        setRecommendedTournaments(tournaments);
      } catch (error) {
        console.error('Error fetching recommended tournaments:', error);
      }
    };

    fetchRecommendedTournaments();
  }, [userRating, userId]);

  // Fetch enrolled tournaments
  useEffect(() => {
    const fetchEnrolledTournaments = async () => {
      try {
        const tournaments = await fetchUserTournaments(userId);
        setEnrolledTournaments(tournaments);
      } catch (error) {
        console.error('Error fetching enrolled tournaments:', error);
      }
    };

    fetchEnrolledTournaments();
  }, [userId]);

  // Fetch completed tournaments
  useEffect(() => {
    const fetchCompletedTournaments = async () => {
      try {
        const tournaments = await fetchRecentCompletedTournaments();
        setCompletedTournaments(tournaments);
        console.log(tournaments);
      } catch (error) {
        console.error('Error fetching completed tournaments:', error);
      }
    };

    fetchCompletedTournaments();
  }, []);

  // Load hot Reddit posts on component mount
  useEffect(() => {
    async function loadHotPosts() {
      const posts = await fetchHotPosts();
      setHotPosts(posts);
    }
    loadHotPosts();
  }, []);

  const toggleTable = (table) => setVisibleTable(table);

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

          {/* Right Sidebar - Recommended tournaments */}
          {/* Right Sidebar - Recommended Tournaments */}
          <div className="mb-4 mt-6 w-full max-w-full overflow-hidden rounded-lg bg-[#1a1a1b] p-4 text-center text-white shadow-lg sm:mb-6 md:mb-8 md:mt-0 md:w-1/3 lg:w-1/4">
            <h2 className="mb-4 text-lg font-semibold text-[#d7dadc]">
              Recommended Tournaments
            </h2>
            <div className="relative mb-4 w-full max-w-4xl px-4 py-4 sm:mb-6 md:mb-8">
              <Carousel>
                <CarouselContent>
                  {recommendedTournaments.map((tournament) => (
                    <CarouselItem
                      key={tournament.id}
                      className="flex items-center justify-center"
                    >
                      <div className="w-[250px] p-2">
                        <Card className="mx-auto aspect-square w-full rounded-lg border border-[#333335] bg-[#1a1a1b] shadow-lg transition duration-300 hover:bg-[#242425] hover:shadow-[0_0_15px_rgba(127,199,248,0.5)]">
                          <CardContent className="flex flex-col items-center justify-center space-y-3 p-6">
                            <h3 className="mb-2 text-center text-lg font-semibold text-[#7fc7f8] transition duration-200 hover:text-[#a4ecff]">
                              {tournament.tournament_name}
                            </h3>

                            {/* Date Range Format */}
                            <p className="text-center text-xs text-[#c2c2c7]">
                              {formatDateMedium(tournament.tournament_start)}{' '}
                              &mdash;{' '}
                              {formatDateMedium(tournament.tournament_end)}
                            </p>

                            <p className="text-center text-xs font-light text-[#c2c2c7]">
                              Organizer:{' '}
                              <span className="font-semibold text-[#78dcca] transition duration-200 hover:text-[#afffe1]">
                                {tournament.organiser}
                              </span>
                            </p>
                            <p className="text-center text-xs font-light text-[#c2c2c7]">
                              Recommended Rating:{' '}
                              <span className="font-semibold text-[#f1b85f] transition duration-200 hover:text-[#ffe1a8]">
                                {tournament.recommended_rating}
                              </span>
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                <CarouselPrevious className="absolute left-0 top-1/2 hidden -translate-y-1/2 transform rounded-full bg-[#18182f] p-2 text-white shadow-md transition duration-300 hover:bg-[#78dcca] md:block" />
                <CarouselNext className="absolute right-0 top-1/2 hidden -translate-y-1/2 transform rounded-full bg-[#18182f] p-2 text-white shadow-md transition duration-300 hover:bg-[#78dcca] md:block" />
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </BackgroundWrapper>
  );
}
