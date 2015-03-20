var GeoMap = function(opts){
    var _this = this,
        map,
        balloons = [],
        options = $.extend({
            id: 'map',
            fullScreenTrigger: false,
            center: [55.76, 37.64],
            zoom: 10,
            layer: 'map',
            onInit: function(){},
            onFullscreenEnter: function(){},
            onFullscreenExit: function(){}
        }, opts);

    var $map = $('#' + options.id);

    if(options.fullScreenTrigger){
        $(options.fullScreenTrigger).off('click').on('click', function(e){
            e.preventDefault();
            _this.enterFullScreen();
        });
    }

    var draw = function(){
        map = new ymaps.Map(options.id, {
            center: options.center,
            zoom: options.zoom
        });
    };

    var Balloon = function(center, content, onReady, onClick, offsetY, offsetX){
        var _this = this,
            id = _.uniqueId('balloon'),
            $element = $(),
            permanent = false,
            balloon = new ymaps.Placemark(center, {
                iconContent: '<div class="map-balloon disabled" id="' + id + '"><div class="inner">' + content + '</div></div>'
            }, {
                iconImageHref: '',
                iconImageSize: 20,
                iconImageOffset: 10,
                zIndex: 2
            });

        balloon.events.add('overlaychange', function(){
            $element = $('#' + id);

            $element.css({
                marginTop: -(($element.height()/2) - ((offsetY) ? offsetY : 0)),
                marginLeft: (offsetX) ? offsetX : 0
            });

            if(onReady) onReady();
        });

        balloon.events.add('click', function(){
            if(onClick) onClick();
        });

        map.geoObjects.add(balloon);

        var hideOnClick = function(){
            _this.hide();
        };

        this.getId = function(){
            return id;
        };

        this.show = function(permanentShow){
            $element.removeClass('disabled');
            map.events.add('click', hideOnClick);

            _.each(balloons, function(balloon){
                if(balloon.getId() != _this.getId()){
                    balloon.hide();
                }
            });

            if(permanent !== true){
                permanent = permanentShow;
            }
        };

        this.hide = function(){
            if(permanent !== true){
                $element.addClass('disabled');
                map.events.remove('click', hideOnClick);
            }
        };

        balloons.push(this);
    };

    var fitBounds = function(bounds){
        var coords = ymaps.util.bounds.getCenterAndZoom(bounds, [ 
            $map.width(), 
            $map.height() 
        ]);

        map.setCenter(coords.center);
        map.setZoom(coords.zoom);
    };

    this.Pin = function(opts){
        var options = $.extend({
            center: [55.76, 37.64],
            content: '',
            title: '',
            onReady: function(){},
            onClick: function(){},
            onBalloonReady: function(){},
            onBalloonClick: function(){}
        }, opts);

        var id = _.uniqueId('pin'),
            title = (options.title) ? '<span class="marker-title">' + options.title + '</span>' : '',
            $element = $();

        var pin = new ymaps.Placemark(options.center, {
            iconContent: '<span class="maps-marker-icon maps-marker-basic" id="' + id + '">' + title + '</span>'
        }, {
            iconImageHref: '',
            iconImageSize: [31, 43],
            iconImageOffset: [-21, -49]
        });

        map.geoObjects.add(pin);

        var balloon = null;

        if(options.content){
            balloon = new Balloon(options.center, options.content, options.onBalloonReady, options.onBalloonClick, -25, 18);
        }

        pin.events.add('click', function(){
            map.panTo(options.center, {
                delay: 0
            });

            options.onClick();

            if(balloon){
                balloon.show();
            }
        });

        pin.events.add('overlaychange', function(){
            if(options.onReady) options.onReady();

            $element = $('#' + id);

            var $title = $element.find('.marker-title');

            $title.css({
                bottom: -$title.outerHeight()
            });
        });

        this.pointMap = function(){
            map.setCenter(options.center);
        };

        this.showBalloon = function(permanent){
            if(balloon){
                balloon.show(permanent);
            }
        };

        this.hideBalloon = function(){
            if(balloon){
                balloon.hide();
            }
        };
    };

    this.Area = function(opts){
        var options = $.extend({
            coords: [],
            content: '',
            onReady: function(){},
            onClick: function(){},
            onBalloonReady: function(){},
            onBalloonClick: function(){}
        }, opts);

        var area = new ymaps.GeoObject({
            geometry: {
                type: 'Polygon',
                coordinates: options.coords,
                fillRule: 'nonZero'
            }
        }, {
            fillColor: 'rgba(255, 0, 0, 0.1)',
            strokeColor: 'rgba(255, 0, 0, 1)',
            opacity: 1,
            strokeWidth: 2
        });

        map.geoObjects.add(area);

        var bounds = area.geometry.getBounds(),
            balloon = null,
            center = [
                bounds[0][0] + ((bounds[1][0] - bounds[0][0]) / 2),
                bounds[0][1] + ((bounds[1][1] - bounds[0][1]) / 2)
            ];

        if(options.content){
            var balloonCoords = [center[0], bounds[1][1]];
            balloon = new Balloon(balloonCoords, options.content, options.onBalloonReady, options.onBalloonClick);
        }

        area.events.add('click', function(){
            map.panTo(center, {
                delay: 0
            });

            options.onClick();

            if(balloon){
                balloon.show();
            }
        });

        area.events.add('overlaychange', function(){
            if(options.onReady) options.onReady();
        });

        this.pointMap = function(){
            map.setCenter(center);
        };

        this.fitMap = function(){
            fitBounds(bounds);
        };

        this.showBalloon = function(permanent){
            if(balloon){
                balloon.show(permanent);
            }
        };

        this.hideBalloon = function(){
            if(balloon){
                balloon.hide();
            }
        };
    };

    var resizeFullscreen = function(speed){
        var w = 0,
            h = 0,
            $overlay = $('.map-fullscreen-overlay');

        w = $overlay.width() - 200;
        h = $overlay.height() - 200;

        var interval = null;

        if(speed > 0){
            interval = setInterval(function(){
                map.container.fitToViewport();
            }, 1);
        }

        $map.parent().animate({
            width: w,
            height: h,
            top: 100,
            left: 100
        }, speed, function(){
            clearInterval(interval);

            if(map && map.container){
                map.container.fitToViewport();
            }
        });
    };

    var initResize = function(done){
        var os = {};

        if(!$map.parent().data('originalSize')){
            os = {
                h: $map.parent().height()
            };

            $map.parent().data('originalSize', os);
        }else{
            os = $map.parent().data('originalSize');
        }

        $map.parent().addClass('map-fullscreen');

        var $dummy = $('<div/>');

        $dummy.addClass('map-fs-dummy').css({
            height: os.h
        });

        $map.parent().after($dummy);

        $map.parent().css({
            width: $dummy.width(),
            height: $dummy.height(),
            top: $dummy.offset().top - $(document).scrollTop(),
            left: $dummy.offset().left
        });

        if(map && map.container){
            map.container.fitToViewport();
        }

        if(done) done();
    };

    this.enterFullScreen = function(){
        $('body').append('<div class="map-fullscreen-overlay"><a class="map-fullscreen-close kiv-e" href="#"><i class="icon-font icon-font-cross"></i></a></div>');
        $('html,body').css('overflow', 'hidden');

        setTimeout(function(){
            $('.map-fullscreen-overlay').addClass('ready');
        }, 50);

        $(document).off('keyup.map-fullscreen').on('keyup.map-fullscreen', function(e){
            if(e.keyCode == 27){
                _this.exitFullScreen();
            }
        });

        $('.map-fullscreen-close').off('click').on('click', function(e){
            e.preventDefault();
            _this.exitFullScreen();
        });

        if(options.fullScreenTrigger){
            $(options.fullScreenTrigger).hide();
        }

        initResize(function(){
            resizeFullscreen(400);

            setTimeout(function(){
                $(window).off('resize.mapFullscreen').on('resize.mapFullscreen', function(){
                    resizeFullscreen(0);
                });

                setTimeout(function(){
                    $(window).trigger('resize');
                }, 50);
            }, 400);
        });        
    };

    this.exitFullScreen = function(){
        $(window).off('resize.mapFullscreen');
    
        if(options.fullScreenTrigger){
            $(options.fullScreenTrigger).show();
        }

        var $dummy = $('.map-fs-dummy'),
            interval = setInterval(function(){
                map.container.fitToViewport();
            }, 1);

        $('.map-fullscreen-overlay').removeClass('ready');

        setTimeout(function(){
            $('.map-fullscreen-overlay').remove();
        }, 400);

        $map.parent().animate({
            width: $dummy.width(),
            height: $dummy.height(),
            top: $dummy.offset().top - $(document).scrollTop(),
            left: $dummy.offset().left
        }, 400, function(){
            $map.parent().removeClass('map-fullscreen');
            clearInterval(interval);
            $dummy.remove();
            $('html,body').css('overflow', 'auto');
            map.container.fitToViewport();
        });       

        map.container.fitToViewport();
    };

    this.init = function(){
        if(typeof ymaps != 'undefined'){
            draw();
            options.onInit(_this);
        }else{
            $.getScript("http://api-maps.yandex.ru/2.0-stable/?load=package.full&lang=ru-RU", function() {
                ymaps.ready(function(){
                    draw();
                    options.onInit(_this);
                });
            });
        }
    };
};