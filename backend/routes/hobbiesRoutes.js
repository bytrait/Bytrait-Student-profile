const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const hobbiesController = require("../controllers/hobbiesController");

const router = express.Router();

// Fetch all hobbies for the logged-in user
router.get("/", authMiddleware, hobbiesController.getHobbies);

// Add a new hobby
router.post("/", authMiddleware, hobbiesController.addHobby);

// Delete a hobby
router.delete("/:id", authMiddleware, hobbiesController.deleteHobby);

module.exports = router;
