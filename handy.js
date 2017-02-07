
var Jimp = require("jimp");
var Promise = require("bluebird");

var usr = "T"
var wid = 1280

// var count = {a:4, s:4, d:3, f:3, ' ':1}
var spacingVar = {KD:17, T:15}
var sizingVar = {KD:5, T:5.6}
var lineVar = {KD:51, T:46}

function normalizeHeights(usr){
	Promise.reduce(
		 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split("")
	   , (max, letter)=> Jimp.read(`./Letters/${usr}/${usr}_${letter}2.png`)
		    .then(image => image.bitmap.height > max ? image.bitmap.height : max)
	   , 0)
	.then(max => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split("").forEach(letter=>
		Jimp.read(`./Letters/${usr}/${usr}_${letter}2.png`)
		.then(img => img.background(0xFFFFFFFF).contain(img.bitmap.width, max, Jimp.VERTICAL_ALIGN_BOTTOM)
		.write(`./Letters/${usr}/${usr}_${letter}2_sized.png`))
	))
}
 //normalizeHeights("KD")
// Jimp.read(`./Letters/T/T_'1.png`)
// 		.then(img => img.background(0xFFFFFFFF).autocrop().resize(img.bitmap.width, 94, Jimp.VERTICAL_ALIGN_TOP).write(`./Letters/T/T_'1_sized.png`))
// var input = "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG"
function handWrite(input, user, wide){
	var textArr = input.toUpperCase().split("")
	user = lineVar[user] ? user : usr
	wide = wide < 250 ? wid : wide
	return Jimp.read(`./Letters/${user}/${user}_M1_sized.png`)
	.then(m=>{
		var maxChar = Math.floor(wide/m.bitmap.width)
		for(let i=maxChar; i < input.length; i+=maxChar){
	    	textArr[textArr.slice(0,i).lastIndexOf(' ')] = '\n';
		}
		var text = textArr.join("")
		console.log(text)
		var lines = text.split('\n').map(line=> line.split("").map(c =>
			Jimp.read(`./Letters/${user}/${user}_${c}1_sized.png`)))//1+Math.floor(count[c]*Math.random())

		var concatLetter = (line, c) => {
			let width = line.bitmap.width
			let spacing = Math.ceil(Math.random()*spacingVar[user])
			c = c.contain((1-Math.random()/sizingVar[user])*c.bitmap.width,
						  (1-Math.random()/sizingVar[user])*c.bitmap.height)
			return line.background(0xFFFFFFFF)
			.contain(width + c.bitmap.width + spacing, 100, Jimp.HORIZONTAL_ALIGN_LEFT)
			.composite( c, width + spacing, 100-c.bitmap.height )
		}
		var concatLine = (text, line) => {
			let height = text.bitmap.height
			let spacing = 20 + Math.ceil(Math.random()*lineVar[user])
			return text.background(0xFFFFFFFF)
			.contain(Math.max(text.bitmap.width, line.bitmap.width), height, Jimp.HORIZONTAL_ALIGN_LEFT)
			.contain(text.bitmap.width, height+100+spacing, Jimp.VERTICAL_ALIGN_TOP)
			.composite( line, 0, height + spacing )
		}
		return Promise.reduce(
			 Promise.map(lines, line => 
				Promise.reduce(line, concatLetter, Jimp.read(`./Letters/${user}/${user}_ 1_sized.png`)))
		   , concatLine
		   , Jimp.read(`./Letters/${user}/${user}_ 1_sized.png`))
		.then(text => text.background(0xFFFFFFFF)
			              .contain(text.bitmap.width + 50, text.bitmap.height, Jimp.HORIZONTAL_ALIGN_LEFT)
			              .contain(text.bitmap.width, text.bitmap.height + 100, Jimp.VERTICAL_ALIGN_TOP)
			              .write("./public/result.png"))
	}).catch(err => console.log(err));
}

module.exports = handWrite