import { User } from "../SocketManager";
import { WebSocket } from "ws";

export interface userJwtClaims {
  userId: string;
  username: string;
}
export function extractUserInfo(socket: WebSocket, jwt: string) {
  const isGuest = jwt ? false : true;
  //TODO: Add JWT Validation
  const JwtClaims = jwt
    ? JSON.parse(`{"userId": "123","username": "guest"}`)
    : null;
  const user = new User(socket, JwtClaims as userJwtClaims, isGuest);
  return user;
}