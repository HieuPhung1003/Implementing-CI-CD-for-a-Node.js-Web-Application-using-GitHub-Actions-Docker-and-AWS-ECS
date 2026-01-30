// models/transactionModel.js
const fs = require('fs');
const path = require('path');

const getDataFile = (username) => path.join(__dirname, `../data/transactions_${username}.json`);

const loadData = (username) => {
    try {
        const filePath = getDataFile(username);
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        }
        return [];
    } catch (err) {
        console.error(`Error loading transactions for ${username}:`, err);
        return [];
    }
};

const saveData = (username, transactions) => {
    try {
        fs.writeFileSync(getDataFile(username), JSON.stringify(transactions, null, 2));
    } catch (err) {
        console.error(`Error saving transactions for ${username}:`, err);
    }
};

module.exports = {
    getAll: (username) => {
        const transactions = loadData(username);
        // Sort newest first
        return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    },

    add: (username, transaction) => {
        const transactions = loadData(username);
        const newTransaction = {
            id: Date.now(),
            date: new Date().toISOString(),
            ...transaction
        };
        transactions.push(newTransaction);
        saveData(username, transactions);
        return newTransaction;
    }
};
