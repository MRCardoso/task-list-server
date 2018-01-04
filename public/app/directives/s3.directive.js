angular.module('app.directives')
    .directive('imageS3', function()
    {
        return {
            restrict: 'E',
            template: '<img ng-src="{{renderImage}}">',
            replace: true,
            transclude: true,
            scope: {
                model: '=?model',
                renderType: '=?renderType',
                withUserId: '=?withUserId'
            },
            controller: ["$scope", "$sce", "Authentication","$timeout", "$http", function($scope, $sce,Authentication,$timeout, $http)
            {
                if( angular.isUndefined($scope.model) )
                {
                    return console.warn("The 'model' is required");
                }
                var timer = 0;
                $scope.renderImage = '';
                $scope.withUserId = angular.isDefined($scope.withUserId) ? $scope.withUserId : false;
                $scope.type = angular.isDefined($scope.type) ? $scope.type : 'profile';
                
                $scope.render = function()
                {
                    if( $scope.model.image != null ){
                        $scope.renderImage = $sce.trustAsResourceUrl([
                            $scope.$root.s3_url, 
                            $scope.$root.userImages, 
                            $scope.model._id,
                            $scope.model.image.path
                        ].join('/'));
                    }
                    else{
                        $scope.renderImage = 'images/'+$scope.type+'.png';
                    }
                }
                $scope.render();
            }]
        }
    })
    .directive('imageContainerS3', function()
    {
        return {
            restrict: 'E',
            templateUrl: 'templates/image-s3.html',
            scope: {
                type:'=?type', 
                model: '=?model',
                // normal|details
                renderType: '@renderType',
            },
            controller: ["$scope", "$sce", "Authentication","$timeout", "$http", function($scope, $sce,Authentication,$timeout, $http)
            {
                if( angular.isUndefined($scope.model) )
                {
                    return console.warn("The 'model' is required");
                }
                var timer = 0;
                $scope.renderType = angular.isDefined($scope.renderType) ? $scope.renderType : 'normal';
                $scope.type = angular.isDefined($scope.type) ? $scope.type : 'profile';

                $scope.download = function(model){
                    var url = [$scope.$root.s3_url, $scope.$root.userImages, model._id, model.image.path].join('/');
                    var link = document.createElement("a");

                    link.download = model.image.name;
                    link.href = url;
                    link.click();
                };
                $scope.deleteImage = function(){
                    $scope.model.image = null;
                };
                $scope.isDetailsType = function(){
                    return $scope.renderType == 'details';
                };
                $scope.isNormalType = function(){
                    return $scope.renderType == 'normal';
                };
            }]
        }
    });