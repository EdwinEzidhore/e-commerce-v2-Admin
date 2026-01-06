import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircleIcon, } from "lucide-react";
import Link from "next/link";
import { Banner_list_Column } from "./BannerColumn";
import Banner from "@/lib/modals/Banner.js";
import { DataTable } from "@/app/components/DataTable";
import connect from "@/lib/db";
import { Separator } from "@/components/ui/separator";

export const getBanners = async () => {
    await connect();
    const banner_list = await Banner.find({});
    const result = JSON.parse(JSON.stringify(banner_list)); //converting mongodb object to plain javascript object
    return result;
}
export default async function BannerCreate() {

    const banners = await getBanners();


    return (
        <div className="h-full">
            <div className='h-full'>
                <div className="px-7 py-6 flex flex-row justify-between items-center gap-3">
                    <div>
                        <span className="font-semibold">Banner</span>
                        <p>Manage your banners here...</p>
                    </div>

                    <div className="flex justify-end items-center">
                        <Button asChild>
                            <Link href='/dashboard/banner/create'>
                                <PlusCircleIcon></PlusCircleIcon>
                                <span>Add Banner</span>
                            </Link>
                        </Button>
                    </div>


                </div>
                <Separator />
                <div className="p-6">
                <DataTable
                    columns={Banner_list_Column}
                    data={banners}
                    searchField={"title"}
                />
                </div>
                
            </div>

        </div>
    )
}

