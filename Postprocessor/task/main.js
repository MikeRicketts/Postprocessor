const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function readCSV(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    return data.split('\n').map(row => row.split(',').map(cell => cell.trim()));
}

function writeCSV(filePath, data) {
    const header = 'id, nickname, password, consent to mailing';
    const csvContent = [header, ...data.map(row => row.join(', '))].join('\n');
    fs.writeFileSync(filePath, csvContent, 'utf8');
}

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

function main() {
    const inputFilePath = path.join(__dirname, 'database.csv');
    const outputFilePath = path.join(__dirname, 'filtered_database.csv');
    const users = readCSV(inputFilePath);

    const validUsers = users.slice(1).filter(user => user.every(cell => cell !== '-'));

    const cleanedUsers = validUsers.map((user, index) => {
        const [id, nickname, password, consent] = user;
        const hashedPassword = hashPassword(password);
        return [(index + 1).toString(), nickname, hashedPassword, consent];
    });

    writeCSV(outputFilePath, cleanedUsers);
}

main();
