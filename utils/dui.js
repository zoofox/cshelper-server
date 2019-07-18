var productId = '278582802';
var apikey = '109453ac79584813b80ec5ff9b052050';
var request = require("request");
var crypto = require('crypto');
var urlencode = require('urlencode');
var querystring = require("querystring");
var fs = require("fs");
var path = require('path');

//语音合成
//sourceType 1读弹幕
function text2audio(obj, callback) {
	var text = obj.text;
	var name = obj.name;
	var id = obj.id;
	var vcn = obj.vcn;
	var spd = obj.spd;
	vcn = vcn ? vcn : 'xiaoyan';
	console.log(__dirname)
	var nowdate = Math.floor(Date.now() / 1000) + '';
	var mp3path = path.resolve(__dirname, '../public/mp3/' + id);
	var mp3url = 'https://niyh.cn/mp3/' + id + '/' + name + '.mp3';
	if (!fs.existsSync(mp3path)) {
		fs.mkdir(mp3path, 0777, function() {
			text2audio(obj, callback)
		});
	} else {

		var data = {
			context:{
				"productId": productId
			},
			request:{
				requestId:123,
				audio:{
					audioType:'mp3',
					sampleBytes:2,
					sampleRate:16000,
					channel:1
				},
				tts:{
					text:text,
					textType:'text',
					voiceId:vcn,
					speed:0.8
				}
			}
		};
		request({
				'uri': 'https://tts.dui.ai/runtime/v2/synthesize?productId='+productId+'&apikey='+apikey,
				'method': 'POST',
				'headers': {
					'Content-Type': 'application/json',
				},
				'body': JSON.stringify(data)
			}, function(error, response, body) {

				// console.log(error)
				// console.log(response)
				// var contentType = response.headers['content-type'];
				// try {
				// 	if (contentType != 'audio/mpeg') {
				// 		console.log(body)
				// 		callback(error, JSON.parse(body));
				// 	} else {
						callback(null, {
							code: 0,
							data: {
								url: mp3url
							},
							msg: ''
						});
				// 	}
				// } catch (e) {
				// 	callback(e, {
				// 		code: 1
				// 	})
				// }
			})
			.pipe(fs.createWriteStream(mp3path + '/' + name + '.mp3'));
	}

}

function base64encode(str) {
	var s = new Buffer(str);
	return s.toString('base64');
}

function md5crypto(str) {
	var md5 = crypto.createHash('md5');
	return md5.update(str).digest('hex');
}

function getRandomName() {
	var date = Date.now() + '';
	var rnd = Math.floor(Math.random() * 10000);
	return date + rnd;
}

module.exports = {
	text2audio: text2audio,
	base64encode: base64encode,
	getRandomName: getRandomName
}