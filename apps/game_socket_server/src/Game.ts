import WebSocket from "ws";
import { Chess } from "chess.js";

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

    this.player1.send(
      JSON.stringify({
        type: "init_game",
        payload: {
          color: "white",
        },
      })
    );

    this.player2.send(
      JSON.stringify({
        type: "init_game",
        payload: {
          color: "black",
        },
      })
    );
    console.log("Game Created");
  }
  public makeMove(
    socket: WebSocket,
    move: {
      to: string;
      from: string;
    }
  ) {
    //TODO: validation here with zod

    // ! Check Users Turn
    const currentTurn = this.board.turn();
    if (currentTurn === "w" && socket !== this.player1) return;
    if (currentTurn === "b" && socket !== this.player2) return;

    //! Update  Board
    try {
      this.board.move({
        ...move,
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
      this.player1.send(
        JSON.stringify({
          type: "GAME_OVER",
          payload: { winner },
        })
      );
      this.player2.send(
        JSON.stringify({
          type: "GAME_OVER",
          payload: { winner },
        })
      );
      return;
    }

    //! send updated to both player
    this.player1.send(JSON.stringify({ type: "MOVE", payload: move }));
    this.player2.send(JSON.stringify({ type: "MOVE", payload: move }));

    console.log("Move Made");
  }
}
