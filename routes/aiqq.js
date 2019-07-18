var express = require('express');
var router = express.Router();
var fs = require("fs");
var kdxf = require('../utils/aiqq');
var path = require('path');
var async = require("async");

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
	kdxf.text2audio(obj, function(err, ret) {
		res.send(ret)
	});
});
router.post('/text2audio', function(req, res, next) {
	console.log('im in')
	var textarr = eval(req.body.textarr);
	var id = req.body.id; //用于新建目录，各用户单独一个文件夹
	console.log(textarr, id);
	async.mapLimit(textarr, 2, function(textobj, callback) {

		kdxf.text2audio(textobj.text, textobj.name, id, callback);
	}, function(err, results) {
		console.log(results);
		var urls = results.map((v, k) => {
			if (v.code == 0) {
				return v.data.url;
			}
		})
		res.send({
			code: 0,
			urls: urls
		});
	})
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