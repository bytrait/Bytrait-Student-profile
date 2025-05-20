const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const educationController = require("../controllers/educationController");

const router = express.Router();

router.get("/", authMiddleware, educationController.getEducation);
router.post("/", authMiddleware, educationController.addEducation);
router.put("/:id", authMiddleware, educationController.updateEducation);
router.delete("/:id", authMiddleware, educationController.deleteEducation);

module.exports = router;
