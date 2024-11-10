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
import { formatDateMedium } from '@/utils/dateUtils';

export const columns = {
  enrolled: [
    {
      accessorKey: 'tournament_name',
      header: 'Name',
    },
    {
      accessorKey: 'tournament_start',
      header: 'Start',
      cell: (info) => {
        const dateValue = info.getValue();
        return dateValue ? formatDateMedium(dateValue) : 'N/A';
      },
    },
    {
      accessorKey: 'tournament_end',
      header: 'End',
      cell: (info) => {
        const dateValue = info.getValue();
        return dateValue ? formatDateMedium(dateValue) : 'N/A';
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (info) => {
        const status = info.getValue().toLowerCase();
        const statusCapitalized =
          status.charAt(0).toUpperCase() + status.slice(1);

        // Set color based on status
        let color;
        switch (status) {
          case 'upcoming':
            color = 'orange';
            break;
          case 'ongoing':
            color = 'green';
            break;
          case 'completed':
            color = 'gray';
            break;
          default:
            color = 'inherit';
        }

        return (
          <span style={{ color, fontWeight: 'bold' }}>{statusCapitalized}</span>
        );
      },
    },
    {
      accessorKey: 'organiser',
      header: 'Organiser',
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
      accessorKey: 'organiser',
      header: 'Organiser',
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
      accessorKey: 'tournament_name',
      header: 'Tournament',
    },
    {
      accessorKey: 'scheduled_at',
      header: 'Date',
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
      id: 'expander',
      header: () => null,
      cell: ({ row }) => (
        <button
          onClick={() => row.toggleExpanded()}
          className="flex items-center"
        >
          {row.getIsExpanded() ? (
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
    {
      accessorKey: 'user_id',
      header: () => null,
      cell: (info) => (
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <Link href={`/profile/${info.getValue()}`}>
                <div className="flex justify-center">
                  <div className="cursor-pointer rounded-md bg-blue-600 px-3 py-1 text-sm font-semibold text-white transition duration-200 hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                    Profile
                  </div>
                </div>
              </Link>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              align="center"
              className="rounded-md bg-gray-800 px-2 py-1 text-sm text-white shadow"
            >
              Visit Profile
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
      className: 'w-12 text-center',
    },
  ],
};
