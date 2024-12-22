import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategoryDetails } from "@/app/actions/CategoryActions";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Separator } from "@/components/ui/separator";



export default async function Category() {

    const data = await getCategoryDetails();



    return (
        <div className="h-full">
            <div className='w-full h-full '>
            <div className="px-7 py-6 ">
                <div className="flex justify-between items-center">
                    <div>
                        <span className='mb-3 font-semibold'>Product Category</span>
                    </div>
                </div>
                
                </div>
                <Separator/>
                
                <div className="p-6">
                <DataTable
                    columns={columns}
                    data={data}
                />
                </div>
                
               
            </div>
            
        </div>
    )
}