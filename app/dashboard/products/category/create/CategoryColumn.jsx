"use client"
import { ArrowUpDown, Eye, MoreHorizontal, Trash2 } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu" 
import { Button } from "@/components/ui/button"
import { CategoryDelete } from "@/app/actions/CategoryActions"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export const CategoryColumn =(refetch)=> [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Category
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "Actions",

        
        cell: ({ row }) => {
            const category = row.original

            const { toast } = useToast();

            const handleDelete = async() => {
                const res = await CategoryDelete(category._id);
                if (res) {
                    toast({
                        description: res.message
                    })
                    refetch();
                }
            }
            

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 ">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        
                        
                        <DropdownMenuItem onClick={handleDelete}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link href={`/dashboard/products/category/create/${category._id}`}>
                            <Eye /> 
                            View
                            </Link>
                            
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]