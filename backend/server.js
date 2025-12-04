import express from "express";
import app from "./app.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fix Brotli MIME
app.use((req, res, next) => {
    if (req.url.endsWith(".br")) {
        if (req.url.includes(".js")) res.setHeader("Content-Type", "application/javascript");
        if (req.url.includes(".wasm")) res.setHeader("Content-Type", "application/wasm");
        if (req.url.includes(".data")) res.setHeader("Content-Type", "application/octet-stream");
        res.setHeader("Content-Encoding", "br");
    }
    next();
});

// Serve Unity build
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🔥 Backend running on port ${PORT}`);
});
