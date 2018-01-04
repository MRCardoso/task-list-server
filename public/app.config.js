'use strict';

angular.module('mrc-task-list', [
    'ngRoute',
    'ngResource',
    'toastr',
    'ui.bootstrap',
    'ngSanitize',
    'LocalStorageModule',
    'form.uploader',
    'app.models',
    'app.routes',
    'app.directives',
    'app.filters',
    'app.providers',
    'app.services',
    'app.controllers',
    'table.grid',
    'ui.tinymce',
    'chart.js'
])
.config(['$locationProvider','toastrConfig','localStorageServiceProvider','tableConfig', 'ChartJsProvider','$qProvider',
    function ($locationProvider,toastrConfig,localStorageServiceProvider, tableConfig, ChartJsProvider, $qProvider) {
        localStorageServiceProvider.setPrefix('mean').setStorageType('localStorage');

        // $qProvider.errorOnUnhandledRejections(false);

        ChartJsProvider.setOptions({
            colors : [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'],
            showLines: false
        });

        angular.extend(tableConfig, {
            // debugMode: true,
            appLabels: { 
                "status": {
                    "0": { "name": "Inativo", "class": "default", "color": "#b2b2b2"},
                    "1": { "name": "Ativo", "class": "success", "icon": "ok-circle", "color": "#28a54c"}
                },
                "typeConfig": {
                    "1": { "name": "Style", "class": "default"},
                    "2": { "name": "Script", "class": "success"},
                    "3": { "name": "Image", "class": "success"}
                },
                "priority":
                {
                    "1": { "name": "Baixa", "class": "info", "color": "#11c1f3"},
                    "2": { "name": "Média", "class": "warning", "color": "#ffc900" },
                    "3": { "name": "Alta", "class": "danger", "color": "#e42112" }
                },
                "situation":
                {
                    "1": { "name": "Aberto", "class":"primary", "color": "#0c60ee" },
                    "2": { "name": "Concluído", "class":"success", "color": "#28a54c" },
                    "3": { "name": "Cancelado", "class":"danger", "color": "#e42112" },
                    "4": { "name": "Em processo", "class":"warning", "color": "#ffc900" },
                    "5": { "name": "Expirado", "class":"default", "color": "#b2b2b2" },
                    "6": { "name": "Em espera", "class":"info", "color": "#11c1f3" },
                },
                "type":
                {
                    "1": { "name": "Sidebar", "class": "info" },
                    "2": { "name": "action", "class": "primary" },
                },
            }
        });

        angular.extend(toastrConfig, {
            allowHtml: true,
            autoDismiss: false,
            closeButton: true,
            closeHtml: '<button>&times;</button>',
            containerId: 'toast-container',
            extendedTimeOut: 1000,
            iconClasses: {
                error: 'toast-error',
                info: 'toast-info',
                success: 'toast-success',
                warning: 'toast-warning'
            },
            maxOpened: 0,
            messageClass: 'toast-message',
            newestOnTop: true,
            onHidden: null,
            onShown: null,
            positionClass: 'toast-top-right',
            preventDuplicates: false,
            preventOpenDuplicates: false,
            progressBar: true,
            tapToDismiss: true,
            target: 'body',
            templates: {
                toast: 'directives/toast/toast.html',
                progressbar: 'directives/progressbar/progressbar.html'
            },
            timeOut: 5000,
            titleClass: 'toast-title',
            toastClass: 'toast'
        });
        // used to engines of the search in web
        // know that this application is load with ajax
        $locationProvider.hashPrefix('!');
}]);