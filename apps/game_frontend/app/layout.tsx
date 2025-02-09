import type { Metadata } from "next";
import "./globals.css";
import UserProvider from "./context/UserProvider";

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
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
