var GeoMap = function(opts){
	var _this = this,
		map,
		options = $.extend({
			id: 'map',
			center: [55.76, 37.64],
			zoom: 10,
			layer: 'map',
			onInit: function(){}
		}, opts);

	var draw = function(){
		map = new ymaps.Map(options.id, {
	        center: options.center,
	        zoom: options.zoom
	    });
	};

	var Balloon = function(center, content, onReady){
		var _this = this,
			id = _.uniqueId('balloon'),
			$element = $(),
			permanent = false,
			marker = new ymaps.Placemark(center, {
		        iconContent: '<div class="map-balloon disabled" id="' + id + '"><div class="inner">' + content + '</div></div>'
		    }, {
		        iconImageHref: '',
		        iconImageSize: 20,
		        iconImageOffset: 10,
		        zIndex: 2
		    });

	    marker.events.add('overlaychange', function(){
	    	$element = $('#' + id);

			$element.css({
		    	marginTop: -$element.height()/2
		    });

		    if(onReady) onReady();
	    });

	    map.geoObjects.add(marker);

	    var hideOnClick = function(){
    		_this.hide();
	    };

	    this.show = function(permanentShow){
	    	$element.removeClass('disabled');
	    	map.events.add('click', hideOnClick);

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
	};

	this.Area = function(opts){
		var options = $.extend({
				coords: [[
					[55.75, 37.80],
	                [55.80, 37.90],
	                [55.75, 38.00],
	                [55.70, 38.00],
	                [55.70, 37.80]
	            ]],
				content: '', 
				onReady: function(){}, 
				onBalloonReady: function(){}
			}, opts);

		var	area = new ymaps.GeoObject({
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
			center = [
				bounds[0][0] + ((bounds[1][0] - bounds[0][0]) / 2),
				bounds[0][1] + ((bounds[1][1] - bounds[0][1]) / 2)
			],
			balloonCoords = [center[0], bounds[1][1]],
			balloon = new Balloon(balloonCoords, options.content, options.onBalloonReady)
		
		area.events.add('click', function(){
			map.panTo(center, {
				delay: 0
			});

			balloon.show();
		});

		area.events.add('overlaychange', function(){
			if(options.onReady) options.onReady();
		});

		this.pointMap = function(){
			map.setCenter(center);
		};

		this.showBalloon = function(permanent){
			balloon.show(permanent);
		};

		this.hideBalloon = function(){
			balloon.hide();
		};
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