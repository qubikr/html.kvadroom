var Complex={};Complex.Map=function(){this.init=function(){var n=$(".map-landing").data();if(n&&n.center){var o=new GeoMap({id:"complex-map",fullScreenTrigger:"#fullscreen-trigger",zoom:n.zoom,center:n.center,onInit:function(e){if(n.area){var l=new o.Area({coords:n.area,content:n.title?n.title:"",balloonCloseable:!1,onBalloonReady:function(){l.showBalloon(!0)},onBalloonClick:function(){n.url&&window.open(n.url,"_blank")}});l.pointMap()}else{var i=new o.Pin({center:n.center,content:n.title?n.title:"",balloonCloseable:!1,onBalloonReady:function(){i.showBalloon(!0)},onBalloonClick:function(){n.url&&window.open(n.url,"_blank")}});i.pointMap()}}});o.init()}return this}},Complex.init=function(){this.map=(new this.Map).init()},$(function(){Complex.init()});