const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const projectsController = require("../controllers/projectsController");

const router = express.Router();

// Fetch all projects for the logged-in user
router.get("/", authMiddleware, projectsController.getProjects);

// Add a new project
router.post("/", authMiddleware, projectsController.addProject);

// Update a project
router.put("/:id", authMiddleware, projectsController.updateProject);

// Delete a project
router.delete("/:id", authMiddleware, projectsController.deleteProject);

module.exports = router;