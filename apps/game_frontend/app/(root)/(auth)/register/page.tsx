"use client";
import React, { useState } from "react";
import { useUserContext } from "../../../context/UserProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    try {
      const response = await fetch(process.env.BACKEND_URL + "/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerInput),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to Register");
      }
      const data = await response.json();
      setUserCtx(data.user);
      router.push("/login");
    } catch (error) {
      if (error instanceof Error) {
        setError(error?.message);
      }
    }
  }
  return (
    <div>
      <h1>Register</h1>
      <div>
        <div>
          <label htmlFor="username">Name</label>
          <input
            className="border-2 bg-white text-black m-2"
            type="text"
            id="name"
            value={registerInput.name}
            onChange={handleRegisterInput}
          />
        </div>
        <div>
          <label htmlFor="username">Username</label>
          <input
            className="border-2 bg-white text-black m-2"
            type="text"
            id="username"
            value={registerInput.username}
            onChange={handleRegisterInput}
          />
        </div>
        <div>
          <label htmlFor="password">Email</label>
          <input
            className="border-2 bg-white text-black m-2"
            type="email"
            id="email"
            value={registerInput.email}
            onChange={handleRegisterInput}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            className="border-2 bg-white text-black m-2"
            type="password"
            id="password"
            value={registerInput.password}
            onChange={handleRegisterInput}
          />
        </div>
      </div>
      <div>
        Already have an Account?{" "}
        <Link className=" underline" href={"/login"}>
          Login
        </Link>
      </div>
      <button
        className=" p-2 m-2  w-full max-w-sm bg-blue-700 rounded-xl"
        onClick={handleRegister}
      >
        Register
      </button>

      {error && <div className="text-red-600">{error}</div>}
    </div>
  );
};

export default page;
