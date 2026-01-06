"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Loading from "./loading";
import { SubmitButtons } from "./SubmitButton";

const Login = () => {
  const { toast } = useToast();

  const session = useSession();
  const { status } = useSession();
  const router = useRouter();

  const [loading, setloading] = useState(false);

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [session, router]);

  const formSchema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
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
        description: res.error,
      });
      // console.log("from login page", res.error.Error);
      setloading(false);
      // console.log("login error occured!");
    }
    if (res?.ok) {
      setloading(false);
      return router.push("/dashboard");
    }
  };

  if (status == "loading") {
    return <Loading />;
  }

  return (
    <div className="flex flex-col mx-auto h-screen bg-[#1A1A1A]">
      <div className="container mx-auto flex items-center justify-between bg-[#262626] md:bg-[#1A1A1A1A] py-5 px-5 border-b-2 border-gray-700 ">
        <div>
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
        </div>
        <div>
          <Button>
            <Link href={"/register"}>Register</Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col justify-center md:flex-row h-full">
        <div className="w-full  md:w-1/2  p-8 flex flex-col justify-center  md:items-center">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="mb-3 md:mb-6">
                    <FormLabel
                      className="block text-white text-sm mb-2"
                      htmlFor="email"
                    >
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="text"
                        placeholder="Enter your Email Address"
                        className="w-full text-[#ffff] bg-[#262626] border-none focus:outline-none py-6"
                        {...field}
                      ></Input>
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
                        placeholder="Enter password"
                        className="w-full text-[#ffff] bg-[#262626] border-none focus:outline-none py-6"
                        {...field}
                      ></Input>
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
          <div className="flex flex-col p-3 bg-slate-900 mt-5">
            <span>
              <span className="text-neutral-700  uppercase font-thin">
                Test MailId
              </span>{" "}
              : test@gmail.com
            </span>
            <span>
              {" "}
              <span className="text-neutral-700  uppercase font-thin">
                Test Password
              </span>{" "}
              : 123456
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
