import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import MongoStore from "connect-mongo";

import authRoutes from "./routes/auth.js";
const gameRoutes = require("./routes/game.js");

dotenv.config();

const app = express();

// JSON parser
app.use(express.json());

// CORS for Unity WebGL
app.use(
    cors({
        origin: ["http://localhost:5173", "https://your-github-pages-url"],
        credentials: true,
    })
);

// Session configuration
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URL,
            crypto: {
                secret: process.env.MONGO_ENCRYPTION_KEY,
            },
        }),
        cookie: {
            httpOnly: true,
            secure: false, // set true in production HTTPS
            sameSite: "lax",
        },
    })
);

// Routes
app.use("/auth", authRoutes);
app.use("/game", gameRoutes);

export default app;
