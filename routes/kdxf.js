var express = require('express');
var router = express.Router();

var kdxf = require('../utils/kdxf');

router.get('/text2audio', function(req, res, next) {
	var sourceType = req.query.src;
	var text = req.query.text;
	kdxf.text2audio(text,sourceType,function(ret){
		console.log(ret)
	});
  	
});




module.exports = router;
