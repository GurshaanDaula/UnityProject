import bcrypt from "bcryptjs";
import pool from "../config/db.js";

// Password validation
function validatePassword(pw) {
    if (!pw || typeof pw !== "string") return false;

    return (
        pw.length >= 10 &&
        /[a-z]/.test(pw) &&
        /[A-Z]/.test(pw) &&
        /[0-9]/.test(pw)
    );
}

// ----------------------- REGISTER USER -----------------------
export async function registerUser(req, res) {
    const { username, password } = req.body;

    if (!validatePassword(password)) {
        return res.status(400).json({
            error:
                "Password must be at least 10 chars, include uppercase, lowercase, and a number."
        });
    }

    try {
        // Does this username already exist?
        const [existing] = await pool.query(
            "SELECT id FROM users WHERE username = ?",
            [username]
        );

        if (existing.length > 0) {
            return res.status(400).json({ error: "Username already taken" });
        }

        // Hash password
        const hashed = await bcrypt.hash(password, 10);

        // Insert into users table
        const [result] = await pool.query(
            "INSERT INTO users (username, password_hash) VALUES (?, ?)",
            [username, hashed]
        );

        const newUserId = result.insertId;

        // Insert default progress matching your EXACT table schema
        await pool.query(
            `INSERT INTO player_progress 
            (user_id, username, level, xp, xp_to_next, max_hp, max_mana,
             bonus_attack, bonus_health, bonus_mana, current_villan, selected_character)
             VALUES (?, ?, 1, 0, 100, 100, 100, 0, 0, 0, 0, NULL)`,
            [newUserId, username]
        );

        res.json({ success: true, message: "Account created!" });

    } catch (err) {
        console.error("REGISTER ERROR:", err);
        res.status(500).json({ error: "Registration failed" });
    }
}

// ----------------------- LOGIN USER -----------------------
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
        console.error("LOGIN ERROR:", err);
        res.status(500).json({ error: "Login failed" });
    }
}

// ----------------------- LOGOUT -----------------------
export function logoutUser(req, res) {
    req.session.destroy(() => {
        res.json({ success: true });
    });
}
