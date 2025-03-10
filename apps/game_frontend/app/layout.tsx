import type { Metadata } from "next";
import "./globals.css";
import UserProvider from "./context/UserProvider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Chess | Play Multiplayer",
  description: "Play chess online with random people",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          {children}
          <Toaster />
        </UserProvider>
      </body>
    </html>
  );
}
