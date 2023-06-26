const fs = require("fs");
let fantasyTownName = require("./libs/names.json")
//var hexToBinary = require('hex-to-binary');
const { loadImage, createCanvas, Image, Canvas } = require("canvas");
//const NWGL = require("node-canvas-webgl")
const { uniqueNamesGenerator, names } = require("unique-names-generator");
const Discord = require("discord.js");
const moment = require("moment");
const client = new Discord.Client({partials:["REACTION"],intents:[Discord.Intents.FLAGS.GUILDS,Discord.Intents.FLAGS.GUILD_MESSAGES,Discord.Intents.FLAGS.DIRECT_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS]});
const deepcopy = require("deepcopy");
const HWDB = require("./libs/hawkwhisper").HWDB;
const HWDBTCP = require("./libs/hawkwhisper").HAWKTCP;
const key = require("./libs/key.json");
const dungeonGen = require("dungeoneer")
const express = require('express')
const app = express()
const port = 25565

const { isObject } = require("util");
const { resolve } = require("path");
const DataBase = new HWDB(
	["data", "data2"],
	".TEFS",
	{ key: key.key, oldEnc: true, publicExtensionName: true },
	(res) => {}
);
DataBase.newTableSync("users");
DataBase.newTableSync("properties");
DataBase.newTableSync("servers");
DataBase.newTableSync("NPCS");
DataBase.newTableSync("autoINC");
DataBase.newTableSync("ITEMS");

const extName = DataBase.getExtensionName();

let HAI,
	HOI,
	SHI,
	HYI,
	houseIMG,
	townhallIMG,
	mapIMG,
	skyMapImg,
	grassIMG,
	boulderIMG,
	HRC,
	mountainIMG,
	inventoryIMG,
	iconBook,
	iconPotion,
	iconSword,
	iconChest;

HRC = fs.readFileSync("./images/houseRuleChart.png");
loadImage(fs.readFileSync("./images/inventory.png")).then((HI) => {
	inventoryIMG = HI;
});
loadImage(fs.readFileSync("./images/book.png")).then((HI) => {
	iconBook = HI;
});
loadImage(fs.readFileSync("./images/sword.png")).then((HI) => {
	iconSword = HI;
});
loadImage(fs.readFileSync("./images/potion.png")).then((HI) => {
	iconPotion = HI;
});
loadImage(fs.readFileSync("./images/chest.png")).then((HI) => {
	iconChest = HI;
});
loadImage(fs.readFileSync("./images/grass.png")).then((HI) => {
	grassIMG = HI;
});
loadImage(fs.readFileSync("./images/houseShop.png")).then((HI) => {
	SHI = HI;
});
loadImage(fs.readFileSync("./images/mountain.png")).then((HI) => {
	mountainIMG = HI;
});
loadImage(fs.readFileSync("./images/boulder.png")).then((HI) => {
	boulderIMG = HI;
});
loadImage(fs.readFileSync("./images/houseAvailable.png")).then((HI) => {
	HAI = HI;
});
loadImage(fs.readFileSync("./images/houseOccupied.png")).then((HI) => {
	HOI = HI;
});
loadImage(fs.readFileSync("./images/houseYou.png")).then((HI) => {
	HYI = HI;
});
loadImage(fs.readFileSync("./images/cloudMap.png")).then((HI) => {
	skyMapImg = HI;
});
loadImage("images/townHall.png").then((img3) => {
	loadImage("images/house.png").then((img2) => {
		loadImage("images/toewnMap.png").then((img) => {
			houseIMG = img2;
			townhallIMG = img3;
			mapIMG = img;
		});
	});
});

app.use('/TE_IMGINFO_MAZEINFO', express.static(__dirname + '/images/mazeInfo',{etag:false}));
app.listen(port,()=>{

})

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
	client.user.setActivity("The Long Con", "PLAYING");
	let amount = "\n";
});

/**
 * 
 * @param {Discord.Message} DMO 
 * @param {any} message 
 */
function sendMessage(DMO, message,attachments = {}){
		if(DMO instanceof Discord.MessageReaction | Discord.PartialMessageReaction)DMO=DMO.message;
		if(message instanceof Discord.MessageAttachment){
		attachments.files = [message];
		return	DMO.channel.send(attachments)
		} else if(message instanceof Discord.MessageEmbed){
			attachments.embeds = [message]
		return	DMO.channel.send(attachments)
		} else {
			attachments.content = message
		return	DMO.channel.send(attachments)
		}
}

async function getFetchedUser(UUID){

	//return client.users.fetch(UUID)// | "undefined"//.then(a=>resolve(a)).catch(e=>resolve("undefined"))
	
	
	let result = await Promise.resolve(client.users.fetch(UUID));
	//console.log(result)
	return result || {username: "User Not Found"}
}

function getRandomXY(checkAgainst, boundingSize) {
	let x = Math.floor(Math.random() * 460) + 20;
	let y = Math.floor(Math.random() * 460) + 20;
	for (let i = 0; i < checkAgainst.length; i++) {
		if (!isInsideBoundingBox(checkAgainst[i], { x, y }, boundingSize)) {
			return getRandomXY(checkAgainst, boundingSize);
		}
	}
	return { x, y };
}

function createBattleSequence(town, userInfo, callback) {}

function getRandomClusterXY(checkAgainst, boundingSize, type) {
	let x = Math.floor(Math.random() * 500) + 20;
	let y = Math.floor(Math.random() * 500) + 20;

	//checkAgainst = checkAgainst.filter(e=>e.type != "mountain")

	for (let i = 0; i < checkAgainst.length; i++) {
		if (checkAgainst[i].type == "mountain") {
			if (isInsideBoundingBox(checkAgainst[i], { x, y }, boundingSize)) {
				return getRandomClusterXY(checkAgainst, boundingSize, type);
			}
		} else {
			if (!isInsideBoundingBox(checkAgainst[i], { x, y }, 30)) {
				return getRandomClusterXY(checkAgainst, boundingSize, type);
			}
		}
	}
	return { x, y ,type };
}

function createMountainCluster(boundingBox1 = [], type) {
	return [...Array(Math.floor(Math.random() * 6) + 3).keys()].reduce((cluster, _) => [...cluster,getRandomClusterXY([...cluster,...boundingBox1], 20, type)], []);
}

function isInsideBoundingBox(boundingBox1, boundingBox2, boundingSize) {
	let bb1x = boundingBox1.x;
	let bb1y = boundingBox1.y;
	let bb2x = boundingBox2.x;
	let bb2y = boundingBox2.y;
	if (
		Math.abs(bb1x - bb2x) < boundingSize &&
		Math.abs(bb1y - bb2y) < boundingSize
	) {
		return false;
	}
	return true;
}

function regenerateTown(town, callback) {
	let canvas = createCanvas(540, 540);
	let ctx = canvas.getContext("2d");
	ctx.font = "20px Morris Roman";
	ctx.drawImage(mapIMG, 0, 0); //draw map
	if (town.grassInfo == undefined) {
		town.grassInfo = [];
		for (let i = 0; i < Math.floor(Math.random() * 200) + 70; i++) {
			let getXY = getRandomXY([], 0);
			ctx.drawImage(grassIMG, getXY.x, getXY.y);
			town.grassInfo.push(getXY);
		}
		DataBase.newItemSync("properties", town.townName, town);
	} else {
		for (let grass of town.grassInfo) {
			ctx.drawImage(grassIMG, grass.x, grass.y);
		}
	}

	if (town.featureInfo != undefined) {
		for (let feature of town.featureInfo) {
			if (feature.type == "mountain") {
				ctx.drawImage(mountainIMG, feature.x, feature.y);
			}
		}
	} //redraw features if they exist.
	for (let houses of town.houseInfo) {
		ctx.beginPath();
		let totalOffset = 10;
		ctx.moveTo(houses.x + totalOffset, houses.y + totalOffset);
		if (houses.y + totalOffset > 500 / 2 + (totalOffset + 15)) {
			ctx.lineTo(500 / 2 + (totalOffset + 15), houses.y + totalOffset);
			ctx.lineTo(500 / 2 + (totalOffset + 15), 500 / 2 + (totalOffset + 15));
		} else {
			ctx.lineTo(500 / 2, houses.y + totalOffset);
			ctx.lineTo(500 / 2, 500 / 2 + (totalOffset + 15) + 35);
			ctx.lineTo(
				500 / 2 + (totalOffset + 15),
				500 / 2 + (totalOffset + 15) + 35
			);
		}

		ctx.stroke();
	} //redraw paths.
	for (let houses of town.houseInfo) {
		ctx.drawImage(houseIMG, houses.x, houses.y, 30, 30);
	} //redraw houses.

	ctx.drawImage(townhallIMG, 500 / 2, 500 / 2); //redraw townhall
	ctx.fillText(town.townName, 500 / 2 - town.townName.length, 40); //redraw name.
	fs.writeFileSync(
		town.townImage,
		canvas.toDataURL().replace(/^data:image\/png;base64,/, ""),
		"base64"
	);
	callback(canvas.toBuffer());
}

/**
 *
 * @param {Player} Player
 * @param {Discord.Message} message
 * @param {(buffer:Buffer)=>void} callback
 */
function loadInventorySystem(Player, message, callback) {
	let canvas = createCanvas(1080, 1334);
	let ctx = canvas.getContext("2d");
	let original = ctx.fillStyle;
	ctx.font = "30px sans-serif";
	ctx.drawImage(inventoryIMG, 0, 0);
	ctx.fillStyle = "#ffd700";
	ctx.fillText(message.author.username, 50, 65, 350);
	let data = Player.getData();
	let X = 50;
	let Y = 980;
	let Yoffset = 102;
	let maxWith = 70;
	let FE9 = 0;
	let icons = {
		item: iconChest,
		weapon: iconSword,
		spell: iconBook,
		consumable: iconPotion,
	};
	for (let item of data.inventory) {
		switch (FE9) {
			case 10:
			case 20:
			case 29:
				X = X - 102 * 10;
				break;
		}

		let YIconOffset = Y - 80;
		switch (FE9) {
			case 0:
			case 1:
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
			case 7:
			case 8:
			case 9:
				ctx.drawImage(icons[item.Type], X, YIconOffset);
				ctx.fillText(item.Quantity, X - 10, YIconOffset + 20);
				ctx.fillText(item.Name, X, Y, maxWith);
				break;
			case 10:
			case 11:
			case 12:
			case 13:
			case 14:
			case 15:
			case 16:
			case 17:
			case 18:
			case 19:
				ctx.drawImage(icons[item.Type], X, YIconOffset + Yoffset);
				ctx.fillText(item.Quantity, X - 10, YIconOffset + (Yoffset + 20));
				ctx.fillText(item.Name, X, Y + Yoffset, maxWith);
				break;
			case 20:
			case 21:
			case 22:
			case 23:
			case 24:
			case 25:
			case 26:
			case 27:
			case 28:
			case 29:
				ctx.drawImage(icons[item.Type], X, YIconOffset + Yoffset * 2);
				ctx.fillText(item.Quantity, X - 10, YIconOffset + (Yoffset * 2 + 20));
				ctx.fillText(item.Name, X, Y + Yoffset * 2, maxWith);
				break;
			case 30:
			case 31:
			case 32:
			case 33:
			case 34:
			case 35:
			case 36:
			case 37:
			case 38:
			case 39:
				ctx.drawImage(icons[item.Type], X, YIconOffset + Yoffset * 3);
				ctx.fillText(item.Quantity, X - 10, YIconOffset + (Yoffset * 3 + 20));
				ctx.fillText(item.Name, X, Y + Yoffset * 3, maxWith);
				break;
		}
		FE9++;
		X = X + 102;
	}
	ctx.fillText(`Gold: ${data.data.currency}`, 50, 850, 350);
	let skillSet = data.data.Skills;
	let jobSet = data.data.jobSkills;
	let comboject = { ...skillSet, ...jobSet };
	let multiY = 0;
	ctx.fillText("Skills:", 500, 65);

	for (let skill in comboject) {
		let skillValue = comboject[skill];
		ctx.fillText(
			`${skill}: ${
				skillValue === true
					? "yes"
					: skillValue === false
					? "no"
					: skillValue.toFixed(2)
			}`,
			500,
			105 + multiY
		);
		multiY += 30;
	}
	if (data.data.jobs.length > 0) {
		let job = data.data.jobs[0];
		//    for(let jobVals in job){
		//     let jobValue = job[jobVals];
		//     ctx.fillText(`${jobVals}: ${jobValue}`,500,125 + multiY);
		//     multiY += 30
		//    }

		ctx.fillText(`Current Job: ${job.jobtype}`, 500, 125 + multiY);
		let thisTime = new Date();
		let workTime = new Date();
		workTime.setTime(job.whenWorkDone);
		let timeLeft = new Date(workTime.getTime() - thisTime.getTime());
		if (timeLeft < 0) {
			ctx.fillText(`Time Left: Done`, 500, 155 + multiY);
		} else
			ctx.fillText(
				`Time Left: ${timeLeft.getMinutes().toString()} Minutes`,
				500,
				155 + multiY
			);
	}

	ctx.fillStyle = original;
	callback(canvas.toBuffer());
}

/**
 *
 * @param {number} size
 * @param {number} rows
 * @param {number} columns
 * @param {(buffer:Buffer)=>void} callback
 */
function generateMaze(size, rows, columns, callback) {
	let canvas = createCanvas(size, size);
	if (rows === "get") {

        if(DataBase.viewItemsSync("dungeons", 0).val.length > Number.parseInt(columns)){
		let minstance = new MazeInstnace("RGM" + columns);
        let maze = new Maze();
		maze.insertExistingMaze(minstance.getMazeData());
		maze.draw(canvas);

        }
	} else {
		let minstance = new MazeInstnace(
			"RGM" + DataBase.viewItemsSync("dungeons", 0).val.length
		);
		let maze = new Maze(size, rows, columns);
		maze.generate();
		minstance.setMazeData(maze);
		maze.draw(canvas);
	}

	callback(canvas.toBuffer());
}

