import Navbar from '@/components/Navbar.jsx';
import { DataTable } from '@/components/ui/data-table';

const matchHistory = [
    {
        id: "1",
        opponent: "Username2",
        opponent_img: "/user.png",
        result: "Win",
        tournament: "Tetris Championship",
        date: "October 5, 2024",
        pieces_placed: 101,
        pps: 5.97,
        kpp: 2.85,
        apm: 50,
        finesse_percentage: "98.02%",
        lines_cleared: 40
    },
    {
        id: "2",
        opponent: "Username3",
        opponent_img: "/user.png",
        result: "Lost",
        tournament: "Spring Showdown",
        date: "June 1, 2024",
        pieces_placed: 95,
        pps: 5.50,
        kpp: 3.01,
        apm: 45,
        finesse_percentage: "95.00%",
        lines_cleared: 38
    },
];

export default function PlayerProfile() {
    return (
        <div className="min-h-screen flex flex-col items-center px-4 bg-fixed bg-center bg-cover bg-no-repeat text-white"
            style={{
                backgroundImage: "linear-gradient(to bottom, rgba(11, 5, 29, 0.95), rgba(28, 17, 50, 0.95)), url('/bgpic.png')"
            }}
        >
            {/* Navbar */}
            <div className="w-full sticky top-0 z-50 flex justify-center">
                <Navbar />
            </div>

            {/* Profile Section */}
            <div className="flex flex-col items-center justify-start py-10 mt-8 w-full space-y-6">
                {/* Profile Card */}
                <div className="w-full max-w-4xl flex flex-col items-center p-6 md:p-8 bg-[#1c1132] rounded-lg shadow-md space-y-6 mx-4">
                    {/* Profile Picture */}
                    <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#6d28d9] overflow-hidden flex items-center justify-center bg-gray-500 group">
                        <img src="/user.png" alt="Profile Picture" className="object-cover w-full h-full group-hover:opacity-50 transition-opacity duration-200" />
                    </div>

                    <div className='flex flex-col items-center space-y-4 w-full px-2'>
                        <h1 className="text-3xl md:text-4xl font-semibold">Username</h1>
                        <div className="flex flex-col md:flex-row justify-between items-center w-full md:px-6 space-y-4 md:space-y-0">
                            <p className="text-xl md:text-2xl text-gray-400">ELO: 1234</p>
                            <div className="flex flex-col items-center md:items-start space-y-2">
                                <p className="text-base md:text-lg text-gray-400">Matches won: 1</p>
                                <p className="text-base md:text-lg text-gray-400">Matches lost: 1</p>
                                <p className="text-base md:text-lg text-gray-400">Winrate: 50%</p>
                            </div>
                        </div>
                    </div>

                    {/* ELO Analytics Section */}
                    <div className="w-full p-4 md:p-6 bg-[#2c1f4c] rounded-lg">
                        <h2 className="text-lg md:text-xl font-bold mb-4">ELO Analytics</h2>
                        <p className="text-gray-300 text-sm md:text-base">ELO history graph and other analytics will be displayed here.</p>
                    </div>

                    {/* Match History Section */}
                    <div className="w-full bg-[#1c1132] p-4 md:p-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
                        <h2 className="text-lg md:text-2xl font-semibold text-white mb-4 text-center">Match History</h2>
                        <div className="overflow-x-auto w-full custom-scrollbar">
                            <div className="min-w-[600px]">
                                <DataTable type="match_history" data={matchHistory} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
