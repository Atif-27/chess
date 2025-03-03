"use client";

import { useUserContext } from "./context/UserProvider";
import { Button } from "@/components/ui/button";
import { ChevronRight, Crown, Users, Zap, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const { user } = useUserContext();
  const loggedIn = user?.name || false;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950 text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-purple-600 p-2 rounded-lg">
            <Crown className="h-6 w-6" />
          </div>
          <span className="font-bold text-xl">ChessMaster</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="hover:text-purple-400 transition-colors"
          >
            Features
          </Link>
          <Link href="#" className="hover:text-purple-400 transition-colors">
            Tournaments
          </Link>
          <Link href="#" className="hover:text-purple-400 transition-colors">
            Leaderboard
          </Link>
        </nav>
        {!loggedIn ? (
          <div className="flex gap-3">
            <Link href="/login">
              <Button
                variant="outline"
                className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
              >
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Sign Up
              </Button>
            </Link>
          </div>
        ) : (
          <div></div>
        )}
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Master Chess.
            <br />
            <span className="text-purple-400">Play Globally.</span>
          </h1>
          <p className="text-zinc-300 text-lg max-w-md">
            Challenge players worldwide, improve your skills, and climb the
            ranks in our competitive multiplayer chess platform.
          </p>
          <div className="flex gap-4 pt-4">
            <Link href="/game">
              <Button className="bg-purple-600 hover:bg-purple-700 px-6 py-6 text-lg">
                Play Now <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              variant="outline"
              className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white px-6 py-6 text-lg"
            >
              Watch Games
            </Button>
          </div>
        </div>
        <div className="flex-1 relative">
          <div className="relative md:h-[400px] w-full">
            <Image
              src={"/landing.jpg"}
              alt="Chess game in action"
              fill
              className="object-contain"
              style={{
                filter: "drop-shadow(0px 10px 20px rgba(123, 97, 255, 0.3))",
              }}
            />
          </div>
          <div className="md:absolute -bottom-6 -left-6 bg-zinc-800 p-4 rounded-lg shadow-xl border border-zinc-700 ">
            <div className="flex items-center gap-3">
              <div className="bg-green-500 h-3 w-3 rounded-full"></div>
              <span>10 players online</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Players Choose Us
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700 hover:border-purple-500 transition-colors">
            <div className="bg-purple-600/20 p-3 rounded-lg w-fit mb-4">
              <Users className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Global Matchmaking</h3>
            <p className="text-zinc-400">
              Play against opponents of your skill level from around the world,
              anytime.
            </p>
          </div>
          <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700 hover:border-purple-500 transition-colors">
            <div className="bg-purple-600/20 p-3 rounded-lg w-fit mb-4">
              <Zap className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Advanced Analysis</h3>
            <p className="text-zinc-400">
              Review your games with our powerful AI analysis tools to improve
              your strategy.
            </p>
          </div>
          <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700 hover:border-purple-500 transition-colors">
            <div className="bg-purple-600/20 p-3 rounded-lg w-fit mb-4">
              <Clock className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Daily Tournaments</h3>
            <p className="text-zinc-400">
              Compete in daily tournaments with prizes and climb the global
              leaderboard.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 mb-8">
        <div className="bg-gradient-to-r from-purple-900/40 to-purple-600/40 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to make your move?
          </h2>
          <p className="text-zinc-300 max-w-xl mx-auto mb-8">
            Join thousands of chess enthusiasts and start your journey to
            becoming a chess master today.
          </p>
          <Link href="/register">
            <Button className="bg-purple-600 hover:bg-purple-700 px-8 py-6 text-lg">
              Create Free Account
            </Button>
          </Link>
          <div className="mt-6 text-sm text-zinc-400">
            No credit card required • Free tier available
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="bg-purple-600 p-1 rounded">
              <Crown className="h-4 w-4" />
            </div>
            <span className="font-bold">ChessMaster</span>
          </div>
          <div className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} ChessMaster. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
