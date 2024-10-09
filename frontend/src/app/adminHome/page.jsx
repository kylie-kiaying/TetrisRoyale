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
                                <CardTitle>Current Tournaments</CardTitle>
                                <span className="absolute top-3 right-5">
                                <Button variant="outline" className="bg-white text-[#1e0b38] hover:bg-gray-300/70">Create</Button>
                                </span>
                            </span>
                        </CardHeader>
                        <CardContent>
                            <Card className="justify-center bg-black/25 max-w-[1000px] backdrop-blur-md  rounded-lg shadow-lg items-center">
                                <CardHeader>
                                    <span>
                                        <CardTitle>
                                            Tournament 1
                                        </CardTitle>
                                        <span className="absolute top-5 right-14">
                                            <Button variant="outline" className="bg-white text-[#1e0b38] hover:bg-gray-300/70">Details</Button>
                                        </span>
                                    </span>
                                    <span className="text-xs inline">Status: <span className="text-xs text-yellow-200">Ongoing</span></span>
                                </CardHeader>
                                <CardContent>
                                    <span className="hidden sm:inline">Estimated Start-End Time: </span><span>25-9-2024 1300-1400</span>
                                    <span className="absolute bottom-4 right-5">  
                                        <Button variant="outline" className="bg-white text-[#1e0b38] hover:bg-gray-300/70">Edit</Button>
                                        <Button variant="outline" className="ml-2 bg-white text-[#1e0b38] hover:bg-gray-300/70">Delete</Button>
                                    </span>
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}