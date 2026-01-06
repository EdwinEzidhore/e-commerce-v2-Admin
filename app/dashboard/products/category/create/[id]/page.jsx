import CategoryEdit from "@/app/components/category/CategoryEdit";
import Category from "@/lib/modals/Category.js";

async function FetchCategory(id) {
    try {
        const response = await Category.findOne({ _id: id });
        const result = JSON.parse(JSON.stringify(response));
        return result;
        
    } catch (error) {
        
    }
}
export default async function EditCategory({params}) {
    
    const { id } = await params;
    
    const result = await FetchCategory(id);
    
    
    return (
        <CategoryEdit data={result}/>
    )
}