"use client"

import Navbar from '@/components/Navbar.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

const tournaments = [
  {
    tournament_id: '1',
    tournament_name: 'Tetris Championship',
    tournament_start: '2024-11-12T19:30',
    tournament_end: '2024-11-25T21:00',
    remarks: 'Champions of Tetris!',
    status: 'Ongoing',
  },
  {
    tournament_id: '2',
    tournament_name: 'Spring Showdown',
    tournament_start: '2025-01-1T13:30',
    tournament_end: '2025-01-5T15:30',
    remarks: 'Showdown of Spring!',
    status: 'Upcoming',
  },
  {
    tournament_id: '3',
    tournament_name: 'Championship Series 1',
    tournament_start: '2024-06-1T09:30',
    tournament_end: '2024-06-1T11:30',
    remarks: 'Series of Champions!',
    status: 'Finished',
  },
];

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function convertDateTime(datetime) {
    let t = datetime.indexOf('T');
    let dateStr = datetime.substring(0, t);
    let date = dateStr.split("-");
    let time = datetime.substring(t+1);
    return date[2] + " " + months[Number(date[1]) - 1] + " " + date[0] + " " + time;
}



export default function AdminPage() {
  let [openDelete, setOpenDelete] = useState(undefined);
  let [create, setCreate] = useState(false);
  let [openEdit, setOpenEdit] = useState(undefined);

  const handleCloseDelete = () => setOpenDelete(undefined);
  const handleCloseEdit = () => setOpenEdit(undefined); 

  return (
    <div
      className="flex min-h-screen flex-col items-center bg-cover bg-fixed bg-center bg-no-repeat px-4"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(11, 5, 29, 0.95), rgba(28, 17, 50, 0.95)), url('/bgpic.png')",
      }}
    >
      <div className="w-full">
        <Navbar />
      </div>
      <div className="flex w-full flex-grow items-start justify-center pb-10 pt-14">
        <Card className="w-full max-w-4xl rounded-lg border-none bg-[#1c1132] bg-opacity-90 shadow-lg backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="align-middle">Your Tournaments</CardTitle>
            <Button
              variant="outline"
              className="border-none bg-purple-700 text-white transition-all duration-200 hover:bg-purple-600"
              onClick={() => setCreate(true)}
            >
              Create
            </Button>
            <Dialog open={create} onClose={() => setCreate(false)} className="relative z-10 rounded-lg">
              <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
              />

              <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                  <DialogPanel
                    transition
                    className="relative transform overflow-hidden rounded-lg bg-[#1c1132] text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                  >
                    <div className="bg-[#1c1132] px-4 pb-4 pt-5 sm:p-6 sm:pb-4 text-white">
                      <div className="sm:items-start">
                        <div className="mt-3 text-center sm:mt-0 sm:text-left">
                          <DialogTitle as="h3" className="text-base font-semibold leading-6 text-white">
                            Create Tournament
                          </DialogTitle>
                          <div className="mt-2">
                            <div className="flex flex-col space-y-1.5 mb-3">
                              <Label htmlFor="name">Tournament Name</Label>
                              <Input id="name" placeholder="" />
                            </div>
                            <div className="flex flex-col space-y-1.5 mb-3">
                              <Label htmlFor="remark">Remarks</Label>
                              <Input id="remark" placeholder="" />
                            </div>
                            <div className="flex flex-col space-y-1.5 mb-3 w-fit">
                              <Label htmlFor="startTime">Tournament Start DateTime</Label>
                              <Input id="startTime" type="datetime-local" />
                            </div>
                            <div className="flex flex-col space-y-1.5 mb-3 w-fit">
                              <Label htmlFor="endTime">Tournament End DateTime</Label>
                              <Input id="endTime" type="datetime-local" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-black/25 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button
                        type="button"
                        onClick={() => setCreate(false)}
                        className="inline-flex w-full justify-center rounded-md bg-purple-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-600 sm:ml-3 sm:w-auto"
                      >
                        Create
                      </button>
                      <button
                        type="button"
                        data-autofocus
                        onClick={() => setCreate(false)}
                        className="mt-3 border border-purple-500 text-purple-500 transition-all duration-200 hover:bg-gray-300/70 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm sm:mt-0 sm:w-auto"
                      >
                        Cancel
                      </button>
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
                  <Link href="/adminTournament">
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
                      {convertDateTime(tournament.tournament_start)} -{' '}
                      {convertDateTime(tournament.tournament_end)}
                    </span>
                    <div className="mt-2 text-xs">
                      Status:{' '}
                      {tournament.status === 'Ongoing' ? (
                        <span className="text-yellow-200"> Ongoing</span>
                      ) : tournament.status === 'Upcoming' ? (
                        <span className="text-green-200"> Upcoming</span>
                      ) : (
                        <span className="text-red-200"> Finished</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="border-purple-500 text-purple-500 transition-all duration-200 hover:bg-gray-300/70"
                      onClick={() => setOpenEdit(tournament.tournament_id)}
                    >
                      Edit
                    </Button>
                    <Dialog open={openEdit === tournament.tournament_id} onClose={handleCloseEdit} className="relative z-10 rounded-lg">
                      <DialogBackdrop
                        transition
                        className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
                      />

                      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                          <DialogPanel
                            transition
                            className="relative transform overflow-hidden rounded-lg bg-[#1c1132] text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                          >
                            <div className="bg-[#1c1132] px-4 pb-4 pt-5 sm:p-6 sm:pb-4 text-white">
                              <div className="sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                                  <DialogTitle as="h3" className="text-base font-semibold leading-6 text-white">
                                    Edit Tournament
                                  </DialogTitle>
                                  <div className="mt-2">
                                    <div className="flex flex-col space-y-1.5 mb-3">
                                      <Label htmlFor={"name" + tournament.tournament_id}>Tournament Name</Label>
                                      <Input id={"name" + tournament.tournament_id} defaultValue={tournament.tournament_name}/>
                                    </div>
                                    <div className="flex flex-col space-y-1.5 mb-3">
                                      <Label htmlFor={"remark" + tournament.tournament_id}>Remarks</Label>
                                      <Input id={"remark" + tournament.tournament_id} defaultValue={tournament.remarks}/>
                                    </div>
                                    <div className="flex flex-col space-y-1.5 mb-3 w-fit">
                                      <Label htmlFor={"startTime" + tournament.tournament_id} >Tournament Start DateTime</Label>
                                      <Input id={"startTime" + tournament.tournament_id} type="datetime-local" defaultValue={tournament.tournament_start}/>
                                    </div>
                                    <div className="flex flex-col space-y-1.5 mb-3 w-fit">
                                      <Label htmlFor={"endTime" + tournament.tournament_id}>Tournament End DateTime</Label>
                                      <Input id={"endTime" + tournament.tournament_id} type="datetime-local" defaultValue={tournament.tournament_end}/>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="bg-black/25 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                              <button
                                type="button"
                                onClick={() => setOpenEdit(undefined)}
                                className="inline-flex w-full justify-center rounded-md bg-purple-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-600 sm:ml-3 sm:w-auto"
                              >
                                Create
                              </button>
                              <button
                                type="button"
                                data-autofocus
                                onClick={() => setOpenEdit(undefined)}
                                className="mt-3 border border-purple-500 text-purple-500 transition-all duration-200 hover:bg-gray-300/70 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm sm:mt-0 sm:w-auto"
                              >
                                Cancel
                              </button>
                            </div>
                          </DialogPanel>
                        </div>
                      </div>
                    </Dialog>
                    <>
                      <Button
                        variant="outline"
                        className="border-purple-500 text-purple-500 transition-all duration-200 hover:bg-gray-300/70"
                        onClick={() => setOpenDelete(tournament.tournament_id)}
                      >
                        Delete
                      </Button>
                      <Dialog open={openDelete === tournament.tournament_id} onClose={handleCloseDelete} className="relative z-10 rounded-lg">
                        <DialogBackdrop
                          transition
                          className="fixed inset-0 bg-gray-500 bg-opacity-10 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
                        />

                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <DialogPanel
                              transition
                              className="relative transform overflow-hidden rounded-lg bg-[#1c1132] text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                            >
                              <div className="bg-[#1c1132] px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <ExclamationTriangleIcon aria-hidden="true" className="h-6 w-6 text-red-600" />
                                  </div>
                                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                    <DialogTitle as="h3" className="text-base font-semibold leading-6 text-white">
                                      Delete {tournament.tournament_name}
                                    </DialogTitle>
                                    <div className="mt-2">
                                      <p className="text-sm text-gray-500">
                                        Are you sure you want to delete this tournament? All of its data will be permanently removed.
                                        This action cannot be undone.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-black/25 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                  type="button"
                                  onClick={() => setOpenDelete(false)}
                                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                >
                                  Delete
                                </button>
                                <button
                                  type="button"
                                  data-autofocus
                                  onClick={() => setOpenDelete(false)}
                                  className="mt-3 border border-purple-500 text-purple-500 transition-all duration-200 hover:bg-gray-300/70 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                >
                                  Cancel
                                </button>
                              </div>
                            </DialogPanel>
                          </div>
                        </div>
                      </Dialog>
                    </>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
