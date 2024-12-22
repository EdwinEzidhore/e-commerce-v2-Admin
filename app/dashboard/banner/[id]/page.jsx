
import { CardContent, } from "@/components/ui/card";
import BannerEditForm from "./BannerEditForm";
import { isAuthenticated } from "@/lib/middleware";
import { redirect } from "next/navigation";
import Banner from "@/lib/modals/Banner";
import connect from "@/lib/db";
import { throwError } from "@/helper/errorHandler";

export async function FetchBanner(id) {
    try {
        const isUser = await isAuthenticated();

        if (!isUser) {
            redirect('/');
        }
        await connect();
        const banner = await Banner.findOne({_id:id });
        
        
        if (!banner || banner==null) {
            throwError("Failed fetching banner!", 404);
        }
        const parsedResult = JSON.parse(JSON.stringify(banner));
        return parsedResult;
        

    } catch (error) {
        return {
            success:false,
            message: error.message || "unexpected error occured!",
            status:error.status || 500
        }
    }
}

export default async function EditBanner({params}) {

    const { id } = await params;
    const fetchResult = await FetchBanner(id);
    

    return (
        <div className="h-full w-full">
            <div className="px-7 py-6">

                <span className="font-semibold">Edit Banner</span>
            </div>
            <CardContent>
                <BannerEditForm Banner={fetchResult}/>
            </CardContent>
        </div>


    )
}