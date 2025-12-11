import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import MongoStore from "connect-mongo";

import authRoutes from "./routes/auth.js";
import gameRoutes from "./routes/game.js";

dotenv.config();

const app = express();

// JSON parser
app.use(express.json());

// CORS
app.use(
    cors({
        origin: ["https://unityproject2.onrender.com"],
        credentials: true,
    })
);

// Sessions
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

// 🔥 ROUTES MUST BE REGISTERED HERE
app.use("/auth", authRoutes);
app.use("/game", gameRoutes);

export default app;
