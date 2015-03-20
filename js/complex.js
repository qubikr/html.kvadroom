var Complex = {};

Complex.Map = function(){
    this.init = function(){
        var data = $('.map-landing').data();

        if(data && data.center) {
            var map = new GeoMap({
                id: 'complex-map',
                fullScreenTrigger: '#fullscreen-trigger',
                zoom: data.zoom,
                center: data.center,
                onInit: function (instance) {
                    if(data.area){
                        var area = new map.Area({
                            coords: data.area,
                            content: (data.title) ? data.title : '',
                            onBalloonReady: function () {
                                area.showBalloon(true);
                            },
                            onBalloonClick: function(){
                                if(data.url){
                                    window.open(data.url, '_blank');
                                }
                            }
                        });

                        area.pointMap();
                    }else{
                        var pin = new map.Pin({
                            center: data.center,
                            content: (data.title) ? data.title : '',
                            onBalloonReady: function () {
                                pin.showBalloon(true);
                            },
                            onBalloonClick: function(){
                                if(data.url){
                                    window.open(data.url, '_blank');
                                }
                            }
                        });

                        pin.pointMap();
                    }
                }
            });

            map.init();
        }

        return this;
    };
};

Complex.init = function(){
    this.map = new this.Map().init();
};

$(function(){
    Complex.init();
});