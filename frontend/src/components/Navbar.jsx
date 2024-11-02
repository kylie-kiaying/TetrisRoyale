'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation'; // Correct import to get the pathname
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@/components/ui/hover-card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  IoTrophy,
  IoSearch,
  IoPerson,
  IoMenu,
  IoClose,
  IoNotifications,
  IoHome,
} from 'react-icons/io5';
import { PiRankingBold } from 'react-icons/pi';
import { useAuthStore } from '@/store/authStore';
import { errorToast } from '@/utils/toastUtils';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname(); // Get the current pathname
  const [playerData, setPlayerData] = useState({
    username: 'User Name',
    rating: 1234,
  }); // State for player details
  const token = useAuthStore((state) => state.token); // Get the JWT token from the auth store
  const username = useAuthStore((state) => state.username); // Get username from the auth store
  const role = useAuthStore((state) => state.userType);
  const router = useRouter();

  // Toggle function for the menu
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Check if the current route matches the link path
  const isActive = (path) => pathname === path;

  // Redirect to root if username is null (user is not logged in)
  useEffect(() => {
    if (!username) {
      router.push('/');
      errorToast('You have been signed out, please log in again');
    }
  }, [username, router]);

  return (
    <div className="sticky top-4 z-50 mt-3 w-full">
      <header className="mx-auto flex h-12 max-w-5xl items-center justify-between rounded-full border-muted bg-inherit px-6 py-4 shadow-[inset_0_0_0_3000px_rgba(150,150,150,0.192)] backdrop-blur-md">
        {/* Left Side - Logo */}
        <div className="flex items-center gap-4">
          <Link
            href="/playerHome"
            className="group flex items-center gap-0 text-white"
          >
            <img
              className="h-10 w-10 text-primary-foreground"
              src="/logo.png"
              alt="Logo"
            />
            <h1 className="size-fit font-bebas text-white transition-transform duration-200 group-hover:scale-110">
              TetriTracker
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-4 md:flex">
          <Link href="/playerHome">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="ghost"
                    className={`text-primary-foreground ${isActive('/playerHome') ? 'bg-accent text-accent-foreground' : ''}`}
                  >
                    <IoHome className="h-6 w-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Home</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>

          <Link href="/tournaments">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="ghost"
                    className={`text-primary-foreground ${isActive('/tournaments') ? 'bg-accent text-accent-foreground' : ''}`}
                  >
                    <IoTrophy className="h-6 w-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tournament browser</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>

          <Link href="/rankings">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="ghost"
                    className={`text-primary-foreground ${isActive('/rankings') ? 'bg-accent text-accent-foreground' : ''}`}
                  >
                    <PiRankingBold className="h-6 w-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Rankings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>

          <Link href="/search">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="ghost"
                    className={`text-primary-foreground ${isActive('/search') ? 'bg-accent text-accent-foreground' : ''}`}
                  >
                    <IoSearch className="h-6 w-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Search</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>

          <Link href="/profile">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="ghost"
                    className={`text-primary-foreground ${isActive('/profile') ? 'bg-accent text-accent-foreground' : ''}`}
                  >
                    <IoPerson className="h-6 w-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Profile</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>
        </nav>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            className="text-2xl text-white"
          >
            {isMobileMenuOpen ? <IoClose /> : <IoMenu />}
          </button>
        </div>

        {/* Profile Section */}
        <div className="hidden items-center gap-4 md:flex">
          <Button
            variant="ghost"
            className={`text-primary-foreground ${isActive('/notifications') ? 'bg-accent text-accent-foreground' : ''}`}
          >
            <IoNotifications className="h-6 w-6" />
          </Button>

          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="flex cursor-pointer items-center gap-2">
                <Avatar>
                  <AvatarImage src="/user.png" />
                  <AvatarFallback>
                    {username ? username.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="text-primary-foreground">
                  <h4 className="font-medium">{username}</h4>
                  <p className="text-xs text-muted-foreground">
                    ELO: {playerData.rating}
                  </p>
                </div>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 bg-white/80">
              <div className="flex flex-col space-y-4">
                {/* Avatar and User Information */}
                <div className="flex items-center justify-between space-x-4">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>
                      {username ? username.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">{username}</h4>
                    <p className="text-sm">ELO: {playerData.rating}</p>
                  </div>
                </div>

                {/* Sign out Button */}
                <div className="mt-4 flex justify-center">
                  <Button
                    variant="destructive"
                    onClick={() => {
                      useAuthStore.getState().clearToken();
                      useAuthStore.getState().clearUsername();
                      window.location.href = '/';
                    }}
                  >
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
        className={`absolute left-0 top-full mt-2 flex w-full flex-col items-center space-y-4 rounded-lg bg-[#1c1132] p-4 shadow-md transition-opacity transition-transform duration-300 md:hidden ${
          isMobileMenuOpen
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-4 opacity-0'
        }`}
      >
        {/* Home button */}
        <Link href="/playerHome">
          <Button
            variant="ghost"
            className={`text-primary-foreground ${isActive('/playerHome') ? 'bg-accent text-accent-foreground' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <IoHome className="h-6 w-6" />
          </Button>
        </Link>

        <Link href="/tournaments">
          <Button
            variant="ghost"
            className={`text-primary-foreground ${isActive('/tournaments') ? 'bg-accent text-accent-foreground' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <IoTrophy className="h-6 w-6" />
          </Button>
        </Link>

        {/* Rankings button */}
        <Link href="/rankings">
          <Button
            variant="ghost"
            className={`text-primary-foreground ${isActive('/rankings') ? 'bg-accent text-accent-foreground' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <PiRankingBold className="h-6 w-6" />
          </Button>
        </Link>

        <Link href="/search">
          <Button
            variant="ghost"
            className={`text-primary-foreground ${isActive('/search') ? 'bg-accent text-accent-foreground' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <IoSearch className="h-6 w-6" />
          </Button>
        </Link>

        {/* Profile button */}
        <Link href="/profile">
          <Button
            variant="ghost"
            className={`text-primary-foreground ${isActive('/profile') ? 'bg-accent text-accent-foreground' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <IoPerson className="h-6 w-6" />
          </Button>
        </Link>

        <Button
          variant="destructive"
          onClick={() => {
            clearStore();
            window.location.href = '/';
          }}
        >
          Sign out
        </Button>
      </nav>
    </div>
  );

  function clearStore() {
    useAuthStore.getState().clearToken();
    useAuthStore.getState().clearUsername();
    useAuthStore.getState().clearUsertype();
  }
}
