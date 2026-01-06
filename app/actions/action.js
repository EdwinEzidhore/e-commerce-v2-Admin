"use server";
import connect from "@/lib/db";
import { isAuthenticated } from "@/lib/middleware";
import Product from "@/lib/modals/Product.js";
import { redirect } from "next/navigation";


export async function FetchProducts() {
    const user = await isAuthenticated();
    console.log("fetching products");

    if (!user) {
        redirect('/');
    }

    try {
        await connect();
        const products = await Product.find({}).sort({ createdAt: -1 });
        
        if (products) {
            return JSON.parse(JSON.stringify(products));
        }
    } catch (error) {
        return {
            success: false,
            message: 'Failed to fetch products',
            error: error.message || 'An unexpected error occurred',
        };
    }
}



