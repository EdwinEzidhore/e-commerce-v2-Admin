"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be atleast 2 characters long").max(50),
  email: z.string().email(),
  password: z.string().min(6, "password must be atleast 6 characters long"),
});

const Signup = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    axios
      .post("/api/register", values)
      .then((res) => console.log(res))
      .catch((err) => console.log("from err", err));
  };

  return (
    <div className="flex flex-col h-auto md:h-screen bg-[#1A1A1A]">
      <div className="container mx-auto bg-[#262626] md:bg-[#1A1A1A1A] py-5 px-5 border-b-2 border-gray-700 ">
        <div className="flex items-center justify-between container mx-auto">
          <div data-sidebar="header" className="flex flex-col gap-2 p-2">
            <ul data-sidebar="menu" className="flex  min-w-0 flex-col gap-1">
              <li data-sidebar="menu-item" className="group/menu-item relative">
                <a
                  href="#"
                  data-sidebar="menu-button"
                  data-size="lg"
                  data-active="false"
                  className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 [&amp;&gt;span:last-child]:truncate [&amp;&gt;svg]:size-4 [&amp;&gt;svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-12 text-sm group-data-[collapsible=icon]:!p-0"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-command size-4"
                    >
                      <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"></path>
                    </svg>
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Acme Inc</span>
                    <span className="truncate text-xs">Enterprise</span>
                  </div>
                </a>
              </li>
            </ul>
          </div>
          <Button>
            <Link href={"/"}>Login</Link>
          </Button>
        </div>
      </div>
      <div className="flex justify-center flex-col md:flex-row h-full">
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center md:items-center">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="mb-3 md:mb-6">
                    <FormLabel
                      className="block text-white text-sm mb-2"
                      htmlFor="fullName"
                    >
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        className="w-full text-[#ffff] bg-[#262626] border-none focus:outline-none py-6"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="mb-3 md:mb-6">
                    <FormLabel
                      className="block text-white text-sm mb-2"
                      htmlFor="email"
                    >
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        className="w-full text-[#ffff] bg-[#262626] border-none focus:outline-none py-6"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="mb-3 md:mb-6">
                    <FormLabel
                      className="block text-white text-sm mb-2"
                      htmlFor="password"
                    >
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        className="w-full text-[#ffff] bg-[#262626] border-none focus:outline-none py-6"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col justify-center items-center">
                <Button
                  type="submit"
                  className="text-black bg-yellow-400 hover:bg-yellow-600"
                >
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
