import { WebSocketServer } from "ws";
import GameManager from "./GameManager";
const wss = new WebSocketServer({ port: 8080 });
const gameManager = GameManager.createGameManager();

console.log("WebSocket Server is listening to Port 8080");

wss.on("connection", function connection(ws) {
  gameManager.addUser(ws);
  ws.on("disconnect", () => {
    gameManager.removeUser(ws);
  });
  gameManager.addHandler(ws);
});
