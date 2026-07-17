const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Database path
const dbPath = './database';
const alightMotionFile = path.join(dbPath, 'AlightMotion.json');

// Ensure database directory exists
if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true });
}

// Initialize Alight Motion database if not exists
if (!fs.existsSync(alightMotionFile)) {
    fs.writeFileSync(alightMotionFile, JSON.stringify({ users: {}, pending: {}, history: {} }, null, 2));
}

// Helper function to read Alight Motion database
const readAlightMotionDatabase = () => {
    try {
        const data = fs.readFileSync(alightMotionFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading Alight Motion database:', error);
        return { users: {}, pending: {}, history: {} };
    }
};

// Helper function to write Alight Motion database
const writeAlightMotionDatabase = (data) => {
    try {
        fs.writeFileSync(alightMotionFile, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing Alight Motion database:', error);
        return false;
    }
};

// Function to save email to database (with check for existing pending)
const saveEmailAlightMotion = async (userId, email, userRole = 'member') => {
    return new Promise((resolve, reject) => {
        try {
            const db = readAlightMotionDatabase();
            
            if (!db.users[userId]) {
                db.users[userId] = {
                    emails: [],
                    purchases: [],
                    registeredAt: new Date().toISOString(),
                    role: userRole
                };
            }
            
            // Check if user already has a pending verification
            const userHasPending = Object.keys(db.pending).some(key => 
                db.pending[key].userId === userId && db.pending[key].status === 'pending'
            );
            
            if (userHasPending) {
                resolve({
                    success: false,
                    message: 'You already have a pending verification. Please verify or cancel it first using .cancel'
                });
                return;
            }
            
            // Check if email already exists in user's emails
            if (db.users[userId].emails.includes(email)) {
                resolve({
                    success: false,
                    message: 'Email already registered!'
                });
                return;
            }
            
            // Check if email is already pending by someone else
            if (db.pending[email] && db.pending[email].status === 'pending') {
                resolve({
                    success: false,
                    message: 'This email is already pending verification by another user!'
                });
                return;
            }
            
            db.users[userId].emails.push(email);
            db.users[userId].lastUpdate = new Date().toISOString();
            db.users[userId].role = userRole;
            
            // Save pending verification with role
            db.pending[email] = {
                userId: userId,
                email: email,
                sentAt: new Date().toISOString(),
                status: 'pending',
                role: userRole
            };
            
            if (writeAlightMotionDatabase(db)) {
                resolve({
                    success: true,
                    message: 'Email saved successfully',
                    email: email,
                    role: userRole
                });
            } else {
                resolve({
                    success: false,
                    message: 'Failed to save email'
                });
            }
        } catch (error) {
            console.error('Error in saveEmailAlightMotion:', error);
            reject(error);
        }
    });
};

// Function to save successful verification
const saveVerificationAlightMotion = async (email, duration, userId, price = null, role = null) => {
    return new Promise((resolve, reject) => {
        try {
            const db = readAlightMotionDatabase();
            
            // Get role from pending or user data
            let userRole = role;
            if (!userRole && db.pending[email]) {
                userRole = db.pending[email].role;
            }
            if (!userRole && db.users[userId]) {
                userRole = db.users[userId].role || 'member';
            }
            
            if (!db.users[userId]) {
                db.users[userId] = {
                    emails: [],
                    purchases: [],
                    registeredAt: new Date().toISOString(),
                    role: userRole || 'member'
                };
            }
            
            db.users[userId].purchases.push({
                email: email,
                duration: duration,
                verifiedAt: new Date().toISOString(),
                type: 'premium',
                role: userRole || 'member',
                price: price
            });
            
            // Save to history
            if (!db.history[userId]) {
                db.history[userId] = [];
            }
            db.history[userId].push({
                type: 'verification',
                email: email,
                duration: duration,
                status: 'success',
                timestamp: new Date().toISOString(),
                role: userRole || 'member',
                price: price
            });
            
            // Update pending status
            if (db.pending[email]) {
                db.pending[email].status = 'verified';
                db.pending[email].verifiedAt = new Date().toISOString();
                db.pending[email].duration = duration;
            }
            
            db.users[userId].lastUpdate = new Date().toISOString();
            db.users[userId].role = userRole || 'member';
            
            if (writeAlightMotionDatabase(db)) {
                resolve({
                    success: true,
                    message: 'Verification saved successfully',
                    email: email,
                    duration: duration,
                    role: userRole || 'member'
                });
            } else {
                resolve({
                    success: false,
                    message: 'Failed to save verification'
                });
            }
        } catch (error) {
            console.error('Error in saveVerificationAlightMotion:', error);
            reject(error);
        }
    });
};

// Function to save bulk accounts (UPDATED with role and price)
const saveBulkAccountsAlightMotion = async (userId, accounts, successCount, failedCount, totalRequested, userRole = 'member', pricePerAccount = null) => {
    return new Promise((resolve, reject) => {
        try {
            const db = readAlightMotionDatabase();
            
            if (!db.users[userId]) {
                db.users[userId] = {
                    emails: [],
                    purchases: [],
                    registeredAt: new Date().toISOString(),
                    role: userRole
                };
            }
            
            const bulkPurchase = {
                purchasedAt: new Date().toISOString(),
                totalRequested: totalRequested,
                successCount: successCount,
                failedCount: failedCount,
                accounts: accounts,
                type: 'bulk',
                role: userRole,
                pricePerAccount: pricePerAccount,
                totalPaid: successCount * (pricePerAccount || 0)
            };
            
            db.users[userId].purchases.push(bulkPurchase);
            
            // Save to history
            if (!db.history[userId]) {
                db.history[userId] = [];
            }
            db.history[userId].push({
                type: 'bulk',
                totalRequested: totalRequested,
                successCount: successCount,
                failedCount: failedCount,
                accounts: accounts,
                timestamp: new Date().toISOString(),
                role: userRole,
                pricePerAccount: pricePerAccount,
                totalPaid: successCount * (pricePerAccount || 0)
            });
            
            // Add all emails to user's email list
            accounts.forEach(account => {
                if (!db.users[userId].emails.includes(account.email)) {
                    db.users[userId].emails.push(account.email);
                }
            });
            
            db.users[userId].lastUpdate = new Date().toISOString();
            db.users[userId].role = userRole;
            
            if (writeAlightMotionDatabase(db)) {
                resolve({
                    success: true,
                    message: 'Bulk accounts saved successfully',
                    accounts: accounts,
                    role: userRole
                });
            } else {
                resolve({
                    success: false,
                    message: 'Failed to save bulk accounts'
                });
            }
        } catch (error) {
            console.error('Error in saveBulkAccountsAlightMotion:', error);
            reject(error);
        }
    });
};

// Function to get pending email for user (only one)
const getPendingEmailForUserAlightMotion = async (userId) => {
    return new Promise((resolve, reject) => {
        try {
            const db = readAlightMotionDatabase();
            
            // Find the first pending email for this user
            const pendingEntry = Object.entries(db.pending).find(([email, data]) => 
                data.userId === userId && data.status === 'pending'
            );
            
            if (pendingEntry) {
                const [email, data] = pendingEntry;
                resolve({
                    email: email,
                    data: data
                });
            } else {
                resolve(null);
            }
        } catch (error) {
            console.error('Error in getPendingEmailForUserAlightMotion:', error);
            reject(error);
        }
    });
};

// Function to check if user has pending verification
const hasPendingVerificationAlightMotion = async (userId) => {
    return new Promise((resolve, reject) => {
        try {
            const db = readAlightMotionDatabase();
            const hasPending = Object.values(db.pending).some(data => 
                data.userId === userId && data.status === 'pending'
            );
            resolve(hasPending);
        } catch (error) {
            console.error('Error in hasPendingVerificationAlightMotion:', error);
            reject(error);
        }
    });
};

// Function to cancel pending verification
const cancelPendingAlightMotion = async (userId, email = null) => {
    return new Promise((resolve, reject) => {
        try {
            const db = readAlightMotionDatabase();
            let cancelledEmail = null;
            
            if (email) {
                // Cancel specific email
                if (db.pending[email] && db.pending[email].userId === userId) {
                    cancelledEmail = email;
                    delete db.pending[email];
                }
            } else {
                // Cancel all pending for user
                const pendingEmails = Object.keys(db.pending).filter(e => 
                    db.pending[e].userId === userId && db.pending[e].status === 'pending'
                );
                
                if (pendingEmails.length > 0) {
                    cancelledEmail = pendingEmails[0];
                    delete db.pending[pendingEmails[0]];
                }
            }
            
            if (cancelledEmail && db.users[userId]) {
                // Remove email from user's emails list
                const emailIndex = db.users[userId].emails.indexOf(cancelledEmail);
                if (emailIndex !== -1) {
                    db.users[userId].emails.splice(emailIndex, 1);
                }
                
                // Save to history
                if (!db.history[userId]) {
                    db.history[userId] = [];
                }
                db.history[userId].push({
                    type: 'cancel',
                    email: cancelledEmail,
                    timestamp: new Date().toISOString()
                });
                
                db.users[userId].lastUpdate = new Date().toISOString();
            }
            
            if (writeAlightMotionDatabase(db)) {
                resolve({
                    success: true,
                    message: cancelledEmail ? 'Pending verification cancelled' : 'No pending verification found',
                    email: cancelledEmail
                });
            } else {
                resolve({
                    success: false,
                    message: 'Failed to cancel pending verification'
                });
            }
        } catch (error) {
            console.error('Error in cancelPendingAlightMotion:', error);
            reject(error);
        }
    });
};

// Function to check if email is pending
const isEmailPendingAlightMotion = async (email) => {
    return new Promise((resolve, reject) => {
        try {
            const db = readAlightMotionDatabase();
            resolve(!!(db.pending[email] && db.pending[email].status === 'pending'));
        } catch (error) {
            console.error('Error in isEmailPendingAlightMotion:', error);
            reject(error);
        }
    });
};

// Function to get user's purchase history
const getUserPurchasesAlightMotion = async (userId) => {
    return new Promise((resolve, reject) => {
        try {
            const db = readAlightMotionDatabase();
            
            if (!db.users[userId]) {
                resolve([]);
                return;
            }
            
            resolve(db.users[userId].purchases);
        } catch (error) {
            console.error('Error in getUserPurchasesAlightMotion:', error);
            reject(error);
        }
    });
};

// Function to get user's history
const getUserHistoryAlightMotion = async (userId) => {
    return new Promise((resolve, reject) => {
        try {
            const db = readAlightMotionDatabase();
            
            if (!db.history[userId]) {
                resolve([]);
                return;
            }
            
            resolve(db.history[userId]);
        } catch (error) {
            console.error('Error in getUserHistoryAlightMotion:', error);
            reject(error);
        }
    });
};

// NEW: Function to get statistics by role
const getStatsByRoleAlightMotion = async () => {
    return new Promise((resolve, reject) => {
        try {
            const db = readAlightMotionDatabase();
            const stats = {
                member: {
                    totalUsers: 0,
                    totalVerifications: 0,
                    totalBulkPurchases: 0,
                    totalAccounts: 0
                },
                reseller: {
                    totalUsers: 0,
                    totalVerifications: 0,
                    totalBulkPurchases: 0,
                    totalAccounts: 0
                }
            };
            
            for (const userId in db.users) {
                const user = db.users[userId];
                const role = user.role || 'member';
                
                stats[role].totalUsers++;
                
                // Count purchases
                if (user.purchases) {
                    user.purchases.forEach(purchase => {
                        if (purchase.type === 'premium') {
                            stats[role].totalVerifications++;
                        } else if (purchase.type === 'bulk') {
                            stats[role].totalBulkPurchases++;
                            stats[role].totalAccounts += purchase.successCount || 0;
                        }
                    });
                }
            }
            
            resolve(stats);
        } catch (error) {
            console.error('Error in getStatsByRoleAlightMotion:', error);
            reject(error);
        }
    });
};

// NEW: Function to get user role from AlightMotion data
const getUserRoleFromAM = async (userId) => {
    return new Promise((resolve, reject) => {
        try {
            const db = readAlightMotionDatabase();
            if (db.users[userId] && db.users[userId].role) {
                resolve(db.users[userId].role);
            } else {
                resolve(null);
            }
        } catch (error) {
            console.error('Error in getUserRoleFromAM:', error);
            reject(error);
        }
    });
};

// Function to send verification email
const sendVerificationEmailAlightMotion = async (email) => {
    try {
        const response = await axios.get('https://dlyyz-rest.my.id/api/AlightMotion', {
            params: {
                action: "send",
                email: email,
                apikey: global.apiKeyAlightMotion
            }
        });
        
        return response.data;
    } catch (error) {
        console.error('Error sending verification email:', error);
        return {
            status: false,
            message: 'Failed to send verification email'
        };
    }
};

// Function to verify link
const verifyLinkAlightMotion = async (email, link) => {
    try {
        const response = await axios.get('https://dlyyz-rest.my.id/api/AlightMotion', {
            params: {
                action: "verify",
                email: email,
                link: link,
                apikey: global.apiKeyAlightMotion
            }
        });
        
        return response.data;
    } catch (error) {
        console.error('Error verifying link:', error);
        return {
            status: false,
            message: 'Failed to verify link'
        };
    }
};

// Function to create bulk accounts
const createBulkAccountsAlightMotion = async (amount) => {
    try {
        const response = await axios.get('https://dlyyz-rest.my.id/api/AlightMotion', {
            params: {
                action: "bulk",
                amount: amount,
                apikey: global.apiKeyAlightMotion
            }
        });
        
        return response.data;
    } catch (error) {
        console.error('Error creating bulk accounts:', error);
        return {
            status: false,
            message: 'Failed to create bulk accounts'
        };
    }
};

// Function to format currency
const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
};

// Export all functions
module.exports = {
    saveEmailAlightMotion,
    saveVerificationAlightMotion,
    saveBulkAccountsAlightMotion,
    getPendingEmailForUserAlightMotion,
    hasPendingVerificationAlightMotion,
    cancelPendingAlightMotion,
    isEmailPendingAlightMotion,
    getUserPurchasesAlightMotion,
    getUserHistoryAlightMotion,
    getStatsByRoleAlightMotion,
    getUserRoleFromAM,
    sendVerificationEmailAlightMotion,
    verifyLinkAlightMotion,
    createBulkAccountsAlightMotion,
    formatRupiah
};