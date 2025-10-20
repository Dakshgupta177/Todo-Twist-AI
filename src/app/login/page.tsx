"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios, { AxiosError } from "axios";
import { signinSchemaValidation } from "@/schemas/signinSchema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { useState } from "react";
import { Loader } from "lucide-react";

export default function SigninPage() {
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const form = useForm<z.infer<typeof signinSchemaValidation>>({
    resolver: zodResolver(signinSchemaValidation),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof signinSchemaValidation>) => {
    try {
      setLoader(true);
      const res = await axios.post("/api/user/login", {
        identifier: data.identifier,
        password: data.password,
      });

      toast.success("Login Successful ", {
        description: res.data?.message || "Welcome back!",
        action: {
          label: "Got It",
          onClick: () => {},
        },
      });
      router.replace("/");
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error("Login Error:", axiosError);
      toast.error("Login Failed ", {
        description:
          axiosError.response?.data.message || "Something went wrong.",
        action: {
          label: "Try Again",
          onClick: () => {},
        },
      });
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto mt-10 p-6 border border-zinc-800/20 rounded-2xl shadow-lg bg-background">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Sign in to your account
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username or Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter username or email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-full px-6 shadow-lg hover:shadow-xl transition-all"
            >
              Sign In
            </Button>
          </form>
        </Form>
      </div>
      {loader && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
          <Loader className="font-bold size-20 animate-spin ease-in-out duration-300 z-50" />
        </div>
      )}
    </>
  );
}
