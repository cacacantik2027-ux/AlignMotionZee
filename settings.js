const fs = require('fs')
const chalk = require('chalk')



global.namabot = "Floo Bot" // UBAH JADI NAMA LU
global.namaowner = "Floo" // NAMA OWNER
global.footer_text = "Floo" // NAMA BOT
global.pp_bot = fs.readFileSync("./image/allmenubot.jpg")
global.owner = ['6282395453692'] // UBAH NOMOR YANG MAU DI JADIKAN OWNER
global.ownerTelegram = ['ISI_ID_TELEGRAM_OWNER']
global.telegramToken = process.env.TELEGRAM_BOT_TOKEN || 'ISI_TOKEN_BOT_TELEGRAM'
global.packname = 'Floo Bot' //sticker wm ubah
global.author = 'Floo' //sticker wm ganti nama kalian

// PENTING \\
global.apiKeyAlightMotion = 'dlyyz-rest.apikey:f54be55c334bae30715cc2c15afb69cf'; // Your API key DLyyZ


// GA USAH DIUBAH\\
global.sessionName = 'session' // GAK USAH UBAH
global.prefa = ['', '!', '.', '🐦', '🐤', '🗿'] // GAK USAH UBAH
global.sewabot = ("owner")
global.fakelink = "-" // bebas asal jan hapus
global.grubbot = (`-`) // GANTI LINK GRUB BOT LU \\

// FALSE OR TRUE || GAK PENTING \\
global.autoTyping = false // BEBAS
global.welcome = false // KALO MAU AUTO WELCOME UBAH JADI true
global.left = false // KALO MAU AUTO LEFT UBAH JADI true
global.anticall = false // BEBAS
global.autoread = false // BEBAS

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
})