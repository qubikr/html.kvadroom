var GeoMap=function(e){var t=this,n,o=[],i=[],a=$.extend({id:"map",clusterer:!1,fullScreenTrigger:!1,center:[55.76,37.64],zoom:10,layer:"map",controls:!1,onInit:function(){},onFullscreenEnter:function(){},onFullscreenExit:function(){}},e);this.getMap=function(){return n};var s=$("#"+a.id),l=20,c=null;a.fullScreenTrigger&&$(a.fullScreenTrigger).off("click").on("click",function(e){e.preventDefault(),t.enterFullScreen()}),this.setLoading=function(){s.parent().KVLoadingElement({invert:!0,overlay:!0,big:!0,append:!0,zIndex_overlay:1e3}),s.parent().find("loading-dots").addClass("loading-dots-invert")},this.unsetLoading=function(){s.parent().KVLoadingElement("stop")};var r=function(){n=new ymaps.Map(a.id,{center:a.center,zoom:a.zoom}),a.controls===!0&&u(),a.clusterer===!0&&t.createClusterer()},f=function(e){var t=$.extend({parent:null,center:[0,0],content:"",closeable:!0,offsetX:0,offsetY:0,onReady:function(){},onClick:function(){}},e),i="",a="",s=!1;this.isShowed=function(){return s},t.closeable&&(i='<a class="close" title="Закрыть" href="#"><i></i></a>',a="closeable");var l=this,c=_.uniqueId("balloon"),r=$(),f=!1,d=new ymaps.Placemark(t.center,{iconContent:'<div class="map-balloon hidden disabled '+a+'" id="'+c+'"><div class="inner"><span class="content-inner" style="white-space: nowrap">'+t.content+"</span>"+i+"</div></div>"},{iconImageHref:"",iconImageSize:0,iconImageOffset:0});d.options.set("zIndex",-1),d.events.add("overlaychange",function(){r=$("#"+c),r.find(".close").on("click",function(e){e.preventDefault(),l.hide()}),t.onReady()}),d.events.add("click",function(){t.onClick()}),n.geoObjects.add(d);var u=function(){l.hide()};this.setOption=function(e,n){t[e]=n},this.getId=function(){return c},this.setPosition=function(){r.css({marginTop:-(r.height()/2-(t.offsetY?t.offsetY:0)),marginLeft:t.offsetX?t.offsetX:0,width:250})},this.show=function(e){s||(r.removeClass("hidden"),this.setPosition(),s=!0,setTimeout(function(){r.css({width:r.find(".content-inner").width()+40})},100),n.events.add("click",u),setTimeout(function(){r.removeClass("disabled")},500),_.each(o,function(e){e.getId()!=l.getId()&&e.hide()}),f!==!0&&(f=e),d.options.set("zIndex",1e6),t.parent.options.set("zIndex",1e6))},this.hide=function(){if(f!==!0){if(!s)return;s=!1,r.addClass("disabled"),setTimeout(function(){r.addClass("hidden")},500),n.events.remove("click",u)}},o.push(this)},d=function(e){var t=ymaps.util.bounds.getCenterAndZoom(e,[s.width(),s.height()]);n.setCenter(a.center),n.setZoom(t.zoom)},u=function(){function e(e){var t=$.extend({top:0,left:0,right:0,title:"",icon_class:"",onSelect:function(){},onDeselect:function(){}},e),o='<div id="map-type" title="$[data.title]" class="map-view-control-button [if state.selected]map-view-control-button-selected[endif]"><i class="icon-font $[data.icon_class]"></i></div>',i=ymaps.templateLayoutFactory.createClass(o),a=new ymaps.control.Button({data:{title:t.title,icon_class:t.icon_class}},{layout:i,selectOnClick:!0});a.events.add("select",function(){t.onSelect()}).add("deselect",function(){t.onDeselect()});var s={};return t.left!==!1?s.left=t.left:s.right=t.right,s.top=t.top,n.controls.add(a,s),a}var t='<div class="map-view-control"><div id="map-zoom-in" data-big="x" class="map-view-control-button"><i class="icon-font icon-font-plus"></i></div><div id="map-zoom-out" class="map-view-control-button"><i class="icon-font icon-font-minus"></i></div></div>',o=ymaps.templateLayoutFactory.createClass(t,{build:function(){o.superclass.build.call(this),$("#map-zoom-in").bind("click",ymaps.util.bind(this.zoomIn,this)),$("#map-zoom-out").bind("click",ymaps.util.bind(this.zoomOut,this))},clear:function(){$("#map-zoom-in").unbind("click"),$("#map-zoom-out").unbind("click"),o.superclass.clear.call(this)},zoomIn:function(){this.events.fire("zoomchange",{oldZoom:n.getZoom(),newZoom:n.getZoom()+1})},zoomOut:function(){this.events.fire("zoomchange",{oldZoom:n.getZoom(),newZoom:n.getZoom()-1})}}),i=new ymaps.control.SmallZoomControl({layout:o});n.controls.add(i,{left:0,top:0}),n.controls.add(i),e({top:80,left:0,title:"Режим спутника",icon_class:"icon-font-map_sputnik",onSelect:function(){n.setType("yandex#satellite")},onDeselect:function(){n.setType("yandex#map")}})};this.fitCluster=function(){c&&n.setBounds(c.getBounds(),{checkZoomRange:!0})},this.panCenter=function(){var e=[parseFloat(a.center[0]),parseFloat(a.center[1])];n.panTo(e,{delay:0})},this.Pin=function(e){var t=this,o=$.extend({center:[55.76,37.64],content:"",title:"",avoidClusterer:!1,zIndex:!1,zoomRelatedIcon:!1,zoomRelatedIconFactor:12,type:"basic",balloonCloseable:!0,onReady:function(){},onClick:function(){},onBalloonReady:function(){},onBalloonClick:function(){}},e),i=_.uniqueId("pin"),a=o.title?'<span class="marker-title">'+o.title+"</span>":"",s=$(),l=function(e){var t;switch("basic_small"==e&&o.zoomRelatedIcon&&n.getZoom()<=o.zoomRelatedIconFactor&&(e="dot"),e){case"basic_small":t={className:"maps-marker-basic_small",size:[19,25],offset:[-10,-25],balloonOffsetY:-15,balloonOffsetX:18};break;case"dot":t={className:"maps-marker-dot",size:[12,12],offset:[-6,-6],balloonOffsetY:-1,balloonOffsetX:12};break;default:case"basic":t={className:"maps-marker-basic",size:[31,43],offset:[-21,-49],balloonOffsetY:-27,balloonOffsetX:18}}return t},r=l(o.type),d=new ymaps.Placemark(o.center,{iconContent:'<span class="maps-marker-icon '+r.className+'" id="'+i+'">'+a+"</span>"},{iconImageHref:"",iconImageSize:r.size,iconImageOffset:r.offset});o.zIndex&&d.options.set("zIndex",o.zIndex);var u=null,p=null;d.events.add("click",function(){o.onClick(),n.panTo(o.center,{delay:0}),t.showBalloon()}),d.events.add("overlaychange",function(){o.onReady&&o.onReady(),0==s.length&&(s=$("#"+i)),t.hideBalloon(),clearInterval(p),p=setTimeout(function(){t.changeStyle(o.type)},1)}),c&&o.avoidClusterer!==!0?c.add(d):n.geoObjects.add(d),this.changeStyle=function(e){var t=l(e);d.options.set({iconImageHref:"",iconImageSize:t.size,iconImageOffset:t.offset}),u&&(u.setOption("offsetX",t.balloonOffsetX),u.setOption("offsetY",t.balloonOffsetY),u.setPosition()),o.title&&s.find(".marker-title").css({bottom:-$title.outerHeight()}),setTimeout(function(){console.log(t),s.attr("class","maps-marker-icon "+t.className)},2100)},this.pointMap=function(){n.setCenter(o.center)},this.showBalloon=function(e){o.content&&(u?u.show():u=new f({parent:d,center:o.center,content:o.content,closeable:o.balloonCloseable,offsetX:r.balloonOffsetX,offsetY:r.balloonOffsetY,onReady:function(){o.onBalloonReady(),u.show()},onClick:o.onBalloonClick}))},this.hideBalloon=function(){u&&u.hide()}},this.Area=function(e){var t=$.extend({coords:[],content:"",balloonCloseable:!0,onReady:function(){},onClick:function(){},onBalloonReady:function(){},onBalloonClick:function(){}},e),o=new ymaps.GeoObject({geometry:{type:"Polygon",coordinates:t.coords,fillRule:"nonZero"}},{fillColor:"rgba(255, 0, 0, 0.1)",strokeColor:"rgba(255, 0, 0, 1)",opacity:1,strokeWidth:2});n.geoObjects.add(o);var i=o.geometry.getBounds(),a=null,s=[i[0][0]+(i[1][0]-i[0][0])/2,i[0][1]+(i[1][1]-i[0][1])/2];if(t.content){var l=[s[0],i[1][1]];a=new f({parent:o,center:l,content:t.content,closeable:t.balloonCloseable,onReady:t.onBalloonReady,onClick:t.onBalloonClick})}o.events.add("click",function(){t.onClick(),a&&a.show()}),o.events.add("overlaychange",function(){t.onReady&&t.onReady()}),this.pointMap=function(){n.setCenter(s)},this.fitMap=function(){d(i)},this.showBalloon=function(e){a&&a.show(e)},this.hideBalloon=function(){a&&a.hide()}};var p=function(e){var t=0,o=0,i=$(".map-fullscreen-overlay"),a=60;t=i.width()-2*a,o=i.height()-2*a;var l=null;e>0&&(l=setInterval(function(){n.container.fitToViewport()},1)),s.parent().animate({width:t,height:o,top:a,left:a},e,function(){clearInterval(l),n&&n.container&&n.container.fitToViewport()})},m=function(e){var t={};s.parent().data("originalSize")?t=s.parent().data("originalSize"):(t={h:s.parent().height()},s.parent().data("originalSize",t)),s.parent().addClass("map-fullscreen");var o=$("<div/>");o.addClass("map-fs-dummy").css({height:t.h}),s.parent().after(o),s.parent().css({width:o.width(),height:o.height(),top:o.offset().top-$(document).scrollTop(),left:o.offset().left}),n&&n.container&&n.container.fitToViewport(),e&&e()};this.enterFullScreen=function(){$("body").append('<div class="map-fullscreen-overlay"><a class="map-fullscreen-close kiv-e" href="#"><i class="icon-font icon-font-cross"></i></a></div>'),$("html,body").css("overflow","hidden"),setTimeout(function(){$(".map-fullscreen-overlay").addClass("ready")},50),$(document).off("keyup.map-fullscreen").on("keyup.map-fullscreen",function(e){27==e.keyCode&&t.exitFullScreen()}),$(".map-fullscreen-close").off("click").on("click",function(e){e.preventDefault(),t.exitFullScreen()}),a.fullScreenTrigger&&$(a.fullScreenTrigger).hide(),m(function(){p(l),setTimeout(function(){$(window).off("resize.mapFullscreen").on("resize.mapFullscreen",function(){p(0)}),setTimeout(function(){$(window).trigger("resize")},50)},l)})},this.exitFullScreen=function(){$(window).off("resize.mapFullscreen"),a.fullScreenTrigger&&$(a.fullScreenTrigger).show();var e=$(".map-fs-dummy"),t=setInterval(function(){n.container.fitToViewport()},1);$(".map-fullscreen-overlay").removeClass("ready"),setTimeout(function(){$(".map-fullscreen-overlay").remove()},400),s.parent().animate({width:e.width(),height:e.height(),top:e.offset().top-$(document).scrollTop(),left:e.offset().left},l,function(){s.parent().css({top:0,left:0}),s.parent().removeClass("map-fullscreen"),e.remove(),clearInterval(t),$("html,body").css("overflow","auto"),n.container.fitToViewport()}),n.container.fitToViewport()},this.createClusterer=function(){function e(){var e=n.zoomRange.getCurrent()[1],t=n.getZoom();return t>=e}function t(){return e()?a:i}function o(t){var n;return n=e()?'<div class="map-cluster"><div class="anchor" style="width: '+t[0]+"px; height: "+t[1]+'px"></div></div>':'<div class="map-cluster">$[properties.geoObjects.length]</div>',ymaps.templateLayoutFactory.createClass(n)}var i=[{href:"/i/kvad_map_circ_small_red.png",size:[43,43],offset:[-21.5,-21.5]},{href:"/i/kvad_map_circ_large_red.png",size:[60,60],offset:[-10,-25]}],a=[{href:"/i/kvad_marker_list.png",size:[31,43],offset:[-15.5,-21.5]},{href:"/i/kvad_marker_list.png",size:[31,43],offset:[-15.5,-21.5]}];c=new ymaps.Clusterer({clusterIcons:t(),clusterNumbers:[15],clusterIconContentLayout:o(),clusterDisableClickZoom:!1,openBalloonOnClick:!1,zoomMargin:50,margin:15}),n.geoObjects.add(c),c.createCluster=function(e,n){var i=ymaps.Clusterer.prototype.createCluster.call(this,e,n),a=t();return i.options.set("icons",a),i.options.set("iconContentLayout",o(a[0].size)),i}},this.init=function(){"undefined"!=typeof ymaps?(r(),a.onInit(t)):$.getScript("http://api-maps.yandex.ru/2.0-stable/?load=package.full&lang=ru-RU",function(){ymaps.ready(function(){r(),a.onInit(t)})})}};