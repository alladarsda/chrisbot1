const https = require('https');

const xml2js = require('xml2js');


module.exports = {
	name: 'gelbooru',
	aliases: ['gel'],
	nsfw: true,
	usage: '<tag>',
	description: 'Posts lewd image from gelbooru.com :sweat_drops:',

	execute(message, args) {
		try {
			if(message.channel.nsfw) {
				const argR = args;

				const url = 'https://www.gelbooru.com/index.php?page=dapi&s=post&q=index&limit=250&tags=' + argR.join('_') + '+-loli+-shota+-furry+-yaoi+sort%3ascore%3adesc+rating%3aexplicit';

				https.get(url, function(res) {
					let body = '';
					res.on('data', function(chunk) {
						body += chunk;
					});

					res.on('end', function() {
						const parser = new xml2js.Parser();
						parser.parseString(body, function(err, result) {
							let postCount = result.posts.$.count;
							if(postCount > 250) {
								postCount = 250;
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
								const gelPic = result.posts.post[picNum].$.file_url;
								console.log(result.posts.post[picNum].$.file_url);
								if (gelPic.endsWith('.webm')) return message.channel.send(gelPic);
								message.channel.send({
									'embed': {
										'description': ' [Tag: ' + argR.join(' ') + `](${gelPic})`,
										'color': 12390624, // Purple Color
										'image': {
											'url': gelPic,
										},
										'footer': {
											'text': 'Gelbooru',

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