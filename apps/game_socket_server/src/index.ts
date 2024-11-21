import { WebSocketServer } from "ws";
import GameManager from "./manager/game/GameManager";
import { extractUserInfo } from "./auth";
const wss = new WebSocketServer({ port: 8080 });
const gameManager = GameManager.createGameManager();

console.log("WebSocket Server is listening to Port 8080");


wss.on("connection", function connection(ws,req) {
  //! Extract User Info from Token
  const cookie = req.headers.cookie;
  const cookies = parseCookies(cookie as string);
  const token = cookies.token;
  console.log(token);
  
  const user = extractUserInfo(ws, token as string);

  //! User Connected + Listening for Messages
  gameManager.addUser(user);
  //! User Disconnected
  ws.on("close", () => {
    console.log("User Disconnected");
    gameManager.removeUser(ws);
  });
});

function parseCookies(cookie: string) {
  return cookie.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.split("=");
    if (key && value) {
      acc[key.trim()] = value;
    }
    return acc;
  }, {} as { [key: string]: string });
}