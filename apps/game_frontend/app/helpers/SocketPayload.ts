import { TgameMove } from "@chess/types/types";
import { messages } from "@chess/types/messages";

export function intialiseGame() {
  return JSON.stringify({
    type: messages.INIT_GAME,
  });
}

export function makeMove({ move }: { move: TgameMove }) {
  return JSON.stringify({
    type: messages.MAKE_MOVE,
    move,
  });
}
