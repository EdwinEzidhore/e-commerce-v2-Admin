"use client"

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,

} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"



export function DataTable({ columns, data, }) {

    const router = useRouter();

    const [sorting, setSorting] = useState([])

    const [columnFilters, setColumnFilters] = useState([])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    })

    const handleRowClick = (slug) => {
        router.push(`/dashboard/products/category/${slug}`)
    }

    return (
        <div >
            <div className="w-full lg:w-1/2">
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Filter category..."
                        value={(table.getColumn("category")?.getFilterValue()) ?? ""}
                        onChange={(event) =>
                            table.getColumn("category")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                </div>
                <div className="rounded-md border ">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id} className={header.column.id === 'productCount' ? "text-right" : ''}>
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
                                        onClick={()=>handleRowClick(row.original.category)}
                                    >
                                        {row.getVisibleCells().map((cell) => (

                                            
                                            <TableCell
                                                key={cell.id}
                                                className={cell.column.id === 'productCount' ? "text-right capitalize" : 'capitalize'}
                                            >
                                                {
                                                    cell.column.id === 'productCount' ? (
                                                        <Badge>
                                                            {
                                                                flexRender(cell.column.columnDef.cell, cell.getContext())
                                                            }
                                                        </Badge>
                                                    ) : (
                                                        flexRender(cell.column.columnDef.cell, cell.getContext())

                                                    )
                                                }



                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>

                </div>
            </div>

        </div>

    )
}
