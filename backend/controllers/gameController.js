import pool from "../config/db.js";

// ---------------------- GET PLAYER PROGRESS ----------------------
export async function getProgress(req, res) {
    try {
        const userId = req.session.userId;

        const [rows] = await pool.query(
            `SELECT 
                selected_character,
                current_villan,
                level,
                xp,
                xp_to_next,
                max_hp,
                max_mana,
                bonus_attack,
                bonus_health,
                bonus_mana
            FROM player_progress 
            WHERE user_id = ?`,
            [userId]
        );

        if (rows.length === 0)
            return res.status(404).json({ error: "No progress found" });

        res.json(rows[0]);
    } catch (err) {
        console.error("GET PROGRESS ERROR:", err);
        res.status(500).json({ error: "Failed to load progress" });
    }
}

// ---------------------- UPDATE PLAYER PROGRESS ----------------------
export async function updateProgress(req, res) {
    try {
        const userId = req.session.userId;

        const {
            selected_character,
            current_villan,
            level,
            xp,
            xp_to_next,
            max_hp,
            max_mana,
            bonus_attack,
            bonus_health,
            bonus_mana
        } = req.body;

        await pool.query(
            `UPDATE player_progress
             SET selected_character = ?,
                 current_villan = ?,
                 level = ?,
                 xp = ?,
                 xp_to_next = ?,
                 max_hp = ?,
                 max_mana = ?,
                 bonus_attack = ?,
                 bonus_health = ?,
                 bonus_mana = ?
             WHERE user_id = ?`,
            [
                selected_character,
                current_villan,
                level,
                xp,
                xp_to_next,
                max_hp,
                max_mana,
                bonus_attack,
                bonus_health,
                bonus_mana,
                userId
            ]
        );

        res.json({ success: true, message: "Progress updated" });
    } catch (err) {
        console.error("UPDATE PROGRESS ERROR:", err);
        res.status(500).json({ error: "Failed to update progress" });
    }
}
