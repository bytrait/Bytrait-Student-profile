const pool = require("../utils/db");

/**
 * GET /hobbies
 * Retrieve all hobby records for the authenticated user.
 */
exports.getHobbies = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      "SELECT * FROM hobbies WHERE user_id = $1",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * POST /hobbies
 * Add a new hobby (name required) for the authenticated user.
 */
exports.addHobby = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ message: "Hobby name is required" });
    }

    const result = await pool.query(
      "INSERT INTO hobbies (user_id, name) VALUES ($1, $2) RETURNING *",
      [userId, name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * DELETE /hobbies/:id
 * Delete a hobby record identified by id for the authenticated user.
 */
exports.deleteHobby = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      "DELETE FROM hobbies WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Hobby not found" });
    }
    res.json({ message: "Hobby deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
