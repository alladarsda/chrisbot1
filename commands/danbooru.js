const https = require('https');

const xml2js = require('xml2js');


module.exports = {
	name: 'danbooru',
	aliases: ['dan'],
	nsfw: true,
	usage: '<tag>',
	description: 'Posts lewd image from danbooru.donmai.us :sweat_drops:',

	execute(message, args) {
		try {
			if(message.channel.nsfw) {

				const argR = args;

				const url = 'https://danbooru.donmai.us/posts.xml?limit=250&tags=' + argR.join('_') + '%20rating:explict';

				https.get(url, function(res) {
					let body = '';
					res.on('data', function(chunk) {
						body += chunk;
					});

					res.on('end', function() {
						const parser = new xml2js.Parser();
						parser.parseString(body, function(err, result) {
							let postCount = result.posts.post.length;
							console.log(postCount);
							if(postCount > 100) {
								postCount = 100;
							}
							console.log(postCount);
							if(postCount > 0) {
								const picNum = Math.ceil(Math.random() * postCount);
								if(picNum < 10) {
									return message.channel.send({
										'embed': {
											'description': '**' + message.author.tag + '** I couldn\'t find anything. Try searching something else.',
											'color': 14226219, // Red Color
										},
									});
								}
								console.log(picNum);
								const danPic = result.posts.post[picNum]["file-url"];
								console.log((result.posts.post[picNum]["file-url"]).toString());
								if (danPic.toString().endsWith('.webm') || danPic.toString().endsWith('.mpg') || danPic.toString().endsWith('.mp4')) return message.channel.send(danPic.toString());
								message.channel.send({
									'embed': {
										'description': ' [Tag: ' + argR.join("_") + `](${danPic.toString()})`,
										'color': 12390624, // Purple Color
										'image': {
											'url': danPic.toString(),
										},
										'footer': {
											'text': 'Danbooru',

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