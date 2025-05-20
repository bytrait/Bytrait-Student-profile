const axios = require("axios");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

/**
 * POST /resume
 * Generate a PDF resume using user data and a third-party API.
 */
const generateResume = async (req, res) => {
  try {
    const { userData } = req.body;
    const mistralApiKey = process.env.MISTRAL_API_KEY;

    if (!userData) {
      return res.status(400).json({ error: "User data is required" });
    }

    const mistralResponse = await axios.post(
      "https://api.mistral.ai/v1/resume-generator",
      { data: userData },
      {
        headers: {
          Authorization: `Bearer ${mistralApiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const resumeContent = mistralResponse.data.resume;
    const pdfFileName = `${userData.username}-resume.pdf`;
    const pdfPath = path.join(__dirname, "../uploads", pdfFileName);
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(pdfPath));
    doc.fontSize(16).text("Resume", { align: "center" });
    doc.fontSize(12).text(resumeContent, { align: "left" });
    doc.end();

    const pdfUrl = `${process.env.BASE_URL}/uploads/${pdfFileName}`;
    res.json({ pdfUrl });
  } catch (error) {
    console.error("Error generating resume:", error.message);
    res.status(500).json({ error: "Failed to generate resume" });
  }
};

module.exports = { generateResume };
