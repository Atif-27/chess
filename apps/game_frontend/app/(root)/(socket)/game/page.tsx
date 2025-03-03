"use client";

import { messages } from "@chess/types/messages";
import React, { useEffect, useState } from "react";
import { useSocketContext } from "../../../context/SocketProvider";
import { intialiseGame } from "../../../helpers/SocketPayload";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Page() {
  const { socket } = useSocketContext();
  const [showReady, setShowReady] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowReady(false);
      setShowButton(true);
    }, 3000); // "Are you ready?" fades out after 3s, button appears

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case String(messages.GAME_CREATED):
          router.push(`/game/${message.payload.gameId}`);
          break;
        default:
          break;
      }
    };
  }, [socket]);

  const startGame = () => {
    if (socket) {
      socket.send(intialiseGame());
      setLoading(true);
    }
  };

  if (!socket) return <div>Connecting to the server...</div>;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      {showReady && (
        <h1 className="text-4xl md:text-6xl font-bold animate-fade ">
          Are you ready?
        </h1>
      )}

      {showButton && !loading && (
        <Button
          className="text-lg font-semibold bg-purple-700 hover:bg-purple-800 transition animate-fade-in p-4  focus:scale-90"
          onClick={startGame}
        >
          Find me an Opponent
        </Button>
      )}

      {loading && (
        <div className="text-2xl font-semibold animate-pulse">
          Finding You an Opponent...
        </div>
      )}
    </div>
  );
}
