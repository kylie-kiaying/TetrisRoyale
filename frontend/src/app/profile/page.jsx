'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import {
  getPlayerDetails,
  getPlayerMatchesAndInsertTournamentNameAndStatistics,
  calculateWinRate,
} from '@/utils/fetchPlayerDetails';
import Navbar from '@/components/Navbar.jsx';
import { DataTable } from '@/components/ui/data-table';
import { useAuthStore } from '@/store/authStore';
import PlayerStatistics from '@/components/PlayerStatistics';
import ToggleButtons from '@/components/ui/toggle';
import { getPlayerTier } from '@/utils/getPlayerTier'; // Import the getPlayerTier function
import { Badge } from '@/components/ui/badge';
import { FaEdit } from 'react-icons/fa';
import BackgroundWrapper from '@/components/BackgroundWrapper';
import { successToast, errorToast } from '@/utils/toastUtils';

export default function PlayerProfile() {
  const username = useAuthStore((state) => state.user.username); // Get username from the auth store
  const playerRating = useAuthStore((state) => state.user.rating); // Get player rating from the auth store
  const user_id = useAuthStore((state) => state.user.userId); // Get user id from the auth store
  const { tier, color } = getPlayerTier(playerRating); // Get the tier and color based on the rating
  const [visiblePlot, setVisiblePlot] = useState('playstyle'); // State to track the visible plot
  const [playerDetails, setPlayerDetails] = useState(null); // State to store player details
  const [playerMatches, setPlayerMatches] = useState([]); // State to store player matches
  const [winRate, setWinRate] = useState({
    matchesWon: null,
    matchesLost: null,
    winRate: 'N/A',
  }); // State to store winrate
  const [profileImage, setProfileImage] = useState('/user.png'); // Default image path
  const [file, setFile] = useState(null);

  // Fetch profile image on mount
  useEffect(() => {
    if (user_id) {
      fetch(`http://localhost:8002/players/${user_id}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.profile_picture) {
            setProfileImage(data.profile_picture);
          }
        })
        .catch(() => errorToast('Failed to load profile picture.'));
    }
  }, [user_id]);

  // Handle file change for profile picture upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Handle profile picture upload
  const handleUpload = async () => {
    if (!file) {
      errorToast('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(
        `http://localhost:8002/players/${user_id}/profile-picture`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProfileImage(data.profile_picture); // Update profile image with new URL
        successToast('Profile picture updated successfully.');
        setFile(null); // Reset file after upload
      } else {
        errorToast('Failed to upload profile picture.');
      }
    } catch (error) {
      errorToast('An error occurred while uploading the profile picture.');
    }
  };

  useEffect(() => {
    if (user_id) {
      getPlayerDetails(user_id).then((data) => setPlayerDetails(data));
      getPlayerMatchesAndInsertTournamentNameAndStatistics(user_id).then(
        (data) => {
          setPlayerMatches(data);
          const statistics = calculateWinRate(data, user_id);
          setWinRate(statistics);
        }
      );
    }
  }, [user_id]);

  const togglePlot = (plot) => {
    setVisiblePlot(plot);
  };

  const plotOptions = [
    { value: 'playstyle', label: 'Playstyle' },
    { value: 'elo', label: 'ELO Over Time' },
    { value: 'wins', label: 'Wins Over Time' },
  ];

  return (
    <BackgroundWrapper>
      {/* Navbar */}
      <Navbar />

      {/* Profile Section */}
      <div className="mt-8 flex w-full flex-col items-center justify-start space-y-6 py-10">
        {/* Profile Card */}
        <div className="mx-4 flex w-full max-w-4xl flex-col items-center space-y-6 rounded-lg bg-[#1c1132] p-6 shadow-md md:p-8">
          <div className="flex flex-col items-center space-y-4">
            {/* Profile Picture Container */}
            <div className="group relative h-32 w-32 overflow-hidden rounded-full">
              <img
                src={profileImage}
                alt="Profile"
                className="h-full w-full object-cover"
              />
              <label className="absolute inset-0 flex cursor-pointer items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                <FaEdit className="text-2xl text-black" />
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              className={`mt-2 rounded bg-blue-500 px-6 py-2 text-white transition-all ${
                file ? 'hover:bg-blue-600' : 'cursor-not-allowed bg-gray-400'
              }`}
              disabled={!file}
            >
              Upload
            </button>
          </div>
          <div className="flex w-full flex-col items-center space-y-4 px-2">
            <h1 className="text-3xl font-semibold text-white md:text-4xl">
              {username}{' '}
              <span className="font-normal text-gray-400 md:text-3xl">
                #{user_id}
              </span>
            </h1>
            <div className="flex w-full flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0 md:px-6">
              <p className="text-xl text-gray-400 md:text-2xl">
                WHR: {playerRating ? playerRating.toFixed(2) : 'Loading...'}
              </p>
              {/* Display Tier Badge */}
              <Link href="/tierInfo">
                <Badge className={`text-xl ${color} hover:glow-${color}`}>
                  {tier}
                </Badge>
              </Link>
              <div className="flex flex-col items-center space-y-2 md:items-start">
                <p className="text-base text-green-400 md:text-lg">
                  Matches won: {winRate.matchesWon}
                </p>
                <p className="text-base text-red-400 md:text-lg">
                  Matches lost: {winRate.matchesLost}
                </p>
                <p className="text-base text-gray-400 md:text-lg">
                  Winrate: {winRate.winRate}
                </p>
              </div>
            </div>
          </div>
          {/* Toggle Buttons for Plots */}
          <ToggleButtons
            options={plotOptions}
            activeOption={visiblePlot}
            onToggle={togglePlot}
          />
          {/* ELO Analytics Section */}
          <div className="w-full rounded-lg bg-[#2c1f4c] p-4 md:p-6">
            {visiblePlot === 'playstyle' && (
              <PlayerStatistics
                type="playstyle"
                data={
                  playerDetails
                    ? [
                        playerDetails.speed,
                        playerDetails.defense,
                        playerDetails.strategy,
                        playerDetails.aggression,
                        playerDetails.efficiency,
                      ]
                    : []
                }
              />
            )}
            {visiblePlot === 'elo' && <PlayerStatistics type="elo" />}
            {visiblePlot === 'wins' && (
              <PlayerStatistics type="wins" data={playerMatches} />
            )}
          </div>
          {/* Match History Section */}
          <div className="w-full transform rounded-lg bg-[#1c1132] p-4 shadow-lg transition-all duration-300 hover:scale-105 md:p-6">
            <h2 className="mb-4 text-center text-lg font-semibold text-white md:text-2xl">
              Match History
            </h2>
            <div className="custom-scrollbar w-full overflow-x-auto">
              <div className="min-w-[600px]">
                <DataTable type="match_history" data={playerMatches} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </BackgroundWrapper>
  );
}
