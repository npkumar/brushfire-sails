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
    io.socket.get('/video', function whenServerResponds(data, JWR) {
      $scope.videosLoading = false;
      if (JWR.statusCode >= 400) {
        $scope.submitVideosError = true;
        console.log('something bad happened');
        return;
      }
      $scope.videos = data;
      $scope.$apply();

      io.socket.on('video', function whenAVideoIsCreatedUpdatedOrDestroyed (event) {
        $scope.videos.unshift({title: event.data.title, src: event.data.src});
        $scope.$apply();
      });

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
