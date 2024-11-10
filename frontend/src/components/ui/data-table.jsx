'use client';

import React from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getExpandedRowModel,
    flexRender,
} from '@tanstack/react-table';
import { columns } from '@/components/tournament-columns';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'; // Assuming you're using shadcn/ui Table components
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import { FaTrophy } from 'react-icons/fa';
import { FaGamepad, FaCalendarAlt, FaUser, FaStar } from 'react-icons/fa';

export function DataTable({ type, data }) {
    const tableColumns = columns[type];

    const table = useReactTable({
        data,
        columns: tableColumns,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
    });

    return (
        <div className="rounded-lg border border-gray-600 overflow-hidden">
            <Table className="table-auto w-full text-sm text-left text-white">
                <TableHeader className="bg-[#2e1f4d] text-gray-200">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    className={`px-6 py-3 font-semibold text-white border-b ${header.column.columnDef.className || ""}`}
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody className="bg-[#1c1132]">
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <React.Fragment key={row.id}>
                                <TableRow>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="px-6 py-4 border-b border-gray-600 text-gray-300"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>

                                {/* Expanded Row with Detailed Stats */}
                                {row.getIsExpanded() && (
                                    <TableRow
                                        key={`${row.id}-expanded`}
                                        className="bg-[#1c1132] text-white"
                                    >
                                        <TableCell
                                            colSpan={tableColumns.length}
                                            className="px-6 py-4 border-b border-gray-600"
                                        >
                                            {row.original.pieces_placed && (
                                                <div className="grid grid-cols-2 gap-4">
                                                    {/* Row 1 */}
                                                    <div className="border-b border-gray-700 py-2">
                                                        <p className="text-sm font-semibold text-orange-400">
                                                            Pieces Placed
                                                        </p>
                                                        <p className="text-lg">
                                                            {
                                                                row.original
                                                                    .pieces_placed
                                                            }
                                                        </p>
                                                    </div>
                                                    <div className="border-b border-gray-700 py-2">
                                                        <p className="text-sm font-semibold text-blue-400">
                                                            PPS (Pieces Per Second)
                                                        </p>
                                                        <p className="text-lg">
                                                            {row.original.pps}
                                                        </p>
                                                    </div>

                                                    {/* Row 2 */}
                                                    <div className="border-b border-gray-700 py-2">
                                                        <p className="text-sm font-semibold text-purple-400">
                                                            APM (Attacks Per Minute)
                                                        </p>
                                                        <p className="text-lg">
                                                            {row.original.apm}
                                                        </p>
                                                    </div>
                                                    <div className="border-b border-gray-700 py-2">
                                                        <p className="text-sm font-semibold text-pink-400">
                                                            KPP (Keys Per Piece)
                                                        </p>
                                                        <p className="text-lg">
                                                            {row.original.kpp}
                                                        </p>
                                                    </div>

                                                    {/* Row 3 */}
                                                    <div className="border-b border-gray-700 py-2">
                                                        <p className="text-sm font-semibold text-yellow-400">
                                                            Finesse %
                                                        </p>
                                                        <p className="text-lg">
                                                            {
                                                                row.original
                                                                    .finesse_percentage
                                                            }
                                                        </p>
                                                    </div>
                                                    <div className="border-b border-gray-700 py-2">
                                                        <p className="text-sm font-semibold text-green-300">
                                                            Lines Cleared
                                                        </p>
                                                        <p className="text-lg">
                                                            {
                                                                row.original
                                                                    .lines_cleared
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            <h2 className="text-center text-lg font-bold tracking-wide md:text-2xl">
                                                Player List
                                            </h2>
                                            {row.original.players && row.original.players.map((player) => (
                                                <div className="grid grid-cols-4 gap-4 border-b border-gray-700 py-2">
                                                    <div className="flex col-start-2 items-center space-x-2 truncate justify-end">
                                                        <span className="truncate text-sm font-semibold sm:text-xs md:text-sm lg:text-base">
                                                            {player.username}
                                                        </span>
                                                        <Badge
                                                            className={`rounded-md px-2 py-1 text-xs sm:text-[10px] md:text-xs lg:text-sm ${player.color}`}
                                                        >
                                                            {player.tier}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex col-start-3 items-center space-x-2">
                                                        <FaGamepad className="text-purple-400" size={14} />
                                                        <span className="text-xs font-semibold text-gray-300 sm:text-[10px] md:text-sm lg:text-base">
                                                            {player.rating}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={tableColumns.length}
                                className="h-24 text-center text-gray-400"
                            >
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
