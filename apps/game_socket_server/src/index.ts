import { WebSocketServer } from "ws";
import GameManager from "./manager/game/GameManager";
import { extractUserInfo } from "./auth";
const wss = new WebSocketServer({ port: 8080 });
const gameManager = GameManager.createGameManager();

console.log("WebSocket Server is listening to Port 8080");

wss.on("connection", function connection(ws) {
  //! Extract User Info from Token
  const token = "dsfsdfsdfdsfdfsdfsdf";
  const user = extractUserInfo(ws, token);

  //! User Connected + Listening for Messages
  gameManager.addUser(user);
  //! User Disconnected
  ws.on("disconnect", () => {
    gameManager.removeUser(ws);
  });
});
