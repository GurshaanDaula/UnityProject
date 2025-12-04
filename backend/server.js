import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();
app.use(express.static("public"));

// FIX UNITY WEBGL MIME TYPES + BROTLI HEADERS
app.use((req, res, next) => {
    if (req.url.endsWith(".br")) {
        if (req.url.endsWith(".js.br")) {
            res.setHeader("Content-Type", "application/javascript");
        } else if (req.url.endsWith(".wasm.br")) {
            res.setHeader("Content-Type", "application/wasm");
        } else if (req.url.endsWith(".data.br")) {
            res.setHeader("Content-Type", "application/octet-stream");
        } else if (req.url.endsWith(".json.br")) {
            res.setHeader("Content-Type", "application/json");
        }

        res.setHeader("Content-Encoding", "br");
    }
    next();
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🔥 DBZ Battle API running on port ${PORT}`);
});
