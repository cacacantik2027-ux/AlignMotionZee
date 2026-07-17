require('./settings')
const { default: makeWASocket, WAConnection, generateWAMessageFromContent, 
prepareWAMessageMedia, useMultiFileAuthState, Browsers, DisconnectReason, makeInMemoryStore, makeCacheableSignalKeyStore, fetchLatestWaWebVersion, proto, PHONENUMBER_MCC, getAggregateVotesInPollMessage, fetchLatestBaileysVersion, jidDecode, downloadContentFromMessage } = require('@whiskeysockets/baileys');

const pino = require('pino')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const yargs = require('yargs/yargs')
const axios = require('axios')
const path = require('path')
const fetch = require('node-fetch')
const FileType = require('file-type')
const PhoneNumber = require('awesome-phonenumber')
const moment = require('moment-timezone')
const chalk = require("chalk");
const crypto = require('crypto')
const usePairingCode = true
const readline = require("readline");
const { smsg, getBuffer, fetchJson } = require('./lib/simple')
const figlet = require("figlet");
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const { isSetClose,
    addSetClose,
    removeSetClose,
    changeSetClose,
    getTextSetClose,
    isSetDone,
    addSetDone,
    removeSetDone,
    changeSetDone,
    getTextSetDone,
    isSetLeft,
    addSetLeft,
    removeSetLeft,
    changeSetLeft,
    getTextSetLeft,
    isSetOpen,
    addSetOpen,
    removeSetOpen,
    changeSetOpen,
    getTextSetOpen,
    isSetProses,
    addSetProses,
    removeSetProses,
    changeSetProses,
    getTextSetProses,
    isSetWelcome,
    addSetWelcome,
    removeSetWelcome,
    changeSetWelcome,
    getTextSetWelcome,
    addSewaGroup,
    getSewaExpired,
    getSewaPosition,
    expiredCheck,
    checkSewaGroup
} = require("./lib/store")

const sleep = async (ms) => {
	return new Promise(resolve => setTimeout(resolve, ms));
}

const color = (text, color) => {
	return !color ? chalk.green(text) : chalk.keyword(color)(text);
};

const question = (text) => {
  const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
  });
  return new Promise((resolve) => {
rl.question(text, resolve)
  })
};

let set_welcome_db = JSON.parse(fs.readFileSync('./database/set_welcome.json'));
let set_left_db = JSON.parse(fs.readFileSync('./database/set_left.json'));
let _welcome = JSON.parse(fs.readFileSync('./database/welcome.json'));
let _left = JSON.parse(fs.readFileSync('./database/left.json'));
let set_proses = JSON.parse(fs.readFileSync('./database/set_proses.json'));
let set_done = JSON.parse(fs.readFileSync('./database/set_done.json'));
let set_open = JSON.parse(fs.readFileSync('./database/set_open.json'));
let set_close = JSON.parse(fs.readFileSync('./database/set_close.json'));
let sewa = JSON.parse(fs.readFileSync('./database/sewa.json'));
let opengc = JSON.parse(fs.readFileSync('./database/opengc.json'));
let antilink = JSON.parse(fs.readFileSync('./database/antilink.json'));
let antiwame = JSON.parse(fs.readFileSync('./database/antiwame.json'));
let antilink2 = JSON.parse(fs.readFileSync('./database/antilink2.json'));
let antiwame2 = JSON.parse(fs.readFileSync('./database/antiwame2.json'));
let db_respon_list = JSON.parse(fs.readFileSync('./database/list-message.json'));
let setpay = JSON.parse(fs.readFileSync('./database/pay.json'));

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })
global.api = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({
	...query,
	...(apikeyqueryname ? {
		[apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name]
		} : {})
		})) : '')
		


