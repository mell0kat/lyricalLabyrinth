app.factory('SongFactory', function ($http) { 
	var SongFactory = {};

	// SongFactory.fetchSongs = function(artist) {
 //    console.log(artist)
 //    artist = artistConverter(artist);

	// 	return $http.get('http://api.musixmatch.com/ws/1.1/artist.search?apikey=82ad06b5dc21a4080961bd63ed342de6&q_artist=' + artist)
 //    .then(function(res) {
 //     return res.data.message.body.artist_list[0].artist.artist_id;
 //    })
 //    .then(function(artistId){
 //      return $http.get('http://api.musixmatch.com/ws/1.1/artist.albums.get?apikey=82ad06b5dc21a4080961bd63ed342de6&artist_id=' +artistId)
 //      .then(function(results){ 
 //        var albumsAry= results.data.message.body.album_list;
 //        var aryOfPromises = albumsAry.map(function(albumObj) {
 //          console.log(albumObj.album.album_id);
 //        })
 //      });
 //    });

	// }

  SongFactory.fetchSongs = function(artist){
    $http.get('/api/artists/' + artistConverter(artist))
  }
	return SongFactory;

});



// return $http.get('http://api.musixmatch.com/ws/1.1/track.lyrics.get?apikey=82ad06b5dc21a4080961bd63ed342de6&track_id=716432')

function artistConverter(artistName) {
  artistName = artistName.replace(' ','%20');
  return artistName;
}

// Beyonce artist id: 18927