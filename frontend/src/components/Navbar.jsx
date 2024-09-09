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
    <div className="flex flex-col bg-[#140a2f] ">
      <header className="flex items-center justify-between px-6 py-4 bg-background-muted border-muted">
        <div className="flex items-center gap-4">
          <Link href="#" prefetch={false}>
            <MountainIcon className="h-6 w-6 text-primary-foreground" />
          </Link>
        </div>
        <nav className="flex-col items-center justify-center gap-4">
          <Button variant="ghost" className="text-primary-foreground">
            <IoTrophy className="w-6 h-6" />
          </Button>
          <Button variant="ghost" className="text-primary-foreground">
            <IoSearch className="w-6 h-6" />
          </Button>
          <Button variant="ghost" className="text-primary-foreground">
            <IoPerson className='w-6 h-6' />
          </Button>
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
    </div>
  )
}

function MountainIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}