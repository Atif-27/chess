import { WebSocket } from "ws";
class User {
  public userId: string;
  public username: string;
  public socket: WebSocket;
  public isGuest: boolean;
  public rooms: Set<string>;

  constructor(
    socket: WebSocket,
    userId: string,
    username: string,
    isGuest: boolean
  ) {
    this.socket = socket;
    this.userId = userId;
    this.username = username;
    this.isGuest = isGuest;
    this.rooms = new Set();

    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.socket.on("close", () => {
      console.log(`User ${this.username} (${this.userId}) disconnected.`);
    });
    this.socket.on("error", (err) => {
      console.error(`WebSocket error for ${this.username}:`, err);
    });
  }
}
export { User };
