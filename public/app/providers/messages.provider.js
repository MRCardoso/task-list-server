angular.module('app.providers', [])
.provider('messageBox', function() {
  
  	var alert = function(params)
	{
    	bootbox.dialog({
			"message": params.message,
			"title": params.title,
			"buttons":
			{
				success:
				{
					label: "OK",
					callback: params.callback
				}
			}
		});
	};
	
	var confirm = function(params){
		bootbox.dialog({
			"title": params.title,
			"message": params.message,
			"buttons":
			{
				fail:
				{
					label: "Cancel",
					className: "btn-default",
					callback:function()
					{
						params.callback(false);
					}
				},
				success:
				{
					label: "Confirm",
					className: "btn-primary",
					callback: function()
					{
						params.callback(true);
					}
				}
			}
		});
	};

  	this.$get = function(){
    	return {
			alert: alert,
			confirm: confirm,
			prompt: function(params){
				bootbox.prompt(params);
			},
			custom: function(params){
				bootbox.dialog({
                    "message":   params.message,
                    "title":    params.title,
                    "buttons":  params.buttons
                });
			}
		};
  	};
});