class Maze {
	/**
     * @param {number} size
     * @param {number} rows
     * @param {number} columns
   //  * @param {Canvas} canvas
     */
	constructor(size, rows, columns) {
		this.size = size;
		this.rows = rows;
		this.columns = columns;
		this.initiated = false;
		this.grid = [];
		this.stack = [];
		this.mazeInfo = ""
		this.drawInfo = {
            isCenter: [],
            playersInMaze:[],
			specialLootTable: {},
		};
		this.firstDraw = true;
		this.current = null;
	}

	generate() {
		this.initiated = true;
		for (let r = 0; r < this.rows; r++) {
			let row = [];
			for (let c = 0; c < this.columns; c++) {
				let cell = new Cell(r, c, this.size);
				row.push(cell);
			}
			this.grid.push(row);
		}
		this.current = this.grid[0][0];
		while (this.runGeneration() != true);
		this.addRooms();
		let totalNumber = 0;
		this.mazeInfo = [];
		for (let r = 0; r < this.rows; r++) {
			this.mazeInfo[r] = []
			for (let c = 0; c < this.columns; c++) {
				let cell = this.grid[r][c];
				this.mazeInfo[r][c] = [];
				//00 is no wall
				//10 is wall
				//11 is corner wall
				if (r == 0 && c == 0) {
					cell.walls.topWall = false;
				}
				if (r == this.rows - 1 && c == this.columns - 1) {
					cell.walls.bottomWall = false;
				}

				let wallType = "topWall"
				//let topWall =
				cell.walls.topWall ? cell.isTopCorner ? this.mazeInfo[r][c].push("11") : this.mazeInfo[r][c].push("10") : this.mazeInfo[r][c].push("00")
				wallType = "bottomWall"
				//let bottomWall =
				cell.walls.bottomWall ? cell.isBottomCorner ? this.mazeInfo[r][c].push("11") : this.mazeInfo[r][c].push("10") : this.mazeInfo[r][c].push("00")
				wallType = "leftWall"
				//let leftWall =
				cell.walls.leftWall ? cell.isLeftCorner ? this.mazeInfo[r][c].push("11") : this.mazeInfo[r][c].push("10") : this.mazeInfo[r][c].push("00")
				wallType = "rightWall"
				cell.walls.rightWall ? cell.isRightCorner ? this.mazeInfo[r][c].push("11") : this.mazeInfo[r][c].push("10") : this.mazeInfo[r][c].push("00")
				cell.isRoomCenter ? this.mazeInfo[r][c].push("10") : this.mazeInfo[r][c].push("00");
				cell.isRoomCenter ? this.drawInfo.isCenter.push(totalNumber) : null;
				//console.log(this.mazeInfo[r][c].join(""))
				//let binhexResult = binaryToHex(this.mazeInfo[r][c].join("")).result;

				//this.mazeInfo[r][c] = binhexResult;

				//this.mazeInfo[r][c] = Object.fromEntries((this.mazeInfo[r][c]))
				//this.mazeInfo[r][c] = new Map().
				totalNumber++;
			}
			//this.mazeInfo[r] = this.mazeInfo[r].join("|").toString()
		//	totalNumber++;
		}
		//this.mazeInfo = this.mazeInfo.join("-")
		this.grid = [];
	}

	/**
	 * @param {Maze} maze
	 */
	insertExistingMaze(maze) {
		Object.assign(this, maze);
	}

	getNonCornerPiece() {
		let getRow = Math.floor(Math.random() * this.rows) + 1;
		let getCol = Math.floor(Math.random() * this.columns) + 1;
		let cellCol = this.grid[getCol];
		let cell;
		if (cellCol) {
			cell = cellCol[getRow];
		}

		if (cell && cell.isCorner) return this.getNonCornerPiece();
		return { row: getRow, column: getCol };
	}

	addRooms() {
		let rows = this.rows;
		let columns = this.columns;
		let roomAmnt =
			rows + columns < 40
				? 0
				: rows + columns < 80
				? Math.floor(Math.random() * 2) + 1
				: rows + columns < 120
				? Math.floor(Math.random() * 4) + 2
				: Math.floor(Math.random() * 6) + 3;
		for (let i = 0; i < roomAmnt; i++) {
			let rocol = this.getNonCornerPiece();
			let getRow = rocol.row;
			let getCol = rocol.column;
			for (let j = 0; j < 3; j++) {
				for (let k = 0; k < 3; k++) {
					let colCell = this.grid[getCol + j];
					if (colCell) {
						let cell = colCell[getRow + k];
						if (cell && !cell.isCorner) {
							if (getCol + 1 == getCol + j && getRow + k == getRow + 1) {
								cell.isRoomCenter = true;
							}

							cell.walls.leftWall = false;
							cell.walls.rightWall = false;
							cell.walls.bottomWall = false;
							cell.walls.topWall = false;
						}
						if(cell && cell.isCorner){
							//this.isLeftCorner = false;
							//this.isRightCorner = false;
							//this.isBottomCorner = false;
							//this.istopCorner = false;
							if(!cell.istopCorner){
								cell.walls.topWall = false;
							}
							if(!cell.isRightCorner){
								cell.walls.rightWall = false;
							}
							if(!cell.isBottomCorner){
								cell.walls.bottomWall = false;
							}
							if(!cell.isLeftCorner){
								cell.walls.leftWall = false;
							}

						}
					}
				}
			}
		}
	}

	draw(canvas) {
		if (this.initiated) {
			canvas.width = this.size;
			canvas.height = this.size;
			let context = canvas.getContext("2d");
			let original = context.fillStyle;
			context.fillStyle = "black";
			context.fillRect(0, 0, this.size, this.size);
			context.fillStyle = original;
			let totalNumber = 0;
			for (let r = 0; r < this.rows; r++) {
				for (let c = 0; c < this.columns; c++) {
					this.show(
						{ colNum: c, rowNum: r, coreNumb: totalNumber },
						this.size,
						this.rows,
						this.columns,
						context
					);
					totalNumber++;
				}
			//	totalNumber++;
			}
		} else {
			console.warn(
				"maze draw run before initiation, action canceled to prevent fatal error"
			);
		}
	}

	show(cell, size, rows, columns, canvas) {
		let x = (cell.colNum * size) / columns;
		let y = (cell.rowNum * size) / rows;

		canvas.strokeStyle = "white";
		canvas.fillStyle = "black";
		canvas.lineWidth = 2;
		//  console.log(cell.colNum + cell.rowNum)
		// console.log(this.drawInfo.hasTopWall)
		//top bottom left right
		//let MasterArray = this.mazeInfo.split("-")
		//let childArray = MasterArray[cell.rowNum].split("|")
		//let wallBin = hexToBinary(childArray[cell.colNum]).result
		//console.log(this.mazeInfo)
		let matchArray = this.mazeInfo[cell.rowNum][cell.colNum].join("").match(/.{1,2}/g)
		//matchArray.shift()
		//console.log(matchArray)
		if (matchArray[0] == "10" || matchArray[0] == "11")
			this.drawTopWall(x, y, size, columns, rows, canvas);
		if (matchArray[3] == "10" || matchArray[3] == "11")
			this.drawRightWall(x, y, size, columns, rows, canvas);
		if (matchArray[2] == "10" || matchArray[2] == "11")
			this.drawLeftWall(x, y, size, columns, rows, canvas);
		if (matchArray[1] == "10" || matchArray[1] == "11")
			this.drawBottomWall(x, y, size, columns, rows, canvas);
		//   console.log(this.drawInfo.isCenter)
		if (matchArray[4] == "10") {
			this.highlight(cell, this.columns, "red", canvas);
		}
	}

	/**
	 *
	 * @param {Cell} cell1
	 * @param {Cell} cell2
	 */
	removeWall(cell1, cell2) {
		let x = cell1.colNum - cell2.colNum;

		if (x == 1) {
			cell1.walls.leftWall = false;
			cell2.walls.rightWall = false;
		} else if (x == -1) {
			cell1.walls.rightWall = false;
			cell2.walls.leftWall = false;
		}

		let y = cell1.rowNumb - cell2.rowNumb;

		if (y == 1) {
			cell1.walls.topWall = false;
			cell2.walls.bottomWall = false;
		} else if (y == -1) {
			cell1.walls.bottomWall = false;
			cell2.walls.topWall = false;
		}
	}
/**
 *
 * @param {*} cell
 * @param {*} columns
 * @param {*} color
 * @param {CanvasRenderingContext2D} canvas
 * @param {*} addScaling
 */
	highlight(cell, columns, color, canvas, addScaling = 0,isMainCharacter = false) {
        //addScaling == undefined ? addScaling = 0 : null;
		let x = (cell.colNum * this.size) / (columns) + (1 + (addScaling / 2));
        let y = (cell.rowNum * this.size) / (columns) + (1 + (addScaling / 2));
		if(isMainCharacter){
		console.log("running Main Character")
		canvas.beginPath();
		canvas.arc(x+((this.size / columns - (3 + addScaling))/2),y+((this.size / columns - (3 + addScaling))/2), this.size / columns - (3 + addScaling) + 10, 0, 2 * Math.PI, false);
		canvas.fillStyle = '#ffffff60';
		canvas.fill();
		}
		canvas.fillStyle = color;
		canvas.fillRect(x, y, this.size / columns - (3 + addScaling), this.size / columns - (3 + addScaling));
	}

	drawTopWall(x, y, size, columns, rows, canvas) {
		canvas.beginPath();
		canvas.moveTo(x, y);
		canvas.lineTo(x + size / columns, y);
		canvas.stroke();
	}
	drawRightWall(x, y, size, columns, rows, canvas) {
		canvas.beginPath();
		canvas.moveTo(x + size / columns, y);
		canvas.lineTo(x + size / columns, y + size / rows);
		canvas.stroke();
	}
	drawBottomWall(x, y, size, columns, rows, canvas) {
		canvas.beginPath();
		canvas.moveTo(x, y + size / rows);
		canvas.lineTo(x + size / columns, y + size / rows);
		canvas.stroke();
	}
	drawLeftWall(x, y, size, columns, rows, canvas) {
		canvas.beginPath();
		canvas.moveTo(x, y);
		canvas.lineTo(x, y + size / rows);
		canvas.stroke();
	}

	checkNeighbours(cell) {
		let grid = this.grid; //.every((value,index)=>index <= cell.rowNumb);
		let row = cell.rowNumb;
		let col = cell.colNum;
		let neighbours = [];

		let top = row !== 0 ? grid[row - 1][col] : undefined;
		let right = col !== grid.length - 1 ? grid[row][col + 1] : undefined;
		let bottom = row !== grid.length - 1 ? grid[row + 1][col] : undefined;
		let left = col !== 0 ? grid[row][col - 1] : undefined;
		let isCornerPiece =
			col === 0 ||
			row === 0 ||
			col === grid.length - 1 ||
			row === grid.length - 1
				? grid[row][col]
				: undefined;

				//cols < >
				// rows are ^ v

		let isLeftCornerPiece = col === 0 ? grid[row][col] : undefined;
		let isRightCornerPiece = col === (grid.length - 1) ? grid[row][col] : undefined;
		let isTopCornerPiece = row === 0 ? grid[row][col] : undefined;
		let isBottomCornerPiece = row === (grid.length - 1) ? grid[row][col] : undefined;
		//left <
		//right >
		// if(!top) top.isCorner = true;
		// if(!right) right.isCorner = true;
		// if(!bottom) bottom.isCorner = true;
		// if(!left) left.isCorner = true;

		if (top && !top.visited) neighbours.push(top);
		if (right && !right.visited) neighbours.push(right);
		if (bottom && !bottom.visited) neighbours.push(bottom);
		if (left && !left.visited) neighbours.push(left);

		if(isLeftCornerPiece) isLeftCornerPiece.isLeftCorner = true;
		if(isRightCornerPiece) isRightCornerPiece.isRightCorner = true;
		if(isBottomCornerPiece) isBottomCornerPiece.isBottomCorner = true;
		if(isTopCornerPiece) isTopCornerPiece.isTopCorner = true;




		if (isCornerPiece) isCornerPiece.isCorner = true;
		// console.log(neighbours)

		if (neighbours.length !== 0) {
			let random = Math.floor(Math.random() * neighbours.length);
			//  console.log(random)
			return neighbours[random];
		} else {
			return undefined;
		}
	}
	runGeneration() {
		this.current.visited = true;
		let next = this.checkNeighbours(this.current);

		if (next) {
			next.visited = true;
			this.stack.push(this.current);
			this.removeWall(this.current, next);
			this.current = next;
		} else if (this.stack.length > 0) {
			let cell = this.stack.pop();
			this.current = cell;
		}

		if (this.stack.length == 0 && !this.firstDraw) {
			// for(let gridArr of this.grid){
			//     for(let cells of gridArr){
			//         cells.parentGrid = []
			//     }
			// }
			return true;
		}
		if (this.firstDraw) this.firstDraw = false;
	}
}

class Cell {
	/**
     * @param {number} rowNumb
     * @param {number} colNum
     * @param {Array} parentGrid
     * @param {number} parentSize
    // * @param {CanvasRenderingContext2D} canvas
     */
	constructor(rowNumb, colNum, parentSize, gridNumb) {
		this.rowNumb = rowNumb;
		this.colNum = colNum;
		this.parentSize = parentSize;
		this.isCorner = false;
		this.isLeftCorner = false;
		this.isRightCorner = false;
		this.isBottomCorner = false;
		this.istopCorner = false;
		this.lootTable = [];
		this.isRoomCenter = false;
		this.visited = false;
		this.walls = {
			topWall: true,
			bottomWall: true,
			leftWall: true,
			rightWall: true,
		};
	}
}

