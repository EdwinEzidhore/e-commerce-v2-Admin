import { NextResponse } from 'next/server';
import Product from '@/lib/modals/products';
import connect from '@/lib/db';
import cloudinary from '@/lib/cloudinary';
import { isAuthenticated } from '@/lib/middleware';
import Category from '@/lib/modals/Category';


export async function POST(request) {

    const user = await isAuthenticated();

    if (!user) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    try {

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
        }

        const { name, description, price, type, size,  color, category, featured, status, files } = data;


        if (files.length === 0 || !files) {
            return NextResponse.json({ message: "file not found! min 1 image required" }, { status: 404 });
        }

        if (!name||
            !description ||
            !price ||
            !featured ||
            !status ||
            !color
        ) {
            return NextResponse.json({
                message: "Product Fields are missing! - check for missign fields"
            }, {
                status: 400
            });
        }

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
                            if (error) reject(error);
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

        if (uploadResults) {

            const isCategory = await Category.findOne({ name: category });
            
            if (!isCategory) {
                throw new Error(`category ${category} not found!`)
            }

            const newProduct = await Product.create({
                name,
                description,
                price,
                type,
                size,
                color,
                category,
                categoryID:isCategory._id,
                featured,
                status,
                images: uploadResults,

            });

            if (newProduct) {
                return NextResponse.json({ message: "Product Created Successfully!", newProduct: newProduct }, { status: 200 });

            }
        }

        return NextResponse.json({msg:"dummy response"})

    } catch (error) {
        return NextResponse.json({ message: error.message || "something went wrong!" }, { status: 500 });
    }


}



export async function GET(request) {
    console.log("calling get request for fetch products");

    try {
        await connect();
        const products = await Product.find({}).sort({ createdAt: -1 });
        if (products) {
            return NextResponse.json({ message: "Fetched Products", products: products });
        }
    } catch (error) {
        return NextResponse.json({ message: "Error Fetching Products!" })
    }
}


export async function DELETE(request) {

    const user = await isAuthenticated();

    if (!user) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    const { prod_ID } = await request.json();

    if (!prod_ID) {
        return NextResponse.json({ message: "product id not found!" }, { status: 404 });
    }

    try {

        const product = await Product.findById(prod_ID);
        if (!product) {
            return NextResponse.json({ message: "Product not found!" }, { status: 404 });
        }

        const imageDeleteResults = await Promise.all(
            product.images.map(
                (img) =>
                    new Promise((resolve, reject) => {
                        cloudinary.uploader.destroy(img.public_id, (error, result) => {
                            if (error) {
                                console.error(`Failed to delete image:`, error);
                                reject(new Error(`Failed to delete image `));
                            } else {
                                console.log(`Deleted image:`, result);
                                resolve(result);
                            }
                        });
                    })
            )
        );

        await Product.findByIdAndDelete(prod_ID);

        
        return NextResponse.json({ message: "Product Deleted successfully !" }, { status: 200 })



    } catch (error) {
        return NextResponse.json({ message: error.message || "something went wrong!" }, { status: 500 });

    }


}