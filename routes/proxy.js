var express = require('express');
var router = express.Router();
var fs = require("fs");
var path = require('path');
var async = require("async");
var Proxy = require('../controllers/proxy');

router.get('/', Proxy.getProxy);

module.exports = router;