async function Botstarted() {
    const { state, saveCreds } = await useMultiFileAuthState(`./${sessionName}`);
    const { version, isLatest } = await fetchLatestBaileysVersion();

    console.log(chalk.hex('#FF69B4')(`\n🌸 WhatsApp Bot Version: `) + chalk.hex('#00BFFF')(`v${version.join('.')}`) + chalk.hex('#FFF5E1')(` (isLatest: ${isLatest})`));

    console.log(
        chalk.bgHex('#FF69B4').hex('#FFF5E1')(
            figlet.textSync("DlyyZ", {
                font: "Standard",
                horizontalLayout: "default",
                verticalLayout: "default",
                whitespaceBreak: false,
            })
        )
    );

    console.log(chalk.hex('#FFF5E1')('⏳ ') + chalk.hex('#00BFFF')('Please wait') + chalk.hex('#FF69B4')('... Connecting to WhatsApp...'));

    const alpha = makeWASocket({
    logger: pino({ level: "silent" }),
    printQRInTerminal: !usePairingCode,
    qrTimeout: 60000,
    emitOwnEvents: true,
    auth: state,
    markOnlineOnConnect: false,
    syncFullHistory: false,
    browser: Browsers.linux('Chrome'),
    version: [2, 3429, 12],
    connectTimeoutMs: 30000,
    defaultQueryTimeoutMs: 10000,
    keepAliveIntervalMs: 20000,
    fireInitQueries: true,
    shouldReconnect: () => true,
    reconnectDelayMs: 5000,
    msgRetryCounterMap: {},
    retryRequestDelayMs: 1500,
    generateHighQualityLinkPreview: true,
    usePairingCode: usePairingCode ? true : false,
    mobile: false,
    downloadHistory: false,
    waWebSocketUrl: "wss://web.whatsapp.com/ws/chat",
	getMessage: async (key) => {
      return undefined;
    }
})
 Object.defineProperties(alpha, {
    ...(typeof alpha.chatRead !== 'function' ? {
      chatRead: {
        value(jid, participant = alpha.user.jid, messageID) {
          return alpha.sendReadReceipt(jid, participant, [messageID]);
        },
        enumerable: true
      }
    } : {}),

    ...(typeof alpha.setStatus !== 'function' ? {
      setStatus: {
        value(status) {
          return alpha.query({
            tag: 'iq',
            attrs: {
              to: '@s.whatsapp.net',
              type: 'set',
              xmlns: 'status',
            },
            content: [{
              tag: 'status',
              attrs: {},
              content: Buffer.from(status, 'utf-8')
            }]
          });
        },
        enumerable: true
      }
    } : {}),

    ...(typeof alpha.sendReact !== 'function' ? {
      sendReact: {
        value(jid, text, key) {
          return alpha.sendMessage(jid, {
            react: {
              text,
              key
            }
          });
        },
        enumerable: true
      }
    } : {}),

    ...(typeof alpha.editMessage !== 'function' ? {
      editMessage: {
        value(jid, message, newText, options = {}) {
          let copy = {
            ...message
          };
          let mtype = Object.keys(copy.message)[0];
          let msgContent = copy.message[mtype];

          if (typeof msgContent === 'string') {
            copy.message[mtype] = newText || msgContent;
          } else if (msgContent.text) {
            msgContent.text = newText || msgContent.text;
          } else if (msgContent.caption) {
            msgContent.caption = newText || msgContent.caption;
          }

          return alpha.relayMessage(jid, copy.message, {
            messageId: copy.key.id,
            ...options
          });
        },
        enumerable: true
      }
    } : {})
  });

    if (usePairingCode && !alpha.authState.creds.registered) {
        const phoneNumber = await question(chalk.hex('#FFF5E1')('\n📱 Silakan masukkan nomor WhatsApp diawali dengan 628xxxxx:\n'));
        const code = await alpha.requestPairingCode(phoneNumber.trim());
        console.log(chalk.hex('#00BFFF')('\n🔗 Kode Pairing Nya: ') + chalk.hex('#FF69B4')(code));
    }

    const BACKUP_DIR = 'tmp';
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Interval backup dalam milidetik (8 jam)
const BACKUP_INTERVAL = 8 * 60 * 60 * 1000; // 8 jam

// Fungsi untuk mendapatkan path file backup dengan format tanggal-jam
function getBackupFilePath() {
    const now = moment().tz('Asia/Jakarta');
    const formattedDate = now.format('D-MMM-YYYY_HH-mm');
    return path.join(BACKUP_DIR, `backup-${formattedDate}.zip`);
}

// Fungsi untuk mendapatkan timestamp dari nama file backup
function getBackupTimestampFromFile(filename) {
    // Format: backup-D-MMM-YYYY_HH-mm.zip
    const match = filename.match(/backup-(.+)\.zip/);
    if (!match) return null;
    
    const dateStr = match[1];
    const parsed = moment.tz(dateStr, 'D-MMM-YYYY_HH-mm', 'Asia/Jakarta');
    return parsed.isValid() ? parsed.valueOf() : null;
}

// Fungsi untuk membersihkan file backup lama
function cleanupOldBackups() {
    try {
        const files = fs.readdirSync(BACKUP_DIR);
        const backupFiles = files.filter(f => f.startsWith('backup-') && f.endsWith('.zip'));
        
        if (backupFiles.length > 0) {
            // Urutkan berdasarkan timestamp dari nama file
            const sortedFiles = backupFiles.sort((a, b) => {
                const tsA = getBackupTimestampFromFile(a) || 0;
                const tsB = getBackupTimestampFromFile(b) || 0;
                return tsB - tsA; // Terbaru dulu
            });
            
            // Hapus semua kecuali yang terbaru
            for (let i = 1; i < sortedFiles.length; i++) {
                const filePath = path.join(BACKUP_DIR, sortedFiles[i]);
                fs.unlinkSync(filePath);
                console.log(`[BACKUP] File lama dihapus: ${sortedFiles[i]}`);
            }
        }
    } catch (err) {
        console.error('[BACKUP] Error membersihkan file lama:', err.message);
    }
}

// Fungsi untuk mengecek apakah sudah waktunya backup baru
function shouldCreateNewBackup() {
    try {
        const files = fs.readdirSync(BACKUP_DIR);
        const backupFiles = files.filter(f => f.startsWith('backup-') && f.endsWith('.zip'));
        
        if (backupFiles.length === 0) {
            console.log('[BACKUP] Tidak ada file backup, perlu buat baru');
            return true;
        }
        
        // Cari file backup terbaru
        let latestTimestamp = 0;
        let latestFile = null;
        
        for (const file of backupFiles) {
            const ts = getBackupTimestampFromFile(file);
            if (ts && ts > latestTimestamp) {
                latestTimestamp = ts;
                latestFile = file;
            }
        }
        
        if (!latestFile) {
            console.log('[BACKUP] Tidak bisa membaca timestamp, perlu buat baru');
            return true;
        }
        
        const now = moment().tz('Asia/Jakarta').valueOf();
        const timeDiff = now - latestTimestamp;
        const hoursPassed = timeDiff / (60 * 60 * 1000);
        
        console.log(`[BACKUP] Backup terakhir: ${latestFile}`);
        console.log(`[BACKUP] Waktu berlalu: ${hoursPassed.toFixed(2)} jam dari 8 jam target`);
        
        if (timeDiff >= BACKUP_INTERVAL) {
            console.log('[BACKUP] Sudah melewati 8 jam, perlu buat backup baru');
            return true;
        } else {
            const remainingHours = (BACKUP_INTERVAL - timeDiff) / (60 * 60 * 1000);
            console.log(`[BACKUP] Masih dalam cooldown, ${remainingHours.toFixed(2)} jam lagi backup berikutnya`);
            return false;
        }
    } catch (err) {
        console.error('[BACKUP] Error mengecek backup:', err.message);
        return true; // Jika error, buat backup baru saja
    }
}

// Fungsi utama membuat zip archive
async function createZipArchive() {
    try {
        const filePath = getBackupFilePath();
        const output = fs.createWriteStream(filePath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        return new Promise((resolve, reject) => {
            output.on('close', async () => {
                console.log(`[BACKUP] Berhasil mengompres ${archive.pointer()} total byte ke: ${filePath}`);
                resolve(filePath);
            });

            archive.on('error', (err) => {
                reject(err);
            });

            archive.pipe(output);

            const foldersToArchive = ['database', 'lib', 'image', 'RANDOM'];
            const filesToArchive = [
                'alpha.js', 'docker-compose.yml', 'package.json', 'Dockerfile',
                'install.sh', 'LICENSE', 'menunya.js', 'Procfile', 'mess.json',
                'panel.js', 'Procfile', 'replit.nix', 'settings.js', 'store.js'
            ];

            console.log('[BACKUP] Mulai mengompres file dan folder...');
            
            foldersToArchive.forEach((folder) => {
                if (fs.existsSync(folder)) {
                    archive.directory(folder, folder);
                    console.log(`[BACKUP] Folder ditambahkan: ${folder}`);
                } else {
                    console.log(`[BACKUP] Folder tidak ditemukan, skip: ${folder}`);
                }
            });

            filesToArchive.forEach((file) => {
                if (fs.existsSync(file)) {
                    archive.file(file, { name: file });
                    console.log(`[BACKUP] File ditambahkan: ${file}`);
                } else {
                    console.log(`[BACKUP] File tidak ditemukan, skip: ${file}`);
                }
            });

            archive.finalize();
        });
    } catch (err) {
        console.error('[BACKUP] Terjadi kesalahan saat membuat archive:', err);
        throw err;
    }
}

// Fungsi untuk mengirim backup ke owner
async function sendBackupToOwner(alpha, filePath) {
    try {
        // Format global.owner tanpa @s.whatsapp.net
        // Contoh: global.owner = ['6281234567890', '6280987654321']
        const owners = global.owner || [];
        
        if (owners.length === 0) {
            console.log('[BACKUP] Tidak ada owner yang ditentukan di global.owner');
            return false;
        }
        
        const fileData = fs.readFileSync(filePath);
        const fileName = path.basename(filePath);
        
        for (const owner of owners) {
            let ownerNumber = owner;
            // Jika owner adalah objek dengan key 'number'
            if (typeof owner === 'object' && owner.number) {
                ownerNumber = owner.number;
            }
            // Pastikan format nomor benar (tanpa @s.whatsapp.net)
            let formattedNumber = ownerNumber.toString().replace(/\D/g, '');
            if (!formattedNumber.endsWith('@s.whatsapp.net')) {
                formattedNumber = formattedNumber + '@s.whatsapp.net';
            }
            
            try {
                const messageOptions = {
                    document: fileData,
                    mimetype: 'application/zip',
                    fileName: fileName,
                    caption: `📦 *BACKUP BOT*\n\n📅 Tanggal: ${moment().tz('Asia/Jakarta').format('DD MMMM YYYY HH:mm:ss')}\n📁 Nama file: ${fileName}\n💾 Ukuran: ${(fileData.length / 1024 / 1024).toFixed(2)} MB\n\n✅ Backup otomatis periode 8 jam`
                };
                
                await alpha.sendMessage(formattedNumber, messageOptions);
                console.log(`[BACKUP] Backup terkirim ke owner: ${ownerNumber}`);
            } catch (err) {
                console.error(`[BACKUP] Gagal mengirim ke ${ownerNumber}:`, err.message);
            }
        }
        
        return true;
    } catch (err) {
        console.error('[BACKUP] Error mengirim backup:', err.message);
        return false;
    }
}

// Fungsi utama backup (create, kirim, cleanup)
async function performBackup(alpha) {
    const startTime = Date.now();
    console.log(`[BACKUP] ========== MEMULAI BACKUP ==========`);
    console.log(`[BACKUP] Waktu: ${moment().tz('Asia/Jakarta').format('DD MMMM YYYY HH:mm:ss')}`);
    
    try {
        // Buat archive zip
        const filePath = await createZipArchive();
        
        // Kirim ke owner
        const sent = await sendBackupToOwner(alpha, filePath);
        
        if (sent) {
            // Bersihkan file backup lama (hapus yang sudah melewati 8 jam)
            cleanupOldBackups();
            console.log(`[BACKUP] Backup selesai dalam ${(Date.now() - startTime) / 1000} detik`);
        } else {
            console.log('[BACKUP] Backup gagal dikirim, file tetap disimpan');
        }
        
        return sent;
    } catch (err) {
        console.error('[BACKUP] Error saat performBackup:', err);
        return false;
    }
}

// Fungsi utama untuk menjalankan monitor backup setiap 8 jam
let isBackupSchedulerRunning = false;
let backupInterval = null;

async function startAutoBackup(alpha) {
    if (isBackupSchedulerRunning) {
        console.log('[BACKUP] Scheduler sudah berjalan, skip...');
        return;
    }
    
    if (!alpha) {
        console.log('[BACKUP] Alpha instance tidak tersedia');
        return;
    }
    
    isBackupSchedulerRunning = true;
    console.log('[BACKUP] ========================================');
    console.log('[BACKUP] AUTO BACKUP SCHEDULER STARTED');
    console.log('[BACKUP] Interval: 8 jam sekali');
    console.log('[BACKUP] Folder backup: tmp/');
    console.log('[BACKUP] Format file: backup-DD-MMM-YYYY_HH-mm.zip');
    console.log('[BACKUP] Target: global.owner');
    console.log('[BACKUP] Waktu: Asia/Jakarta (WIB)');
    console.log('[BACKUP] ========================================');
    
    // Fungsi untuk cek dan jalankan backup
    const checkAndBackup = async () => {
        try {
            if (shouldCreateNewBackup()) {
                console.log('[BACKUP] 🔄 Memulai proses backup...');
                await performBackup(alpha);
            } else {
                // Log status setiap 1 jam saat tidak backup
                const now = moment().tz('Asia/Jakarta');
                if (now.minute() < 5) {
                    console.log(`[BACKUP] Menunggu jadwal berikutnya... (${now.format('HH:mm:ss')})`);
                }
            }
        } catch (err) {
            console.error('[BACKUP] Error dalam checkAndBackup:', err);
        }
    };
    
    // Jalankan pengecekan pertama kali
    console.log('[BACKUP] Melakukan pengecekan pertama...');
    await checkAndBackup();
    
    // Set interval pengecekan setiap 1 menit (untuk responsif)
    backupInterval = setInterval(checkAndBackup, 60 * 1000);
    
    console.log('[BACKUP] Scheduler berjalan, pengecekan setiap 1 menit');
}

// Fungsi untuk menghentikan auto backup
function stopAutoBackup() {
    if (backupInterval) {
        clearInterval(backupInterval);
        backupInterval = null;
    }
    isBackupSchedulerRunning = false;
    console.log('[BACKUP] Auto backup scheduler stopped');
}

// Auto-start jika alpha tersedia (untuk penggunaan langsung di file utama)
setTimeout(() => {
    if (typeof alpha !== 'undefined' && alpha && !isBackupSchedulerRunning) {
        console.log('[BACKUP] Auto-starting backup scheduler...');
        startAutoBackup(alpha);
    }
}, 60 * 60 * 1000);

    store.bind(alpha.ev)
    
    alpha.ev.on('messages.upsert', async chatUpdate => {
        //console.log(JSON.stringify(chatUpdate, undefined, 2))
        try {
        mek = chatUpdate.messages[0]
        if (!mek.message) return
        mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
        if (mek.key && mek.key.remoteJid === 'status@broadcast') return
        if (!alpha.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
        if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
        m = smsg(alpha, mek, store)
        require("./store")(alpha, m, chatUpdate, store, opengc, antilink, setpay, antiwame, antilink2, antiwame2, set_welcome_db, set_left_db, set_proses, set_done, set_open, set_close, sewa, _welcome, _left, db_respon_list)
        } catch (err) {
            console.log(err)
        }
    })
    
    alpha.ev.on('groups.update', async (anu) => {
    try {
        for (let x of anu) {
            const groupName = x.subject; // Capture the group name
            let message;

            if (x.announce == true) {
                if (isSetClose(x.id, set_close)) {
                    const closeMessage = await getTextSetClose(x.id, set_close);
                    message = closeMessage.replace(/@group/gi, groupName);
                } else {
                    message = `─────〔 *Close* 〕────\n\nGroup telah berhasil ditutup oleh admin, sekarang hanya admin yang dapat mengirim pesan ke grup.`;
                }
            } else if (x.announce == false) {
                if (isSetOpen(x.id, set_open)) {
                    const openMessage = await getTextSetOpen(x.id, set_open);
                    message = openMessage.replace(/@group/gi, groupName);
                } else {
                    message = `─────〔 *OPEN* 〕────\n\nGroup telah berhasil dibuka oleh admin, sekarang semua member grup ini dapat mengirim pesan.`;
                }
            } else if (x.restrict == true || x.restrict == false) {
                message = `─────〔 *Group Update* 〕────`;
            } else {
                message = `─────〔 *Update Name* 〕────\n\nAdmin telah mengganti nama grup menjadi *${groupName}*`
            }
        }
    } catch (err) {
        console.log(err);
    }
});
    
    store.bind(alpha.ev)
    alpha.ev.on('call', async (celled) => {
    	if (global.anticall) {
    	console.log(celled)
    for (let kopel of celled) {
    	if (kopel.isGroup == false) {
    	if (kopel.status == "offer") {
    	let nomer = await alpha.sendTextWithMentions(kopel.from, `*${alpha.user.name}* tidak bisa menerima panggilan ${kopel.isVideo ? `video` : `suara`}. Maaf @${kopel.from.split('@')[0]} kamu akan diblokir. Silahkan hubungi Owner membuka blok !`)
    alpha.sendContact(kopel.from, owner, nomer)
    await sleep(5000)
    alpha.updateBlockStatus(kopel.from, "block")
    }
    }
    }
    }
    })
    
    alpha.ev.on('group-participants.update', async (anu) => {
    const isWelcome = _welcome.includes(anu.id);
    const isLeft = _left.includes(anu.id);
    try {
        let metadata = await alpha.groupMetadata(anu.id);
        let participants = anu.participants;
        const groupName = metadata.subject;
        const groupDesc = metadata.desc;

        for (let num of participants) {
            const fkontaku = {
                key: {
                    participant: `0@s.whatsapp.net`,
                    ...(anu.id ? { remoteJid: `6283136505591-1614953337@g.us` } : {})
                },
                message: {
                    'contactMessage': {
                        'displayName': ``,
                        'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;,;;;\nFN:,\nitem1.TEL;waid=${num.split('@')[0]}:${num.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
                        'jpegThumbnail': pp_bot,
                        thumbnail: pp_bot,
                        sendEphemeral: true
                    }
                }
            };

            let ppuser, ppgroup;

            try {
                ppuser = await alpha.profilePictureUrl(num, 'image');
            } catch {
                ppuser = 'https://telegra.ph/file/c3f3d2c2548cbefef1604.jpg';
            }

            try {
                ppgroup = await alpha.profilePictureUrl(anu.id, 'image');
            } catch {
                ppgroup = 'https://telegra.ph/file/c3f3d2c2548cbefef1604.jpg';
            }

            if (anu.action === 'add' && (isWelcome || global.welcome)) {
    console.log(anu);
    if (isSetWelcome(anu.id, set_welcome_db)) {
        var get_teks_welcome = await getTextSetWelcome(anu.id, set_welcome_db);
        var replace_pesan = get_teks_welcome.replace(/@user/gi, `@${num.split('@')[0]}`);
        var full_pesan = replace_pesan.replace(/@group/gi, groupName).replace(/@desc/gi, groupDesc);
    } else {
    }
} else if (anu.action === 'remove' && (isLeft || global.left)) {
    console.log(anu);
    if (isSetLeft(anu.id, set_left_db)) {
        var get_teks_left = await getTextSetLeft(anu.id, set_left_db);
        var replace_pesan = get_teks_left.replace(/@user/gi, `@${num.split('@')[0]}`);
        var full_pesan = replace_pesan.replace(/@group/gi, groupName).replace(/@desc/gi, groupDesc);
    } else {
    }
} else if (anu.action === 'promote') {
}
        }
    } catch (err) {
        console.log(err);
    }
});
	
    // Setting
    alpha.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }
    
    alpha.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = alpha.decodeJid(contact.id)
            if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
        }
    })

    alpha.getName = (jid, withoutContact  = false) => {
        id = alpha.decodeJid(jid)
        withoutContact = alpha.withoutContact || withoutContact 
        let v
        if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
            v = store.contacts[id] || {}
            if (!(v.name || v.subject)) v = alpha.groupMetadata(id) || {}
            resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
        })
        else v = id === '0@s.whatsapp.net' ? {
            id,
            name: 'WhatsApp'
        } : id === alpha.decodeJid(alpha.user.id) ?
            alpha.user :
            (store.contacts[id] || {})
            return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    }
    
    alpha.sendContact = async (jid, kon, quoted = '', opts = {}) => {
	let list = []
	for (let i of kon) {
	    list.push({
	    	displayName: await alpha.getName(i + '@s.whatsapp.net'),
	    	vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await alpha.getName(i + '@s.whatsapp.net')}\nFN:${await alpha.getName(i + '@s.whatsapp.net')}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
	    })
	}
	alpha.sendMessage(jid, { contacts: { displayName: `${list.length} Kontak`, contacts: list }, ...opts }, { quoted })
    }
    
    alpha.public = true

    alpha.serializeM = (m) => smsg(alpha, m, store)

    alpha.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update	    
        if (connection === 'close') {
        let reason = new Boom(lastDisconnect?.error)?.output.statusCode
            if (reason === DisconnectReason.badSession) { console.log(`Bad Session File, Please Delete Session and Scan Again`); alpha.logout(); }
            else if (reason === DisconnectReason.connectionClosed) { console.log("Connection closed, reconnecting...."); Botstarted(); }
            else if (reason === DisconnectReason.connectionLost) { console.log("Connection Lost from Server, reconnecting..."); Botstarted(); }
            else if (reason === DisconnectReason.connectionReplaced) { console.log("Connection Replaced, Another New Session Opened, reconnecting..."); Botstarted(); }
            else if (reason === DisconnectReason.loggedOut) { console.log(`Device Logged Out, Please Scan Again And Run.`); alpha.logout(); }
            else if (reason === DisconnectReason.restartRequired) { console.log("Restart Required, Restarting..."); Botstarted(); }
            else if (reason === DisconnectReason.timedOut) { console.log("Connection TimedOut, Reconnecting..."); Botstarted(); }
            else if (reason === DisconnectReason.Multidevicemismatch) { console.log("Multi device mismatch, please scan again"); alpha.logout(); }
            else alpha.end(`Unknown DisconnectReason: ${reason}|${connection}`)
        } else if (connection === "open") {
        	console.log(chalk.hex('#00FFB7')('✅ ') + chalk.hex('#FF69B4')('Bot Sukses Connect To Server'));
        	console.log(chalk.hex('#00BFFF')('📱 Developer Number: ') + chalk.hex('#FFF5E1')('+6285691259261'));
        	console.log(chalk.hex('#00BFFF')('🌍 Developer Website: ') + chalk.hex('#FFF5E1')('https://dlyyzstore.vercel.app'));
        	console.log(chalk.hex('#FFF5E1')('📋 Untuk Melihat Tampilan Bot Silahkan Ketik ') + chalk.hex('#FF69B4')('.menu'));
        	console.log(chalk.hex('#00BFFF')('💻 Created By ') + chalk.hex('#FF69B4')('DlyyZ'));
        }
        if (update.connection === "open" || update.receivedPendingNotifications === "true") {
    await store.chats.all();

    console.log(
        chalk.hex('#00BFFF')('🔗 Connected to: ') +
        chalk.hex('#FFF5E1')(JSON.stringify(alpha.user, null, 2))
    );

    // Jika ingin kirim pesan otomatis ke nomor admin (opsional)
    // await alpha.sendMessage("77777777777@s.whatsapp.net", {
    //     text: "",
    //     contextInfo: { expiration: 86400 }
    // });
}

