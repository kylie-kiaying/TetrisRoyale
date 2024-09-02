import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";

export default function Home() {
  return (

    <div className="relative h-screen w-full overflow-hidden">
        {/* Background Video */}
        <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover">
            <source src="/bgvid.mp4" type="video/mp4" />
            Your browser does not support the video tag
        </video>

    
    {/* Content */}
    <div className="relative z-10 flex flex-col justify-center items-center h-full">
        <h1 className="text-white text-6xl font-bebas mb-12"> Welcome to TetriTracker</h1>
        <div className="flex space-x-4">
        <DropdownMenu>
            <DropdownMenuTrigger>
            <Button className="bg-white text-[#1e0b38] hover:bg-gray-200 font-bold py-2 px-4 rounded" >
                Sign in
            </Button>
            </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Sign in as</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Tournament Organizer</DropdownMenuItem>
                    <DropdownMenuItem>Player</DropdownMenuItem>
                </DropdownMenuContent>
</DropdownMenu>
            
            <Button className="bg-white text-[#1e0b38] hover:bg-gray-200 font-bold py-2 px-4 rounded" >
                Register new account
            </Button>
        </div>
    </div>

     {/* Overlay for darker effect */}
     <div className="absolute inset-0 bg-[#140221] opacity-80"></div>
     </div>

  );
}
