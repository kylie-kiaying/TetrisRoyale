import Navbar from '@/components/Navbar.jsx';

export default function PlayerProfile() {
    return (
        <div className="min-h-screen flex flex-col items-center px-4 bg-fixed bg-center bg-cover bg-no-repeat text-white"
                style={{
                    backgroundImage: "linear-gradient(to bottom, rgba(11, 5, 29, 0.95), rgba(28, 17, 50, 0.95)), url('/bgpic.png')"
                }}>
            {/* Navbar */}
            <div className="w-full sticky top-0 z-50 flex justify-center">
            <Navbar></Navbar>
            </div>

            {/* Profile Section */}
            <div className="flex flex-col items-center justify-start h-[calc(100vh-80px)] py-10 mt-14">
                {/* Profile Card */}
                <div className="w-[90%] max-w-4xl flex flex-col items-center p-8 bg-[#1c1132] rounded-lg shadow-md space-y-6">
                    {/* Profile Picture */}
                    <div className="relative w-40 h-40 rounded-full border-4 border-[#6d28d9] overflow-hidden flex items-center justify-center bg-gray-500 group">
                        {/* Profile Image */}
                        <img
                            src="/user.png"
                            alt="Profile Picture"
                            className="object-cover w-full h-full group-hover:opacity-50 transition-opacity duration-200"
                        />

                        {/* Edit Icon on Hover */}
                        <img
                            src="/edit-icon.png"
                            alt="Edit Profile"
                            className="absolute w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        />
                    </div>

                    <div className='flex flex-col items-center space-y-4 w-full'>
                        {/* Username */}
                        <h1 className="text-4xl font-semibold">Username</h1>
                    
                        <div className="flex flex-row justify-between items-center w-full px-6">
                            {/* ELO */}
                            <p className="text-2xl text-gray-400">ELO: 1234</p>
                            <div className="flex flex-col items-center">
                                <p className="text-base text-gray-400">Matches won: 2</p>
                                <p className="text-base text-gray-400">Matches lost: 0</p>
                                <p className="text-base text-gray-400">Winrate: 100% </p>
                            </div>
                            </div>

                    </div>
                    {/* Future Analytics Section */}
                    <div className="mt-8 w-full p-6 bg-[#2c1f4c] rounded-lg">
                        <h2 className="text-xl font-bold mb-4">ELO Analytics</h2>
                        <p className="text-gray-300">ELO history graph and other analytics will be displayed here.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
