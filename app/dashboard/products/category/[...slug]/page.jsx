import { FetchFilteredProducts } from "@/app/actions/CategoryActions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { filteredProductscolumn } from "./FilteredProductColumn";
import { DataTable } from "./DataTable";
import { Separator } from "@/components/ui/separator";

export default async function CategoryItem({params}) {
    
    const { slug } = await params;

    const filteredProducts = await FetchFilteredProducts(slug);
    
    
    return (

        <div>
            <div className="w-full h-full">
                <div className='capitalize px-7 py-6'>
                    <span className="font-semibold">{slug}</span>
                    <p className="text-sm">List of Products under category <span className="capitalize">{ slug}</span></p>
                </div>
                <Separator/>
                <div className="p-6">
                    <DataTable columns={filteredProductscolumn} data={filteredProducts || []}/>
                </div>
            </div>
        </div>
    )
}