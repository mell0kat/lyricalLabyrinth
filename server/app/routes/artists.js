var router = require('express').Router();
var mongoose = require('mongoose');
// var Song = require('mongoose').Song;
var Song = mongoose.model('Song')

var rp = require('request-promise');


function myProxyRequest(params) {
    var options = {
    method: 'GET',
    uri: 'http://api.musixmatch.com/ws/1.1/' + params, //artist.search?apikey=d9765dfc3a093fa8471663533877144d&q_artist=' + req.params.artistId,
    json: true // Automatically stringifies the body to JSON 
    };

    return rp(options)
}


router.get('/:artistName', function(req, res, next) {
	var artistAlbums;

	myProxyRequest('artist.search?apikey=d9765dfc3a093fa8471663533877144d&q_artist=' + req.params.artistName)

    .then(function (response) {
        console.log(response.message.body)
        if (!response.message.body.artist_list || !response.message.body.artist_list.length) return 'Artist not found. Please try another!'
        var artistId = response.message.body.artist_list[0].artist.artist_id;

        return myProxyRequest('artist.albums.get?apikey=d9765dfc3a093fa8471663533877144d&artist_id=' + artistId)
    })
    .then(function (response) {
        
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
    myProxyRequest('album.tracks.get?apikey=d9765dfc3a093fa8471663533877144d&album_id=' + req.params.albumId)
    .then(response => {
         
         var aryOfTracklists = response.message.body.track_list;
         res.send(aryOfTracklists);
     })
})

router.get('/tracks/:trackId', function(req, res, next) {
    var lyrics;
    var title;
    var toSend = {};
    myProxyRequest('track.lyrics.get?apikey=d9765dfc3a093fa8471663533877144d&track_id=' + req.params.trackId)
    .then(response => {
        lyrics = response.message.body;
        
        if (lyrics.lyrics && lyrics.lyrics.lyrics_body) {
            toSend.lyrics = lyrics.lyrics.lyrics_body;
            myProxyRequest('track.get?apikey=d9765dfc3a093fa8471663533877144d&track_id='+req.params.trackId)
             .then(response=> {
                
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
    
    Song.search(req.params.word, req.params.iterations)
    .then(song=> {
        res.send(song)
    })
   
})



router.post('/tracks', function(req, res, next) {
    Song.create(req.body)
    .then(song => {
        res.send(song);
    })

})



module.exports = router;