const Discord = require('discord.js');
const { prefix } = require('../config.json');
module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 5,
	execute(message, args) {
		const { commands } = message.client;

		if (!args.length) {
			const embed = new Discord.RichEmbed();

			embed.setAuthor('Sophie Bot Commands', message.client.user.avatarURL);
			embed.setDescription(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!\nFor music commands, send \`${prefix}musichelp\` in your server's dedicated channel. (Does not work in DMs)`);
			embed.setColor('32C911'); // same green as below, just in hex
			const newCmds = Array.from(commands);
			for (let i = 0; i < newCmds.length; i++) {
				const thisCmd = newCmds[i][1];
				if (!thisCmd.disabled) {
					embed.addField(thisCmd.name, thisCmd.description);
				}
			}
			return message.author.send({ embed })
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.channel.send({
						'embed': {
							'description': '<@' + message.author.id + '>, I\'ve sent you a DM with all my commands!',
							'color': 3328273, // Green Color
						},
					});
				})
				.catch(error => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
					message.channel.send({
						'embed': {
							'description': '<@' + message.author.id + '>, looks like I can\'t DM you. Do you have DMs Disabled?',
							'color': 14226219, // Red Color
						},
					});
				});
		}
		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply('that\'s not a valid command!');
		}

		const embed = new Discord.RichEmbed();

		embed.setAuthor(command.name, message.client.user.avatarURL);

		if (command.aliases) embed.addField('Aliases', command.aliases.join(', '), true);
		if (command.description) embed.setDescription('**Description:** ' + command.description);
		if (command.usage) embed.addField('Usage', command.usage, true);

		embed.setColor('32C911'); // same green as above, just in hex

		message.channel.send({
			embed,
		});

		// ...
	},
};