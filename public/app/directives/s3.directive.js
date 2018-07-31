angular.module('app.directives')
    .directive('imageS3', function()
    {
        return {
            restrict: 'E',
            template: '<img ng-src="{{renderImage}}" ng-click="preview()">',
            replace: true,
            transclude: true,
            scope: {
                model: '=?model',
                renderType: '=?renderType',
                withUserId: '=?withUserId',
                hasPreview: '=?hasPreview'
            },
            controller: ["$scope", "$filter", "$sce", function ($scope, $filter, $sce)
            {
                if( angular.isUndefined($scope.model) )
                    return console.warn("The 'model' is required");
                $scope.renderImage = '';
                $scope.withUserId = angular.isDefined($scope.withUserId) ? $scope.withUserId : false;
                $scope.hasPreview = angular.isDefined($scope.hasPreview) ? $scope.hasPreview : false;
                $scope.type = angular.isDefined($scope.type) ? $scope.type : 'profile';
                
                $scope.preview = function () {
                    $scope.$root.imagerender = ($scope.hasPreview ? $scope.renderImage : null);
                };

                $scope.render = function()
                {
                    $scope.renderImage = $sce.trustAsResourceUrl($filter('s3Url')($scope.model.image, $scope.model._id, $scope.type));
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
            controller: ["$scope", function($scope)
            {
                if( angular.isUndefined($scope.model) )
                    return console.warn("The 'model' is required");
                $scope.renderType = angular.isDefined($scope.renderType) ? $scope.renderType : 'normal';
                $scope.type = angular.isDefined($scope.type) ? $scope.type : 'profile';

                $scope.download = function(model)
                {
                    var url = [$scope.$root.s3_url, $scope.$root.userImages, model._id, model.image.path].join('/');
                    var link = document.createElement("a");
                    link.download = model.image.name;
                    link.href = url;
                    link.setAttribute('target', '_blank');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    delete link;

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