import crypto from "crypto";
import { WebSocket } from "ws";
import { userJwtClaims } from "../../auth";
class User {
  public socket: WebSocket;
  public username: string;
  public userId: string;
  public conId: string;
  public isGuest?: boolean;
  constructor(socket: WebSocket, jwtDecoded: userJwtClaims, isGuest: boolean) {
    this.socket = socket;
    this.conId = crypto.randomBytes(16).toString("hex");
    this.userId = isGuest ? this.conId : jwtDecoded.userId;
    this.username = isGuest ? `Guest${this.userId}` : jwtDecoded.username;
    this.isGuest = isGuest;
  }
}
export { User };
