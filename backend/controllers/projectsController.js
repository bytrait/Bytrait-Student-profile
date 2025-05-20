const pool = require("../utils/db");

/**
 * GET /projects
 * Retrieve all project records for the authenticated user.
 */
exports.getProjects = async (req, res) => {
  try {
   const userId = req.user.id;
    const result = await pool.query(
      "SELECT * FROM projects WHERE user_id = $1",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * POST /projects
 * Add a new project record for the authenticated user.
 */
exports.addProject = async (req, res) => {
  try {
    const { title, link, description, roleAndTech } = req.body;
   const userId = req.user.id;

    const result = await pool.query(
      "INSERT INTO projects (user_id, title, link, description, role_and_tech) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [userId, title, link || null, description, roleAndTech]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * PUT /projects/:id
 * Update an existing project record identified by id for the authenticated user.
 */
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, link, description, roleAndTech } = req.body;
   const userId = req.user.id;

    const result = await pool.query(
      "UPDATE projects SET title = $1, link = $2, description = $3, role_and_tech = $4 WHERE id = $5 AND user_id = $6 RETURNING *",
      [title, link || null, description, roleAndTech, id, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * DELETE /projects/:id
 * Delete a project record identified by id for the authenticated user.
 */
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
   const userId = req.user.id;

    const result = await pool.query(
      "DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
