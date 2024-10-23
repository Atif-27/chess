import { Square } from "chess.js";
import { TgameMove } from "@chess/types/types";
import { messages } from "@chess/types/messages";

export function gameStarted({ color }: { color: string }) {
  return JSON.stringify({
    type: messages.GAME_STARTED,
    payload: {
      color,
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
