"use client";


import { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // Correct import to get the pathname
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { IoTrophy, IoSearch, IoPerson, IoMenu, IoClose } from 'react-icons/io5';
import { PiRankingBold } from "react-icons/pi";
import { IoNotifications } from "react-icons/io5";
import { useAuthStore } from "@/store/authStore";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname(); // Get the current pathname
  const [playerData, setPlayerData] = useState({ name: "User Name", elo: 1234 }); // State for player details
  const token = useAuthStore((state) => state.token); // Get the JWT token from the auth store
  const username = useAuthStore((state) => state.username); // Get username from the auth store

  // Toggle function for the menu
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Check if the current route matches the link path
  const isActive = (path) => pathname === path;

  // TODO: NOT WORKING AS INTENEDD Fetch player details whenever the token changes
  useEffect(() => {
    const fetchPlayerData = async () => {
      if (token && username) {
        try {
          const response = await fetch(`http://localhost:8002/players/by-username/${username}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setPlayerData({ name: data.username, elo: data.rating });
          } else {
            console.error("Failed to fetch player data");
          }
        } catch (error) {
          console.error("Error fetching player data:", error);
        }
      }
    };
    fetchPlayerData();
  }, [token, username]);

  return (
    <div className="sticky top-3 z-50 w-full flex justify-center mt-3">
      <header className="flex bg-inherit items-center justify-between w-10/12 h-12 px-6 py-4 shadow-[inset_0_0_0_3000px_rgba(150,150,150,0.192)] border-muted rounded-full backdrop-blur-md">
        {/* Left Side - Logo */}
        <div className="flex items-center gap-4">
          <Link href="/playerHome" className="flex items-center gap-0 text-white group">
            <img className="h-10 w-10 text-primary-foreground" src="/logo.png" alt="Logo" />
            <h1 className="font-bebas text-white size-fit group-hover:scale-110 transition-transform duration-200">
              TetriTracker
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">

          {/* Tournaments button */}
          <Link href="/tournaments">
            <Button 
              variant="ghost" 
              className={`text-primary-foreground ${isActive('/tournaments') ? 'bg-accent text-accent-foreground' : ''}`}>
              <IoTrophy className="w-6 h-6" />
            </Button>
          </Link>

          {/* Rankings button */}
          <Button
            variant="ghost"
            className={`text-primary-foreground ${isActive('/rankings') ? 'bg-accent text-accent-foreground' : ''}`}>
            <PiRankingBold className="w-6 h-6" />
          </Button>

          {/* Search button */}
              <Button 
                variant="ghost" 
                className={`text-primary-foreground ${isActive('/search') ? 'bg-accent text-accent-foreground' : ''}`}
              >
                <IoSearch className="w-6 h-6" />
              </Button>

          {/* Profile button button */}  
          <Link href="/profile">
            <Button 
              variant="ghost" 
              className={`text-primary-foreground ${isActive('/profile') ? 'bg-accent text-accent-foreground' : ''}`}
            >
              <IoPerson className="w-6 h-6" />
            </Button>
          </Link>
        </nav>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} aria-label="Toggle menu" className="text-white text-2xl">
            {isMobileMenuOpen ? <IoClose /> : <IoMenu />}
          </button>
        </div>

        {/* Profile Section */}
        <div className="hidden md:flex items-center gap-4">
          
          <Button
            variant="ghost" 
            className={`text-primary-foreground ${isActive('/tournaments') ? 'bg-accent text-accent-foreground' : ''}`}
          >
            <IoNotifications className="h-6 w-6"/>
          </Button>

          <HoverCard> 
            <HoverCardTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar>
                  <AvatarImage src="/user.png" />
                  <AvatarFallback>user</AvatarFallback>
                </Avatar>
                <div className="text-primary-foreground">
                  <h4 className="font-medium">{playerData.name}</h4>
                  <p className="text-xs text-muted-foreground">ELO: {playerData.elo}</p>
                </div>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 bg-white/80">
              <div className="flex flex-col space-y-4">

                {/* Avatar and User Information */}
                <div className="flex justify-between items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>{playerData.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">{playerData.name}</h4>
                    <p className="text-sm">ELO: {playerData.elo}</p>
                  </div>
                </div>

                {/* Sign out Button */}
                <div className="flex justify-center mt-4">
                  <Button
                    onClick={() => {
                      useAuthStore.getState().clearToken();
                      useAuthStore.getState().clearUsername();
                      window.location.href = "/"
                    }}>
                    Sign Out
                  </Button>
                </div>
              </div>
            </HoverCardContent>

          </HoverCard>
        </div>
      </header>

      {/* Mobile Menu */}
      <nav
        className={`absolute top-full left-0 w-full bg-[#1c1132] shadow-md md:hidden flex flex-col items-center space-y-4 p-4 mt-2 rounded-lg transition-transform transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >

        <Link href="/tournaments">
          <Button 
            variant="ghost" 
            className={`text-primary-foreground ${isActive('/tournaments') ? 'bg-accent text-accent-foreground' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <IoTrophy className="w-6 h-6" />
          </Button>
        </Link>

        {/* Rankings button */}
        <Button
            variant="ghost"
            className={`text-primary-foreground ${isActive('/rankings') ? 'bg-accent text-accent-foreground' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
        >
            <PiRankingBold className="w-6 h-6" />
        </Button>

        <Button 
          variant="ghost" 
          className={`text-primary-foreground ${isActive('/search') ? 'bg-accent text-accent-foreground' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <IoSearch className="w-6 h-6" />
        </Button>

        <Link href="/profile">
          <Button
            variant="ghost" 
            className={`text-primary-foreground ${isActive('/profile') ? 'bg-accent text-accent-foreground' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <IoPerson className="w-6 h-6" />
          </Button>
        </Link>

      </nav>
    </div>
  );
}
