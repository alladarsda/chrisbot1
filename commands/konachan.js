const https = require('https');

const xml2js = require('xml2js');


module.exports = {
	name: 'kona',
	aliases: ['kon'],
	nsfw: true,
	usage: '<tag>',
	description: 'Posts lewd image from konachan.com :sweat_drops:',

	execute(message, args) {
		try {
			if(message.channel.nsfw) {

				const argR = args;

				const url = 'https://konachan.com/post.xml?limit=250&tags=' + argR.join('_') + '+-furry+-loli%20order:score%20rating:explict';

				https.get(url, function(res) {
					let body = '';
					res.on('data', function(chunk) {
						body += chunk;
					});

					res.on('end', function() {
						const parser = new xml2js.Parser();
						parser.parseString(body, function(err, result) {
							let postCount = result.posts.$.count;
							if(postCount > 100) {
								postCount = 100;
							}
							if(postCount > 0) {
								const picNum = Math.floor(Math.random() * postCount);
								if(picNum === 0) {
									return message.channel.send({
										'embed': {
											'description': '**' + message.author.tag + '** I couldn\'t find anything. Try searching something else.',
											'color': 14226219, // Red Color
										},
									});
								}
								const konPic = result.posts.post[picNum].$.file_url;
								console.log(result.posts.post[picNum].$.file_url);
								if (konPic.endsWith('.webm')) return message.channel.send(konPic);
								message.channel.send({
									'embed': {
										'description': ' [Tag: ' + argR.join(' ') + `](${konPic})`,
										'color': 12390624, // Purple Color
										'image': {
											'url': konPic,
										},
										'footer': {
											'text': 'Konachan',

										},
									},

								});
							}
							else {
								console.log('Nothing found:', argR);
								message.channel.send({
									'embed': {
										'description': '**' + message.author.tag + '** I couldn\'t find anything. Try searching something else.',
										'color': 14226219, // Red Color
									},
								});
							}
						});
					});
				}).on('error', function(e) {
					console.log('Got an error: ', e);
				});
			}
			else {
				message.channel.send(':warning: This channel is not NSFW!');
			}
		}
		catch(e) {
			console.log(e);
			message.channel.send('Sorry. The file was too large. Try again.');
		}
	},
};