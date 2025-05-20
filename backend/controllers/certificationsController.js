const pool = require("../utils/db");

/**
 * GET /certifications
 * Retrieve all certification records for the authenticated user.
 */
exports.getCertifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      "SELECT * FROM certifications WHERE user_id = $1",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * POST /certifications
 * Add a new certification record for the authenticated user.
 */
exports.addCertification = async (req, res) => {
  try {
    const { title, institute } = req.body;
    const userId = req.user.id;
    let fileUrl = null;

    if (req.file) {
      const cloudinary = require("../utils/cloudinary");
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "certifications",
        resource_type: "auto",
      });
      fileUrl = result.secure_url;
    }

    const result = await pool.query(
      "INSERT INTO certifications (user_id, title, institute, file_url) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, title, institute, fileUrl]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * PUT /certifications/:id
 * Update an existing certification record identified by id for the authenticated user.
 */
exports.updateCertification = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, institute } = req.body;
    const userId = req.user.id;
    let fileUrl = null;

    const existingCert = await pool.query(
      "SELECT file_url FROM certifications WHERE id = $1 AND user_id = $2",
      [id, userId]
    );
    if (existingCert.rows.length === 0) {
      return res.status(404).json({ message: "Certification not found" });
    }

    if (req.file) {
      const cloudinary = require("../utils/cloudinary");
      if (existingCert.rows[0].file_url) {
        const publicId = existingCert.rows[0].file_url
          .split("/")
          .pop()
          .split(".")[0];
        await cloudinary.uploader.destroy(`certifications/${publicId}`);
      }
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "certifications",
        resource_type: "auto",
      });
      fileUrl = result.secure_url;
    } else {
      fileUrl = existingCert.rows[0].file_url;
    }

    const result = await pool.query(
      "UPDATE certifications SET title = $1, institute = $2, file_url = $3 WHERE id = $4 AND user_id = $5 RETURNING *",
      [title, institute, fileUrl, id, userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * DELETE /certifications/:id
 * Delete a certification record identified by id for the authenticated user.
 */
exports.deleteCertification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      "DELETE FROM certifications WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Certification not found" });
    }
    res.json({ message: "Certification deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
