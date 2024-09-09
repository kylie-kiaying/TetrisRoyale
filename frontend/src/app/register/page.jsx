import { Button } from "@/components/ui/button";
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

export default function LoginPage() {
    return (
        <div className="flex justify-center items-center h-screen bg-[#0b051d]">
            <Card className="bg-opacity-40 w-[350px] max-w-md backdrop-blur-md  rounded-lg shadow-lg items-center">
                <CardHeader>
                    <CardTitle >Register new account</CardTitle>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                {/* <Label htmlfor="userType" >I am a</Label> */}
                                <Select>
                                    <SelectTrigger id="userType">
                                        <SelectValue  placeholder="I am a..."></SelectValue>
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="admin">Tournament Organizer</SelectItem>
                                        <SelectItem value="player">Competitive Player</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">User ID</Label>
                            <Input id="name" placeholder="Your unique username" />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" placeholder="8-16 Alphanumeric Characters" />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input id="password" type="password" placeholder="Enter your password again" />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col items-start space-y-2">
                    <div className = "flex w-full space-x-2 items-center justify-center ">
                        <Link href="/">
                            <Button variant="outline" className=" text-white bg-[#1e0b38] hover:bg-gray-300/70"> Cancel</Button>
                        </Link>
                        <Button variant="outline" className= " bg-white text-[#1e0b38] hover:bg-gray-300/70">Register </Button>
                    </div>
                </CardFooter>   
            </Card>
      </div>
    );
  }