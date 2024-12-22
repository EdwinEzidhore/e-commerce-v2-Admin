"use server"

import connect from "@/lib/db";
import { isAuthenticated } from "@/lib/middleware";
import Category from "@/lib/modals/Category";
import Product from "@/lib/modals/products";
import { Db } from "mongodb";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function createCategory(formData) {
    const user = await isAuthenticated();

    if (!user) {
        redirect('/');
    }

    try {
        await connect();
        console.log(formData);
        
        const { name, subCategories } = formData;


        const isExisting = await Category.findOne({ name });

        
        if (isExisting) {
            return {
                success: false,
                message:`Category ${name} already exists! `
            }
        }
        
        const flatten_Category = subCategories?.map((category) => ({name:category.value})  )


        console.log(flatten_Category);


        const category = new Category({
            name,
            sub_category: flatten_Category || null, 
        });

        await category.save();
        return {
            success: true,
            message: 'Successfully created new category!',
            
        };

    } catch (error) {
        console.log(error);
        
        return {
            success: false,
            message: 'Failed to create category!',
            error: error.message || 'An unexpected error occurred',
        };
    }
}


export async function CategoryDelete(id) {
    const user = await isAuthenticated();

    if (!user) {
        redirect('/');
    }

    try {
        
        await connect();

        const isExisting = await Category.findByIdAndDelete(id);
        if (!isExisting) {
            return {
                success: false,
                message: 'Category not found!',
            };
        }
        
        return {
            success: true,
            message: 'Category deleted successfully!',
        };

       

    } catch (error) {
        return {
            success: false,
            message: 'Failed to delete category!',
            error: error.message || 'An unexpected error occurred',
        };
    }
}


export async function FetchCategory() {
    try {
        
        const response = await Category.find({});
        const result = JSON.parse(JSON.stringify(response));
        return result;

    } catch (error) {
        return {
            success: false,
            message: 'Failed to fetch category!',
            error: error.message || 'An unexpected error occurred',
        };
    }
}


export async function updateCategory(payload,id) {
    const user = await isAuthenticated();

    if (!user) {
        redirect('/');
    }

    try {

        await connect();
        const category = await Category.findByIdAndUpdate(
            id,
            {
                $set:payload
            },
            {new:true},
        );

        if (!category) {
            return {
                success: false,
                message: 'Category not found!',
                error: error.message || 'An unexpected error occurred',
            };
        }        
    
        return {
            success: true,
            message: 'Category updated successfully!',
           
        };
        
        
    } catch (error) {
        console.log(error);
        
        return {
            success: false,
            message: 'Failed to update category!',
            error: error.message || 'An unexpected error occurred',
        };
    }
}


export async function getCategoryDetails() {
    const user = await isAuthenticated();

    if (!user) {
        redirect('/');
    }

    try {
        await connect();
        const response = await Product.aggregate([
            {
                $lookup: {
                    from: "categories",         
                    localField: "categoryID",    
                    foreignField: "_id",         
                    as: "categoryDetails"        
                }
            },
            { $unwind: "$categoryDetails" },  
            {
                $group: {
                    _id: "$categoryDetails.name", 
                    productCount: { $sum: 1 }     
                }
            },
            {
                $project: {
                    _id: 0,                      
                    category: "$_id",            
                    productCount: 1              
                }
            }
        ]);

        
        return response;

    } catch (error) {
        console.error("Error fetching category details:", error);
        
        return {
            success: false,
            message: 'Failed to fetch category!',
            error: error.message || 'An unexpected error occurred',
        };
    }
}


export async function FetchFilteredProducts(params) {
    const user = await isAuthenticated();

    if (!user) {
        redirect('/');
    }

    try {

        await connect();

        const filtered = await Product.find({ category: params });
        const result = JSON.parse(JSON.stringify(filtered));

        return result;
        
    } catch (error) {
        console.error("Error fetching filtered products:", error);
        
        return {
            success: false,
            message: 'Failed to fetch filtered products!',
            error: error.message || 'An unexpected error occurred',
        };
    }
}