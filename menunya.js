const chalk = require('chalk')
const fs = require('fs')

global.menunya = (pushname, prefix, hituet) =>{
	return `
╭═┅═━━━ ⍟ 〔 *INFO MENU* 〕
│❖. developer 
│❖. grubbot
│❖. sewa
│❖. sc 
│❖. owner 
╰═┅═━━━━ • • ✦

╭═┅═━━━━ ⍟ 〔 *STORE MENU* 〕
│❖. list 
│❖. addlist
│❖. dellist
│❖. updatelist/update
│❖. setproses 
│❖. delsetproses
│❖. changeproses
│❖. setdone 
│❖. delsetdone
│❖. changedone
│❖. proses/p
│❖. done/d
│❖. setwelcome 
│❖. changewelcome
│❖. delsetwelcome
│❖. setleft
│❖. changeleft
│❖. delsetleft
│❖. tambah
│❖. kurang 
│❖. kali
│❖. bagi
╰═┅═━━━━ • • ✦

╭═┅═━━━━ ⍟ 〔 *GROUP MENU* 〕
│❖. antiwame
│❖. antiwame2
│❖. antilink
│❖. antilink2
│❖. welcome  [ on/off ]
│❖. goodbye  [ on/off ]
│❖. grup o/c
│❖. hidetag/h
│❖. tagall
│❖. kick
│❖. linkgc
│❖. resetlinkgc
│❖. setnamegc
│❖. setdesc
│❖. setppgroup
│❖. add
│❖. promote
│❖. demote
│❖. antilinkall
│❖. sendlinkgc
│❖. tagall
│❖. setwelcome 
│❖. changewelcome
│❖. delsetwelcome
│❖. setleft
│❖. changeleft
│❖. delsetleft
╰═┅═━━━━ • • ✦

╭═┅═━━━━ ⍟ 〔 *OWNER MENU* 〕
│❖. addsewa 
│❖. delsewa
│❖. listsewa 
│❖. join
│❖. out
│❖. kosong 
│❖. setopen 
│❖. setclose
│❖. anticall
│❖. public 
│❖. self
│❖. backup 
╰═┅═━━━━ • • ✦

╭═┅═━━━━ ⍟ 〔 *OTHER MENU* 〕
│❖. remini/hd/hdr
│❖. brat
│❖. regml
│❖. stiker/s
│❖. smeme
│❖. wm/stikerwm
│❖. qc
│❖. cekidml 
│❖. regml
│❖. cekidff
╰═┅═━━━━ • • ✦

╭═┅═━━━━ ⍟ 〔 *THANKS TO* 〕
│❖. tystore_id
│❖. all creator bot 
╰═┅═━━━━ • • ✦

_*Info tentang bot klik tombol dibawah*_
`
}

/*

JANGAN HAPUS THANKS TO DEKS :V
KALO MAU NARUH NAMA LU TARUH AJA

*/

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
})