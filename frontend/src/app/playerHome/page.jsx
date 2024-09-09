import Navbar from '@/components/Navbar.jsx';

export default function EmptyPage() {
    return (
      <div className="min-h-screen bg-[#0b051d]">

        {/* Navbar */}
        <Navbar></Navbar>

        {/* Main content */}
        <div className="flex justify-center items-center h-full text-white">
          <h1 className="text-4xl font-bold">Content Here</h1>
        </div>

      </div>
    );
  }