angular
    .module("app.controllers")
    .controller('TaskController', ['$scope', 'Task', '$routeParams', 'CoreService', 'tableConfig', 'defaultTinymceOptions','$resource',
    function ($scope, Task, $routeParams, CoreService, tableConfig,defaultTinymceOptions,$resource) 
    {
        $scope.lines = [{path: 'tasks', label: 'Tarefa'}];
        
        CoreService.validatePermission();
        
        $scope.situations = tableConfig.appLabels.situation;        
        $scope.priorities = tableConfig.appLabels.priority;
        $scope.tinymceOptions = defaultTinymceOptions;

        $scope.ratingPriority = function(value)
        {
            $scope.task.priority = value;
        };

        $scope.find = function ()
        {
            $scope.tasks = Task.query();
            $scope.tasks.$promise.then(function(tasks)
            {
                $scope.options = {
                    thickness: 10,
                    duration: 8000,
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                };
                var values = {
                    "situation":{v:{}, name: "Situação", data:[], labels:[], colors: []},
                    "status":{v:{}, name: "Status", data:[], labels:[], colors: []},
                    "priority":{v:{}, name: "Prioridade", data:[], labels:[], colors: []},
                };
                tasks.map(function(task)
                {
                    task.status = +task.status;
                    for( var i in values){
                        if( values[i]['v'][task[i]] == undefined )
                            values[i]['v'][task[i]] = 1;
                        else
                            values[i]['v'][task[i]] += 1;
                    }
                });
                angular.forEach(values, function(value, key)
                {
                    var instanceLabel = tableConfig.appLabels[key];
                    if( instanceLabel != undefined)
                    {
                        angular.forEach(instanceLabel, function(row,k){
                            values[key].labels.push(row.name);
                            values[key].colors.push(row.color);
                            values[key].data.push(value.v[k]);
                        })
                    }
                });
                $scope.charts = values;
            });
        };
        
        $scope.findOne = function()
        {
            var itens = {"path": false, "label": "Novo"};            
            $scope.task = {start_date: Date.now(), status: 1, priority: "1", situation: "1"};
            
            if($routeParams.taskId)
            {
                itens["label"] = "Editar";
                Task.get({ taskId: $routeParams.taskId })
                .$promise.then(function(task) {
                    $scope.task = task;
                    console.log($scope.task.status);
                    $scope.task.status = +$scope.task.status;
                    $scope.task.start_date = new Date(task.start_date);
                    $scope.task.end_date = task.end_date != null ? new Date(task.end_date) : null;
                });
            }
            $scope.lines.push(itens);
        }
        
        $scope.save = function()
        {
            if($routeParams.taskId){
                CoreService.save($scope.task);
            }
            else
            {
                console.log(this.task);
                var task = new Task({
                    title:          this.task.title,
                    description:    this.task.description,
                    priority:       this.task.priority,
                    situation:      this.task.situation,
                    status:         this.task.status,
                    start_date:      this.task.start_date,
                    end_date:        this.task.end_date
                });
                CoreService.save(task);
            }
        };

        /**
         * @param id
         */
        $scope.$root.delete = function (id)
        {
            CoreService.remove( Task, { taskId: id } );
        };
    }]);