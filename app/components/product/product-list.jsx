"use client"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Ellipsis, Pencil, Trash } from "lucide-react";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Suspense, useState } from "react";
import Loading from "../loading";
import { Separator } from "@/components/ui/separator";


const ProductList = ({ products }) => {

  const [initialproducts, setinitialproducts] = useState(products)
  const { toast } = useToast();

  const handleProductDelete = (id) => {

    if (id) {
      axios.delete(`/api/product`, { data: { prod_ID: id } })
        .then((res) => {
          console.log(res);
          toast({
            description: `${res.data.message}`
          })
          setinitialproducts((prevProducts) => prevProducts.filter((product) => product._id !== id));

        })
        .catch((err) => {
          console.log(err);
          toast({
            description: `${err?.response?.data?.message ?? "An unexpected error occured!"}`,
          })

        })
    }
  }

  return (
    <div className=" w-full">

      <div className='w-full h-full'>
      <div className="flex justify-between items-center px-2 py-5">
        <span className="font-semibold">Products</span>
        <div>
          <Button><Link href={'/dashboard/products/create'}>Add New Product</Link></Button>
        </div>
      </div>
      <Separator/>
        
        <Table >
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="hidden sm:table-cell">Type</TableHead>
            <TableHead className="hidden sm:table-cell">Status</TableHead>
            <TableHead className="hidden sm:table-cell">Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>

          </TableRow>
        </TableHeader>
        <Suspense fallback={<Loading />}>
          <TableBody>
            {
              initialproducts?.map((product) => (
                <TableRow className="bg-accent" key={product._id || ''}>
                  <TableCell>

                    <CldImage src={product.images?.[0]?.secure_url ?? ''} width={50} height={50} alt="image" />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium capitalize">{product.name || ""}</div>

                  </TableCell>
                  <TableCell className="hidden sm:table-cell capitalize">{product.type || ""}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge className="text-xs capitalize" variant="secondary">
                      {product.status || ""}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{product.price || ""}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          <Ellipsis />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="py-2 px-4">
                        <DropdownMenuLabel>
                          Actions
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem asChild>

                            <Link className="py-2 px-4" href={`/dashboard/products/${product._id}`}> <Pencil /> Edit </Link>

                          </DropdownMenuItem>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>

                              <Button className=' text-white' variant='destructive'>
                                <Trash /> Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the Product
                                  .
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction asChild>

                                  <Button className='bg-red-500' onClick={() => handleProductDelete(product._id)} variant={"destructive"}>Continue</Button>
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                        </DropdownMenuGroup>


                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>

                </TableRow>
              ))
            }

          </TableBody>

        </Suspense>

      </Table>
        
      </div>
      

      
    </div>
    
  );
}

export default ProductList;