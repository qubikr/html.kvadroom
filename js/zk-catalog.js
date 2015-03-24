var ZKCatalog = {};

ZKCatalog.Search = function(){
    this.init = function(){
        var cache = {};

        var ractive = new Ractive({
            el: '#search-result',
            template: '<ul class="search-selector {{#if items.length > 0}}active{{/if}}">{{#items}}<li on-click="goUrl">{{{hl(title, query)}}}</li>{{/items}}</ul>',
            data: {
                hl: function(content, what) {
                      console.log(content, what)

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
            var url = '/json/search_text.json?q=' + query;

            if(query && query.length > 2){
                if(cache[url]){
                    draw(cache[url]);
                }else{
                    $.ajax({
                        url: url,
                        dataType: 'json',
                        success: function(data){
                            draw(query, data);
                        }
                    });
                } 
            } else {
                draw(query, {});
            } 
        }

        $('.search-string-zk input.entry').on('keyup', function(){
            search($(this).val());
        });

        return this;
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
                    var marker = new map.Pin({
                        type: 'basic',
                        avoidClusterer: true,
                        center: [54,37],
                        balloonCloseButton: true,
                        content: 'Text text text 2'
                    });

                    var i = 0;

                    while(i < 100){
                        i++;

                        new map.Pin({
                            type: 'basic_small',
                            center: [
                                _.random(540.2, 560.6) / 10,
                                _.random(360.2, 370.3) / 10 
                            ],
                            balloonCloseButton: true,
                            content: 'Text text text'
                        });
                    }
                }
            });

            map.init();
        }

        return this;
    };
};

ZKCatalog.init = function(){
    this.map = new this.Map().init();
    this.search = new this.Search().init();
};

$(function(){
    ZKCatalog.init();
});