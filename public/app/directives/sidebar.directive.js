angular.module("app.directives", [])
    .directive("mySidebar",function(){
        return{
            scope: {},
            templateUrl: "templates/sidebar.html",
            controller: ["$scope", "$rootScope", "$filter", "$timeout", "Authentication", "messageBox", function ($scope, $rootScope, $filter, $timeout, Authentication, messageBox){
                $scope.auth = Authentication.user;
                $scope.hasshing = Date.now();
                
                $scope.$root.$on('logo.hassing', function (ev, d) {
                    $timeout(function(params) {
                        $scope.hasshing = d;
                    }, 100);
                })

                $scope.requestOnSignout = function() {
                    messageBox.confirm({
                        title: 'Confirmação',
                        message: "<div class='alert alert-warning'>Deseja deslogar do sistema?</div>",
                        callback: function (validate) {
                            if (validate) {
                                window.location = "/signout";
                            }
                        }
                    });
                };

                $rootScope.$on('image.profile.change', function (ev, user) {
                    if (user._id == $scope.auth._id){
                        var path = $filter('s3Url')(user.image, $scope.auth._id);
                        angular.element("#profile-container-image").attr('src', path);
                    }
                })
            }]
        }
    });