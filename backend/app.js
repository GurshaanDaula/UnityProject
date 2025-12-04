const express = require("express");
const session = require("express-session");
const cors = require("cors");
const dotenv = require("dotenv");
const MongoStore = require("connect-mongo");

// Convert ES imports to CommonJS
const authRoutes = require("./routes/auth.js");
const gameRoutes = require("./routes/game.js");

dotenv.config();

const app = express();

// JSON parser
app.use(express.json());

// CORS
app.use(
    cors({
        origin: ["http://localhost:5173"],
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
            secure: false, // set true in production
            sameSite: "lax",
        },
    })
);

// Routes
app.use("/auth", authRoutes);
app.use("/game", gameRoutes);

module.exports = app;
