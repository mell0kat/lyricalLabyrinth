
app.factory('SongFactory', function ($http) { 
	var SongFactory = {};

	var albumsList;

    var searchCounter = 0;

   

  SongFactory.fetchAllAlbums = function(artist){
    return $http.get('/api/artists/' + artistConverter(artist))
    .then(function(response) {
        console.log(response,"response in song factory")
        if (typeof response.data === 'string') {
            console.log("in the if")
            throw new Error(response.data);
        }
    	albumsList = response.data;
    	return albumsList;
    })
    .then(function(albumsList) {
    	return Promise.all(albumsList.map(function(album) {
    		var albumId = album.album.album_id;
    		return $http.get('/api/artists/albums/' + albumId)
    	}))	
    })
    .then(function(arrayOfAlbumArrays) {
    	return Promise.all(arrayOfAlbumArrays.map(function(album) {
    		var album = album.data;
    		
    		return Promise.all(album.map(function(track){
    			var trackId = track.track.track_id;

    			return $http.get('/api/artists/tracks/' + trackId)

    	}))
    	
    }))
	})
	.then(function(albums) {
		albums.forEach(function(album) {
			album.forEach(function(track){
                console.log(track.data, "TRACK>DATA")
				if (track.data!=='EMPTY?'){
					return $http.post('/api/artists/tracks', { artist: artist, lyrics: track.data.lyrics, title: track.data.title })
					.then( song => {console.log(song)})
				}
			})

		})
		
	})
    .catch(null, function(err) {
        return err;
    })
}
SongFactory.readSong = function(lyrics) {
  var synth = window.speechSynthesis;
   var voices = synth.getVoices();
   
  var utterThis = new SpeechSynthesisUtterance(lyrics);
  console.log(voices, utterThis.pitch, "PITCH")
  utterThis.pitch=1.5;
  utterThis.rate=.8;
  synth.speak(utterThis);

    
}
SongFactory.search = function(word) {
    console.log(word, "THIS IS THE WORD")
	console.log("in the search")
    console.log(searchCounter, "SEARCH COUNTER")
	return $http.get('/api/artists/searchby/' + word +'/' + (searchCounter))
    .then(function(songObj) {
        console.log(songObj);
        if (typeof(songObj) === 'object'){
            searchCounter++;
        }
        return songObj.data;
    })
}
  
	return SongFactory;

})



// return $http.get('http://api.musixmatch.com/ws/1.1/track.lyrics.get?apikey=82ad06b5dc21a4080961bd63ed342de6&track_id=716432')

function artistConverter(artistName) {
  artistName = artistName.replace(' ','%20');
  return artistName;
}

function wordWithoutPunctuation(word) {

}















