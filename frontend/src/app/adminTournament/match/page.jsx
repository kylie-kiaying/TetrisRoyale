"use client";

import Navbar from '@/components/Navbar.jsx';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import React from 'react';

const match = [
    {player1_id: 3, player2_id: 4, status:"Finished", winner_id: 3}
];

const players = [
    {user_id: 3, username: "P3"},
    {user_id: 4, username: "P4"},
];

function clickTrophyP1(){
    if (document.getElementById("player1").src.match(/trophyOn\.png$/)) {
        document.getElementById("player1").src = "/trophyOff.png";
        document.getElementById("player1div").lastChild.data = players.find((player) => player.user_id === match[0].player1_id).username;

        document.getElementById("player2div").firstChild.data = players.find((player) => player.user_id === match[0].player2_id).username;
    }
    else {
        document.getElementById("player1").src = "/trophyOn.png";
        document.getElementById("player1div").lastChild.data = players.find((player) => player.user_id === match[0].player1_id).username + " (Win)";

        document.getElementById("player2").src = "/trophyOff.png";
        document.getElementById("player2div").firstChild.data = players.find((player) => player.user_id === match[0].player2_id).username + " (Lose)";
    }
}

function clickTrophyP2(){
    if (document.getElementById("player2").src.match(/trophyOn\.png$/)) {
        document.getElementById("player2").src = "/trophyOff.png";
        document.getElementById("player1div").lastChild.data = players.find((player) => player.user_id === match[0].player1_id).username;

        document.getElementById("player2div").firstChild.data = players.find((player) => player.user_id === match[0].player2_id).username;
    }
    else {
        document.getElementById("player1").src = "/trophyOff.png";
        document.getElementById("player1div").lastChild.data = players.find((player) => player.user_id === match[0].player1_id).username + " (Lose)";

        document.getElementById("player2").src = "/trophyOn.png";
        document.getElementById("player2div").firstChild.data = players.find((player) => player.user_id === match[0].player2_id).username + " (Win)";
    }
}

export default function matchPage() {
    return (
        <div className="min-h-screen flex flex-col items-center px-4 bg-fixed bg-center bg-cover bg-no-repeat"
        style={{
            backgroundImage: "linear-gradient(to bottom, rgba(11, 5, 29, 0.95), rgba(28, 17, 50, 0.95)), url('/bgpic.png')"
        }}>
            <div className='w-full'>
                <Navbar />
            </div>
                <div className="flex justify-center w-full items-start flex-grow pt-14 pb-10">
                        <Card className="border-none w-[1000px] max-w-screen-xl backdrop-blur-md  rounded-lg shadow-lg items-center">
                            <CardHeader>
                                <span>
                                    <CardTitle>Match Name</CardTitle>
                                    <span className="absolute top-3 right-5">
                                    <Button variant="outline" className="bg-purple-700 border-none text-white hover:bg-purple-600 transition-all duration-200">Submit Result</Button>
                                    <Button variant="outline" className="bg-purple-700 border-none text-white hover:bg-purple-600 transition-all duration-200 ml-2">Delete Match</Button>
                                    </span>
                                </span>
                            </CardHeader>
                            {match.map(function(data, i){
                                return <CardContent className="grid grid-cols-5 gap-4 text-center" key={i}> 
                                    {data.status === "Finished" ? data.winner_id === data.player1_id
                                    ? <div className="col-start-2" id="player1div"><img id="player1" onClick={clickTrophyP1} src="/trophyOn.png" className="inline w-7 mr-1"/> {players.find((player) => player.user_id === data.player1_id).username + " (Win)"}</div>
                                    : <div className="col-start-2" id="player1div"><img id="player1" onClick={clickTrophyP1} src="/trophyOff.png" className="inline w-7 mr-1"/>{players.find((player) => player.user_id === data.player1_id).username + " (Lose)"}</div>
                                    : <div className="col-start-2" id="player1div"><img id="player1" onClick={clickTrophyP1} src="/trophyOff.png" className="inline w-7 mr-1"/>{players.find((player) => player.user_id === data.player1_id).username}</div>
                                    }
                                    <div className="col-start-3">
                                        vs
                                    </div>
                                    <div className="col-start-4">
                                    {data.status === "Finished" ? data.winner_id === data.player2_id
                                        ? <div className="col-start-2" id="player2div">{players.find((player) => player.user_id === data.player2_id).username + " (Win)"} <img onClick={clickTrophyP2} id="player2" src="/trophyOn.png" className="inline w-7 ml-1"/></div>
                                        : <div className="col-start-2" id="player2div">{players.find((player) => player.user_id === data.player2_id).username + " (Lose)"} <img onClick={clickTrophyP2} id="player2" src="/trophyOff.png" className="inline w-7 ml-1"/></div>
                                        : <div className="col-start-2" id="player2div">{players.find((player) => player.user_id === data.player2_id).username} <img onClick={clickTrophyP2} id="player2" src="/trophyOff.png" className="inline w-7 ml-1"/></div>
                                    }
                                    </div>
                                    <div className="col-start-2 col-span-3">Click the trophy to toggle winner, then submit using the button</div>
                                </CardContent>
                            })}
                        </Card>
                </div>
            </div>
    )
}