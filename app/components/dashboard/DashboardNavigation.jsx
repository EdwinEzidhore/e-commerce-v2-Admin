"use client"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CircleUser, MenuIcon } from "lucide-react"
import Link from "next/link";
import { signOut } from "next-auth/react";

const links = [
    {
        name: 'Products',
        href: '/products'
    },
    {
        name: 'Orders',
        href: '/orders'
    },
    {
        name: 'Categories',
        href: '/category'
    }
]


const DashboardNavigation = () => {
    return (
        <div className="nav-wrapper py-12 px-5  ">
            <div className="nav-container container mx-auto flex justify-between">
                <div className="logo">
                    logo
                </div>
                <div className="nav-links hidden md:flex md:items-center md:gap-5">
                    {
                        links.map((link) => (
                            <Link key={link.href} href={link.href}>{link.name}</Link>
                        ))
                    }
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button>
                                <CircleUser className="w-5 h-5"></CircleUser>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                            <DropdownMenuLabel>
                                My Account
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>
                                <Button type='button' onClick={() =>  signOut()}>
                                    Log Out
                                </Button>
                            </DropdownMenuLabel>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="block md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button>
                                <MenuIcon className="h-5 w-5"></MenuIcon>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side='left'>
                            <h1>logo</h1>
                        </SheetContent>
                    </Sheet>

                </div>
            </div>

        </div>
    )
}

export default DashboardNavigation