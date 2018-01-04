angular.module('app.services')
    .factory('Authentication',function (){
        this.user = window.user;
        if(this.user){
            this.user.isSuperUser = window.isSuperUser;
        }

        window.user = null;
        window.isSuperUser = null;        
        
        return {
            user: this.user,
            isAuthenticated: function(){
                return (this.user != null);
            }
        }
    });