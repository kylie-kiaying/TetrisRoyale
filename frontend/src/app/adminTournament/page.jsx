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

export default function adminPage() {
    return (
        <div className="min-h-screen bg-[#0b051d] items-center">
            <div className='h-screen text-white align-middle'>
                <Navbar></Navbar>
                <div className="flex justify-center min-w-full items-start h-screen bg-[#0b051d] pt-14">
                    <Card className="bg-opacity-40 w-[1000px] max-w-screen-xl backdrop-blur-md  rounded-lg shadow-lg items-center">
                        <CardHeader>
                            <span>
                                <CardTitle>Tournament 1</CardTitle>
                            </span>
                        </CardHeader>
                        <CardContent>
                            <Card className="justify-center bg-black/25 max-w-[1000px] backdrop-blur-md  rounded-lg shadow-lg items-center">
                                <CardHeader>
                                    <span className="absolute top-3 right-48">
                                        <CardTitle>Match List</CardTitle>
                                    </span>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-row-reverse mt-2">
                                        <span className="bg-black">
                                            Upcoming
                                        </span>
                                        <span className="pr-52 justify-center bg-black max-w-[1000px] backdrop-blur-md  rounded-lg shadow-lg items-right">
                                            P1 vs P2
                                        </span>
                                    </div>
                                    <div className="flex flex-row-reverse mt-2">
                                        <span className="bg-black">
                                            Finished
                                        </span>
                                        <span className="pr-52 justify-center bg-black max-w-[1000px] backdrop-blur-md  rounded-lg shadow-lg items-right">
                                            <span className="text-green-200">P3 (Win)</span> vs <span className="text-red-200">P4 (Lose)</span>
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}