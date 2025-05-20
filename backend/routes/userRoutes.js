const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const {
  signup,
  login,
  getUser,
  updateProfilePhoto,
  getUserInfo,
  getUserInfoById,
  updateUserInfo,
} = require("../controllers/userController");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Ensure the "uploads" directory exists
const dir = "./uploads";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

// Signup Route
router.post("/signup", upload.single("profile_photo"), signup);

// Login Route
router.post("/login", login);

// Fetch user data
router.get("/user", authMiddleware, getUser);

// Update profile photo
router.put(
  "/user",
  authMiddleware,
  upload.single("profile_photo"),
  updateProfilePhoto
);
router.put(
  "/user/update",authMiddleware,updateUserInfo
);
// Fetch all user information
router.get("/user-info", authMiddleware, getUserInfo);

// New route to fetch user info by id
router.get("/users/:id", authMiddleware, getUserInfoById);

module.exports = router;
