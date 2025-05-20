const pool = require("../utils/db");
const jwt = require("jsonwebtoken");
const fs = require("fs");

/**
 * POST /signup
 * Register a new user along with an optional profile photo.
 */
const signup = async (req, res) => {
  try {
    const { name, username, password, username_alias, mobile, location } =
      req.body;
    let profilePhotoUrl = null;

    if (req.file) {
      const cloudinary = require("../utils/cloudinary");
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_photos",
        resource_type: "image",
      });
      profilePhotoUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const result = await pool.query(
      "INSERT INTO users (name, username, password, username_alias, mobile, location, profile_photo) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        name,
        username,
        password,
        username_alias,
        mobile,
        location,
        profilePhotoUrl,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * POST /login
 * Authenticate user credentials and return a JSON Web Token.
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (result.rows.length === 0 || result.rows[0].password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * GET /user
 * Fetch the authenticated user details.
 */
const getUser = async (req, res) => {
  try {
    const userId = req.user.id
    const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      userId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * PUT /user/profile-photo
 * Update the profile photo for the authenticated user.
 */
const updateProfilePhoto = async (req, res) => {
  try {
    const userId = req.user.id;
    let profilePhotoUrl = null;

    const existingPhoto = await pool.query(
      "SELECT profile_photo FROM users WHERE user_id = $1",
      [userId]
    );
    if (existingPhoto.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    if (existingPhoto.rows[0].profile_photo) {
      const cloudinary = require("../utils/cloudinary");
      const publicId = existingPhoto.rows[0].profile_photo
        .split("/")
        .pop()
        .split(".")[0];
      await cloudinary.uploader.destroy(`profile_photos/${publicId}`);
    }

    if (req.file) {
      const validTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!validTypes.includes(req.file.mimetype)) {
        fs.unlinkSync(req.file.path);
        return res
          .status(400)
          .json({ message: "Only PNG, JPG, or JPEG files are allowed." });
      }

      const cloudinary = require("../utils/cloudinary");
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_photos",
        resource_type: "image",
      });
      profilePhotoUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const result = await pool.query(
      "UPDATE users SET profile_photo = $1 WHERE user_id = $2 RETURNING *",
      [profilePhotoUrl, userId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * GET /user/info
 * Retrieve detailed user information (including associated records).
 */
const getUserInfo = async (req, res) => {
  const userId = req.params.id
    ;
  console.log("User ID:", userId);
  try {
    const client = await pool.connect();

    try {
      const user = (
        await client.query(
          "SELECT user_id, name,profile_photo,location, username, mobile FROM users WHERE user_id = $1",
          [userId]
        )
      ).rows[0];

      if (!user) return res.status(404).json({ error: "User not found" });

      const linkedinProfiles = (
        await client.query(
          "SELECT id, name, url FROM linkedin_profiles WHERE user_id = $1",
          [userId]
        )
      ).rows;

      const education = (
        await client.query(
          "SELECT id, title, start_year, end_year, board, cgpa, stream, school, website FROM education WHERE user_id = $1",
          [userId]
        )
      ).rows;

      const skills = (
        await client.query(
          "SELECT id, name, type FROM skills WHERE user_id = $1",
          [userId]
        )
      ).rows;

      const certifications = (
        await client.query(
          "SELECT id, title, institute, file_url FROM certifications WHERE user_id = $1",
          [userId]
        )
      ).rows;

      const experiences = (
        await client.query(
          "SELECT id, designation, profile, organization, location, start_date, end_date, role_type FROM experiences WHERE user_id = $1",
          [userId]
        )
      ).rows;

      const projects = (
        await client.query(
          "SELECT id, title, link, description, role_and_tech FROM projects WHERE user_id = $1",
          [userId]
        )
      ).rows;

      const hobbies = (
        await client.query("SELECT id, name FROM hobbies WHERE user_id = $1", [
          userId,
        ])
      ).rows;

      const userInfo = {
        user,
        linkedinProfiles,
        education,
        skills,
        certifications,
        experiences,
        projects,
        hobbies,
      };
      res.status(200).json(userInfo);
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * GET /users/:id
 * Fetch public user information by user id.
 */
const getUserInfoById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error." });
  }
};

const updateUserInfo = async (req, res) => {
  try {
    const { name, username, mobile, location } = req.body;
    const userId = req.user.id;

    const result = await pool.query(
      "UPDATE users SET name = $1, username = $2, mobile = $3, location = $4 WHERE user_id = $5 RETURNING *",
      [name, username, mobile, location, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error." });
  }
}


module.exports = {
  signup,
  login,
  getUser,
  updateProfilePhoto,
  updateUserInfo,
  getUserInfo,
  getUserInfoById,
};
