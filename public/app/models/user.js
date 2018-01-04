angular.module('app.models', [])
    .factory('User',['$resource', function ($resource)
    {
        var actionAdmin = function(){
            return $resource('api/users/:userId',{
                userId: '@_id'
            }, {
                update: {
                    method: 'PUT'
                }
            });
        };

        var actionAuth = function(){
            return $resource('api/myData/:userId',{
                userId: '@_id'
            }, {
                update: {
                    method: 'PUT'
                }
            })
        }

        return {
            admin: actionAdmin(),
            auth: actionAuth(),
        };
    }]);