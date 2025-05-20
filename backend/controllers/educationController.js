const pool = require("../utils/db");

/**
 * GET /education
 * Retrieve all education records for the authenticated user.
 */
exports.getEducation = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      "SELECT * FROM education WHERE user_id = $1",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * POST /education
 * Insert a new education record for the authenticated user.
 */
exports.addEducation = async (req, res) => {
  try {
    const {
      title,
      start_year,
      end_year,
      board,
      cgpa,
      stream,
      school,
      website,
    } = req.body;
    const userId = req.user.id;

    const result = await pool.query(
      "INSERT INTO education (user_id, title, start_year, end_year, board, cgpa, stream, school, website) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [
        userId,
        title,
        start_year,
        end_year,
        board,
        cgpa,
        stream,
        school,
        website || null,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * PUT /education/:id
 * Update an existing education record identified by id for the authenticated user.
 */
exports.updateEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      start_year,
      end_year,
      board,
      cgpa,
      stream,
      school,
      website,
    } = req.body;
    const userId = req.user.id;

    const result = await pool.query(
      "UPDATE education SET title = $1, start_year = $2, end_year = $3, board = $4, cgpa = $5, stream = $6, school = $7, website = $8 WHERE id = $9 AND user_id = $10 RETURNING *",
      [
        title,
        start_year,
        end_year,
        board,
        cgpa,
        stream,
        school,
        website || null,
        id,
        userId,
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Education entry not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * DELETE /education/:id
 * Remove an education record identified by id for the authenticated user.
 */
exports.deleteEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      "DELETE FROM education WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Education entry not found" });
    }
    res.json({ message: "Education entry deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
