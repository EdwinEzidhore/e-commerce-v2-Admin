"use server";

import { throwError } from "@/helper/errorHandler";
import connect from "@/lib/db";
import Product from "@/lib/modals/Product.js";

export async function Featured(params) {
    try {

        await connect();
        const fetched_products =await Product.find({}).sort({ createdAt: -1 });
        console.log(fetched_products);


        if (fetched_products) {
            return JSON.parse(JSON.stringify(fetched_products));
        }
        
    } catch (error) {
        console.error("sdfweferffw",error);

        throwError({
            success: false,
            message: "failed fetching products!" || error.message,
            status:error.status || 500,
        })
    }
}