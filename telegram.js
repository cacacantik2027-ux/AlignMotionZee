require('./settings')

const TelegramBot = require('node-telegram-bot-api')
const fs = require('fs')
const path = require('path')
const speed = require('performance-now')
const axios = require('axios')
const os = require('os')
const nou = require('node-os-utils')

const saldoManager = require('./lib/functionSaldo')
const hargaManager = require('./lib/hargaManager')
const am = require('./lib/functionAlightMotion')
const { formatp } = require('./lib/myfunc')

const token = process.env.TELEGRAM_BOT_TOKEN || global.telegramToken
if (!token || token === 'ISI_TOKEN_BOT_TELEGRAM') {
    console.error('Set TELEGRAM_BOT_TOKEN di environment atau global.telegramToken di settings.js')
    process.exit(1)
}

const bot = new TelegramBot(token, { polling: true })
const startTime = Date.now()
const ownerIds = (global.ownerTelegram || []).map(String)

const isOwner = (id) => ownerIds.includes(String(id))
const userId = (msg) => String(msg.from.id)
const rupiah = saldoManager.formatRupiah

function isSewa(id) {
    let sewa = JSON.parse(fs.readFileSync('./database/sewa.json'))
    return sewa.includes(id)
}

function parseAmount(value) {
    return parseFloat(String(value || '').toLowerCase().replace('k', '000').replace(/[.,]/g, ''))
}

function targetId(msg, value) {
    if (msg.reply_to_message) return userId(msg)
    if (!value) return null
    return String(value).replace(/[^0-9]/g, '')
}

function runtime() {
    const total = Math.floor((Date.now() - startTime) / 1000)
    const d = Math.floor(total / 86400)
    const h = Math.floor((total % 86400) / 3600)
    const m = Math.floor((total % 3600) / 60)
    const s = total % 60
    return `${d ? d + 'd ' : ''}${h ? h + 'h ' : ''}${m ? m + 'm ' : ''}${s}s`
}

async function send(chatId, text, keyboard = null) {
    const opts = { parse_mode: 'Markdown' }
    if (keyboard) opts.reply_markup = { inline_keyboard: keyboard }
    return bot.sendMessage(chatId, text, opts)
}

function getKeyboard(id) {
    if (isOwner(id) || isSewa(id)) return mainMenu(id)
    return [
        [{ text: '💳 Sewa Premium', callback_data: 'menu_sewa' }],
        [{ text: '📥 Deposit', callback_data: 'menu_deposit' }],
    ]
}

async function edit(chatId, msgId, text, keyboard = null) {
    const opts = { parse_mode: 'Markdown', chat_id: chatId, message_id: msgId }
    if (keyboard) opts.reply_markup = { inline_keyboard: keyboard }
    return bot.editMessageText(text, opts)
}

// ─── KEYBOARDS ───
function mainMenu(id) {
    const kb = [
        [{ text: '👤 Register', callback_data: 'menu_daftar' }, { text: '💰 Cek Saldo', callback_data: 'menu_saldo' }],
        [{ text: '📧 Send AM', callback_data: 'menu_sendam' }, { text: '✅ Verif AM', callback_data: 'menu_verif' }],
        [{ text: '📦 Bulk AM', callback_data: 'menu_bulk' }, { text: '❌ Cancel', callback_data: 'menu_cancel' }],
        [{ text: '💵 Harga', callback_data: 'menu_harga' }, { text: '📋 History', callback_data: 'menu_history' }],
        [{ text: '⚡ Ping', callback_data: 'menu_ping' }],
        [{ text: '💳 Sewa Premium', callback_data: 'menu_sewa' }, { text: '📥 Deposit', callback_data: 'menu_deposit' }],
    ]
    if (isOwner(id)) {
        kb.push(
            [{ text: '🔧 Owner Panel', callback_data: 'owner_panel' }]
        )
    }
    return kb
}

