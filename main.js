///////////////
//
// Main Management service
//
// Created by: Arek "AGDeveloper" Kwapis
// (c) Abstrat Technologies Limited, under exclusive licence to:
//     Ceasefire Online Ltd.
//
///////////////

const Discord = require('discord.js')
const client = new Discord.Client()
const authKey = require('./auth.json')

// Rich Presence config thingy
client.on('ready', () => {
	client.user.setActivity("NOT READY YET!", {
		type: "STREAMING"
	})
})

// Message Checks
client.on('message', (receivedMessage) => {
	// Stop the psyco from talking to itself
	if (receivedMessage.author == client.user) {
	}
	// Set command prefix
	if (receivedMessage.content.startsWith(config.prefix)) {
		processCommand(receivedMessage)
	}
})

client.login(authKey.token)