
app.factory('SongFactory', function ($http) { 
	var SongFactory = {};

	var albumsList;

  SongFactory.fetchAllAlbums = function(artist){
    return $http.get('/api/artists/' + artistConverter(artist))
    .then(function(response) {

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
				if (track.data!=='EMPTY?'){
					return $http.post('/api/artists/tracks', { artist: artist, lyrics: track.data })
					.then( song => {console.log(song)})
				}
			})

		})
		
	})
}
  
	return SongFactory;

})



// return $http.get('http://api.musixmatch.com/ws/1.1/track.lyrics.get?apikey=82ad06b5dc21a4080961bd63ed342de6&track_id=716432')

function artistConverter(artistName) {
  artistName = artistName.replace(' ','%20');
  return artistName;
}

// Beyonce artist id: 18927