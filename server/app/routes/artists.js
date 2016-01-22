var router = require('express').Router();

var rp = require('request-promise');



router.get('/:artistName', function(req, res, next) {
	
	myProxyRequest('artist.search?apikey=82ad06b5dc21a4080961bd63ed342de6&q_artist=' + req.params.artistName)

    .then(function (response) {
    	console.log(response);
        var artistId = response.message.body.artist_list[0].artist.artist_id;

        return myProxyRequest('artist.albums.get?apikey=82ad06b5dc21a4080961bd63ed342de6&artist_id=' + artistId)
    })
    .then(function(response) {
    	var artistAlbums = response.message.body.album_list
    	var aryOfPromises = [];
    	return Promise.all(artistAlbums.map(function(albumObj) {
    		return myProxyRequest('album.tracks.get?apikey=82ad06b5dc21a4080961bd63ed342de6&album_id=' + albumObj.album.album_id)
    		.then(response => {
    			var tracklist = response.message.body.track_list;
    			return tracklist;
    		})
    	}))
    })
    .then(function(aryOfTrackLists){ 
     	
     	return aryOfTrackLists.map(function(tracklist) {
     		var aryOfLyrics = [];
     		return Promise.all(Object.keys(tracklist).map(function(track) {
     			
     			var trackId = tracklist[track].track.track_id;
     			
     			return myProxyRequest('track.lyrics.get?apikey=82ad06b5dc21a4080961bd63ed342de6&track_id=' + trackId)
     		}))
     		.then(function(ary) {
     			lyrics = ary.filter(function(track) {
     				console.log(track.message.body.lyrics.lyrics_body, "MARKER")
     				return (track.message.body.lyrics.lyrics_body.length);
     				
     			});
     			return lyrics;
     			
     		})
     		.then(function(lyrics) {
     			console.log("YIPE", lyrics)
     		})
     		
     			
     			// myProxyRequest('track.lyrics.get?apikey=82ad06b5dc21a4080961bd63ed342de6&track_id=15953433' + trackId)
     			// .then(response => {

     				// console.log(response.message.body)
     			});
     		})
     		// track.forEach(function)
     	
    
    .catch(function (err) {
        console.log("failed")
    });
});

function myProxyRequest(params) {
	var options = {
    method: 'GET',
    uri: 'http://api.musixmatch.com/ws/1.1/' + params, //artist.search?apikey=82ad06b5dc21a4080961bd63ed342de6&q_artist=' + req.params.artistId,
    json: true // Automatically stringifies the body to JSON 
	};

	return rp(options)
}

		// return $http.get('http://api.musixmatch.com/ws/1.1/artist.search?apikey=82ad06b5dc21a4080961bd63ed342de6&q_artist=' + artist)
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

module.exports = router;