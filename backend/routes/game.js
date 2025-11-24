import express from "express";
import { pool } from "../config/db.js";

const router = express.Router();

// Helper: Get user_id from username
async function getUserId(username) {
    const [rows] = await pool.query(
        "SELECT id FROM users WHERE username = ?",
        [username]
    );

    if (rows.length === 0) return null;
    return rows[0].id;
}

// ------------------------------------------------------
// GET PROGRESS
// ------------------------------------------------------
router.get("/progress", async (req, res) => {
    const username = req.query.username;

    if (!username) {
        return res.status(400).json({ success: false, error: "Missing username" });
    }

    try {
        const userId = await getUserId(username);

        if (!userId) {
            return res.json({ success: false, error: "User not found" });
        }

        const [rows] = await pool.query(
            "SELECT selected_character, current_villain_index, wins, losses FROM player_progress WHERE user_id = ?",
            [userId]
        );

        if (rows.length === 0) {
            // No progress yet, create default
            return res.json({
                success: true,
                username,
                selectedCharacter: "",
                currentEnemy: 0,
                wins: 0,
                losses: 0
            });
        }

        const row = rows[0];

        res.json({
            success: true,
            username,
            selectedCharacter: row.selected_character,
            currentEnemy: row.current_villain_index,
            wins: row.wins,
            losses: row.losses
        });

    } catch (err) {
        console.error("Error loading progress:", err);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

// ------------------------------------------------------
// SAVE PROGRESS
// ------------------------------------------------------
router.post("/save-progress", async (req, res) => {
    const { username, wins, losses, currentEnemy, selectedCharacter } = req.body;

    if (!username) {
        return res.status(400).json({ success: false, error: "Missing username" });
    }

    try {
        const userId = await getUserId(username);

        if (!userId) {
            return res.json({ success: false, error: "User not found" });
        }

        await pool.query(
            `UPDATE player_progress
             SET selected_character = ?, wins = ?, losses = ?, current_villain_index = ?, last_updated = NOW()
             WHERE user_id = ?`,
            [selectedCharacter, wins, losses, currentEnemy, userId]
        );

        res.json({ success: true });

    } catch (err) {
        console.error("Error saving progress:", err);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

export default router;
