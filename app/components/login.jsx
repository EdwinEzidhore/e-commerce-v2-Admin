"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Loading from './loading';
import { SubmitButtons } from './SubmitButton';

const Login = () => {


    const { toast } = useToast();

    const session = useSession();
    const { status } = useSession();
    const router = useRouter();

    const [loading, setloading] = useState(false);

    useEffect(() => {
        if (session?.status === 'authenticated') {
            router.replace('/dashboard');
        }
    }, [session, router]);


    const formSchema = z.object({

        email: z.string().email(),
        password: z.string(),

    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const onSubmit = async (values) => {
        setloading(true);
        const res = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
        });
        console.log(res);
        
        if (res?.error) {

            toast({
                description: res.error
            })
            console.log("from login page", res.error.Error);
            setloading(false)
            console.log("login error occured!");

        }
        if (res?.ok) {
            setloading(false)
            return router.push("/dashboard");
        }

    };


    if (status == "loading") {
        return <Loading />
    }


    return (

        <div className="flex flex-col  h-screen bg-[#1A1A1A]">

            <div className='flex w-full  items-center justify-between bg-[#262626] md:bg-[#1A1A1A1A] py-5 pl-5 border-b-2 border-gray-700 '>
                <div><img src={null} alt="logo" className='w-fit' /></div>
                <div>
                    <Button><Link href={'/register'}>Register</Link></Button>
                </div>
            </div>


            <div className='flex flex-col justify-center md:flex-row h-full'>

                <div className="w-full  md:w-1/2  p-8 flex flex-col justify-center  md:items-center">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className='mb-3 md:mb-6'>
                                        <FormLabel className="block text-white text-sm mb-2" htmlFor="email">
                                            Email
                                        </FormLabel>
                                        <FormControl>
                                            <Input id='email' type='text' placeholder='Enter your Email Address' className="w-full text-[#ffff] bg-[#262626] border-none focus:outline-none py-6" {...field}></Input>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className='mb-3 md:mb-6'>
                                        <FormLabel className="block text-white text-sm mb-2" htmlFor="password">
                                            Password
                                        </FormLabel>
                                        <FormControl>
                                            <Input id='password' type='password' placeholder='Enter password' className="w-full text-[#ffff] bg-[#262626] border-none focus:outline-none py-6" {...field}></Input>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex flex-col justify-center items-center">
                                <SubmitButtons type={"Login"} loading={loading} />

                            </div>
                        </form>
                    </Form>
                </div>
            </div>

        </div>
    );
};

export default Login;