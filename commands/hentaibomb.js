const https = require('https');

const xml2js = require('xml2js');


module.exports = {
	name: 'hentaibomb',
	nsfw: true,
	usage: '<tag>',
	description: 'Sends multiple images. One each from Danbooru, Yande.re, Konachan, and Gelbooru.',
	execute(message, args) {
		try {
			if(message.channel.nsfw) {

				const argR = args;

				const urlKon = 'https://konachan.com/post.xml?limit=250&tags=' + argR.join('_') + '+-furry+-loli%20order:score%20rating:explict';
				const urlDan = 'https://danbooru.donmai.us/posts.xml?limit=250&tags=' + argR.join('_') + '%20rating:explict';
				const urlYan = 'https://yande.re/post.xml?limit=250&tags=' + argR.join('_') + '+-furry+-loli%20order:score%20rating:explict';
				const urlGel = 'https://www.gelbooru.com/index.php?page=dapi&s=post&q=index&limit=250&tags=' + argR.join('_') + '+-shota+-animal+-futanari+-furry+-loli+sort%3ascore%3adesc+rating%3aexplicit';

				https.get(urlKon, function(res) {
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
								if(picNum === 0) return;
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
							}
						});
					});
				}).on('error', function(e) {
					console.log('Got an error: ', e);
				});

				https.get(urlDan, function(res) {
					let body = '';
					res.on('data', function(chunk) {
						body += chunk;
					});

					res.on('end', function() {
						const parser = new xml2js.Parser();
						parser.parseString(body, function(err, result) {
							let postCount = result.posts.post.length;
							if(postCount > 250) {
								postCount = 250;
							}
							if(postCount > 0) {
								const picNum = Math.floor(Math.random() * postCount);
								if(picNum === 0) return;
								const danPic = result.posts.post[picNum]['file-url'];
								console.log((result.posts.post[picNum]['file-url']).toString());
								if (danPic.toString().endsWith('.webm') || danPic.toString().endsWith('.mpg')) return message.channel.send(danPic.toString());
								message.channel.send({
									'embed': {
										'description': ' [Tag: ' + argR.join(' ') + `](${danPic.toString()})`,
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
							}
						});
					});
				}).on('error', function(e) {
					console.log('Got an error: ', e);
				});

				https.get(urlYan, function(res) {
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
								if(picNum === 0) return;
								const yanPic = result.posts.post[picNum].$.file_url;
								console.log(result.posts.post[picNum].$.file_url);
								if (yanPic.endsWith('.webm')) return message.channel.send(yanPic);
								message.channel.send({
									'embed': {
										'description': ' [Tag: ' + argR.join(' ') + `](${yanPic})`,
										'color': 12390624, // Purple Color
										'image': {
											'url': yanPic,
										},
										'footer': {
											'text': 'Yande.re',

										},
									},

								});
							}
							else {
								console.log('Nothing found:', argR);
							}
						});
					});
				}).on('error', function(e) {
					console.log('Got an error: ', e);
				});

				https.get(urlGel, function(res) {
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
								if(picNum === 0) return;
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