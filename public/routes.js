// Invocar modo JavaScript 'strict'
'use strict';

angular.module('app.routes', [])
    .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider)
    {
        var basePath = 'app/views';
        $httpProvider.interceptors.push('responseListen');
        
        $routeProvider
            .when('/',{
                templateUrl: basePath+'/home/index.html',
                controller: 'HomeController'
            })
            /*
            | ----------------------------------------------------------
            | Task actions
            | ----------------------------------------------------------
            */
            .when('/tasks',{
                templateUrl: basePath+'/task/index.html',
                controller: "TaskController"
            })
            .when('/tasks/create',{
                templateUrl: basePath+'/task/save.html',
                controller: "TaskController"
            })
            .when('/tasks/:taskId/edit',{
                templateUrl: basePath+'/task/save.html',
                controller: "TaskController"
            })
            .when('/tasks/:taskId/view',{
                templateUrl: basePath+'/task/view.html',
                controller: "TaskController"
            })
            /*
            | ----------------------------------------------------------
            | User actions
            | ----------------------------------------------------------
            */
            .when('/users',{
                templateUrl: basePath+'/user/index.html',
                controller: "UserController"
            })
            .when('/users/create',{
                templateUrl: basePath+'/user/save.html',
                controller: "UserController"
            })
            .when('/users/:userId/edit',{
                templateUrl: basePath+'/user/save.html',
                controller: "UserController"
            })
            .when('/users/:userId/view',{
                templateUrl: basePath+'/user/view.html',
                controller: "UserController"
            })
            .when('/myData/:userId',{
                templateUrl: basePath+'/user/save.html',
                controller: "UserController"
            })
            .when('/error/:hash', {
                templateUrl: 'templates/error.html',
                controller: 'ErrorController',
            })
            .otherwise({
                redirectTo: '/'
            });
    }
])
.factory('responseListen', function responseListen($q, $window, $injector, $rootScope) {
    var $location = $location || $injector.get('$location');
    var $filter = $injector.get('$filter');
    var toastr = $injector.get('toastr');    
    return {
        'responseError': function(rejection) 
        {
            var code = rejection.status+' - '+rejection.statusText;            
            switch(rejection.status)
            {
                case 500:
                    toastr.error(rejection.data.message, code);
                    console.warn('500-internal serve', rejection);
                    break;
                case 400:
                    toastr.warning(rejection.data.message, code);
                    break;
                case 401:
                    toastr.info(rejection.data.message, code);
                    break;
                case 404:
                case 403:
                    /*
                    | PUT the headers in your request when you do not want to render page with error
                    | { headers: {'NoRenderErr': true} }
                    */
                    if( (rejection.config.method === 'GET') && !('NoRenderErr' in rejection.config.headers) )
                    {
                        var hash = $filter('hash')([rejection.status, rejection.data.message, rejection.statusText].join('.'), 'encode');
                        $location.path(['error', hash].join('/'));
                    }
                    else
                    {
                        var message = (rejection.status==404?'não encontrado': 'Não autorizado');
                        toastr.warning((rejection.data.message || message), code);
                    }
                    break;
            }
            return $q.reject(rejection);
        }
    };
});