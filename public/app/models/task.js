angular.module('app.models')
    .factory('Task',["$resource", function ($resource)
    {
        return $resource('api/tasks/:taskId',{
            taskId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        })
    }]);
