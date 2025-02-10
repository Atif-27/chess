import WebSocket from "ws";
import Game from "./Game";
import { TgameMove } from "@chess/types/types";
import { messages } from "@chess/types/messages";
import { UserManager } from "../user/UserManager";
import { gameCreated } from "../../helper/SocketPayload";
import jsonwebtoken from "jsonwebtoken";
export interface UserJwtClaims {
  userId: string;
  username: string;
}
class GameManager {
  private games: Game[];
  private pendingUsers: Set<string>;
  private static instance: GameManager;
  private userManager: UserManager;

  private constructor() {
    this.games = [];
    this.pendingUsers = new Set();
    this.userManager = UserManager.getInstance();
  }
  static getInstance(): GameManager {
    if (!GameManager.instance) GameManager.instance = new GameManager();
    return GameManager.instance;
  }
  public addUser(socket: WebSocket, jwt: string | null) {
    let userClaims: UserJwtClaims | null = null;
    if (jwt) {
      try {
        userClaims = jsonwebtoken.verify(
          jwt,
          process.env.JWT_SECRET!
        ) as UserJwtClaims;
      } catch (err) {
        if (err instanceof Error) {
          console.error(err.message);
        }
        socket.close();
        return;
      }
    }

    const isGuest = !jwt;
    const userId = userClaims?.userId || `guest-${Date.now()}`;
    const username = userClaims?.username || `Guest${Date.now()}`;

    this.userManager.addUser(socket, userId, username, isGuest);
    this.setupMessageHandler(socket, userId);
  }

  public removeUser(socket: WebSocket) {
    const userId = Array.from(this.userManager.users.keys()).find(
      (id) => this.userManager.users.get(id)?.socket === socket
    );

    if (!userId) return;
    this.userManager.removeUser(userId);
  }
  setupMessageHandler(socket: WebSocket, userId: string) {
    //! Server is basically Listening for any message from client
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());
      if (message.type === messages.INIT_GAME) {
        this.initGame(userId);
      }
      if (message.type === messages.MAKE_MOVE) {
        this.moveInGame(userId, message.payload.move, message.payload.gameId);
      }
      if (message.type === messages.SHOW_GAME_CREATED) {
        this.createdGame(message.payload.gameId);
      }
    });
  }
  initGame(userId: string) {
    //TODO: Check if user is already in a game
    if (this.pendingUsers.size === 0) {
      this.pendingUsers.add(userId);
      return;
    }

    let opponentId = "";
    for (let id of this.pendingUsers) {
      if (id !== userId) {
        opponentId = id;
        break;
      }
    }
    if (!opponentId) return; // Exit if no valid opponent is found
    this.pendingUsers.delete(opponentId);
    const newGame = new Game(userId, opponentId);
    this.games.push(newGame);
    this.userManager.addUserToRoom(userId, newGame.gameId);
    this.userManager.addUserToRoom(opponentId, newGame.gameId);

    this.userManager.broadcastMessage(
      newGame.gameId,
      gameCreated({ gameId: newGame.gameId })
    );
  }
  createdGame(gameId: string) {
    const users = this.userManager.getUsersInRoom(gameId);
    const game = this.games.find((game) => game.gameId === gameId);
    if (!users || !game) {
      console.error("No users or game found");
      return;
    }
    game?.showGameCreated(users);
  }
  moveInGame(userId: string, move: TgameMove, gameId: string) {
    const game = this.games.find((game) => game.gameId === gameId);
    game?.makeMove(this.userManager.getUser(userId)!, move);
  }
}

export default GameManager;
