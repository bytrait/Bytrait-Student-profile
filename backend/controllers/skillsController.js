const pool = require("../utils/db");

/**
 * GET /skills
 * Retrieve all skill records for the authenticated user.
 */
exports.getSkills = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query("SELECT * FROM skills WHERE user_id = $1", [
      userId,
    ]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * POST /skills
 * Add a new skill for the authenticated user. Both name and type are required.
 */
exports.addSkill = async (req, res) => {
  try {
    const { name, type } = req.body;
    const userId = req.user.id;

    if (!name || !type) {
      return res.status(400).json({ message: "Name and type are required" });
    }

    const result = await pool.query(
      "INSERT INTO skills (user_id, name, type) VALUES ($1, $2, $3) RETURNING *",
      [userId, name, type]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * PUT /skills/:id
 * Update an existing skill identified by id for the authenticated user.
 */
exports.updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type } = req.body;
    const userId = req.user.id;

    if (!name || !type) {
      return res.status(400).json({ message: "Name and type are required" });
    }

    const result = await pool.query(
      "UPDATE skills SET name = $1, type = $2 WHERE id = $3 AND user_id = $4 RETURNING *",
      [name, type, id, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Skill not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * DELETE /skills/:id
 * Delete a skill record identified by id for the authenticated user.
 */
exports.deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      "DELETE FROM skills WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Skill not found" });
    }
    res.json({ message: "Skill deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
