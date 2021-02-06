const screenSize = ($window) => {
  return {
    restrict: 'E',
    scope: {
      screenWidth: '=',
      screenHeight: '=',
    },
    link: (scope) => {
      scope.screenWidth = $window.innerWidth;
      scope.screenHeight = $window.innerHeight;

      angular.element($window).bind('resize', function () {
        scope.$apply(function () {
          scope.screenWidth = $window.innerWidth;
          scope.screenHeight = $window.innerHeight;
        });
      });
    },
  };
};

angular.module('common').directive('screenSize', screenSize);
