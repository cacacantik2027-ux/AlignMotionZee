const fs = require('fs');
const path = require('path');
// Path ke file hargaAM.json
const dbPath = './database';
const hargaPath = path.join(dbPath, 'hargaAM.json');

// Initialize file if not exists
if (!fs.existsSync(hargaPath)) {
    const defaultHarga = {
        hargaTiaaMember: 1000,
        hargaBulkMember: 500,
        hargaTiaaRess: 250,
        hargaBulkRess: 100,
        hargaJualReseller: 500,
        lastUpdate: new Date().toISOString(),
        updatedBy: ""
    };
    fs.writeFileSync(hargaPath, JSON.stringify(defaultHarga, null, 2));
    console.log('✅ File hargaAM.json created');
}

// Fungsi untuk load harga dari file
function loadHarga() {
    try {
        const data = fs.readFileSync(hargaPath, 'utf8');
        const harga = JSON.parse(data);
        
        // Update global variables
        global.hargaTiaaMember = harga.hargaTiaaMember;
        global.hargaBulkMember = harga.hargaBulkMember;
        global.hargaTiaaRess = harga.hargaTiaaRess;
        global.hargaBulkRess = harga.hargaBulkRess;
        global.hargaJualReseller = harga.hargaJualReseller;
        
        console.log('✅ Harga loaded from database');
        return harga;
    } catch (error) {
        console.error('Error loading harga:', error);
        return null;
    }
}

// Fungsi untuk save harga ke file
function saveHarga(newHarga, updatedBy) {
    try {
        const hargaData = {
            hargaTiaaMember: newHarga.hargaTiaaMember,
            hargaBulkMember: newHarga.hargaBulkMember,
            hargaTiaaRess: newHarga.hargaTiaaRess,
            hargaBulkRess: newHarga.hargaBulkRess,
            hargaJualReseller: newHarga.hargaJualReseller || 500,
            lastUpdate: new Date().toISOString(),
            updatedBy: updatedBy || ""
        };
        
        fs.writeFileSync(hargaPath, JSON.stringify(hargaData, null, 2));
        
        // Update global variables
        global.hargaTiaaMember = hargaData.hargaTiaaMember;
        global.hargaBulkMember = hargaData.hargaBulkMember;
        global.hargaTiaaRess = hargaData.hargaTiaaRess;
        global.hargaBulkRess = hargaData.hargaBulkRess;
        global.hargaJualReseller = hargaData.hargaJualReseller;
        
        console.log('✅ Harga saved to database');
        return true;
    } catch (error) {
        console.error('Error saving harga:', error);
        return false;
    }
}

// Fungsi untuk get harga saat ini
function getHarga() {
    return {
        hargaTiaaMember: global.hargaTiaaMember || 1000,
        hargaBulkMember: global.hargaBulkMember || 500,
        hargaTiaaRess: global.hargaTiaaRess || 250,
        hargaBulkRess: global.hargaBulkRess || 100,
        hargaJualReseller: global.hargaJualReseller || 500
    };
}

// Load harga saat module di require
loadHarga();

module.exports = {
    loadHarga,
    saveHarga,
    getHarga
};