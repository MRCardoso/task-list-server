angular.module('mrc-task-list')
.run(["$location", "$rootScope","Authentication", "localStorageService", function($location, $rootScope, Authentication, localStorageService)
    {
        $rootScope.imagerender = null;
        $rootScope.loading = false;
        $rootScope.withCreate = true;        
        
        $rootScope.s3_url = window.S3URL;
        $rootScope.userImages = window.uploadFolder;
        
        window.S3URL = null;
        window.userImages = null;

        if( Authentication.user != null )
        {
            var requestUri = localStorageService.get('task.list.lastInterface') != undefined ? localStorageService.get('task.list.lastInterface') : '/';
            if( requestUri != '/')
            {
                $location.path(requestUri);
                localStorageService.remove('task.list.lastInterface');
            }
        }

        $rootScope.$on('form.uploader.begin', function(e){
            $rootScope.loading = true;
        });
        $rootScope.$on('form.uploader.finish', function(e,f,g){
            $rootScope.loading = false;
        });

        $rootScope.$on( "$routeChangeStart", function(event, next, current)
        {
            $rootScope.$emit('logo.hassing', Date.now());
            $rootScope.inpercurse = true;
            if( next.$$route != undefined )
            {
                var path = next.$$route.originalPath.split('/').filter(function(r){ return r != ''; });
                $rootScope.moduleName = path[0];
            }
        });
        console.info('app running');
    }]);

    angular.bootstrap(document,['mrc-task-list']);