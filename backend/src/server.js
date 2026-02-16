const express = require("express");

const app = express();
const PORT = 3000;

// Middleware (for JSON parsing)
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
    res.send("🚀 Express server is running!");
});

// Example API Route
app.get("/api/test", (req, res) => {
    res.json({ message: "API is working!" });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
