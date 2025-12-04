import express from "express";
import db from "../config/db.js";
const router = express.Router();

// GET progress
router.get("/progress", async (req, res) => {
    const { username } = req.query;

    if (!username)
        return res.json({ success: false, error: "Missing username" });

    try {
        const [rows] = await db.query(
            "SELECT * FROM player_progress WHERE username = ?",
            [username]
        );

        if (rows.length === 0) {
            await db.query(
                `INSERT INTO player_progress 
                (username, level, xp, xp_to_next, max_hp, max_mana, bonus_attack, bonus_health, bonus_mana, current_villain)
                 VALUES (?, 1, 0, 100, 100, 100, 0, 0, 0, 0)`,
                [username]
            );

            return res.json({
                success: true,
                data: {
                    username,
                    level: 1,
                    xp: 0,
                    xp_to_next: 100,
                    max_hp: 100,
                    max_mana: 100,
                    bonus_attack: 0,
                    bonus_health: 0,
                    bonus_mana: 0,
                    current_villain: 0
                }
            });
        }

        return res.json({ success: true, data: rows[0] });

    } catch (err) {
        console.error(err);
        res.json({ success: false, error: err.message });
    }
});

// POST progress
router.post("/progress", async (req, res) => {
    const data = req.body;

    if (!data.username)
        return res.json({ success: false, error: "Missing username" });

    try {
        await db.query(
            `INSERT INTO player_progress
            (username, level, xp, xp_to_next, max_hp, max_mana, bonus_attack, bonus_health, bonus_mana, current_villain)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                level = VALUES(level),
                xp = VALUES(xp),
                xp_to_next = VALUES(xp_to_next),
                max_hp = VALUES(max_hp),
                max_mana = VALUES(max_mana),
                bonus_attack = VALUES(bonus_attack),
                bonus_health = VALUES(bonus_health),
                bonus_mana = VALUES(bonus_mana),
                current_villain = VALUES(current_villain)
            `,
            [
                data.username,
                data.level,
                data.xp,
                data.xp_to_next,
                data.max_hp,
                data.max_mana,
                data.bonus_attack,
                data.bonus_health,
                data.bonus_mana,
                data.current_villain
            ]
        );

        res.json({ success: true });

    } catch (err) {
        console.error(err);
        res.json({ success: false, error: err.message });
    }
});

export default router;