function ownerPanel() {
    return [
        [{ text: '➕ Add Saldo', callback_data: 'owner_addsaldo' }, { text: '➖ Min Saldo', callback_data: 'owner_minsaldo' }],
        [{ text: '🗑️ Delete Saldo', callback_data: 'owner_delsaldo' }],
        [{ text: '👥 Add Sewa', callback_data: 'owner_addsewa' }, { text: '👥 Del Sewa', callback_data: 'owner_delsewa' }],
        [{ text: '📋 List Sewa', callback_data: 'owner_listsewa' }],
        [{ text: '⭐ Set Role', callback_data: 'owner_setrole' }, { text: '💰 Set Harga', callback_data: 'owner_setharga' }],
        [{ text: '🌐 Get IP', callback_data: 'owner_getip' }, { text: '🏠 Menu Utama', callback_data: 'back_main' }],
    ]
}

// ─── CALLBACK QUERY HANDLER ───
bot.on('callback_query', async (q) => {
    const chatId = q.message.chat.id
    const msgId = q.message.message_id
    const id = String(q.from.id)
    const data = q.data

    await bot.answerCallbackQuery(q.id)

    // Sewa gate for non-owner
    const allowedNonSewa = ['menu_sewa', 'menu_deposit', 'back_main']
    if (!isOwner(id) && !isSewa(id) && !allowedNonSewa.includes(data)) {
        return
    }

    switch (data) {
        case 'back_main': {
            const info = await saldoManager.getUserInfoSaldo(id)
            const status = isSewa(id) ? '✅ Active' : '❌ No Plan'
            let txt = `🎛️ *${global.namabot}*\n\n👤 ${info?.name || 'Guest'}\n📊 Status: ${status}\n💵 Balance: ${rupiah(info?.saldo || 0)}`
            await edit(chatId, msgId, txt, getKeyboard(id))
            break
        }
        case 'menu_daftar':
            await edit(chatId, msgId, `📝 *Register*\n\nKetik:\n/daftar <nama>\n\nContoh: /daftar John`, getKeyboard(id))
            break
        case 'menu_saldo': {
            const info = await saldoManager.getUserInfoSaldo(id)
            if (!info) return await edit(chatId, msgId, '❌ Belum daftar. Ketik /daftar <nama>', getKeyboard(id))
            await edit(chatId, msgId,
                `💰 *Saldo Info*\n\n👤 ${info.name}\n🆔 ${id}\n⭐ ${(info.role || 'member').toUpperCase()}\n💵 ${rupiah(info.saldo)}\n📅 ${new Date(info.registeredAt).toLocaleString('id-ID')}`,
                getKeyboard(id))
            break
        }
        case 'menu_sendam':
            await edit(chatId, msgId, `📧 *Send Verification Email*\n\nKetik:\n/sendam <email>\n\nContoh: /sendam example@gmail.com`, getKeyboard(id))
            break
        case 'menu_verif':
            await edit(chatId, msgId, `✅ *Verifikasi Alight Motion*\n\nKetik:\n/verifam <link>\n\nContoh: /verifam https://alightcreative.page.link/...`, getKeyboard(id))
            break
        case 'menu_bulk':
            await edit(chatId, msgId, `📦 *Bulk Alight Motion*\n\nKetik:\n/bulkam <jumlah>\n\nContoh: /bulkam 10 (max 100)`, getKeyboard(id))
            break
        case 'menu_cancel':
            if (!await am.hasPendingVerificationAlightMotion(id)) return await edit(chatId, msgId, '❌ Tidak ada pending verification.', getKeyboard(id))
            const cancelRes = await am.cancelPendingAlightMotion(id)
            await edit(chatId, msgId, cancelRes.success ? `🗑️ Dibatalkan\n📧 ${cancelRes.email}` : `❌ ${cancelRes.message}`, getKeyboard(id))
            break
        case 'menu_harga': {
            const harga = hargaManager.getHarga()
            await edit(chatId, msgId,
                `💰 *HARGA*\n\n👤 MEMBER\nVerif: ${rupiah(harga.hargaTiaaMember)}\nBulk: ${rupiah(harga.hargaBulkMember)}\n\n⭐ RESELLER\nVerif: ${rupiah(harga.hargaTiaaRess)}\nBulk: ${rupiah(harga.hargaBulkRess)}`,
                getKeyboard(id))
            break
        }
        case 'menu_history': {
            const history = await am.getUserHistoryAlightMotion(id)
            if (!history || !history.length) return await edit(chatId, msgId, 'Belum ada transaksi.', getKeyboard(id))
            let txt = `📋 *History (10 terakhir)*\n\n`
            history.slice(-10).reverse().forEach((item, i) => {
                const d = new Date(item.timestamp).toLocaleString('id-ID')
                if (item.type === 'verification') txt += `${i+1}. ✅ Verif\n📧 ${item.email}\n🕐 ${d}\n\n`
                else if (item.type === 'bulk') txt += `${i+1}. 📦 Bulk\n📊 ${item.successCount}/${item.totalRequested}\n🕐 ${d}\n\n`
                else if (item.type === 'cancel') txt += `${i+1}. ❌ Cancel\n📧 ${item.email}\n🕐 ${d}\n\n`
            })
            await edit(chatId, msgId, txt, getKeyboard(id))
            break
        }
        case 'menu_ping': {
            const ping = speed() - speed()
            await edit(chatId, msgId, `⚡ Pong!\nRuntime: ${runtime()}\nPing: ${Math.abs(ping).toFixed(4)}s`, getKeyboard(id))
            break
        }
        case 'menu_sewa':
            await edit(chatId, msgId,
                `💳 *Sewa Premium*\n\nAktifkan akses penuh bot.\nHubungi owner:\n[Chat Owner](tg://user?id=${global.ownerTelegram?.[0] || '123456789'})`,


                getKeyboard(id))
            break
        case 'menu_deposit':
            await edit(chatId, msgId,
                `💵 *Deposit Saldo*\n\nIsi ulang saldo.\nHubungi owner:\n[Chat Owner](tg://user?id=${global.ownerTelegram?.[0] || '123456789'})`,


                getKeyboard(id))
            break

        // ─── OWNER PANEL ───
        case 'owner_panel':
            await edit(chatId, msgId, `🔧 *Owner Panel*\nPilih aksi:`, ownerPanel())
            break
        case 'owner_addsaldo':
            await edit(chatId, msgId, `➕ Add Saldo\n\nKetik: /addsaldo <jumlah> <id>\nContoh: /addsaldo 10000 123456789`, ownerPanel())
            break
        case 'owner_minsaldo':
            await edit(chatId, msgId, `➖ Min Saldo\n\nKetik: /minsaldo <jumlah> <id>\nContoh: /minsaldo 5000 123456789`, ownerPanel())
            break
        case 'owner_delsaldo':
            await edit(chatId, msgId, `🗑️ Delete Saldo\n\nKetik: /delsaldo <id>\nContoh: /delsaldo 123456789`, ownerPanel())
            break
        case 'owner_addsewa':
            await edit(chatId, msgId, `👥 Add Sewa\n\nKetik: /addsewa <id>\nContoh: /addsewa 123456789`, ownerPanel())
            break
        case 'owner_delsewa':
            await edit(chatId, msgId, `👥 Del Sewa\n\nKetik: /delsewa <id>\nContoh: /delsewa 123456789`, ownerPanel())
            break
        case 'owner_listsewa': {
            let sewa = JSON.parse(fs.readFileSync('./database/sewa.json'))
            let txt = sewa.length ? '📋 *Sewa List:*\n\n' + sewa.map((v, i) => `${i+1}. ${v}`).join('\n') : 'Belum ada user sewa.'
            await edit(chatId, msgId, txt, ownerPanel())
            break
        }
        case 'owner_setrole':
            await edit(chatId, msgId, `⭐ Set Role\n\nKetik: /setrole <id> <member|reseller>\nContoh: /setrole 123456789 reseller`, ownerPanel())
            break
        case 'owner_setharga':
            await edit(chatId, msgId, `💰 Set Harga\n\nKetik: /setharga <mT,mB | rT,rB>\nContoh: /setharga 500,300 | 250,100\n\nLihat harga: /setharga lihat`, ownerPanel())
            break
        case 'owner_getip': {
            const ip = await axios.get('https://api.ipify.org?format=json').then(r => r.data.ip).catch(() => 'Unknown')
            await edit(chatId, msgId, `🌐 Public IP: ${ip}`, ownerPanel())
            break
        }
    }
})