function generateDungeon(callback){

}

//let Dungeon = dungeonGen.build({width:25,height:25,seed:"flumptyJam"});
//console.log(JSON.stringify(Dungeon.toJS()))
// Dungeon.
// class Dungeon{

// }

function generateTown(callback,itr) {
	let canvas = createCanvas(540, 540);
	let ctx = canvas.getContext("2d");
	ctx.font = "20px Morris Roman";
	let townName;
	let houseArray = [];
	let grassArray = [];
	let featureArray = [];
	let mountainArray = [];

	ctx.drawImage(mapIMG, 0, 0);
	for (let i = 0; i < Math.floor(Math.random() * 200) + 70; i++) {
		let getXY = getRandomXY([], 0);
		ctx.drawImage(grassIMG, getXY.x, getXY.y);
		grassArray.push(getXY);
	}

	for (let i = 0; i < Math.floor(Math.random() * 20) + 12; i++) {
		let copyArray = [
			...houseArray,
			{ type: "townhall", x: 500 / 2, y: 500 / 2 },
		];
		let getRandom = getRandomXY(copyArray, 50);
		let x = getRandom.x;
		let y = getRandom.y;
		houseArray.push({ x, y, id: i, owner: null });
	}
	for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
		let mountainCollision = deepcopy(mountainArray);
		// mountainCollision.push(...mountainArray);
		mountainCollision.map((e) => (e.type = null));
		mountainArray.push(
			...createMountainCluster(
				[...houseArray, ...mountainCollision],
				"mountain"
			)
		);
	}
	console.log(mountainArray);
	featureArray.push(...mountainArray);
	for (let mountains of mountainArray) {
		ctx.drawImage(mountainIMG, mountains.x, mountains.y);
	}

	for (let houses of houseArray) {
		ctx.beginPath();
		let totalOffset = 10;
		ctx.moveTo(houses.x + totalOffset, houses.y + totalOffset);
		if (houses.y + totalOffset > 500 / 2 + (totalOffset + 15)) {
			ctx.lineTo(500 / 2 + (totalOffset + 15), houses.y + totalOffset);
			ctx.lineTo(500 / 2 + (totalOffset + 15), 500 / 2 + (totalOffset + 15));
		} else {
			ctx.lineTo(500 / 2, houses.y + totalOffset);
			ctx.lineTo(500 / 2, 500 / 2 + (totalOffset + 15) + 35);
			ctx.lineTo(
				500 / 2 + (totalOffset + 15),
				500 / 2 + (totalOffset + 15) + 35
			);
		}

		ctx.stroke();
	}

	for (let houses of houseArray) {
		ctx.drawImage(houseIMG, houses.x, houses.y, 30, 30);
	}

	//DataBase.newItem("properties",name)
	townName = townNameExistsCheck();
	ctx.drawImage(townhallIMG, 500 / 2, 500 / 2);
	ctx.fillText(townName, 500 / 2 - townName.length, 40);
	//ctx.rotate(0.1);
	// ctx.fillText("i ate 20 bagels",30,100)
	if(!itr){
	let shopOwnerNPC = new NPC(
		DataBase.viewItemsSync("NPCS", 0).val.length,
		"shopkeeper",
		"kobold",
		getViableNPCName()
	);
	shopOwnerNPC.setShopParameters();
	shopOwnerNPC.stockShopParameter();
	shopOwnerNPC.saveData(shopOwnerNPC.getData());
	houseArray[
		Math.floor(Math.random() * (houseArray.length - 1))
	].owner = shopOwnerNPC.getData().ID;
	console.log(shopOwnerNPC);
	DataBase.newItemSync("properties", townName, {
		townName,
		townImage: "./images/towns/" + townName + ".png",
		houseInfo: houseArray,
		featureInfo: featureArray,
		grassInfo: grassArray,
	});
	fs.writeFileSync(
		"./images/towns/" + townName + ".png",
		canvas.toDataURL().replace(/^data:image\/png;base64,/, ""),
		"base64"
	);
	}
	callback(townName, canvas.toBuffer());
}

function getViableNPCName() {
	let name = uniqueNamesGenerator({ dictionaries: [names] });
	if (DataBase.viewItemsSync("NPCS", 0).val.includes(name)) {
		return getViableNPCName();
	}
	console.log(name);
	return name;
}

function townNameExistsCheck(repeatAmount) {
	repeatAmount = Number.isInteger(repeatAmount) ? repeatAmount : 0;
	let random = Math.floor(Math.random() * fantasyTownName.length);
	name = fantasyTownName[random];
	name = name.replace(" ", "_");
	let exists = DataBase.viewItemsSync("properties", 0).val.includes(
		"TownData_" + name + "_file" + extName
	);
	if (exists) {
		repeatAmount++;
		if (repeatAmount > 25) {
			let trico = client.users.cache.get("105357779807535104");
			trico.send(JSON.stringify(new Error("repeat limit exceeded!")));
			throw new Error("repeat limit exceeded!");
		}
		return townNameExistsCheck(repeatAmount);
	} else {
		return name;
	}
}

class Registry {
	constructor(identifier) {
		this.Registry = {};
		identifier == undefined
			? (this.identifier = "ID")
			: (this.identifier = identifier);
		Object.defineProperty(this, "length", {
			get: function () {
				let size = 0,
					key;
				for (key in this.Registry) {
					if (this.Registry.hasOwnProperty(key)) size++;
				}
				return size;
			},
		});
	}

	get(num) {
		return this.Registry[num];
	}

	push(Item) {
		this.Registry[Item[this.identifier]] = Item;
	}

	getRegistry() {
		return this.Registry;
	}
}

class itemInstance {
	constructor(item) {
		this.item = deepcopy(item); //custom copy
		if (this.item.Quantity == undefined) this.item.Quantity = 1;
	}

	getQuantity() {
		return this.item.Quantity;
	}

	setQuantity(quantity) {
		this.item.Quantity = quantity;
		if (this.item.Quantity < 0) {
			console.log("you're going below acceptable quantity levels.");
			this.item.Quantity = 0;
		}
	}

	addQuantity(quantity) {
		this.item.Quantity += quantity;
	}

	removeQuantity(quantity) {
		this.item.Quantity -= quantity;
		if (this.item.Quantity < 0) {
			console.log("you're going below acceptable quantity levels.");
			this.item.Quantity = 0;
		}
	}

	getInstance() {
		return this.item;
	}
}

class JobRegistry {
	constructor() {
		this.JobRegistry = new Registry("name");
		this.init();
	}

	init() {
		this.registerJob(
			new Job(
				"coalmine",
				0.0,
				20,
				6,
				"you are now working in the coal mines.",
				(Skills) => true
			)
		);
		this.registerJob(
			new Job(
				"woodcutter",
				0.12,
				50,
				8,
				"you are now working in the forest, chopping down trees.",
				(Skills) => Skills.jobExperience >= 1
			)
		);
		this.registerJob(
			new Job(
				"housemaid",
				0.26,
				100,
				12,
				"you are now working as a housemaid, going from house to house.",
				(Skills) => Skills.jobExperience >= 2
			)
		);
		this.registerJob(
			new Job(
				"hunter",
				0.4,
				300,
				16,
				"you are now working in the forest, hunting deer and elk for their hide and flesh.",
				(Skills) =>
					Skills.jobExperience >= 4 &&
					Skills.animalExperience >= 2 &&
					Skills.agility >= 1
			)
		);
		this.registerJob(
			new Job(
				"guard",
				0.45,
				400,
				20,
				"you stand guard for a local shop owner.",
				(Skills) => Skills.jobExperience >= 5 && Skills.strength == 4
			)
		);
		this.registerJob(
			new Job(
				"farmgryphons",
				0.8,
				700,
				30,
				"you are feeding the younger gryphons and readying the adults for sale.",
				(Skills) => Skills.animalExperience >= 6 && Skills.jobExperience >= 5
			)
		);
	}
	/**
	 *
	 * @param {Job} job
	 */
	registerJob(job) {
		this.JobRegistry.push(job);
	}
	/**
	 * @returns {Registry}
	 */

	getRegistry() {
		return this.JobRegistry;
	}
}

class Job {
	/**
     * @param {string} name
     * @param {Number} complexity
     * @param {Number} earnable
     * @param {Number} minutes
     * @param {string} description
     * @param {({}:{
        jobExperience: Number,
        animalExperience:Number,
        strength:Number,
        agility:Number,
        gryphonStartupPaid:boolean
        })=>boolean} skillPredicate
     */
	constructor(
		name,
		complexity,
		earnable,
		minutes,
		description,
		skillPredicate
	) {
		this.name = name;
		this.complexity = complexity;
		this.earnable = earnable;
		this.minutes = minutes;
		this.description = description;
		this.skillPredicate = skillPredicate;
	}

	/**
	 *
	 * @param {Player} player
	 * @param {Discord.Message} message
	 */

	runJobConfiguration(player, message) {
		let usableData = player.getData();
		let thisDate = new Date();
		//  console.log(usableData)
		if (this.name != undefined) {
			if (
				!usableData.data.isWorking &&
				this.skillPredicate(usableData.data.Skills)
			) {
				usableData.data.jobSkills[this.name] == undefined
					? (usableData.data.jobSkills[this.name] = 1)
					: null;
				usableData.data.isWorking = true;
				usableData.data.jobs.push({
					jobtype: this.name,
					complexity: this.complexity,
					getworkAmount: Number.parseFloat(
						toFixed(this.earnable * usableData.data.jobSkills[this.name], 2)
					),
					workEfficiency: Number.parseFloat(
						(
							Math.random() *
								(0.5 + this.complexity - (0.15 + this.complexity)) +
							0.15
						).toFixed(2)
					),
					whenWorkDone: thisDate.getTime() + this.minutes * 60 * 1000,
				});
				player.saveData(usableData);
				sendMessage(message, 
					this.description + "\n worktime: " + this.minutes + " minutes."
				);
			} else if (this.skillPredicate(usableData.data.Skills)) {
				sendMessage(message, "you are already working.");
			} else {
				sendMessage(message, "you lack the required skill(s)");
			}
		}
	}
}

class ItemRegistry {
	constructor() {
		this.ItemRegistry = new Registry();
		this.init();
	}

	init() {
		this.registerItem("Iron Ingot", 50);
		this.registerItem("Silver Ingot", 175);
		this.registerItem("Gold Ingot", 50);
		this.registerItem("Diamond", 200);
		this.registerItem("Emerald", 225);
		this.registerWeapon("Sword", 100, 50, 1.0, 175);
		this.registerWeapon("Long Sword", 150, 100, 1.5, 120);
		this.registerWeapon("Spear", 110, 70, 2.0, 100);
		this.registerWeapon("Bow", 230, 110, 6, 180);
		this.registerConsumable("Potion of Healing", 50, 120, 0);
		this.registerConsumable("Potion of Stamina", 50, 0, 120);
		this.registerConsumable("Apple", 10, 40, 50);
		this.registerConsumable("Bread", 20, 50, 60);
		this.registerConsumable("Steak", 50, 70, 65);
		this.registerSpell("Healing", 100, 0, 1);
		this.registerSpell("Fire Ball", 120, 10, 1);
		this.registerSpell("Fire Storm", 120, 10, 1);
		this.registerSpell("Ice Ball", 120, 10, 1);
		this.registerSpell("Ice Storm", 120, 10, 1);
		this.registerSpell("Lightning Strike", 120, 10, 1);
		this.registerSpell("Lightning Storm", 120, 10, 1);
	}

	registerItem(name, value) {
		this.ItemRegistry.push(new Item(this.ItemRegistry.length, name, value));
	}
	registerWeapon(name, value, Damage, Range, Durability) {
		this.ItemRegistry.push(
			new Weapon(
				this.ItemRegistry.length,
				name,
				value,
				Damage,
				Range,
				Durability
			)
		);
	}
	registerConsumable(name, value, HP, AP) {
		this.ItemRegistry.push(
			new Consumable(this.ItemRegistry.length, name, value, HP, AP)
		);
	}
	registerSpell(name, value, range, scope) {
		this.ItemRegistry.push(
			new Spell(this.ItemRegistry.length, name, value, range, scope)
		);
	}

	getRegistry() {
		return this.ItemRegistry;
	}
}

class Item {
	constructor(ID, Name, value) {
		this.ID = ID;
		this.Name = Name;
		this.Type = "item";
		this.BaseValue = value;
	}
	getID() {
		return this.ID;
	}

	getName() {
		return this.Name;
	}

	setName(name) {
		this.Name = name;
	}

	getBaseValue() {
		return this.BaseValue;
	}

	setBaseValue(value) {
		this.BaseValue = value;
	}
}

class Weapon extends Item {
	constructor(ID, Name, value, Damage, Range, Durability) {
		super(ID, Name, value);
		this.Type = "weapon";
		this.Damage = Damage;
		this.Range = Range;
		this.Durability = Durability;
		this.Enchantments = [];
	}

	getDamage() {
		return this.Damage;
	}

	setDamage(damage) {
		this.Damage = damage;
	}

	getRange() {
		return this.Range;
	}

	setRange(range) {
		this.Range = range;
	}

	getDurability() {
		return this.Durability;
	}

	setDurability(durability) {
		this.Durability = durability;
	}

	getEnchantments() {
		return this.Enchantments;
	}

	setEnchantments(enchantments) {
		this.Enchantments = enchantments;
	}

	addEnchantment(enchantment) {
		this.Enchantments.push(enchantment);
	}
}

