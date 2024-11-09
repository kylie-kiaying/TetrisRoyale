'use client';

import { Badge } from '@/components/ui/badge';
import { getPlayerTier } from '@/utils/getPlayerTier';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
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
  const [hasMounted, setHasMounted] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const userType = useAuthStore((state) => state.user.userType);
  const isAuthenticated = useAuthStore((state) => !!state.user.token);
  const username = useAuthStore((state) => state.user.username);
  const userId = useAuthStore((state) => state.user.id);
  const playerRating = useAuthStore((state) => state.user.rating);
  const { tier, color } = getPlayerTier(playerRating || 0);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const isActive = (path) => pathname === path;

  // Set hasMounted to true on initial render
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleSignOut = async () => {
    try {
      const response = await fetch('http://localhost:8001/logout/', {
        method: 'POST',
        credentials: 'include', // Ensure cookies are sent
      });

      if (response.ok) {
        successToast('You have been logged out successfully.');
        useAuthStore.getState().clearUser(); // Clear user data from the store
        Cookies.remove('session_token'); // Remove the token cookie from the client
        router.push('/');
      } else {
        errorToast('Failed to log out. Please try again.');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      errorToast('An error occurred during logout. Please try again.');
    }
  };

  // Redirect to home if user is not authenticated after mounting
  useEffect(() => {
    if (hasMounted && !isAuthenticated) {
      router.push('/');
      errorToast('You have been signed out, please log in again');
    }
  }, [hasMounted, isAuthenticated, router]);

  if (!hasMounted) return null;

  return (
    <div className="sticky top-4 z-50 mt-3 w-full">
      <header className="mx-auto flex h-12 max-w-5xl items-center justify-between rounded-full border-muted bg-inherit px-6 py-4 shadow-[inset_0_0_0_3000px_rgba(150,150,150,0.192)] backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link
            href={userType === 'player' ? '/playerHome' : '/adminHome'}
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
          {[
            {
              href: userType === 'player' ? '/playerHome' : '/adminHome',
              icon: <IoHome className="h-6 w-6" />,
              label: 'Home',
            },
            {
              href: '/tournaments',
              icon: <IoTrophy className="h-6 w-6" />,
              label: 'Tournament browser',
            },
            {
              href: '/rankings',
              icon: <PiRankingBold className="h-6 w-6" />,
              label: 'Rankings',
            },
            {
              href: '/search',
              icon: <IoSearch className="h-6 w-6" />,
              label: 'Search',
            },
            {
              href: '/profile',
              icon: <IoPerson className="h-6 w-6" />,
              label: 'Profile',
            },
          ].map(({ href, icon, label }) => (
            <Link key={href} href={href}>
              <TooltipProvider>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`text-primary-foreground ${isActive(href) ? 'bg-accent text-accent-foreground' : ''}`}
                    >
                      {icon}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{label}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Link>
          ))}
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
                  {userType === 'player' ? (
                    <p className="text-xs text-muted-foreground">
                      WHR: {playerRating || 'N/A'}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">Admin</p>
                  )}
                </div>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 bg-white/80">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between space-x-4">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>
                      {username ? username.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">{username}</h4>
                    {userType === 'player' ? (
                      <>
                        <p className="text-xs text-muted-foreground">
                          WHR: {playerRating || 'N/A'}
                        </p>
                        <Link href="/tierInfo" passHref>
                          <Badge
                            className={`bg-gray-800 text-xs ${color} cursor-pointer hover:shadow-[0_0_10px]`}
                          >
                            {tier}
                          </Badge>
                        </Link>
                      </>
                    ) : (
                      <p className="text-xs text-muted-foreground">Admin</p>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex justify-center">
                  <Button
                    variant="destructive"
                    onClick={() => {
                      useAuthStore.getState().clearUser();
                      handleSignOut();
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
        {[
          {
            href: userType === 'player' ? '/playerHome' : '/adminHome',
            icon: <IoHome className="h-6 w-6" />,
          },
          { href: '/tournaments', icon: <IoTrophy className="h-6 w-6" /> },
          { href: '/rankings', icon: <PiRankingBold className="h-6 w-6" /> },
          { href: '/search', icon: <IoSearch className="h-6 w-6" /> },
          { href: '/profile', icon: <IoPerson className="h-6 w-6" /> },
        ].map(({ href, icon }) => (
          <Link key={href} href={href}>
            <Button
              variant="ghost"
              className={`text-primary-foreground ${isActive(href) ? 'bg-accent text-accent-foreground' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {icon}
            </Button>
          </Link>
        ))}
        <Button
          variant="destructive"
          onClick={() => {
            useAuthStore.getState().clearUser();
            handleSignOut();
            window.location.href = '/';
          }}
        >
          Sign out
        </Button>
      </nav>
    </div>
  );
}
