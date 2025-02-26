"use client"

import { ColumnDef } from "@tanstack/react-table"
// import { MoreHorizontal } from "lucide-react"
import ProjectStatus from "@/app/ui/dashboard/project-status"
import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

import { Growth } from "@/app/lib/definitions";

export const columns: ColumnDef<Growth>[] = [
  {
    accessorKey: "details",
    header: "Project Details",
    cell: ({ row }) => {    
      return (
        <Link href={`./dashboard/project/${row.original.id}`} className="text-blue-600 hover:underline">
          View details
        </Link>
      )
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <ProjectStatus status={row.original.status} />,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "country",
    header: "Country",
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "investment",
    header: "Investment",
    cell: ({ row }) => {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.original.values.total_investment.value)
  }},
  {
    accessorKey: "impact",
    header: "Impact",
    cell: ({ row }) => {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.original.values.impact.value)
  }},
  {
    accessorKey: "bankableInvestment",
    header: "bankable Investment",
    cell: ({ row }) => {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.original.values.bankable_investment.value)
  }},
  {
    accessorKey: "income",
    header: "Income",
    cell: ({ row }) => {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.original.values.income.value)
  }},
  {
    accessorKey: "treeQuantity",
    header: "Tree Quantity",
    cell: ({ row }) => {
      return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(row.original.values.tree_quantity.value)
  }
  },
  {
    accessorKey: "tokenGranularity",
    header: "Token Granularity",
    cell: ({ row }) => {
      return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(row.original.values.token_granularity.value)
    }},
    {
      accessorKey: "lands",
      header: "Lands",
      cell: ({ row }) => {
        return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(row.original.values.lands.value)
      }
    },
    {
      accessorKey: "abstract",
      header: "Abstract",
      cell: ({ row }) => row.original.values.abstract.value
    },
    {
      accessorKey: "polygone",
      header: "Polygone",
      cell: ({ row }) => row.original.values.polygone.value
    },
    {
      accessorKey: "geolocation_point",
      header: "Geolocation Point",
      cell: ({ row }) => row.original.values.geolocation_point.value
    },
    {
      accessorKey: "investment_teaser",
      header: "Investment Teaser",
      cell: ({ row }) => row.original.values.investment_teaser.value
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
        }).format(date);
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: ({ row }) => {
        const date = new Date(row.original.updatedAt);
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
        }).format(date);
      },
    },
    {
      accessorKey: "description",
      header: "Description",
    },
  //   {
  //     id: "actions",
  //     cell: ({ row }) => {
  //       return (
  //         <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem asChild>
  //             <Link href={`./dashboard/project/${row.original.id}`}>View project details</Link>
  //           </DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     )
  //   },
  // },
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  // },
]
