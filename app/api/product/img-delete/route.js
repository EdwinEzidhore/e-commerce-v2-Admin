import cloudinary from "@/lib/cloudinary";
import connect from "@/lib/db";
import { isAuthenticated } from "@/lib/middleware";
import Product from "@/lib/modals/Products";
import { NextResponse } from "next/server";

export async function DELETE(req) {

    const { public_id, pro_id } = await req.json();
    

    if (!public_id) {
        return NextResponse.json(
            { message: "Public ID is required" },
            { status: 400 }
        );
    }

    try {

        const user = await isAuthenticated();

        if (!user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }
        await connect();
        const cld_result = await cloudinary.uploader.destroy(public_id);
        if (cld_result.result === "ok") {
            
            const db_result = await Product.updateOne(
                { _id: pro_id },
                {
                    $pull: {
                        images: {
                            public_id: public_id
                        }
                    }
                }
            );

            if (db_result.modifiedCount > 0) {
                return NextResponse.json({
                    message:"Image Deleted Successfully!"
                }, {
                    status:200
                }
                )
            } else {
                return NextResponse.json({
                    message:"Error Deleting Image !"
                }, {
                    status:202
                }
                )
            }

        } else {
            return NextResponse.json({message:"Image not found or Error Deleting image !"},{status:404})
        }
                

    } catch (error) {
        const statusCode = error.status || 500;
        return NextResponse.json(
            { message: error.message || "An unexpected error occurred" },
            { status: statusCode }
        );
    }

}