const Discord = require('discord.js');
const Manager = new Discord.ShardingManager('./sophie.js');

Manager.spawn(2);