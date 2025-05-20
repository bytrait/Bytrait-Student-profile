const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const certificationsController = require("../controllers/certificationsController");

const router = express.Router();

module.exports = (upload) => {
  // Fetch all certifications for the logged-in user
  router.get("/", authMiddleware, certificationsController.getCertifications);

  // Add a new certification
  router.post(
    "/",
    authMiddleware,
    upload,
    certificationsController.addCertification
  );

  // Update a certification
  router.put(
    "/:id",
    authMiddleware,
    upload,
    certificationsController.updateCertification
  );

  // Delete a certification
  router.delete(
    "/:id",
    authMiddleware,
    certificationsController.deleteCertification
  );

  return router;
};
