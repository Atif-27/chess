import crypto from "crypto";
import { WebSocket } from "ws";
import { userJwtClaims } from "../../auth";
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
export { User };
