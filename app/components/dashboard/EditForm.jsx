"use client"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SubmitButtons } from "../SubmitButton";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { CldImage } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import axios from "axios";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast"
import {  useRouter } from "next/navigation";
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export function EditForm({ data ,categories}) {

    const [Categories, setCategories] = useState(categories)


    console.log("prop",data);
    const { toast } = useToast();

    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState([]);
    const [prevURL, setprevURL] = useState([]);

    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")

    const formSchema = z.object({
        name: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }),
        description: z.string().min(5, { message: "description must contain atleast 5 characters!" }),
        price: z.coerce.number().int().positive("Enter a Valid Price!").min(1),
        type: z.string(),
        size: z.array(z.string()),
        color: z.string(),
        category: z.string(),
        featured: z.boolean().default(false).optional(),
        status: z.string(),


    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: data.name || "",
            description: data.description || "",
            price: data.price || "",
            type: data.type || "",
            size: data.size || [],
            color: data.color || "#f5f5dc",
            category:data.category || "",
            featured: data.featured || false,
            status: data.status || "draft"
        }


    });

    const handleImageUpload = (e) => {

        const files = Array.from(e.target.files);
        setImage(prev => [...prev, ...files]);

        //creating temporary preview url for images
        const previewUrls = files.map(file => URL.createObjectURL(file));
        setprevURL((prev) => [...prev, ...previewUrls]);

    };


    const handlePreviewImage = (index) => {
        setImage(image.filter((_, i) => i != index));
        setprevURL(prevURL.filter((_, i) => i != index));

    }

    
    const handleCheckboxChange = (currentValue, valueToToggle) => {
        const isChecked = currentValue.includes(valueToToggle);
        return isChecked
            ? currentValue.filter((value) => value !== valueToToggle)
            : [...currentValue, valueToToggle];
    };

    const onSubmit = (values) => {

        setLoading(true);
        const config = {
            headers: { "Content-Type": "multipart/form-data" },
        };

        const formData = new FormData();

        formData.append('name', values.name);
        formData.append('description', values.description);
        formData.append('price', values.price);
        formData.append('type', values.type);
        values.size.forEach((size) => {
            formData.append('size[]', size);
          });
        formData.append("color", values.color);
        formData.append('category', values.category);
        formData.append('featured', values.featured);
        formData.append('status', values.status);

        image.forEach((img, index) => {
            formData.append("file", img);
        });

        axios.post(`/api/product/${data._id}`, formData)
            .then((res) => {
                console.log(res);
                setLoading(false);
                toast({
                    description: `${res.data.message}`,
                })
                router.push('/dashboard/products')

            }
            )
            .catch((err) => {
                setLoading(false);
                console.log("Error", err);
                toast({
                    description: `${err?.response?.data?.message ?? "An unexpected error occured!"}`,
                })
            })

    };

    const handleImageDelete = (id) => {
        if (id) {
            axios.delete('/api/product/img-delete', { data: { public_id: id, pro_id: data._id } })
                .then((res) => {
                    console.log(res);
                    toast({
                        description: `${res.data.message}`,
                    })

                })
                .catch((err) => {
                    console.log(err);

                })
        }
    }



    return (
        <div className="p-10">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Name */}
                        <FormField
                            control={form.control}
                            name="name"

                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Price */}
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="$23" {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* type */}
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <FormControl>
                                        <div className="w-full">
                                            <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Select Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="men">Men</SelectItem>
                                                        <SelectItem value="women">Women</SelectItem>
                                                        <SelectItem value="kids">Kids</SelectItem>
                                                        <SelectItem value="unisex">Unisex</SelectItem>

                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>

                                        </div>

                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* size field */}
                        <FormField
                            control={form.control}
                            name="size"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Available Sizes</FormLabel>
                                    <FormControl>
                                        <div className="flex  space-x-2 flex-wrap gap-y-2">
                                            {
                                                ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'].map((size) => (
                                                    <div key={size} className="flex items-center">
                                                        <label className="relative w-10 h-10 flex  items-center justify-center cursor-pointer ">

                                                            <Input
                                                                type="checkbox"
                                                                className="absolute w-full h-full opacity-0 cursor-pointer "
                                                                checked={field.value?.includes(size)}
                                                                onChange={() => field.onChange(handleCheckboxChange(field.value || [], size))}

                                                            />

                                                            <span
                                                                className={`w-full h-full flex items-center justify-center flex-wrap rounded-md border-2 font-medium transition-colors ${field.value?.includes(size)
                                                                    ? ' bg-blue-500 border-blue-500 light:text-white'
                                                                    : 'light:bg-[#fff] border-gray-400 text-gray-500'
                                                                    }`}
                                                            >
                                                                {size}
                                                            </span>
                                                        </label>
                                                    </div>
                                                ))}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Color */}
                        <FormField
                            control={form.control}
                            name="color"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Color</FormLabel>
                                    <FormControl>
                                        <div className="relative h-10 w-10 rounded-full">

                                            <div
                                                className="h-full w-full rounded-full z-10"
                                                style={{ background: field.value }}
                                            ></div>


                                            <Input
                                                type="color"
                                                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-0"
                                                {...field}
                                            />
                                        </div>

                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* category */}
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <br />
                                    <FormControl>
                                        <Popover open={open} onOpenChange={setOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={open}
                                                    className="w-[200px] justify-between capitalize"
                                                >
                                                    {
                                                        field.value
                                                            ? Categories.find((category) => category.name === field.value)?.name
                                                            : "Select Category..."
                                                    }
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[200px] p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search Category..." />
                                                    <CommandList>
                                                        <CommandEmpty>No framework found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {
                                                                Categories?.map((category) => (
                                                                    <CommandItem
                                                                        className='capitalize'
                                                                        key={category._id}
                                                                        value={category.name}
                                                                        onSelect={(currentValue) => {
                                                                            field.onChange(currentValue === field.value ? "" : currentValue);
                                                                            
                                                                            setOpen(false)
                                                                        }}
                                                                    >
                                                                        <Check
                                                                            className={cn(
                                                                                "mr-2 h-4 w-4",
                                                                                value === category.name ? "opacity-100" : "opacity-0"
                                                                            )}
                                                                        />
                                                                        {category.name}
                                                                    </CommandItem>
                                                                ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>

                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* featured */}
                        <FormField
                            control={form.control}
                            name="featured"
                            render={({ field }) => (
                                <FormItem className='flex flex-col gap-3'>
                                    <FormLabel>Featured Product</FormLabel>
                                    <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormDescription>Enable to add product to featured list</FormDescription>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Status */}
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem className='flex flex-col gap-3'>
                                    <FormLabel>Status</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="draft">Draft</SelectItem>
                                                    <SelectItem value="published">Published</SelectItem>
                                                    <SelectItem value="archived">Archived</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* files */}
                        <FormField
                            control={form.control}
                            name="file"
                            render={({ field }) => (
                                <FormItem className='flex flex-col gap-3'>

                                    <FormControl>
                                        <Input placeholder='Upload images' type='file' name="file" multiple onChange={(e) => handleImageUpload(e)}></Input>
                                    </FormControl>
                                    <FormMessage />

                                    <div className="flex gap-5 items-center flex-wrap">

                                        {
                                            data && (

                                                data.images.map((img, index) => (
                                                    <div className="relative w-[100] h-[100]" key={index}>
                                                        <CldImage
                                                            key={index}
                                                            src={img.secure_url}
                                                            width={100}
                                                            height={100}
                                                            alt="preview"
                                                            priority
                                                        />
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button

                                                                    type='button' className='w-3 p-5 absolute -top-3 -right-3 bg-red-600'>
                                                                    <XIcon className="text-white " />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        This action cannot be undone. This will permanently delete the image
                                                                        from our servers.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction asChild>
                                                                        <Button onClick={() => handleImageDelete(img.public_id)}>Continue</Button>
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>

                                                    </div>

                                                ))
                                            )
                                        }
                                        {
                                            prevURL && (

                                                prevURL.map((url, index) => (
                                                    <div className="relative w-[100] h-[100]" key={index}>
                                                        <Image
                                                            key={index}
                                                            src={url}
                                                            width={100}
                                                            height={100}
                                                            alt="preview"
                                                        />
                                                        <Button
                                                            onClick={() => handlePreviewImage(index)}
                                                            type='button' className='w-3 p-5 absolute -top-3 -right-3 bg-red-600'>
                                                            <XIcon className="text-white " />
                                                        </Button>
                                                    </div>

                                                ))
                                            )
                                        }
                                    </div>




                                </FormItem>
                            )}
                        />
                    </div>

                    <SubmitButtons type={"Save Changes"} loading={loading} />
                </form>
            </Form>

        </div>

    )
}