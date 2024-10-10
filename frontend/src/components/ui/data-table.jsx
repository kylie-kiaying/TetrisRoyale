"use client";

import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { columns } from "@/components/tournament-columns"; // Import the tournament columns
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Assuming you're using shadcn/ui Table components

export function DataTable({ type, data }) {
  // Use the appropriate columns based on the table type (enrolled or completed)
  const tableColumns = type === "enrolled" ? columns.enrolled : columns.completed;

  // Ensure that the columns and data are passed correctly
  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-lg border border-gray-600 overflow-hidden">
      <Table className="table-auto w-full text-sm text-left text-white">
        <TableHeader className="bg-[#2e1f4d] text-gray-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="px-6 py-3 font-semibold text-white border-b">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="bg-[#1c1132]">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-6 py-4 border-b border-gray-600 text-gray-300">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={tableColumns.length} className="h-24 text-center text-gray-400">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
