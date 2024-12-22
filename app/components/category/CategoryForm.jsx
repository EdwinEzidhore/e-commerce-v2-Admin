"use client"
import React, { useState } from 'react'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCategory } from '@/app/actions/CategoryActions';
import { PlusCircleIcon, Trash2 } from 'lucide-react';
import { SubmitButtons } from '../SubmitButton';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';


const CategoryForm = ({onCategoryAdded}) => {

    const [loading, setLoading] = useState(false);

    const { toast } = useToast();

    const formSchema = z.object({
        name: z.string().min(2, {
            message: "Category name must be at least 2 characters.",
        }).regex(/^[a-zA-Z0-9 ]*$/, {
            message: "Category name cannot contain special characters.",
        }),
        subCategories: z
            .array(
                z.object({
                    id: z.number(),
                    value: z.string(),
                })
            )
           
    });


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            subCategories: [],
        },
    });


    const { reset} = form;

    const addSubCategory = () => {
        const currentSubCategories = form.getValues("subCategories");
        const newSubCategory = { id: currentSubCategories.length + 1, value: "" };
        form.setValue("subCategories", [...currentSubCategories, newSubCategory]);
    };

    const deleteSubCategory = (index) => {
        const currentSubCategories = form.getValues("subCategories");
        const updatedSubCategories = currentSubCategories.filter((_, i) => i !== index);
        form.setValue("subCategories", updatedSubCategories);

    }

    const OnSubmit = async (values) => {
        setLoading(true)
        const res = await createCategory(values);
        if (res) {
            setLoading(false);
            toast({
                description: res.message
            })
            
        }
        if (res.success === true) {
            reset({
                name: "",
                subCategories: [],  
            });
            onCategoryAdded();
        }
    };

    return (
        <Card className=' h-96 md:h-full overflow-y-auto'>
            <CardHeader>
                <CardTitle>Manage Category</CardTitle>
                <CardDescription>Here you can add new category and their sub-catgeory...</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className='p-5'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(OnSubmit)} className="space-y-8">

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <FormControl>
                                        <Input  placeholder="Enter parent category... e.g., T-Shirt" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        {
                            form.watch("subCategories").map((subCategory, index) => (
                                <FormField
                                    key={subCategory.id}
                                    control={form.control}

                                    name={`subCategories.${index}.value`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Subcategory {index + 1}</FormLabel>
                                            <FormControl>

                                                <div className="flex items-center space-x-3">
                                                    <Input  className='flex-grow capitalize' placeholder={`Enter subcategory name...`} {...field} />
                                                    <Button type="button" onClick={() => deleteSubCategory(index)}>
                                                        <Trash2 />
                                                    </Button>
                                                </div>

                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))
                        }




                        <div>
                            <Button className="mt-5" type="button" onClick={addSubCategory}>
                                <PlusCircleIcon className="mr-2" />
                                Add New Subcategory
                            </Button>

                        </div>


                        <SubmitButtons type={"Create"} loading={loading} />
                    </form>
                </Form>

            </CardContent>
        </Card>
    )
}

export default CategoryForm