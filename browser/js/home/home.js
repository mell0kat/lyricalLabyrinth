app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: function($scope, SongFactory) {
        	$scope.submit = function() {
        		SongFactory.fetchSongs($scope.artist)
        		.then(lyrics => {
        			$scope.lyrics = lyrics;
        		})
        	}
        }
    });
});