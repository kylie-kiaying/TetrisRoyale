'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function EditPage() {
  const router = useRouter();
  const { id } = useParams();
  const [tournamentName, setTournamentName] = useState('');
  const [remarks, setRemarks] = useState('');
  const [tournamentStart, setTournamentStart] = useState('');
  const [tournamentEnd, setTournamentEnd] = useState('');
  const [recommendedRating, setRecommendedRating] = useState('');
  const [status, setStatus] = useState('');
  const [organiser, setOrganiser] = useState('');

  useEffect(() => {
    // Fetch tournament data when the component mounts
    const fetchTournament = async () => {
      try {
        const response = await fetch(`http://localhost:8003/tournaments/${id}`);
        const data = await response.json();
        setTournamentName(data.tournament_name);
        setRemarks(data.remarks);
        setTournamentStart(data.tournament_start);
        setTournamentEnd(data.tournament_end);
        setRecommendedRating(data.recommended_rating);
        setStatus(data.status); // Non-editable field
        setOrganiser(data.organiser); // Non-editable field
      } catch (error) {
        console.error('Failed to fetch tournament data:', error);
      }
    };
    fetchTournament();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:8003/tournaments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tournament_name: tournamentName,
          tournament_start: tournamentStart,
          tournament_end: tournamentEnd,
          status: status, // Using fetched value for status
          remarks: remarks,
          recommended_rating: Number(recommendedRating),
          organiser: organiser, // Using fetched value for organiser
        }),
      });
      router.push('/adminHome'); // Redirect after successful submission
    } catch (error) {
      console.error('Failed to update tournament:', error);
    }
  };

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-cover bg-fixed bg-center bg-no-repeat px-6 py-12"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(11, 5, 29, 0.95), rgba(28, 17, 50, 0.95)), url('/bgpic.png')",
      }}
    >
      <Card className="w-full max-w-md rounded-2xl border-none bg-opacity-50 p-6 shadow-lg backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">
            Edit Tournament
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full gap-6">
              <div className="flex flex-col space-y-1.5 mb-3">
                <Label htmlFor="name">Tournament Name</Label>
                <Input
                  id="name"
                  className="bg-white text-gray-700"
                  value={tournamentName}
                  onChange={(e) => setTournamentName(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5 mb-3">
                <Label htmlFor="remark">Remarks</Label>
                <Input
                  id="remark"
                  className="bg-white text-gray-700"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5 mb-3">
                <Label htmlFor="startTime">Tournament Start DateTime</Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  className="text-center bg-white text-gray-700"
                  value={tournamentStart}
                  onChange={(e) => setTournamentStart(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5 mb-3">
                <Label htmlFor="endTime">Tournament End DateTime</Label>
                <Input
                  id="endTime"
                  type="datetime-local"
                  className="text-center bg-white text-gray-700"
                  value={tournamentEnd}
                  onChange={(e) => setTournamentEnd(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5 mb-3">
                <Label htmlFor="recommendedRating">Recommended Rating</Label>
                <select
                  id="recommendedRating"
                  className="bg-white text-gray-700 rounded-md p-2"
                  value={recommendedRating}
                  onChange={(e) => setRecommendedRating(e.target.value)}
                >
                  {Array.from({ length: 16 }, (_, i) => 1000 + i * 100).map((rating) => (
                    <option key={rating} value={rating}>
                      {rating}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <CardFooter className="mt-8 flex flex-row-reverse justify-center items-center">
              <Button
                type="submit"
                className="inline-flex w-full justify-center rounded-md bg-purple-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-600 sm:ml-3 sm:w-auto"
              >
                Edit
              </Button>
              <Link href="/adminHome">
                <Button
                  type="button"
                  variant="outline"
                  className="mt-3 border border-purple-500 text-purple-500 transition-all duration-200 hover:bg-gray-300/70 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm sm:mt-0 sm:w-auto"
                >
                  Cancel
                </Button>
              </Link>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
