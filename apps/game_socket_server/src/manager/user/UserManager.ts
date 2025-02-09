import { WebSocket } from "ws";
import { User } from "./user";
class UserManager {
  public users: Map<string, User>; // userId -> USER
  private roomUsers: Map<string, Set<string>>; // roomId -> Set of userIds
  private static instance: UserManager;

  private constructor() {
    // this.usersInRoom = new Map<string, User[]>();
    this.users = new Map();
    this.roomUsers = new Map();
  }
  public static getInstance(): UserManager {
    if (!UserManager.instance) {
      UserManager.instance = new UserManager();
    }
    return UserManager.instance;
  }

  public addUser(
    socket: WebSocket,
    userId: string,
    username: string,
    isGuest: boolean
  ) {
    if (this.users.has(userId)) {
      this.updateUserSocket(userId, socket);
      console.log(`User ${username} reconnected.`);
      return;
    }
    const user = new User(socket, userId, username, isGuest);
    this.users.set(userId, user);
    console.log(`User ${username} (${userId}) added.`);
  }
  public updateUserSocket(userId: string, socket: WebSocket) {
    const user = this.users.get(userId);
    if (!user) return;

    user.socket = socket;
    console.log(`User ${user.username} socket updated.`);
  }
  public removeUser(userId: string) {
    const user = this.users.get(userId);
    if (!user) return;

    // Remove user from all rooms
    user.rooms.forEach((roomId) => {
      this.removeUserFromRoom(userId, roomId);
    });

    this.users.delete(userId);
    console.log(`User ${userId} removed.`);
  }
  public addUserToRoom(userId: string, roomId: string) {
    const user = this.users.get(userId);
    if (!user) return;

    user.rooms.add(roomId);

    if (!this.roomUsers.has(roomId)) {
      this.roomUsers.set(roomId, new Set());
    }
    this.roomUsers.get(roomId)!.add(userId);

    console.log(`User ${userId} added to room ${roomId}.`);
  }
  public getUser(userId: string) {
    return this.users.get(userId);
  }
  public removeUserFromRoom(userId: string, roomId: string) {
    const user = this.users.get(userId);
    if (!user) return;

    user.rooms.delete(roomId);
    this.roomUsers.get(roomId)?.delete(userId);

    if (this.roomUsers.get(roomId)?.size === 0) {
      this.roomUsers.delete(roomId);
    }

    console.log(`User ${userId} removed from room ${roomId}.`);
  }

  public getUsersInRoom(roomId: string): User[] {
    const userIds = this.roomUsers.get(roomId) || new Set();
    return Array.from(userIds).map((id) => this.users.get(id)!);
  }

  public broadcastMessage(roomId: string, message: string) {
    const users = this.getUsersInRoom(roomId);
    users.forEach((user) => {
      if (user.socket.readyState === WebSocket.OPEN) {
        user.socket.send(message);
      }
    });
  }
}

export { UserManager };
