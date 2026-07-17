require('./settings')
require('./menunya')

const {
   default: WADefault,
   useMultiFileAuthState,
   DisconnectReason,
   generateForwardMessageContent,
   prepareWAMessageMedia,
   generateWAMessageFromContent,
   generateMessageID,
   downloadContentFromMessage,
   proto,
   makeInMemoryStore,
   jidDecode,
   makeCacheableSignalKeyStore,
   jidNormalizedUser,
   delay
} = require("@whiskeysockets/baileys")

const { baileys, child_process, cookie, FileType, ffmpeg, Jimp, jsobfus, PhoneNumber, process, syntaxerror, ytdl } = module
const cheerio = require('cheerio')
const fs = require('fs');
const equal = require('fast-deep-equal');
const path = require('path')
const os = require('os');
const nou = require('node-os-utils');
const speed = require('performance-now')
const util = require('util');
const chalk = require('chalk');
const axios = require('axios');
const moment = require('moment-timezone');
const ms = toMs = require('ms');
const FormData = require('form-data');
let { fromBuffer } = require('file-type');
const fetch = require('node-fetch');
const QRCode = require('qrcode');
const zlib = require('zlib');
const https = require("https")
// AFK \\
let _afk = JSON.parse(fs.readFileSync('./database/afk.json'));
const afk = require("./lib/afk");

const { smsg, fetchJson, getBuffer } = require('./lib/simple')

const {
  clockString,
  parseMention,
  formatp,
  format,
  capital,
  reSize,
  generateProfilePicture
} = require("./lib/myfunc");

let botStartTime = Date.now();

async function getGroupAdmins(participants){
        let admins = []
        for (let i of participants) {
            i.admin === "superadmin" ? admins.push(i.id) :  i.admin === "admin" ? admins.push(i.id) : ''
        } 
        return admins || []
}

// FUNCTION 

function hitungmundur(bulan, tanggal) {
            let from = new Date(`${bulan} ${tanggal}, 2023 00:00:00`).getTime();
            let now = Date.now();
            let distance = from - now;
            let days = Math.floor(distance / (1000 * 60 * 60 * 24));
            let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((distance % (1000 * 60)) / 1000);
            return days + "Hari " + hours + "Jam " + minutes + "Menit " + seconds + "Detik"
        }

function msToDate(mse) {
               temp = mse
               days = Math.floor(mse / (24 * 60 * 60 * 1000));
               daysms = mse % (24 * 60 * 60 * 1000);
               hours = Math.floor((daysms) / (60 * 60 * 1000));
               hoursms = mse % (60 * 60 * 1000);
               minutes = Math.floor((hoursms) / (60 * 1000));
               minutesms = mse % (60 * 1000);
               sec = Math.floor((minutesms) / (1000));
               return days + " Days " + hours + " Hours " + minutes + " Minutes";
            }
            
            function formatDuration(duration) {
    let seconds = Math.floor((duration / 1000) % 60)
    let minutes = Math.floor((duration / (1000 * 60)) % 60)
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
    return { hours, minutes, seconds }
}
            
            function toRupiah(angka) {
var saldo = '';
var angkarev = angka.toString().split('').reverse().join('');
for (var i = 0; i < angkarev.length; i++)
if (i % 3 == 0) saldo += angkarev.substr(i, 3) + '.';
return '' + saldo.split('', saldo.length - 1).reverse().join('');
}
const isUrl = (url) => {
    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
}

const sleep = async (ms) => {
	return new Promise(resolve => setTimeout(resolve, ms));
}

const getRandom = (ext) => {
	return `${Math.floor(Math.random() * 10000)}${ext}`
}

const startTime = Date.now();

const runtime = (start) => {
    const totalSeconds = Math.floor((Date.now() - start) / 1000);
    const d = Math.floor(totalSeconds / (3600 * 24));
    const h = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);

    return `${d > 0 ? d + "d " : ""}${h > 0 ? h + "h " : ""}${m > 0 ? m + "m " : ""}${s}s`;
};

const jsonformat = (string) => {
	return JSON.stringify(string, null, 2)
}

async function UploadDulu(medianya, options = {}) {
const { ext } = await fromBuffer(medianya) || options.ext
        var form = new FormData()
        form.append('file', medianya, 'tmp.'+ext)
        let jsonnya = await fetch('https://tenaja.zeeoneofc.repl.co/upload', {
                method: 'POST',
                body: form
        })
        .then((response) => response.json())
        return jsonnya
}

const tanggal = (numer) => {
	myMonths = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
				myDays = ['Minggu','Senin','Selasa','Rabu','Kamis','Jum’at','Sabtu']; 
				var tgl = new Date(numer);
				var day = tgl.getDate()
				bulan = tgl.getMonth()
				var thisDay = tgl.getDay(),
				thisDay = myDays[thisDay];
				var yy = tgl.getYear()
				var year = (yy < 1000) ? yy + 1900 : yy; 
				const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
				let d = new Date
				let locale = 'id'
				let gmt = new Date(0).getTime() - new Date('1 January 1970').getTime()
				let weton = ['Pahing', 'Pon','Wage','Kliwon','Legi'][Math.floor(((d * 1) + gmt) / 84600000) % 5]
				
				return`${thisDay}, ${day} - ${myMonths[bulan]} - ${year}`
}

