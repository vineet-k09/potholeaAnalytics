const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

console.log("server loaded");
// Serve homepage (index.html)
app.use(express.static(path.join(__dirname, 'public')));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});
// Middleware to parse JSON & serve static files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve frontend files from "public" folder

// Ensure 'upload' directory exists
const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer storage configuration for image uploads
const storage = multer.diskStorage({
    destination: uploadPath,
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filenames
    }
});
const upload = multer({ storage });



// Handle image upload
app.post("/upload", upload.any(), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No images uploaded!" });
    }
    const images = req.files.map(file => file.filename);
    res.json({ message: "Images uploaded successfully!", images });
});

// Save user data to CSV
app.post("/save-user", (req, res) => {
    const { location, descriptionValue, severityValue } = req.body;
    const csvLine = `${location},${descriptionValue},${severityValue}\n`;
    const csvPath = path.join(__dirname, "userData.csv");

    fs.appendFile(csvPath, csvLine, (err) => {
        if (err) {
            return res.status(500).json({ message: "Error saving user data" });
        }
        res.json({ message: "User data saved successfully!" });
    });
});
const csvPath = path.join(__dirname, "userData.csv");

// Ensure CSV file has headers
if (!fs.existsSync(csvPath)) {
    fs.writeFileSync(csvPath, "Location,Description,Severity,Images\n");
}

// Serve uploaded images statically
// app.use("/upload", express.static(uploadPath)); if break uncomment
app.post("/upload", upload.any(), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No images uploaded!" });
    }
    const parseTextFields = multer().none();

    const images = req.files.map(file => file.filename);
    const { location, description, severity } = req.body;  // Capture user data

    const csvPath = path.join(__dirname, "userData.csv");
    if (!fs.existsSync(csvPath)) {
        fs.writeFileSync(csvPath, "Location,Description,Severity,Images\n");
    }
    const csvLine = `${location},${descriptionValue},${severityValue},${images.join(";")}\n`;

    fs.appendFile(csvPath, csvLine, (err) => {
        if (err) {
            return res.status(500).json({ message: "Error saving user data" });
        }
        res.json({ message: "Images and user data saved successfully!", images });
    });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
