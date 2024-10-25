import { WebSocketServer } from "ws";
import GameManager from "./GameManager";
import { extractUserInfo } from "./auth";
const wss = new WebSocketServer({ port: 8080 });
const gameManager = GameManager.createGameManager();

console.log("WebSocket Server is listening to Port 8080");

wss.on("connection", function connection(ws) {
  const token = "";
  const user = extractUserInfo(ws, token);
  gameManager.addUser(user);
  ws.on("disconnect", () => {
    gameManager.removeUser(ws);
  });
});
