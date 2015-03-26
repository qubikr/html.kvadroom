(function ($) {
    $.fn.KVLoadingElement = function (method) {
        var settings = {
            invert: false,
            overlay: false,
            big: false,
            opacity: 0.8,
            append: false,
            zIndex_overlay: 1000,
            timeout: 15000,
            onTimeout: function(){

            }
        };

        function setLoading($element){
            var class_name = 'loading-dots',
                css = {
                    top: '50%',
                    left: '50%',
                    marginLeft: -13,
                    marginTop: -6,
                    zIndex: 10
                };

            if($element.data('KVLoadingElement').settings.invert === true){
                class_name = 'loading-dots-invert';
            }

            if($element.data('KVLoadingElement').settings.overlay === true){
                if($element.css('position') == 'static' || $element.css('position') == ''){
                    $element.css({
                        position: 'relative'
                    });
                }

                if($element.data('KVLoadingElement').settings.big == true){
                    class_name += ' big';
                    css = {
                        top: '50%',
                        left: '50%',
                        marginLeft: -36,
                        marginTop: -6,
                        zIndex: 10
                    };
                }

                $element.append(
                    '<div class="loading-element-overlay">' +
                        '<span class="KVLoadingElement-dots ' + class_name + '">' +
                        '<i class="loading-dot-1"></i>' +
                        '<i class="loading-dot-2"></i>' +
                        '<i class="loading-dot-3"></i>' +
                        '</span>' +
                        '</div>'
                );

                $element.find('.loading-element-overlay').css({
                    zIndex: $element.data('KVLoadingElement').settings.zIndex_overlay
                }).animate({
                        opacity: $element.data('KVLoadingElement').settings.opacity
                    }, 200);

                $element.find('.KVLoadingElement-dots').css(css);

            }else{
                var html = '<span class="' + class_name + '">' +
                    '<i class="loading-dot-1"></i>' +
                    '<i class="loading-dot-2"></i>' +
                    '<i class="loading-dot-3"></i>' +
                    '</span>';

                if($element.data('KVLoadingElement').settings.append !== false){
                    if($element.data('KVLoadingElement').settings.append == 'prepend'){
                        $element.prepend(html);
                    }else{
                        $element.append(html);
                    }
                }else{
                    $element.html(html);
                }
            }

            $element.data('loading_to', setTimeout(function(){
                if($element && $element.length > 0) {
                    unsetLoading($element);

                    if($element.data('KVLoadingElement') && $element.data('KVLoadingElement').settings) {
                        $element.data('KVLoadingElement').settings.onTimeout();
                    }
                }
            }, $element.data('KVLoadingElement').settings.timeout));
        }

        function unsetLoading($element, done){
            clearTimeout($element.data('loading_to'));

            if($element.data('KVLoadingElement') && $element.data('KVLoadingElement').settings.overlay != true){
                $element.html($element.data('KVLoadingElement').content);
            }else{
                var $loading = $element.find('.loading-element-overlay, .loading-dots, .loading-dots-invert');

                $loading.fadeOut(200, function(){
                    $loading.remove();
                    if(done) done();
                });
            }
        }

        var methods = {
            init: function (options) {
                return this.each(function () {
                    var $this = $(this),
                        data = $this.data('KVLoadingElement');

                    if (!data) {
                        $this.data('KVLoadingElement', {
                            settings: $.extend(settings, options),
                            content: $this.html()
                        });
                    }

                    setLoading($this);
                });
            },

            stop: function(done){
                unsetLoading(this, done);
            }
        };

        if (methods[method]) {
            return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('KVLoadingElement Invalid method!');
        }
    };
})(jQuery);
