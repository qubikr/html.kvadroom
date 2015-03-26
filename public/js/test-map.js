var TestMap = {};

TestMap.Map = function(){
    this.init = function(){
        var data = $('.test-map').data();

        if(data && data.center) {
            var map = new GeoMap({
                id: 'test-map',
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

TestMap.init = function(){
    this.map = new this.Map().init();
};

$(function(){
    TestMap.init();
});