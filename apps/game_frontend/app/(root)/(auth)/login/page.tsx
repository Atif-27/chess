"use client";
import React, { useState } from "react";
import { useUserContext } from "../../../context/UserProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axiosInstance from "../../../helpers/AxiosInstance";

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
    try {
      const res = await axiosInstance.post("/login", loginInput);

      if (Number(res.status) > 400) {
        throw new Error("Failed to login");
      }
      setUserCtx(res.data.user);
      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        setError(error?.message);
      }
    }
  }
  return (
    <div>
      <h1>Login</h1>
      <div>
        <div>
          <label htmlFor="username">Username</label>
          <input
            className="border-2 bg-white text-black m-2"
            type="text"
            id="username"
            value={loginInput.username}
            onChange={handleLoginInput}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            className="border-2 bg-white text-black m-2"
            type="password"
            id="password"
            value={loginInput.password}
            onChange={handleLoginInput}
          />
        </div>
      </div>
      <div>
        Dont have an Account?{" "}
        <Link className=" underline" href={"/register"}>
          Register
        </Link>
      </div>
      <button
        className=" p-2 m-2  w-full max-w-sm bg-blue-700 rounded-xl"
        onClick={handleLogin}
      >
        Login
      </button>

      {error && <div className="text-red-600">{error}</div>}
    </div>
  );
};

export default page;
