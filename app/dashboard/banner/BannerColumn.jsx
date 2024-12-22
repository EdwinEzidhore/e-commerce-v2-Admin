"use client"

import { DeleteBanner } from "@/app/actions/banner"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { ArrowUpDown, Eye, MoreHorizontalIcon, Trash, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"



export const Banner_list_Column = [

    {
        accessorKey: "banner",
        header: "",
        cell: ({ row }) => (
            <div className="w-14 h-14 relative flex justify-center items-center">
                {
                    row.original.banner?.secure_url ? (
                        <Image
                            src={`${row.original.banner?.secure_url }`}
                            alt="image"
                            width={100}
                            height={100}
                        />
                    ) : (
                        '-'
                    )
                }

            </div>
        ),
    },
    {
        accessorKey: "title",

        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >

                    CreatedAt
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ getValue }) => new Date(getValue()).toDateString(),

    },
    {
        accessorKey: "Actions",


        cell: ({ row }) => {
            const category = row.original


            const { toast } = useToast();
            const router = useRouter();

            const handleBannerDelete = async (id) => {
                const result = await DeleteBanner(id);
                if (result) {
                    toast({
                        description: result.message
                    })
                    router.refresh();

                }

            }

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 ">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>



                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" className="w-full px-2 justify-start" >
                                    <Trash className="w-5 h-5 mr-2" /> Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the banner.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction asChild>
                                        <Button
                                            className="bg-red-500"
                                            onClick={() => handleBannerDelete(category._id)}
                                            variant="destructive"
                                        >
                                            Continue
                                        </Button>
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>




                        <DropdownMenuItem>
                            <Link className="inline-flex items-center gap-2 w-full" href={`/dashboard/banner/${category._id}`}>

                                <Eye className="w-5 h-5 mr-2" />
                                Edit

                            </Link>

                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
