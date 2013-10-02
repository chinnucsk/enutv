var app = angular.module('nultvApp', ['ui.bootstrap']);

// Home Page Serives
app.factory('nultvHomePageService', function ($http) {
	return {
		getVideosCount: function () {
			return $http.get('/api/videos/count').then(function (result) {
				return result.data.rows;
			});
		},
		getAllVideos: function (videosPerPage, skipValue) {
			return $http.get('/api/videos/get_all?limit=' + videosPerPage + '&skip=' + skipValue).then(function (result) {
				return result.data.rows;
			});
		},
		getTrendingVideos: function () {
			return $http.get('/api/videos/popular?n=10').then(function (result) {
				return result.data.rows;
			});
		},
		getLatestVideos: function () {
			return $http.get('/api/videos/latest').then(function (result) {
				return result.data.rows;
			});
		},
		getLatestOneVideo: function () {
			return $http.get('/api/videos/latest_one').then(function (result) {
				return result.data.rows[0];
			});
		},
		getNewsAroundTheWeb: function (count) {
			return $http.get('/api/news/news_around_the_web?n=' + count).then(function (result) {
				return result.data.rows;
			});
		},
		getTopNewsWithImages: function (count) {
			return $http.get('/api/news/topnews_with_images?n=' + count).then(function (result) {
				return result.data.rows;
			});
		},
		getFeaturedVideo: function () {
			return $http.get('/api/videos/home_video').then(function (result) {
				var randVideoCount = Math.floor((Math.random() * 15) + 1);
				return result.data.rows[randVideoCount];
			});
		},
		getTopWorldNews: function (count) {
			return $http.get('/api/news/topnews?c=World&n=' + count).then(function (result) {
				return result.data.rows;
			});
		},
		getTopUsNews: function (count) {
			return $http.get('/api/news/topnews?c=US&n=' + count).then(function (result) {
				return result.data.rows;
			});
		},
		getTopEntertainmentNews: function (count) {
			return $http.get('/api/news/topnews?c=Entertainment&n=' + count).then(function (result) {
				return result.data.rows;
			});
		},
		getTopPoliticsNews: function (count) {
			return $http.get('/api/news/topnews?c=Politics&n=' + count).then(function (result) {
				return result.data.rows;
			});
		},
		getTopMarketNews: function (count) {
			return $http.get('/api/news/topnews?c=Markets&n=' + count).then(function (result) {
				return result.data.rows;
			});
		},
		getTopMoneyNews: function (count) {
			return $http.get('/api/news/topnews?c=Money&n=' + count).then(function (result) {
				return result.data.rows;
			});
		},

		getTopNewsWithImages: function (count) {
			return $http.get('/api/news/topnews_with_images?n=' + count).then(function (result) {
				return result.data.rows;
			});
		},
		getFeaturedVideo: function () {
			return $http.get('/api/videos/home_video').then(function (result) {
				var randVideoCount = Math.floor((Math.random() * 15) + 1);
				return result.data.rows[randVideoCount];
			});
		},
		getNewsCount: function (category) {
			return $http.get('/api/news/count?c=' + category).then(function (result) {
				return result.data.rows;
			});
		},
		getAllCategoryNews: function (newsPerPage, skipValue, category) {
			return $http.get('/api/news/get_all?c=' + category + '&skip=' + skipValue + '&perpage=' + newsPerPage).then(function (result) {
				return result.data.rows;
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
	$scope.topWorldNews = nultvHomePageService.getTopWorldNews(5);
	$scope.topUsNews = nultvHomePageService.getTopUsNews(5);
	$scope.topEntertainmentNews = nultvHomePageService.getTopEntertainmentNews(5);
	$scope.topPoliticsNews = nultvHomePageService.getTopPoliticsNews(5);
	$scope.topMarketNews = nultvHomePageService.getTopMarketNews(5);
	$scope.topMoneyNews = nultvHomePageService.getTopMoneyNews(5);

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

app.controller('NultvVideoPage', function ($scope, nultvHomePageService, $window) {

	// Non Featured Videos i.e all Videos
	$scope.videosPerPage = 42;

	// Javascript Custom Function to get teh URL params, decode them
	function getURLParameter (name) {
		return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
	}

	// Get all Video's Count
	$scope.videoCount = nultvHomePageService.getVideosCount();
	// Generate the numberOfPages and pages content based on the videoCount
	$scope.$watch('videoCount', function (videoCountObj) {
		if (videoCountObj !== undefined) {
			// Sample Output: {"rows":[{"key":null,"value":650}]}
			$scope.numberOfPages = (Math.ceil(videoCountObj[0].value/$scope.videosPerPage)).toString();

			// Pagination plugin
			$scope.bigTotalItems = videoCountObj[0].value;
		}
	});

	// Get noneFeaturedVideos list based on the page(number) we are hitting from.
	$scope.currentPageNumber = parseInt(getURLParameter('p'), 10);
	if (isNaN($scope.currentPageNumber)) {
		skipValue = 0;
		$scope.currentPageNumber = 1;
	} else {
		skipValue = parseInt(($scope.currentPageNumber - 1) * $scope.videosPerPage, 10);
	}
	$scope.noneFeaturedVideos = nultvHomePageService.getAllVideos($scope.videosPerPage, skipValue);

	// Pagination plugin
	$scope.bigCurrentPage = $scope.currentPageNumber;
	$scope.maxSize = 6; // Max number of pages to be displayed at a time


	// Pagination plugin
	// This function is triggred when user tends to change the page using the plugin.
	$scope.pageChanged = function (page) {
		location.replace('/videos?p=' + page);
	};


});

app.controller('NulTvNewsPagination', function ($scope, nultvHomePageService) {

	
	$scope.newsPerPage = 15;
	// Get the Pathname for last segment
	var url = window.location.pathname;
	// Get the category from segment
	var category = url.substring(url.indexOf("/")+3);

	// Javascript Custom Function to get teh URL params, decode them
	function getURLParameter (name) {
		return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
	}

	// Get all Video's Count
	$scope.newsCount = nultvHomePageService.getNewsCount(category);
	// Generate the numberOfPages and pages content based on the newsCount
	$scope.$watch('newsCount', function (newsCountObj) {
		if (newsCountObj !== undefined) {
			// Sample Output: {"rows":[{"key":null,"value":650}]}
			$scope.numberOfPages = (Math.ceil(newsCountObj[0].value/$scope.newsPerPage)).toString();

			// Pagination plugin
			$scope.bigTotalItems = newsCountObj[0].value;
		}
	});

	// Get noneFeaturedVideos list based on the page(number) we are hitting from.
	$scope.currentPageNumber = parseInt(getURLParameter('page'), 10);
	if (isNaN($scope.currentPageNumber)) {
		skipValue = 0;
		$scope.currentPageNumber = 1;
	} else {
		skipValue = parseInt(($scope.currentPageNumber - 1) * $scope.newsPerPage, 10);
	}
	$scope.categoryNews = nultvHomePageService.getAllCategoryNews($scope.newsPerPage, skipValue, category);

	// Pagination plugin
	$scope.bigCurrentPage = $scope.currentPageNumber;
	$scope.maxSize = 6; // Max number of pages to be displayed at a time


	// Pagination plugin
	// This function is triggred when user tends to change the page using the plugin.
	$scope.pageChanged = function (page) {
		location.replace('/p/' + category + '?page=' + page);
	};

	$scope.topNewsAndGraphics = nultvHomePageService.getTopNewsWithImages(10);

});

app.directive("videoJs", function(nultvHomePageService){
	return {
		restrict: "E",
		scope: {
			
		},
		template: 
			'<video id="banner_video" class="video-js vjs-default-skin" controls preload="auto" width="99%" height="235px" poster="" data-setup=\'{}\'>' +
 				'<source src="" type=\'video/mp4\'>' + 
			'</video>',
		replace: true,
		transclude: false,
		link: function ($scope, element, attrs) {
			$scope.latestVideoPath = nultvHomePageService.getLatestOneVideo();
			$scope.$watch('latestVideoPath', function (videoObj) {
				if (videoObj !== undefined) {
					$scope.hVideoEmbedPath = 'http://91cefb89b61292d7a6a5-9b3e53ad93e76fa27450765a72dfcdf1.r61.cf2.rackcdn.com/' + videoObj.value.video_path;					
					_V_("banner_video").ready(function(){
		      			var myPlayer = this;
      					myPlayer.src($scope.hVideoEmbedPath);      					
					});
				}
			});

		}
	}
});

app.directive("featuredVideoJs", function(nultvHomePageService){
	return {
		restrict: "E",
		scope: {
			
		},
		template: 
			'<video id="feature_video" class="video-js vjs-default-skin" controls preload="auto" width="650px" height="359px" poster="" data-setup=\'{}\'>' +
 				'<source src="" type=\'video/mp4\'>' + 
			'</video>',
		replace: true,
		transclude: false,
		link: function ($scope, element, attrs) {
			$scope.featuredVideoPath = nultvHomePageService.getFeaturedVideo();
			
			$scope.$watch('featuredVideoPath', function(featuredVideoObj) {
				if (featuredVideoObj !== undefined) {
					$scope.fVideoEmbedPath = "http://91cefb89b61292d7a6a5-9b3e53ad93e76fa27450765a72dfcdf1.r61.cf2.rackcdn.com/" + featuredVideoObj.value.video_path;
					$scope.featuredVideoPathTitle = featuredVideoObj.value.title;
					$scope.featuredVideoPathDuration = featuredVideoObj.value.duration;
					_V_("feature_video").ready(function(){
		      			var myPlayer = this;
      					myPlayer.src($scope.fVideoEmbedPath);      					
					});
				}
			});
		}
	}
});



