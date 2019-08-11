module.exports = {
	name: 'ping',
	description: 'Ping!',
	cooldown: 0,
	execute(message) {
		message.channel.send('Pong.');
	},
};