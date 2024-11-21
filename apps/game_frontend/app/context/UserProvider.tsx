"use client";
import { createContext, use, useContext, useEffect, useState } from "react";
type UserType = {
  username: string;
  id: string;
  name: string;
  rating: number;
} | null;

type UserContextType = {
  user: UserType;
  setUserCtx: (user: UserType) => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUserCtx: () => {},
});
export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<UserType>(null);
  function setUserCtx(user: UserType) {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  }
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user") || "{}"));
    
    }, []);

  return (
    <UserContext.Provider value={{ user, setUserCtx }}>
      {children}
    </UserContext.Provider>
  );
}


export function useUserContext() {
  const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
}