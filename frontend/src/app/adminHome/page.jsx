'use client';

import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BackgroundWrapper from '@/components/BackgroundWrapper';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { fetchAdminTournaments, spawnTournyAndParticipants } from '@/utils/adminTournamentManagement';
import { formatDateMedium } from '@/utils/dateUtils';
import { successToast, errorToast } from '@/utils/toastUtils';
import { tournamentService } from '@/services/tournamentService';

export default function AdminPage() {
  const [openDelete, setOpenDelete] = useState(null); // For delete confirmation
  const [openCreate, setOpenCreate] = useState(false); // For create dialog
  const [tournaments, setTournaments] = useState([]);
  const username = useAuthStore((state) => state.user.username);
  const [formData, setFormData] = useState({
    tournament_name: '',
    tournament_start: '',
    tournament_end: '',
    remarks: '',
    recommended_rating: 1000,
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleRatingChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      recommended_rating: parseInt(e.target.value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      status: 'upcoming',
      organiser: username,
    };

    try {
      await tournamentService.createTournament(payload);
      successToast('Tournament created successfully!');
      setOpenCreate(false);
      setFormData({
        tournament_name: '',
        tournament_start: '',
        tournament_end: '',
        remarks: '',
        recommended_rating: 1000,
      });
      loadTournaments();
    } catch (error) {
      errorToast('Failed to create tournament');
    }
  };

  const loadTournaments = async () => {
    const fetchedTournaments = await fetchAdminTournaments(username);

    // Sort tournaments based on status
    const sortedTournaments = fetchedTournaments.sort((a, b) => {
      const statusOrder = { ongoing: 0, upcoming: 1, completed: 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    });

    setTournaments(sortedTournaments);
  };

  const handleDeleteTournament = async (tournamentId) => {
    try {
      await tournamentService.deleteTournament(tournamentId);
      successToast('Tournament deleted successfully!');
      setOpenDelete(null);
      loadTournaments();
    } catch (error) {
      errorToast('Failed to delete tournament');
    }
  };

  useEffect(() => {
    loadTournaments();
  }, []);

  return (
    <BackgroundWrapper>
      <Navbar />
      <div className="flex w-full flex-grow items-start justify-center pb-10 pt-14">
        <Card className="w-full max-w-4xl rounded-lg border-none bg-[#1c1132] bg-opacity-90 shadow-lg backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="align-middle">Your Tournaments</CardTitle>
            <Button
              variant="outline"
              className="border-none bg-purple-700 text-white transition-all duration-200 hover:bg-purple-600"
              onClick={() => setOpenCreate(true)}
            >
              Create
            </Button>
            <Dialog
              open={openCreate}
              onClose={() => setOpenCreate(false)}
              className="relative z-10 rounded-lg"
            >
              <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
              <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                  <DialogPanel className="relative transform overflow-hidden rounded-lg bg-[#1c1132] text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div className="bg-[#1c1132] px-4 pb-4 pt-5 text-white sm:p-6 sm:pb-4">
                      <div className="text-center sm:text-left">
                        <DialogTitle className="text-base font-semibold leading-6 text-white">
                          Create Tournament
                        </DialogTitle>
                        <form onSubmit={handleSubmit}>
                          {/* Tournament Name Field */}
                          <div className="mb-3 mt-2 flex flex-col space-y-1.5">
                            <Label htmlFor="tournament_name">
                              Tournament Name
                            </Label>
                            <Input
                              id="tournament_name"
                              value={formData.tournament_name}
                              onChange={handleInputChange}
                              className="bg-white text-gray-700"
                              required
                            />
                          </div>

                          {/* Remarks Field */}
                          <div className="mb-3 flex flex-col space-y-1.5">
                            <Label htmlFor="remarks">Remarks</Label>
                            <Input
                              id="remarks"
                              value={formData.remarks}
                              onChange={handleInputChange}
                              className="bg-white text-gray-700"
                            />
                          </div>

                          {/* Tournament Start DateTime Field */}
                          <div className="mb-3 flex flex-col space-y-1.5">
                            <Label htmlFor="tournament_start">
                              Tournament Start DateTime
                            </Label>
                            <Input
                              id="tournament_start"
                              type="datetime-local"
                              value={formData.tournament_start}
                              onChange={handleInputChange}
                              className="bg-white text-gray-700"
                              required
                            />
                          </div>

                          {/* Tournament End DateTime Field */}
                          <div className="mb-3 flex flex-col space-y-1.5">
                            <Label htmlFor="tournament_end">
                              Tournament End DateTime
                            </Label>
                            <Input
                              id="tournament_end"
                              type="datetime-local"
                              value={formData.tournament_end}
                              onChange={handleInputChange}
                              className="bg-white text-gray-700"
                              required
                            />
                          </div>

                          {/* Recommended Rating Field */}
                          <div className="mb-3 flex flex-col space-y-1.5">
                            <Label htmlFor="recommended_rating">
                              Recommended Rating
                            </Label>
                            <select
                              id="recommended_rating"
                              value={formData.recommended_rating}
                              onChange={handleRatingChange}
                              className="rounded-md bg-white p-2 text-gray-700"
                              required
                            >
                              {Array.from(
                                { length: 16 },
                                (_, i) => 1000 + i * 100
                              ).map((value) => (
                                <option key={value} value={value}>
                                  {value}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="mt-4 flex justify-end space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              className="border border-gray-500 text-gray-500 hover:bg-gray-300/70"
                              onClick={() => setOpenCreate(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              className="bg-purple-700 text-white hover:bg-purple-600"
                            >
                              Create
                            </Button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </DialogPanel>
                </div>
              </div>
            </Dialog>
          </CardHeader>
          <CardContent>
            {tournaments.map((tournament) => (
              <Card
                key={tournament.tournament_id}
                className="mb-6 rounded-lg border-none bg-black/25 p-4 shadow-lg backdrop-blur-md"
              >
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{tournament.tournament_name}</CardTitle>
                  <Link href={`/adminTournament/${tournament.tournament_id}`}>
                    <Button
                      variant="outline"
                      className="border-none bg-purple-700 text-white transition-all duration-200 hover:bg-purple-600"
                    >
                      Details
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div>
                    <span>
                      {formatDateMedium(tournament.tournament_start)} -{' '}
                      {formatDateMedium(tournament.tournament_end)}
                    </span>
                    <div className="mt-2 text-xs">
                      Status:{' '}
                      {tournament.status === 'ongoing' ? (
                        <span className="text-yellow-200"> Ongoing</span>
                      ) : tournament.status === 'upcoming' ? (
                        <span className="text-green-200"> Upcoming</span>
                      ) : (
                        <span className="text-red-200"> Finished</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/editTournament/${tournament.tournament_id}`}>
                      <Button
                        variant="outline"
                        className="border-purple-500 text-purple-500 transition-all duration-200 hover:bg-gray-300/70"
                      >
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="border-purple-500 text-purple-500 transition-all duration-200 hover:bg-gray-300/70"
                      onClick={() => setOpenDelete(tournament.tournament_id)}
                    >
                      Delete
                    </Button>

                    {/* Confirm Delete Dialog */}
                    <Dialog
                      open={openDelete === tournament.tournament_id}
                      onClose={() => setOpenDelete(null)}
                      className="relative z-10 rounded-lg"
                    >
                      <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
                      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                          <DialogPanel className="relative transform overflow-hidden rounded-lg bg-[#1c1132] text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                            <div className="bg-[#1c1132] px-4 pb-4 pt-5 text-white sm:p-6 sm:pb-4">
                              <div className="flex items-center">
                                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                                <DialogTitle
                                  as="h3"
                                  className="ml-3 text-lg font-medium"
                                >
                                  Confirm Deletion
                                </DialogTitle>
                              </div>
                              <div className="mt-4">
                                <p>
                                  Are you sure you want to delete the
                                  tournament:{' '}
                                  <strong>{tournament.tournament_name}</strong>?
                                </p>
                                <p className="text-sm text-gray-400">
                                  This will also remove <strong>{tournament.tournament_name}</strong> from your profile. This action cannot be undone.
                                </p>
                              </div>
                            </div>
                            <div className="bg-black/25 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                              <Button
                                onClick={() =>
                                  handleDeleteTournament(
                                    tournament.tournament_id
                                  )
                                }
                                className="w-full bg-red-600 text-white hover:bg-red-500 sm:ml-3 sm:w-auto"
                              >
                                Delete
                              </Button>
                              <Button
                                onClick={() => setOpenDelete(null)}
                                variant="outline"
                                className="mt-3 w-full border border-purple-500 text-purple-500 hover:bg-gray-300/70 sm:mt-0 sm:w-auto"
                              >
                                Cancel
                              </Button>
                            </div>
                          </DialogPanel>
                        </div>
                      </div>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
          {/* <Button
            onClick={() =>
              spawnTournyAndParticipants(username)
            }
            className="w-full bg-grey-600 text-white hover:bg-black sm:ml-3 sm:w-auto"
          >
            Demo
          </Button> */}
        </Card>
      </div>
    </BackgroundWrapper>
  );
}