class Consumable extends Item {
	constructor(ID, Name, value, HP, AP) {
		super(ID, Name, value);
		this.Type = "consumable";
		this.HP = HP;
		this.AP = AP;
		this.Effects = [];
	}

	getHP() {
		return this.HP;
	}

	setHP(hp) {
		this.HP = hp;
	}

	getAP() {
		return this.AP;
	}

	setHP(ap) {
		this.AP = ap;
	}

	getEffects() {
		return this.Effects;
	}

	setEffects(effects) {
		this.Effects = effects;
	}

	addEffect(effect) {
		this.Effects.push(effect);
	}
}

class Spell extends Item {
	constructor(id, name, value, range, scope) {
		super(id, name, value);
		this.Type = "spell";
		this.range = range;
		this.scope = scope;
	}

	getRange() {
		return this.range;
	}

	getScope() {
		return this.scope;
	}
}

let itemRegistry = new ItemRegistry();

class DataInstancer {
	constructor(UID, table, fileLoc, type, race) {
		this.table = table;
		this.fileLoc = fileLoc;
		this.UID = UID;
		this.type = type;
		this.race = race;
		this.name = fileLoc;
		DataBase.newTableSync(this.table);
		let exists = DataInstancer.validInstance(this.table, this.fileLoc);
		if (exists) {
			this.dataInstance = DataBase.getGuaranteedItemSync(
				this.table,
				this.fileLoc
			).result[1];
		} else {
			this.dataInstance = this.defaultData();
			DataBase.newItemSync(this.table, this.fileLoc, this.dataInstance);
		}
	}

	static validInstance(table, fileLoc) {
		if (fileLoc.includes(extName)) fileLoc = fileLoc.replace(extName, "");
		return DataBase.viewItemsSync(table, 0).val.includes(fileLoc + extName);
	}

	defaultData() {
		return {};
	}

	saveData(data) {
		if (data == undefined) {
			DataBase.newItemSync(this.table, this.fileLoc, this.dataInstance);
		} else {
			this.dataInstance = data;
			DataBase.newItemSync(this.table, this.fileLoc, this.dataInstance);
		}
	}

	getData() {
		return this.dataInstance;
	}
}

class AdvancedDataInstancer {
	/**
	 * @param {{}} Variables An object that houses all variables you want to use inside defaultData().
	 * @param {string} table (Mandatory) the folder to which to house the file (for root directory usage use "./").
	 * @param {string} fileLoc (Mandatory) the name of the file (for instance: "testFile").
	 * @param {(table:string,filelocation:string,{})=>void} save (Mandatory) The save Lambda, a function that saves the file upon being called.
	 * @param {(table:string,filelocation:string)=>{}} load (Mandatory) The load Lambda, a function that returns the saved object upon being called.
	 * @param {(table:string,filelocation:string)=>boolean} exist (Mandatory) The exist Lambda, a function that checks if the file exists and returns it's boolean.
	 */
	constructor(Variables, table, fileLoc, save, load, exist) {
		this.table = table;
		this.fileLoc = fileLoc;
		this.Variables = Variables;
		this.save = save;
		this.load = load;
		this.exist = exist;
		let exists = DataInstancer.validInstance(
			this.table,
			this.fileLoc,
			this.exist
		);
		if (exists) {
			this.dataInstance = load(this.table, this.fileLoc);
		} else {
			this.dataInstance = this.defaultData();
			save(this.table, this.fileLoc, this.dataInstance);
		}
	}

	/**
	 *
	 * @param {string} table (Mandatory) the folder to which to house the file (for root directory usage use "./").
	 * @param {string} fileLoc (Mandatory) the name of the file (for instance: "testFile").
	 * @param {(table:string,filelocation:string)=>boolean} exist (Mandatory) The exist Lambda, a function that checks if the file exists and returns it's boolean.
	 */
	static validInstance(table, fileLoc, exist) {
		return exist(table, fileLoc);
	}

	/**
	 * @description defaultData is a method you want to overwrite whenever you extend DataInstancer, here you can house all your variables you want the saved object to have upon being created, use this.Variables to get any outside variables.
	 */
	defaultData() {
		return {};
	}

	/**
	 * @description saves the object data to file.
	 * @param {{}|null} data the data object, if left null, it will save the current instance (if you add more methods in the extended class that change this.dataInstance directly, calling saveData with null will save the instance to file.)
	 */
	saveData(data) {
		if (data == undefined) {
			this.save(this.table, this.fileLoc, this.dataInstance);
		} else {
			this.dataInstance = data;
			this.save(this.table, this.fileLoc, this.dataInstance);
		}
	}

	/**
	 * @description getData will get the dataInstance.
	 */
	getData() {
		return this.dataInstance;
	}
}

class MazeInstnace extends AdvancedDataInstancer {
	/**
	 *
	 * @param {string} mazeName
	 */
	constructor(mazeName) {
		super(
			{ mazeName },
			"dungeons",
			"MazeData_" + mazeName + "_file",
			(table, fileLoc, data) => DataBase.newItemSync(table, fileLoc, data),
			(table, fileLoc) =>
				DataBase.getGuaranteedItemSync(table, fileLoc).result[1],
			(table, fileLoc) => DataBase.itemExistSync(table, fileLoc, 0)
		);
	}

	setMazeData(maze) {
		this.dataInstance.mazeData = {
			size: maze.size,
			rows: maze.rows,
			columns: maze.columns,
			initiated: maze.initiated,
			drawInfo: maze.drawInfo,
			mazeInfo: maze.mazeInfo
			//drawInfo: maze.drawInfo,
		};
		this.saveData();
	}
	/**
	 * @returns {{}}
	 */
	getMazeData() {
		return this.dataInstance.mazeData;
	}

	defaultData() {
		return {
			name: this.Variables.mazeName,
			mazeData: undefined,
		};
	}
}

class EnemyRegistry {
	constructor() {
		this.enemyRegistry = new Registry("name");
		this.init();
	}

	init() {
		let iRegistry = itemRegistry.getRegistry();
		// let goblin = require("./enemies/goblin.json");
		// let goblinweapon = []
		//  this.registerEnemy(goblin.name,goblin.variants,goblin.damage,goblin.baseHP,goblin.nocturnal,goblin.diurnal,goblin.weapons)
		//  let wolf = require("./enemies/wolf.json");
		//  this.registerEnemy(wolf.name,wolf.variants,wolf.damage,wolf.baseHP,wolf.nocturnal,wolf.diurnal,wolf.weapons)
		let skeletonVariants = [
			{
				type: "cave",
				spawnChance: 0.2,
				holidayLocked: false,
				dmgModifier: 1.3,
			},
			{
				type: "ancient",
				spawnChance: 0.18,
				holidayLocked: false,
				dmgModifier: 1.5,
			},
			{
				type: "cursed",
				spawnChance: 0.13,
				holidayLocked: false,
				dmgModifier: 1.8,
			},
			{
				type: "spooky scary",
				spawnChance: 0.1,
				holidayLocked: "halloween",
				dmgModifier: 1.5,
			},
			{
				type: "golden",
				spawnChance: 0.03,
				holidayLocked: false,
				dmgModifier: 1.2,
			},
		];
		a = {
			damage: 20,
			baseHP: 100,
			nocturnal: true,
			diurnal: false,
			weapons: [
				{
					weapon: "dagger",
					dmgModifier: 1.2,
					range: 0.1,
					type: "melee",
				},
				{
					weapon: "sword",
					dmgModifier: 1.4,
					range: 0.3,
					type: "melee",
				},
				{
					weapon: "spear",
					dmgModifier: 1.5,
					range: 0.5,
					type: "melee",
				},
				{
					weapon: "bow",
					dmgModifier: 1.3,
					range: 1.2,
					type: "ranged",
				},
				{
					weapon: "trumbone",
					dmgModifier: 1.6,
					range: 1,
					type: "magic",
				},
			],
		};
		let skeleweapons = [iRegistry.get(6), iRegistry.get(8), iRegistry.get(9)];
		this.registerEnemy(
			"skeleton",
			skeletonVariants,
			20,
			100,
			true,
			false,
			skeleweapons
		);
	}

	registerEnemy(name, variants, damage, baseHP, nocturnal, diurnal, weapons) {
		let enemy = new Enemy(this.enemyRegistry.length, name);
		this.enemyRegistry.push(enemyData);
	}

	getRegistry() {
		return this.enemyRegistry;
	}
}

class Enemy extends DataInstancer {
	constructor(UID, name) {
		super(UID, "enemies", "enemy_" + name + "_file");
		this.name = name;
	}

	defaultData() {
		return {
			name: this.name,
			variants: [],
			damage: 0,
			baseHP: 0,
			nocturnal: false,
			diurnal: false,
			weapons: [],
		};
	}
}

class EnemyAIInstance {
	constructor(entity) {}
}

class Player extends DataInstancer {
	constructor(UID) {
		super(UID, "users", "UserData_" + UID + "_file");
	}

	defaultData() {
		return {
			user: this.UID,
			data: {
				currency: 0.0,
                jobs: [],
                dungeonLocationSystem:{},
				battleSystem: {},
				isWorking: false,
				workEfficiency: 1.0,
				jobSkills: {},
				Skills: {
					jobExperience: 0.0,
					animalExperience: 0.0,
					strength: 0.0,
					agility: 0.0,
					gryphonStartupPaid: false,
				},
				timeoutData: {
					isTimedOut: false,
					getTimeoutTimer: null,
				},
			},
			inventory: [],
            transports: [],
			allies: [],
			enemies: [],
			party: [],
			dmPrefix: "**",
		};
	}

	saveData(data) {
		if (data != undefined) {
			if (data.user != this.UID)
				throw new Error("Not valid data save attempt."); //if this happens, something's wrong, to prevent corruption, we throw an error.
		}
		super.saveData(data);
	}

	static validateWithDefault() {
		let users = DataBase.viewItemsSync("users", 0).val;
		for (let user of users) {
			user = user.replace(extName, "");
			if (DataInstancer.validInstance("users", user)) {
				let UID = user.replace("UserData_", "").replace("_file", "");
				let userInstance = new Player(UID);
				let userData = userInstance.getData();
				//  console.log("before update",userData.data)
				let DefaultState = userInstance.defaultData();
				let shouldUpdate = false;
				let result = checkInstanceDefaults(userData, DefaultState);
				shouldUpdate = result.shouldUpdate;

				if (shouldUpdate) {
					console.log("new Update");
					userInstance.saveData(result.userData);
				}
			} else {
				console.log("invalid user", user);
			}
		}
	}
}

function checkInstanceDefaults(userData, DefaultState) {
	let shouldUpdate = false;
	for (let state in DefaultState) {
		if (userData[state] === undefined) {
			console.log(userData[state]);
			userData[state] = DefaultState[state];
			shouldUpdate = true;
		}
		if (isObject(DefaultState[state])) {
			let objectified = checkInstanceDefaults(
				userData[state],
				DefaultState[state]
			);
			if (objectified.shouldUpdate) {
				shouldUpdate = objectified.shouldUpdate;
				// console.log("state",state,objectified.userData)
				userData[state] = objectified.userData;
			}
		}
	}
	return { shouldUpdate, userData };
}

class Server extends DataInstancer {
	constructor(UID) {
		super(UID, "servers", "ServerData_" + UID + "_file");
	}

	defaultData() {
		return {
			prefix: "**",
		};
	}

	saveData(data) {
		if (data.prefix == undefined)
			throw new Error("Not valid data save attempt."); //if this happens, something's wrong, to prevent corruption, we throw an error.
		super.saveData(data);
	}
}

class NPC extends DataInstancer {
	constructor(id, type, race, name) {
		super(id, "NPCS", name, type, race);
	}

	defaultData() {
		return {
			name: this.name,
			type: this.type,
			race: this.race,
			ID: this.UID,
		};
	}

	addDataToNPC(key, value) {
		this.dataInstance[key] = value;
	}

	setShopParameters() {
		this.type = "shopkeeper";
		this.dataInstance["wares"] = [];
		this.dataInstance["made"] = 0;
		this.dataInstance["has"] = 2000;
	}

	stockShopParameter() {
		let NPC = this.dataInstance;
		let coreWares = [];
		for (
			let i = 0;
			i < Math.floor(Math.random() * itemRegistry.getRegistry().length) + 4;
			i++
		) {
			let getItem = itemRegistry
				.getRegistry()
				.get(
					Math.floor(Math.random() * (itemRegistry.getRegistry().length - 1)) +
						0
				);
			if (!coreWares.includes(getItem)) {
				coreWares.push(getItem);
				let bool = Math.round(Math.random() * 1) == 1;
				let nbv =
					getItem.BaseValue +
					(bool
						? Number.parseInt(getItem.BaseValue / 24)
						: -Number.parseInt(getItem.BaseValue / 24));
				getItem.BaseValue = nbv;
				getItem.Quantity = Math.floor(Math.random() * 5) + 1;
				NPC.has = Math.floor(Math.random() * 3500) + 1500;
				NPC.wares.push(getItem);
			}
		}
	}

	saveData(data) {
		if (data == undefined) {
			super.saveData(data);
		} else {
			if (data.race == undefined)
				throw new Error("Not valid data save attempt."); //if this happens, something's wrong, to prevent corruption, we throw an error.
			super.saveData(data);
		}
	}
}

class Bot extends DataInstancer {
	constructor(UID) {
		super(UID,"CurrencyMaster","BOT_"+UID+"_file")
	}

	getAgreementArray(){
		return this.dataInstance.AgreementArray;
	}

	isUserInAgreementList(user){
		return this.dataInstance.AgreementArray.includes(user)
	}

	addUserToAgreementArray(userID){
		this.dataInstance.AgreementArray.push(userID)
		this.saveData();
	}

