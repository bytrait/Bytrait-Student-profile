require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const pool = require("./utils/db");

// Import routes
const userRoutes = require("./routes/userRoutes");
const linkedinRoutes = require("./routes/linkedinRoutes");
const educationRoutes = require("./routes/educationRoutes");
const skillsRoutes = require("./routes/skillsRoutes");
const certificationsRoutes = require("./routes/certificationsRoutes");
const experienceRoutes = require("./routes/experienceRoutes");
const projectsRoutes = require("./routes/projectsRoutes");
const hobbiesRoutes = require("./routes/hobbiesRoutes");
const resumeGeneraterRoutes = require("./routes/resumeGeneraterRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api", userRoutes);
app.use("/api/linkedin", linkedinRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/certifications", certificationsRoutes(upload.single("file")));
app.use("/api/experiences", experienceRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/hobbies", hobbiesRoutes);
app.use("/api/resume", resumeGeneraterRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
