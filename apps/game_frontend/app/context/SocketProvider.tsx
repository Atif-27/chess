"use client";
import { createContext, useContext } from "react";
import useSocket from "../hooks/useSocket";
interface SocketType {
  socket: WebSocket | null;
}
const SocketContext = createContext<SocketType>({ socket: null });
export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const socket = useSocket();
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocketContext() {
  if (!SocketContext) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return useContext(SocketContext);
}
