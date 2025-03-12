const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const cors = require('cors');
const path = require('path');  // ✅ Import path module

const app = express();
app.use(cors());

// ✅ Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Route to serve the main HTML file
app.get('/data', (req, res) => {
    const csvFilePath = path.join(__dirname, '..', 'userPage', 'userData.csv'); // Ensure this path is correct
    //const csvFilePath = path.join(__dirname, "userData.csv");

    const results = [];

    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
            try {
                if (row.Location) {
                    const match = row.Location.match(/(-?\d+\.\d+),(-?\d+\.\d+)/);
                    if (match) {
                        results.push({
                            lat: parseFloat(match[1]),
                            lng: parseFloat(match[2]),
                            location: row.Location.split(" - ")[0].trim(),
                            description: row.Description,
                            severity: row.Severity.trim()
                        });
                    }
                }
            } catch (error) {
                console.error("Error processing row:", row, error);
            }
        })
        .on('end', () => {
            res.json(results);
        })
        .on('error', (err) => {
            console.error("❌ Error reading CSV:", err);
            res.status(500).json({ error: "Failed to read CSV file" });
        });
});
app.post('/data', (req, res) => {
    results.push(req.body);
})
const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
