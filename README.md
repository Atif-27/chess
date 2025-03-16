# ♟️ Turbo Chess Multiplayer  

Turbo Chess Multiplayer is a **real-time** chess game built with **Next.js, Express, Prisma, WebSockets, and TurboRepo**. It allows users to **play chess online, track game history, and compete against opponents in real-time**.  

## 🛠️ Tech Stack  

### **Frontend:**  
- **Next.js 14** (App Router)  
- **Tailwind CSS**  
- **TypeScript**  

### **Backend:**  
- **Express.js**  
- **Prisma ORM (PostgreSQL)**  
- **WebSockets (ws)**  

### **Authentication:**  
- **JWT (JSON Web Token) with HTTP-Only Cookies**  
- **Guest Login Support**  

## 🚀 Features  

✅ **User Authentication**  
- Register/Login with **email & password**  
- **Guest Mode** for instant play  
- Secure **JWT-based authentication**  

✅ **Real-Time Multiplayer Chess**  
- WebSocket-based **real-time gameplay**  
- Automatic matchmaking  
- Chess move validation using **chess.js**  

✅ **Game History & Rating System**  
- Player **rating system (Elo-based)**  
- Tracks **games played, moves, and results**  

✅ **TurboRepo Monorepo Setup**  
- **Shared TypeScript types** across frontend & backend  
- Optimized **package management & build**  


## ⚡ Setup & Installation  

### 1️⃣ **Clone the Repository**  
git clone https://github.com/Atif-27/chess
cd turbo-chess

### 2️⃣ **Install Dependencies**  
pnpm install  # Or npm install / yarn install

### 3️⃣ **Setup Environment Variables**  
Create a `.env` file in the root directory and add:  

