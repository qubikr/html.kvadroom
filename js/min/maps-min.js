var GeoMap=function(e){var n=this,t,o=[],i=$.extend({id:"map",fullScreenTrigger:!1,center:[55.76,37.64],zoom:10,layer:"map",onInit:function(){},onFullscreenEnter:function(){},onFullscreenExit:function(){}},e),a=$("#"+i.id);i.fullScreenTrigger&&$(i.fullScreenTrigger).off("click").on("click",function(e){e.preventDefault(),n.enterFullScreen()});var c=function(){t=new ymaps.Map(i.id,{center:i.center,zoom:i.zoom})},l=function(e,n,i,a,c,l){var r=this,s=_.uniqueId("balloon"),f=$(),d=!1,u=new ymaps.Placemark(e,{iconContent:'<div class="map-balloon disabled" id="'+s+'"><div class="inner">'+n+"</div></div>"},{iconImageHref:"",iconImageSize:20,iconImageOffset:10,zIndex:2});u.events.add("overlaychange",function(){f=$("#"+s),f.css({marginTop:-(f.height()/2-(c?c:0)),marginLeft:l?l:0}),i&&i()}),u.events.add("click",function(){a&&a()}),t.geoObjects.add(u);var p=function(){r.hide()};this.getId=function(){return s},this.show=function(e){f.removeClass("disabled"),t.events.add("click",p),_.each(o,function(e){e.getId()!=r.getId()&&e.hide()}),d!==!0&&(d=e)},this.hide=function(){d!==!0&&(f.addClass("disabled"),t.events.remove("click",p))},o.push(this)},r=function(e){var n=ymaps.util.bounds.getCenterAndZoom(e,[a.width(),a.height()]);t.setCenter(n.center),t.setZoom(n.zoom)};this.Pin=function(e){var n=$.extend({center:[55.76,37.64],content:"",title:"",onReady:function(){},onClick:function(){},onBalloonReady:function(){},onBalloonClick:function(){}},e),o=_.uniqueId("pin"),i=n.title?'<span class="marker-title">'+n.title+"</span>":"",a=$(),c=new ymaps.Placemark(n.center,{iconContent:'<span class="maps-marker-icon maps-marker-basic" id="'+o+'">'+i+"</span>"},{iconImageHref:"",iconImageSize:[31,43],iconImageOffset:[-21,-49]});t.geoObjects.add(c);var r=null;n.content&&(r=new l(n.center,n.content,n.onBalloonReady,n.onBalloonClick,-25,18)),c.events.add("click",function(){t.panTo(n.center,{delay:0}),n.onClick(),r&&r.show()}),c.events.add("overlaychange",function(){n.onReady&&n.onReady(),a=$("#"+o);var e=a.find(".marker-title");e.css({bottom:-e.outerHeight()})}),this.pointMap=function(){t.setCenter(n.center)},this.showBalloon=function(e){r&&r.show(e)},this.hideBalloon=function(){r&&r.hide()}},this.Area=function(e){var n=$.extend({coords:[],content:"",onReady:function(){},onClick:function(){},onBalloonReady:function(){},onBalloonClick:function(){}},e),o=new ymaps.GeoObject({geometry:{type:"Polygon",coordinates:n.coords,fillRule:"nonZero"}},{fillColor:"rgba(255, 0, 0, 0.1)",strokeColor:"rgba(255, 0, 0, 1)",opacity:1,strokeWidth:2});t.geoObjects.add(o);var i=o.geometry.getBounds(),a=null,c=[i[0][0]+(i[1][0]-i[0][0])/2,i[0][1]+(i[1][1]-i[0][1])/2];if(n.content){var s=[c[0],i[1][1]];a=new l(s,n.content,n.onBalloonReady,n.onBalloonClick)}o.events.add("click",function(){t.panTo(c,{delay:0}),n.onClick(),a&&a.show()}),o.events.add("overlaychange",function(){n.onReady&&n.onReady()}),this.pointMap=function(){t.setCenter(c)},this.fitMap=function(){r(i)},this.showBalloon=function(e){a&&a.show(e)},this.hideBalloon=function(){a&&a.hide()}};var s=function(e){var n=0,o=0,i=$(".map-fullscreen-overlay");n=i.width()-200,o=i.height()-200;var c=null;e>0&&(c=setInterval(function(){t.container.fitToViewport()},1)),a.parent().animate({width:n,height:o,top:100,left:100},e,function(){clearInterval(c),t&&t.container&&t.container.fitToViewport()})},f=function(e){var n={};a.parent().data("originalSize")?n=a.parent().data("originalSize"):(n={h:a.parent().height()},a.parent().data("originalSize",n)),a.parent().addClass("map-fullscreen");var o=$("<div/>");o.addClass("map-fs-dummy").css({height:n.h}),a.parent().after(o),a.parent().css({width:o.width(),height:o.height(),top:o.offset().top-$(document).scrollTop(),left:o.offset().left}),t&&t.container&&t.container.fitToViewport(),e&&e()};this.enterFullScreen=function(){$("body").append('<div class="map-fullscreen-overlay"><a class="map-fullscreen-close kiv-e" href="#"><i class="icon-font icon-font-cross"></i></a></div>'),$("html,body").css("overflow","hidden"),setTimeout(function(){$(".map-fullscreen-overlay").addClass("ready")},50),$(document).off("keyup.map-fullscreen").on("keyup.map-fullscreen",function(e){27==e.keyCode&&n.exitFullScreen()}),$(".map-fullscreen-close").off("click").on("click",function(e){e.preventDefault(),n.exitFullScreen()}),i.fullScreenTrigger&&$(i.fullScreenTrigger).hide(),f(function(){s(400),setTimeout(function(){$(window).off("resize.mapFullscreen").on("resize.mapFullscreen",function(){s(0)}),setTimeout(function(){$(window).trigger("resize")},50)},400)})},this.exitFullScreen=function(){$(window).off("resize.mapFullscreen"),i.fullScreenTrigger&&$(i.fullScreenTrigger).show();var e=$(".map-fs-dummy"),n=setInterval(function(){t.container.fitToViewport()},1);$(".map-fullscreen-overlay").removeClass("ready"),setTimeout(function(){$(".map-fullscreen-overlay").remove()},400),a.parent().animate({width:e.width(),height:e.height(),top:e.offset().top-$(document).scrollTop(),left:e.offset().left},400,function(){a.parent().removeClass("map-fullscreen"),clearInterval(n),e.remove(),$("html,body").css("overflow","auto"),t.container.fitToViewport()}),t.container.fitToViewport()},this.init=function(){"undefined"!=typeof ymaps?(c(),i.onInit(n)):$.getScript("http://api-maps.yandex.ru/2.0-stable/?load=package.full&lang=ru-RU",function(){ymaps.ready(function(){c(),i.onInit(n)})})}};