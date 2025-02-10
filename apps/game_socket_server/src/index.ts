import { WebSocketServer } from "ws";
import GameManager from "./manager/game/GameManager";
import { IncomingMessage } from "http";
const wss = new WebSocketServer({ port: process.env.PORT });
import dotenv from "dotenv";
dotenv.config();

const gameManager = GameManager.getInstance();

console.log("WebSocket Server is listening to Port 8080");

wss.on("connection", function connection(ws, req) {
  //! Extract User Info from Token
  const cookies = parseCookies(req);
  const jwt = cookies?.token;
  //! User Connected + Listening for Messages
  gameManager.addUser(ws, jwt as string);
  //! User Disconnected
  ws.on("close", () => {
    console.log("User Disconnected");
    // gameManager.removeUser(ws);
  });
});

function parseCookies(req: IncomingMessage) {
  const cookie = req.headers.cookie;
  if (!cookie) return {};
  return cookie.split(";").reduce(
    (acc, cookie) => {
      const [key, value] = cookie.split("=");
      if (key && value) {
        acc[key.trim()] = value;
      }
      return acc;
    },
    {} as { [key: string]: string }
  );
}