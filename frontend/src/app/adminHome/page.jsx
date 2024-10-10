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

const tournaments = [
    { tournament_id: "1", tournament_name: "Tetris Championship", tournament_start: "June 1", tournament_end: "June 10", status: "Ongoing"},
    { tournament_id: "2", tournament_name: "Spring Showdown", tournament_start: "October 5", tournament_end: "October 15", status: "Upcoming"},
    { tournament_id: "3", tournament_name: "Championship Series 1", tournament_start: "May 25", tournament_end: "May 31", status: "Finished"}
];

export default function adminPage() {
    return (
        <div className="min-h-screen bg-[#0b051d] items-center">
            <div className='h-screen text-white align-middle'>
                <Navbar></Navbar>
                <div className="flex justify-center min-w-full items-start h-screen bg-[#0b051d] pt-14">
                        <Card className="bg-opacity-40 w-[1000px] max-w-screen-xl backdrop-blur-md  rounded-lg shadow-lg items-center">
                            <CardHeader>
                                <span>
                                    <CardTitle>Current Tournaments</CardTitle>
                                    <span className="absolute top-3 right-5">
                                    <Button variant="outline" className="bg-white text-[#1e0b38] hover:bg-gray-300/70">Create</Button>
                                    </span>
                                </span>
                            </CardHeader>
                            <CardContent>
                            {tournaments.map(function(tournament){
                                return <Card className="justify-center bg-black/25 max-w-[1000px] backdrop-blur-md  rounded-lg shadow-lg items-center mb-8" key={tournament.tournament_id}>
                                            <CardHeader>
                                                <span>
                                                    <CardTitle>
                                                        {tournament.tournament_name}
                                                    </CardTitle>
                                                    <span className="absolute top-5 right-14">
                                                        <Button variant="outline" className="bg-white text-[#1e0b38] hover:bg-gray-300/70">Details</Button>
                                                    </span>
                                                </span>
                                                <span className="text-xs inline">Status: 
                                                    {tournament.status === "Ongoing"
                                                    ? <span className="text-xs text-yellow-200"> Ongoing</span>
                                                    : tournament.status === "Upcoming"
                                                    ? <span className="text-xs text-green-200"> Upcoming</span>
                                                    : <span className="text-xs text-red-200"> Finished</span>
                                                    }
                                                    
                                                </span>
                                            </CardHeader>
                                            <CardContent>
                                                <span className="hidden sm:inline">Estimated Start-End Date: </span><span>{tournament.tournament_start} - {tournament.tournament_end}</span>
                                                <span className="absolute bottom-4 right-5">  
                                                    <Button variant="outline" className="bg-white text-[#1e0b38] hover:bg-gray-300/70">Edit</Button>
                                                    <Button variant="outline" className="ml-2 bg-white text-[#1e0b38] hover:bg-gray-300/70">Delete</Button>
                                                </span>
                                            </CardContent>
                                        </Card>
                                })}
                            </CardContent>
                        </Card>
                </div>
            </div>
        </div>
    );
}