app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: function($scope, SongFactory) {
            console.log("in controller")
        	$scope.submit = function(artist) {
                
        		 SongFactory.fetchAllAlbums(artist)
                 .then(albums => {
                    console.log("HEY")
                    console.log(albums)
                    $scope.albums = albums;
                 })
        			
        		}
        	}
    });
});