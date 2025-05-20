const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const linkedinController = require("../controllers/linkedinController");

const router = express.Router();

// Fetch all LinkedIn profiles for the logged-in user
router.get("/", authMiddleware, linkedinController.getLinkedinProfiles);

// Add a new LinkedIn profile
router.post("/", authMiddleware, linkedinController.addLinkedinProfile);

// Update a LinkedIn profile
router.put("/:id", authMiddleware, linkedinController.updateLinkedinProfile);

// Delete a LinkedIn profile
router.delete("/:id", authMiddleware, linkedinController.deleteLinkedinProfile);

module.exports = router;
