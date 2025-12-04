import pool from "../config/db.js";

export async function getProgress(req, res) {
    try {
        const userId = req.session.userId;

        const [rows] = await pool.query(
            "SELECT selected_character, current_villain_index, wins, losses FROM player_progress WHERE user_id = ?",
            [userId]
        );

        if (rows.length === 0)
            return res.status(404).json({ error: "No progress found" });

        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to load progress" });
    }
}

export async function updateProgress(req, res) {
    try {
        const userId = req.session.userId;
        const {
            selected_character,
            current_villain_index,
            wins,
            losses,
        } = req.body;

        await pool.query(
            `UPDATE player_progress
       SET selected_character = ?,
           current_villain_index = ?,
           wins = ?,
           losses = ?
       WHERE user_id = ?`,
            [
                selected_character,
                current_villain_index,
                wins,
                losses,
                userId,
            ]
        );

        res.json({ success: true, message: "Progress updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update progress" });
    }
}
