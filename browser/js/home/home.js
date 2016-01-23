app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: function($scope, SongFactory) {
            console.log("in controller")
            $scope.customSong = '';
            $scope.lastWord ='';
        	$scope.submit = function(artist) {
                
        		 SongFactory.fetchAllAlbums(artist)
                 .then(albums => {

                    $scope.albums = albums;
                 })
        			
        		}
            $scope.lookFor = function(word) {
                console.log("back in home.js")
                SongFactory.search(word)
                .then(function(response){
                    if (response!=='Whoops! Not found!'){
                        $scope.lastWord = response.chunk[response.chunk.length-1]
                        $scope.customSong += response.chunk.join(" ");
                      
                    }
                })
                .then(() => {console.log("in the next .then")})
            }
            $scope.searchAgain = function() {
                SongFactory.search($scope.lastWord)
                .then(function(response){
                    if (response!=='Whoops! Not found!'){
                        $scope.lastWord = response.chunk[response.chunk.length-1]
                      $scope.customSong += response.chunk.join(" ");
                       
                    }
                })
            }
        	}
    });
});