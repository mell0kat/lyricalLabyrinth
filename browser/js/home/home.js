app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: function($scope, SongFactory) {
            
            $scope.customSong = '';
            $scope.lastWord ='';
            $scope.customArtist='';
            $scope.customTitle='';

        	$scope.submit = function(artist) {
                
        		 SongFactory.fetchAllAlbums(artist)
                 .then(albums => {
                   
                    $scope.albums = albums;
                    $scope.artistFound = true;

                   $scope.artist = null;

                    
                 })
                 .then(null, function(err) {
                    $scope.artistNotFound = true;
                    $scope.artist = null;
                    
                 })
        			
        		}
            $scope.lookFor = function(word) {
                $scope.songBuilt = true;
                SongFactory.search(word)
                .then(function(response){
                    if (response!=='Whoops! Not found!'){
                        $scope.lastWord = response.chunk[response.chunk.length-1]
                        $scope.customTitle += response.title.split(" ")[0] + ' ';
                        $scope.customSong += '\n' + response.chunk.join(" ") +  ' ';  
                        $scope.customArtist += response.artist + ' & '
                    }else {
                        $scope.wordNotFound = true;
                    }
                })
                .then(() => {console.log("in the next .then")})
            }
            $scope.searchAgain = function() {
                SongFactory.search($scope.lastWord)
                .then(function(response){
                    if (response!=='Whoops! Not found!'){
                        $scope.lastWord = response.chunk[response.chunk.length-1]
                        $scope.customSong += response.chunk.slice(1).join(" ") +  '\n';   
                        $scope.customArtist += response.artist + ' & ';
                        $scope.customTitle += response.title.split(" ")[0] + ' ';  
                    }
                })
            }
            $scope.singIt = function(){
                SongFactory.readSong($scope.customSong)
            }   	
    }
});
});