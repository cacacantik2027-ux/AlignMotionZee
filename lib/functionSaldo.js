const fs = require('fs');
const path = require('path');

// Database path
const dbPath = './database';
const saldoFile = path.join(dbPath, 'saldo.json');

const hargaManager = require('./hargaManager');

// Ensure database directory exists
if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true });
}

// Initialize saldo database if not exists
if (!fs.existsSync(saldoFile)) {
    fs.writeFileSync(saldoFile, JSON.stringify({}, null, 2));
}

// Helper function to read saldo database
const readSaldoDatabase = () => {
    try {
        const data = fs.readFileSync(saldoFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading saldo database:', error);
        return {};
    }
};

// Helper function to write saldo database
const writeSaldoDatabase = (data) => {
    try {
        fs.writeFileSync(saldoFile, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing saldo database:', error);
        return false;
    }
};

// Function to format currency to Rupiah
const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
};

// Function to register new user
const registerUserSaldo = async (userId, name) => {
    return new Promise((resolve, reject) => {
        try {
            const db = readSaldoDatabase();
            
            if (db[userId]) {
                resolve({
                    success: false,
                    message: 'User already registered!'
                });
                return;
            }
            
            db[userId] = {
                name: name,
                saldo: 0,
                role: 'member', // Default role is member
                registeredAt: new Date().toISOString(),
                lastUpdate: new Date().toISOString()
            };
            
            if (writeSaldoDatabase(db)) {
                resolve({
                    success: true,
                    message: 'User registered successfully',
                    saldo: 0,
                    userData: db[userId]
                });
            } else {
                resolve({
                    success: false,
                    message: 'Failed to save user data'
                });
            }
        } catch (error) {
            console.error('Error in registerUserSaldo:', error);
            reject(error);
        }
    });
};

// Function to check if user exists (by userId)
const isUserExists = async (userId) => {
    return new Promise((resolve, reject) => {
        try {
            const db = readSaldoDatabase();
            resolve(!!db[userId]);
        } catch (error) {
            console.error('Error in isUserExists:', error);
            reject(error);
        }
    });
};

// Function to check if name already exists
const isNameExists = async (name) => {
    return new Promise((resolve, reject) => {
        try {
            const db = readSaldoDatabase();
            const nameExists = Object.values(db).some(user => user.name.toLowerCase() === name.toLowerCase());
            resolve(nameExists);
        } catch (error) {
            console.error('Error in isNameExists:', error);
            reject(error);
        }
    });
};

// Function to add saldo
const addSaldo = async (userId, amount) => {
    return new Promise((resolve, reject) => {
        try {
            const db = readSaldoDatabase();
            
            if (!db[userId]) {
                resolve({
                    success: false,
                    message: 'User not registered! Please use .daftar first.'
                });
                return;
            }
            
            if (isNaN(amount) || amount <= 0) {
                resolve({
                    success: false,
                    message: 'Invalid amount!'
                });
                return;
            }
            
            const oldSaldo = db[userId].saldo;
            db[userId].saldo += amount;
            db[userId].lastUpdate = new Date().toISOString();
            
            if (writeSaldoDatabase(db)) {
                resolve({
                    success: true,
                    message: 'Saldo added successfully',
                    oldSaldo: oldSaldo,
                    newSaldo: db[userId].saldo,
                    addedAmount: amount
                });
            } else {
                resolve({
                    success: false,
                    message: 'Failed to update saldo'
                });
            }
        } catch (error) {
            console.error('Error in addSaldo:', error);
            reject(error);
        }
    });
};

// Function to subtract saldo
const minSaldo = async (userId, amount) => {
    return new Promise((resolve, reject) => {
        try {
            const db = readSaldoDatabase();
            
            if (!db[userId]) {
                resolve({
                    success: false,
                    message: 'User not registered! Please use .daftar first.'
                });
                return;
            }
            
            if (isNaN(amount) || amount <= 0) {
                resolve({
                    success: false,
                    message: 'Invalid amount!'
                });
                return;
            }
            
            const oldSaldo = db[userId].saldo;
            
            if (db[userId].saldo < amount) {
                resolve({
                    success: false,
                    message: `Insufficient saldo! Current saldo: ${formatRupiah(oldSaldo)}`,
                    currentSaldo: oldSaldo,
                    requiredAmount: amount
                });
                return;
            }
            
            db[userId].saldo -= amount;
            db[userId].lastUpdate = new Date().toISOString();
            
            if (writeSaldoDatabase(db)) {
                resolve({
                    success: true,
                    message: 'Saldo subtracted successfully',
                    oldSaldo: oldSaldo,
                    newSaldo: db[userId].saldo,
                    subtractedAmount: amount
                });
            } else {
                resolve({
                    success: false,
                    message: 'Failed to update saldo'
                });
            }
        } catch (error) {
            console.error('Error in minSaldo:', error);
            reject(error);
        }
    });
};

// Function to delete/reset saldo to 0
const deleteSaldo = async (userId) => {
    return new Promise((resolve, reject) => {
        try {
            const db = readSaldoDatabase();
            
            if (!db[userId]) {
                resolve({
                    success: false,
                    message: 'User not registered!'
                });
                return;
            }
            
            const previousSaldo = db[userId].saldo;
            db[userId].saldo = 0;
            db[userId].lastUpdate = new Date().toISOString();
            
            if (writeSaldoDatabase(db)) {
                resolve({
                    success: true,
                    message: 'Saldo reset successfully',
                    previousSaldo: previousSaldo,
                    newSaldo: 0
                });
            } else {
                resolve({
                    success: false,
                    message: 'Failed to reset saldo'
                });
            }
        } catch (error) {
            console.error('Error in deleteSaldo:', error);
            reject(error);
        }
    });
};

// Function to get user's saldo
const getSaldo = async (userId) => {
    return new Promise((resolve, reject) => {
        try {
            const db = readSaldoDatabase();
            
            if (!db[userId]) {
                resolve(null);
                return;
            }
            
            resolve(db[userId].saldo);
        } catch (error) {
            console.error('Error in getSaldo:', error);
            reject(error);
        }
    });
};

// Function to get user's full info
const getUserInfoSaldo = async (userId) => {
    return new Promise((resolve, reject) => {
        try {
            const db = readSaldoDatabase();
            
            if (!db[userId]) {
                resolve(null);
                return;
            }
            
            resolve({
                name: db[userId].name,
                saldo: db[userId].saldo,
                role: db[userId].role,
                registeredAt: db[userId].registeredAt,
                lastUpdate: db[userId].lastUpdate
            });
        } catch (error) {
            console.error('Error in getUserInfoSaldo:', error);
            reject(error);
        }
    });
};

// Function to check if user is registered (alias for isUserExists)
const isUserRegisteredSaldo = async (userId) => {
    return isUserExists(userId);
};

// Function to get all users with saldo
const getAllUsersSaldo = async () => {
    return new Promise((resolve, reject) => {
        try {
            const db = readSaldoDatabase();
            const users = Object.keys(db).map(userId => ({
                userId: userId,
                name: db[userId].name,
                saldo: db[userId].saldo,
                role: db[userId].role,
                registeredAt: db[userId].registeredAt
            }));
            
            // Sort by saldo (highest first)
            users.sort((a, b) => b.saldo - a.saldo);
            resolve(users);
        } catch (error) {
            console.error('Error in getAllUsersSaldo:', error);
            reject(error);
        }
    });
};

// NEW: Function to set user role
const setUserRole = async (userId, role) => {
    return new Promise((resolve, reject) => {
        try {
            const db = readSaldoDatabase();
            
            if (!db[userId]) {
                resolve({
                    success: false,
                    message: 'User not registered!'
                });
                return;
            }
            
            // Validate role
            const validRoles = ['member', 'reseller'];
            if (!validRoles.includes(role.toLowerCase())) {
                resolve({
                    success: false,
                    message: 'Invalid role! Available roles: member, reseller'
                });
                return;
            }
            
            const oldRole = db[userId].role;
            const newRole = role.toLowerCase();
            
            db[userId].role = newRole;
            db[userId].lastUpdate = new Date().toISOString();
            
            if (writeSaldoDatabase(db)) {
                resolve({
                    success: true,
                    message: `Role updated successfully from ${oldRole} to ${newRole}`,
                    oldRole: oldRole,
                    newRole: newRole,
                    userData: {
                        name: db[userId].name,
                        saldo: db[userId].saldo,
                        role: db[userId].role
                    }
                });
            } else {
                resolve({
                    success: false,
                    message: 'Failed to update role'
                });
            }
        } catch (error) {
            console.error('Error in setUserRole:', error);
            reject(error);
        }
    });
};

// NEW: Function to get user role
const getUserRole = async (userId) => {
    return new Promise((resolve, reject) => {
        try {
            const db = readSaldoDatabase();
            
            if (!db[userId]) {
                resolve(null);
                return;
            }
            
            resolve(db[userId].role || 'member');
        } catch (error) {
            console.error('Error in getUserRole:', error);
            reject(error);
        }
    });
};

// NEW: Function to get all users by role
const getUsersByRole = async (role) => {
    return new Promise((resolve, reject) => {
        try {
            const db = readSaldoDatabase();
            const users = Object.keys(db)
                .filter(userId => db[userId].role === role)
                .map(userId => ({
                    userId: userId,
                    name: db[userId].name,
                    saldo: db[userId].saldo,
                    role: db[userId].role,
                    registeredAt: db[userId].registeredAt
                }));
            
            users.sort((a, b) => b.saldo - a.saldo);
            resolve(users);
        } catch (error) {
            console.error('Error in getUsersByRole:', error);
            reject(error);
        }
    });
};

// Di file functionSaldo.js
const getHargaByRole = async (userId, type) => {
    try {
        const userRole = await getUserRole(userId);
        const role = userRole || 'member';
        const harga = hargaManager.getHarga();
        
        if (type === 'Tiaa') {
            return role === 'reseller' ? harga.hargaTiaaRess : harga.hargaTiaaMember;
        } else if (type === 'bulk') {
            return role === 'reseller' ? harga.hargaBulkRess : harga.hargaBulkMember;
        }
        return 0;
    } catch (error) {
        console.error('Error in getHargaByRole:', error);
        return type === 'Tiaa' ? 1000 : 250;
    }
};

// Export all functions
module.exports = {
    registerUserSaldo,
    addSaldo,
    minSaldo,
    deleteSaldo,
    getSaldo,
    getUserInfoSaldo,
    isUserRegisteredSaldo,
    getAllUsersSaldo,
    formatRupiah,
    isUserExists,
    isNameExists,
    setUserRole,    
    getUserRole,     
    getUsersByRole,
	getHargaByRole   
};