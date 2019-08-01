///////////////
//
// INDEX.JS - BOT ENTRY POINT
//
// Created by: Arek "AGDeveloper" Kwapis
// (c) Arek Kwapis, 2019
//
// No copying, no sharing, no stealing
// or i will perform a live fucking autopsy on you
//
///////////////

// TODO:
//


// logMsg(recievedMessage[obj], level[int], operator[str], msg[str])
//
// logMsg(458019676140601345, warn, connectfour, "Unknown Command")
//
// [1564467330] (458019676140601345) WARN: Unknown Command (connectfour)
// [UNIX Epoch] (Guild Identifier) LEVEL: MESSAGE (Operator)

// Imports
const Discord = require('discord.js')
const colors = require('colors');
const client = new Discord.Client()
const fs = require('fs')
const authKey = require('./auth.json')
const packFile = require('./package.json')
const config = require('./config.json')

// Build information wall
let buildInfoRaw = fs.readFileSync('./build.json'); // Read build info
let buildInfo = JSON.parse(buildInfoRaw); // Convert to an object we can work with
const buildNew = {
	"build": buildInfo.build + 1 // Increment by 1
}
let buildExp = JSON.stringify(buildNew) // Convert it into JSON
fs.writeFileSync('build.json', buildExp); // Write the changes back into build info
const buildDate = Date(Date.now()) // Build run date (wont update unlike dateNow())

// Trace (1) - Debug (2) - Info (3) - Warn (4) - Error (5) - Fatal (6)

// Custom logging
function logMsg(receivedMessage, level, operator, msg) {
	let guild = "000000000000000000"

	// Set guild
	if (receivedMessage == 0) {
		guild = "000000000000000000"
		if (operator == 0) {
			operator = "NO FUNCTION SPECIFIED"
			logCon(level, operator, msg)
		} else {
			logCon(level, operator, msg)
		}
	} else if (operator == 0) {
		operator = "NO FUNCTION SPECIFIED"
		logCon(level, operator, msg)
	} else {
		guild = receivedMessage.channel.guild.id.toString()
		logCon(level, operator, msg)
	}

	function logCon(level, operator, msg) {

		// Get Epoch
		let date = Date.now()
		// Logging
		if (level == 1) {
			console.log(colors.green("[" + date + "]") + " " + colors.gray.italic("(" + guild + ")") + " " + colors.white.bgBlue("TRACE") + ": " + colors.white(msg) + " " + colors.grey("(" + operator + ")"))
		} else if (level == 2) {
			console.log(colors.green("[" + date + "]") + " " + colors.gray.italic("(" + guild + ")") + " " + colors.white.bgMagenta("DEBUG") + ": " + colors.white(msg) + " " + colors.grey("(" + operator + ")"))
		} else if (level == 3) {
			console.log(colors.green("[" + date + "]") + " " + colors.gray.italic("(" + guild + ")") + " " + colors.black.bgWhite("INFO") + ": " + colors.white(msg) + " " + colors.grey("(" + operator + ")"))
		} else if (level == 4) {
			console.log(colors.green("[" + date + "]") + " " + colors.gray.italic("(" + guild + ")") + " " + colors.black.bgYellow("WARN") + ": " + colors.white(msg) + " " + colors.grey("(" + operator + ")"))
		} else if (level == 5) {
			console.log(colors.green("[" + date + "]") + " " + colors.gray.italic("(" + guild + ")") + " " + colors.black.bgRed("ERROR") + ": " + colors.white(msg) + " " + colors.grey("(" + operator + ")"))
		} else if (level == 6) {
			console.log(colors.green("[" + date + "]") + " " + colors.gray.italic("(" + guild + ")") + " " + colors.red.bgBlack("FATAL") + ": " + colors.white(msg) + " " + colors.grey("(" + operator + ")"))
		}
	}
}

// Get the current date as of when this function is called
function dateNow() {
	return Date(Date.now())
}

process.on('SIGINT', function() {
	logMsg(0, 3, "nodejs -> shdown (SIGINT.EXIT)", "Recieved SIGINT signal and begging shutdown process")
	botExit()
});

// Rich Presence config thingy
client.on('ready', () => {
	client.user.setActivity("Use -.help for comamnds!", {
		type: "WATCHING"
	})
	logMsg(0, 3, "client -> on.ready", "App is READY!")
})

// Message Checks
client.on('message', (receivedMessage) => {
	// Stop the psyco from talking to itself
	if (receivedMessage.author == client.user) {
		logMsg(receivedMessage, 1, "client -> on.message", "Stopped sending a message to myself")
		return
	}
	// Set command prefix
	if (receivedMessage.content.startsWith(config.prefix)) {
		logMsg(receivedMessage, 2, "client -> on.message", "Preparing to process input")
		processCommand(receivedMessage)
	}
})

