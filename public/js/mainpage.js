$(function(){

     if(!$('body').hasClass('main-page'))
        return;

    jQuery.fn.fadeSlideShow = function(options) {
        return this.each(function(){
            settings = jQuery.extend({
                width: 640, // default width of the slideshow
                height: 480, // default height of the slideshow
                speed: 'slow', // default animation transition speed
                interval: 3000, // default interval between image change
                autoplay: true, // autoplay the slideshow
                load: false

            }, options);

            // set style for wrapper element
            jQuery(this).css({
                width: settings.width,
                height: settings.height,
                position: 'relative',
                overflow: 'hidden'
            });

            // set styles for child element
            jQuery('> *',this).css({
                position: 'absolute',
                width: settings.width,
                height: settings.height
            });

            jQuery(this)
                .find('img.lazy:eq(0)')
                .each(function() {
                    var src = $(this).attr('data-src');
                    $(this).attr('src', src).removeAttr('data-src');
                });

            // count number of slides
            var Slides = jQuery('> *', this).length;
            Slides = Slides - 1;
            var ActSlide = Slides;
            // Set jQuery Slide short var
            var jQslide = jQuery('> *', this);
            // save this
            var fssThis = this;
            var intval = false;
            var autoplay = function(){
                intval = setInterval(function(){

                    jQslide.parent()
                        .find('img.lazy:eq(' + ActSlide + '), img.lazy:eq(' + (ActSlide - 1 ) + '), img.lazy:eq(' + (ActSlide + 1) + ')')
                        .each(function() {
                            var src = $(this).attr('data-src');
                            if(src)
                                $(this).attr('src', src).removeAttr('data-src');
                        });

                    jQslide.eq(ActSlide).fadeOut(settings.speed);


                    if(ActSlide <= 0){
                        jQslide.fadeIn(settings.speed);
                        ActSlide = Slides;
                    }else{
                        ActSlide = ActSlide - 1;
                    }
                }, settings.interval);

            }

            var jumpTo = function(newIndex){
                if(newIndex < 0){newIndex = Slides;}
                else if(newIndex > Slides){newIndex = 0;}
                if( newIndex >= ActSlide ){
                    jQuery('> *:lt('+(newIndex+1)+')', fssThis).fadeIn(settings.speed);
                }else if(newIndex <= ActSlide){
                    jQuery('> *:gt('+newIndex+')', fssThis).fadeOut(settings.speed);
                }

                // set the active slide
                ActSlide = newIndex;

                if(settings.ListElement){
                    // set active
                    jQuery('#'+settings.ListElement+' li').removeClass(settings.ListLiActive);
                    jQuery('#'+settings.ListElement+' li').eq((Slides-newIndex)).addClass(settings.ListLiActive);
                }
            }

            // if list is on render it
            if(settings.ListElement){
                var i=0;
                var li = '';
                while(i<=Slides){
                    if(i==0){
                        li = li+'<li class="'+settings.ListLi+i+' '+settings.ListLiActive+'"><a href="#">'+(i+1)+'<\/a><\/li>';
                    }else{
                        li = li+'<li class="'+settings.ListLi+i+'"><a href="#">'+(i+1)+'<\/a><\/li>';
                    }
                    i++;
                }
                var List = '<ul id="'+settings.ListElement+'">'+li+'<\/ul>';

                // add list to a special id or append after the slideshow
                if(settings.addListToId){
                    jQuery('#'+settings.addListToId).append(List);
                }else{
                    jQuery(this).after(List);
                }

                jQuery('#'+settings.ListElement+' a').bind('click', function(){
                    var index = jQuery('#'+settings.ListElement+' a').index(this);
                    stopAutoplay();
                    var ReverseIndex = Slides-index;

                    jumpTo(ReverseIndex);

                    return false;
                });
            }
            settings.load(this);
            if(settings.autoplay){autoplay();}else{intval=false;}
        });
    };


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

    $('.filter').KVTestSearchString({
            "dataGetter":function(val, cat){
                return {'text':val, 'cat': cat};}
            ,'url':'http://www.kvadroom.ru/action/search_text_main/'}
    );

    // Обработчик выбора объекта недвижимости (ОН)
    $('.dropdown').eq(1).find('li').on('mousedown', function(){

        var objectId = $(this).data('value');
        var typeActionUl = $('.dropdown').eq(0);
        var elems = typeActionUl.find('li');
        
        // получаем объект с вариантами действий у выбранного ОН
        var actions = data_activity_cat[objectId];

        // запоминаем уже выбранный пункт
        var choosenActionIndex = typeActionUl.find('li.active').index();

        // выставляем сначала все элементы закрытымти
        elems.each(function(){
            $(this).addClass('disabled').removeClass('active');
        });

        //По очереди открываем доступные действия
        for(var i in actions){
            elems.eq(i-1).removeClass('disabled');
        }
        // Если выбранный ранне элемент возможен - сделать его активным, если нет - выбрать первый доступный
        typeActionUl.find('li').eq(choosenActionIndex).hasClass('disabled') ?
            typeActionUl.find('li').not('.disabled').eq(0).addClass('active'):
            typeActionUl.find('li').eq(choosenActionIndex).addClass('active'); 
        
        typeActionUl.find('.title').html(typeActionUl.find('li.active').text());
    });

    $('.dropdown').eq(0).find('li').on('mousedown', function(e){
        if($(this).hasClass('disabled')) {
            e.preventDefault();
            return false;
        }
    })

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

    $('.bgSlider').fadeSlideShow({
        width: 1440,
        height: 560,
        autoplay: true,
        interval: 10000,
        load: function(elem){
            $(elem).css('display', 'block');
        }
    });
});


