import express from 'express';
import { prisma } from "./db/index";
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from "cookie-parser";
import { v4 as uuidv4 } from "uuid";
import { User } from "@prisma/client";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);



app.post("/api/v1/register", async (req, res) => {
  let { username, name, email, password } = req.body;
  password = bcrypt.hashSync(password, 10);
  try {
    const ifExist = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username,
          },
          {
            email,
          },
        ],
      },
    });
    if (ifExist) {
      throw new Error("User already exists");
    }
    const data = await prisma.user.create({
      data: {
        username,
        name,
        email,
        password,
      },
    });

    res.status(201).json({
      message: "User created successfully",
    });
  } catch (error: any) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

app.post("/api/v1/guest", async (req, res) => {
  const guestUUID = "Guest" + uuidv4();
  const user = await prisma.user.create({
    data: {
      username: guestUUID,
      name: guestUUID,
      password: guestUUID,
      provider: "GUEST",
    },
  });
  res.cookie("token", generateToken(user), {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    secure: true, // Ensures HTTPS in production
    domain: ".builtbyatif.work", // Allows subdomain access
    path: "/", // Makes cookie available on all routes
    sameSite: "none", // Required for cross-site cookies
  });

  res.status(200).json({
    message: "User logged in successfully",
    user,
  });
});

app.post("/api/v1/login", async (req, res) => {
  let { username, password } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        username,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    if (!bcrypt.compareSync(password, user.password)) {
      throw new Error("Invalid password");
    }
    res.cookie("token", generateToken(user), {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      secure: true, // Ensures HTTPS in production
      domain: ".builtbyatif.work", // Allows subdomain access
      path: "/", // Makes cookie available on all routes
      sameSite: "none", // Required for cross-site cookies
    });

    res.status(200).json({
      message: "User logged in successfully",
      user,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});
const generateToken = (user: User) => {
  return jsonwebtoken.sign(
    {
      userId: user.id,
      username: user.username,
      isGuest: user.provider == "GUEST",
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1h",
    }
  );
};


app.listen(4000,()=>{
    console.log('Server is running on port 4000');
}
);