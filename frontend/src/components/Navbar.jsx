/**
 * v0 by Vercel.
 * @see https://v0.dev/t/CFmaQsEfp6o
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { IoTrophy, IoSearch, IoPerson } from "react-icons/io5"

export default function Component() {
  return (
    <div className="">
      <header className="flex bg-inherit items-center justify-between w-10/12 h-12 mx-auto px-6 py-4 shadow-[inset_0_0_0_3000px_rgba(150,150,150,0.192)] border-muted rounded-full backdrop-blur-md sticky my-3">
        <div className="flex flex-row items-center gap-4 overflow-hidden w-auto p-3">
            <Link href="/playerHome" prefetch={false} className="flex items-center gap-0 text-white group">
                <img className="h-10 w-10 text-primary-foreground" src="/logo.png" alt="Logo" />
                <h1 className="font-bebas text-white size-fit group-hover:scale-110 transition-transform duration-200">TetriTracker</h1>
          </Link>
        </div>
        <nav className="flex-col items-center justify-center gap-4">
          <Button variant="ghost" className="text-primary-foreground">
            <IoTrophy className="w-6 h-6" />
          </Button>
          <Button variant="ghost" className="text-primary-foreground">
            <IoSearch className="w-6 h-6" />
          </Button>
          <Link href="/profile">
          <Button variant="ghost" className="text-primary-foreground">
            <IoPerson className='w-6 h-6' />
          </Button>
          </Link>
        </nav>
        <div className="flex items-center gap-4">
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
                        <AvatarImage src="/user.png"/>
                        <AvatarFallback>user</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold">User Name</h4>
                        <p className="text-sm">ELO: 1234</p>
                    </div>
                </div>
                <div className="mt-4 flex justify-center">
                    <button
                    // onClick={handleSignOut} // Replace this with your sign out function
                    className="px-4 py-2 text-sm font-medium text-white bg-[#e53e3e] rounded hover:bg-red-600 transition-colors"
                    >
                    Sign Out
                    </button>
                </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </header>
    </div>
  )
}
