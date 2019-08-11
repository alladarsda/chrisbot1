module.exports = {
	name: '02',
	description: 'Zero Two Best Girl',
	execute(message) {
		message.channel.send('Zero Two Best Girl', {
			file: './02.gif',
		});

	},
};