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

// Vars
var dateNow = Date(Date.now()).toString()

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
	if (receivedMessage.content.startsWith('-.')) {
		console.log("DEBUG: Preparing to process input: ", receivedMessage)
		processCommand(receivedMessage)
	}
})

// Function handler
function processCommand(receivedMessage) {
	let fullCommand = receivedMessage.content.substr(2) // Remove prefix
	let splitCommand = fullCommand.split(" ") // Each space == arg
	let primaryCommand = splitCommand[0] // Word 1 is the command (logical.. is it fucking not?)
	let arguments = splitCommand.slice(1) // Everything else can fuck itself until the cmds need it ye

	// DEBUG: Tell me exactly what is happening
	console.log("Command received: " + primaryCommand)
	console.log("Arguments: " + arguments)

	////////
	// COMMAND WALL WHICH IS UGLY AS SIN
	////////

	// help
	if (primaryCommand == "help") {
		helpCmd(arguments, receivedMessage)
	}
	// me
	else if (primaryCommand == "ping") {
		pingCmd(arguments, receivedMessage)
	}
	else if (primaryCommand == "debug") {
		debugCmd(arguments, receivedMessage)
	}  
	// please
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
		.setThumbnail("https://i.imgur.com/u4DGhJP.png")
		.setFooter(dateNow);
	
	// Now display the thingy
	receivedMessage.channel.send(pingRE)

	console.log("DEBUG: pingCMD has completed")
}

function debugCmd(arguments, receivedMessage) {
	if (arguments.length == 0) {
		receivedMessage.channel.send("Debug Usage Feature WIP!")
	}
	else {
		if (arguments == "restart") {
			receivedMessage.channel.send("Restarting client, please wait...")
			client.destroy() // Close client
			console.log("DEBUG: Destroyed client")
			client.login(authKey.token)
			console.log("DEBUG: Logged into Discord on ", dateNow)
			// Send message on REAL ready
			client.on('ready', () => {
				receivedMessage.channel.send("Restart has completed sucesfully!")
				console.log("DEBUG: App is ready // called from the debug restart command")
			})
			console.log("DEBUG: debugCMD with Restart arg has completed")
		}
	}
}

// Login to client
client.login(authKey.token)
console.log("Logged into discord on ", dateNow)