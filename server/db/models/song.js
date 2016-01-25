var mongoose = require('mongoose');


var songSchema = new mongoose.Schema({
	artist: {
		type: String,
		required: true
	},
	lyrics:{
		type: String,
		required:true
	},
	title: {
		type:String
	}
});


songSchema
.virtual('transformedLyrics')
.get(function () {
  var newLyrics = this.lyrics.replace(/[^\w\s']/g, "");
  newLyrics = newLyrics.split("\n").join(" ")  
  newLyrics = newLyrics.toLowerCase();
  
  newLyrics = newLyrics.split(" ");
  
  return newLyrics;
});

songSchema.statics.search = function(word, iterations) {

	
	return this.find({})
	.then(function(songs) {
		
		var randomOrder = shuffle(songs);
		
		for (var i = 0; i < randomOrder.length; i++) {
			
			var toSearchThrough = randomOrder[i].transformedLyrics;
			
			var indexOfWord = toSearchThrough.indexOf(word);
			var objToReturn = {};
			if (indexOfWord !== -1) {
				
				
				
				if (indexOfWord > 6 && iterations===0) {
					var start = indexOfWord-7;
					var end = indexOfWord+7;
				} else {
					var start = indexOfWord;
					var end = indexOfWord + 14;
				}

				objToReturn.chunk = toSearchThrough.slice(start, end);
				objToReturn.artist = randomOrder[i].artist;
				objToReturn.title = randomOrder[i].title;
				
				
				
				return objToReturn;
			};
			
			
		};
		return "Whoops! Not found!"
	})
	.then(returnThis => { 
		
		return returnThis
	})
}

mongoose.model('Song', songSchema);

var shuffle = function (array) {
    var counter = array.length, temp, index;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}
