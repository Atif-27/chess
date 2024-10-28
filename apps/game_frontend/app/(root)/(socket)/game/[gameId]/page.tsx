"use client";
import { messages } from "@chess/types/messages";
import Image from "next/image";
import { Chess, Color, PieceSymbol, Square } from "chess.js";
import React, { useEffect, useState } from "react";
import { useSocketContext } from "../../../../context/SocketProvider";
import { makeMove } from "../../../../helpers/SocketPayload";

export default function page({
  params,
}: {
  params: {
    gameId: string;
  };
}) {
  const { socket } = useSocketContext();
  const [chess, setChess] = useState<Chess | null>(new Chess());
  const [board, setBoard] = useState(chess?.board());
  const [loading, setLoading] = useState(false);
  const { gameId } = params;
  const [gameData, setGameData] = useState(null);
  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case String(messages.SHOW_GAME_CREATED):
          console.log("game is", message.payload);
          setGameData(message.payload);
          setLoading(false);
          break;
        case String(messages.SHOW_MOVE):
          const move = message.payload;
          console.log("Move Made");
          chess?.move({
            ...move,
            promotion: "q",
          });
          setBoard(chess?.board());
          break;
        case String(messages.SHOW_GAME_OVER):
          console.log("GAME OVER", message.payload);
          break;
        default:
          break;
      }
    };
  }, [socket]);

  useEffect(() => {
    setLoading(true);
    socket?.send(
      JSON.stringify({
        type: messages.SHOW_GAME_CREATED,
        payload: { gameId: gameId },
      })
    );
  }, [gameId, socket]);
  if (!socket) return <div>Connecting To the server...</div>;
  if (loading) return <div className="animate-pulse">Loading Game...</div>;
  return (
    <div>
      <ChessBoard board={board} socket={socket} gameData={gameData} />
    </div>
  );
}

interface Imove {
  from: Square | null;
  to: Square | null;
}
const initialMove = {
  from: null,
  to: null,
};
function ChessBoard({
  board,
  socket,
  gameData,
}: {
  board:
    | ({ square: Square; type: PieceSymbol; color: Color } | null)[][]
    | undefined;
  socket: WebSocket;
  gameData: any;
}) {
  const [move, setMove] = useState<Imove>(initialMove);
  useEffect(() => {
    console.log(move);
    if (!socket) return;
    if (!move.from || !move.to) return;
    console.log("send");
    socket.send(makeMove({ move, gameId: gameData.gameId }));
    setMove(initialMove);
  }, [socket, move]);

  return (
    <div className="mx-auto w-screen min-h-screen flex flex-col bg-grey-600 p-10">
      {board?.map((row, rindex) => {
        return (
          <div key={rindex} className="flex">
            {row.map((col, cindex) => {
              const squareRepresentation = (String.fromCharCode(
                97 + (cindex % 8)
              ) +
                "" +
                (8 - rindex)) as Square;

              return (
                <div
                  onClick={() => {
                    if (!move.from && !col) return;
                    if (!move.from) {
                      setMove({
                        from: squareRepresentation,
                        to: null,
                      });
                      return;
                    }
                    setMove((move) => ({
                      ...move,
                      to: squareRepresentation,
                    }));
                  }}
                  className={` w-20 h-20 flex justify-center border-black border-[0.1px] border-opacity-10 items-center font-bold ${
                    (rindex + cindex) % 2 !== 0
                      ? " bg-[#7B61FF] "
                      : " bg-[#E8EDF9] "
                  } ${move.from === squareRepresentation && " bg-yellow-400"} ${
                    col?.color == "b" ? " text-black" : " text-white"
                  }   `}
                  key={cindex}
                >
                  {col && (
                    <Image
                      src={
                        col.color === "b"
                          ? `/${col.type.toLowerCase()}.png`
                          : `/${col.type.toUpperCase()}.png`
                      }
                      width={40}
                      height={40}
                      alt="icon"
                    />
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
