// FILE: key.js
// Daftar API Key yang valid beserta masa berlakunya dan device tracking
const validApiKeys = {
    'CRYPTO1234567890': { 
        expires: new Date('2025-12-31').getTime(),
        name: 'Premium User',
        level: 'premium',
        deviceId: null,
        lastUsed: null
    },
    'LEN9876543210': { 
        expires: new Date('2025-08-15').getTime(),
        name: 'Trial User',
        level: 'trial',
        deviceId: null,
        lastUsed: null
    },
    'FLAME2025XYZ': { 
        expires: new Date('2025-08-30').getTime(),
        name: 'Developer',
        level: 'admin',
        deviceId: null,
        lastUsed: null
    },
    'TEST123456789': {
        expires: new Date('2025-12-31').getTime(),
        name: 'Tester',
        level: 'tester',
        deviceId: null,
        lastUsed: null
    }
};

// Generate unique device ID
function generateDeviceId() {
    return 'device_' + Math.random().toString(36).substr(2, 9) + 
           '_' + new Date().getTime().toString(36);
}

// Fungsi untuk validasi API Key dengan device checking
function validateApiKey(apiKey) {
    const keyData = validApiKeys[apiKey];
    const now = new Date().getTime();
    
    if (!keyData) {
        return {
            isValid: false,
            isExpired: false,
            message: 'API Key tidak valid'
        };
    }
    
    if (now >= keyData.expires) {
        return {
            isValid: false,
            isExpired: true,
            message: 'API Key sudah kadaluarsa'
        };
    }
    
    // Check if already used by another device
    const currentDeviceId = localStorage.getItem('deviceId') || generateDeviceId();
    localStorage.setItem('deviceId', currentDeviceId);
    
    if (keyData.deviceId && keyData.deviceId !== currentDeviceId) {
        return {
            isValid: false,
            isExpired: false,
            message: 'API Key sudah digunakan di perangkat lain'
        };
    }
    
    // Register device if first time or same device
    if (!keyData.deviceId || keyData.deviceId === currentDeviceId) {
        keyData.deviceId = currentDeviceId;
        keyData.lastUsed = now;
        return {
            isValid: true,
            expires: keyData.expires,
            userData: {
                name: keyData.name,
                level: keyData.level
            }
        };
    }
    
    return {
        isValid: false,
        isExpired: false,
        message: 'Gagal validasi device'
    };
}

// Fungsi untuk menambah API Key baru (untuk admin)
function addApiKey(newKey, keyData) {
    if (validApiKeys[newKey]) {
        return { success: false, message: 'API Key sudah ada' };
    }
    
    validApiKeys[newKey] = {
        ...keyData,
        deviceId: null,
        lastUsed: null
    };
    
    return { success: true, message: 'API Key berhasil ditambahkan' };
}

// Fungsi untuk logout (clear device binding)
function logoutApiKey(apiKey) {
    if (validApiKeys[apiKey]) {
        validApiKeys[apiKey].deviceId = null;
        return { success: true, message: 'Logout berhasil, API Key dapat digunakan di perangkat lain' };
    }
    return { success: false, message: 'API Key tidak valid' };
}