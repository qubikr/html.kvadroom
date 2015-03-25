var UIClickOutside = function(container, onClickOutside){
    var $container = $(container);
 
    this.bind = function(){
        $(document).on('mouseup.UIClickOutside', function (e){
            if (!$container.is(e.target) && $container.has(e.target).length === 0){
                if(onClickOutside) onClickOutside(e.target);
            }
        });
    };
 
    this.unbind = function(){
        $(document).off('mouseup.UIClickOutside');
    };
};