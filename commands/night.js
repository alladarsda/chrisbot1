module.exports = {
	name: 'night',
	description: 'Says goodnight',
	aliases: ['goodnight', 'zzz' ],
	execute(message) {
		message.channel.send('Goodnight!');
	},
};