	/**
	 *
	 * @param {Discord.Message} message
	 */
	agreementMessage(message){
		sendMessage(message, "you have not yet agreed to the EULA, Please Accept the EULA to use this bot!");
		let embed = new Discord.MessageEmbed()
		.setDescription("This is the End of User License Agreement.")
		.addField("the bot can:","read your messages to execute commands.")
		.addField("the bot can:","use your UUID (Unique User ID) to save and load your user file.")
		.addField("the bot can:","reset your file if the bot's usage rules have been broken.")
		.addField("the bot can:","read, save, load and generate your user file.")
		.setFooter("react with the bottom two reactions to either agree or deny the EULA");
		sendMessage(message, embed).then(async msgg=>{
			await msgg.react("✅");
			await msgg.react("🚫");
			reactionLogCache.agreementEULACache[msgg.id] = {UID:message.author.id}
		})
	}

	defaultData(){
		return {
			AgreementArray: []
		}
	}
}

class NPCRegistry {
	constructor() {
		this.NPCS = new Registry();
	}

	init() {
		let NPCNames = DataBase.viewItemsSync("NPCS", 0).val;
		for (let npc of NPCNames) {
			npc = npc.replace(extName, "");
			this.NPCS.push(DataBase.getGuaranteedItemSync("NPCS", npc).result[1]);
		}
	}
}

function getFitsIn(a,b){
let i = a % b;
let i2 = a - i;
let solution = i2 / b;
return solution
}



ActivateTickInterval();
//let TOD, HOD, MOD, SOD;
function tick(manual) {
	let time = new Date();
	if ((time.getMinutes() == "00" && time.getHours() % 2 == 0) || manual == "stockManually") {
		let NPCS = new Registry();
		let NPCNames = DataBase.viewItemsSync("NPCS", 0).val;
		for (let npc of NPCNames) {
			npc = npc.replace(extName, "");
			NPCS.push(DataBase.getGuaranteedItemSync("NPCS", npc).result[1]);
		}

		for (let NPC in NPCS.getRegistry()) {
			NPC = NPCS.get(NPC);
			let coreWares = [];
			NPC.wares = [];
			for (let i = 0; i < Math.floor(Math.random() * itemRegistry.getRegistry().length) + 4; i++) {
				let getItem = itemRegistry.getRegistry().get(Math.floor(Math.random() * (itemRegistry.getRegistry().length - 1)) + 0);
				if (!coreWares.includes(getItem)) {
					coreWares.push(getItem);
					let bool = Math.round(Math.random() * 1) == 1;
					let nbv =
						getItem.BaseValue +
						(bool
							? Number.parseInt(getItem.BaseValue / 24)
							: -Number.parseInt(getItem.BaseValue / 24));
					// console.log(getItem.Name,bool,nbv)
					getItem.BaseValue = nbv;
					getItem.Quantity = Math.floor(Math.random() * 5) + 1;
					NPC.has = Math.floor(Math.random() * 3500) + 1500;
					NPC.wares.push(getItem);
				}
			}

			DataBase.newItemSync("NPCS", NPC.name, NPC);
		}
		console.log("socked!", time.getHours());
	}
	//sunday 1
	//monday 2
	//thuesday 3
	//wednesday 4
	//thurseday 5
	//friday 6
	//saturday 7

	if(((time.getDate() == "1" && time.getHours() == "0" && time.getMinutes() == "00")) || manual == "genMazeLoot"){
		console.time("fill:D")
		let mazes = DataBase.viewItemsSync("dungeons",0).val;
		for(let i = 0; i < mazes.length; i++){
			let minstance = new MazeInstnace("RGM" + i);
            let mazeInstance = new Maze();
			mazeInstance.insertExistingMaze(minstance.getMazeData())
			mazeInstance.drawInfo.specialLootTable = {}//empting the original;
			for(let center of mazeInstance.drawInfo.isCenter){
				mazeInstance.drawInfo.specialLootTable[center.toString()] = []
				let coreWares = [];
				for (let i = 0; i < Math.floor(Math.random() * 6) + 3; i++) {
					let getItem = itemRegistry.getRegistry().get(Math.floor(Math.random() * (itemRegistry.getRegistry().length - 1)) + 0);
					if (!coreWares.includes(getItem)) {
						coreWares.push(getItem);
						let bool = Math.round(Math.random() * 1) == 1;
						let nbv = getItem.BaseValue + (bool ? Number.parseInt(getItem.BaseValue / 24) : -Number.parseInt(getItem.BaseValue / 24));
						getItem.BaseValue = nbv;
						getItem.Quantity = Math.floor(Math.random() * 5) + 1;
						mazeInstance.drawInfo.specialLootTable[center.toString()].push(getItem)
					}
				}
			}
			minstance.setMazeData(mazeInstance)
			//console.table(mazeInstance);
		}
		console.timeEnd("fill:D")
		console.log("filled MazeRoom!", time.getMonth()+1)
	}
	// let momenta = moment()
	// let midnight = momenta.clone().startOf("day");
	// let difference = momenta.diff(midnight,"seconds")
	// console.log(getFitsIn(difference,60))
//	let SOD = (difference)

	// if (time.getMinutes() == "00") {
	// 	TOD = time.getHours() % 2 == 0 ? "day" : "night";
	// }

	// if (time.getMinutes() == "00") HOD = 0;
	// else HOD = (12 / 60) * time.getMinutes();
}
function miniTick(){

}

function ActivateTickInterval() {
	setInterval(tick, 60000);
	//setInterval(miniTick,1000/20)
}

Player.validateWithDefault();

let jobRegistry = new JobRegistry();

const reactionLogCache = {
	mazeMovementCache:{},
	agreementEULACache:{}

}




