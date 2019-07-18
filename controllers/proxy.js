var ProxyModel = require('../models/proxy');
var request = require("request");
var crypto = require('crypto');
var urlencode = require('urlencode');
var querystring = require("querystring");
var fs = require("fs");
var path = require('path');
var async = require("async");
var superagent = require('superagent');
require('superagent-proxy')(superagent);
var checkThreads = 20;

class Proxy {
	constructor() {
		this.checkindex = 0;
	}
	getProxy(req, res, next) {
		const num = req.query.num;
	}
	startCrawlerTask(callback) {
		const me = this;
		console.log('[proxy task]proxy task start---------->>>');
		let startTime = Date.now();
		async.parallel([me.task0], (err, results) => {
			if (err) {
				callback(err);
			} else {
				//过滤爬失败的task
				var resultsFilter = results.filter((r) => !r.err);
				//合并剩余成功的task中的所有结果 并开始检测
				var rets = [];
				resultsFilter.map((rf) => {
					rets = rets.concat(rf.rets)
				})

				console.log('task总剩余待检测数量：' + rets.length);
				// rets = rets.slice(0, 20);
				me.checkindex = 0;
				//开始检测
				async.mapLimit(rets, checkThreads, (ret, cb) => {
					me.check(ret, cb)
				}, (err, res) => {
					if (err) {
						callback(err);
					} else {
						console.log('[proxy task]:总检测数：' + res.length);
						var proxys = res.filter((p) => !p.err);
						proxys = proxys.map((p) => p.proxy);
						console.log('[proxy task]:成功数：' + proxys.length);

						let endTime = Date.now();
						let consumeTime = Math.floor((endTime - startTime) / 1000);
						let min = Math.floor(consumeTime / 60);
						let sec = consumeTime - 60 * min;
						console.log('[proxy task]<<<----------proxy task end,consume:' + min + '分钟' + sec + '秒');
						ProxyModel.estimatedDocumentCount((err,count)=>{
							console.log('[proxy task]:origin count:'+count)
							ProxyModel.deleteMany({},err=>{
								if(err){
									callback(err);
								}else{
									console.log('[proxy task]:delete all');
									ProxyModel.insertMany(proxys, function(error, docs) {
										if (error) {
											console.log('[proxy task]:save error:' + error);
											callback(error);
										}else{
											console.log('[proxy task]:save success!now time:'+new Date().toLocaleString());
											callback(null);
										}
									});
								}

							});
						});
					}
				})

			}
		})
	}
	task0(callback) {
		const url = 'https://raw.githubusercontent.com/fate0/proxylist/master/proxy.list#';
		request({
			'uri': url,
			'method': 'get',
		}, function(err, res, body) {
			if (err) {
				callback(null, {
					err: err,
					rets: []
				});
			} else {
				let rets = [];
				try {
					const all = body.match(/{(.*?)}/g); //拆分
					console.log('[task]get task0 origin data finish.length: ' + all.length);
					const create_time = Date.now();
					rets = all.map((v) => {
						const p = JSON.parse(v);
						return {
							host: p.host,
							port: p.port,
							type: p.type,
							create_time: create_time
						}
					})

				} catch (e) {
					console.log('parse proxy task0 error: ' + e)
				}
				callback(null, {
					err: '',
					rets: rets
				});
			}
		})
	}
	check(test, callback) {
		const me = this;
		const checkUrlArr = ['https://www.baidu.com/'];
		const proxy = test.type + '://' + test.host + ':' + test.port;
		const url = checkUrlArr[Math.floor(Math.random() * checkUrlArr.length)];
		superagent.get(url)
			.proxy(proxy)
			.timeout(3000)
			.end(function(err, res) {
				me.checkindex++;
				if (err) {
					console.log(me.checkindex + 'check err:' + proxy);
					callback(null, {
						proxy: test,
						err: err
					});
				} else {
					if (res.statusCode == 200) {
						console.log(me.checkindex + 'check 200:' + proxy);
						callback(null, {
							proxy: test,
							err: null
						});
					} else {
						console.log(me.checkindex + 'check err:' + proxy);
						callback(null, {
							proxy: test,
							err: 'check status code err'
						});
					}

				}
			})
	}
}


module.exports = new Proxy();