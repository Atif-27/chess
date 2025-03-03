"use client";
import { messages } from "@chess/types/messages";
import Image from "next/image";
import { Chess, Color, PieceSymbol, Square } from "chess.js";
import React, { useEffect, useState, useCallback } from "react";
import { useSocketContext } from "../../../../context/SocketProvider";
import { makeMove } from "../../../../helpers/SocketPayload";
import { useUserContext } from "../../../../context/UserProvider";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Clock,
  MessageSquare,
  Flag,
  RotateCcw,
  Users,
  Settings,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
export default function Page({ params }: { params: { gameId: string } }) {
  const { socket } = useSocketContext();
  const [chess, setChess] = useState<Chess | null>(null);
  const [board, setBoard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [gameData, setGameData] = useState<any>(null);
  const [result, setResult] = useState<string>();
  const { user } = useUserContext();
  const { gameId } = params;

  const updateBoard = useCallback((newChess: Chess) => {
    setChess(newChess);
    setBoard(newChess.board());
  }, []);
  const [showMoves, setShowMoves] = useState(true);
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
          setResult(message.payload?.winner);
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
  const userData = isWhite ? gameData?.whitePlayer : gameData?.blackPlayer;
  const opponentData = !isWhite ? gameData?.whitePlayer : gameData?.blackPlayer;
  if (!gameData) return;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950 text-white">
      {/* Game Header */}
      <header className="container mx-auto px-4 py-3 flex items-center justify-between border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="bg-purple-600 p-1.5 rounded-lg">
            <Clock className="h-4 w-4" />
          </div>
          <span className="font-bold text-sm md:text-base">
            10:00 • Rapid Match
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-zinc-400 hover:text-white"
          >
            <Users className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Spectators</span>
            <span className="inline sm:hidden">24</span>
            <span className="hidden sm:inline">(24)</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-zinc-400 hover:text-white"
          >
            <Settings className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 md:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Info - On mobile, this appears above the board */}
          <div className="lg:order-1 order-2 lg:col-span-1">
            {/* Player 2 (Top) */}
            <div
              className={`mb-4 p-4 rounded-lg ${true ? "bg-purple-900/30 border border-purple-500/50" : "bg-zinc-800/50 border border-zinc-700"}`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  {/* <Image
                    src={player2.avatar || "/placeholder.svg"}
                    alt={player2.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  /> */}
                  <div
                    className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-zinc-900 ${true ? "bg-green-500" : "bg-zinc-500"}`}
                  ></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold">{opponentData?.name}</h3>
                    <span className="text-sm text-zinc-400">Rating: 1400</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex">
                      <div className="bg-white h-4 w-4 rounded-full mr-1"></div>
                      <span className="text-sm">
                        {isWhite ? "Black" : "White"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Move History - Collapsible on mobile */}
            <div className="mb-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
              <div
                className="p-3 flex items-center justify-between cursor-pointer"
                onClick={() => setShowMoves(!showMoves)}
              >
                <h3 className="font-bold">Move History</h3>
                <Button variant="ghost" size="sm" className="p-1 h-auto">
                  {showMoves ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* {showMoves && (
                <div className="p-3 pt-0 max-h-[300px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="text-zinc-400 border-b border-zinc-700">
                      <tr>
                        <th className="py-2 text-left">#</th>
                        <th className="py-2 text-left">White</th>
                        <th className="py-2 text-left">Black</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({
                        length: Math.ceil(moveHistory.length / 2),
                      }).map((_, i) => (
                        <tr
                          key={i}
                          className="border-b border-zinc-700/50 last:border-0"
                        >
                          <td className="py-2 text-zinc-500">{i + 1}.</td>
                          <td className="py-2 font-mono">
                            {moveHistory[i * 2]
                              ? moveHistory[i * 2].notation
                              : ""}
                          </td>
                          <td className="py-2 font-mono">
                            {moveHistory[i * 2 + 1]
                              ? moveHistory[i * 2 + 1].notation
                              : ""}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )} */}
            </div>
            {/* Player 2 (Bottom) */}
            <div
              className={`mb-4 p-4 rounded-lg ${true ? "bg-purple-900/30 border border-purple-500/50" : "bg-zinc-800/50 border border-zinc-700"}`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  {/* <Image
                    src={player2.avatar || "/placeholder.svg"}
                    alt={player2.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  /> */}
                  <div
                    className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-zinc-900 ${true ? "bg-green-500" : "bg-zinc-500"}`}
                  ></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold">{userData?.name}</h3>
                    <span className="text-sm text-zinc-400">Rating: 1400</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex">
                      <div className="bg-white h-4 w-4 rounded-full mr-1"></div>
                      <span className="text-sm">
                        {isBlack ? "Black" : "White"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Game Controls */}
            <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                >
                  <Flag className="h-4 w-4 mr-2" /> Resign
                </Button>
                <Button
                  variant="outline"
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                >
                  <MessageSquare className="h-4 w-4 mr-2" /> Offer Draw
                </Button>
                <Button
                  variant="outline"
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white col-span-2"
                >
                  <RotateCcw className="h-4 w-4 mr-2" /> Take Back Move
                </Button>
              </div>
            </div>
          </div>

          {/* Chess Board - Center on desktop, top on mobile */}
          <div className="lg:order-2 order-1 lg:col-span-2">
            <div className="">
              <ChessBoard
                isBlack={isBlack}
                board={board}
                socket={socket}
                gameData={gameData}
                chess={chess!}
              />
            </div>
          </div>
        </div>
      </main>
      {result && (
        <AlertDialog open={true}>
          <AlertDialogContent className="bg-zinc-800 border-none">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-bold text-2xl">
                Game Over
              </AlertDialogTitle>
              <AlertDialogDescription className="text-white">
                The winner is {result}, We hope you enjoyed the game!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Link href={"/game"}>
                <Button className="bg-purple-700 hover:bg-purple-800 text-white">
                  Start Another game
                </Button>
              </Link>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
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
  isBlack,
  chess,
}: {
  board:
    | ({ square: Square; type: PieceSymbol; color: Color } | null)[][]
    | undefined;
  socket: WebSocket;
  gameData: any;
  isBlack: boolean;
  chess: Chess;
}) {
  const [move, setMove] = useState<Imove>(initialMove);
  const [highlightedSquares, setHighlightedSquares] = useState<string[]>([]);

  useEffect(() => {
    console.log(move);
    if (!socket) return;
    if (!move.from || !move.to) return;
    console.log("send");
    socket.send(makeMove({ move, gameId: gameData.gameId }));
    setMove(initialMove);
  }, [socket, move]);
  const correctBoard = isBlack
    ? board
        ?.slice()
        .reverse()
        .map((row) => row.slice().reverse())
    : board;

  return (
    <div className="max-w-[700px] mx-auto">
      {correctBoard?.map((row, rindex) => {
        return (
          <div key={rindex} className="flex">
            {row.map((col, cindex) => {
              const file = isBlack
                ? String.fromCharCode(97 + (7 - cindex))
                : String.fromCharCode(97 + cindex);
              const rank = isBlack ? rindex + 1 : 8 - rindex;
              const squareRepresentation = `${file}${rank}` as Square;

              return (
                <div
                  onClick={() => {
                    if (!move.from && !col) return;
                    if (!move.from) {
                      const moves = chess.moves({
                        square: squareRepresentation,
                        verbose: true,
                      });
                      setMove({
                        from: squareRepresentation,
                        to: null,
                      });
                      setHighlightedSquares(moves.map((move) => move.to));
                      return;
                    }
                    setMove((move) => ({
                      ...move,
                      to: squareRepresentation,
                    }));
                    setHighlightedSquares([]);
                  }}
                  className={` lg:w-20 lg:h-20 md:w-16 md:h-16 sm:w-14 sm:h-14 w-12 h-12  flex justify-center border-black border-[0.1px] border-opacity-10 items-center font-bold ${
                    (rindex + cindex) % 2 !== 0
                      ? " bg-[#7B61FF] "
                      : " bg-[#E8EDF9] "
                  } ${move.from === squareRepresentation && " bg-yellow-500"} ${
                    col?.color == "b" ? " text-black" : " text-white"
                  }   
                   ${highlightedSquares && highlightedSquares.includes(squareRepresentation) && " bg-yellow-300"}
                  `}
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
                      className="max-sm:scale-75"
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
