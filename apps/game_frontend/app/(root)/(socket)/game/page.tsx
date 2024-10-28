"use client";
import { messages } from "@chess/types/messages";
import React, { useEffect, useState } from "react";
import { useSocketContext } from "../../../context/SocketProvider";
import { intialiseGame } from "../../../helpers/SocketPayload";
import { useRouter } from "next/navigation";

export default function page() {
  const { socket } = useSocketContext();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case String(messages.GAME_CREATED):
          router.push(`/game/${message.payload.gameId}`);
          break;
          console.log("GAME OVER", message.payload);
          break;
        default:
          break;
      }
    };
  }, [socket]);
  const startGame = () => {
    socket && socket.send(intialiseGame());
    setLoading(true);
  };
  if (!socket) return <div>Connecting To the server...</div>;

  return (
    <div className="m-6">
      <h1 className="text-4xl font-semibold">Play Chess Multplayer</h1>
      {!loading ? (
        <button
          className="text-white bg-blue-800 p-3 rounded-2xl mt-10"
          onClick={startGame}
        >
          Find me an Opponent
        </button>
      ) : (
        <div className=" animate-pulse">Finding You an opponent</div>
      )}
    </div>
  );
}
