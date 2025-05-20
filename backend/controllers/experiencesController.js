const pool = require("../utils/db");

/**
 * GET /experiences
 * Retrieve all experience records for the authenticated user.
 */
exports.getExperiences = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      "SELECT * FROM experiences WHERE user_id = $1",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * POST /experiences
 * Add a new experience record for the authenticated user.
 */
exports.addExperience = async (req, res) => {
  try {
    const {
      designation,
      profile,
      organization,
      location,
      startDate,
      endDate,
      roleType,
    } = req.body;
    const userId = req.user.id;

    const requiredFields = [
      designation,
      profile,
      organization,
      location,
      startDate,
      endDate,
      roleType,
    ];
    if (requiredFields.some((field) => !field)) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const result = await pool.query(
      "INSERT INTO experiences (user_id, designation, profile, organization, location, start_date, end_date, role_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        userId,
        designation,
        profile,
        organization,
        location,
        startDate,
        endDate,
        roleType,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * PUT /experiences/:id
 * Update an existing experience record identified by id for the authenticated user.
 */
exports.updateExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      designation,
      profile,
      organization,
      location,
      startDate,
      endDate,
      roleType,
    } = req.body;
    const userId = req.user.id;

    const requiredFields = [
      designation,
      profile,
      organization,
      location,
      startDate,
      endDate,
      roleType,
    ];
    if (requiredFields.some((field) => !field)) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const result = await pool.query(
      "UPDATE experiences SET designation = $1, profile = $2, organization = $3, location = $4, start_date = $5, end_date = $6, role_type = $7 WHERE id = $8 AND user_id = $9 RETURNING *",
      [
        designation,
        profile,
        organization,
        location,
        startDate,
        endDate,
        roleType,
        id,
        userId,
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Experience not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * DELETE /experiences/:id
 * Delete an experience record identified by id for the authenticated user.
 */
exports.deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      "DELETE FROM experiences WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Experience not found" });
    }
    res.json({ message: "Experience deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
