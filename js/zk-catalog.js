var ZKCatalog = {};

ZKCatalog.Search = function(){
	this.init = function(){
		var cache = {};

		var ractive = new Ractive({
			el: '#search-result',
			template: '<ul class="search-selector {{#if items.length > 0}}active{{/if}}">{{#items}}<li on-click="goUrl">{{{hl(name, query)}}}</li>{{/items}}</ul>',
			data: {
				hl: function(content, what) {
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
				},
				query: '',
				items: []
			}
		});

		ractive.on( 'goUrl', function ( event ) {
			document.location.href = event.context.url;
		});

		function draw(query, data){
			ractive.set('items', data);
			ractive.set('query', query);
		}

		var clickOutside = new UIClickOutside($('#search-result'), function(){
            ractive.set('items', []);
			ractive.set('query', '');
        });

        clickOutside.bind();

        $(document).on('keydown.searchResultNavigate', function(e){
        	var $li = $('#search-result .search-selector li'),
        		$ac = $li.filter('.active');

        	if($ac.length > 0){
        		switch(e.keyCode){
	        		case 40 : {
	        			if($ac.next().length > 0){
		        			$ac.next().addClass('active');
		        			$ac.removeClass('active');
		        		}
	        		} break;

	        		case 38 : {
						if($ac.prev().length > 0){
		        			$ac.prev().addClass('active');
		        			$ac.removeClass('active');
		        		}
	        		} break;

	        		case 13 : {
	        			$ac.click();
	        		} break;
	        	}
        	}else{
        		$li.filter(':first').addClass('active');
        	}
        });

		function filterStr(str){
            str = $.trim(str);
            str = str.replace(/[\.,\/#!$%\^&\*;:"'(){}=_`~()]/g, '');
            str.replace(/\s{2,}/g, ' ');

            return str;
		}

		function search(query){
			if(query && query.length > 1){
				ZKCatalog.data.getObjects(function(data){
					if(data.success){
						var items = data.objects;

						var ni = _.filter(items, function(item){
                            if(item.name && item.name.length > 2) {
                                var name = item.name.toLowerCase(),
                                	word = query.toLowerCase();

                                word = filterStr(word);
                                name = filterStr(name);

                                if (name.search(word) > 0 && name && name.length > 2) {
                                    return item;
                                }
                            }
						});

						draw(query, ni);
					}else{
						draw(query, {});
					}
				});
			}else{
				draw(query, {});
			} 
		}

		$('.search-string-zk input.entry').on('keyup', function(e){
			if(e.keyCode == 27){
				search('');
			}else{
				search($(this).val());
			}
		});

		return this;
	};
};

ZKCatalog.Data = function(region_id, type_id){
	var objects = null,
		object = null;

	this.getCurrentObject = function(done){
		if(object) return done(object);

		$.ajax({
			url: 'json/zk.json?r_id=' + region_id,
			data: {},
			dataType: 'json',
			success: function(data){
				object = data;
				done(data);
			}
		});
	};

	this.getObjects = function(done){
		if(objects) return done(objects);

		$.ajax({
			url: 'json/zk_objects.json?r_id=' + region_id + '&type_id=' + type_id,
			data: {},
			dataType: 'json',
			success: function(data){
				objects = data;
				done(data);
			}
		});
	};
};

ZKCatalog.Map = function(){
    $('.zk-catalog-block').KVLoadingElement({
        overlay: true,
        invert: true
    });

	this.init = function(){
		var data = $('.map-zk-catalog').data();

		if(data && data.center) {
			var map = new GeoMap({
				id: 'map-zk-catalog',
				fullScreenTrigger: '#fullscreen-trigger',
				zoom: 5,
				clusterer: true,
				controls: true,
				center: data.center,
				onInit: function (instance) {
					ZKCatalog.data.getCurrentObject(function(data){
						if(data.success){
							var marker = new map.Pin({
								type: 'basic',
								avoidClusterer: true,
								center: [
									parseFloat(data.data.lat),
									parseFloat(data.data.lon)
								],
								content: '<a href="' + data.data.url + '">' + data.data.name + '</a>'
							});
						}
					});

					ZKCatalog.data.getObjects(function(data){
						if(data.success){
							_.each(data.objects, function(item){
								new map.Pin({
									type: 'basic_small',
									center: [
										parseFloat(item.lat),
										parseFloat(item.lon)
									],
                                    zoomRelatedIcon: true,
                                    zoomRelatedIconFactor: 12,
									content: '<a href="' + item.url + '">' + item.name + '</a>'
								});
							});
						}

						instance.fitCluster();

                        $('.zk-catalog-block').KVLoadingElement('stop');
					});
				}
			});

			map.init();
		}

		return this;
	};
};

ZKCatalog.init = function(){
	var $o = $('.map-zk-catalog');

	this.data = new this.Data($o.data('region_id'), $o.data('type_id'));
	this.map = new this.Map().init();
	this.search = new this.Search().init();
};

$(function(){
	ZKCatalog.init();
});