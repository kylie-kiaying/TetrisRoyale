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

const match = [
    {player1_id: 3, player2_id: 4, status:"Finished", winner_id: 3}
];

const players = [
    {user_id: 3, username: "P3"},
    {user_id: 4, username: "P4"},
];

export default function matchPage() {
    return (
        <div className="min-h-screen bg-[#0b051d] items-center">
            <div className='h-screen text-white align-middle'>
                <Navbar></Navbar>
                <div className="flex justify-center min-w-full items-start h-screen bg-[#0b051d] pt-14">
                        <Card className="bg-opacity-40 w-[1000px] max-w-screen-xl backdrop-blur-md  rounded-lg shadow-lg items-center">
                            <CardHeader>
                                <span>
                                    <CardTitle>Match Name</CardTitle>
                                    <span className="absolute top-3 right-5">
                                    <Button variant="outline" className="bg-white text-[#1e0b38] hover:bg-gray-300/70 mr-1">Edit</Button>
                                    <Button variant="outline" className="bg-white text-[#1e0b38] hover:bg-gray-300/70">Delete</Button>
                                    </span>
                                </span>
                            </CardHeader>
                            {match.map(function(data, i){
                                return <CardContent className="grid grid-cols-5 gap-4 text-center" key={i}> 
                                    {(data.status === "Finished" && data.winner_id === data.player1_id)
                                    ? <div className="col-start-2"><img src="/trophyOn.png" className="inline w-7 mr-1"></img> {players.find((player) => player.user_id === data.player1_id).username} (Win)</div>
                                    : <div className="col-start-2"><img src="/trophyOff.png" className="inline w-7 mr-1"></img> {players.find((player) => player.user_id === data.player1_id).username} (Lose)</div>
                                    }
                                    <div className="col-start-3">
                                        vs
                                    </div>
                                    <div className="col-start-4">
                                    {(data.status === "Finished" && data.winner_id === data.player2_id)
                                        ? <div className="col-start-2"> {players.find((player) => player.user_id === data.player2_id).username} (Win)<img src="/trophyOn.png" className="inline w-7 ml-1"></img></div>
                                        : <div className="col-start-2"> {players.find((player) => player.user_id === data.player2_id).username} (Lose)<img src="/trophyOff.png" className="inline w-7 ml-1"></img></div>
                                    }
                                    </div>
                                </CardContent>
                            })}
                        </Card>
                </div>
            </div>
        </div>
    )
}