import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import UserProvider from "./context/UserProvider";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Chess | Play with Random People",
  description: "Multiplayer Chess Game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}

