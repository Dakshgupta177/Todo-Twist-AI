"use client";
import Link from "next/link";
import { CheckSquare } from "lucide-react";
import { useAuthStore } from "@/store/useAppStore";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function Navbar() {
  const { isLoggedIn, fetchLogout, fetchLogin } = useAuthStore();
  const router = useRouter();
  const isLogin = async () => {
    try {
      const res = await axios.get("/api/user/getuser");
      toast.success("User Login Successfully", {
        description: res.data.message || "",
        action: {
          label: "Got It",
          onClick: () => {},
        },
      });
      fetchLogin();
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      toast.error("Login Failed", {
        description: axiosError.response?.data.message || "Something went wrong",
        action: {
          label: "Try Again",
          onClick: () => {},
        },
      });
    }
  };
  useEffect(() => {
    isLogin();
  }, []);
  const handleLogout = async () => {
    try {
      const res = await axios.get("/api/user/logout");
      toast.success("User Logout Successfully", {
        description: res.data.message || "",
        action: {
          label: "Got It",
          onClick: () => {},
        },
      });
      fetchLogout();
      router.replace("/signup");
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      toast.error("Logout Failed", {
        description: axiosError.response?.data.message || "Something went wrong",
        action: {
          label: "Try Again",
          onClick: () => {},
        },
      });
    }
  };
  return (
    <nav className="w-full border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={"/"} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold">TodoMaster</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-8 max-sm:gap-2">
            <Link
              href="/"
              className="text-foreground hover:text-primary transition-colors max-sm:hidden"
            >
              Home
            </Link>
            <Link href={"/signup"}>
              <Button
                className={`bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-full px-6 shadow-lg hover:shadow-xl transition-all ${
                  isLoggedIn ? "hidden" : ""
                }`}
              >
                Sign Up
              </Button>
            </Link>
            <Link href={"/login"}>
              <Button
                className={`bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-full px-6 shadow-lg hover:shadow-xl transition-all ${
                  isLoggedIn ? "hidden" : ""
                }`}
              >
                Login
              </Button>
            </Link>
            <Button
              className={`bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-full px-6 shadow-lg hover:shadow-xl transition-all ${
                isLoggedIn ? "" : "hidden"
              }`}
              onClick={() => {
                handleLogout();
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
