module.exports = {
	c4Cmd: function () {
		connectFour()
	}
}

function connectFour() {

	const Discord = require('discord.js')
	const client = new Discord.Client()
	const authKey = require("../../auth.json")

	function dateNow() {
		return Date(Date.now())
	}

	client.on('ready', () => {
		client.user.setActivity("Connect4 - 0/2 Slots Open", {
			type: "PLAYING"
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

	var gameRunning = 0
	var players = 0

	function processCommand(receivedMessage) {
		let fullCommand = receivedMessage.content.substr(2) // Remove prefix
		let splitCommand = fullCommand.split(" ") // Each space == arg
		let primaryCommand = splitCommand[0] // Word 1 is the command (logical.. is it fucking not?)
		let arguments = splitCommand.slice(1) // Everything else can fuck itself until the cmds need it ye

		// DEBUG: Tell me exactly what is happening
		console.log("Command received: " + primaryCommand)
		console.log("Arguments: " + arguments)

		primaryCommand = primaryCommand.toLowerCase();
	}

	function ConnectFour() {
		if (gameRunning == 1) {
			receivedMessage.channel.send("Error: Game is already running!")
		} else if (players > 0) {
			receivedMessage.channel.send("Error: Can't start a game while another is starting! \nTo join a game, use `-.play c4 join`")
		} else {
			receivedMessage.channel.send("Starting a new game of ConnectFour!")
		}
	}

	client.login(authKey.token)
	console.log("Logged into discord on", dateNow())

}