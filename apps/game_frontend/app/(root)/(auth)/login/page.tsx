"use client";
import React, { useState } from "react";
import { useUserContext } from "../../../context/UserProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axiosInstance from "../../../helpers/AxiosInstance";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

const page = () => {
  const [loginInput, setLoginInput] = React.useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string>();
  const router = useRouter();
  const { setUserCtx } = useUserContext();
  const handleLoginInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginInput({
      ...loginInput,
      [e.target.id]: e.target.value,
    });
  };
  async function handleLogin() {
    const res = axiosInstance.post("/login", loginInput);
    toast.promise(res, {
      loading: "Loading",
      success: "Success",
      error: "Invalid credentials",
    });
    res
      .then((response) => {
        if (response.status > 400) {
          throw new Error("Failed to login");
        }
        setUserCtx(response.data.user);
        window.location.href = "/"; // Ensure cookies are sent
      })
      .catch((error) => {
        if (error instanceof Error) {
          setError(error.message);
        }
      });
  }
  async function handleGuestLogin() {
    const res = axiosInstance.post("/guest", loginInput);
    toast.promise(res, {
      loading: "Loading",
      success: "Success",
      error: "Invalid credentials",
    });
    res
      .then((response) => {
        if (response.status > 400) {
          throw new Error("Failed to login");
        }
        setUserCtx(response.data.user);
        window.location.href = "/"; // Ensure cookies are sent
      })
      .catch((error) => {
        if (error instanceof Error) {
          setError(error.message);
        }
      });
  }
  return (
    <div className={cn("flex flex-col gap-6 ")}>
      <Card className="overflow-hidden p-0 border-black ">
        <CardContent className="grid p-0 md:grid-cols-2 ">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your account
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  type="text"
                  id="username"
                  value={loginInput.username}
                  onChange={handleLoginInput}
                  placeholder="Gavin Belson"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  type="password"
                  id="password"
                  value={loginInput.password}
                  onChange={handleLoginInput}
                  placeholder="Your password"
                  required
                />
              </div>
              <Button
                type="button"
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={handleLogin}
              >
                Login
              </Button>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
              <div className="">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white "
                  onClick={handleGuestLogin}
                >
                  Continue as Guest
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="https://jooinn.com/images/dark-chess-1.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
};

export default page;

