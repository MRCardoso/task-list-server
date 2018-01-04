angular.module('app.controllers',[])
    .controller('HomeController', ["$scope", "Authentication", "$filter", "$http", function($scope, Authentication, $filter, $http)
    {
        $scope.loadded = (Authentication.isAuthenticated() ?'authenticated':'visitant');
        $scope.date = new Date();
        var today = $scope.date;
        $scope.tasks = [];

        $scope.getDate = function(dt)
        {
            if(Authentication.isAuthenticated())
            {
                $http.post('/api/tasks/listToDate', {date: dt})
                .then(function(response){
                    $scope.tasks = response.data;
                    angular.forEach($scope.tasks, function(t,k){
                        t.status = +t.status;
                    });
                })
            }
        };
        $scope.verifyDate = function(date)
        {
            if(date==null) return false;
            DT = new Date(date);
            return ( DT.getTime() < today.getTime() );
        };
        $scope.getDate($scope.date);
    }]);