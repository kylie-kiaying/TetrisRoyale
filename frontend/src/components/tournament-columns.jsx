// components/tournament-columns.js
import { IoChevronForward, IoChevronDown } from "react-icons/io5";

export const columns = {
    enrolled: [
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
            accessorKey: "organizer",
            header: "Organizer",
        },
    ],
    completed: [
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
            accessorKey: "organizer",
            header: "Organizer",
        },
    ],
    match_history: [
        {
            accessorKey: "opponent",
            header: "Opponent",
            cell: ({ row }) => (
                <div className="flex items-center">
                    {/* Circular Profile Image */}
                    <img
                        src={row.original.opponent_img}
                        alt={row.original.opponent}
                        className="w-8 h-8 rounded-full mr-2"
                    />
                    <span>{row.original.opponent}</span>
                </div>
            ),
        },
        {
            accessorKey: "result",
            header: "Result",
            cell: ({ row }) => (
                <span
                    className={
                        row.original.result === "Win"
                            ? "text-green-500"
                            : "text-red-500"
                    }
                >
                    {row.original.result}
                </span>
            ),
        },
        {
            accessorKey: "tournament",
            header: "Tournament",
        },
        {
            accessorKey: "date",
            header: "Date",
        },
        // Expandable row to show detailed statistics
        {
            id: "expander",
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
    all: [
        {
            accessorKey: "tournament_name",
            header: "Name",
        },
        {
            accessorKey: "tournament_start",
            header: "Start",
            cell: (info) => {
                const dateValue = info.getValue();
                console.log("Start Date Value:", dateValue); // Debug: Log the value
                if (!dateValue) return "N/A"; // Handle missing date
                const date = new Date(dateValue);
                return isNaN(date.getTime())
                    ? "Invalid Date"
                    : date.toLocaleDateString("en-GB", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                      }); // Format date directly
            },
        },
        {
            accessorKey: "tournament_end",
            header: "End",
            cell: (info) => {
                const dateValue = info.getValue();
                console.log("Start Date Value:", dateValue); // Debug: Log the value
                if (!dateValue) return "N/A"; // Handle missing date
                const date = new Date(dateValue);
                return isNaN(date.getTime())
                    ? "Invalid Date"
                    : date.toLocaleDateString("en-GB", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                      }); // Format date directly
            },
        },
        {
            accessorKey: "status",
            header: "Status",
        },
        {
            accessorKey: "organizer",
            header: "Organizer",
        },
    ],
    players: [
        {
            accessorKey: "username",
            header: "Name",
            cell: (info) => info.getValue(),
            className: "w-full",
        },
        {
            accessorKey: "rating",
            header: "Rating",
            cell: (info) => info.getValue(),
            className: "w-24 text-right",
        },
        {
            id: "profile_picture",
            header: () => null,
        },
    ],
};
