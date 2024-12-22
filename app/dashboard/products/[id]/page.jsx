import { FetchCategory } from "@/app/actions/CategoryActions";
import { EditForm } from "@/app/components/dashboard/EditForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Product from "@/lib/modals/products";
import mongoose from "mongoose";
import { notFound } from "next/navigation";

async function getData(id) {
    console.log("calling getdata!");

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
    }

    try {
        const product = await Product.findOne({ _id: id });
        const plainData = JSON.parse(JSON.stringify(product));
        return plainData || null;

    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}

export default async function EditRoute({ params }) {
    const { id } = await params;
    

    const [product, categories] = await Promise.all([
        getData(id).catch((error) => ({ error: "getData failed", details: error })),
        FetchCategory().catch((error) => ({ error: "FetchCategory failed", details: error }))
      ]);

    if (!product) {
        return notFound();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Edit Product
                </CardTitle>
            </CardHeader>
            <CardContent>
            <EditForm data={product} categories={categories} />
            </CardContent>
        </Card>
    )
}
