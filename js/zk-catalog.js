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
			window.open(event.context.url, '_blank');
		});

		function draw(query, data){
			ractive.set('items', data);
			ractive.set('query', query);
		}

		function search(query){
			if(query && query.length > 2){
				ZKCatalog.data.getObjects(function(data){
					if(data.success){
						var items = data.objects;

						var ni = _.filter(items, function(item){ 
							var name = item.name.toLowerCase();
							var word = query.toLowerCase();

							console.log(name.search(word))

							if(name.search(word) > 0){
								return item;
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

ZKCatalog.Data = function(){
	var objects = null,
		object = null;

	this.getCurrentObject = function(done){
		if(object) return done(object);

		$.ajax({
			url: 'json/zk.json',
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
			url: 'json/zk_objects.json',
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
								balloonCloseButton: true,
								content: '<a href="' + data.data.url + '">' + data.data.name + '</a>'
							});
						}
					});

					ZKCatalog.data.getObjects(function(data){
						console.log(data)

						if(data.success){
							_.each(data.objects, function(item){
								new map.Pin({
									type: 'basic_small',
									center: [
										parseFloat(item.lat),
										parseFloat(item.lon)
									],
									balloonCloseButton: true,
									content: '<a href="' + item.url + '">' + item.name + '</a>'
								});
							});
						}

						instance.fitCluster();
					});
				}
			});

			map.init();
		}

		return this;
	};
};

ZKCatalog.init = function(){
	this.data = new this.Data();
	this.map = new this.Map().init();
	this.search = new this.Search().init();
};

$(function(){
	ZKCatalog.init();
});