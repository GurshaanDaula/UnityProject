import bcrypt from "bcrypt";
import { pool } from "../config/db.js";

// password validation
function validatePassword(pw) {
    return (
        pw.length >= 10 &&
        /[A-Z]/.test(pw) &&
        /[a-z]/.test(pw) &&
        /\d/.test(pw) &&
        /[^A-Za-z0-9]/.test(pw)
    );
}

export async function registerUser(req, res) {
    const { username, password } = req.body;

    if (!validatePassword(password))
        return res.status(400).json({
            error:
                "Password must be at least 10 chars, include uppercase, lowercase, number & symbol.",
        });

    try {
        const hashed = await bcrypt.hash(password, 10);

        const [existing] = await pool.query(
            "SELECT id FROM users WHERE username = ?",
            [username]
        );

        if (existing.length > 0) {
            return res.status(400).json({ error: "Username already taken" });
        }

        const [result] = await pool.query(
            "INSERT INTO users (username, password_hash) VALUES (?, ?)",
            [username, hashed]
        );

        // Create starting player progress
        await pool.query(
            "INSERT INTO player_progress (user_id, selected_character, current_villain_index, wins, losses) VALUES (?, NULL, 0, 0, 0)",
            [result.insertId]
        );

        res.json({ success: true, message: "Account created!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Registration failed" });
    }
}

export async function loginUser(req, res) {
    try {
        const { username, password } = req.body;

        const [rows] = await pool.query(
            "SELECT * FROM users WHERE username = ?",
            [username]
        );

        if (rows.length === 0)
            return res.status(400).json({ error: "Invalid username" });

        const user = rows[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch)
            return res.status(400).json({ error: "Incorrect password" });

        req.session.userId = user.id;

        res.json({ success: true, username });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Login failed" });
    }
}

export function logoutUser(req, res) {
    req.session.destroy(() => {
        res.json({ success: true });
    });
}
