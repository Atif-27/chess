"use client";
import React, { useState } from "react";
import { useUserContext } from "../../../context/UserProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axiosInstance from "../../../helpers/AxiosInstance";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

const page = () => {
  const [registerInput, setRegisterInput] = React.useState({
    username: "",
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>();
  const router = useRouter();
  const { setUserCtx } = useUserContext();
  const handleRegisterInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterInput({
      ...registerInput,
      [e.target.id]: e.target.value,
    });
  };
  async function handleRegister() {
    const res = axiosInstance.post("/register", registerInput);
    toast.promise(res, {
      loading: "Loading",
      success: "Registered successfully, you can login now",
      error: "Invalid entry",
    });
    res
      .then((response) => {
        if (response.status > 400) {
          throw new Error("Failed to login");
        }
        router.push("/login");
      })
      .catch((error) => {
        if (error instanceof Error) {
          setError(error.message);
        }
      });
  }
  return (
    <div className={cn("flex flex-col gap-6 ")}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  value={registerInput.name}
                  onChange={handleRegisterInput}
                  placeholder="Gavin Belson"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  type="text"
                  id="username"
                  value={registerInput.username}
                  onChange={handleRegisterInput}
                  placeholder="gavinbelson"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  value={registerInput.email}
                  onChange={handleRegisterInput}
                  placeholder="gavin@hooli.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  placeholder="Your password"
                  id="password"
                  type="password"
                  value={registerInput.password}
                  onChange={handleRegisterInput}
                  required
                />
              </div>
              <Button
                type="button"
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={handleRegister}
              >
                Register
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;


