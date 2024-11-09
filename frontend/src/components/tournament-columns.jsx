import {
  IoChevronForward,
  IoChevronDown,
  IoInformationCircleOutline,
} from 'react-icons/io5';
import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const columns = {
  enrolled: [
    {
      accessorKey: 'tournament_name',
      header: 'Name',
    },
    {
      accessorKey: 'tournament_start',
      header: 'Start',
    },
    {
      accessorKey: 'tournament_end',
      header: 'End',
    },
    {
      accessorKey: 'status',
      header: 'Status',
    },
    {
      accessorKey: 'organizer',
      header: 'Organizer',
    },
    {
      accessorKey: 'tournament_id',
      header: () => null,
      cell: (info) => (
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger>
              <Link href={`/tournaments/${info.getValue()}`}>
                <div className="flex justify-center">
                  <IoInformationCircleOutline
                    size={26}
                    className="transform cursor-pointer rounded-full bg-purple-700 p-1 text-white transition duration-200 ease-in-out hover:scale-110 hover:bg-purple-600 hover:shadow-lg"
                  />
                </div>
              </Link>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              align="center"
              className="rounded-md bg-gray-800 px-2 py-1 text-sm text-white shadow"
            >
              View Details
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
      className: 'w-12 text-center',
    },
  ],
  completed: [
    {
      accessorKey: 'tournament_name',
      header: 'Name',
    },
    {
      accessorKey: 'tournament_start',
      header: 'Start',
    },
    {
      accessorKey: 'tournamnt_end',
      header: 'End',
    },
    {
      accessorKey: 'status',
      header: 'Status',
    },
    {
      accessorKey: 'organizer',
      header: 'Organizer',
    },
    {
      accessorKey: 'tournament_id',
      header: () => null,
      cell: (info) => (
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger>
              <Link href={`/tournaments/${info.getValue()}`}>
                <div className="flex justify-center">
                  <IoInformationCircleOutline
                    size={26}
                    className="transform cursor-pointer rounded-full bg-purple-700 p-1 text-white transition duration-200 ease-in-out hover:scale-110 hover:bg-purple-600 hover:shadow-lg"
                  />
                </div>
              </Link>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              align="center"
              className="rounded-md bg-gray-800 px-2 py-1 text-sm text-white shadow"
            >
              View Details
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
      className: 'w-12 text-center',
    },
  ],
  match_history: [
    {
      accessorKey: 'opponent',
      header: 'Opponent',
      cell: ({ row }) => (
        <div className="flex items-center">
          <img
            src={row.original.opponent_img}
            alt={row.original.opponent}
            className="mr-2 h-8 w-8 rounded-full"
          />
          <span>{row.original.opponent}</span>
        </div>
      ),
    },
    {
      accessorKey: 'result',
      header: 'Result',
      cell: ({ row }) => (
        <span
          className={
            row.original.result === 'Win' ? 'text-green-500' : 'text-red-500'
          }
        >
          {row.original.result}
        </span>
      ),
    },
    {
      accessorKey: 'tournament',
      header: 'Tournament',
    },
    {
      accessorKey: 'date',
      header: 'Date',
    },
    {
      id: 'expander',
      header: () => null,
      cell: ({ row }) => (
        <button
          onClick={() => row.toggleExpanded()}
          className="flex items-center"
        >
          {row.getIsExpandedt() ? (
            <IoChevronDown className="h-5 w-5 text-gray-400" />
          ) : (
            <IoChevronForward className="h-5 w-5 text-gray-400" />
          )}
        </button>
      ),
    },
  ],
  all: [
    {
      accessorKey: 'tournament_name',
      header: 'Name',
    },
    {
      accessorKey: 'tournament_start',
      header: 'Start',
      cell: (info) => {
        const dateValue = info.getValue();
        if (!dateValue) return 'N/A';
        const date = new Date(dateValue);
        return isNaN(date.getTime())
          ? 'Invalid Date'
          : date.toLocaleDateString('en-GB', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });
      },
    },
    {
      accessorKey: 'tournament_end',
      header: 'End',
      cell: (info) => {
        const dateValue = info.getValue();
        if (!dateValue) return 'N/A';
        const date = new Date(dateValue);
        return isNaN(date.getTime())
          ? 'Invalid Date'
          : date.toLocaleDateString('en-GB', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (info) => {
        const status = info.getValue().toLowerCase();
        let color = 'inherit';
        let label = status.charAt(0).toUpperCase() + status.slice(1);

        if (status === 'upcoming') {
          color = 'orange';
        } else if (status === 'ongoing') {
          color = 'green';
        } else if (status === 'completed') {
          color = 'gray';
        }

        return <span style={{ color, fontWeight: 'bold' }}>{label}</span>;
      },
    },
    {
      accessorKey: 'recommendedRating',
      header: 'Rating',
    },
    {
      accessorKey: 'tournament_id',
      header: () => null,
      cell: (info) => (
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger>
              <Link href={`/tournaments/${info.getValue()}`}>
                <div className="flex justify-center">
                  <IoInformationCircleOutline
                    size={26}
                    className="transform cursor-pointer rounded-full bg-purple-700 p-1 text-white transition duration-200 ease-in-out hover:scale-110 hover:bg-purple-600 hover:shadow-lg"
                  />
                </div>
              </Link>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              align="center"
              className="rounded-md bg-gray-800 px-2 py-1 text-sm text-white shadow"
            >
              View Details
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
      className: 'w-12 text-center',
    },
  ],
  players: [
    {
      accessorKey: 'username',
      header: 'Name',
      cell: (info) => info.getValue(),
      className: 'w-full',
    },
    {
      accessorKey: 'rating',
      header: 'Rating',
      cell: (info) => info.getValue(),
      className: 'w-24 text-right',
    },
    {
      id: 'profile_picture',
      header: () => null,
    },
  ],
  created: [
    {
        accessorKey: "tournament_name",
        header: "Name",
    },
    {
        accessorKey: "start",
        header: "Start",
    },
    {
        accessorKey: "end",
        header: "End",
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
      accessorKey: 'recommendedRating',
      header: 'Rating',
    },
    {
        id: "expander",
        accessorKey: "players",
        header: () => null,
        cell: ({ row }) => (
            <button
                onClick={() => row.toggleExpanded()}
                className="flex items-center"
            >
                {row.getIsExpanded() ? (
                    <IoChevronDown className="text-gray-400 w-5 h-5" />
                ) : (
                    <IoChevronForward className="text-gray-400 w-5 h-5" />
                )}
            </button>
        ),
    },
],
};
