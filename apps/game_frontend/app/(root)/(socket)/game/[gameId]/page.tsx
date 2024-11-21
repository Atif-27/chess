"use client";
import { messages } from "@chess/types/messages";
import Image from "next/image";
import { Chess, Color, PieceSymbol, Square } from "chess.js";
import React, { useEffect, useState, useCallback } from "react";
import { useSocketContext } from "../../../../context/SocketProvider";
import { makeMove } from "../../../../helpers/SocketPayload";
import { useUserContext } from "../../../../context/UserProvider";

export default function Page({ params }: { params: { gameId: string } }) {
  const { socket } = useSocketContext();
  const [chess, setChess] = useState<Chess | null>(null);
  const [board, setBoard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [gameData, setGameData] = useState<any>(null);
  const {user}= useUserContext();
  const { gameId } = params;

  const updateBoard = useCallback((newChess: Chess) => {
    setChess(newChess);
    setBoard(newChess.board());
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case String(messages.SHOW_GAME_CREATED):
          console.log("Game is", message.payload);
          setGameData(message.payload);
          const newChess = new Chess(message.payload.currentFen);
          updateBoard(newChess);
          setLoading(false);
          break;
        case String(messages.SHOW_MOVE):
          const move = message.payload;
          console.log("Move Made");
          if (chess) {
            chess.move({ ...move, promotion: "q" });
            updateBoard(chess);
          }
          break;
        case String(messages.SHOW_GAME_OVER):
          console.log("GAME OVER", message.payload);
          break;
        default:
          break;
      }
    };

    socket.onmessage = handleMessage;

    return () => {
      socket.onmessage = null;
    };
  }, [socket, chess, updateBoard]);

  useEffect(() => {
    if (gameId && socket) {
      setLoading(true);
      socket.send(
        JSON.stringify({
          type: messages.SHOW_GAME_CREATED,
          payload: { gameId },
        })
      );
    }
  }, [gameId, socket]);

  if (!socket) return <div>Connecting to the server...</div>;
  if (loading) return <div className="animate-pulse">Loading Game...</div>;
  console.log(user);
  const isWhite = gameData.whitePlayer.id === user?.id;
  const isBlack = gameData.blackPlayer.id === user?.id;
  return (
    <div>
      {gameData && (
        <div>
          <div
          className={`${isWhite ? "border border-green-400 text-green-400" : "text-white"}  p-2`}
          >White Player: {gameData?.whitePlayer?.name}</div>
          <div
          className={`${isBlack ? "border border-green-400 text-green-400" : "text-white"}  p-2`}
          >Black Player: {gameData?.blackPlayer?.name}</div>
          <div>Game Started At: {
            new Date(gameData?.startTime).toLocaleString()
            }</div>
        </div>
      )}
      <div >
      <ChessBoard isBlack={isBlack} board={board} socket={socket} gameData={gameData} />

      </div>
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
  isBlack
}: {
  board:
    | ({ square: Square; type: PieceSymbol; color: Color } | null)[][]
    | undefined;
  socket: WebSocket;
  gameData: any;
  isBlack:boolean;
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
  const correctBoard =isBlack ?
  board?.slice().reverse().map((row) => row.slice().reverse()) :
  board;
  
  return (
    <div className="mx-auto w-screen min-h-screen flex flex-col bg-grey-600 p-10">
      {correctBoard?.map((row, rindex) => {
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
