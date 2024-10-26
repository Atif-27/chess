import crypto from "crypto";
import { WebSocket } from "ws";
import { userJwtClaims } from "./auth";
class User {
  public socket: WebSocket;
  public username: string;
  public userId: string;
  public conId: string;
  public isGuest?: boolean;
  constructor(socket: WebSocket, JwtClaims: userJwtClaims, isGuest: boolean) {
    this.socket = socket;
    this.conId = crypto.randomBytes(16).toString("hex");
    this.userId = isGuest ? this.conId : JwtClaims.userId;
    this.username = isGuest ? `Guest${this.userId}` : JwtClaims.username;
    this.isGuest = isGuest;
  }
}

class UserManager {
  private usersInRoom: Map<string, User[]>;
  // private userRoomMapping: Map<string, string>;
  private static instance: UserManager;
  private constructor() {
    this.usersInRoom = new Map<string, User[]>();
    // this.userRoomMapping = new Map<string, string>();
  }
  static createUserManager(): UserManager {
    if (!UserManager.instance) UserManager.instance = new UserManager();
    return UserManager.instance;
  }
  public broadcastMessage(room: string, message: string) {
    const users = this.usersInRoom.get(room);
    if (!users) {
      console.error("No users in room");
      return;
    }
    users?.forEach((user) => {
      user.socket.send(message);
    });
  }
  public getUsersInRoom(room: string) {
    return this.usersInRoom.get(room);
  }
  public addUserToRoom(user: User[], room: string) {
    this.usersInRoom.set(room, [
      ...(this.usersInRoom.get(room) || []),
      ...user,
    ]);
  }
}

export { User, UserManager };