// Shut the bot down
function botExit() {
	logMsg(0, 4, "debug -> shdown (botExit)", "Abrupt shut down is NOT recommended!")
	logMsg(0, 6, "PROCESS.EXIT", "PROCESS WILL NOW EXIT")
	process.exit(0)
}

// Function handler
function processCommand(receivedMessage) {
	let fullCommand = receivedMessage.content.substr(2) // Remove prefix
	let splitCommand = fullCommand.split(" ") // Each space == arg. arguments == array (arguments[x])
	let primaryCommand = splitCommand[0] // Word 1 is the command (logical.. is it fucking not?)
	let arguments = splitCommand.slice(1) // Remove primaryCommand

	primaryCommand = primaryCommand.toLowerCase()

	// DEBUG: Tell me exactly what is happening
	logMsg(receivedMessage, 2, "processCommand", "Processing input in recievedMessage with arguments: " + arguments)

	// Help command
	if (primaryCommand == "help") {
		helpCmd(arguments, receivedMessage)
	}
	// Ping status control
	else if (primaryCommand == "ping") {
		pingCmd(arguments, receivedMessage)
	}
	// Debug
	else if (primaryCommand == "debug") {
		debugCmd(arguments, receivedMessage)
	}
	// Info
	else if (primaryCommand == "info") {
		infoCmd(receivedMessage)
	}
	// launch game manager
	else if (primaryCommand == "play") {
		//playCmd(arguments, receivedMessage)
		receivedMessage.channel.send("Fucked until further notice. Please just not use this command like, ever, just now")
	}
	// Unknown command was entered
	else {
		receivedMessage.channel.send("Oh, either you made a typo or that's not a command! \nUse `-.help` for a list of commands")
	}
}

// Login to client
client.login(authKey.token)
logMsg(0, 3, "client -> on.login", "Logged into discord at: " + dateNow())

///////////////////////////////////////
//                                  ///
/// Command Functions  ////////////////
//                                  ///
///////////////////////////////////////

// Help command
function helpCmd(arguments, receivedMessage) {
	receivedMessage.channel.send("Coming Soon! \nOnly command currently avaliable: `ping` and `help`")
}

// Ping Command
function pingCmd(arguments, receivedMessage) {
	receivedMessage.channel.send("Pong!")

	// Rich Embed thingy
	const pingRE = new Discord.RichEmbed()
		.setColor(0xEF59D1)
		.setTitle("Sapphire Bot Service Status")
		.addField("__**Current Status**__", "Online")
		.setThumbnail("https://i.imgur.com/XHG5FTQ.png")
		.setFooter("© Arek Kwapis, 2019  ·  " + dateNow());

	// Now display the thingy
	receivedMessage.channel.send(pingRE)
}

// Information dialoge
function infoCmd(receivedMessage) {
	const infoRE = new Discord.RichEmbed()
		.setColor(0xEF59D1)
		.setTitle("Sapphire Bot Info")
		.addField("__**Created By**__", "Arek 'AGDeveloper' Kwapis")
		.addField("__**Bot Version**__", packFile.version, true)
		.addField("__**Build Number**__", buildNew.build, true)
		.addField("__**Build Date**__", buildDate)
		.setThumbnail("https://i.imgur.com/XHG5FTQ.png")
		.setFooter("© Arek Kwapis, 2019  ·  " + dateNow());

	receivedMessage.channel.send(infoRE)
}

// Game Manager
function playCmd(arguments, receivedMessage) {
	// Start the game panel
	if (arguments.length == 0) {
		const gameRE = new Discord.RichEmbed()
			.setColor(0xEF59D1)
			.setTitle("Sapphire Game Selection Panel")
			.setDescription("You can view and select a game from this panel! Simply type the command to the left of the game you want to play!")
			.addBlankField()
			.addField("ConnectFour", "Players Required: 2", true)
			.addField("Usage", "-.play c4", true)
			.addBlankField()
			.setFooter("© Arek Kwapis, 2019  ·  " + dateNow());

		receivedMessage.channel.send(gameRE)
	} else if (arguments[0] == "c4" || arguments[0] == "connect4" || arguments[0] == "connectfour") {
		if (receivedMessage.channel.id !== config.gameCh) {
			receivedMessage.channel.send("You must be in the designated game channel to start a game of ConnectFour!")
		} else {
			gameCon4(arguments, receivedMessage)
		}
	} else {
		receivedMessage.channel.send("Invalid argument passed!")
	}
}

