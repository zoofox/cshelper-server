const proxyCrawler = require('../controllers/proxy');
class task{
	constructor(){

	}
	start(){
		console.log('[task] started');
		this.proxyTask();
		this.novelTask();
	}
	proxyTask(){
		const me = this;
		proxyCrawler.startCrawlerTask((err)=>{
			if(err){
				console.log('[proxy task]failed,time:'+Date.now());
			}
			setTimeout(me.proxyTask,15*60*1000);
		});
	}
	novelTask(){
		
	}
}
module.exports = new task();