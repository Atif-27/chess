import { Square } from "chess.js";
import { TgameMove } from "@chess/types/types";
import { messages } from "@chess/types/messages";
import Game from "../manager/game/Game";
import { User } from "../manager/user/user";
export function gameCreated({ gameId }: { gameId: string }) {
  return JSON.stringify({
    type: messages.GAME_CREATED,
    payload: {
      message: "Game Created",
      gameId,
    },
  });
}
export function showGameCreated({
  game,
  whitePlayer,
  blackPlayer,
}: {
  game: Game;
  whitePlayer: User;
  blackPlayer: User;
}) {
  return JSON.stringify({
    type: messages.SHOW_GAME_CREATED,
    payload: {
      gameId: game.gameId,
      board: game.board,
      startTime: game.startTime,
      whitePlayer: {
        id: whitePlayer.userId,
        name: whitePlayer.username,
        isGuest: whitePlayer.isGuest,
      },
      blackPlayer: {
        id: blackPlayer.userId,
        name: blackPlayer.username,
        isGuest: blackPlayer.isGuest,
      },
    },
  });
}
export function showMove({ move }: { move: TgameMove }) {
  return JSON.stringify({ type: messages.SHOW_MOVE, payload: move });
}

export function showGameOver({ winner }: { winner: string }) {
  return JSON.stringify({
    type: messages.SHOW_GAME_OVER,
    payload: { winner },
  });
}
