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
                tasks.map(function (task, index)
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
            $scope.task = {startDate: Date.now(), status: 1, priority: "1", situation: "1"};
            
            if($routeParams.taskId)
            {
                itens["label"] = "Editar";
                Task.get({ taskId: $routeParams.taskId })
                .$promise.then(function(task) {
                    $scope.task = task;
                    
                    $scope.task.status = +$scope.task.status;
                    $scope.task.situation = String($scope.task.situation);
                    $scope.task.startDate = new Date(task.startDate);
                    $scope.task.endDate = task.endDate != null ? new Date(task.endDate) : null;
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
                var task = new Task({
                    title:          this.task.title,
                    description:    this.task.description,
                    priority:       this.task.priority,
                    situation:      this.task.situation,
                    status:         this.task.status,
                    startDate:      this.task.startDate,
                    endDate:        this.task.endDate
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