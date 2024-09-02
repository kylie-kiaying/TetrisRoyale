import { Button } from "@/components/ui/button";

export default function Home() {
  return (

    <div className="relative h-screen w-full overflow-hidden">
        <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover">
            <source src="/bgvid.mp4" type="video/mp4" />
            Your browser does not support the video tag
        </video>
    </div>

    
    <div className="relative z-10 flex flex-col justify-center items-center h-full">
        <h1 className="text-white text-6xl font-bebas mb-12"> Welcome to TetriTracker</h1>
        <div className="flex space-x-4">
            <Button className="bg-white text-[#1e0b38] hover:bg-gray-200 font-bold py-2 px-4 rounded" >
                Sign in
            </Button>
            <Button className="bg-white text-[#1e0b38] hover:bg-gray-200 font-bold py-2 px-4 rounded" >
                Register new account
            </Button>
        </div>
    </div>

     {/* Overlay for darker effect */}
     <div className="absolute inset-0 bg-black opacity-50"></div>
     </div>

  );
}
