angular
    .module("app.controllers")
    .controller('UserController', ['$scope', '$routeParams', '$location', '$filter', 'User', 'CoreService', 'Authentication', "defaultConfig", function ($scope, $routeParams, $location, $filter, User, CoreService, Authentication, defaultConfig) {
        $scope.lines = [{ path: 'users', label: 'Usuário' }];
        $scope.isSimple = (Authentication.isAuthenticated() && !Authentication.user.isSuperUser ? true : false);

        if (/myData/.test($location.$$path)) {
            $scope.moduleName = 'users';
        }

        CoreService.validatePermission();

        $scope.find = function () {
            $scope.users = User.admin.query();
        };

        $scope.findOne = function () {
            var itens = { "path": false, "label": "Novo" };
            $scope.user = { status: 1 };

            if ($routeParams.userId) {
                itens["label"] = "Editar";
                var model;

                if (/(myData)/.test($location.$$path))
                    model = User.auth.get({ userId: Authentication.user._id });
                else
                    model = User.admin.get({ userId: $routeParams.userId });

                model.$promise.then(function (user) {
                    console.log(user);
                    var names = user.name.split(' ');

                    $scope.removeUrl = defaultConfig.removeImageUrl;
                    $scope.sendUrl = defaultConfig.sendImageUrl(user._id);
                    $scope.user = user;
                    $scope.user.firstName = names.shift();
                    $scope.user.lastName = names.join(' ');
                });
            }
            $scope.lines.push(itens);
        }

        $scope.save = function () {
            var fname = this.user.firstName || '',
                lname = this.user.lastName || '';

            this.user.name = [fname, lname].join(' ');

            if ($routeParams.userId) {
                CoreService.save(this.user, 'reload');
            }
            else {
                var user = new User['admin']({
                    status: this.user.status,
                    name: this.user.name,
                    email: this.user.email,
                    username: this.user.username,
                    password: this.user.password,
                    image: this.user.image,
                });
                CoreService.save(user);
            }
        };

        $scope.$root.delete = function (id) {
            CoreService.remove(User.admin, { userId: id });
        };
        $scope.deleteToken = function (userId, id) {
            CoreService.remove(User.actionApi, { userId: userId, apiId: id });
        };
        $scope.checkExpiration = function(expires) {
            return expires > Date.now();
        }
    }]);