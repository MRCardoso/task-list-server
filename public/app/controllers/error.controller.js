angular
    .module("app.controllers")
    .controller('ErrorController', ['$scope', '$window', '$route', '$routeParams','$filter', function ($scope, $window, $route, $routeParams, $filter)
    {        
        $scope.status = 200, $scope.message ='', $scope.text ='';
        if( $routeParams.hash )
            [$scope.status, $scope.message, $scope.text] = $filter('hash')($routeParams.hash, 'decode').split('.');

        $scope.lines = [{path: false, label: 'Error'}, {path: false, label: $scope.text}];

        $scope.goBack = function()
        {
            console.log($window.history, window.history.forward());
            $window.history.go(-2);
        }
    }]);