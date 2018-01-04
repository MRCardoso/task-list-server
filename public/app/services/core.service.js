angular.module('app.services', [])
    .service('CoreService', [
    "$http", "$rootScope", "$timeout", "Authentication", "localStorageService", "$location", "toastr", "$route", "$filter", "messageBox", "$resource",
    function($http, $rootScope,$timeout,Authentication,localStorageService,$location,toastr,$route,$filter, messageBox, $resource)
    {
        this.validatePermission = function(){
            if( Authentication.user == null ){
                if( !(/\/signup|\/$/.test($location.$$path)) ){
                    localStorageService.add('task.list.lastInterface', $location.$$path);
                    return $location.path('/');
                }
            } else{
                if( (/\/signup|\/$/.test($location.$$path)) ){
                    return $location.path('/');
                }
            }
        };
        /*
        | --------------------------------------------------------------------------------
        | Make ajax request by angular-resource
        | --------------------------------------------------------------------------------
        */
        this.Model = function(object)
        {
            var defaults = {
                url: '/',
                params: {},
                postData: {},
                action: "",
                callback: function(reason){
                    var message = 'output' in reason ? reason.output: reason.message;
                    toastr.success(message, "success");
                }
            };
            object = angular.extend({}, defaults, object);
            
            if( object.url == '/' )
                throw "Not found url to request";
            
            var Instance = $resource(object.url, object.params);

            switch(object.action){
                case "$save":
                    var Model = new Instance(object.postData);
                    Model.$save(function(reason){
                        object.callback(reason);
                    });
                    break;
                case 'get': 
                    return Instance.get().$promise;
                case "all":
                    return Instance.query();
                default:
                    return Instance;
            }
        };
        /**
        | --------------------------------------------------------------------------------
        | method for create and update data of the a module
        | define a object with data send by form ('POST' for insert, 'PUT' for update)
        | create a record using the method $save of the mongoose
        | update a record using the method custom $update created in the service of the module
        | --------------------------------------------------------------------------------
        */
        this.save = function ( module, router )
        {
            var $this = this;
            var method = (module._id==undefined?"$save":"$update");

            module[method](function(response)
            {
                if(typeof router == 'function')
                {
                    router(response);
                } 
                // reload the page by standard method of the window
                else if( router == 'reload' )
                {
                    window.location.reload();
                }
                // reload the page by angular-route
                else if ( router == 'pre-load' )
                {
                    $route.reload();
                }
                else
                {
                    var path = [$rootScope.moduleName,response.module._id, 'view'].join('/');
                    // redirect to listage page
                    if( router == 'no-view' ) 
                        path = $rootScope.moduleName;
                    // redirect custom url
                    else if( router != undefined )
                        path = router;    

                    $location.path(path);
                    $route.reload();
                }
                toastr.success(response.output,"success");
            });
        };
        /**
        | --------------------------------------------------------------------------------
        | standard method to delete a record, 
        | render a modal with confirmation before sent request to delete item
        | --------------------------------------------------------------------------------
        */
        this.remove = function ( Module, params, callback )
        {
            if( Module == undefined )
            {
                toastr.error("Falha ao carregar modulo", 'Erro');
                return false;
            }
            else if( params == undefined ){
                toastr.error("É preciso informar os parametro para esta remoção!", 'Erro');
                return false;
            }
            else
            {
                var $this = this;
                messageBox.confirm({
                    title: 'Confirmação',
                    message: "Deseja mesmo remover este registro?",
                    callback: function (validate)
                    {
                        if (validate)
                        {
                            if( angular.isUndefined(callback) )
                            {
                                callback = function (response)
                                {
                                    toastr.success(response.output, 'sucesso');
                                    $route.reload();
                                };
                            }
                            Module.delete(params, callback);
                        }
                    }
                });                
            }
        };
    }]);