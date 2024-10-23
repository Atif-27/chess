import WebSocket from "ws";
import { Chess } from "chess.js";
import { gameStarted, showGameOver, showMove } from "./helper/SocketPayload";
import { TgameMove } from "@chess/types/types";
export default class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  private board: Chess;
  private startTime: Date;

  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.startTime = new Date();

    // Emiting to client that Game Started
    this.player1.send(gameStarted({ color: "white" }));
    this.player2.send(gameStarted({ color: "black" }));
    console.log("Game Created");
  }
  public makeMove(socket: WebSocket, move: TgameMove) {
    //TODO: validation here with zod
    //TODO: Also send checkmate or not
    // ! Check Users Turn
    const currentTurn = this.board.turn();
    if (currentTurn === "w" && socket !== this.player1) return;
    if (currentTurn === "b" && socket !== this.player2) return;

    //! Update  Board
    try {
      this.board.move({
        from: move.from as string,
        to: move.to as string,
        promotion: "q",
      });
    } catch (error) {
      console.error("Move Error:", error);
      return;
    }
    //! Check if game over
    if (this.board.isGameOver()) {
      console.log("CheckMate bro");
      const winner = this.board.turn() === "w" ? "black" : "white";
      //TODO Also Show return the move if rest of the code doesnt work
      this.player1.send(showGameOver({ winner }));
      this.player2.send(showGameOver({ winner }));
      return;
    }

    //! send updated to both player
    this.player1.send(showMove({ move }));
    this.player2.send(showMove({ move }));

    console.log("Move Made");
  }
}
