"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/ui/table"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/app/ui/navbar/dropdown-menu"

import { Button } from "@/app/ui/button"
import { Input } from "@/app/ui/input"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    title: false,
    description: false, 
    createdAt: false, 
    updatedAt: false,
    lands: false,
    abstract: false,
    polygone: false,
    geolocation_point: false,
    investment_teaser: false,
  })

  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    }
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4 px-4">
        <Input
          placeholder="Filter Project name"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm border-mint-6 focus:border-mint-8 focus:ring-mint-7 dark:border-mint-8 dark:bg-zinc-800"
        />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="flex items-center ml-auto">
            <Button variant="outline" className="ml-auto bg-white dark:bg-zinc-800 border-mint-6 dark:border-mint-8 text-mint-11 dark:text-mint-9 hover:bg-mint-3 dark:hover:bg-zinc-700">
              Add columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white dark:bg-zinc-800 border-mint-6 dark:border-mint-8 shadow-lg">
            {table
              .getAllColumns()
              .filter(
                (column) => column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize text-mint-11 dark:text-mint-9 hover:bg-mint-3 dark:hover:bg-zinc-700"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="rounded-md border border-mint-6 dark:border-mint-8 overflow-hidden">
        <Table className="w-full">
          <TableHeader className="bg-mint-2 dark:bg-zinc-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-mint-6 dark:border-mint-8">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-mint-11 dark:text-mint-9 font-semibold py-3">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b border-mint-5 dark:border-mint-7 hover:bg-mint-2 dark:hover:bg-zinc-800"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 text-foreground dark:text-mint-12">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-mint-11 dark:text-mint-9">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        <div className="flex items-center justify-between space-x-2 py-4 px-4 border-t border-mint-5 dark:border-mint-7 bg-white dark:bg-zinc-900">
          <div className="flex-1 text-sm text-mint-11 dark:text-mint-9">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="border-mint-6 dark:border-mint-8 text-mint-11 dark:text-mint-9 hover:bg-mint-3 dark:hover:bg-zinc-700 disabled:opacity-50"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="border-mint-6 dark:border-mint-8 text-mint-11 dark:text-mint-9 hover:bg-mint-3 dark:hover:bg-zinc-700 disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}