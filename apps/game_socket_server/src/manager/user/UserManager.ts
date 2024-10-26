import { User } from "./user";
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

export { UserManager };
