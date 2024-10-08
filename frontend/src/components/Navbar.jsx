"use client";

import { useState } from "react";
import { usePathname } from "next/navigation"; // Correct import to get the pathname
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { IoTrophy, IoSearch, IoPerson, IoMenu, IoClose } from 'react-icons/io5';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname(); // Get the current pathname

  // Toggle function for the menu
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Check if the current route matches the link path
  const isActive = (path) => pathname === path;

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
          <Button 
            variant="ghost" 
            className={`text-primary-foreground ${isActive('/tournaments') ? 'bg-accent text-accent-foreground' : ''}`}
          >
            <IoTrophy className="w-6 h-6" />
          </Button>
          <Button 
            variant="ghost" 
            className={`text-primary-foreground ${isActive('/search') ? 'bg-accent text-accent-foreground' : ''}`}
          >
            <IoSearch className="w-6 h-6" />
          </Button>
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
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar>
                  <AvatarImage src="/user.png" />
                  <AvatarFallback>user</AvatarFallback>
                </Avatar>
                <div className="text-primary-foreground">
                  <h4 className="font-medium">User Name</h4>
                  <p className="text-xs text-muted-foreground">ELO: 1234</p>
                </div>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex justify-between space-x-4">
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>user</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">User Name</h4>
                  <p className="text-sm">ELO: 1234</p>
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
        <Button 
          variant="ghost" 
          className={`text-primary-foreground ${isActive('/tournaments') ? 'bg-accent text-accent-foreground' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <IoTrophy className="w-6 h-6" />
        </Button>
        <Button 
          variant="ghost" 
          className={`text-primary-foreground ${isActive('/search') ? 'bg-accent text-accent-foreground' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <IoSearch className="w-6 h-6" />
        </Button>
        <Button 
          variant="ghost" 
          className={`text-primary-foreground ${isActive('/profile') ? 'bg-accent text-accent-foreground' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <IoPerson className="w-6 h-6" />
        </Button>
      </nav>
    </div>
  );
}
