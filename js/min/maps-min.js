var GeoMap=function(n){var e=this,o,a=$.extend({id:"map",center:[55.76,37.64],zoom:10,layer:"map",onInit:function(){}},n),t=function(){o=new ymaps.Map(a.id,{center:a.center,zoom:a.zoom})},i=function(n,e,a){var t=this,i=_.uniqueId("balloon"),c=$(),s=!1,d=new ymaps.Placemark(n,{iconContent:'<div class="map-balloon disabled" id="'+i+'"><div class="inner">'+e+"</div></div>"},{iconImageHref:"",iconImageSize:20,iconImageOffset:10,zIndex:2});d.events.add("overlaychange",function(){c=$("#"+i),c.css({marginTop:-c.height()/2}),a&&a()}),o.geoObjects.add(d);var l=function(){t.hide()};this.show=function(n){c.removeClass("disabled"),o.events.add("click",l),s!==!0&&(s=n)},this.hide=function(){s!==!0&&(c.addClass("disabled"),o.events.remove("click",l))}};this.Pin=function(n){var e=$.extend({center:[55.76,37.64],content:"",onReady:function(){},onBalloonReady:function(){}},n),a=new ymaps.Placemark(e.center,{iconContent:'<span class="maps-marker-icon maps-marker-basic"></span>'},{iconImageHref:"",iconImageSize:[31,43],iconImageOffset:[-21,-49]});o.geoObjects.add(a);var t=new i(e.center,e.content,e.onBalloonReady);a.events.add("click",function(){o.panTo(e.center,{delay:0}),t.show()}),a.events.add("overlaychange",function(){e.onReady&&e.onReady()}),this.pointMap=function(){o.setCenter(e.center)},this.showBalloon=function(n){t.show(n)},this.hideBalloon=function(){t.hide()}},this.Area=function(n){var e=$.extend({coords:[[[55.75,37.8],[55.8,37.9],[55.75,38],[55.7,38],[55.7,37.8]]],content:"",onReady:function(){},onBalloonReady:function(){}},n),a=new ymaps.GeoObject({geometry:{type:"Polygon",coordinates:e.coords,fillRule:"nonZero"}},{fillColor:"rgba(255, 0, 0, 0.1)",strokeColor:"rgba(255, 0, 0, 1)",opacity:1,strokeWidth:2});o.geoObjects.add(a);var t=a.geometry.getBounds(),c=[t[0][0]+(t[1][0]-t[0][0])/2,t[0][1]+(t[1][1]-t[0][1])/2],s=[c[0],t[1][1]],d=new i(s,e.content,e.onBalloonReady);a.events.add("click",function(){o.panTo(c,{delay:0}),d.show()}),a.events.add("overlaychange",function(){e.onReady&&e.onReady()}),this.pointMap=function(){o.setCenter(c)},this.showBalloon=function(n){d.show(n)},this.hideBalloon=function(){d.hide()}},this.init=function(){"undefined"!=typeof ymaps?(t(),a.onInit(e)):$.getScript("http://api-maps.yandex.ru/2.0-stable/?load=package.full&lang=ru-RU",function(){ymaps.ready(function(){t(),a.onInit(e)})})}};