// ─── TEXT COMMANDS ───
bot.onText(/^([/.!]?)(\w+)(?:\s+([\s\S]*))?$/, async (msg, match) => {
    const chatId = msg.chat.id
    const command = match[2].toLowerCase()
    const text = (match[3] || '').trim()
    const args = text.split(/\s+/).filter(Boolean)
    const id = userId(msg)

    // Sewa gate
    const allowedFree = ['start', 'help', 'menu', 'bot', 'sewa', 'deposit', 'redeem', 'daftar', 'ceksaldo']
    if (!isOwner(id) && !isSewa(id) && !allowedFree.includes(command)) {
        return send(chatId, `⚠️ *No Active Plan*\n\nAnda belum memiliki akses premium.`, getKeyboard(id))
    }

    if (command === 'start' || command === 'help' || command === 'menu' || command === 'bot') {
        const info = await saldoManager.getUserInfoSaldo(id)
        const status = isSewa(id) ? '✅ Active' : '❌ No Plan'
        return send(chatId,
            `🎛️ *${global.namabot}*\n\n👤 ${info?.name || 'Guest'}\n📊 Status: ${status}\n💵 Balance: ${rupiah(info?.saldo || 0)}`,
            getKeyboard(id))
    }

    try {
        switch (command) {
            case 'sewa':
                return send(chatId, `💳 *Sewa Premium*\n\nHubungi Owner:\n[Chat Owner](tg://user?id=${global.ownerTelegram?.[0] || '123456789'})`,

 getKeyboard(id))
            case 'deposit':
                return send(chatId, `💵 *Deposit Saldo*\n\nHubungi Owner:\n[Chat Owner](tg://user?id=${global.ownerTelegram?.[0] || '123456789'})`,

 getKeyboard(id))
            case 'redeem':
                return send(chatId, '🎫 Redeem code akan segera hadir.', getKeyboard(id))
            case 'daftar': {
                if (!text) return send(chatId, 'Usage: /daftar <nama>', getKeyboard(id))
                if (await saldoManager.isUserExists(id)) return send(chatId, '❌ Kamu sudah terdaftar.', getKeyboard(id))
                if (await saldoManager.isNameExists(text)) return send(chatId, `❌ Nama "${text}" sudah dipakai.`, getKeyboard(id))
                const result = await saldoManager.registerUserSaldo(id, text)
                return send(chatId, result.success
                    ? `✅ *Registrasi Berhasil*\n\n👤 ${text}\n🆔 ${id}\n💰 ${rupiah(result.saldo)}`
                    : `❌ ${result.message}`, getKeyboard(id))
            }
            case 'ceksaldo': {
                const target = targetId(msg, args[0]) || id
                const info = await saldoManager.getUserInfoSaldo(target)
                if (!info) return send(chatId, '❌ Belum daftar. /daftar <nama>', getKeyboard(id))
                return send(chatId, `💰 *Saldo*\n\n👤 ${info.name}\n🆔 ${target}\n⭐ ${(info.role || 'member').toUpperCase()}\n💵 ${rupiah(info.saldo)}\n📅 ${new Date(info.registeredAt).toLocaleString('id-ID')}`, getKeyboard(id))
            }
            case 'addsaldo': {
                if (!isOwner(id)) return send(chatId, '❌ Khusus owner.', getKeyboard(id))
                const amount = parseAmount(args[0])
                const target = args[1]
                if (!amount || !target) return send(chatId, 'Usage: /addsaldo <jumlah> <id>\nContoh: /addsaldo 10000 123456789', getKeyboard(id))
                const result = await saldoManager.addSaldo(target, amount)
                return send(chatId, result.success ? `✅ Saldo ${target} +${rupiah(amount)} (Total: ${rupiah(result.newSaldo)})` : `❌ ${result.message}`, getKeyboard(id))
            }
            case 'minsaldo': {
                if (!isOwner(id)) return send(chatId, '❌ Khusus owner.', getKeyboard(id))
                const amount = parseAmount(args[0])
                const target = args[1]
                if (!amount || !target) return send(chatId, 'Usage: /minsaldo <jumlah> <id>', getKeyboard(id))
                const result = await saldoManager.minSaldo(target, amount)
                return send(chatId, result.success ? `➖ Saldo ${target} -${rupiah(amount)} (Sisa: ${rupiah(result.newSaldo)})` : `❌ ${result.message}`, getKeyboard(id))
            }
            case 'delsaldo': {
                if (!isOwner(id)) return send(chatId, '❌ Khusus owner.', getKeyboard(id))
                const target = args[0]
                if (!target) return send(chatId, 'Usage: /delsaldo <id>', getKeyboard(id))
                const result = await saldoManager.deleteSaldo(target)
                return send(chatId, result.success ? `🗑️ Saldo ${target} direset (sebelum: ${rupiah(result.previousSaldo)})` : `❌ ${result.message}`, getKeyboard(id))
            }
            case 'addsewa': {
                if (!isOwner(id)) return send(chatId, '❌ Khusus owner.', getKeyboard(id))
                const target = args[0]
                if (!target) return send(chatId, 'Usage: /addsewa <id>', getKeyboard(id))
                let sewa = JSON.parse(fs.readFileSync('./database/sewa.json'))
                if (sewa.includes(target)) return send(chatId, '⚠️ Sudah aktif.', getKeyboard(id))
                sewa.push(target)
                fs.writeFileSync('./database/sewa.json', JSON.stringify(sewa, null, 2))
                return send(chatId, `✅ Sewa aktif untuk ID: ${target}`, getKeyboard(id))
            }
            case 'delsewa': {
                if (!isOwner(id)) return send(chatId, '❌ Khusus owner.', getKeyboard(id))
                const target = args[0]
                if (!target) return send(chatId, 'Usage: /delsewa <id>', getKeyboard(id))
                let sewa = JSON.parse(fs.readFileSync('./database/sewa.json'))
                if (!sewa.includes(target)) return send(chatId, '⚠️ Tidak dalam daftar.', getKeyboard(id))
                sewa = sewa.filter(v => v !== target)
                fs.writeFileSync('./database/sewa.json', JSON.stringify(sewa, null, 2))
                return send(chatId, `✅ Sewa ${target} dihapus.`, getKeyboard(id))
            }
            case 'listsewa': {
                if (!isOwner(id)) return send(chatId, '❌ Khusus owner.', getKeyboard(id))
                let sewa = JSON.parse(fs.readFileSync('./database/sewa.json'))
                let txt = sewa.length ? '📋 *Sewa List:*\n\n' + sewa.map((v, i) => `${i+1}. ${v}`).join('\n') : 'Belum ada.'
                return send(chatId, txt, getKeyboard(id))
            }
            case 'sendam': {
                if (!text) return send(chatId, 'Usage: /sendam <email>', getKeyboard(id))
                if (!/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(text)) return send(chatId, '❌ Email tidak valid.', getKeyboard(id))
                if (await am.hasPendingVerificationAlightMotion(id)) return send(chatId, '⚠️ Masih ada pending. /verifam atau /cancel', getKeyboard(id))
                if (await am.isEmailPendingAlightMotion(text)) return send(chatId, '⚠️ Email dipending user lain.', getKeyboard(id))
                const result = await am.sendVerificationEmailAlightMotion(text)
                if (!result.status) return send(chatId, `❌ ${result.message}`, getKeyboard(id))
                const saved = await am.saveEmailAlightMotion(id, text)
                return send(chatId, saved.success
                    ? `✅ *Email Terkirim*\n📧 ${text}\n📬 ${result.message}\n\nSekarang /verifam <link>`
                    : `❌ ${saved.message}`, getKeyboard(id))
            }
            case 'verifam': {
                if (!text) return send(chatId, 'Usage: /verifam <link>', getKeyboard(id))
                const userSaldo = await saldoManager.getSaldo(id)
                if (userSaldo === null || userSaldo === undefined) return send(chatId, '❌ Belum daftar. /daftar <nama>', getKeyboard(id))
                if (!await am.hasPendingVerificationAlightMotion(id)) return send(chatId, '❌ Tidak ada pending. /sendam dulu.', getKeyboard(id))
                const userRole = await saldoManager.getUserRole(id) || 'member'
                const price = await saldoManager.getHargaByRole(id, 'Tiaa')
                if (userSaldo < price) return send(chatId, `❌ Saldo kurang. ${rupiah(userSaldo)} / ${rupiah(price)}`, getKeyboard(id))
                const pendingData = await am.getPendingEmailForUserAlightMotion(id)
                if (!pendingData) return send(chatId, '❌ Tidak ada pending.', getKeyboard(id))
                const deduct = await saldoManager.minSaldo(id, price)
                await send(chatId, `⏳ Verifying...\n📧 ${pendingData.email}\n💰 ${rupiah(price)}`)
                const result = await am.verifyLinkAlightMotion(pendingData.email, text)
                if (!result.status) {
                    await saldoManager.addSaldo(id, price)
                    return send(chatId, `❌ Gagal. Saldo refund ${rupiah(price)}.`, getKeyboard(id))
                }
                await am.saveVerificationAlightMotion(pendingData.email, result.data.duration, id, price, userRole)
                return send(chatId,
                    `✅ *Verifikasi Sukses*\n⭐ ${userRole.toUpperCase()}\n📧 ${result.data.email}\n⏱️ ${result.data.duration}\n💰 ${rupiah(price)}\n💵 ${rupiah(deduct.newSaldo)}`,
                    getKeyboard(id))
            }
            case 'bulkam': {
                const amount = parseInt(text)
                if (!amount || amount < 1 || amount > 100) return send(chatId, 'Usage: /bulkam <1-100>', getKeyboard(id))
                const saldo = await saldoManager.getSaldo(id)
                if (saldo === null || saldo === undefined) return send(chatId, '❌ Belum daftar.', getKeyboard(id))
                const role = await saldoManager.getUserRole(id) || 'member'
                const price = await saldoManager.getHargaByRole(id, 'bulk')
                const total = amount * price
                if (saldo < total) return send(chatId, `❌ Saldo kurang. ${rupiah(saldo)} / ${rupiah(total)}`, getKeyboard(id))
                const deduct = await saldoManager.minSaldo(id, total)
                await send(chatId, `⏳ Processing ${amount} account(s)...\n💰 ${rupiah(total)}`)
                const result = await am.createBulkAccountsAlightMotion(amount)
                if (!result.status) {
                    await saldoManager.addSaldo(id, total)
                    return send(chatId, `❌ Gagal. Refund ${rupiah(total)}.`, getKeyboard(id))
                }
                const failed = result.data.failed_count
                const success = result.data.success_count
                const refund = failed * price
                if (refund > 0) await saldoManager.addSaldo(id, refund)
                const content = result.data.accounts.map((a, i) => `${i+1}. ${a.email}\nPackage: ${a.package}\nDuration: ${a.duration}`).join('\n\n')
                const fPath = path.join('./tmp', `tg_bulk_${Date.now()}.txt`)
                if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp', { recursive: true })
                fs.writeFileSync(fPath, content, 'utf8')
                await bot.sendDocument(chatId, fPath)
                fs.unlinkSync(fPath)
                await am.saveBulkAccountsAlightMotion(id, result.data.accounts, success, failed, amount, role, price)
                return send(chatId,
                    `✅ *Bulk Sukses*\n📊 ${success}/${amount}\n❌ Gagal: ${failed}\n💰 Refund: ${rupiah(refund)}\n💵 ${rupiah(deduct.newSaldo + refund)}`,
                    getKeyboard(id))
            }
            case 'cancel': {
                if (!await am.hasPendingVerificationAlightMotion(id)) return send(chatId, '❌ Tidak ada pending.', getKeyboard(id))
                const result = await am.cancelPendingAlightMotion(id)
                return send(chatId, result.success ? `🗑️ Dibatalkan\n📧 ${result.email}` : `❌ ${result.message}`, getKeyboard(id))
            }
            case 'cekhistory': {
                const history = await am.getUserHistoryAlightMotion(id)
                if (!history || !history.length) return send(chatId, 'Belum ada transaksi.', getKeyboard(id))
                let txt = `📋 *History*\n\n`
                history.slice(-10).reverse().forEach((item, i) => {
                    const d = new Date(item.timestamp).toLocaleString('id-ID')
                    if (item.type === 'verification') txt += `${i+1}. ✅ Verif\n📧 ${item.email}\n⏱️ ${item.duration}\n🕐 ${d}\n\n`
                    else if (item.type === 'bulk') txt += `${i+1}. 📦 Bulk\n📊 ${item.successCount}/${item.totalRequested}\n🕐 ${d}\n\n`
                    else if (item.type === 'cancel') txt += `${i+1}. ❌ Cancel\n📧 ${item.email}\n🕐 ${d}\n\n`
                })
                txt += `📌 Total: ${history.length}`
                return send(chatId, txt, getKeyboard(id))
            }
            case 'setrole': {
                if (!isOwner(id)) return send(chatId, '❌ Khusus owner.', getKeyboard(id))
                const target = args[0]
                const role = args[1]
                if (!target || !['member', 'reseller'].includes(role)) return send(chatId, 'Usage: /setrole <id> <member|reseller>', getKeyboard(id))
                const exists = await saldoManager.isUserExists(target)
                if (!exists) return send(chatId, '❌ User tidak terdaftar.', getKeyboard(id))
                const info = await saldoManager.getUserInfoSaldo(target)
                if (info.role === role) return send(chatId, `⚠️ ${info.name} sudah ${role}.`, getKeyboard(id))
                const result = await saldoManager.setUserRole(target, role)
                return send(chatId, result.success ? `✅ ${info.name} → ${role.toUpperCase()}` : `❌ ${result.message}`, getKeyboard(id))
            }
            case 'setharga': {
                if (!isOwner(id)) return send(chatId, '❌ Khusus owner.', getKeyboard(id))
                if (text.toLowerCase() === 'lihat') {
                    const harga = hargaManager.getHarga()
                    return send(chatId,
                        `💰 *HARGA*\nMEMBER\nVerif: ${rupiah(harga.hargaTiaaMember)}\nBulk: ${rupiah(harga.hargaBulkMember)}\n\nRESELLER\nVerif: ${rupiah(harga.hargaTiaaRess)}\nBulk: ${rupiah(harga.hargaBulkRess)}`,
                        getKeyboard(id))
                }
                const parts = text.split('|')
                if (parts.length !== 2) return send(chatId, 'Usage: /setharga 500,300 | 250,100', getKeyboard(id))
                const m = parts[0].trim().split(',').map(Number)
                const r = parts[1].trim().split(',').map(Number)
                if (m.length !== 2 || r.length !== 2 || [...m, ...r].some(n => !n || n <= 0)) return send(chatId, '❌ Format salah.', getKeyboard(id))
                hargaManager.saveHarga({ hargaTiaaMember: m[0], hargaBulkMember: m[1], hargaTiaaRess: r[0], hargaBulkRess: r[1] }, id)
                return send(chatId, `✅ Harga diupdate\nM: ${rupiah(m[0])}/${rupiah(m[1])}\nR: ${rupiah(r[0])}/${rupiah(r[1])}`, getKeyboard(id))
            }
            case 'cekharga': {
                const harga = hargaManager.getHarga()
                return send(chatId,
                    `💰 *HARGA*\n👤 MEMBER\nVerif: ${rupiah(harga.hargaTiaaMember)}\nBulk: ${rupiah(harga.hargaBulkMember)}\n\n⭐ RESELLER\nVerif: ${rupiah(harga.hargaTiaaRess)}\nBulk: ${rupiah(harga.hargaBulkRess)}`,
                    getKeyboard(id))
            }
            case 'getip': {
                if (!isOwner(id)) return send(chatId, '❌ Khusus owner.', getKeyboard(id))
                const ip = await axios.get('https://api.ipify.org?format=json').then(r => r.data.ip).catch(() => 'Unknown')
                return send(chatId, `🌐 IP: ${ip}`, getKeyboard(id))
            }
            case 'ping':
            case 'runtime': {
                const ping = speed() - speed()
                return send(chatId, `⚡ Pong\nRuntime: ${runtime()}\nPing: ${Math.abs(ping).toFixed(4)}s`, getKeyboard(id))
            }
            default:
                return send(chatId, '❌ Perintah tidak dikenal.', getKeyboard(id))
        }
    } catch (error) {
        console.error(error)
        return send(chatId, `❌ Error: ${error.message}`, getKeyboard(id))
    }
})

console.log(`${global.namabot} Telegram bot started | ${new Date().toLocaleString('id-ID')}`)
