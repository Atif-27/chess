import WebSocket from "ws";
import Game from "./Game";
import { TgameMove } from "@chess/types/types";
import { messages } from "@chess/types/messages";
import PrismaClient from "@chess/db/client";
import { UserManager } from "../user/UserManager";
import { User } from "../user/user";
import { gameCreated, showGameCreated } from "../../helper/SocketPayload";

const userManafger = UserManager.createUserManager();
class GameManager {
  private games: Game[];
  private users: User[];
  private pendingUser: User | null;
  private static instance: GameManager;
  private constructor() {
    this.games = [];
    this.users = [];
    this.pendingUser = null;
  }
  static createGameManager(): GameManager {
    if (!GameManager.instance) GameManager.instance = new GameManager();
    return GameManager.instance;
  }
  addUser(user: User) {
    this.users.push(user);
    this.addHandler(user);
    console.log("User Added and Listening for Messages");
  }
  removeUser(socket: WebSocket) {
    const user = this.users.find((user) => user.socket === socket);
    if (!user) {
      console.error("User not found?");
      return;
    }
    this.users = this.users.filter((user) => user.socket !== socket);
    // socketManager.removeUser(user);
    //TODO Show game results as user disconnected
  }
  addHandler(user: User) {
    //! Server is basically Listening for any message from client
    user.socket.on("message", (data) => {
      const message = JSON.parse(data.toString());
      if (message.type === messages.INIT_GAME) {
        this.initGame(user);
      }
      if (message.type === messages.MAKE_MOVE) {
        this.moveInGame(user, message.payload.move, message.payload.gameId);
      }
      if (message.type === messages.SHOW_GAME_CREATED) {
        this.showGameCreated(message.payload.gameId);
      }
    });
  }
  initGame(user: User) {
    //TODO: Check if user is already in a game
    if (!this.pendingUser) {
      this.pendingUser = user;
    } else {
      const pendingUser = this.pendingUser;
      const newGame = new Game(pendingUser.userId, user.userId);
      this.games.push(newGame);
      this.pendingUser = null;
      userManafger.addUserToRoom([pendingUser, user], newGame.gameId);
      userManafger.broadcastMessage(
        newGame.gameId,
        gameCreated({ gameId: newGame.gameId })
      );
    }
  }
  showGameCreated(gameId: string) {
    const users = userManafger.getUsersInRoom(gameId);
    const game = this.games.find((game) => game.gameId === gameId);
    if (!users || !game) {
      console.error("No users or game found");
      return;
    }
    game?.showGameCreated(users);
  }
  moveInGame(user: User, move: TgameMove, gameId: string) {
    const game = this.games.find((game) => game.gameId === gameId);
    game?.makeMove(user, move);
  }
}

export default GameManager;
