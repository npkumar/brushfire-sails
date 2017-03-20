angular.module('brushfire_videosPage', []).config([
  '$sceDelegateProvider',
  function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['self', '*://www.youtube.com/**']);
  }
]);

angular.module('brushfire_videosPage').controller('PageCtrl', [
  '$scope',
  '$http',
  function($scope, $http) {

    // First, show a loading spinner    $scope.videosLoading = true;

    $scope.submitVideosError = false;

    // Get the existing videos.
    $http.get('/video').then(function onSuccess(sailsResponse) {
      $scope.videos = sailsResponse.data;
    }).catch(function onError(sailsResponse) {

      if (sailsResponse.data.status === '404') {
        return;
      }

      console.log("An unexpected error occurred: " + sailsResponse.data.statusText);

    }). finally(function eitherWay() {
      $scope.videosLoading = false;
    });

    $scope.submitNewVideo = function() {
      if ($scope.busySubmittingVideo) {
        return;
      }
      var _newVideo = {
        title: $scope.newVideoTitle,
        src: $scope.newVideoSrc
      };

      var parser = document.createElement('a');

      parser.href = _newVideo.src

      var youtubeID = parser.search.substring(parser.search.indexOf("=") + 1, parser.search.length);

      _newVideo.src = 'https://www.youtube.com/embed/' + youtubeID;

      $scope.busySubmittingVideo = true;

      io.socket.post('/video', {
        title: _newVideo.title,
        src: _newVideo.src
      }, function whenServerResponds(data, JWR) {
        $scope.videosLoading = false;
        if (JWR.statusCode >= 400) {
          console.log('something bad happened');
          return;
        }
        $scope.videos.unshift(_newVideo);
        $scope.busySubmittingVideo = false;

        $scope.newVideoTitle = '';
        $scope.newVideoSrc = '';
        $scope.$apply();
      });

    };
  }
]);
