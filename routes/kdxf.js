var express = require('express');
var router = express.Router();
var fs = require("fs");
var kdxf = require('../utils/kdxf');
var path = require('path');
var querystring = require("querystring");

router.get('/text2audio', function(req, res, next) {
	var name = req.query.name;
	var text = req.query.text;
	var id = req.query.id; //用于新建目录，各用户单独一个文件夹
	kdxf.text2audio(text, name, id, function(ret) {
		res.send(ret)
	});
});
router.post('/text2audio', function(req, res, next) {
	var textarr = eval(req.body.textarr);
	var id = req.body.id; //用于新建目录，各用户单独一个文件夹
	
	// kdxf.text2audio(text, name, id, function(ret) {
		res.send({code:0,urls:[]});
	// });
});

router.get('/clearfiles', function(req, res, next) {
	var id = req.query.id; //用于新建目录，各用户单独一个文件夹
	var mp3path = path.resolve(__dirname,'../public/mp3/'+id);
	if (fs.existsSync(mp3path)) {
		var dirList = fs.readdirSync(mp3path);
		dirList.forEach(function(fileName) {
			fs.unlinkSync(mp3path + '/' + fileName);
		});
	}
	res.send({
		code: 0
	})
});



module.exports = router;