module.exports = alpha = async (alpha, m, chatUpdate, store, opengc, antilink, antiwame, setpay, antilink2, antiwame2, set_welcome_db, set_left_db, set_proses, set_done, set_open, set_close, sewa, _welcome, _left, db_respon_list, ) => {
    try {
        var body = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.mtype === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : '' //omzee
        var budy = (typeof m.text == 'string' ? m.text : '')
        var prefix = prefa ? /^[Â°â€¢Ï€Ã·Ã—Â¶âˆ†Â£Â¢â‚¬Â¥Â®â„¢+âœ“_=|~!?@#$%^&.Â©^]/gi.test(body) ? body.match(/^[Â°â€¢Ï€Ã·Ã—Â¶âˆ†Â£Â¢â‚¬Â¥Â®â„¢+âœ“_=|~!?@#$%^&.Â©^]/gi)[0] : "" : prefa ?? global.prefix
        const isCmd = body.startsWith(prefix)
        const command = body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase()
        const args = body.trim().split(/ +/).slice(1)
        const pushname = m.pushName || "No Name"
        const senderNumber = m.sender.split('@')[0]
        const botNumber = await alpha.decodeJid(alpha.user.id)
        const owners = Array.isArray(global.owner) ? global.owner : [];
		const isCreator = [`${global.owner}@s.whatsapp.net`, botNumber, ...owners]
    	.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
        .includes(m.sender);
        const text = q = args.join(" ")
        const salam = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a')
        const quoted = m.quoted ? m.quoted : m
        const mime = (quoted.msg || quoted).mimetype || ''
        const isMedia = /image|video|sticker|audio/.test(mime)
        const groupMetadata = m.isGroup ? await alpha.groupMetadata(m.chat).catch(e => {}) : ''
        const groupName = m.isGroup ? groupMetadata?.subject || '' : ''
        const participants = m.isGroup ? await groupMetadata?.participants || '' : ''
        const from = mek.key.remoteJid
        const groupAdmins = m.isGroup ? await getGroupAdmins(participants) : ''
        const messagesD = body.slice(0).trim().split(/ +/).shift().toLowerCase()
      	const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false
      	const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false
const isWelcome = _welcome.includes(m.chat)
const isLeft = _left.includes(m.chat)
        const time = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('HH:mm:ss z')
const isAfkOn = afk.checkAfkUser(m.sender, _afk)

const reply = m.reply;

const fkontak = { key: {fromMe: false,participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { 'contactMessage': { 'displayName': `Gejet Store\n`, 'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;alphaBot,;;;\nFN:${pushname},\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`, 'jpegThumbnail': { url: 'https://telegra.ph/file/33e79ab21ec0446cc3e4f.jpg' }}}}

function parseMention(text = '') {
	return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
}

async function getGcName(groupID) {
            try {
                let data_name = await alpha.groupMetadata(groupID)
                return data_name.subject
            } catch (err) {
                return '-'
            }
        }

if (m.message) {
  const time = new Date().toLocaleTimeString('id-ID', { hour12: false });
  const isGroup = m.isGroup ? pushname : 'Chat Pribadi';

  // Header dengan efek "branding"
  console.log(
    chalk.bgHex('#ff00ff').black.bold(' [ Tiaa ] '),
    chalk.hex('#00ffff').bold(time) + '\n'
  );

  // Konten utama dengan warna mencolok
  console.log(
    chalk.hex('#ff00ff')('text   : ') + chalk.whiteBright.bold(budy || m.mtype)
  );
  console.log(
    chalk.hex('#a64dff')('from   : ') + chalk.cyanBright.bold(pushname)
  );
  console.log(
    chalk.hex('#a64dff')('number : ') + chalk.greenBright.bold(m.sender)
  );
  console.log(
  chalk.hex('#a64dff')('in     : ') + chalk.yellowBright.bold(groupName ? groupName : 'Private Chat')
);
  console.log(
  chalk.hex('#ff00ff')('length : ') + chalk.white.bold((args?.join(' ') || '').length)
);
  console.log(
    chalk.hex('#ff00ff')('jid    : ') + chalk.gray.bold(m.chat) + '\n'
  );
}
        //TIME
        const xtime = moment.tz('Asia/Jakarta').format('HH:mm:ss')
        const xdate = moment.tz('Asia/Jakarta').format('DD,MM,YYYY')
        const time2 = moment().tz('Asia/Jakarta').format('HH:mm:ss')  
         if(time2 < "23:59:00"){
var jer = `Good Night `
 }
 if(time2 < "19:00:00"){
var jer = `Good Evening `
 }
 if(time2 < "18:00:00"){
var jer = `Good Evening `
 }
 if(time2 < "15:00:00"){
var jer = `Good Afternoon `
 }
 if(time2 < "11:00:00"){
var jer = `Good Morning `
 }
 if(time2 < "05:00:00"){
var jer = `Good Morning `
 } 

        //autotyper all
        if (global.autoTyping) { if (m.chat) { alpha.sendPresenceUpdate('composing', m.chat) }
        }
        
        try {
        	ppuser = await alpha.profilePictureUrl(num, 'image')
        } catch {
        	ppuser = 'https://telegra.ph/file/c3f3d2c2548cbefef1604.jpg'
        }
        
        jerofcppuser = await getBuffer(ppuser)
        
        if (command) {
        if (!m.isGroup && !isCreator && global.onlygrub) {
       	return await alpha.sendContact(m.chat, global.owner, m)
          }
        } 

		const kontak = {
			key: {
				participant: `0@s.whatsapp.net`,
				...(from ? {
					remoteJid: `6285691259261-1614953337@g.us`
					} : {})
				},
				message: {
					'contactMessage': {
						'displayName': `${pushname}`,
						'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;${pushname},;;;\nFN:${pushname},\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
						'jpegThumbnail': pp_bot,
						thumbnail: pp_bot,
						sendEphemeral: true
					}
				}
			}
		const reSize = async(buffer, ukur1, ukur2) => {
             return new Promise(async(resolve, reject) => {
             let jimp = require('jimp')
             var baper = await jimp.read(buffer);
             var ab = await baper.resize(ukur1, ukur2).getBufferAsync(jimp.MIME_JPEG)
             resolve(ab)
             })
             }
             // Auto Read & Presence Online
		if (!m.key.fromMe && global.autoread){
        const readkey = {
                remoteJid: m.chat,
                id: m.key.id, 
                participant: m.isGroup ? m.key.participant : undefined 
            }            
            await alpha.readMessages([readkey]);
}
            
        alpha.sendPresenceUpdate('available', m.chat)
// Auto Block +212
        if (m.sender.startsWith('212') && global.autoblok212 === true) {
            return alpha.updateBlockStatus(m.sender, 'block')
        }
        if (m.isGroup && !m.key.fromMe) {
let mentionUser = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])]
for (let ment of mentionUser) {
if (afk.checkAfkUser(ment, _afk)) {
let getId2 = afk.getAfkId(ment, _afk)
let getReason2 = afk.getAfkReason(getId2, _afk)
let getTimee = Date.now() - afk.getAfkTime(getId2, _afk)
let heheh2 = formatDuration(getTimee)
reply(`Jangan tag, dia sedang afk\n\n*Reason :* ${getReason2}\n*Sejak :* ${heheh2.hours} jam, ${heheh2.minutes} menit, ${heheh2.seconds} detik yg lalu\n`)
}
}
if (afk.checkAfkUser(m.sender, _afk)) {
let getId = afk.getAfkId(m.sender, _afk)
let getReason = afk.getAfkReason(getId, _afk)
let getTimee = Date.now() - afk.getAfkTime(getId, _afk)
let heheh = formatDuration(getTimee)
_afk.splice(afk.getAfkPosition(m.sender, _afk), 1)
fs.writeFileSync('./database/afk.json', JSON.stringify(_afk))
alpha.sendTextWithMentions(m.chat, `@${m.sender.split('@')[0]} telah kembali dari afk\n\n*Reason :* ${getReason}\n*Selama :* ${heheh.hours} jam ${heheh.minutes} menit ${heheh.seconds} detik\n`, m)
}
}

async function sendConfirmationRequest5(alpha, m, serviceDetails) {
    try {
        const sentMsg = await alpha.sendMessage(m.chat, {
            text: serviceDetails + '\n\n_Balas pesan ini dengan *Y* untuk melanjutkan, atau *N* untuk membatalkan._'
        }, { quoted: m });

        return sentMsg;
    } catch (error) {
        console.error("Gagal mengirim pesan konfirmasi:", error);
        return null;
    }
}
        

// Contoh penggunaan:
// getStockGAG2().then(console.log).catch(console.error);

/*async function UploadImg(buffer) {
  const { ext } = await fromBuffer(buffer);
  let form = new FormData();
  form.append('file', buffer, 'tmp.' + ext);

  const response = await fetch("https://widipe.com/api/upload.php", {
    method: "POST",
    headers: {
      'accept': 'application/json',
      // Content-Type diatur secara otomatis oleh form-data
    },
    body: form,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to upload file');
  }

  return data.result.url;
}*/

// CASE START //
switch(command) {
case "ht":
case "h":
case "hidetag": {
    if (!m.isGroup) return reply("❌ Fitur Khusus Grup");
    if (!isCreator && !m.isAdmin) return reply("❌ Fitur Khusus Admin Grup");
    
    try {
        // Ambil metadata grup
        const groupMetadata = await alpha.groupMetadata(m.chat);
        
        if (!groupMetadata || !groupMetadata.participants) {
            return reply("❌ Gagal mengambil data anggota grup!");
        }
        
        // Ambil semua member ID
        let member = groupMetadata.participants.map(v => v.id);
        let teks = text || (m.quoted && m.quoted.text) || "⚠️ *PEMBERITAHUAN* ⚠️\n\nHallo guys!";
        
        await alpha.sendMessage(m.chat, { 
            text: teks, 
            mentions: member 
        }, { quoted: m });
        
    } catch (error) {
        console.error("Error in hidetag:", error);
        reply("❌ Terjadi kesalahan saat mengirim pesan.");
    }
}
break;
case 'addsaldo': {
    if (!isCreator) return reply("Fitur Khusus Owner");
    if (!text) return reply('Usage: .addsaldo <amount> [@user/reply]\n\nExample: .addsaldo 1000 @user\nExample: .addsaldo 10k @user');

    const args = m.text.split(" ");
    let amountText = args[1];
    let target = args[2] 
        ? args[2].match(/^\d+$/) 
            ? args[2] + "@s.whatsapp.net" 
            : m.mentionedJid[0]
        : m.quoted 
            ? m.quoted.sender 
            : null;

    if (!amountText) return reply('Please specify the amount to add!');
    if (!target) return reply('Please mention or reply to the user!');

    let amount = parseFloat(amountText.toLowerCase().replace('k', '000').replace(/[.,]/g, ''));
    if (isNaN(amount) || amount <= 0) return reply('Invalid amount!');

    try {
        const { addSaldo, formatRupiah } = require('./lib/functionSaldo.js');
        const result = await addSaldo(target, amount);
        
        if (result.success) {
            alpha.sendMessage(m.chat, { text: `✅ *Add Saldo Success*\n\n👤 User: @${target.split('@')[0]}\n💰 Amount: ${formatRupiah(amount)}\n💵 Total Saldo: ${formatRupiah(result.newSaldo)}\n\n© ${global.namabot}`, mentions: [target] }, { quoted: m })
        } else {
            reply(`❌ Failed to add saldo: ${result.message}`);
        }
    } catch (error) {
        console.error('Error in addsaldo case:', error);
        reply('An error occurred while adding saldo.');
    }
}
break

case 'daftar': {
    if (!text) return reply('Usage: .daftar <name>\n\nExample: .daftar John Doe');
    
    const name = text.trim();
    const userId = m.sender;
    
    try {
        const { registerUserSaldo, formatRupiah, isNameExists, isUserExists } = require('./lib/functionSaldo.js');
        
        // Check if user is already registered
        const userExists = await isUserExists(userId);
        if (userExists) {
            return reply(`❌ *Registration Failed*\n\nYou are already registered!\n\nUse .myprofile to view your account or .help for other commands.`);
        }
        
        // Check if name is already taken
        const nameExists = await isNameExists(name);
        if (nameExists) {
            return reply(`❌ *Registration Failed*\n\nThe name "${name}" is already taken. Please use a different name.\n\nExample: .daftar ${name}_${Math.floor(Math.random() * 1000)}`);
        }
        
        const result = await registerUserSaldo(userId, name);
        
        if (result.success) {
            alpha.sendMessage(m.chat, { text: `✅ *Registration Successful*\n\n👤 Name: ${name}\n📱 Number: @${userId.split('@')[0]}\n💰 Initial Saldo: ${formatRupiah(result.saldo)}\n\nWelcome to ${global.namabot}!`, mentions: [userId] }, { quoted: m })
        } else {
            reply(`❌ Registration failed: ${result.message}`);
        }
    } catch (error) {
        console.error('Error in daftar case:', error);
        reply('An error occurred during registration.');
    }
}
break

case 'delsaldo': {
    if (!isCreator) return reply("Fitur Khusus Owner");
    
    const args = m.text.split(" ");
    let target = args[1] 
        ? args[1].match(/^\d+$/) 
            ? args[1] + "@s.whatsapp.net" 
            : m.mentionedJid[0]
        : m.quoted 
            ? m.quoted.sender 
            : null;
    
    if (!target) return reply('Please mention or reply to the user to delete their saldo!');
    
    try {
        const { deleteSaldo, formatRupiah } = require('./lib/functionSaldo.js');
        const result = await deleteSaldo(target);
        
        if (result.success) {
            alpha.sendMessage(m.chat, { text: `🗑️ *Delete Saldo Success*\n\n👤 User: @${target.split('@')[0]}\n💵 Previous Saldo: ${formatRupiah(result.previousSaldo)}\n💰 Current Saldo: ${formatRupiah(0)}\n\nSaldo has been reset to 0!`, mentions: [target] }, { quoted: m })
        } else {
            reply(`❌ Failed to delete saldo: ${result.message}`);
        }
    } catch (error) {
        console.error('Error in delsaldo case:', error);
        reply('An error occurred while deleting saldo.');
    }
}
break

case 'minsaldo': {
    if (!isCreator) return reply("Fitur Khusus Owner");
    if (!text) return reply('Usage: .minsaldo <amount> [@user/reply]\n\nExample: .minsaldo 1000 @user\nExample: .minsaldo 5k @user');
    
    const args = m.text.split(" ");
    let amountText = args[1];
    let target = args[2] 
        ? args[2].match(/^\d+$/) 
            ? args[2] + "@s.whatsapp.net" 
            : m.mentionedJid[0]
        : m.quoted 
            ? m.quoted.sender 
            : null;
    
    if (!amountText) return reply('Please specify the amount to subtract!');
    if (!target) return reply('Please mention or reply to the user!');
    
    let amount = parseFloat(amountText.toLowerCase().replace('k', '000').replace(/[.,]/g, ''));
    if (isNaN(amount) || amount <= 0) return reply('Invalid amount!');
    
    try {
        const { minSaldo, formatRupiah } = require('./lib/functionSaldo.js');
        const result = await minSaldo(target, amount);
        
        if (result.success) {
            alpha.sendMessage(m.chat, { text: `➖ *Minus Saldo Success*\n\n👤 User: @${target.split('@')[0]}\n💰 Amount Deducted: ${formatRupiah(amount)}\n💵 Remaining Saldo: ${formatRupiah(result.newSaldo)}\n\n© ${global.namabot}`, mentions: [target] }, { quoted: m })
        } else {
            reply(`❌ Failed to subtract saldo: ${result.message}`);
        }
    } catch (error) {
        console.error('Error in minsaldo case:', error);
        reply('An error occurred while subtracting saldo.');
    }
}
break

case 'ceksaldo': {
    let target = m.mentionedJid[0] || m.quoted?.sender || m.sender;
	let numberOnly = target.replace('@s.whatsapp.net', '');
    
    try {
        const { getSaldo, formatRupiah, getUserInfoSaldo } = require('./lib/functionSaldo.js');
        const userInfo = await getUserInfoSaldo(target);
        const saldo = await getSaldo(target);
        
        if (userInfo) {
            alpha.sendMessage(
    m.chat, 
    { 
        text: `💰 *Saldo Check*\n\n👤 Name: ${userInfo.name}\n📱 Number: @${numberOnly}\n💵 Saldo: ${formatRupiah(saldo)}\n📅 Registered: ${new Date(userInfo.registeredAt).toLocaleString()}\n\n© ${global.namabot}`,
        mentions: [target]
    }, 
    { 
        quoted: m 
    }
)
        } else {
            reply(`❌ User not registered! Use .daftar <name> to register first.`);
        }
    } catch (error) {
        console.error('Error in ceksaldo case:', error);
        reply('An error occurred while checking saldo.');
    }
}
break

case 'sendam': {
    if (!text) return reply('Usage: .sendam <email>\n\nExample: .sendam example@gmail.com');
    
    const email = text.trim();
    // Simple email validation
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return reply('❌ Invalid email format! Please enter a valid email address.');
    }
    
    try {
        const { 
            sendVerificationEmailAlightMotion, 
            saveEmailAlightMotion,
            isEmailPendingAlightMotion,
            hasPendingVerificationAlightMotion
        } = require('./lib/functionAlightMotion.js');
        
        // Check if user already has a pending verification
        const hasPending = await hasPendingVerificationAlightMotion(m.sender);
        if (hasPending) {
            return reply('⚠️ *You already have a pending verification!*\n\nOnly one pending verification allowed per user.\n\n📌 Options:\n• Use .verifam <link> to verify\n• Use .cancel to cancel the pending request\n\nThen you can request a new verification email.');
        }
        
        // Check if email is already pending by someone else
        const isPending = await isEmailPendingAlightMotion(email);
        if (isPending) {
            return reply('⚠️ This email is already pending verification by another user!\n\nPlease use a different email address.');
        }
        
        // Send verification email
        const result = await sendVerificationEmailAlightMotion(email);
        
        if (result.status) {
            // Save email to database
            const saveResult = await saveEmailAlightMotion(m.sender, email);
            
            if (saveResult.success) {
                reply(`✅ *Verification Email Sent*\n\n📧 Email: ${email}\n📬 Status: ${result.message}\n💰 Price: FREE\n\n📝 Please check your email (including spam folder) and use:\n.verifam <link>\n\nto verify your account.\n\n⚠️ *Note:* Only one pending verification allowed per user.\nTo cancel: .cancel\n\n© ${global.namabot}`);
            } else {
                reply(`❌ ${saveResult.message}`);
            }
        } else {
            reply(`❌ Failed to send verification email: ${result.message}`);
        }
    } catch (error) {
        console.error('Error in sendam case:', error);
        reply('An error occurred while sending verification email.');
    }
}
break

case 'verifam': {
    if (!text) return reply('Usage: .verifam <link>\n\nExample: .verifam https://alightcreative.page.link/?link=...');
    
    const link = text.trim();
    
    try {
        const { getSaldo, minSaldo, addSaldo, formatRupiah, getUserRole, getHargaByRole } = require('./lib/functionSaldo.js');
        const { 
            verifyLinkAlightMotion, 
            saveVerificationAlightMotion,
            getPendingEmailForUserAlightMotion,
            hasPendingVerificationAlightMotion
        } = require('./lib/functionAlightMotion.js');
        
        // Check user registration
        const userSaldo = await getSaldo(m.sender);
        if (!userSaldo && userSaldo !== 0) {
            return reply('❌ You are not registered! Use .daftar <name> first.');
        }
        
        // Get user role and price
        const userRole = await getUserRole(m.sender) || 'member';
        const hargaTiaa = await getHargaByRole(m.sender, 'Tiaa');
        const roleEmoji = userRole === 'reseller' ? '⭐' : '👤';
        const roleText = userRole === 'reseller' ? 'RESELLER' : 'MEMBER';
        
        // Check if user has pending verification
        const hasPending = await hasPendingVerificationAlightMotion(m.sender);
        if (!hasPending) {
            return reply('❌ No pending verification found.\n\nPlease use .sendam <email> first to request a verification link.\n\n📝 Only one pending verification allowed per user.');
        }
        
        // Check balance with role-based price
        if (userSaldo < hargaTiaa) {
            return reply(`❌ Insufficient balance!\n\n${roleEmoji} Role: ${roleText}\n💰 Your Balance: ${formatRupiah(userSaldo)}\n💵 Required: ${formatRupiah(hargaTiaa)}\n\nUse .addsaldo to add balance.`);
        }
        
        // Get pending email (only one)
        const pendingData = await getPendingEmailForUserAlightMotion(m.sender);
        if (!pendingData) {
            return reply('❌ No pending verification found. Please use .sendam first to request a verification link.');
        }
        
        const pendingEmail = pendingData.email;
        
        // Deduct balance with role-based price
        const deductResult = await minSaldo(m.sender, hargaTiaa);
        if (!deductResult.success) {
            return reply(`❌ Failed to process payment: ${deductResult.message}`);
        }
        
        await reply(`⏳ Verifying your link...\n${roleEmoji} Role: ${roleText}\n📧 Email: ${pendingEmail}\n💰 Paid: ${formatRupiah(hargaTiaa)}\n\nPlease wait...`);
        
        // Verify link
        const result = await verifyLinkAlightMotion(pendingEmail, link);
        
        if (result.status) {
            // Save verification to database with role and price
            await saveVerificationAlightMotion(pendingEmail, result.data.duration, m.sender, hargaTiaa, userRole);
            
            const successMessage = 
`✅ *Verification Successful* ✅

${roleEmoji} Role: ${roleText}
📧 Email: ${result.data.email}
⏱️ Duration: ${result.data.duration}
💰 Paid: ${formatRupiah(hargaTiaa)}
💵 Remaining Balance: ${formatRupiah(deductResult.newSaldo)}

Your Alight Motion premium account is now active!

© ${global.namabot}`;
            
            reply(successMessage);
        } else {
            // Refund if verification failed
            await addSaldo(m.sender, hargaTiaa);
            
            const failMessage = 
`❌ *Verification Failed* ❌

${roleEmoji} Role: ${roleText}
${result.message}

💰 Your balance has been refunded (${formatRupiah(hargaTiaa)}).

Please try again with a valid link.
If you want to cancel, use .cancel

© ${global.namabot}`;
            
            reply(failMessage);
        }
    } catch (error) {
        console.error('Error in verifam case:', error);
        reply('An error occurred during verification.');
    }
}
break;

case 'bulkam': {
    if (!text) return reply('Usage: .bulkam <amount>\n\nExample: .bulkam 2\nExample: .bulkam 10');
    
    const amount = parseInt(text);
    if (isNaN(amount) || amount <= 0) return reply('Please enter a valid amount!');
    if (amount < 1 || amount > 100) {
        return reply('❌ Amount must be between 1 - 100');
    }
    
    try {
        const { getSaldo, minSaldo, addSaldo, formatRupiah, getUserRole, getHargaByRole } = require('./lib/functionSaldo.js');
        const { 
            createBulkAccountsAlightMotion, 
            saveBulkAccountsAlightMotion 
        } = require('./lib/functionAlightMotion.js');
        const fs = require('fs');
        const path = require('path');
        
        // Check user registration
        const userSaldo = await getSaldo(m.sender);
        if (userSaldo === null || userSaldo === undefined) {
            return reply('❌ You are not registered! Use .daftar <name> first.');
        }
        
        // Get user role and price
        const userRole = await getUserRole(m.sender) || 'member';
        const hargaBulk = await getHargaByRole(m.sender, 'bulk');
        const totalPrice = amount * hargaBulk;
        const roleEmoji = userRole === 'reseller' ? '⭐' : '👤';
        const roleText = userRole === 'reseller' ? 'RESELLER' : 'MEMBER';
        
        // Check balance with role-based price
        if (userSaldo < totalPrice) {
            return reply(`❌ Insufficient balance!\n\n${roleEmoji} Role: ${roleText}\n💰 Your Balance: ${formatRupiah(userSaldo)}\n💵 Required: ${formatRupiah(totalPrice)} (${amount} accounts × ${formatRupiah(hargaBulk)})\n\nUse .addsaldo to add balance.`);
        }
        
        // Deduct full amount first
        const deductResult = await minSaldo(m.sender, totalPrice);
        if (!deductResult.success) {
            return reply(`❌ Failed to process payment: ${deductResult.message}`);
        }
        
        await reply(`⏳ Processing your request for ${amount} account(s)...\n${roleEmoji} Role: ${roleText}\n💰 Deducted: ${formatRupiah(totalPrice)} (${formatRupiah(hargaBulk)}/account)\n\nPlease wait, this may take a few moments...`);
        
        // Create bulk accounts
        const result = await createBulkAccountsAlightMotion(amount);
        
        if (result.status) {
            // Calculate refund for failed accounts
            const failedCount = result.data.failed_count;
            const successCount = result.data.success_count;
            const refundAmount = failedCount * hargaBulk;
            const finalPrice = totalPrice - refundAmount;
            
            // Refund if there are failed accounts
            if (refundAmount > 0) {
                await addSaldo(m.sender, refundAmount);
            }
            
            // Create text file content
            let fileContent = `==========================================\n`;
            fileContent += `BULK ALIGHT MOTION PREMIUM\n`;
            fileContent += `         EMAIL GENERATOR RESULTS\n`;
            fileContent += `==========================================\n\n`;
            fileContent += `📊 ORDER SUMMARY:\n`;
            fileContent += `──────────────────────────────────────────\n`;
            fileContent += `${roleEmoji} Role: ${roleText}\n`;
            fileContent += `• Requested: ${amount} account(s)\n`;
            fileContent += `• Success: ${successCount} account(s)\n`;
            fileContent += `• Failed: ${failedCount} account(s)\n`;
            fileContent += `• Price per account: ${formatRupiah(hargaBulk)}\n`;
            fileContent += `• Total paid: ${formatRupiah(totalPrice)}\n`;
            if (failedCount > 0) {
                fileContent += `• Refund: ${formatRupiah(refundAmount)}\n`;
                fileContent += `• Final price: ${formatRupiah(finalPrice)}\n`;
            }
            fileContent += `──────────────────────────────────────────\n\n`;
            
            fileContent += `📧 ACCOUNT DETAILS:\n`;
            fileContent += `──────────────────────────────────────────\n`;
            result.data.accounts.forEach((account, index) => {
                fileContent += `${index + 1}. ${account.email}\n`;
                fileContent += `   Package: ${account.package}\n`;
                fileContent += `   Duration: ${account.duration}\n\n`;
            });
            fileContent += `──────────────────────────────────────────\n\n`;
            
            fileContent += `🔑 HOW TO ACCESS:\n`;
            fileContent += `──────────────────────────────────────────\n`;
            fileContent += `Visit: generator.email/\n`;
            fileContent += `Example: generator.email/email@example.com\n\n`;
            fileContent += `Use any of the emails above to access premium features.\n\n`;          
            fileContent += `📅 Generated on: ${new Date().toLocaleString()}\n`;
            fileContent += `© ${global.namabot}\n`;
            fileContent += `==========================================\n`;
            
            // Create temp file
            const fileName = `Tiaa_bulk_am_${Date.now()}.txt`;
            const filePath = path.join('./tmp', fileName);
            
            // Ensure tmp directory exists
            if (!fs.existsSync('./tmp')) {
                fs.mkdirSync('./tmp', { recursive: true });
            }
            
            // Write file
            fs.writeFileSync(filePath, fileContent, 'utf8');
            
            // Send file
            await alpha.sendMessage(m.sender, {
                document: fs.readFileSync(filePath),
                mimetype: 'text/plain',
                fileName: `AlightMotion_Bulk_${amount}_Accounts.txt`
            }, { quoted: m });
            
            // Send summary message
            const finalBalance = await getSaldo(m.sender);
            let summaryMessage = `✅ *Bulk Accounts Created Successfully*\n\n`;
            summaryMessage += `${roleEmoji} Role: ${roleText}\n`;
            summaryMessage += `📊 Summary:\n`;
            summaryMessage += `• Requested: ${amount} account(s)\n`;
            summaryMessage += `• Success: ${successCount} account(s)\n`;
            summaryMessage += `• Failed: ${failedCount} account(s)\n`;
            summaryMessage += `• Price per account: ${formatRupiah(hargaBulk)}\n`;
            if (failedCount > 0) {
                summaryMessage += `• Refund: ${formatRupiah(refundAmount)}\n`;
            }
            summaryMessage += `\n📁 File with all account details has been sent above.\n`;
            summaryMessage += `💵 Final Balance: ${formatRupiah(finalBalance)}\n\n`;
            summaryMessage += `© ${global.namabot}`;
            
            reply(summaryMessage);
            
            // Delete file after sending
            setTimeout(() => {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }, 300000);
            
            // Save bulk purchase to database with role and price
            await saveBulkAccountsAlightMotion(m.sender, result.data.accounts, successCount, failedCount, amount, userRole, hargaBulk);
            
        } else {
            // Refund full amount if completely failed
            await addSaldo(m.sender, totalPrice);
            reply(`❌ Failed to create bulk accounts: ${result.message}\n\n💰 Your balance has been fully refunded (${formatRupiah(totalPrice)}).\n\nPlease try again later.`);
        }
    } catch (error) {
        console.error('Error in bulkam case:', error);
        reply('An error occurred while creating bulk accounts.');
    }
}
break;

case 'cancel': {
    try {
        const { 
            cancelPendingAlightMotion,
            hasPendingVerificationAlightMotion
        } = require('./lib/functionAlightMotion.js');
        
        // Check if user has pending verification
        const hasPending = await hasPendingVerificationAlightMotion(m.sender);
        
        if (!hasPending) {
            return reply('❌ No pending verification found to cancel.\n\nUse .sendam to request a verification link first.');
        }
        
        const result = await cancelPendingAlightMotion(m.sender);
        
        if (result.success && result.email) {
            reply(`🗑️ *Pending Verification Cancelled*\n\n📧 Email: ${result.email}\n📊 Status: Cancelled\n\nYou can now request a new verification link using .sendam\n\n© ${global.namabot}`);
        } else {
            reply(`❌ Failed to cancel pending verification: ${result.message}`);
        }
    } catch (error) {
        console.error('Error in cancel case:', error);
        reply('An error occurred while cancelling pending verification.');
    }
}
break

case 'cekhistory': {
    if (!isCreator) return reply("Fitur Khusus Owner");
    
    try {
        const { getUserHistoryAlightMotion } = require('./lib/functionAlightMotion.js');
        const history = await getUserHistoryAlightMotion(m.sender);
        
        if (!history || history.length === 0) {
            return reply('No transaction history found.');
        }
        
        let message = `📋 *Your Alight Motion Transaction History*\n\n`;
        
        // Show last 10 transactions
        const lastTransactions = history.slice(-10).reverse();
        
        lastTransactions.forEach((item, index) => {
            const date = new Date(item.timestamp).toLocaleString();
            
            if (item.type === 'verification') {
                message += `${index + 1}. *Premium Verification*\n`;
                message += `   📧 Email: ${item.email}\n`;
                message += `   ⏱️ Duration: ${item.duration}\n`;
                message += `   🕐 ${date}\n`;
                message += `   ✅ Status: ${item.status}\n\n`;
            } else if (item.type === 'bulk') {
                message += `${index + 1}. *Bulk Purchase*\n`;
                message += `   📊 ${item.successCount}/${item.totalRequested} accounts\n`;
                message += `   📧 ${item.accounts.length} accounts created\n`;
                message += `   🕐 ${date}\n\n`;
            } else if (item.type === 'cancel') {
                message += `${index + 1}. *Cancelled Verification*\n`;
                message += `   📧 Email: ${item.email}\n`;
                message += `   🕐 ${date}\n\n`;
            }
        });
        
        message += `\n📌 Total Transactions: ${history.length}\n`;
        message += `© ${global.namabot}`;
        
        reply(message);
    } catch (error) {
        console.error('Error in cekhistory case:', error);
        reply('An error occurred while checking history.');
    }
}
break

case 'setrole': {
    // Cek owner/admin
    const isOwner = m.sender === global.ownerNumber + '@s.whatsapp.net';
    const groupMetadata = m.isGroup ? await alpha.groupMetadata(m.chat) : null;
    const isAdmin = groupMetadata ? groupMetadata.participants.find(p => p.id === m.sender)?.admin !== null : false;
    
    if (!isOwner && !isAdmin) {
        return reply('❌ Command ini hanya untuk Owner dan Admin Group!');
    }
    
    const args = m.text.split(' ');
    if (args.length < 3) {
        return reply(`⚠️ *Cara penggunaan:*\n.setrole @user reseller\n.setrole @user member\n\nContoh: .setrole @6281234567890 reseller`);
    }
    
    let targetUser = m.mentionedJid?.[0] || args[1].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    let newRole = args[2].toLowerCase();
    
    if (!['member', 'reseller'].includes(newRole)) {
        return reply('❌ Role tidak valid! Gunakan: *member* atau *reseller*');
    }
    
    try {
        const saldoManager = require('./lib/functionSaldo.js');
        
        const userExists = await saldoManager.isUserExists(targetUser);
        if (!userExists) {
            return reply(`❌ User tidak terdaftar! Silakan daftar dengan .daftar <nama>`);
        }
        
        const userInfo = await saldoManager.getUserInfoSaldo(targetUser);
        
        if (userInfo.role === newRole) {
            return reply(`⚠️ User ${userInfo.name} sudah memiliki role *${newRole}*`);
        }
        
        const result = await saldoManager.setUserRole(targetUser, newRole);
        
        if (result.success) {
            let roleEmoji = newRole === 'reseller' ? '⭐' : '👤';
            let messageText = `✅ *Role berhasil diubah!*\n\n` +
                             `👤 Nama: ${userInfo.name}\n` +
                             `📱 Nomor: @${targetUser.split('@')[0]}\n` +
                             `🔄 Role lama: ${userInfo.role || 'member'}\n` +
                             `${roleEmoji} Role baru: *${newRole.toUpperCase()}*\n` +
                             `💰 Saldo: ${saldoManager.formatRupiah(userInfo.saldo)}`;
            
            await alpha.sendMessage(m.chat, { text: messageText, mentions: [targetUser] }, { quoted: m });
        } else {
            reply(`❌ Gagal: ${result.message}`);
        }
    } catch (error) {
        console.error(error);
        reply('❌ Terjadi kesalahan, coba lagi nanti.');
    }
}
break;

case 'setharga': {
    if (!isCreator) return reply("❌ Fitur Khusus Owner");
    if (!text) return reply(`⚠️ *Format Penggunaan:*\n\n.setharga <hargaMemberTiaa>,<hargaMemberBulk> | <hargaResellerTiaa>,<hargaResellerBulk>\n\n📌 *Contoh:*\n.setharga 500,300 | 250,100\n\n🔍 *Lihat harga saat ini:*\n.setharga lihat`);
    
    const saldoManager = require('./lib/functionSaldo.js');
    const hargaManager = require('./lib/hargaManager.js');
    
    try {
        // Option to view current prices
        if (text.toLowerCase() === 'lihat') {
            const harga = hargaManager.getHarga();
            let message = `💰 *DAFTAR HARGA SAAT INI* 💰\n\n`;
            message += `👤 *MEMBER*\n`;
            message += `• Harga (Verification): ${saldoManager.formatRupiah(harga.hargaTiaaMember)}\n`;
            message += `• Harga Bulk (Per Account): ${saldoManager.formatRupiah(harga.hargaBulkMember)}\n\n`;
            message += `⭐ *RESELLER*\n`;
            message += `• Harga (Verification): ${saldoManager.formatRupiah(harga.hargaTiaaRess)}\n`;
            message += `• Harga Bulk (Per Account): ${saldoManager.formatRupiah(harga.hargaBulkRess)}\n\n`;
            message += `📝 Diatur oleh: @${m.sender.split('@')[0]}\n`;
            message += `🕐 Waktu: ${new Date().toLocaleString('id-ID')}\n\n`;
            message += `© ${global.namabot}`;
            
            return alpha.sendMessage(m.chat, { text: message, mentions: [m.sender] }, { quoted: m });
        }
        
        // Parse format: 500,300 | 250,100
        let parts = text.split('|');
        if (parts.length !== 2) {
            return reply(`❌ *Format salah!*\n\nGunakan format:\n.setharga 500,300 | 250,100\n\n*Pisahkan dengan tanda | (spasi)*`);
        }
        
        let memberPrices = parts[0].trim().split(',');
        let resellerPrices = parts[1].trim().split(',');
        
        if (memberPrices.length !== 2 || resellerPrices.length !== 2) {
            return reply(`❌ *Format harga salah!*\n\nContoh: .setharga 500,300 | 250,100\n\n• 500,300 = harga member (bulk)\n• 250,100 = harga reseller (bulk)`);
        }
        
        const newHargaMemberTiaa = parseInt(memberPrices[0]);
        const newHargaMemberBulk = parseInt(memberPrices[1]);
        const newHargaResellerTiaa = parseInt(resellerPrices[0]);
        const newHargaResellerBulk = parseInt(resellerPrices[1]);
        
        // Validate all prices
        if (isNaN(newHargaMemberTiaa) || isNaN(newHargaMemberBulk) || 
            isNaN(newHargaResellerTiaa) || isNaN(newHargaResellerBulk)) {
            return reply('❌ *Harga tidak valid!* Masukkan angka yang benar.');
        }
        
        if (newHargaMemberTiaa <= 0 || newHargaMemberBulk <= 0 || 
            newHargaResellerTiaa <= 0 || newHargaResellerBulk <= 0) {
            return reply('❌ *Harga harus lebih dari 0!*');
        }
        
        // Save old prices
        const oldHargaMemberTiaa = global.hargaTiaaMember;
        const oldHargaMemberBulk = global.hargaBulkMember;
        const oldHargaResellerTiaa = global.hargaTiaaRess;
        const oldHargaResellerBulk = global.hargaBulkRess;
        
        // Save to file and update global
        const result = hargaManager.saveHarga({
            hargaTiaaMember: newHargaMemberTiaa,
            hargaBulkMember: newHargaMemberBulk,
            hargaTiaaRess: newHargaResellerTiaa,
            hargaBulkRess: newHargaResellerBulk
        }, m.sender);
        
        if (!result) {
            return reply('❌ Gagal menyimpan harga!');
        }
        
        // Create response message
        let message = `✅ *HARGA BERHASIL DIUPDATE* ✅\n\n`;
        message += `┌─ 👤 *MEMBER*\n`;
        message += `│  💰 Harga  : ${saldoManager.formatRupiah(oldHargaMemberTiaa)} → ${saldoManager.formatRupiah(global.hargaTiaaMember)}\n`;
        message += `│  📦 Harga Bulk  : ${saldoManager.formatRupiah(oldHargaMemberBulk)} → ${saldoManager.formatRupiah(global.hargaBulkMember)}\n`;
        message += `└─────────────────────\n\n`;
        message += `┌─ ⭐ *RESELLER*\n`;
        message += `│  💰 Harga  : ${saldoManager.formatRupiah(oldHargaResellerTiaa)} → ${saldoManager.formatRupiah(global.hargaTiaaRess)}\n`;
        message += `│  📦 Harga Bulk  : ${saldoManager.formatRupiah(oldHargaResellerBulk)} → ${saldoManager.formatRupiah(global.hargaBulkRess)}\n`;
        message += `└─────────────────────\n\n`;
        message += `📝 *Diatur oleh:* @${m.sender.split('@')[0]}\n`;
        message += `🕐 *Waktu:* ${new Date().toLocaleString('id-ID')}\n\n`;
        message += `✨ *Perubahan harga akan langsung berlaku* ✨\n`;
        message += `© ${global.namabot}`;
        
        await alpha.sendMessage(m.chat, { 
            text: message, 
            mentions: [m.sender] 
        }, { quoted: m });
        
    } catch (error) {
        console.error('Error in setharga case:', error);
        reply('❌ Terjadi kesalahan saat mengupdate harga. Silakan coba lagi.');
    }
}
break;

case 'cekharga': {
    try {
        const { formatRupiah } = require('./lib/functionSaldo.js');
        const hargaManager = require('./lib/hargaManager.js');
        
        const harga = hargaManager.getHarga();
        
        let message = `💰 *DAFTAR HARGA ALIGHT MOTION* 💰\n\n`;
        message += `┌─ 👤 *MEMBER*\n`;
        message += `│  💰 Harga  : ${formatRupiah(harga.hargaTiaaMember)}\n`;
        message += `│  📦 Harga Bulk  : ${formatRupiah(harga.hargaBulkMember)}\n`;
        message += `└─────────────────────\n\n`;
        message += `┌─ ⭐ *RESELLER*\n`;
        message += `│  💰 Harga  : ${formatRupiah(harga.hargaTiaaRess)}\n`;
        message += `│  📦 Harga Bulk  : ${formatRupiah(harga.hargaBulkRess)}\n`;
        message += `└─────────────────────\n\n`;
        message += `📌 *Perintah:*\n`;
        message += `• .sendam <email> - Request verifikasi\n`;
        message += `• .verifam <link> - Verifikasi akun\n`;
        message += `• .bulkam <jumlah> - Beli akun bulk\n`;
        message += `• .buyressam <hari> - Jadi reseller\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        message += `💡 *Jadi reseller = harga lebih murah!*\n`;
        message += `© ${global.namabot}`;
        
        reply(message);
    } catch (error) {
        console.error('Error in cekharga case:', error);
        reply('❌ Terjadi kesalahan saat menampilkan harga.');
    }
}
break;

// Then in your case
case "ping": case "runtime": {
let timestamp = speed();
let latensi = speed() - timestamp;
let tio = await nou.os.oos();
var tot = await nou.drive.info();

// Calculate uptime manually
let botUptime = Math.floor((Date.now() - botStartTime) / 1000);

let respon = `*—Informasi Server Vps 🖥️*
- *Platform :* ${nou.os.type()}
- *Total Ram :* ${formatp(os.totalmem())}
- *Total Disk :* ${tot.totalGb} GB
- *Total Cpu :* ${os.cpus().length} Core
- *Runtime Vps :* ${runtime(os.uptime())}

*—Informasi Server Panel 🌐*
- *Respon Speed :* ${latensi.toFixed(4)} detik
- *Runtime Bot :* ${runtime(botUptime)}`
await reply(respon)
}
break
case 'getip': {
  if (!isCreator) return m.reply("khusus owner");
  const axios = require('axios');

async function getPublicIP() {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    return response.data.ip;
  } catch (error) {
    console.error('Error fetching IP:', error);
    return 'Unknown';
  }
}

  const ip = await getPublicIP();
  m.reply(`My public IP address is: ${ip}`);
  break;
}

case 'bot': {
  m.reply(`Bot Actived ${m.pushaname}`)
}
  
case "menu": {
        try {
          const filePath = __filename;
          const fileContent = fs.readFileSync(filePath, "utf8");
          const regex = /(?:\/\/\s*(\w+)\s*)?case\s+["'`](.+?)["'`]\s*:/gi;
          const cases = {};
          let currentCategory = "Uncategorized";
          let match;

          while ((match = regex.exec(fileContent)) !== null) {
            if (match[1]) currentCategory = match[1].trim();
            const command = match[2].trim();

            if (!cases[currentCategory]) cases[currentCategory] = [];
            cases[currentCategory].push(command);
          }

          // 🧱 Format teks menu
          const caseText = Object.entries(cases)
            .map(([category, cmds]) => {
              const title = `▢ ${category.charAt(0).toUpperCase() + category.slice(1)}`;
              const list = cmds.map((cmd) => ` ├─ ${prefix}${cmd}`).join("\n");
              return `${title}\n${list}`;
            })
            .join("\n\n");

          // 📜 Teks menu utama
          const mbut = `
Hi, @${m.sender.split("@")[0]}
I am ${global.namabot}, developed by ${global.namaowner}

*▢ Information*
- Nama : ${pushname}
- Tag : @${m.sender.split("@")[0]}
- Status : Public
- Owner : @${global.owner}

${caseText}
`;

          // Mention a single user
		alpha.sendMessage(m.chat, { 
  		text: `${mbut}`,
 		mentions: [m.sender]
		}, { quoted: m });
        } catch (e) {
          console.error("[MENU ERROR]", e);
          alpha.sendMessage(m.chat, {
            text: `❌ Terjadi kesalahan:\n${e.message}`
          }, {
            quoted: m
          });
        }
      }
      break;

default:
if (budy.startsWith('>')) {
                    if (!isCreator) return
                    try {
                        let evaled = await eval(budy.slice(2))
                        if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
                        await reply(evaled)
                    } catch (err) {
                        await reply(util.format(err))
                    }
                }
       }
        
        // cek bot active or no
/*        if ((budy) && ["bot", "Bot"].includes(budy) && !isCmd && !m.key.fromMe) {
            reply(`Bot Activated " ${m.pushName} "`)
        }  */   

        if (budy.startsWith('>> ')) {
if (!isCreator) return m.reply("Khusus Owner")
try {
let evaled = await eval(budy.slice(2))
if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
await m.reply(evaled)
} catch (err) {
await m.reply(util.format(err))
}
}
//=================================================//
        } catch (err) {
        m.reply(util.format(err))
    }
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
})
