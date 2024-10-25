import WebSocket from "ws";
import { Chess } from "chess.js";
import {
  showGameCreated,
  showGameOver,
  showMove,
} from "./helper/SocketPayload";
import { TgameMove } from "@chess/types/types";
import prisma from "@chess/db/client";
import { User } from "./UserManager";

export default class Game {
  public gameId: string;
  public whitePlayerId: string;
  public blackPlayerId: string;
  public board: Chess;
  public startTime: Date;

  constructor(whitePlayerId: string, blackPlayerId: string) {
    this.gameId = ""; // GameId is the id of the game in the database
    this.whitePlayerId = whitePlayerId;
    this.blackPlayerId = blackPlayerId;
    this.board = new Chess();
    this.startTime = new Date();
    console.log("Game Created");
    this.createGameInDB(); // Create Game in DB and get the gameId
  }
  // public makeMove(socket: WebSocket, move: TgameMove) {
  //   //TODO: validation here with zod
  //   //TODO: Also send checkmate or not
  //   // ! Check Users Turn
  //   const currentTurn = this.board.turn();
  //   if (currentTurn === "w" && socket !== this.player1) return;
  //   if (currentTurn === "b" && socket !== this.player2) return;

  //   //! Update  Board
  //   try {
  //     this.board.move({
  //       from: move.from as string,
  //       to: move.to as string,
  //       promotion: "q",
  //     });
  //   } catch (error) {
  //     console.error("Move Error:", error);
  //     return;
  //   }
  //   //! Check if game over
  //   if (this.board.isGameOver()) {
  //     console.log("CheckMate bro");
  //     const winner = this.board.turn() === "w" ? "black" : "white";
  //     //TODO Also Show return the move if rest of the code doesnt work
  //     this.player1.send(showGameOver({ winner }));
  //     this.player2.send(showGameOver({ winner }));
  //     return;
  //   }

  //   //! send updated to both player
  //   this.player1.send(showMove({ move }));
  //   this.player2.send(showMove({ move }));

  //   console.log("Move Made");
  // }
  async createGameInDB() {
    const game = await prisma.game.create({
      data: {
        whitePlayer: {
          connect: { id: this.whitePlayerId },
        },
        blackPlayer: {
          connect: { id: this.blackPlayerId },
        },
      },
    });
    this.gameId = game.id;
  }
  public showGameCreated(users: User[]) {
    const whitePlayer = users?.find(
      (user) => user.userId === this?.whitePlayerId
    );
    const blackPlayer = users?.find(
      (user) => user.userId === this?.blackPlayerId
    );
    //TODO: Check DB for game and send the game state
    if (!whitePlayer || !blackPlayer) {
      console.error("No users found");
      return;
    }
    users?.forEach((user) => {
      user.socket.send(
        showGameCreated({ game: this, whitePlayer, blackPlayer })
      );
    });
  }
}

