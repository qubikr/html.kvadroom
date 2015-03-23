var TestMap = {};

TestMap.Map = function(){
    this.init = function(){
        var data = $('.test-map').data();

        if(data && data.center) {
            var map = new GeoMap({
                id: 'test-map',
                fullScreenTrigger: '#fullscreen-trigger',
                zoom: 5,
                controls: true,
                center: data.center,
                onInit: function (instance) {
                    var marker = new map.Pin({
                        type: 'basic_small',
                        center: [55,25],
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

                    var marker01 = new map.Pin({
                        type: 'basic_small',
                        center: [55.4,22.2],
                        balloonCloseButton: true,
                        content: 'Text text text 2'
                    });

                    var marker02 = new map.Pin({
                        type: 'basic_small',
                        center: [55.42,22.23],
                        balloonCloseButton: true,
                        content: 'Text text text 2'
                    });



                    var marker1 = new map.Pin({
                        type: 'basic_small',
                        center: [56,21],
                        balloonCloseButton: true,
                        content: 'Text text text3'
                    });

                    var marker11 = new map.Pin({
                        type: 'basic_small',
                        center: [55.6,20.6],
                        balloonCloseButton: true,
                        content: 'Text text text3'
                    });
                    var marker12 = new map.Pin({
                        type: 'basic_small',
                        center: [55.65,20.64],
                        balloonCloseButton: true,
                        content: 'Text text text3'
                    });

                    var marker2 = new map.Pin({
                        type: 'basic_small',
                        center: [52,24],
                        balloonCloseButton: true,
                        content: 'Text text text'
                    });

                    var marker21 = new map.Pin({
                        type: 'basic_small',
                        center: [52.1,24.1],
                        balloonCloseButton: true,
                        content: 'Text text text'
                    });
                    var marker21 = new map.Pin({
                        type: 'basic_small',
                        center: [52.14,24.16],
                        balloonCloseButton: true,
                        content: 'Text text text'
                    });

                    var marker3 = new map.Pin({
                        type: 'basic_small',
                        center: [54,22],
                        balloonCloseButton: true,
                        content: 'Text text text'
                    });

                    var marker31 = new map.Pin({
                        type: 'basic_small',
                        center: [54.9,22.5],
                        balloonCloseButton: true,
                        content: 'Text text text'
                    });

                    var marker32 = new map.Pin({
                        type: 'basic_small',
                        center: [54.319,22.58],
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