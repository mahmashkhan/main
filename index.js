const express = require("express");
const app = express();
const PORT = 4000;
const fs = require("fs");
let users = [];

// Check if MOCK_DATA.json exists and is not empty
if (fs.existsSync("./MOCK_DATA.json")) {
    try {
        const data = fs.readFileSync("./MOCK_DATA.json", "utf-8");
        if (data.trim().length > 0) {
            users = JSON.parse(data);
        }
    } catch (err) {
        console.error("Error reading or parsing MOCK_DATA.json:", err);
    }
}
const validator = require('email-validator');


//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Function to Validate Email
function validateEmail(req, res, next) {
    const email = req.body.email;
    if (!email || !validator.validate(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
    }
    next();
}
// Function to write file and handle response
function writeFileAndRespond(data, res) {
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(data), (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(data);
    });
}

// Routes

// Get all users
app.get("/api/users", (req, res) => {
    res.json(users);
});

// Get user by ID
app.get("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    res.json(user);
});

// Add new user
app.post("/api/users", validateEmail, (req, res) => {
    const body = req.body;
    const email = body.email;

    // ensure email should be unique
    const uniqueEmail = users.some(user => user.email === email)
    if (uniqueEmail) {
        return res.status(400).json({ error: "email already taken" })
    }
    users.push({ id: users.length + 1, ...body });
    writeFileAndRespond(users, res);
});

// Update user by ID
app.put('/api/users/:id', validateEmail, (req, res) => {
    const userId = Number(req.params.id);
    const updatedData = req.body;
    const email = updatedData.email;
    const userIndex = users.findIndex(user => user.id === userId);

    // ensure email should be unique
    const uniqueEmail = users.some(user => user.email === email && user.id !== userId)
    if (uniqueEmail) {
        return res.status(400).json({ error: "email already taken" })
    }
    users[userIndex] = { ...users[userIndex], ...updatedData };
    writeFileAndRespond(users, res);
});

// Delete user by ID
app.delete('/api/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const userIndex = users.findIndex((user) => user.id === id);
    users.splice(userIndex, 1);s
    writeFileAndRespond(users, res);
});

// Partial update user by ID (Patch)
app.patch('/api/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const userIndex = users.findIndex((user) => user.id === id);
    const updatedFields = req.body;

    Object.assign(users[userIndex], updatedFields);
    writeFileAndRespond(users, res);
});

app.listen(PORT, () => {
    console.log(`Server is listening at port ${PORT}`);
});
