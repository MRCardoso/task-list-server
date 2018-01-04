angular.module("app.directives", [])
    .directive("mySidebar",function(){
        return{
            scope: {},
            templateUrl: "templates/sidebar.html",
            controller: ["$scope", "Authentication", "toastr", "CoreService", "localStorageService","$http",
            function($scope, Authentication, toastr, CoreService, localStorageService, $http)
            {
                $scope.auth = Authentication.user;
                $scope.password = '';
                $scope.new_password = '';
                $scope.confirmation = '';
                
                /**
                 * Update password for logged user
                 */
                $scope.modifyPassword = function()
                {
                    CoreService.Model({
                        url: '/api/users/changePassword',
                        params: {},
                        postData: {
                            'password': this.password,
                            'new_password': this.new_password,
                            'confirmation': this.confirmation
                        },
                        action: "$save",
                        callback: function(response){
                            $scope.password = '';
                            $scope.new_password = '';
                            $scope.confirmation = '';

                            toastr.success(response.message,"Sucesso");
                        }
                    });
                };
            }]
        }
    });