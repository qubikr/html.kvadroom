var TestMap = {};

TestMap.Map = function(){
    this.init = function(){
        var data = $('.test-map').data();

        if(data && data.center) {
            var map = new GeoMap({
                id: 'test-map',
                fullScreenTrigger: '#fullscreen-trigger',
                zoom: 4,
                controls: true,
                center: data.center,
                onInit: function (instance) {
                    var marker = new map.Pin({
                        type: 'basic_small',
                        center: [55,25],
                        balloonCloseButton: true,
                        content: 'Text text text',
                        onBalloonReady: function(){
                        	marker.showBalloon();
                        }
                    });

                    var marker0 = new map.Pin({
                        type: 'basic',
                        center: [55,22],
                        balloonCloseButton: true,
                        content: 'Text text text 2'
                    });

                    var marker1 = new map.Pin({
                        type: 'basic_small',
                        center: [56,21],
                        balloonCloseButton: true,
                        content: 'Text text text3'
                    });

                    var marker2 = new map.Pin({
                        type: 'basic',
                        center: [52,24],
                        balloonCloseButton: true,
                        content: 'Text text text'
                    });

                    var marker3 = new map.Pin({
                        type: 'basic_small',
                        center: [54,22],
                        balloonCloseButton: true,
                        content: 'Text text text'
                    });
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