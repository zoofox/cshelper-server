const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const novelSchema = new Schema({
	name: String,
	content: String,
	author:String,
	create_time: String,
	type: Number,
	from: Number
})


const Novel = mongoose.model('novel', novelSchema);


module.exports = Novel;