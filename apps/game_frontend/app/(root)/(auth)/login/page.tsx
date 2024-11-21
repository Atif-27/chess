"use client";
import React from "react";
import { useUserContext } from "../../../context/UserProvider";

const page = () => {
  const [loginInput, setLoginInput] = React.useState({
    username: "",
    password: "",
  });
  const {setUserCtx}=useUserContext();
  const handleLoginInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginInput({
      ...loginInput,
      [e.target.id]: e.target.value,
    });
  };
  async function handleLogin() {
    try {
        const response = await fetch("http://localhost:4000/api/v1/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(loginInput),
            credentials: "include",
          });
          const data = await response.json();
          console.log(data.user);
          setUserCtx(data.user);
    } catch (error) {
        console.log(error);
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
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default page;
