var data_activity_cat = {
    1: {
        1: 'novostroyki'
    },
    2: {
        1: 'kupit-kvartiru',
        2: 'sniat-kvartiru',
        3: 'kvartiri-posutochno'
    },
    3: {
        1: 'kupit-komnatu',
        2: 'sniat-komnatu',
        3: 'komnati-posutochno'
    },
    4: {
        1: 'kupit-taunhaus',
        2: 'sniat-taunhaus'
    },
    5: {
        1: 'kupit-dom',
        2: 'sniat-dom',
        3: 'kottedji-posutochno'
    },
    6: {
        1: 'zemelnie-uchastki'
    },
    7: {
        1: 'garaji-kupit',
        2: 'garaji-sniat'
    },
    8: {
        1: 'ofisy-kupit',
        2: 'ofisy-sniat'
    }
};


$(function(){

    var methods = {

        getState: function(){
            return this.data('searchString').searchSelector.hasClass('active');
        },

        assume: function(){
            var data = this.data('searchString');

            if(data.searchSelector.hasClass('active')) {
                data.entryBlock.trigger('keyup');
            }
        },

        setCurrentCity: function(id){
            this.data('searchString').city = id;
        },

        init : function(options) {
            var $this = this;

            $this.data('searchString', {
                entryBlock: $('<input class="entry main-page-search-strings" tabindex="1" placeholder="'+$this.data("placeholder")+'" />'),
                searchSelector: $('<ul class="search-selector" />')
            });

            var thisData = $this.data('searchString');

            $this.append(thisData.entryBlock).after(thisData.searchSelector);

            thisData.entryBlock.css('width', $this.data('width'));

            function highlight(content, what) {
                what = $.trim(what);
                what = what.replace(/[\.,\/#!$%\^&\*;:"'(){}=_`~()]/g, '');
                what.replace(/\s{2,}/g, ' ');

                var whatArr = what.split(' ');

                whatArr.sort(function(a, b){
                    return b.length - a.length;
                });

                for(var i = 0, l = whatArr.length; i < l; i++){
                    var pattern = new RegExp(whatArr[i], 'gi');

                    content = content.replace(pattern, function(matched){
                        return '<span>' + matched + '</span>';
                    });
                }

                return content;
            }

            var t, cache = {};

            function process(data){


                thisData.searchSelector.html('').removeClass('active')

                if(data && data.length > 0){
                    var count = 0;

                    _.each(data, function(item){
                        if(item && item.title){
                            var $obj = $('<li />');


                            $obj.attr('data-region', thisData.city);
                            $obj.attr('data-title_small', item.title_small);
                            $obj.attr('data-url', item.url);
                            if(item.main != 0)
                                $obj.attr('data-region', item.main);

                            item.title = highlight(item.title, thisData.entryBlock.val());

                            $obj.html(item.title).data(item).appendTo(thisData.searchSelector);

                            if(item.type){
                                $obj.addClass(item.type);
                            }

                            count++;
                        }
                    });

                    if(count > 0){
                        thisData.searchSelector.addClass('active');
                    }
                }
            }

            function getData() {

                var val = thisData.entryBlock.val();

                cat = $($('.active[data-value]')[1]).data('value');


                val = val.replace(/[\.,\/#!$%\^&\*;:"'(){}=_`~()]/g, '');


                var data = options.dataGetter(val, cat),
                    token = options.url + JSON.stringify(data);

                if(val && val.length > 1){
                    if(cache[token]){
                        process(cache[token]);
                    } else {
                        console.log(data)
                        $.ajax({
                            url: options.url,
                            data: data,
                            success: function(data){
                                cache[token] = data;
                                process(data);
                            }
                        });
                    }
                }
            }

            thisData.entryBlock.on('keydown', function(e){
                if(!$(this).val() && $.inArray(e.keyCode, [37,38,39,40,13,8]) < 0){
                    $(this).prop('placeholder', '');
                    // $(this).css('width', 40);
                }
            });

            thisData.entryBlock.on('keyup', function(e){
                clearTimeout(t);

                if($(this).val() == '') {
                    thisData.searchSelector.removeClass('active');
                    thisData.entryBlock.attr('placeholder',thisData.entryBlock.parent().data('placeholder'));
                    return false;
                }

                if($.inArray(e.keyCode, [37,38,39,40,13]) < 0) {
                    t = setTimeout(function(){
                        getData();
                    }, 200);
                } else {
                    e.preventDefault();

                    var active = thisData.searchSelector.find('li.active');

                    if(e.keyCode == 40 && active.next().is('li'))
                        active.removeClass('active').next().addClass('active');
                    if(e.keyCode == 38 && active.prev().is('li'))
                        active.removeClass('active').prev().addClass('active');
                    if(e.keyCode == 13)
                        active.click();
                }
            });


            $(document).on('click.searchString', function(){
                thisData.searchSelector.removeClass('active');
            });

            thisData.entryBlock.on('focus', function(){
                $this.addClass('focused');
            });

            thisData.entryBlock.on('blur', function(){
                $this.removeClass('focused');
            });

            $('.search-string, .search-selector').on('click', function(e){
                e.stopPropagation();
                thisData.entryBlock.focus();

                if(thisData.entryBlock.html() != '')
                    thisData.searchSelector.addClass('active');
            });

            thisData.searchSelector.on('click.li', 'li', function(e){

                var data = $(this).data('title_small');
                    thisData.searchSelector.find('li').remove('.active');
                    $(this).addClass('active');

                e.stopPropagation();
                thisData.searchSelector.removeClass('active');
                thisData.entryBlock.val(data);

            });
        }
    };

    $.fn.KVTestSearchString = function(methodOrOptions) {
        if ( methods[methodOrOptions] ) {
            return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.KVSearchString' );
        }
        return this;
    };

    $('.sp-wrapper .inner-image img').on('load', function(){
        $(this).show();
    });

    var ClickOutside = function(options){
        var _this = this,
            _id = _.uniqueId('UIClickOutside_');

        this.options = $.extend({
            selector: '',
            onClickOutside: function($target){}
        }, options);

        this.bind = function(){
            this.unbind();

            $(document).on('mouseup.' + _id, function (e){
                var $container = $(_this.options.selector);

                if (!$container.is(e.target) && $container.has(e.target).length === 0){
                    _this.options.onClickOutside(e.target);
                }
            });
        };

        this.unbind = function(){
            $(document).off('mouseup.' + _id);
        };
    };

    var co = new ClickOutside({
        selector: '.filter',
        onClickOutside: function() {
            $('.search-selector').removeClass('active');
        }
    });

    co.bind();

    /**
    *
    *
    */
    $('.filter').KVTestSearchString({
        "dataGetter":function(val, cat){
            return {'text':val, 'cat': cat};}
        ,'url':'http://www.kvadroom.ru/action/search_text_main/'}
    );

    $($('.dropdown')[1]).find('li').on('mousedown', function(){
        var objectId = $(this).data('value');
        var actions = data_activity_cat[objectId];

        var elems = $($('.dropdown')[0]).find('li');
        $.each(elems, function(){
            $(this).addClass('hide').removeClass('active');
        });

        for(var i in actions ){
            $(elems[i-1]).removeClass('hide');
        }
        $($($('.dropdown')[0]).find('li').not('.active')[0]).addClass('active');
        $($('.dropdown')[0]).find('.title').html($($('.dropdown')[0]).find('li').not('.hide')[0].innerText);
    });


    //@TODO: оформить в функцию
    $('div.btn.blue').on('click', function(){

        var cat;
        var url = $('.search-selector li.active').data('url');
            option1 = $($('.active[data-value]')[0]).data('value');
            option2 = $($('.active[data-value]')[1]).data('value');
            cat = data_activity_cat[option2][option1];

        var prefix = url || '';
        document.location = prefix + cat;

    });


    (function($) {

        $.fn.bgSlider = function(options){


            var defaults = {            
            speed: 500,
            duration: 10000,
            }; 

            var options = $.extend(defaults, options);

            var self = $(this);
            console.log($('li', self));

        };

    })(jQuery);

    $('.bgSlider').bgSlider();
});


