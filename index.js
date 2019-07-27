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

// Imports
const Discord = require('discord.js')
const client = new Discord.Client()
//import fs from 'fs';
const authKey = require ("./auth.json")
const packFile = require ("./package.json")
const config = require ("./config.json")
const commands = require ("./commands/commands.json")

// Import the command router
//const route = require ("./commands/router.js")

// Variables
let cmdPrefix = config.prefix
var adminRole = "571780045924728833"

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
	console.warn("This isnt graceful but fuck it right?")
	process.exit(0)
}

// Function handler
function processCommand(receivedMessage) {
	let fullCommand = receivedMessage.content.substr(2) // Remove prefix
	let splitCommand = fullCommand.split(" ") // Each space == arg
	let primaryCommand = splitCommand[0] // Word 1 is the command (logical.. is it fucking not?)
	let arguments = splitCommand.slice(1) // Everything else can fuck itself until the cmds need it ye

	// DEBUG: Tell me exactly what is happening
	console.log("Command received: " + primaryCommand)
	console.log("Arguments: " + arguments)

	primaryCommand = primaryCommand.toLowerCase();

	////////
	// MOVE ALL TO SEPERATE FILES
	////////

	//route.routeCmd()

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

	console.log("DEBUG: pingCMD has completed")
}

// Information dialoge
function infoCmd(receivedMessage) {
	receivedMessage.channel.send("**Sapphire Bot Info** \nCreated by: *Arek 'AGDeveloper' Kwapis* \nBot Version: *" + packFile.version + "*")
}

// Game Manager
function playCmd(arguments, receivedMessage) {
	if (arguments.length == 0) {
		receivedMessage.channel.send("ADD PANEL HERE!")
	}
	else if (arguments[0] == "c4" || arguments[0] == "connect4" || arguments[0] == "connectfour") {
		client.destroy() // Close the client
		const connectFour = require("./commands/games/c4.js")
		connectFour.c4Cmd()
	}
}

// Debug
function debugCmd(arguments, receivedMessage) {
	if (arguments.length == 0) {
		receivedMessage.channel.send("No args passed to `debug`")
	}
	else {
		// Restart
		if (arguments == "restart") {
			let n = receivedMessage.member._roles.includes(adminRole)

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
			}
			else {
				receivedMessage.channel.send("You do not have permission to use this command!")
			}
		}
		// Shut down process
		else if (arguments == "shdown") {
			let n = receivedMessage.member._roles.includes(adminRole)

			if (n == 1) {
				receivedMessage.channel.send("Shutting down, please wait...")
				botExit()
			}
			else {
				receivedMessage.channel.send("You do not have permission to use this command!")
			}
		}
		// Invalid command
		else {
			receivedMessage.channel.send("Invalid argument passed!")
		}
	}
}

// Login to client
client.login(authKey.token)
console.log("Logged into discord on", dateNow())