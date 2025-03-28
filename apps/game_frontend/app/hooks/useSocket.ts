import { useEffect, useState } from "react";

export default function useSocket() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const WS_URL = process.env.NEXT_PUBLIC_WS_URL;
  useEffect(() => {
    const ws = new WebSocket(WS_URL!);
    ws.onopen = () => {
      console.log("Connected");
      setSocket(ws);
    };
    ws.onclose = () => {
      console.log("Disconnected");
      setSocket(null);
    };
    return () => {
      ws.close();
    };
  }, []);
  return socket;
}
