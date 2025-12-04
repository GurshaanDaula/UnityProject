import app from "./app.js";
import dotenv from "dotenv";
import express from "express";

const express = require("express");
const app = require("./app");


dotenv.config();

// FIX UNITY WEBGL MIME TYPES + BROTLI HEADERS
app.use((req, res, next) => {
    if (req.url.endsWith(".br")) {

        // correct MIME types
        if (req.url.endsWith(".js.br")) {
            res.setHeader("Content-Type", "application/javascript");
        } else if (req.url.endsWith(".wasm.br")) {
            res.setHeader("Content-Type", "application/wasm");
        } else if (req.url.endsWith(".data.br")) {
            res.setHeader("Content-Type", "application/octet-stream");
        } else if (req.url.endsWith(".json.br")) {
            res.setHeader("Content-Type", "application/json");
        }

        // tell browser to decompress it
        res.setHeader("Content-Encoding", "br");
    }
    next();
});

// MUST COME AFTER FIX
app.use(express.static("public"));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🔥 DBZ Battle API running on port ${PORT}`);
});
