const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
const shook = new Discord.WebhookClient('548725631534497803', 'PeaSDECw7V12kwG_ZygVqB6jtXToT6zMDXIbGHu-QeRHiXjl5Qf07hg9wbN_ABNdZ9kU');
const { prefix, token, API, DBLAPI, ownerID } = require('./config.json');
const Music = require('discord.js-musicbot-addon');
const DBL = require('dblapi.js');
const dbl = new DBL(`${DBLAPI}`, client);

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const cooldowns = new Discord.Collection();

const clean = text => {
	if (typeof (text) === 'string') {return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));}
	else {return text;}
};

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}


client.on('ready', () => {
// Simple Ready Message
	console.log('Ready!');
	// Set Online Status of Bot
	client.user.setStatus('Online');
	// Set Currently Playing or Streaming
	setInterval(function() {
		client.shard.broadcastEval('this.users.size').then((size) => {
			const count = size.reduce((prev, val) => prev + val, 0);
			const statuses = [`${prefix}` + 'help', 'with Bella', `over ${count} Users!`];
			const status = statuses[Math.floor(Math.random() * statuses.length)];
			client.user.setActivity(status);
		});
	}, 8000);

});

client.on('message', message => {

	// this section is for listeners

	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (message.content.startsWith(`${prefix}` + 'eval')) {
		if(message.author.id !== `${ownerID}`) return message.reply('you can\'t do that!').then(msg => {msg.delete(5000);});

		try {
			const code = args.join(' ');
			let evaled = eval(code);

			if (typeof evaled !== 'string') {evaled = require('util').inspect(evaled);}

			message.channel.send({
				'embed': {
					'color': 7337974,
					'author': {
						'name': 'Sophie Eval',
						'icon_url': client.user.avatarURL,
					},
					'fields': [
						{
							'name': '**INPUT**',
							'value': '```js\n' + args.join(' ') + '```',
						},
						{
							'name': '**OUTPUT**',
							'value': '```js\n' + clean(evaled) + '```',
						},
					],
				},
			});
		}
		catch (err) {
			message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
		}

	}

	if (message.content.startsWith(`${prefix}` + 'exec')) {
		if(message.author.id !== `${ownerID}`) return message.reply('you can\'t do that!').then(msg => {msg.delete(5000);});

		try {
			const code = args.join(' ');

			require('child_process').exec(code, (err, out) => {
				message.channel.send('```' + out + '```');
			});
		}
		catch (err) {
			message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
		}

	}

	if (message.content.startsWith(`${prefix}` + 'update')) {
		if(message.author.id !== `${ownerID}`) return message.reply('you can\'t do that!').then(msg => {msg.delete(5000);});

		try {
			require('child_process').exec('git pull origin master', (err, out) => {
				message.channel.send('```' + out + '```');
			});
		}
		catch (err) {
			message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
		}

	}

	if (message.content.startsWith(`${prefix}` + 'restart')) {
		if(message.author.id !== `${ownerID}`) return message.reply('you can\'t do that!').then(msg => {msg.delete(5000);});

		try {
			message.channel.send('Going down for a restart!').then(require('child_process').exec('pm2 restart Sophie', (err, out) => {
				message.channel.send('```' + out + '```');
			}));
		}
		catch (err) {
			message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
		}

	}

	const perms = message.member.permissions;
	const has_admin = perms.has('ADMINISTRATOR');

	if (message.content.startsWith(`${prefix}` + 'clear')) {

		if(has_admin == false) return message.reply('You don\'t have permission to use this command').then(msg => {msg.delete(5000);});

		const number2 = args.join('');
		const x = parseInt(number2);
		const y = 1;
		const total = x + y;
		const number = total;

		message.channel.fetchMessages({ limit: number }).then(messages => message.channel.bulkDelete(messages));

		message.channel.send('``Cleared ' + number2 + ' message(s) successfully``').then(msg => {msg.delete(5000);});

	}

	if (message.content.startsWith(`${prefix}` + 'say')) {

		if(has_admin == false && message.author.id !== `${ownerID}`) return;

		message.delete();

		message.channel.send(args.join(' '));

	}


	const command = client.commands.get(commandName)
			|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	// After all initial checks pass for commands
	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

	if (command.args && !args.length) {
		let reply = `That's the incorrect usage, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send({
			'embed': {
				'description': reply,
				'color': 14226219, // Red Color
			},
		});
	}

	if (message.content.startsWith('\'nou') || message.content.startsWith('\'help') || message.content.startsWith('\'thot') || message.content.startsWith('\'copy')) {
		message.delete();
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (!timestamps.has(message.author.id)) {
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	}
	else {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}

		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	}

	try {
		command.execute(message, args);
	}

	catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.on('guildCreate', g => {
	shook.send('', {
		"username": "Sophie",
		"avatarURL": client.user.avatarURL,
		"embeds": [{
			"color": 16777215,
			"description": "Joined a Server!",
			"timestamp": new Date(),
			"fields": [{
				"name": "Guild Name",
				"value": g.name,
				"inline": true
			},
			{
				"name": "Guild Users",
				"value": g.memberCount,
				"inline": true
			}]
		}]
	}).then(console.log('Server Added: ' + g.name)).catch(console.error);
});
//Guild Leave Handler
client.on('guildDelete', g => {
	shook.send('', {
		"username": "Sophie",
		"avatarURL": client.user.avatarURL,
		"embeds": [{
			"color": 16777215,
			"description": "Left a Server!",
			"timestamp": new Date(),
			"fields": [{
				"name": "Guild Name",
				"value": g.name
			}]
		}]
	}).then(console.log('Server Left: ' + g.name)).catch(console.error);
});

Music.start(client, {
	youtubeKey: `${API}`,
	prefix: `${prefix}`,
	clearOnLeave: true,
	requesterName: true,
	anyoneCanJoin: true,
	anyoneCanLeave: true,
	anyoneCanSkip: true,
	anyoneCanPause: true,
	defVolume: 60,
});

dbl.on('posted', () => {
	console.log('Server count posted!');
});

dbl.on('error', e => {
	console.log(`Oops! ${e}`);
});
process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);
client.login(token);
