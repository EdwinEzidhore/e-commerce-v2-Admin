"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form';
import * as z from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import axios from 'axios';

const formSchema = z.object({
    fullName: z.string().min(2, 'Name must be atleast 2 characters long').max(50),
    email: z.string().email(),
    password: z.string().min(6, 'password must be atleast 6 characters long'),

});

const Signup = () => {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",

        },
    })

    const onSubmit = async (values) => {
        axios.post('/api/register', values)
            .then((res) => console.log(res))
            .catch((err) => console.log("from err", err));

    }

    return (
        <div className="flex flex-col h-auto md:h-screen bg-[#1A1A1A]">
            <div className='w-full bg-[#262626] md:bg-[#1A1A1A1A] py-5 pl-5 border-b-2 border-gray-700 '>
                <div className='flex items-center justify-between container mx-auto'>
                    <img src="" alt="logo" />
                    <Button><Link href={'/'}>Login</Link></Button>

                </div>
            </div>
            <div className='flex justify-center flex-col md:flex-row h-full'>

                <div className="w-full md:w-1/2 p-8 flex flex-col justify-center md:items-center">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem className='mb-3 md:mb-6'>
                                        <FormLabel className="block text-white text-sm mb-2" htmlFor="fullName">
                                            Full Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input id="fullName" type="text" placeholder="Enter your full name" className="w-full text-[#ffff] bg-[#262626] border-none focus:outline-none py-6" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className='mb-3 md:mb-6'>
                                        <FormLabel className="block text-white text-sm mb-2" htmlFor="email">
                                            Email Address
                                        </FormLabel>
                                        <FormControl>
                                            <Input id="email" type="email" placeholder="Enter your email address" className="w-full text-[#ffff] bg-[#262626] border-none focus:outline-none py-6" {...field} />
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
                                            <Input id="password" type="password" placeholder="Enter your password" className="w-full text-[#ffff] bg-[#262626] border-none focus:outline-none py-6" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex flex-col justify-center items-center">
                                <Button type="submit" className="text-black bg-yellow-400 hover:bg-yellow-600">
                                    Sign Up
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
