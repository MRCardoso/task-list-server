angular.module('mrc-task-list')
.constant('defaultTinymceOptions', {
    onChange: function(e) {
        console.info(e);
        /*put logic here for keypress and cut/paste changes*/
    },
    inline: false,
    menubar: false,
    plugins: 'charmap hr searchreplace emoticons image media insertdatetime table print code preview fullscreen textcolor nonbreaking',//'preview code',
    toolbar: [
        'undo redo styleselect | bullist numlist indent outdent | alignleft aligncenter alignright alignjustify | print fullscreen |',
        ' bold italic underline | charmap hr searchreplace | emoticons image media | insertdatetime table | code preview | no-breaking nonbreaking forecolor backcolor'
    ].join(''),
    skin: 'lightgray',
    theme : 'modern',
    file_browser_callback_types: 'file image media',
    file_browser_callback: function(field_name, url, type, win) {
    }
})
.constant('defaultConfig', {
    removeImageUrl: "/api/removeObject",
    sendImageUrl: function(id){
        return "/api/upload/"+id;
    }
});