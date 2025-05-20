const pool = require("../utils/db");

/**
 * GET /linkedin-profiles
 * Retrieve all LinkedIn profile records for the authenticated user.
 */
exports.getLinkedinProfiles = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      "SELECT * FROM linkedin_profiles WHERE user_id = $1",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * POST /linkedin-profiles
 * Add a new LinkedIn profile record for the authenticated user.
 */
exports.addLinkedinProfile = async (req, res) => {
  try {
    const { name, url } = req.body;
    const userId = req.user.id;

    if (!name || !url) {
      return res.status(400).json({ message: "Name and URL are required" });
    }

    const result = await pool.query(
      "INSERT INTO linkedin_profiles (user_id, name, url) VALUES ($1, $2, $3) RETURNING *",
      [userId, name, url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * PUT /linkedin-profiles/:id
 * Update an existing LinkedIn profile identified by id for the authenticated user.
 */
exports.updateLinkedinProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, url } = req.body;
    const userId = req.user.id;

    if (!name || !url) {
      return res.status(400).json({ message: "Name and URL are required" });
    }

    const result = await pool.query(
      "UPDATE linkedin_profiles SET name = $1, url = $2 WHERE id = $3 AND user_id = $4 RETURNING *",
      [name, url, id, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "LinkedIn profile not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * DELETE /linkedin-profiles/:id
 * Remove a LinkedIn profile record identified by id for the authenticated user.
 */
exports.deleteLinkedinProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      "DELETE FROM linkedin_profiles WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "LinkedIn profile not found" });
    }
    res.json({ message: "LinkedIn profile deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
