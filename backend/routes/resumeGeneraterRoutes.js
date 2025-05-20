const express = require("express");
const { generateResume } = require("../controllers/resumeController");

const router = express.Router();

// Route to generate resume
router.post("/generate", generateResume);

module.exports = router;
