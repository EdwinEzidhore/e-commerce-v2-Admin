"use server"
import { throwError } from "@/helper/errorHandler";
import cloudinary from "@/lib/cloudinary";
import connect from "@/lib/db";
import { isAuthenticated } from "@/lib/middleware";
import Banner from "@/lib/modals/Banner.js";
import { redirect } from "next/navigation";




export async function CreateBanner(formdata) {
    const user = await isAuthenticated();

    if (!user) {
        redirect('/');
    }

    try {
        await connect();
        const data = {
            title: formdata.get("title"),
            file: formdata.get("file"),
        }

        const { title, file } = data;



        if (file === null || !file) {
            throw new Error("File not found!")
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const banner_upload_result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "shopping-site-v2",
                    quality: "auto:good",
                    format: "webp",


                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve({
                        public_id: result.public_id,
                        secure_url: result.secure_url,
                    });
                }
            );
            uploadStream.end(buffer);
        });

        if (banner_upload_result) {

            const new_banner = await Banner.create({
                title,
                banner: banner_upload_result
            })

            if (new_banner) {
                return {
                    success: true,
                    message: "Banner created successfully!",
                    status: 201
                }
            }
        }

        throw new Error("File upload failed!");

    } catch (error) {
        console.log(error);

        return {
            success: false,
            message: error.message || "Unexpected error occured!",
            status: error.status || 500
        }
    }


}

export async function DeleteBanner(id) {


    try {

        const user = await isAuthenticated();

        if (!user) {
            redirect('/');
        }

        await connect();

        if (!id || id == '') {
            throwError('The "ID" parameter is required. But not provided...', 404);
        }

        const banner = await Banner.findOne({ _id: id });

        if (!banner) {
            throwError("Banner not found!", 404);
        }

        const { banner: { public_id } } = banner;


        if (public_id) {

            const deletedBannerImage = await cloudinary.uploader.destroy(public_id);

            if (deletedBannerImage.result !== 'ok') {
                throwError("Failed to delete!", 500);
                return;
            }

        }

        const is_deleted = await Banner.findByIdAndDelete(id);

        if (!is_deleted) {
            throwError("Banner with 'ID' not found!", 204)
        }

        return {
            success: true,
            message: "Banner deleted successfully!",
            status: 200
        }


    } catch (error) {
        console.log(error);

        return {
            success: false,
            message: error.message || "Unexpected error occured!",
            status: error.status || 500
        }
    }

}


export async function bannerImageDelete(id) {
    try {
        const user = await isAuthenticated();

        if (!user) {
            redirect('/');
        }
        await connect();

        if (!id) {
            throwError("ID is required. But not provided..")
        }

        const is_banner = await Banner.findOne({ _id: id });
        if (is_banner) {

            const { banner: { public_id } } = is_banner;

            const deletedBannerImage = await cloudinary.uploader.destroy(public_id);

            if (deletedBannerImage.result = 'ok') {
                const updated_banner = await Banner.findOneAndUpdate(
                    {
                        _id: id
                    },
                    {
                        $unset: { banner: "" }
                    }
                )
                if (!updated_banner) {
                    throwError("Deletion failed!")
                }
                return {
                    success: true,
                    message: "Image deleted!",
                    status: 200

                }
            }
            throwError("Failed to delete image!", 500);
        }

    } catch (error) {
        console.log(error);

        return {
            success: false,
            message: error.message || "Unexpected error occured!",
            status: error.status || 500
        }
    }
}


export async function UpdateBanner(formdata,ID) {
    try {
        const user = await isAuthenticated();
        

        if (!user) {
            redirect('/');
        }
        await connect();
        
        const { banner_ID } = ID; 

        if (!banner_ID || banner_ID == '') {
            throwError("Banner ID missing!", 404);
        }

        // Getting formdata
        const data = {
            title: formdata.get("title"),
            file: formdata.get("file"),
        }

        
        // destructuring form data
        const { title, file } = data;

        if (file === null || !file) {
            throwError("File not found!", 404);
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const banner_upload_result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "shopping-site-v2",
                    quality: "auto:good",
                    format: "webp",


                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve({
                        public_id: result.public_id,
                        secure_url: result.secure_url,
                    });
                }
            );
            uploadStream.end(buffer);
        });
        
        if (banner_upload_result) {

            const new_banner = await Banner.findOneAndUpdate(
               { _id:banner_ID},
                {
                    $set: {
                        title,
                        banner: banner_upload_result
                        
                    }
                }
            );
            console.log(new_banner);
            
            if (!new_banner) {
                throwError("failed updating!")
            }

            return {
                success: true,
                message: "Updated Successfully!",
                status:200
                
            }
        
        }
        
    } catch (error) {
        console.log(error);

        return {
            success: false,
            message: error.message || "Unexpected error occured!",
            status: error.status || 500
        }
    }
}