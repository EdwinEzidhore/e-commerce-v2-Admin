"use client"
import { CreateBanner } from "@/app/actions/banner";
import ImageDropzone from "@/app/components/ImageDropzone";
import { SubmitButtons } from "@/app/components/SubmitButton";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {  useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function BannerRoute() {

    const [loading, setLoading] = useState(false);

    const [uploadedImage, setUploadedImage] = useState(); 


    const router = useRouter();

    const { toast } = useToast(); // toast message


    const fileSizeLimit = 5 * 1024 * 1024; // 5MB

    const formSchema = z.object({
        title: z.string().min(2, {
            message: "Description must be at least 2 characters.",
        }),
        file: z.instanceof(File)
            .refine(
                (file) =>
                    [
                        "image/png",
                        "image/jpeg",
                        "image/jpg",
                    ].includes(file.type),
                { message: "Invalid image file type" }
            )
            .refine((file) => file.size <= fileSizeLimit, {
                message: "File size should not exceed 5MB",
            })
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        }
    });


    const handleSubmit = async (values) => {

        setLoading(true);

        const formdata = new FormData;

        formdata.append("title", values.title);
        if (uploadedImage) {
            formdata.append("file", uploadedImage);
        }

        const response = await CreateBanner(formdata);

        if (response) {
            toast({
                description: `${response.message}`
            });
            setLoading(false);
            router.push("/dashboard/banner")
        }
    }

    //set uploadedImage state to images returned from imageDropZone component...
    const handleImageUpload = (images) => {
        setUploadedImage(images);
    }

    return (
        <div className="p-10">
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

                    <FormField
                        control={form.control}
                        name="file"
                        render={({ field }) => (
                            <FormItem className='flex flex-col gap-3'>
                                <FormControl>
                                    <ImageDropzone
                                        multiple={false}
                                        onImageUpload={(file) => {
                                            handleImageUpload(file);
                                            field.onChange(file)
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <SubmitButtons type={"Create Banner"} loading={loading} />
                </form>
            </Form>
        </div>
    )
}