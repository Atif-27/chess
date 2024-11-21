import { WebSocket } from "ws";
import { User } from "../manager/user/user";
import jsonwebtoken from "jsonwebtoken";
export interface userJwtClaims {
  userId: string;
  username: string;
}
export function extractUserInfo(socket: WebSocket, jwt: string) {
  const isGuest = jwt ? false : true;
  const jwtDecoded= jsonwebtoken.decode(jwt);
  const user = new User(socket, jwtDecoded as userJwtClaims, isGuest);
  return user;
}
