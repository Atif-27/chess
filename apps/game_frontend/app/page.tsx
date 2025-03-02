"use client";

import Link from "next/link";
import { useUserContext } from "./context/UserProvider";

export default function Home() {
  const { user } = useUserContext();
  const loggedIn = user?.name || false;

  return (
    <div className="w-screen h-screen">
      <button className="text-white bg-blue-800 p-3 rounded-2xl m-20">
        <Link className="w-full h-full" href={"/game"}>
          Play Chess
        </Link>
      </button>
      {!loggedIn && (
        <button className="text-white bg-blue-800 p-3 rounded-2xl m-20">
          <Link className="w-full h-full" href={"/login"}>
            Login
          </Link>
        </button>
      )}
    </div>
  );
}
