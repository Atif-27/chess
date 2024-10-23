"use client";

import useSocket from "./hooks/useSocket";
import { Chess, Color, PieceSymbol, Square } from "chess.js";
import Image from "next/image";
import { useEffect, useState } from "react";
import { intialiseGame, makeMove } from "./helpers/SocketPayload";
import { messages } from "@chess/types/messages";

export default function Home() {
  const socket = useSocket();
  const [chess, setChess] = useState<Chess | null>(new Chess());
  const [gameStarted, setGameStarted] = useState(false);
  const [board, setBoard] = useState(chess?.board());
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case String(messages.GAME_STARTED):
          setGameStarted(true);
          setBoard(chess?.board());
          setLoading(false);
          console.log("Game Started");
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

  const startGame = () => {
    socket && socket.send(intialiseGame());
    setLoading(true);
  };
  if (!socket) return <div>Connecting To the server...</div>;
  if (!gameStarted && loading) return <div>Finding You an opponent</div>;
  if (gameStarted)
    return (
      <div>
        <ChessBoard board={board} socket={socket} />
      </div>
    );
  return (
    <div>
      <h1>Play Chess Multplayer</h1>
      <button onClick={startGame}>Play Now</button>
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
}: {
  board:
    | ({ square: Square; type: PieceSymbol; color: Color } | null)[][]
    | undefined;
  socket: WebSocket;
}) {
  const [move, setMove] = useState<Imove>(initialMove);
  useEffect(() => {
    console.log(move);
    if (!socket) return;
    if (!move.from || !move.to) return;
    console.log("send");
    socket.send(makeMove({ move }));
    setMove(initialMove);
  }, [socket, move]);

  return (
    <div className="mx-auto w-screen min-h-96 flex flex-col bg-red-600 p-10">
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
