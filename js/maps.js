var GeoMap = function(opts){
	var _this = this,
		map,
		balloons = [],
		pins = [],
		options = $.extend({
			id: 'map',
			clusterer: false,
			fullScreenTrigger: false,
			center: [55.76, 37.64],
			zoom: 10,
			layer: 'map',
			controls: false,
			onInit: function(){},
			onFullscreenEnter: function(){},
			onFullscreenExit: function(){}
		}, opts);

	this.getMap = function(){
		return map;
	};

	var $map = $('#' + options.id),
		fullScreenAnimationDuration = 20,   
		clusterer = null;

	if(options.fullScreenTrigger){
		$(options.fullScreenTrigger).off('click').on('click', function(e){
			e.preventDefault();
			_this.enterFullScreen();
		});
	}

	this.setLoading = function(){
		$map.parent().KVLoadingElement({
			invert: true,
			overlay: true,
			big: true,
			append: true,
			zIndex_overlay: 1000
		});

		$map.parent().find('loading-dots').addClass('loading-dots-invert');
	};

	this.unsetLoading = function(){
		$map.parent().KVLoadingElement('stop');
	};

	var draw = function(){
		map = new ymaps.Map(options.id, {
			center: options.center,
			zoom: options.zoom
		});

		if(options.controls === true){
			createDefaultControls();
		}

		if(options.clusterer === true){
			_this.createClusterer();
		}
	};

	var Balloon = function(opts){
		var options = $.extend({
			parent: null,
			center: [0,0],
			content: '',
            closeable: true,
			offsetX: 0,
			offsetY: 0,
			onReady: function(){},
			onClick: function(){}
		}, opts);

		var close = '',
			closeable = '',
			showed = false;

		this.isShowed = function(){
			return showed;
		};

		if(options.closeable){
			close = '<a class="close" title="Закрыть" href="#"><i></i></a>';
			closeable = 'closeable';
		}

		var _this = this,
			id = _.uniqueId('balloon'),
			$element = $(),
			permanent = false,
			balloon = new ymaps.Placemark(options.center, {
				iconContent: '<div class="map-balloon hidden disabled ' + closeable + '" id="' + id + '"><div class="inner"><span class="content-inner" style="white-space: nowrap">' + options.content + '</span>' + close + '</div></div>'
			}, {
				iconImageHref: '',
				iconImageSize: 0,
				iconImageOffset: 0
			});

		balloon.options.set('zIndex', -1);

		balloon.events.add('overlaychange', function(){
			$element = $('#' + id);

			$element.find('.close').on('click', function(e){
				e.preventDefault();
				_this.hide();
			});

            options.onReady();
		});

		balloon.events.add('click', function(){
            options.onClick();
		});

		map.geoObjects.add(balloon);

		var hideOnClick = function(){
			_this.hide();
		};

        this.setOption = function(name, val){
            options[name] = val;
        };

		this.getId = function(){
			return id;
		};

        this.setPosition = function(){
            $element.css({
                marginTop: -(($element.height()/2) - ((options.offsetY) ? options.offsetY : 0)),
                marginLeft: (options.offsetX) ? options.offsetX : 0,
                width: 250
            });
        };

		this.show = function(permanentShow){
			if(showed) return;

			$element.removeClass('hidden');

            this.setPosition();

			showed = true;

			setTimeout(function(){
				$element.css({
					width: $element.find('.content-inner').width() + 40
				});
			}, 100);

			map.events.add('click', hideOnClick);

			setTimeout(function(){
				$element.removeClass('disabled');
			}, 500);

			_.each(balloons, function(balloon){
				if(balloon.getId() != _this.getId()){
					balloon.hide();
				}
			});

			if(permanent !== true){
				permanent = permanentShow;
			}

			balloon.options.set('zIndex', 1000000);
			options.parent.options.set('zIndex', 1000000);
		};

		this.hide = function(){
			if(permanent !== true){
				if(!showed) return;
				showed = false;

				$element.addClass('disabled');

				setTimeout(function(){
					$element.addClass('hidden');
				}, 500);

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

		map.setCenter(options.center);
		map.setZoom(coords.zoom);
	};

	var createDefaultControls = function(){
		var zoom_template = '<div class="map-view-control">' +
			'<div id="map-zoom-in" data-big="x" class="map-view-control-button"><i class="icon-font icon-font-plus"></i></div>' +
			'<div id="map-zoom-out" class="map-view-control-button"><i class="icon-font icon-font-minus"></i></div>' +
			'</div>';

		var ZoomLayout = ymaps.templateLayoutFactory.createClass(
			zoom_template,
			{
				build: function () {
					ZoomLayout.superclass.build.call(this);

					$('#map-zoom-in').bind('click', ymaps.util.bind(this.zoomIn, this));
					$('#map-zoom-out').bind('click', ymaps.util.bind(this.zoomOut, this));
				},

				clear: function () {
					$('#map-zoom-in').unbind('click');
					$('#map-zoom-out').unbind('click');

					ZoomLayout.superclass.clear.call(this);
				},

				zoomIn: function () {
					this.events.fire('zoomchange', {
						oldZoom: map.getZoom(),
						newZoom: map.getZoom() + 1
					});
				},

				zoomOut: function () {
					this.events.fire('zoomchange', {
						oldZoom: map.getZoom(),
						newZoom: map.getZoom() - 1
					});
				}
			});

		var zoomControl = new ymaps.control.SmallZoomControl({
			layout: ZoomLayout
		});

		map.controls.add(zoomControl, {
			left: 0,
			top: 0
		});

		map.controls.add(zoomControl);

		function button(options){
			var opts = $.extend({
				top: 0,
				left: 0,
				right: 0,
				title: '',
				icon_class: '',
				onSelect: function(){

				},
				onDeselect: function(){

				}
			}, options);

			var template =  '<div id="map-type" title="$[data.title]" class="map-view-control-button [if state.selected]map-view-control-button-selected[endif]"><i class="icon-font $[data.icon_class]"></i></div>',
				Layout = ymaps.templateLayoutFactory.createClass(template),
				button = new ymaps.control.Button({
					data: {
						title: opts.title,
						icon_class: opts.icon_class
					}
				}, {
					layout: Layout,
					selectOnClick: true
				});

			button.events
				.add('select', function () {
					opts.onSelect();
				})
				.add('deselect', function () {
					opts.onDeselect();
				});

			var params = {};

			if(opts.left !== false){
				params.left = opts.left;
			}else{
				params.right = opts.right;
			}

			params.top = opts.top;
			map.controls.add(button, params);

			return button;
		}

		button({
			top: 80,
			left: 0,
			title: 'Режим спутника',
			icon_class: 'icon-font-map_sputnik',
			onSelect: function(){
				map.setType('yandex#satellite');
			},
			onDeselect: function(){
				map.setType('yandex#map');
			}
		});
	};

	this.fitCluster = function(){
		if(clusterer){
			map.setBounds(clusterer.getBounds(), {
				checkZoomRange: true
			});
		}
	};

	this.panCenter = function(){
		var center = [
			parseFloat(options.center[0]),
			parseFloat(options.center[1])
		];

		map.panTo(center, {
			delay: 0
		});
	};

	this.Pin = function(opts){
		var _this = this;

		var options = $.extend({
			center: [55.76, 37.64],
			content: '',
			title: '',
			avoidClusterer: false,
			zIndex: false,
            zoomRelatedIcon: false,
            zoomRelatedIconFactor: 12,
			type: 'basic',
			balloonCloseable: true,
			onReady: function(){},
			onClick: function(){},
			onBalloonReady: function(){},
			onBalloonClick: function(){}
		}, opts);

		var id = _.uniqueId('pin'),
			title = (options.title) ? '<span class="marker-title">' + options.title + '</span>' : '',
			$element = $();

		var getTypeData = function(typeName){
			var typeData;

            if(typeName == 'basic_small' && options.zoomRelatedIcon){
                if(map.getZoom() <= options.zoomRelatedIconFactor){
                    typeName = 'dot';
                }
            }

			switch(typeName){
				case 'basic_small' : {
					typeData = {
						className: 'maps-marker-basic_small',
						size: [19, 25],
						offset: [-10, -25],
						balloonOffsetY: -15,
						balloonOffsetX: 18
					};
				} break;

				case 'dot' : {
					typeData = {
						className: 'maps-marker-dot',
						size: [12, 12],
						offset: [-6, -6],
						balloonOffsetY: -1,
						balloonOffsetX: 12
					};
				} break;

				default:
				case 'basic' : {
					typeData = {
						className: 'maps-marker-basic',
						size: [31, 43],
						offset: [-21, -49],
						balloonOffsetY: -27,
						balloonOffsetX: 18
					};
				} break;
			}

			return typeData;
		};

		var typeData = getTypeData(options.type);

		var pin = new ymaps.Placemark(options.center, {
			iconContent: '<span class="maps-marker-icon ' + typeData.className + '" id="' + id + '">' + title + '</span>'
		}, {
			iconImageHref: '',
			iconImageSize: typeData.size,
			iconImageOffset: typeData.offset
		});

		if(options.zIndex) {
			pin.options.set('zIndex', options.zIndex);
		}

		var balloon = null,
			changeOverlay = null;

		pin.events.add('click', function(){
			options.onClick();

			map.panTo(options.center, {
				delay: 0
			});

			_this.showBalloon();
		});

		pin.events.add('overlaychange', function(){
			if(options.onReady) options.onReady();

			if($element.length == 0){
				$element = $('#' + id);
			}

			_this.hideBalloon();

			clearInterval(changeOverlay);

			changeOverlay = setTimeout(function(){
				_this.changeStyle(options.type);
			}, 1);
		});

		if(clusterer && options.avoidClusterer !== true){
			clusterer.add(pin);
		}else{
			map.geoObjects.add(pin);
		}

		this.changeStyle = function(styleName){
			var typeData = getTypeData(styleName);

			pin.options.set({
				iconImageHref: '',
				iconImageSize: typeData.size,
				iconImageOffset: typeData.offset
			});

			if(balloon){
				balloon.setOption('offsetX', typeData.balloonOffsetX);
				balloon.setOption('offsetY', typeData.balloonOffsetY);
				balloon.setPosition();
			}

			if(options.title){
				$element.find('.marker-title').css({
					bottom: -$title.outerHeight()
				});
			}

			setTimeout(function(){
				console.log(typeData)
				$element.attr('class', 'maps-marker-icon ' + typeData.className);
			}, 2100);

		};

		this.pointMap = function(){
			map.setCenter(options.center);
		};

		this.showBalloon = function(permanent){
			if(options.content){
				if(!balloon){
					balloon = new Balloon({
						parent: pin,
						center: options.center,
						content: options.content,
						closeable: options.balloonCloseable,
						offsetX: typeData.balloonOffsetX,
						offsetY: typeData.balloonOffsetY,
						onReady: function(){
							options.onBalloonReady();
							balloon.show();
						},
						onClick: options.onBalloonClick
					});
				}else{
					balloon.show();
				}
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
            balloonCloseable: true,
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

            balloon = new Balloon({
                parent: area,
                center: balloonCoords,
                content: options.content,
                closeable: options.balloonCloseable,
                onReady: options.onBalloonReady,
                onClick: options.onBalloonClick
            });
		}

		area.events.add('click', function(){
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
			$overlay = $('.map-fullscreen-overlay'),
			margin = 60;

		w = $overlay.width() - margin * 2;
		h = $overlay.height() - margin * 2;

		var interval = null;

		if(speed > 0){
			interval = setInterval(function(){
				map.container.fitToViewport();
			}, 1);
		}

		$map.parent().animate({
			width: w,
			height: h,
			top: margin,
			left: margin
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
			resizeFullscreen(fullScreenAnimationDuration);

			setTimeout(function(){
				$(window).off('resize.mapFullscreen').on('resize.mapFullscreen', function(){
					resizeFullscreen(0);
				});

				setTimeout(function(){
					$(window).trigger('resize');
				}, 50);
			}, fullScreenAnimationDuration);
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
		}, fullScreenAnimationDuration, function(){
			$map.parent().css({
				top: 0,
				left: 0
			});
			$map.parent().removeClass('map-fullscreen');
			$dummy.remove();

			clearInterval(interval);

			$('html,body').css('overflow', 'auto');
			map.container.fitToViewport();
		});

		map.container.fitToViewport();
	};

	this.createClusterer = function(){
		var IconsDefault = [
			{
				href: '/i/kvad_map_circ_small_red.png',
				size: [43, 43],
				offset: [-21.5, -21.5]
			},
			{
				href: '/i/kvad_map_circ_large_red.png',
				size: [60, 60],
				offset:  [-10, -25]
			}
		];

		var IconsMaxZoom = [{
				href: '/i/kvad_marker_list.png',
				size: [31, 43],
				offset: [-15.5, -21.5]
			},
			{
				href: '/i/kvad_marker_list.png',
				size: [31, 43],
				offset: [-15.5, -21.5]
			}];

		function isMaxZoomThere(){
			var max_zoom = map.zoomRange.getCurrent()[1],
				current_zoom = map.getZoom();

			return current_zoom >= max_zoom;
		}

		function getIcons(){
			if(isMaxZoomThere()){
				return IconsMaxZoom;
			}else{
				return IconsDefault;
			}
		}

		function getTemplate(size){
			var tmpl;

			if(isMaxZoomThere()){
				tmpl = '<div class="map-cluster"><div class="anchor" style="width: ' + size[0] + 'px; height: ' + size[1] + 'px"></div></div>';
			}else{
				tmpl = '<div class="map-cluster">$[properties.geoObjects.length]</div>';
			}

			return ymaps.templateLayoutFactory.createClass(tmpl);
		}

		clusterer = new ymaps.Clusterer({
			clusterIcons: getIcons(),
			clusterNumbers: [15],
			clusterIconContentLayout: getTemplate(),
			clusterDisableClickZoom: false,
			openBalloonOnClick: false,
			zoomMargin: 50,
			margin: 15
		});       

		map.geoObjects.add(clusterer);

		clusterer.createCluster = function(center, geoObjects){
			var cluster = ymaps.Clusterer.prototype.createCluster.call(this, center, geoObjects),
				icons = getIcons();

			cluster.options.set('icons', icons);
			cluster.options.set('iconContentLayout', getTemplate(icons[0].size));

			return cluster;
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