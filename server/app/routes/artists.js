var router = require('express').Router();
var mongoose = require('mongoose');
// var Song = require('mongoose').Song;
var Song = mongoose.model('Song')

var rp = require('request-promise');


function myProxyRequest(params) {
    var options = {
    method: 'GET',
    uri: 'http://api.musixmatch.com/ws/1.1/' + params, //artist.search?apikey=82ad06b5dc21a4080961bd63ed342de6&q_artist=' + req.params.artistId,
    json: true // Automatically stringifies the body to JSON 
    };

    return rp(options)
}


router.get('/:artistName', function(req, res, next) {
	var artistAlbums;

	myProxyRequest('artist.search?apikey=82ad06b5dc21a4080961bd63ed342de6&q_artist=' + req.params.artistName)

    .then(function (response) {
    
        var artistId = response.message.body.artist_list[0].artist.artist_id;

        return myProxyRequest('artist.albums.get?apikey=82ad06b5dc21a4080961bd63ed342de6&artist_id=' + artistId)
    })
    .then(function (response) {
        res.send(response.message.body.album_list);
    })
})

router.get('/albums/:albumId', function(req, res, next) {
    myProxyRequest('album.tracks.get?apikey=82ad06b5dc21a4080961bd63ed342de6&album_id=' + req.params.albumId)
    .then(response => {
         var aryOfTracklists = response.message.body.track_list;
         res.send(aryOfTracklists);
     })
})

router.get('/tracks/:trackId', function(req, res, next) {
    myProxyRequest('track.lyrics.get?apikey=82ad06b5dc21a4080961bd63ed342de6&track_id=' + req.params.trackId)
    .then(response => {
        var lyrics = response.message.body;
        if (lyrics.lyrics && lyrics.lyrics.lyrics_body) {
            res.send(lyrics.lyrics.lyrics_body)
        }else{
            res.send('EMPTY?');
        }
    })
})

router.get('/searchby/:word/:iterations', function(req, res, next) {
    console.log("in router")
    Song.search(req.params.word, req.params.iterations)
    .then(song=> {
        res.send(song)
    })
   
    // promise.then(function(foundWord) {
    //     console.log("back in the route");
    //     res.send(foundWord);
    // })
})

router.post('/tracks', function(req, res, next) {
    Song.create(req.body)
    .then(song => {
        res.send(song);
    })

})



module.exports = router;