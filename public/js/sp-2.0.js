var SP = function () {
	var _this= this;

    var data = $('.map-fantastic').data();

    if (data && data.center) {
        var map = new GeoMap({
            id: 'complex-map',
            fullScreenTrigger: '#fullscreen-trigger-fantastic',
            zoom: data.zoom,
            center: data.center,
            onFullscreenEnter: function(){
                if (data.area) {
                    _this.area.showBalloon(true);
                }else{
                    _this.pin.showBalloon(true);
                }
            },
            onInit: function (instance) {
                if (data.area) {
                    _this.area = new map.Area({
                        coords: data.area,
                        content: (data.title) ? data.title : '',
                        balloonCloseable: false,
                        onBalloonReady: function () {
                            // _this.area.showBalloon(true);
                        },
                        onClick: function () {
                            instance.panCenter();
                        },
                        onBalloonClick: function () {
                            if (data.url) {
                                window.open(data.url, '_blank');
                            }
                        }
                    });

                    _this.area.fitMap();
                } else {
                    _this.pin = new map.Pin({
                        center: data.center,
                        content: (data.title) ? data.title : '',
                        balloonCloseable: false,
                        onBalloonReady: function () {
                            // _this.pin.showBalloon(true);
                        },
                        onClick: function () {
                            instance.panCenter();
                        },
                        onBalloonClick: function () {
                            if (data.url) {
                                window.open(data.url, '_blank');
                            }
                        }
                    });

                    _this.pin.pointMap();
                }
            }
        });

        map.init();
    }

    return this;
};

$(function(){
	new SP();

    $('.meta-link').KVMetaLink({
	    new_window: true
	});
});