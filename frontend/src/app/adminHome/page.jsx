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
        <div className="min-h-full flex flex-col items-center px-4 bg-fixed bg-center bg-cover bg-no-repeat bg-top"
                style={{
                    backgroundImage: "linear-gradient(to bottom, rgba(11, 5, 29, 0.95), rgba(28, 17, 50, 0.95)), url('/bgpic.png')",
                    minHeight: "100%"
                }}>
            <div className='h-screen text-white align-middle'>
                <Navbar></Navbar>
                <div className="flex justify-center rounded-lg shadow-lg min-w-full items-start h-screen bg-[#0b051d] pt-14">
                        <Card className="border-0 bg-[#1c1132] w-[1000px] max-w-screen-xl backdrop-blur-md  rounded-lg shadow-lg items-center">
                            <CardHeader>
                                <span>
                                    <CardTitle>Current Tournaments</CardTitle>
                                    <span className="absolute top-3 right-5">
                                    <Button variant="outline" className="border-0 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 transition-all duration-200 bg-purple-700 text-white">Create</Button>
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
                                                        <Button variant="outline" className="border-0 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 transition-all duration-200 bg-purple-700 text-white">Details</Button>
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
                                                    <Button variant="outline" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 transition-all duration-200 border-purple-500 text-purple-500">Edit</Button>
                                                    <Button variant="outline" className="ml-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 transition-all duration-200 border-purple-500 text-purple-500">Delete</Button>
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