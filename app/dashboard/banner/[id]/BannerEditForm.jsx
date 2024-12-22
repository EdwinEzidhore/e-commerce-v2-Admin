"use client"
import React, { useState } from 'react'
import ImageDropzone from "@/app/components/ImageDropzone";
import { SubmitButtons } from "@/app/components/SubmitButton";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CldImage } from 'next-cloudinary';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { bannerImageDelete, UpdateBanner } from '@/app/actions/banner';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
const BannerEditForm = ({ Banner }) => {

    const [uploadedImage, setUploadedImage] = useState();
    const [loading, setLoading] = useState(false);


    const { _id, title, banner } = Banner || {};
    const secure_url = banner?.secure_url || null;
    const public_id = banner?.public_id || null

    const { toast } = useToast();

    const router = useRouter();

    const fileSizeLimit = 5 * 1024 * 1024; // 5MB

    const formSchema = z.object({
        title: z.string().min(2, {
            message: "Title must be at least 2 characters.",
        }),
        file: z
            .instanceof(File)
            .optional() 
            .refine(
                (file) => file === undefined || file.size > 0,
                { message: "File cannot be empty." }
            )
            .refine(
                (file) =>
                    file === undefined ||
                    ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
                { message: "Invalid image file type." }
            )
            .refine(
                (file) => file === undefined || file.size <= 5 * 1024 * 1024,
                { message: "File size should not exceed 5MB." }
            ),
    });
    

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: title || "",

        }
    });


    const handleImageDelete = async () => {
        try {
            const result = await bannerImageDelete(_id);
            if (result) {
                toast({ description: result.message });
                if (result.success) {
                    router.refresh();
                }
            }
        } catch (error) {
            toast({ description: "Failed to delete the image. Please try again!" });
        }
    };


    const handleSubmit = async (values) => {
        console.log(values);

        setLoading(true);

        const formdata = new FormData;

        formdata.append("title", values.title);
        if (uploadedImage) {
            formdata.append("file", uploadedImage);
        }

        const response = await UpdateBanner(formdata, { banner_ID: _id || '' });

        if (response) {
            toast({
                description: `${response.message}`
            });
            setLoading(false);
            router.push("/dashboard/banner")
        }
    }

    //set uploadedImage state to images returned from imageDropZone component...
    const handleImageUpload = (image) => {
        setUploadedImage(image)
    }



    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input className='capitalize' placeholder="create a title for banner" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {
                        secure_url ? (
                            <div className="relative w-fit group">
                                <CldImage
                                    src={secure_url}
                                    alt="banner"
                                    width={300}
                                    height={300}
                                    className="rounded "
                                />
                                <Button
                                    type="button"
                                    onClick={handleImageDelete}
                                    variant="destructive"
                                    className="rounded-full absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (

                            <FormField
                                control={form.control}
                                name="file"
                                render={({ field }) => (
                                    <FormItem className='flex flex-col gap-3'>
                                        <FormControl>

                                            <ImageDropzone
                                                multiple={false}
                                               
                                                onImageUpload={
                                                    (file) => {
                                                        handleImageUpload(file);
                                                        field.onChange(file || undefined)
                                                    }}
                                            />

                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )
                    }


                    <SubmitButtons type={"Update"} loading={loading} />
                </form>
            </Form>
        </div>
    )
}

export default BannerEditForm