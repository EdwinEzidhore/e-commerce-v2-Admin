

import { Card, CardContent,CardHeader,CardTitle} from "@/components/ui/card";
import ImageDropzone from "../components/ImageDropzone";
import Loading from "../components/loading";

export default function Page() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <Card className=" shadow-md rounded-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            
            Total Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">1,234</p>
        </CardContent>
      </Card>

      <Card className=" shadow-md rounded-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            
            Total Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">567</p>
        </CardContent>
      </Card>

      <Card className=" shadow-md rounded-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            
            Total Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">890</p>
        </CardContent>
      </Card>

      <Card className=" shadow-md rounded-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
           
            Total Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">$12,345</p>
        </CardContent>
      </Card>
      </div>
      
     
    </>
    
  );
}
