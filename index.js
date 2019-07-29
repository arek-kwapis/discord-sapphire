///////////////
//
// INDEX.JS - BOT ENTRY POINT
//
// Created by: Arek "AGDeveloper" Kwapis
// (c) Ceasefire Online Limited, 2019
//
// No copying, no sharing, no stealing
// or i will perform a live fucking autopsy on you
//
///////////////

// TODO:
//
// Log event handling. Something like logMsg(level, operator, message)
// 

// Imports
const Discord = require('discord.js')
const client = new Discord.Client()
//import fs from 'fs';
const authKey = require("./auth.json")
const packFile = require("./package.json")
const config = require("./config.json")
const commands = require("./commands/commands.json")

// Variables
let cmdPrefix = config.prefix
let adminRole = config.adminRole
let gameCh = config.gameCh

// Get the current date
function dateNow() {
	return Date(Date.now())
}

// Rich Presence config thingy
client.on('ready', () => {
	client.user.setActivity("Use -.help for comamnds!", {
		type: "WATCHING"
	})
	console.log("App is READY!")
})

// Message Checks
client.on('message', (receivedMessage) => {
	// Stop the psyco from talking to itself
	if (receivedMessage.author == client.user) {
		console.log("Stopped sending a message to myself")
		return
	}
	// Set command prefix
	if (receivedMessage.content.startsWith(cmdPrefix)) {
		console.log("DEBUG: Preparing to process input: ", receivedMessage)
		processCommand(receivedMessage)
	}
})

// Shut the bot down
function botExit() {
	console.warn("shdown: This isnt graceful but fuck it right?")
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
	console.log("Command received: " + primaryCommand)
	console.log("Arguments: " + arguments)

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
		playCmd(arguments, receivedMessage)
	}
	// Unknown command was entered
	else {
		receivedMessage.channel.send("Oh, either you made a typo or that's not a command! \nUse `-.help` for a list of commands")
	}
}

// Login to client
client.login(authKey.token)
console.log("Logged into discord on", dateNow())

///////////////////////////////////////
//                                  ///
/// Command Functions  ////////////////
//                                  ///
///////////////////////////////////////

// Help command
function helpCmd(arguments, receivedMessage) {
	receivedMessage.channel.send("Coming Soon! \nOnly command currently avaliable: `ping` and `help`")
	console.log("DEBUG: helpCMD has completed")
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
		.setFooter(dateNow());

	// Now display the thingy
	receivedMessage.channel.send(pingRE)
}

// Information dialoge
function infoCmd(receivedMessage) {
	receivedMessage.channel.send("**Sapphire Bot Info** \nCreated by: *Arek 'AGDeveloper' Kwapis* \nBot Version: *" + packFile.version + "*")
}

// Game Manager
function playCmd(arguments, receivedMessage) {
	// Start the game panel
	if (arguments.length == 0) {
		const gameRE = new Discord.RichEmbed()
			.setColor(0xEF59D1)
			.setAuthor("Sapphire")
			.setTitle("Game Selection Panel")
			.setDescription("You can view and select a game from this panel! Simply type the command underneath the game you want to play!")
			.addBlankField()
			.addField("ConnectFour", "-.play c4")
			.addBlankField()
			.setFooter(dateNow());

		receivedMessage.channel.send(gameRE)
	} else if (arguments[0] == "c4" || arguments[0] == "connect4" || arguments[0] == "connectfour") {
		if (receivedMessage.channel.id !== gameCh) {
			receivedMessage.channel.send("You must be in the designated game channel to start a game of ConnectFour!")
		} else {
			console.log("Beggining new game of C4")
			//receivedMessage.channel.send("Starting a new game of ConnectFour! \nPlease wait, the bot is just setting up!")
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
				console.log("DEBUG: Destroyed client")
				client.login(authKey.token)
				console.log("DEBUG: Logged into Discord on ", dateNow())
				// Send message on REAL ready
				client.on('ready', () => {
					receivedMessage.channel.send("Restart has completed sucesfully!")
					console.log("DEBUG: App is ready // called from the debug restart command")
				})
				console.log("DEBUG: debugCMD with Restart arg has completed")
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
let c4_playersJoin = 0 // People currently ingame (0, 1, 2)
let c4_playersGame = [] // ID of people in game (str not int)
let c4_playersWait = [] // ID of people waiting to join (str not int) 
let c4_playersWaitName = [] // Username of people waiting to join (matched order w/ c4_playersWait)
let c4_markers = ["🔴", "🔵"] // Markers. [0] is P1, [1] is P2

// 2 Dimensional array serving as a gameboard // __c4Map[2][5] = D6 
let __c4Map = [ 
	[ "⚫", "⚫", "⚫", "⚫", "⚫", "⚫", ], // F1 - F6 | [0][0] - [0][5]
	[ "⚫", "⚫", "⚫", "⚫", "⚫", "⚫", ], // E1 - E6 | [1][0] - [1][5]
	[ "⚫", "⚫", "⚫", "⚫", "⚫", "⚫", ], // D1 - D6 | [2][0] - [2][5]
	[ "⚫", "⚫", "⚫", "⚫", "⚫", "⚫", ], // C1 - C6 | [3][0] - [3][5]
	[ "⚫", "⚫", "⚫", "⚫", "⚫", "⚫", ], // B1 - B6 | [4][0] - [4][5]
	[ "⚫", "⚫", "⚫", "⚫", "⚫", "⚫", ], // A1 - A6 | [5][0] - [5][5]
]

// 
function gameCon4(arguments, receivedMessage) {
	if (arguments[1] == "join" && c4_playersJoin < 2) {
		// JOIN GAME
	} else if (arguments[1] == "join" && c4_playersJoin == 2) {
		// ERROR - GAME FULL. ASK TO JOIN QUEUE
	} else if (c4_gameRunning == 1 && c4_playersJoin == 2) {
		// ERROR - CANT START GAME. ASK TO JOIN QUEUE
	}
	



	// Don't make a new game when one is running & lobby full
	if (c4_gameRunning == 1 && c4_playersJoin == 2) {
		receivedMessage.channel.send("Sorry, a game is already running! \nIf you want to join the queue, type `-.play c4 join queue")
	}
	else if (arguments[1] == "join" && c4_playersJoin < 2) {

	}
	
	else {
		// Start a new game
		c4_gameRunning = 1
		// Set activity
		client.user.setActivity("Connect4 | 0/2 Players | Playing", {
			type: "PLAYING"
		})

		if (c4_playersWait.length > 0) {
			receivedMessage.channel.send("TEST ME LATER")
		} else {
			receivedMessage.channel.send("ConnectFour: Lobby is now open! Type `-.play c4 join` to join the game!")
			c4_play(arguments, receivedMessage)
		}
	}
}

// Start a game
function c4_play(arguments, receivedMessage) {

}