console.log(chalk.hex('#FF69B4')('📶 Connection Update: ') + chalk.hex('#FFF5E1')(JSON.stringify(update, null, 2)));
    })

    alpha.ev.on('creds.update', saveCreds)

  alpha.sendText = (jid, text, quoted = '', options) => alpha.sendMessage(jid, { text: text, ...options }, { quoted, ...options })

alpha.downloadMediaMessage = async (message) => {
      let mime = (message.msg || message).mimetype || ''
      let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
      const stream = await downloadContentFromMessage(message, messageType)
      let buffer = Buffer.from([])
      for await (const chunk of stream) {
         buffer = Buffer.concat([buffer, chunk])
      }

      return buffer
   }
   
alpha.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {

        let quoted = message.msg ? message.msg : message

        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(quoted, messageType)
        let buffer = Buffer.from([])
        for await(const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
	let type = await FileType.fromBuffer(buffer)
        trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
        // save to file
        await fs.writeFileSync(trueFileName, buffer)
        return trueFileName
    }
    alpha.sendImage = async (jid, path, caption = '', quoted = '', options) => {
    	let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
    return await alpha.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })
    }
    alpha.sendMedia = async (jid, path, fileName = '', caption = '', quoted = '', options = {}) => {
    	let types = await alpha.getFile(path, true)
    let { mime, ext, res, data, filename } = types
    if (res && res.status !== 200 || file.length <= 65536) {
    	try { throw { json: JSON.parse(file.toString()) } }
    catch (e) { if (e.json) throw e.json }
    }
    let type = '', mimetype = mime, pathFile = filename
    if (options.asDocument) type = 'document'
    if (options.asSticker || /webp/.test(mime)) {
    	let { writeExif } = require('./lib/exif')
    let media = { mimetype: mime, data }
    pathFile = await writeExif(media, { packname: options.packname ? options.packname : global.packname, author: options.author ? options.author : global.author, categories: options.categories ? options.categories : [] })
    await fs.promises.unlink(filename)
    type = 'sticker'
    mimetype = 'image/webp'
    }
    else if (/image/.test(mime)) type = 'image'
    else if (/video/.test(mime)) type = 'video'
    else if (/audio/.test(mime)) type = 'audio'
    else type = 'document'
    await alpha.sendMessage(jid, { [type]: { url: pathFile }, caption, mimetype, fileName, ...options }, { quoted, ...options })
    return fs.promises.unlink(pathFile)
    }
    
    alpha.getFile = async (PATH, returnAsFilename) => {
      let res, filename
      const data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,` [1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await fetch(PATH)).buffer() : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
      if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
      const type = await FileType.fromBuffer(data) || {
         mime: 'application/octet-stream',
         ext: '.bin'
      }
      if (data && returnAsFilename && !filename)(filename = path.join(__dirname, './media/' + new Date * 1 + '.' + type.ext), await fs.promises.writeFile(filename, data))
      return {
         res,
         filename,
         ...type,
         data,
         deleteFile() {
            return filename && fs.promises.unlink(filename)
         }
     }
     }
     
    alpha.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
    	let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
    let buffer
    if (options && (options.packname || options.author)) {
    	buffer = await writeExifVid(buff, options)
    } else {
    	buffer = await videoToWebp(buff)
    }
    
    await alpha.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
    return buffer
    }
    alpha.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
    	let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
    let buffer
    if (options && (options.packname || options.author)) {
    	buffer = await writeExifImg(buff, options)
    } else {
    	buffer = await imageToWebp(buff)
    }
    
    await alpha.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
    return buffer
    }
    
    alpha.sendMediaAsSticker = async (jid, path, quoted, options = {}) => {
    	let {
    	ext,
    mime,
    data
    } = await alpha.getFile(path)
    let media = {}
    let buffer
    media.data = data
    media.mimetype = mime
    if (options && (options.packname || options.author)) {
    	buffer = await writeExif(media, options)
    } else {
    	buffer = /image/.test(mime) ? await imageToWebp(data) : /video/.test(mime) ? await videoToWebp(data) : ""
    }
    await alpha.sendMessage(jid, {
    	sticker: {
    	url: buffer
    },
    ...options
    }, {
    	quoted
    })
    return buffer
    }
    
    alpha.sendFakeLink = (jid, text, salam, pushname, quoted) => alpha.sendMessage(jid, {
    	text: text,
    contextInfo: {
    	"externalAdReply": {
    	"title": `Selamat ${salam} ${pushname}`,
    "body": `© ${namaowner}`,
    "previewType": "PHOTO",
    "thumbnailUrl": ``,
    "thumbnail": pp_bot,
    "sourceUrl": fakelink
    }
    }
    }, {
    quoted : quoted
    })
    
    alpha.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
    	let type = await alpha.getFile(path, true)
    let {
    	res,
    data: file,
    filename: pathFile
    } = type
    if (res && res.status !== 200 || file.length <= 65536) {
    	try {
    	throw {
    	json: JSON.parse(file.toString())
    }
    }
    catch (e) {
    	if (e.json) throw e.json
    }
    }
    let opt = {
    	filename
    }
    if (quoted) opt.quoted = quoted
    if (!type) options.asDocument = true
    let mtype = '',
    mimetype = type.mime,
    convert
    if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker'
    else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image'
    else if (/video/.test(type.mime)) mtype = 'video'
    else if (/audio/.test(type.mime))(
    convert = await (ptt ? toPTT : toAudio)(file, type.ext),
    file = convert.data,
    pathFile = convert.filename,
    mtype = 'audio',
    mimetype = 'audio/ogg; codecs=opus'
    )
    else mtype = 'document'
    if (options.asDocument) mtype = 'document'
    
    delete options.asSticker
    delete options.asLocation
    delete options.asVideo
    delete options.asDocument
    delete options.asImage
    
    let message = {
    	...options,
    caption,
    ptt,
    [mtype]: {
    	url: pathFile
    },
    mimetype
    }
    let m
    try {
    	m = await alpha.sendMessage(jid, message, {
    	...opt,
    ...options
    })
    }
    catch (e) {
    	//console.error(e)
    m = null
    }
    finally {
    	if (!m) m = await alpha.sendMessage(jid, {
    	...message,
    [mtype]: file
    }, {
    	...opt,
    ...options
    })
    file = null
    return m
    }
    }
    
alpha.sendTextWithMentions = async (jid, text, quoted, options = {}) => alpha.sendMessage(jid, {
      text: text,
      mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'),
      ...options
   }, {
      quoted
   })

    return alpha
}

Botstarted()

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
})