// Debug
function debugCmd(arguments, receivedMessage) {
	// Error if no args
	if (arguments.length == 0) {
		receivedMessage.channel.send("No args passed to `debug`")
	} else {
		// Restart Block
		if (arguments == "restart") {
			let n = receivedMessage.member._roles.includes(config.adminRole)
			// Continue if is admin
			if (n == 1) {
				receivedMessage.channel.send("Restarting client, please wait...")
				client.destroy() // Close client
				logMsg(receivedMessage, 2, "debugCmd.restart -> client", "Destoryed Discord client")
				client.login(authKey.token)
				logMsg(receivedMessage, 3, "debugCmd.restart -> on.login", "Logged into discord at: " + dateNow())
				// Send message on REAL ready
				client.on('ready', () => {
					receivedMessage.channel.send("Restart has completed sucesfully!")
					logMsg(receivedMessage, 3, "debugCmd.restart -> on.ready", "Client has been restarted sucesfully")
				})
			} else {
				receivedMessage.channel.send("You do not have permission to use this command!")
			}
		}
		// Shut down process
		else if (arguments == "shdown") {
			let n = receivedMessage.member._roles.includes(config.adminRole)

			if (n == 1) {
				receivedMessage.channel.send("Shutting down, please wait...")
				botExit()
			} else {
				receivedMessage.channel.send("You do not have permission to use this command!")
			}
		}
		// Invalid command
		else {
			receivedMessage.channel.send("Invalid argument passed!")
		}
	}
}

///////////////////////////////////////
//                                  ///
/// Game Functions  ///////////////////
//                                  ///
///////////////////////////////////////

///////////////////////////////////////
/// ConnectFour                     ///
///////////////////////////////////////

// ConnectFour Variables (init with right data types)
let c4_gameRunning = 0 // Used for seeing if game is running (bool 0, 1)
let c4_playersNumb = 0 // People currently ingame (usernames matched order w/ ID)
let c4_playersJoin = [] // People currently ingame (0, 1, 2)
let c4_playersGame = [] // ID of people in game (str not int)
let c4_playersWait = [] // ID of people waiting to join (str not int) 
let c4_playersWaitName = [] // Username of people waiting to join (matched order w/ c4_playersWait)
let c4_markers = ["🔴", "🔵"] // Markers. [0] is P1, [1] is P2

// 2 Dimensional array serving as a gameboard // __c4Map[2][5] = D6 
let __c4Map = [
	["⚫", "⚫", "⚫", "⚫", "⚫", "⚫", ], // F1 - F6 | [0][0] - [0][5]
	["⚫", "⚫", "⚫", "⚫", "⚫", "⚫", ], // E1 - E6 | [1][0] - [1][5]
	["⚫", "⚫", "⚫", "⚫", "⚫", "⚫", ], // D1 - D6 | [2][0] - [2][5]
	["⚫", "⚫", "⚫", "⚫", "⚫", "⚫", ], // C1 - C6 | [3][0] - [3][5]
	["⚫", "⚫", "⚫", "⚫", "⚫", "⚫", ], // B1 - B6 | [4][0] - [4][5]
	["⚫", "⚫", "⚫", "⚫", "⚫", "⚫", ], // A1 - A6 | [5][0] - [5][5]
]

// Route everything to proper places
function gameCon4(arguments, receivedMessage) {
	if (arguments[1] == "join" && c4_playersNumb < 2 && c4_gameRunning == 1 && c4_playersWait.length == 0) {
		// JOIN GAME
		receivedMessage.channel.send("join1")
	} else if (arguments[1] == "join" && c4_playersNumb == 2) {
		// ERROR - GAME FULL. ASK TO JOIN QUEUE
		receivedMessage.channel.send("join2")
	} else if (c4_gameRunning == 1 && c4_playersNumb == 2) {
		// ERROR - CANT START GAME. ASK TO JOIN QUEUE
		receivedMessage.channel.send("join3")
	} else if (c4_gameRunning == 0 && c4_playersWait.length > 1) {
		// ADD PERSON TO QUEUE AND DECIDE IF THEY CAN PLAY
		receivedMessage.channel.send("join4")
	} else if (c4_gameRunning == 0 && c4_playersWait.length == 0 && c4_playersNumb == 0) {
		c4_setup(arguments, receivedMessage)
	} else {
		receivedMessage.channel.send("Uncaught exception spc4-01 on gameCon4 at " + receivedMessage.member.guild.id)
	}
}


// Start a game
function c4_setup(arguments, receivedMessage) {
	// Set the Rich Presence
	client.user.setActivity("Connect4 | 1/2 Players | Waiting", {
		type: "PLAYING"
	})

	// Broadcast message
	receivedMessage.channel.send("Beggining a new game of ConnectFour! \nUse `-.play c4 join` to join!")

	// Add the player who began the process as player
	c4_playersJoin + 1
	c4_playersJoin[0] = receivedMessage.member.user.username
	c4_playersGame[0] = receivedMessage.member.user.id

	// Broadcast User1 joined
	receivedMessage.channel.send(c4_playersJoin[0] + " joined the game! \n1 more player is needed to start")
}

function c4_play(arguments, receivedMessage) {

}