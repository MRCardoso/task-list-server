angular.module("app.directives", [])
    .directive("mySidebar",function(){
        return{
            scope: {},
            templateUrl: "templates/sidebar.html",
            controller: ["$scope", "$rootScope", "$filter", "Authentication", "messageBox", function ($scope, $rootScope, $filter, Authentication, messageBox){
                $scope.auth = Authentication.user;
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