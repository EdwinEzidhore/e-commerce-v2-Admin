import cloudinary from "@/lib/cloudinary";
import connect from "@/lib/db";
import { isAuthenticated } from "@/lib/middleware";
import Product from "@/lib/modals/Products";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
    const data_id = await params.id;

    // console.log("data_id",data_id);
    

    try {
        const user = await isAuthenticated();
        if (!user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        await connect();

        const formdata = await request.formData();
        const data = {
            name: formdata.get("name"),
            description: formdata.get("description"),
            price: formdata.get("price"),
            type: formdata.get("type"),
            size: formdata.getAll("size[]"),
            color: formdata.get("color"),
            category: formdata.get("category"),
            featured: formdata.get("featured"),
            status: formdata.get("status"),
            files: formdata.getAll('file'),
        };

        const { name, description, price,type, size, color, category, featured, status, files } = data;

        const imageResults = [];
        if (files && files.length > 0) {
            const uploadResults = await Promise.all(
                files.map(async (file) => {
                    const bytes = await file.arrayBuffer();
                    const buffer = Buffer.from(bytes);

                    return new Promise((resolve, reject) => {
                        
                        const uploadStream = cloudinary.uploader.upload_stream(
                            {
                                folder: "shopping-site-v2",
                                quality: "auto:good",
                                format: "webp",
                                width: 350,
                                height: 400,
                                crop: "limit",
                            },
                            (error, result) => {
                                if (error) reject(new Error("An error occured while uploading image! Try again..."));
                                else resolve({
                                    public_id: result.public_id,
                                    secure_url: result.secure_url,
                                });
                            }
                        );
                        uploadStream.end(buffer);
                    });
                })
            );
            imageResults.push(...uploadResults);
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            data_id,
            {
                name,
                description,
                price,
                type,
                size,
                color,
                category,
                featured,
                status,

                ...(imageResults.length > 0 &&
                    { $push: { images: { $each: imageResults } } }
                ),
            },
            { new: true }
        );

        if (!updatedProduct) {
            return NextResponse.json(
                { message: "Product not found!" },
                { status: 404 }
            );
        }

        
        return NextResponse.json(
            { message: "Product updated successfully!" },
            { status: 200 }
        );
    } catch (error) {

        console.error(error);
        return NextResponse.json(
            { message: error.message || "Something went wrong!" },
            { status: 500 }
        );
    }
}
