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
const authKey = "NjA0MTA4MzY2NTU3NDc4OTQy.XTtl8g.owSdpabC3xxzIrFAEK8Qm0tkj28"

// Rich Presence config thingy
client.on('ready', () => {
	client.user.setActivity("Use -.help for comamnds!", {
		type: "WATCHING"
	})
	console.log("This process will now crash with SIGINT")
	client.destroy()
	process.kill(process.pid, "SIGINT")
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

client.login(authKey)