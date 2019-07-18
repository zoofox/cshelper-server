var appid = '5bd17ea8';
var apikey = '63efa0e1f74555dcd53db363fcaba34a';
var request = require("request");
var crypto = require('crypto');
var urlencode = require('urlencode');
var querystring = require("querystring");
var fs = require("fs");
var path = require('path');

//语音合成
//sourceType 1读弹幕
function text2audio(text,name,id,callback) {
	console.log(__dirname)
	var nowdate = Math.floor(Date.now() / 1000) + '';
	var mp3path = path.resolve(__dirname,'../public/mp3/'+id);
	var mp3url = 'https://niyh.cn/mp3/'+id+'/'+ name+'.mp3';
	if(!fs.existsSync(mp3path)){
		fs.mkdir(mp3path,0777,function(){
			text2audio(text,name,id,callback)
		});
	}else{
		var data = {
			"auf": "audio/L16;rate=16000",
			"aue": "lame",
			"voice_name": "x_xiaofang",
			"speed": "50",
			"volume": "50",
			"pitch": "50",
			"engine_type": "intp65",
			"text_type": "text"
		};
		var param = base64encode(JSON.stringify(data));
		var checksum = md5crypto(apikey + nowdate + param);
		var bodyData = querystring.stringify({'text':urlencode.decode(text)});
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
					callback(error,JSON.parse(body));
				}else{
					 callback(null,{code:0,data:{url:mp3url},msg:''});
				}
			}catch(e){
				callback(e,{code:1})
			}
		})
		.pipe(fs.createWriteStream(mp3path+'/'+name+'.mp3'));
	}
	
}

function base64encode(str) {
	var s = new Buffer(str);
	return s.toString('base64');
}
function md5crypto(str){
	var md5 = crypto.createHash('md5');
	return md5.update(str).digest('hex');
}

function getRandomName(){
    var date = Date.now() + '';
    var rnd = Math.floor(Math.random() * 10000);
    return date + rnd;
 }

module.exports = {
	text2audio: text2audio,
	base64encode: base64encode,
	getRandomName:getRandomName
}