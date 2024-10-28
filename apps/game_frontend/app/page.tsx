import Link from "next/link";

export default function Home() {
  return (
    <div className="w-screen h-screen">
      <button className="text-white bg-blue-800 p-3 rounded-2xl m-20">
        <Link className="w-full h-full" href={"/game"}>
          Play Chess
        </Link>
      </button>
    </div>
  );
}