client.on("messageCreate", async (message) => {
	if (message.author.bot && message.author.id != "604792661198635195") return;
	//message.guild.channels.cache.get()
	let date = new Date();
	let notDMS = message.channel.type !== "dm";
	let bot = new Bot(client.user.id);

	// if (message.content === '!join') {
	// 	client.emit('guildMemberAdd', message.member);
	// }

	let player;
	let prefix;
	let serverData;
	if (notDMS) {
		serverData = new Server(message.guild.id);
		prefix = serverData.getData().prefix;
	} else {

		if(bot.isUserInAgreementList(message.author.id)){
			player = new Player(message.author.id);
			prefix = player.getData().dmPrefix;
		} else {
			prefix = "**"
		}

	}
	if (!message.content.startsWith(prefix)) return;

	if(!bot.isUserInAgreementList(message.author.id)){
		bot.agreementMessage(message)
		return;
	}

	if (notDMS) {
		player = new Player(message.author.id);
	}

	let NPCS = new Registry();
	let NPCNames = DataBase.viewItemsSync("NPCS", 0).val;
	for (let npc of NPCNames) {
		npc = npc.replace(extName, "");
		//console.log(npc)
		//console.log(DataBase.getGuaranteedItemSync("NPCS", npc))
		NPCS.push(DataBase.getGuaranteedItemSync("NPCS", npc).result[1]);
	}

	if (player.getData() == null) {
		let trico = client.users.cache.get("105357779807535104");
		trico.send(
			"user " +
				message.author.id +
				" has fully corrupt files and will be defaulted.\n\n" +
				JSON.stringify(usableData.err)
		);
		message.author.dmChannel.send(
			"your account has been corrupted, my creator has been notified and will contact you shortly."
		);
		return;
	}

	let usableData = player.getData();

	if (
		usableData.data.timeoutData.getTimeoutTimer != null &&
		usableData.data.timeoutData.isTimedOut
	) {
		let getDBDate2 = new Date();
		getDBDate2.setTime(usableData.data.timeoutData.getTimeoutTimer);

		if (
			(
				(getDBDate2.getTime() - new Date().getTime()) /
				(1000 * 60 * 60)
			).toFixed(1) <= 0
		) {
			usableData.data.timeoutData.isTimedOut = false;
			usableData.data.timeoutData.getTimeoutTimer = null;
			//DataBase.newItemSync("users",fileLoc,usableData)
			player.saveData(usableData);
			//DataBase.update({user:message.author.id},usableData)
		}
	}

	let contentArray = message.content.split(" ");

	if (contentArray[0].toLowerCase() == prefix + "prefix")
		if (notDMS) {
			if (
				contentArray.length == 2 &&
				message.member.hasPermission("ADMINISTRATOR") ||
				contentArray.length == 2 &&
				message.author.id == "105357779807535104"
			) {
				let sData = serverData.getData();
				sData.prefix = contentArray[1];
				serverData.saveData(sData);
				sendMessage(message, "New prefix " + contentArray[1]);
			} else {
				sendMessage(message, "Current prefix " + prefix);
			}
		} else {
			if (contentArray.length == 2) {
				if (contentArray[1] == "emptyprefix") {
					usableData.dmPrefix = "";
				} else {
					usableData.dmPrefix = contentArray[1];
				}
				player.saveData(usableData);
				sendMessage(message, "New DM prefix " + contentArray[1]);
			} else {
				sendMessage(message, "DM Prefix: " + prefix);
			}
		}

	if (contentArray[0].toLowerCase() == prefix + "battle") {
    }

    if(contentArray[0].toLowerCase() == prefix + "runmaze"){
		console.time("runMazeCommand")
        let maze = contentArray[1] != undefined && !Number.isNaN(Number.parseInt(contentArray[1])) ? contentArray[1] : false;
		let exist = DataBase.viewItemsSync("dungeons", 0).val.length > Number.parseInt(contentArray[1]) ? true : false;
		//maze != null

		if(maze && exist){
            let minstance = new MazeInstnace("RGM" + maze);
            let mazeInstance = new Maze();
            mazeInstance.insertExistingMaze(minstance.getMazeData())
            let canvas = createCanvas(mazeInstance.size,mazeInstance.size)
            let UserMazeData = usableData.data.dungeonLocationSystem["RGM" + maze]

            if(!mazeInstance.drawInfo.playersInMaze.includes(message.author.id)){
                UserMazeData = {userPos:0,foundItems:{}}
                usableData.data.dungeonLocationSystem["RGM" + maze] = UserMazeData;
                mazeInstance.drawInfo.playersInMaze.push(message.author.id)
                minstance.setMazeData(mazeInstance)
                player.saveData(usableData)
                sendMessage(message, "you have entered the maze, be aware of enemies, look for rooms (red quares) to find loot.")
            }


            if(!UserMazeData.foundItems[UserMazeData.userPos] && mazeInstance.drawInfo.specialLootTable[UserMazeData.userPos]){
                UserMazeData.foundItems[UserMazeData.userPos] = mazeInstance.drawInfo.specialLootTable[UserMazeData.userPos];
                usableData.data.dungeonLocationSystem["RGM" + maze] = UserMazeData;
                player.saveData(usableData);
                sendMessage(message, "you found: ")
                for(let loot of mazeInstance.drawInfo.specialLootTable[UserMazeData.userPos]){
                    sendMessage(message, loot.Quantity.toString() + " " + loot.Name);
                }

            }

            mazeInstance.draw(canvas);
            let playerColor
            if(notDMS)
            playerColor = message.member.displayHexColor == "#000000" ? "#ffffff" : message.member.displayHexColor;
            else
            playerColor = "#ffffff";
            console.log(
               playerColor
           )


            let i = UserMazeData.userPos % mazeInstance.columns;
            let i2 = UserMazeData.userPos - i;
            let solution = i2 / mazeInstance.columns;
            let XPos = solution;
            let YPos = UserMazeData.userPos - (mazeInstance.columns * XPos)
			console.log(YPos,XPos)
			renderPlayersInMaze(mazeInstance,playerColor,[XPos,YPos,message.author.id,"RGM" + maze],canvas)
            //mazeInstance.highlight({rowNum:XPos,colNum:YPos},mazeInstance.columns,playerColor,canvas.getContext("2d"), 5)

            fs.writeFileSync(
                "./images/mazeInfo/"+message.author.id+"_mazeRun.png",
                canvas.toDataURL().replace(/^data:image\/png;base64,/, ""),
                "base64"
            );

         //   sendMessage(message, a).then(mess=>{
                let exampleEmbed = new Discord.MessageEmbed()
                exampleEmbed.setImage("http://88.159.68.43:25565/TE_IMGINFO_MAZEINFO/"+message.author.id+"_mazeRun.png?"+Math.floor(Math.random() * Number.MAX_SAFE_INTEGER))
                sendMessage(message, exampleEmbed).then(async msgg=>{

				await msgg.react("⬆️")
				await msgg.react("⬅️")
				await msgg.react("🚪")
				await msgg.react("➡️")
                await msgg.react("⬇️")
				//console.log(reactionLogCache)
                reactionLogCache.mazeMovementCache[msgg.id] = {userId:message.author.id,mazeName:maze}
                })

           // })

          //let msg = sendMessage(message, {files:[a],embed:exampleEmbed});


        } else {
        	sendMessage(message, "invalid maze");
        }
		console.timeEnd("runMazeCommand")
		return;
    }

	if(contentArray[0].toLowerCase() == prefix+"validatenpcexistintown"){

		for(let ins of fs.readdirSync("./data/properties")){
			let getTown = DataBase.getGuaranteedItemSync(
				"properties",
				ins.replace(extName, "")
			).result[1];



			for(let house of getTown.houseInfo){
				if(typeof(house.owner) === "number"){
					//console.log()
					if(NPCS.get(house.owner) == undefined){
					console.log("new npc! ID:", house.owner)
					// if(NPCS)
					let shopOwnerNPC = new NPC(
					house.owner,
					"shopkeeper",
					"kobold",
					getViableNPCName()
					);
					}
					//console.log("npc! ID:", house.owner)
					// if(NPCS)
					// let shopOwnerNPC = new NPC(
					// house.owner,
					// "shopkeeper",
					// "kobold",
					// getViableNPCName()
					// );
				}
			}

			//console.log(getTown)
		}





		// let shopOwnerNPC = new NPC(
		// 	DataBase.viewItemsSync("NPCS", 0).val.length,
		// 	"shopkeeper",
		// 	"kobold",
		// 	getViableNPCName()
		// );
	}


	if (contentArray[0].toLowerCase() == prefix + "testdata") {
		// sendMessage(message, jobRegistry.getRegistry().get("coalmine"));
		// console.log(jobRegistry.getRegistry().get("hunter"))
		// generateMaze((buff)=>{
		//     console.log("AAA")
		//     let a = new Discord.MessageAttachment(buff)
		//     sendMessage(message, a)
		// })
		// let canvas = createCanvas(1080,1080)
		// let maze = new Maze(1080,30,30,canvas);
        // maze.setup()

        let colrows = contentArray[1] != undefined && !Number.isNaN(Number.parseInt(contentArray[1])) ? Number.parseInt(contentArray[1]) : 50;
        let mazeres = contentArray[2] != undefined && !Number.isNaN(Number.parseInt(contentArray[2])) ? Number.parseInt(contentArray[2]) : 1080;

		if (contentArray[1] != undefined && contentArray[1] == "get") {

            if(contentArray[2] == undefined && Number.isNaN(Number.parseInt(contentArray[2]))) return sendMessage(message, "invalid number")

            generateMaze(1080, "get", contentArray[2], (canvasBuffer) => {
				let a = new Discord.MessageAttachment(canvasBuffer);
				sendMessage(message, a);
			});
		} else {
			generateMaze(mazeres, colrows, colrows, (canvasBuffer) => {
				let a = new Discord.MessageAttachment(canvasBuffer);
				sendMessage(message, a);
			});
		}
	}

	if (contentArray[0].toLowerCase() == prefix + "search") {
		if (contentArray[1] != undefined) {
			if (DataBase.itemExistSync("properties", contentArray[1], 0)) {
				let getTown = DataBase.getItemSync("properties", contentArray[1])
					.val[0][1];
				let grassAmount = getTown.grassInfo.length;
				let chanceMax = 3;
				let chanceMin = 0;
				let rand =
					Math.floor(Math.random() * (chanceMax - grassAmount / 200)) +
					chanceMin;
				// console.log(rand)
				if (rand == 2) {
					let getAmt = Math.floor(Math.random() * 75) + 10;
					usableData.data.currency += getAmt;
					//DataBase.newItemSync("users",fileLoc,usableData);
					player.saveData(usableData);
					sendMessage(message, "you found: " + getAmt + " gold");
				} else {
					sendMessage(message, "nothing found");
				}
			}
		}
	}

	if (contentArray[0].toLowerCase() == prefix + "help") {
		let modifiedPrefix = prefix.replace("**", "\\*\\*");
		let all = `
    ${modifiedPrefix}preifx (OPTIONAL: prefix) {shows or sets prefix};
    ${modifiedPrefix}help {shows you this help section}
    ${modifiedPrefix}balance {shows you your current balance}
    ${modifiedPrefix}town[or towns] (OPTIONAL: "townname") {shows list of towns or map of town (if second argument is given.)}
    ${modifiedPrefix}buyproperty (OPTIONA: "townname" || OPTIONAL: buy || "house ID") {this command has multiple optional arguments, no arguments is a list of all towns and how many houses are available and who owns the occupied houses, 1 argument gives you a modified map of that town that shows you what houses are available, occupied or owned by you. 2 and 3 arguments is buying a house, with argument 2 being buy and 3 the ID of the house you wanna buy (see previous arguments).}
    ${modifiedPrefix}daily {receive daily 100 gold}
    ${modifiedPrefix}lessons (OPTIONAL: "type") {no arguments given shows you a list of the lessons you can take. if argument is given it will raise your skill in that skill if you have sufficient funds.}
    ${modifiedPrefix}me {shows you your status}
    ${modifiedPrefix}payday {if you have finished your job (see jobs) payout along with skill and job experience will be given}
    ${modifiedPrefix}jobs (OPTIONAL: "job") {if no argument is provided it will show you the list of available jobs as well as their given requirements (if they have them), when argument provided it will attempt to give you set job if you meet the requirements.}
    `;
		all = all.replace(/\|\|/gms, "\\|\\|");
		for (let i = 0; i < all.length; i += 2000) {
			sendMessage(message, all.substring(i, i + 2000), { split: true });
		}
	}

	if (contentArray[0].toLowerCase() == prefix + "balance") {
		sendMessage(message, "you have " + usableData.data.currency + " gold");
	}

	if (
		contentArray[0].toLowerCase() == prefix + "regeneratealltownmap" &&
		message.author.id == "105357779807535104"
	) {
		let towns = DataBase.viewItemsSync("properties", 0).val;
		let readyTowns = towns.map((val) => val.replace(extName, ""));
		sendMessage(message, 
			"WARNING, you are regenerating all town maps, do not overuse this command!"
		);
		for (let town of readyTowns) {
			let getTown = DataBase.getGuaranteedItemSync("properties", town)
				.result[1];
			regenerateTown(getTown, (twnIMG) => {
				let attch = new Discord.MessageAttachment(
					twnIMG,
					getTown.townName + ".png"
				);
				sendMessage(message, 
					"Town " + getTown.townName + " map regenerated!",
					attch
				);
			});
		}
	}

	if (
		contentArray[0].toLowerCase() == prefix + "tgm" &&
		message.author.id == "105357779807535104"
	) {
		generateTown((name, img) => {
			let attat = new Discord.MessageAttachment(img);
			sendMessage(message, "town generated!\nname: " + name, attat);
		},true);
	}

	if (
		contentArray[0].toLowerCase() == prefix + "regeneratetownmap" &&
		message.author.id == "105357779807535104"
	) {
		let towns = DataBase.viewItemsSync("properties", 0).val;
		let lowercaseTowns = towns.map((val) =>
			val.toLowerCase().replace(extName.toLowerCase(), "")
		);
		if (
			contentArray[1] != undefined &&
			lowercaseTowns.indexOf(contentArray[1].toLowerCase()) != -1
		) {
			let getIndexOfLowercase = lowercaseTowns.indexOf(
				contentArray[1].toLowerCase()
			);
			let getTown = DataBase.getGuaranteedItemSync(
				"properties",
				towns[getIndexOfLowercase].replace(extName, "")
			).result[1];
			regenerateTown(getTown, (twnIMG) => {
				let attch = new Discord.MessageAttachment(
					twnIMG,
					getTown.townName + ".png"
				);
				sendMessage(message, 
					"Town " + getTown.townName + " map regenerated!",
					attch
				);
			});
		} else {
			sendMessage(message, "invalid town name");
		}
	}

	if (
		contentArray[0].toLowerCase() == prefix + "restock" &&
		message.author.id == "105357779807535104"
	) {
		tick("stockManually");
		sendMessage(message, "Shops Resocked");
	}

	if(contentArray[0].toLowerCase() == prefix + "fillmazechambers" && message.author.id == "105357779807535104"){
		tick("genMazeLoot");
		sendMessage(message, "Filled Maze Chambers!");
	}

	if (
		contentArray[0].toLowerCase() == prefix + "createtown" &&
		message.author.id == "105357779807535104"
	) {
		generateTown((name, img) => {
			let attat = new Discord.MessageAttachment(img);
			sendMessage(message, "town generated!\nname: " + name, attat);
		});
	}

	if (
		contentArray[0].toLowerCase() == prefix + "towns" ||
		contentArray[0].toLowerCase() == prefix + "town"
	) {
		let towns = DataBase.viewItemsSync("properties", 0).val;
		if (contentArray.length == 1) {
			towns = towns.map((val) => val.replace(extName, ""));
			sendMessage(message, towns.join("\n"), { split: true });
			return;
		}
		let lowercaseTowns = towns.map((val) =>
			val.toLowerCase().replace(extName.toLowerCase(), "")
		);
		if (lowercaseTowns.indexOf(contentArray[1].toLowerCase()) != -1) {
			let getIndexOfLowercase = lowercaseTowns.indexOf(
				contentArray[1].toLowerCase()
			);
			let getTown = DataBase.getGuaranteedItemSync(
				"properties",
				towns[getIndexOfLowercase].replace(extName, "")
			).result[1];
			if (contentArray.length == 2) {
				sendMessage(message, getTown.townName, { files: [getTown.townImage] });
				return;
			}
			if (contentArray[2].toLowerCase() == "shop") {
				let shop = getTown.houseInfo.find(
					(e) => typeof e.owner == typeof 0 && NPCS.get(e.owner) != undefined
				);
				if (shop == undefined) {
					sendMessage(message, "this town doesn't have a shop");
					return;
				}
				shop = NPCS.get(shop.owner);
				if (contentArray[3] != undefined) {
					let item = shop.wares.find(
						(e) =>
							e.Name.toLowerCase().replace(/ /gms, "_") ==
							contentArray[3].toLowerCase()
					); //.slice(3,contentArray.length).join(" ").toLowerCase()
					let indexItem = shop.wares.indexOf(item);
					if (item != undefined) {
						let qntt =
							contentArray[4] != undefined &&
							Number.isInteger(Number.parseInt(contentArray[4]))
								? Number.parseInt(contentArray[4])
								: 1;
						//console.log(qntt)
						if (usableData.data.currency >= item.BaseValue * qntt) {
							if (shop.wares[indexItem].Quantity < qntt)
								return sendMessage(message, 
									"this shop owner does not have enough of this item"
								);
							usableData.data.currency -= item.BaseValue * qntt;
							if (item.Quantity == undefined)
								shop.wares[indexItem].Quantity = 1;
							shop.wares[indexItem].Quantity -= qntt;
							if (shop.wares[indexItem].Quantity <= 0) {
								shop.wares.remove(item);
							}
							let boughtItem = new itemInstance(item); //itemRegistry.getRegistry().get(item.ID);
							boughtItem.setQuantity(qntt);
							let getPlayerItem = usableData.inventory.find(
								(e) => e.ID == boughtItem.getInstance().ID
							);
							if (getPlayerItem != undefined) {
								let index = usableData.inventory.indexOf(getPlayerItem);
								usableData.inventory[index].Quantity += qntt;
							} else {
								usableData.inventory.push(boughtItem.getInstance());
							}
							shop.has += item.BaseValue * qntt;
							shop.made += item.BaseValue * qntt;
							DataBase.newItemSync("NPCS", shop.name, shop);
							player.saveData(usableData);
							sendMessage(message, 
								"you bought " +
									qntt +
									" " +
									item.Name +
									" for " +
									item.BaseValue * qntt +
									" Gold"
							);
						} else {
							sendMessage(message, "insufficient funds");
						}
					} else {
						sendMessage(message, "this shop owner does not have this item.");
					}
					return;
				}
				let ATTCH = new Discord.MessageAttachment(
					"./images/houseShop.png",
					"HS.png"
				);
				let msgEmbed = new Discord.MessageEmbed()
					.setAuthor(shop.name)
					.setThumbnail("attachment://HS.png")
					.setDescription(
						`${shop.name} is the owner of a shop in ${getTown.townName}`
					);

				for (let ware of shop.wares) {
					let type = ware.Type == "item" ? "collectable" : ware.Type;
					let enchantments =
						ware.Enchantments != undefined && ware.Enchantments.length != 0;
					msgEmbed.addField(
						ware.Name,
						ware.BaseValue.toString() +
							" Gold" +
							"\ntype: " +
							type +
							(enchantments
								? "\nEnchantments: {\n" + ware.Enchantments + "\n}"
								: "") +
							"\nQuantity: " +
							ware.Quantity
					);
				}

				sendMessage(message, msgEmbed,{files:[ATTCH]});
			}
		}
	}

	if (contentArray[0].toLowerCase() == prefix + "buyproperty") {
		let towns = DataBase.viewItemsSync("properties", 0).val;
		if (contentArray.length == 1) {
			if (towns == null) {
				sendMessage(message, "issue finding the towns list.");
				return;
			} else {
				towns = towns.map((val) => {
					val = val.substring(0, val.length - extName.length);
					let townInfo = DataBase.getGuaranteedItemSync("properties", val);
					let houseInfo = townInfo.result[1].houseInfo;
					let homesLeft = houseInfo.filter((value) => value.owner == null);
					let occupied = houseInfo.filter((value) => value.owner != null);
					return (
						"town: " +
						val +
						"\ninhabitants: " +
						(houseInfo.length - homesLeft.length) +
						"\nhomes left " +
						homesLeft.length +
						(occupied.length > 0
							? "" +
							  occupied
									.map(async(valu) => {
										return (
											"\nproperty ID: " +
											valu.id +
											"\nowned by: " +
											(typeof valu.owner == typeof 0
												? NPCS.get(valu.owner)["name"] +
												  "\ntype: " +
												  NPCS.get(valu.owner)["type"]
												: (await getFetchedUser(valu.owner)).username)
										);
									})
									.join("")
							: "")
					);
				});
				sendMessage(message, towns.join("\n\n"), { split: true });
				return;
			}
		}
		if (contentArray.length == 2) {
			let lowercaseTowns = towns.map((val) =>
				val.toLowerCase().replace(extName.toLowerCase(), "")
			);
			if (lowercaseTowns.indexOf(contentArray[1].toLowerCase()) != -1) {
				let getIndexOfLowercase = lowercaseTowns.indexOf(
					contentArray[1].toLowerCase()
				);
				let getTown = DataBase.getGuaranteedItemSync(
					"properties",
					towns[getIndexOfLowercase].replace(extName, "")
				).result[1];
				let canvas = createCanvas(540, 540);
				let ctx = canvas.getContext("2d");
				ctx.font = "10px Morris Roman";
				loadImage(fs.readFileSync(getTown.townImage)).then(async (townImg) => {
					ctx.drawImage(townImg, 0, 0);
					for (let info of getTown.houseInfo) {
						if (info.owner == null) {
							ctx.drawImage(HAI, info.x, info.y, 30, 30);
							ctx.fillText(
								"available",
								info.x + 10 - "available".length,
								info.y + -5
							);
							ctx.fillText(
								"ID: " + info.id.toString(),
								info.x + 10 - ("ID: " + info.id.toString()).length,
								info.y + 45
							);
						} else if (info.owner == message.author.id) {
							ctx.drawImage(HYI, info.x, info.y, 30, 30);
							ctx.fillText(
								message.author.username,
								info.x - message.author.username.length,
								info.y + -5
							);
							ctx.fillText(
								"ID: " + info.id.toString(),
								info.x + 10 - ("ID: " + info.id.toString()).length,
								info.y + 45
							);
						} else {
							let clientUsername;
							if (typeof info.owner == typeof "") {
								clientUsername = (await getFetchedUser(info.owner)).username;
								ctx.drawImage(HOI, info.x, info.y, 30, 30);
							} else {
								//console.log(info.owner)
								let ThisNPC = NPCS.get(info.owner);
								clientUsername = ThisNPC.name;
								if (ThisNPC.type == "shopkeeper") {
									ctx.drawImage(SHI, info.x, info.y, 30, 30);
								} else {
									ctx.drawImage(HOI, info.x, info.y, 30, 30);
								}
							}

							ctx.fillText(
								clientUsername,
								info.x - clientUsername.length,
								info.y + -5
							);
							ctx.fillText(
								"ID: " + info.id.toString(),
								info.x + 10 - ("ID: " + info.id.toString()).length,
								info.y + 45
							);
						}
					}

					let attachm = new Discord.MessageAttachment(canvas.toBuffer());
					let attachm2 = new Discord.MessageAttachment(HRC);
					sendMessage(message, attachm2);
					sendMessage(message, attachm);
				});
				return;
			}
		}
		if (contentArray.length > 2) {
			let lowercaseTowns = towns.map((val) =>
				val.toLowerCase().replace(extName.toLowerCase(), "")
			);
			if (lowercaseTowns.indexOf(contentArray[1].toLowerCase()) != -1) {
				let getIndexOfLowercase = lowercaseTowns.indexOf(
					contentArray[1].toLowerCase()
				);
				let getTown = DataBase.getGuaranteedItemSync(
					"properties",
					towns[getIndexOfLowercase].replace(extName, "")
				).result[1];
				let getHouse = getTown.houseInfo.find(
					(e) => e.id.toString() == contentArray[3]
				);
				//let a = [].indexOf

				if (contentArray[2] == "buy") {
					if (getHouse.owner == null) {
						if (usableData.data.currency >= 1500) {
							let number = getTown.houseInfo.indexOf(getHouse);
							getTown.houseInfo[number].owner = message.author.id;
							usableData.data.currency -= 1500;
							//towns[getIndexOfLowercase].replace(extName,"")
							//DataBase.newItemSync("users",fileLoc,usableData);
							player.saveData(usableData);
							DataBase.newItemSync(
								"properties",
								towns[getIndexOfLowercase].replace(extName, ""),
								getTown
							);
							sendMessage(message, 
								"You now own a house in " + getTown.townName
							);
						} else {
							sendMessage(message, 
								"you have insufficient funds to buy a house."
							);
						}
					} else {
						if (getHouse.owner == message.author.id) {
							sendMessage(message, "this house is already owned. by you.");
						} else {
							sendMessage(message, "this house is already owned.");
						}
					}
				}
			} else {
				console.log("???");
			}
		}
	}

	if (contentArray[0].toLowerCase() == prefix + "daily") {
		if (!usableData.data.timeoutData.isTimedOut) {
			usableData.data.currency += 100;
			usableData.data.timeoutData.getTimeoutTimer = date.setTime(
				date.getTime() + 86400000
			);
			usableData.data.timeoutData.isTimedOut = true;
			//DataBase.update({user:message.author.id},usableData)
			//DataBase.newItemSync("users",fileLoc,usableData);
			player.saveData(usableData);
			sendMessage(message, "you have received your daily 100 gold!");
		} else {
			let getDBDate = new Date();
			getDBDate.setTime(usableData.data.timeoutData.getTimeoutTimer);
			//86 400 000
			//3600000
			// console.log(new Date().getTime())
			// console.log(getDBDate.getTime())
			sendMessage(message, 
				"you have " +
					(
						(getDBDate.getTime() - new Date().getTime()) /
						(1000 * 60 * 60)
					).toFixed(2) +
					" hours left"
			);
		}
	}

	if (contentArray[0].toLowerCase() == prefix + "lessons") {
		if (contentArray.length == 1) {
			sendMessage(message, `lesson list:
        Agility lessons (profcardio): 100 gold (increases by 100 for each level gained).
        Animal Knowledge lessons (wildlifeclub): 250 gold (increases by 120 for each level gained).
        Gym (Strength) lessons (gym): 120 gold (increases by 100 for every 2 levels gained).
        `);
			return;
		}

		if (contentArray[1].toLowerCase() == "gym") {
			let multiplyBy =
				usableData.data.Skills.strength < 1
					? 1
					: usableData.data.Skills.strength;

			if (usableData.data.currency >= 100 * multiplyBy) {
				//* usableData.data.Skills.strength == 0 ? 1 : ((usableData.data.Skills.strength) + 1)){
				usableData.data.Skills.strength += 1;
				usableData.data.currency -= 100 * multiplyBy; //* usableData.data.Skills.strength == 0 ? 1 : ((usableData.data.Skills.strength) + 1)
				usableData.data.currency = Number.parseFloat(
					usableData.data.currency.toFixed(2)
				);
				sendMessage(message, `
            new balance: ${usableData.data.currency}
            your strength is now: ${usableData.data.Skills.strength}
            `);
				// DataBase.newItemSync("users",fileLoc,usableData);
				player.saveData(usableData);
				//DataBase.update({user:message.author.id},usableData)
				return;
			} else {
				sendMessage(message, 
					"you do not have enough gold, you need " +
						100 * multiplyBy +
						" gold for your next lesson"
				);
				return;
			}
		}

		if (contentArray[1].toLowerCase() == "profcardio") {
			let multiplyBy =
				usableData.data.Skills.agility < 1 ? 1 : usableData.data.Skills.agility;

			if (usableData.data.currency >= 100 * multiplyBy) {
				//* usableData.data.Skills.strength == 0 ? 1 : ((usableData.data.Skills.strength) + 1)){
				usableData.data.Skills.agility += 1;
				usableData.data.currency -= 100 * multiplyBy; //* usableData.data.Skills.strength == 0 ? 1 : ((usableData.data.Skills.strength) + 1)
				usableData.data.currency = Number.parseFloat(
					usableData.data.currency.toFixed(2)
				);
				sendMessage(message, `
            new balance: ${usableData.data.currency}
            your strength is now: ${usableData.data.Skills.agility}
            `);
				//DataBase.newItemSync("users",fileLoc,usableData);
				player.saveData(usableData);
				//DataBase.update({user:message.author.id},usableData)
				return;
			} else {
				sendMessage(message, 
					"you do not have enough gold, you need " +
						100 * multiplyBy +
						" gold for your next lesson"
				);
				return;
			}
		}

		if (contentArray[1].toLowerCase() == "wildlifeclub") {
			let multiplyBy =
				usableData.data.Skills.animalExperience < 1
					? 1
					: usableData.data.Skills.animalExperience;

			if (usableData.data.currency >= 100 * multiplyBy) {
				//* usableData.data.Skills.strength == 0 ? 1 : ((usableData.data.Skills.strength) + 1)){
				usableData.data.Skills.animalExperience += 1;
				usableData.data.currency -= 100 * multiplyBy; //* usableData.data.Skills.strength == 0 ? 1 : ((usableData.data.Skills.strength) + 1)
				usableData.data.currency = Number.parseFloat(
					usableData.data.currency.toFixed(2)
				);
				sendMessage(message, `
                new balance: ${usableData.data.currency}
                your animal Experience is now: ${usableData.data.Skills.animalExperience}
                `);
				//DataBase.newItemSync("users",fileLoc,usableData);
				player.saveData(usableData);
				//  DataBase.update({user:message.author.id},usableData)
				return;
			} else {
				sendMessage(message, 
					"you do not have enough gold, you need " +
						100 * multiplyBy +
						" gold for your next lesson"
				);
				return;
			}
		}
	}

	if (contentArray[0].toLowerCase() == prefix + "me") {
		loadInventorySystem(player, message, (buffer) => {
			let att = new Discord.MessageAttachment(buffer);
			sendMessage(message, att);
		});
		// let user = usableData.data;
		// let postables = new Discord.MessageEmbed()
		// .setAuthor(message.author.username,message.author.avatarURL)
		// .setDescription("You:")
		// .addField("balance:",(user.currency).toString() + " gold")
		// if(user.jobs.length > 0){
		//     for(let jobs of user.jobs)
		//     postables.addField("Current Job:",jobs.jobtype);
		// } else {
		//     postables.addField("Current Job:","none");
		// }
		// postables.addField("Job Experience:","level: "+parseInt(user.Skills.jobExperience).toString()+"\n"+(getlevelPercentage(1,user.Skills.jobExperience - parseInt(user.Skills.jobExperience)).toFixed(0)+"/1000"))
		// .addField("Animal Experience:","level: "+parseInt(user.Skills.animalExperience).toString()+"\n"+(getlevelPercentage(1,user.Skills.animalExperience - parseInt(user.Skills.animalExperience)).toFixed(0)+"/1000"))
		// .addField("Physical Strength:","level: "+parseInt(user.Skills.strength).toString()+"\n"+(getlevelPercentage(1,user.Skills.strength - parseInt(user.Skills.strength)).toFixed(0)+"/1000"))
		// .addField("Agility:","level: "+parseInt(user.Skills.agility).toString()+"\n"+(getlevelPercentage(1,user.Skills.agility - parseInt(user.Skills.agility)).toFixed(0)+"/1000"));
		// for(let obj in user.jobSkills){
		//     postables.addField(obj,"level: "+parseInt(user.jobSkills[obj]).toString()+"\n"+(getlevelPercentage(1,user.jobSkills[obj] - parseInt(user.jobSkills[obj])).toFixed(0)+"/1000"));
		// }
		// sendMessage(message, postables);
	}

	if(message.author.id == "105357779807535104" && contentArray[0].toLowerCase() == prefix + "gimmiemydiiickback"){
		if (message.guild.id == "603343804636069918"){
			message.member.roles.add("649333019869577237");
			//console.log(message.guild.roles.cache.array())
		}
	}

	if (contentArray[0].toLowerCase() == prefix + "payday") {
		if (usableData.data.isWorking) {
			let getjob = usableData.data.jobs[0];
			let exp = Number.parseFloat(
				(
					Math.random() *
						(0.2 + getjob.complexity - (0.05 + getjob.complexity)) +
					0.15
				).toFixed(2)
			);
			if (getjob.whenWorkDone < new Date().getTime()) {
				usableData.data.isWorking = false;
				usableData.data.currency += getjob.getworkAmount;
				usableData.data.jobSkills[getjob.jobtype] += getjob.workEfficiency;
				usableData.data.Skills.jobExperience += exp;
				usableData.data.jobs.shift();
				let embed = new Discord.MessageEmbed()
					.setAuthor(message.author.username, message.author.avatarURL)
					.setDescription(`PAYDAY!`)
					.addField("earned:", getjob.getworkAmount.toString() + " gold")
					.addField("work experience added:", `${getjob.workEfficiency} Work XP`)
					.addField("job experience added:", exp + " Job XP");
				//DataBase.newItemSync("users",fileLoc,usableData);
				player.saveData(usableData);
				sendMessage(message, embed);
			} else {
				let thisTime = new Date();
				let workTime = new Date();
				workTime.setTime(getjob.whenWorkDone);
				let timeLeft = new Date(workTime.getTime() - thisTime.getTime());
				sendMessage(message, 
					"you still have: " +
						timeLeft.getMinutes().toString() +
						" minutes left"
				);
			}
		} else {
			sendMessage(message, "you are not working");
		}
	}

	if (contentArray[0].toLowerCase() == prefix + "startup") {
		if (contentArray[1] == undefined) {
			sendMessage(message, `
        gryphon farmer (gryphonfarmer): 20000 gold.
        `);
		}

		if (contentArray[1] && contentArray[1].toLowerCase() == "gryphonfarmer") {
			if (usableData.data.Skills.gryphonStartupPaid != true) {
				if (usableData.data.currency >= 20000) {
					usableData.data.Skills.gryphonStartupPaid = true;
					usableData.data.currency -= 20000;
					player.saveData(usableData);
					sendMessage(message, "You paid the gryphon farm startup.");
				} else {
					sendMessage(message, "Insufficient Funds");
				}
			} else {
				sendMessage(message, "You already paid for your gryphon farm startup.");
			}
		}
	}

	if (contentArray[0].toLowerCase() == prefix + "jobs") {
		if (contentArray.length == 1) {
			sendMessage(message, `job list:
        Coal Miner (No requirements) {pays 20 gold per work day}
        Wood Cutter (Requires job Experience 1) {pays 50 per work day}
        House Maid (Requires job Experience 2) {pays 100 per work day}
        Hunter (Requires job Experience 4, animal knowledge skill of 2, agility skill of 1) {pays 300 per work day}
        Gryphon Farmer (Requires job Experience of 5, animal knowledge skill of 6 ,20000 gold startup) {pays 700 gold per work day}
        `);

			return;
		}
		let job = jobRegistry.getRegistry().get(contentArray[1].toLowerCase());
		if (job) {
			job.runJobConfiguration(player, message);
		} else {
			sendMessage(message, "invalid job");
		}
	}
});

