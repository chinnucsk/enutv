var app = angular.module('nultvApp', []);

// Home Page Serives
app.factory('nultvHomePageService', function ($http) {
	return {
		getTrendingVideos: function () {
			return $http.get('http://speakglobally.net/api/videos/popular?n=10').then(function (result) {
				return result.data.rows;
			});
		},
		getLatestVideos: function () {
			return $http.get('http://speakglobally.net/api/videos/latest').then(function (result) {
				return result.data.rows;
			});
		},
		getLatestOneVideo: function () {
			return $http.get('http://speakglobally.net/api/videos/latest_one').then(function (result) {
				return result.data.rows[0];
			});
		},
		getTopNews: function (count) {
			return $http.get('http://wildridge.net/api/news/topnews?n=' + count).then(function (result) {
				return result.data.rows;
			});
		},
		getTopNewsWithImages: function (count) {
			return $http.get('http://wildridge.net/api/news/topnews_with_images?n=' + count).then(function (result) {
				return result.data.rows;
			});
		},
		getFeaturedVideo: function () {
			return $http.get('http://speakglobally.net/api/videos/home_video').then(function (result) {
				var randVideoCount = Math.floor((Math.random() * 15) + 1);
				return result.data.rows[randVideoCount];
			});
		}
	};
});

// Home Page Controller
app.controller('NultvHome', function ($scope, nultvHomePageService, $window) {
	// Trending Videos List
	$scope.trendingVideos = nultvHomePageService.getTrendingVideos();
	// Latest Videos List
	$scope.latestVideos = nultvHomePageService.getLatestVideos();
	// Top Latest Video Details
	$scope.latestVideo = nultvHomePageService.getLatestOneVideo();
	// Top 5 News items
	$scope.top5 = nultvHomePageService.getTopNews(10);

	// Top 5 News items with Graphics
	$scope.topNewsAndGraphics = nultvHomePageService.getTopNewsWithImages(5);

    // Set the hiro player's playlist with the latest video after getting the valid Video's Object
	$scope.$watch('latestVideo', function (videoObj) {
		if (videoObj !== undefined) {
			$scope.homeVideoEmbedPath = 'http://91cefb89b61292d7a6a5-9b3e53ad93e76fa27450765a72dfcdf1.r61.cf2.rackcdn.com/' + videoObj.value.video_path;
			$scope.homeVideoTitle = videoObj.value.title;
			$scope.homeVideoDescription = videoObj.value.description;			
		}
	});
	$scope.featuredVideo = nultvHomePageService.getFeaturedVideo();
	$scope.$watch('featuredVideo', function(featuredVideoObj) {
		if (featuredVideoObj !== undefined) {
			$scope.featuredVideoEmbedPath = "http://91cefb89b61292d7a6a5-9b3e53ad93e76fa27450765a72dfcdf1.r61.cf2.rackcdn.com/" + featuredVideoObj.value.video_path;
			//$scope.featuredVideoPoster = "http://876490ded624fedbbf8f-2529efbed00bf302a12a4cac23251cd4.r64.cf2.rackcdn.com/" + featuredVideoObj.value.thumbs_path;
			$scope.featuredVideoTitle = featuredVideoObj.value.title;
			$scope.featuredVideoDuration = featuredVideoObj.value.duration;
		}
	});
});