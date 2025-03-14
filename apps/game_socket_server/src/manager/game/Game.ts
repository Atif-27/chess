import WebSocket from "ws";
import { Chess } from "chess.js";
import {
  showCreatedGame,
  showGameOver,
  showMove,
} from "../../helper/SocketPayload";
import { randomUUID } from "crypto";
import { TgameMove } from "@chess/types/types";
import { prisma } from "../../db/index";
import { UserManager } from "../user/UserManager";
import { User } from "../user/user";

const userManager = UserManager.getInstance();

export default class Game {
  public gameId: string;
  public whitePlayerId: string;
  public blackPlayerId: string;
  public board: Chess;
  public startTime: Date;

  constructor(whitePlayerId: string, blackPlayerId: string) {
    this.gameId = randomUUID();
    this.whitePlayerId = whitePlayerId;
    this.blackPlayerId = blackPlayerId;
    this.board = new Chess();
    this.startTime = new Date();
    console.log("Game Created");
    this.createGameInDB();
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
        showCreatedGame({ game: this, whitePlayer, blackPlayer, currentFen: this.board.fen() })
      );
    });
  }
  async createGameInDB() {
    const game = await prisma.game.create({
      data: {
        id: this.gameId,
        whitePlayer: {
          connect: { id: this.whitePlayerId },
        },
        blackPlayer: {
          connect: { id: this.blackPlayerId },
        },
      },
    });
  }
  public makeMove(user: User, move: TgameMove) {
    //TODO: validation here with zod
    //TODO: Also send checkmate or not
    // ! Check Users Turn
    const currentTurn = this.board.turn();
    console.log("Current Turn:", currentTurn);
    if (currentTurn === "w" && user.userId !== this.whitePlayerId) return;
    if (currentTurn === "b" && user.userId !== this.blackPlayerId) return;

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
      userManager.broadcastMessage(this.gameId, showGameOver({ winner }));
      return;
    }
    //! send updated to both player
    userManager.broadcastMessage(this.gameId, showMove({ move }));
    console.log("Move Made");
  }
  async updateGameInDB() {
    // const game = await prisma.game.update({
    //   where: { id: this.gameId },
    //   data: {
    //     chessBoard: this.board.fen(),
    //   },
    // });
    // const moves = await prisma.move.create({
    //   data: {
    //     game: {
    //       connect: { id: this.gameId },
    //     },
    //     to: "e4",
    //     from: "e5",
    //     piece: "pawn",
    //   },
    // });
  }
}
