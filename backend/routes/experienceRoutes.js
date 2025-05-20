const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const experiencesController = require("../controllers/experiencesController");

const router = express.Router();

// Fetch all experiences for the logged-in user
router.get("/", authMiddleware, experiencesController.getExperiences);

// Add a new experience
router.post("/", authMiddleware, experiencesController.addExperience);

// Update an experience
router.put("/:id", authMiddleware, experiencesController.updateExperience);

// Delete an experience
router.delete("/:id", authMiddleware, experiencesController.deleteExperience);

module.exports = router;
