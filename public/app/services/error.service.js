angular.module('app.services')
.factory('$exceptionHandler', error);

error.$inject = ['$log', '$injector'];
function error($log, $injector){
    return function(exception, cause) {
        var toastr = $injector.get('toastr');
        var message = 'Um erro inesperado aconteceu.';
        if( exception == undefined)
            exception = {message: message};
        
        if( 'stack' in exception)
        {
            var arr = exception.stack.split('at');
            var $ul = angular.element('<ul/>');
            for(var i in arr){
                $ul.append(angular.element('<li/>', {text: arr[i]}));
            }
            message = $ul.html();
        }

        toastr.error(message, exception.message);
            
        $log.error(exception);
    };
}