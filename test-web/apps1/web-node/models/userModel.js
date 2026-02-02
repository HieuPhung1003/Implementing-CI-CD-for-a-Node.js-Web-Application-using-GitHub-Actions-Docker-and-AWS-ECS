// models/userModel.js
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_FILE = path.join(__dirname, '../data/users.json');

let users = [];

// Load data on startup
const loadData = () => {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            users = JSON.parse(data);
        } else {
            // Default Admin User (Password: admin123)
            // Ideally we hash this on first run, but for simplicity let's rely on register or pre-seed
            // Hash for 'admin123' is $2a$10$w1.
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync("admin123", salt);

            users = [
                { id: 1, username: "admin", password: hash }
            ];
            saveData();
        }
    } catch (err) {
        console.error("Error loading users:", err);
        users = [];
    }
};

const saveData = () => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
    } catch (err) {
        console.error("Error saving users:", err);
    }
};

// Initial Load
loadData();

module.exports = {
    findByUsername: (username) => {
        return users.find(u => u.username === username);
    },

    findById: (id) => {
        return users.find(u => u.id === id);
    },

    create: async (username, password) => {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = {
            id: Date.now(),
            username: username,
            password: hash
        };

        users.push(newUser);
        saveData();
        return newUser;
    },

    validatePassword: async (user, password) => {
        return await bcrypt.compare(password, user.password);
    }
};
