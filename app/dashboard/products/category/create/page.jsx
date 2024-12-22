"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "@/app/components/DataTable";
import { Card, CardContent } from "@/components/ui/card";
import CategoryForm from "@/app/components/category/CategoryForm";
import { CategoryColumn } from "./CategoryColumn";  
import { FetchCategory } from "@/app/actions/CategoryActions";

const CreateCategory = () => {

    const [data, setData] = useState([]);

    const fetchCategories = async () => {
        try {
            const result = await FetchCategory();
            setData(result);
            console.log(result);
            
            
        } catch (error) {
            console.error("Error fetching categories:", error);
        } 
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 p-3">
            <div>
                <CategoryForm onCategoryAdded={fetchCategories} />
            </div>
            <div>
                <Card>
                    <CardContent>
                        
                            <DataTable
                                columns={CategoryColumn(fetchCategories)}  
                                data={data || []}
                            />
                        
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CreateCategory;
