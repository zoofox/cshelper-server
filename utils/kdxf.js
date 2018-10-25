var appid = '5bd17ea8';
var apikey = '63efa0e1f74555dcd53db363fcaba34a';
var request = require("request");
var crypto = require('crypto');
var urlencode = require('urlencode');
var querystring = require("querystring");
var fs = require("fs");

//语音合成
//sourceType 1读弹幕
function text2audio(text,sourceType,callback) {
	var nowdate = Math.floor(Date.now() / 1000) + '';
	var data = {
			"auf": "audio/L16;rate=16000",
			"aue": "raw",
			"voice_name": "xiaoyan",
			"speed": "40",
			"volume": "50",
			"pitch": "50",
			"engine_type": "intp65",
			"text_type": "text"
	};
	var param = base64encode(JSON.stringify(data));
	var checksum = md5crypto(apikey + nowdate + param);
	var bodyData = querystring.stringify({'text':text});
	request({
		'uri':'http://api.xfyun.cn/v1/service/v1/tts',
		'method':'POST',
		'headers':{
			'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
			'X-Appid':appid,
			'X-CurTime':nowdate,
			'X-Param':param,
			'X-CheckSum':checksum
		},
		'body':bodyData
	},function(error, response, body){
		var contentType = response.headers['content-type'];
		try{
			if(contentType != 'audio/mpeg'){
				console.log(body)
				callback(JSON.parse(body));
			}else{
				 callback({code:0})
			}
		}catch(e){
			callback({code:1})
		}
	})
	.pipe(fs.createWriteStream('./public/mp3/'+sourceType+'.mp3'));
}

function base64encode(str) {
	var s = new Buffer(str);
	return s.toString('base64');
}
function md5crypto(str){
	var md5 = crypto.createHash('md5');
	return md5.update(str).digest('hex');
}

module.exports = {
	text2audio: text2audio,
	base64encode: base64encode
}