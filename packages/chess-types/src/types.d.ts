import { Square } from "chess.js";

export interface TgameMove {
  from: Square | null;
  to: Square | null;
}
