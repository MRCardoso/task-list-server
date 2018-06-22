angular.module("app.directives", [])
    .directive("mySidebar",function(){
        return{
            scope: {},
            templateUrl: "templates/sidebar.html",
            controller: ["$scope", "Authentication", "messageBox", function ($scope, Authentication, messageBox){
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
                }
            }]
        }
    });