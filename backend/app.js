import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import MongoStore from "connect-mongo";

import authRoutes from "./routes/auth.js";
import gameRoutes from "./routes/game.js";   // FIXED

dotenv.config();

const app = express();

app.use(express.json());

app.use(
    cors({
        origin: [
            "https://unityproject-0598.onrender.com",
            "http://localhost:5173",
            "http://localhost:3000"
        ],
        credentials: true
    })

);

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URL,
            crypto: { secret: process.env.MONGO_ENCRYPTION_KEY },
        }),
        cookie: {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        },
    })
);

app.use("/auth", authRoutes);
app.use("/game", gameRoutes);

export default app;
