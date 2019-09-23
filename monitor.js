var respawn = require('respawn')
const colors = require('colors')

// Watchdog Timer Agent -- DO NOT REMOVE
var monitor = respawn(['main', 'main.js'], {
	name: 'Sapphire Watchdog Monitoring Agent (WMA)',
	env: {
		ENV_VAR: 'test'
	},
	cwd: '.',
	maxRestarts: 5,
	sleep: 1000,
	kill: 30000,
	fork: true
})

monitor.start()

console.log(colors.bgGreen("========== WATCHDOG MONITORING AGENT IS NOW ACTIVE =========="))
console.log("")

// Program signalled an exit
monitor.on('exit', function (code, signal) {
	console.log("")
	console.log(colors.bgGreen("========== WMA HAS DETECTED A EXIT =========="))
	console.log("Code: " + code)
	console.log("Signal: " + signal)
	console.log("")
	console.log("Aborting restart...")
	console.log("")
	monitor.stop()
});