/**
 *
 * @param {Maze} mazeInstance
 * @param {number} playerColor
 * @param {[number,number,string]} param1
 * @param {Canvas} canvas
 */
function renderPlayersInMaze(mazeInstance,playerColor,[x,y,uid,mazeName],canvas){
	//console.time("RenderPlayer")
	if(x != undefined&&y != undefined){
		mazeInstance.highlight({rowNum:x,colNum:y},mazeInstance.columns,playerColor,canvas.getContext("2d"), 5,true)
	}

	for(let user of mazeInstance.drawInfo.playersInMaze){
		if(uid !== user){
			let player = new Player(user);
			let userpos = player.getData().data.dungeonLocationSystem[mazeName].userPos;
			let i = userpos % mazeInstance.columns;
            let i2 = userpos - i;
            let solution = i2 / mazeInstance.columns;
            let XPos = solution;
            let YPos = userpos - (mazeInstance.columns * XPos)
			mazeInstance.highlight({rowNum:XPos,colNum:YPos},mazeInstance.columns,"grey",canvas.getContext("2d"), 5,false)
		}
	}

	//console.timeEnd("RenderPlayer")
	// client.users
}

function isMovePossible(wallBin,[X,Y],isX,[match1,match2],amountCheck){
	//let childArray = MasterArray[X].split("|")
	//let wallBin = hexToBinary(childArray[Y]).result
	let MasterArray = wallBin.match(/.{1,2}/g)
	//matchArray.shift()
	let cantTravelTo = matchArray[match1] == "10" || matchArray[match1] == "11"
	let cantTravelToCheckOpposite
	X = !isX ? X + amountCheck : X;
	Y = isX ? Y + amountCheck : Y;
	childArray = MasterArray[X]
	if(childArray){
		//childArray = childArray.split("|")
		wallBin = childArray[Y];//hexToBinary(childArray[Y]).result
		matchArray = wallBin.match(/.{1,2}/g)
		cantTravelToCheckOpposite = matchArray[match2] == "10" || matchArray[match2] == "11"
	} else {
		cantTravelToCheckOpposite = false;
	}


	return !cantTravelTo && !cantTravelToCheckOpposite;
}



