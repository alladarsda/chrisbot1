module.exports = {
	name: 'wrong',
	description: 'Responds with "Try again, Libtard."',
	aliases: ['nope'],
	execute(message) {
		message.channel.send('Try again, Libtard.');
	},
};