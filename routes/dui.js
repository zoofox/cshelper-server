var express = require('express');
var router = express.Router();
var fs = require("fs");
var dui = require('../utils/dui');
var path = require('path');
var async = require("async");
// http://127.0.0.1:8004/dui/text2audio?name=123&id=test&vcn=50&spd=50&text=hhh
router.get('/text2audio', function(req, res, next) {
	var name = req.query.name;
	var text = req.query.text;
	var vcn = req.query.vcn;
	var spd = req.query.spd;
	var id = req.query.id; //用于新建目录，各用户单独一个文件夹 roomid
	var obj = {
		text,
		name,
		id,
		vcn,
		spd
	};
	dui.text2audio(obj, function(err, ret) {
		res.send(ret)
	});
});


router.get('/clearfiles', function(req, res, next) {
	var id = req.query.id; //用于新建目录，各用户单独一个文件夹
	var mp3path = path.resolve(__dirname, '../public/mp3/' + id);
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