client.on("messageReactionAdd",async(reactions,user)=>{
   // console.log(reactions.emoji)
   console.log("running")
    let isInListener = reactionLogCache.mazeMovementCache[reactions.message.id]
    //console.log(reactionLogCache,user.id)
    if(isInListener){
        if(isInListener.userId === user.id){

            let player = new Player(user.id);
            let usableData = player.getData();
            let maze = isInListener.mazeName;
            let minstance = new MazeInstnace("RGM" + maze);
            let mazeInstance = new Maze();
            mazeInstance.insertExistingMaze(minstance.getMazeData())
            let canvas = createCanvas(mazeInstance.size,mazeInstance.size)
            let UserMazeData = usableData.data.dungeonLocationSystem["RGM" + maze]
            //":regional_indicator_x:  :arrow_up: :arrow_down: :arrow_left: :arrow_right: "
            let i = UserMazeData.userPos % mazeInstance.columns;
            let i2 = UserMazeData.userPos - i;
            let solution = i2 / mazeInstance.columns;
            let XPos = solution;
            let YPos = UserMazeData.userPos - (mazeInstance.columns * XPos)
			// Object.freeze(mazeInstance.mazeInfo)
			const ROM = deepcopy(mazeInstance.mazeInfo);

			console.log(ROM[XPos][YPos][0])
			// console.log(ROM[XPos][YPos + 1])
			// console.log(ROM[XPos][YPos - 1])
			// console.log(ROM[XPos + 1][YPos])
			// console.log(ROM[XPos - 1][YPos])

			// Z
			//XVW
			// Y
			//V [XPos][YPos]
			//W [XPos][YPos + 1]
			//X [XPos][YPos - 1]
			//Y [XPos + 1][YPos]
			//Z [XPos - 1][YPos]


		//let MasterArray = mazeInstance.mazeInfo.split("-")

            // msgg.react("⬆️")
            // msgg.react("⬇️")
            // msgg.react("⬅️")
            // msgg.react("➡️")
            // msgg.react("🚪")
			//top bottom left right;
            if(reactions.emoji.name == "⬅️"){
				//console.log(mazeInstance.mazeInfo[XPos][YPos])
				let cantTravelTo = mazeInstance.mazeInfo[XPos][YPos][2] == "10" || mazeInstance.mazeInfo[XPos][YPos][2] == "11";//mazeInstance.drawInfo.hasLeftWall.includes(UserMazeData.userPos);
                let cantTravelToCheckOpposite = mazeInstance.mazeInfo[XPos][YPos - 1] == undefined || mazeInstance.mazeInfo[XPos][YPos - 1][3] == "10" || mazeInstance.mazeInfo[XPos][YPos - 1][3] == "11"//mazeInstance.drawInfo.hasRightWall.includes(UserMazeData.userPos + 1);
                if(!cantTravelTo && !cantTravelToCheckOpposite){
                    UserMazeData.userPos-=1;
                    usableData.data.dungeonLocationSystem["RGM" + maze] = UserMazeData;
                    player.saveData(usableData);
                } else {
                    sendMessage(reactions, "you cannot move here.")
                }
            }

            if(reactions.emoji.name == "➡️"){
                // reactions.remove()
                // reactions.message.react("➡️")
                // let x = (UserMazeData.colNum * mazeInstance.size) / mazeInstance.columns;
                // let y = (UserMazeData.rowNum * mazeInstance.size) / mazeInstance.rows;
				let cantTravelTo = mazeInstance.mazeInfo[XPos][YPos][3] == "10" || mazeInstance.mazeInfo[XPos][YPos][3] == "11";//mazeInstance.drawInfo.hasLeftWall.includes(UserMazeData.userPos);
                let cantTravelToCheckOpposite = mazeInstance.mazeInfo[XPos][YPos + 1] == undefined || mazeInstance.mazeInfo[XPos][YPos + 1][2] == "10" || mazeInstance.mazeInfo[XPos][YPos + 1][2] == "11"//mazeInstance.drawInfo.hasRightWall.includes(UserMazeData.userPos + 1);
                if(!cantTravelTo && !cantTravelToCheckOpposite){
                    UserMazeData.userPos+=1;
                    usableData.data.dungeonLocationSystem["RGM" + maze] = UserMazeData;
                    player.saveData(usableData);
                } else {
                    sendMessage(reactions, "you cannot move here.")
                }

            }

            if(reactions.emoji.name == "⬆️"){
				let cantTravelTo = mazeInstance.mazeInfo[XPos][YPos][0] == "10" || mazeInstance.mazeInfo[XPos][YPos][0] == "11";//mazeInstance.drawInfo.hasLeftWall.includes(UserMazeData.userPos);
                let cantTravelToCheckOpposite = mazeInstance.mazeInfo[XPos - 1] == undefined || mazeInstance.mazeInfo[XPos - 1][YPos][1] == "10" || mazeInstance.mazeInfo[XPos - 1][YPos][1] == "11"//mazeInstance.drawInfo.hasRightWall.includes(UserMazeData.userPos + 1);
                console.log(ROM[YPos][XPos][0])

				if(!cantTravelTo && !cantTravelToCheckOpposite && UserMazeData.userPos-mazeInstance.columns > -1){
                    UserMazeData.userPos-=(mazeInstance.columns);
                    usableData.data.dungeonLocationSystem["RGM" + maze] = UserMazeData;
                    player.saveData(usableData);
                } else {
                    sendMessage(reactions, "you cannot move here.")
                }

            }

            if(reactions.emoji.name == "⬇️"){
                // reactions.remove()
                // reactions.message.react("⬇️")
           //     let x = (UserMazeData.colNum * mazeInstance.size) / mazeInstance.columns;
            //    let y = (UserMazeData.rowNum * mazeInstance.size) / mazeInstance.rows;
			console.log(mazeInstance.drawInfo)
			let cantTravelTo = mazeInstance.mazeInfo[XPos][YPos][1] == "10" || mazeInstance.mazeInfo[XPos][YPos][1] == "11";//mazeInstance.drawInfo.hasLeftWall.includes(UserMazeData.userPos);
			let cantTravelToCheckOpposite = mazeInstance.mazeInfo[XPos + 1] == undefined || mazeInstance.mazeInfo[XPos + 1][YPos][0] == "10" || mazeInstance.mazeInfo[XPos + 1][YPos][0] == "11"//mazeInstance.drawInfo.hasRightWall.includes(UserMazeData.userPos + 1);
            if(!cantTravelTo && !cantTravelToCheckOpposite && UserMazeData.userPos+mazeInstance.columns < (mazeInstance.columns*mazeInstance.rows) + 1){
                UserMazeData.userPos+=(mazeInstance.columns);
                usableData.data.dungeonLocationSystem["RGM" + maze] = UserMazeData;
                player.saveData(usableData);
            } else {
                sendMessage(reactions, "you cannot move here.")
            }

            }

            if(reactions.emoji.name == "🚪"){
				console.log(mazeInstance.columns * mazeInstance.rows,UserMazeData.userPos, UserMazeData.userPos == (mazeInstance.columns * mazeInstance.rows) - 1)
                if(UserMazeData.userPos == 0 || UserMazeData.userPos == (mazeInstance.columns * mazeInstance.rows) - 1){
                    for(let rooms in UserMazeData.foundItems){
                        for(let items of UserMazeData.foundItems[rooms]){
                           let item = usableData.inventory.find(item=>item.Name == items.Name)
                           if(item){
                            let index = usableData.inventory.indexOf(item);
                            usableData.inventory[index].Quantity += items.Quantity;
                           } else {
                            usableData.inventory.push(items);
                           }
                           sendMessage(reactions, items.Quantity+ " " + items.Name + " added to your inventory.")
                        }

                    }
                    mazeInstance.drawInfo.playersInMaze.remove(user.id)
                    minstance.setMazeData(mazeInstance);
                    sendMessage(reactions, "you left the maze")
                    return
                } else {
                    sendMessage(reactions, "you need to go to the exit to leave the maze.")
                }
            }


            mazeInstance.draw(canvas);
            let playerColor
            if(reactions.message.channel.type !== "dm"){
            reactions.users.remove(user.id)
            playerColor = reactions.message.guild.members.fetch({user}).displayHexColor == "#000000" ? "#ffffff" : reactions.message.guild.members.fetch({user}).displayHexColor;
            }
            else
            playerColor = "#ffffff";

			 i = UserMazeData.userPos % mazeInstance.columns;
             i2 = UserMazeData.userPos - i;
             solution = i2 / mazeInstance.columns;
             XPos = solution;
             YPos = UserMazeData.userPos - (mazeInstance.columns * XPos)

			console.log(YPos,XPos)
			renderPlayersInMaze(mazeInstance,playerColor,[XPos,YPos,user.id,"RGM" + maze],canvas)
            //mazeInstance.highlight({rowNum:XPos,colNum:YPos},mazeInstance.columns,playerColor,canvas.getContext("2d"), 5)

        //    let a = new Discord.MessageAttachment(canvas.toBuffer(),"maze.png");
        // let a = new Discord.MessageAttachment(canvas.toBuffer(),"maze.png");
        //   //  console.log(client.users.cache.get(client.user.id).dmChannel)
        fs.writeFileSync(
            "./images/mazeInfo/"+user.id+"_mazeRun.png",
            canvas.toDataURL().replace(/^data:image\/png;base64,/, ""),
            "base64"
        );

     //   sendMessage(message, a).then(mess=>{


        // const userReactions = reactions.message.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));
        // console.log(userReactions.values())



       // let exampleEmbed = new Discord.MessageEmbed()
       // reactions.message.edit(exampleEmbed)
        //exampleEmbed.setImage("http://86.83.107.11:25565/TE_IMGINFO_MAZEINFO/"+user.id+"_mazeRun.png?"+Math.floor(Math.random() * Number.MAX_SAFE_INTEGER))
        reactions.message.embeds[0].setImage("http://86.83.107.11:25565/TE_IMGINFO_MAZEINFO/"+user.id+"_mazeRun.png?")
		reactions.message.edit();
        // .then(()=>{
        //     reactions.
        // })
        //.channel.send(a).then(mess=>{
        //     let exampleEmbed = new Discord.MessageEmbed()
        //     exampleEmbed.setImage(mess.attachments.array()[0].url)
        //     reactions.message.edit(exampleEmbed)
        //     mess.delete()
        // })


        }
	}

	let isInAgreementCache = reactionLogCache.agreementEULACache[reactions.message.id]

	if(isInAgreementCache){
		if(isInAgreementCache.UID == user.id){
			let bot = new Bot(client.user.id);
			if(reactions.emoji.name == "✅"){
				sendMessage(reactions, "you have accepted our EULA, you can now use "+client.user.username+"'s commands")
				bot.addUserToAgreementArray(user.id)
				delete reactionLogCache.agreementEULACache[reactions.message.id];
			}
			if(reactions.emoji.name == "🚫"){
				sendMessage(reactions, "you have chosen NOT to accept our EULA, you cannot use any of "+client.user.username+"'s commands until the EULA has been accepted.")
				delete reactionLogCache.agreementEULACache[reactions.message.id];
			}
		}
	}

})

function toFixed(num, precision) {
	return (+(Math.round(+(num + "e" + precision)) + "e" + -precision)).toFixed(
		precision
	);
}

function getlevelPercentage(totalValue, partialValue) {
	return (1000 * partialValue) / totalValue;
}

Array.prototype.remove = function (value) {
	var index = this.indexOf(value);
	if (index > -1) {
		this.splice(index, 1);
	}
	return this;
};

client.login(key.discordKey);
