const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const skillsController = require("../controllers/skillsController");

const router = express.Router();

// Fetch all skills for the logged-in user
router.get("/", authMiddleware, skillsController.getSkills);

// Add a new skill
router.post("/", authMiddleware, skillsController.addSkill);

// Update a skill
router.put("/:id", authMiddleware, skillsController.updateSkill);

// Delete a skill
router.delete("/:id", authMiddleware, skillsController.deleteSkill);

module.exports = router;
