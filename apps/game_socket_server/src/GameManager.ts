import WebSocket from "ws";
import Game from "./Game";

class GameManager {
  private games: Game[];
  private users: WebSocket[];
  private pending: WebSocket | null;
  private static instance: GameManager;
  private constructor() {
    this.games = [];
    this.users = [];
    this.pending = null;
  }
  static createGameManager(): GameManager {
    if (!GameManager.instance) GameManager.instance = new GameManager();
    return GameManager.instance;
  }
  addUser(socket: WebSocket) {
    this.users.push(socket);
    console.log("User Added");
  }
  removeUser(socket: WebSocket) {
    this.users.filter((user) => user !== socket);
    // Show game results as user disconnected
  }
  addHandler(socket: WebSocket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());
      if (message.type === "init_game") {
        this.initGame(socket);
      }
      if (message.type === "move") {
        this.moveInGame(socket, message.move);
      }
    });
  }
  initGame(socket: WebSocket) {
    if (this.pending) {
      const newGame = new Game(this.pending, socket);
      this.games.push(newGame);
      this.pending = null;
    } else {
      this.pending = socket;
    }
  }
  moveInGame(
    socket: WebSocket,
    move: {
      to: string;
      from: string;
    }
  ) {
    const game = this.games.find(
      (game) => game.player1 === socket || game.player2 === socket
    );
    game?.makeMove(socket, move);
  }
}

export default GameManager;
