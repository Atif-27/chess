import WebSocket from "ws";
import Game from "./Game";
import { TgameMove } from "@chess/types/types";
import { messages } from "@chess/types/messages";
import PrismaClient from "@chess/db/client";
import { User } from "./UserManager";
import { gameCreated, showGameCreated } from "./helper/SocketPayload";

class GameManager {
  private games: Game[];
  private users: User[];
  private usersInRoom: Map<string, User[]>;
  private userRoomMapping: Map<string, string>;
  private pendingUser: User | null;
  private static instance: GameManager;
  private constructor() {
    this.games = [];
    this.users = [];
    this.usersInRoom = new Map<string, User[]>();
    this.userRoomMapping = new Map<string, string>();
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
  broadcastMessage(room: string, message: string) {
    const users = this.usersInRoom.get(room);
    if (!users) {
      console.error("No users in room");
      return;
    }
    users?.forEach((user) => {
      user.socket.send(message);
    });
  }
  addHandler(user: User) {
    //! Server is basically Listening for any message from client
    user.socket.on("message", (data) => {
      const message = JSON.parse(data.toString());
      if (message.type === messages.INIT_GAME) {
        this.initGame(user);
      }
      if (message.type === messages.MAKE_MOVE) {
        // this.moveInGame(user.socket, message.move);
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
      this.usersInRoom.set(newGame.gameId, [pendingUser, user]);
      this.broadcastMessage(
        newGame.gameId,
        gameCreated({ gameId: newGame.gameId })
      );
    }
    //TODO: Emiting to client that Game Started
    // this.player1.send(gameStarted({ color: "white" }));
    // this.player2.send(gameStarted({ color: "black" }));
  }
  showGameCreated(gameId: string) {
    const users = this.usersInRoom.get(gameId);
    const game = this.games.find((game) => game.gameId === gameId);
    if (!users || !game) {
      console.error("No users or game found");
      return;
    }
    game?.showGameCreated(users);
  }
  // moveInGame(socket: WebSocket, move: TgameMove) {
  //   const game = this.games.find(
  //     (game) => game.player1 === socket || game.player2 === socket
  //   );
  //   game?.makeMove(socket, move);
  // }
}

export default GameManager;
