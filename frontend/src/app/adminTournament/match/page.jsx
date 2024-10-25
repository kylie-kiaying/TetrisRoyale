'use client';

import Navbar from '@/components/Navbar.jsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import React from 'react';

const match = [
  { player1_id: 3, player2_id: 4, status: 'Finished', winner_id: 3 },
];

const players = [
  { user_id: 3, username: 'P3' },
  { user_id: 4, username: 'P4' },
];

function clickTrophyP1() {
  if (document.getElementById('player1').src.match(/trophyOn\.png$/)) {
    document.getElementById('player1').src = '/trophyOff.png';
    document.getElementById('player1div').lastChild.data = players.find(
      (player) => player.user_id === match[0].player1_id
    ).username;

    document.getElementById('player2div').firstChild.data = players.find(
      (player) => player.user_id === match[0].player2_id
    ).username;
  } else {
    document.getElementById('player1').src = '/trophyOn.png';
    document.getElementById('player1div').lastChild.data =
      players.find((player) => player.user_id === match[0].player1_id)
        .username + ' (Win)';

    document.getElementById('player2').src = '/trophyOff.png';
    document.getElementById('player2div').firstChild.data =
      players.find((player) => player.user_id === match[0].player2_id)
        .username + ' (Lose)';
  }
}

function clickTrophyP2() {
  if (document.getElementById('player2').src.match(/trophyOn\.png$/)) {
    document.getElementById('player2').src = '/trophyOff.png';
    document.getElementById('player1div').lastChild.data = players.find(
      (player) => player.user_id === match[0].player1_id
    ).username;

    document.getElementById('player2div').firstChild.data = players.find(
      (player) => player.user_id === match[0].player2_id
    ).username;
  } else {
    document.getElementById('player1').src = '/trophyOff.png';
    document.getElementById('player1div').lastChild.data =
      players.find((player) => player.user_id === match[0].player1_id)
        .username + ' (Lose)';

    document.getElementById('player2').src = '/trophyOn.png';
    document.getElementById('player2div').firstChild.data =
      players.find((player) => player.user_id === match[0].player2_id)
        .username + ' (Win)';
  }
}

export default function matchPage() {
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
        <Card className="w-[1000px] max-w-screen-xl items-center rounded-lg border-none shadow-lg backdrop-blur-md">
          <CardHeader>
            <span>
              <CardTitle>Match Name</CardTitle>
              <span className="absolute right-5 top-3">
                <Button
                  variant="outline"
                  className="border-none bg-purple-700 text-white transition-all duration-200 hover:bg-purple-600"
                >
                  Submit Result
                </Button>
                <Button
                  variant="outline"
                  className="ml-2 border-none bg-purple-700 text-white transition-all duration-200 hover:bg-purple-600"
                >
                  Delete Match
                </Button>
              </span>
            </span>
          </CardHeader>
          {match.map(function (data, i) {
            return (
              <CardContent
                className="grid grid-cols-5 gap-4 text-center"
                key={i}
              >
                {data.status === 'Finished' ? (
                  data.winner_id === data.player1_id ? (
                    <div className="col-start-2" id="player1div">
                      <img
                        id="player1"
                        onClick={clickTrophyP1}
                        src="/trophyOn.png"
                        className="mr-1 inline w-7"
                      />{' '}
                      {players.find(
                        (player) => player.user_id === data.player1_id
                      ).username + ' (Win)'}
                    </div>
                  ) : (
                    <div className="col-start-2" id="player1div">
                      <img
                        id="player1"
                        onClick={clickTrophyP1}
                        src="/trophyOff.png"
                        className="mr-1 inline w-7"
                      />
                      {players.find(
                        (player) => player.user_id === data.player1_id
                      ).username + ' (Lose)'}
                    </div>
                  )
                ) : (
                  <div className="col-start-2" id="player1div">
                    <img
                      id="player1"
                      onClick={clickTrophyP1}
                      src="/trophyOff.png"
                      className="mr-1 inline w-7"
                    />
                    {
                      players.find(
                        (player) => player.user_id === data.player1_id
                      ).username
                    }
                  </div>
                )}
                <div className="col-start-3">vs</div>
                <div className="col-start-4">
                  {data.status === 'Finished' ? (
                    data.winner_id === data.player2_id ? (
                      <div className="col-start-2" id="player2div">
                        {players.find(
                          (player) => player.user_id === data.player2_id
                        ).username + ' (Win)'}{' '}
                        <img
                          onClick={clickTrophyP2}
                          id="player2"
                          src="/trophyOn.png"
                          className="ml-1 inline w-7"
                        />
                      </div>
                    ) : (
                      <div className="col-start-2" id="player2div">
                        {players.find(
                          (player) => player.user_id === data.player2_id
                        ).username + ' (Lose)'}{' '}
                        <img
                          onClick={clickTrophyP2}
                          id="player2"
                          src="/trophyOff.png"
                          className="ml-1 inline w-7"
                        />
                      </div>
                    )
                  ) : (
                    <div className="col-start-2" id="player2div">
                      {
                        players.find(
                          (player) => player.user_id === data.player2_id
                        ).username
                      }{' '}
                      <img
                        onClick={clickTrophyP2}
                        id="player2"
                        src="/trophyOff.png"
                        className="ml-1 inline w-7"
                      />
                    </div>
                  )}
                </div>
                <div className="col-span-3 col-start-2">
                  Click the trophy to toggle winner, then submit using the
                  button
                </div>
              </CardContent>
            );
          })}
        </Card>
      </div>
    </div>
  );
}
