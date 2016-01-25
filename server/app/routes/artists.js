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
        console.log(response, "RESPONSE FETCHING ARTIST")
        if (!response.message.body.artist_list.length) return 'Artist not found. Please try another!'
        var artistId = response.message.body.artist_list[0].artist.artist_id;

        return myProxyRequest('artist.albums.get?apikey=82ad06b5dc21a4080961bd63ed342de6&artist_id=' + artistId)
    })
    .then(function (response) {
        console.log(response, "Secod resposne")
        var toSend;
        if (typeof response === 'string'){ 
            toSend = response;
        }else{
            toSend = response.message.body.album_list;
        }
        res.send(toSend);
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
    var lyrics;
    var title;
    var toSend = {};
    myProxyRequest('track.lyrics.get?apikey=82ad06b5dc21a4080961bd63ed342de6&track_id=' + req.params.trackId)
    .then(response => {
        lyrics = response.message.body;
        console.log("getting a title");
        if (lyrics.lyrics && lyrics.lyrics.lyrics_body) {
            toSend.lyrics = lyrics.lyrics.lyrics_body;
            myProxyRequest('track.get?apikey=82ad06b5dc21a4080961bd63ed342de6&track_id='+req.params.trackId)
             .then(response=> {
                console.log(response, "RES MES BODY")
                if (response.message.body.track && response.message.body.track.track_name) {
                    toSend.title = response.message.body.track.track_name
                    res.send(toSend);
                }else {
                    toSend.title='Untitled'
                    res.send(toSend)
                }
            })   
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