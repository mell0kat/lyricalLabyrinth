var mongoose = require('mongoose');

console.log("in the song model");

var songSchema = new mongoose.Schema({
	artist: {
		type: String,
		required: true
	},
	lyrics:{
		type: String,
		required:true
	}
});



mongoose.model('Song', songSchema);