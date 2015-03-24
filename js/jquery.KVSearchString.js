(function( $ ){
    var methods = {
        collapse: function(){
            this.find('input.entry').prop('placeholder', '').css('width', 40);

            return this;
        },

        expand: function(){
            this.find('input.entry').prop('placeholder', this.data("placeholder")).css('width', this.data("width"));

            return this;
        },

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
                entryBlock: $('<input class="entry" tabindex="1" placeholder="'+$this.data("placeholder")+'" />'),
                searchSelector: $('<ul class="search-selector" />'),
                train: $('<span class="train" />')
            });

            var thisData = $this.data('searchString');

            $this.append(thisData.entryBlock, thisData.train).after(thisData.searchSelector);

            thisData.entryBlock.css('width', $this.data('width'));
            thisData.entryBlock.autosizeInput();

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

                    $.each(data, function(k, v){
                        if(v && v.title){
                            var $obj = $('<li />');

                            $obj.attr('data-region', thisData.city);

                            v.title = highlight(v.title, thisData.entryBlock.val());

                            $obj.html(v.title).data(v).appendTo(thisData.searchSelector);

                            if(v.type){
                                $obj.addClass(v.type);
                            }

                            count++;
                        }
                    });

                    if(count > 0){
                        thisData.searchSelector.find('li').eq(0).addClass('active');
                        thisData.searchSelector.addClass('active');
                    }
                }
            }

            function getData(){
                var val = thisData.entryBlock.val();

                val = val.replace(/[\.,\/#!$%\^&\*;:"'(){}=_`~()]/g, '');

                var data = options.dataGetter(val),
                    token = options.url + JSON.stringify(data);

                if(val && val.length > 1){
                    if(cache[token]){
                        process(cache[token]);
                    }else{
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
                    $(this).css('width', 40);
                }
            });

            thisData.entryBlock.on('keyup', function(e){
                clearTimeout(t);

                if($(this).val() == '') {
                    thisData.searchSelector.removeClass('active');

                    if(thisData.train.children().length == 0) {
                        thisData.entryBlock.val('').css('width', $this.data("width")).prop('placeholder', $this.data("placeholder"));
                    }

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
                e.stopPropagation();
                thisData.searchSelector.removeClass('active');
                thisData.entryBlock.val('').css('width', 50).prop('placeholder', '');
                $this.trigger('select', $(this).data());
            });
        }
    };

    $.fn.KVSearchString = function(methodOrOptions) {
        if ( methods[methodOrOptions] ) {
            return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.KVSearchString' );
        }
        return this;
    };

})( jQuery );