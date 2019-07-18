const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const proxySchema = new Schema({
	host: String,
	port: String,
	create_time: String,
	type: {type: String, default: 'http'}
})


const Proxy = mongoose.model('proxy', proxySchema);


module.exports = Proxy;