jQuery.fn.fadeSlideShow=function(t){return this.each(function(){settings=jQuery.extend({width:640,height:480,speed:"slow",interval:3e3,allowKeyboardCtrl:!0,autoplay:!0},t),jQuery(this).css({width:settings.width,height:settings.height,position:"relative",overflow:"hidden"}),jQuery("> *",this).css({position:"absolute",width:settings.width,height:settings.height});var e=jQuery("> *",this).length;e-=1;var i=e,a=jQuery("> *",this),s=this,n=!1,r=function(){n=setInterval(function(){if(a.eq(i).fadeOut(settings.speed),settings.ListElement){var t=e-i+1;t>e&&(t=0),jQuery("#"+settings.ListElement+" li").removeClass(settings.ListLiActive),jQuery("#"+settings.ListElement+" li").eq(t).addClass(settings.ListLiActive)}0>=i?(a.fadeIn(settings.speed),i=e):i-=1},settings.interval),settings.PlayPauseElement&&jQuery("#"+settings.PlayPauseElement).html(settings.PauseText)},l=function(){clearInterval(n),n=!1,settings.PlayPauseElement&&jQuery("#"+settings.PlayPauseElement).html(settings.PlayText)},o=function(t){0>t?t=e:t>e&&(t=0),t>=i?jQuery("> *:lt("+(t+1)+")",s).fadeIn(settings.speed):i>=t&&jQuery("> *:gt("+t+")",s).fadeOut(settings.speed),i=t,settings.ListElement&&(jQuery("#"+settings.ListElement+" li").removeClass(settings.ListLiActive),jQuery("#"+settings.ListElement+" li").eq(e-t).addClass(settings.ListLiActive))};if(settings.ListElement){for(var c=0,u="";e>=c;)u=0==c?u+'<li class="'+settings.ListLi+c+" "+settings.ListLiActive+'"><a href="#">'+(c+1)+"</a></li>":u+'<li class="'+settings.ListLi+c+'"><a href="#">'+(c+1)+"</a></li>",c++;var d='<ul id="'+settings.ListElement+'">'+u+"</ul>";settings.addListToId?jQuery("#"+settings.addListToId).append(d):jQuery(this).after(d),jQuery("#"+settings.ListElement+" a").bind("click",function(){var t=jQuery("#"+settings.ListElement+" a").index(this);l();var i=e-t;return o(i),!1})}settings.PlayPauseElement&&(jQuery("#"+settings.PlayPauseElement).css("display")||jQuery(this).after('<a href="#" id="'+settings.PlayPauseElement+'"></a>'),settings.autoplay?jQuery("#"+settings.PlayPauseElement).html(settings.PauseText):jQuery("#"+settings.PlayPauseElement).html(settings.PlayText),jQuery("#"+settings.PlayPauseElement).bind("click",function(){return n?l():r(),!1})),settings.autoplay?r():n=!1})};var data_activity_cat={1:{1:"novostroyki"},2:{1:"kupit-kvartiru",2:"sniat-kvartiru",3:"kvartiri-posutochno"},3:{1:"kupit-komnatu",2:"sniat-komnatu",3:"komnati-posutochno"},4:{1:"kupit-taunhaus",2:"sniat-taunhaus"},5:{1:"kupit-dom",2:"sniat-dom",3:"kottedji-posutochno"},6:{1:"zemelnie-uchastki"},7:{1:"garaji-kupit",2:"garaji-sniat"},8:{1:"ofisy-kupit",2:"ofisy-sniat"}};$(function(){var t={getState:function(){return this.data("searchString").searchSelector.hasClass("active")},assume:function(){var t=this.data("searchString");t.searchSelector.hasClass("active")&&t.entryBlock.trigger("keyup")},setCurrentCity:function(t){this.data("searchString").city=t},init:function(t){function e(t,e){e=$.trim(e),e=e.replace(/[\.,\/#!$%\^&\*;:"'(){}=_`~()]/g,""),e.replace(/\s{2,}/g," ");var i=e.split(" ");i.sort(function(t,e){return e.length-t.length});for(var a=0,s=i.length;s>a;a++){var n=new RegExp(i[a],"gi");t=t.replace(n,function(t){return"<span>"+t+"</span>"})}return t}function i(t){if(n.searchSelector.html("").removeClass("active"),t&&t.length>0){var i=0;_.each(t,function(t){if(t&&t.title){var a=$("<li />");a.attr("data-region",n.city),a.attr("data-title_small",t.title_small),a.attr("data-url",t.url),0!=t.main&&a.attr("data-region",t.main),t.title=e(t.title,n.entryBlock.val()),a.html(t.title).data(t).appendTo(n.searchSelector),t.type&&a.addClass(t.type),i++}}),i>0&&n.searchSelector.addClass("active")}}function a(){var e=n.entryBlock.val();cat=$($(".active[data-value]")[1]).data("value"),e=e.replace(/[\.,\/#!$%\^&\*;:"'(){}=_`~()]/g,"");var a=t.dataGetter(e,cat),s=t.url+JSON.stringify(a);e&&e.length>1&&(l[s]?i(l[s]):(console.log(a),$.ajax({url:t.url,data:a,success:function(t){l[s]=t,i(t)}})))}var s=this;s.data("searchString",{entryBlock:$('<input class="entry main-page-search-strings" tabindex="1" placeholder="'+s.data("placeholder")+'" />'),searchSelector:$('<ul class="search-selector" />')});var n=s.data("searchString");s.append(n.entryBlock).after(n.searchSelector),n.entryBlock.css("width",s.data("width"));var r,l={};n.entryBlock.on("keydown",function(t){!$(this).val()&&$.inArray(t.keyCode,[37,38,39,40,13,8])<0&&$(this).prop("placeholder","")}),n.entryBlock.on("keyup",function(t){if(clearTimeout(r),""==$(this).val())return n.searchSelector.removeClass("active"),n.entryBlock.attr("placeholder",n.entryBlock.parent().data("placeholder")),!1;if($.inArray(t.keyCode,[37,38,39,40,13])<0)r=setTimeout(function(){a()},200);else{t.preventDefault();var e=n.searchSelector.find("li.active");40==t.keyCode&&e.next().is("li")&&e.removeClass("active").next().addClass("active"),38==t.keyCode&&e.prev().is("li")&&e.removeClass("active").prev().addClass("active"),13==t.keyCode&&e.click()}}),$(document).on("click.searchString",function(){n.searchSelector.removeClass("active")}),n.entryBlock.on("focus",function(){s.addClass("focused")}),n.entryBlock.on("blur",function(){s.removeClass("focused")}),$(".search-string, .search-selector").on("click",function(t){t.stopPropagation(),n.entryBlock.focus(),""!=n.entryBlock.html()&&n.searchSelector.addClass("active")}),n.searchSelector.on("click.li","li",function(t){var e=$(this).data("title_small");n.searchSelector.find("li").remove(".active"),$(this).addClass("active"),t.stopPropagation(),n.searchSelector.removeClass("active"),n.entryBlock.val(e)})}};$.fn.KVTestSearchString=function(e){return t[e]?t[e].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof e&&e?($.error("Method "+e+" does not exist on jQuery.KVSearchString"),this):t.init.apply(this,arguments)},$(".sp-wrapper .inner-image img").on("load",function(){$(this).show()});var e=function(t){var e=this,i=_.uniqueId("UIClickOutside_");this.options=$.extend({selector:"",onClickOutside:function(t){}},t),this.bind=function(){this.unbind(),$(document).on("mouseup."+i,function(t){var i=$(e.options.selector);i.is(t.target)||0!==i.has(t.target).length||e.options.onClickOutside(t.target)})},this.unbind=function(){$(document).off("mouseup."+i)}},i=new e({selector:".filter",onClickOutside:function(){$(".search-selector").removeClass("active")}});i.bind(),$(".filter").KVTestSearchString({dataGetter:function(t,e){return{text:t,cat:e}},url:"http://www.kvadroom.ru/action/search_text_main/"}),$($(".dropdown")[1]).find("li").on("mousedown",function(){var t=$(this).data("value"),e=data_activity_cat[t],i=$($(".dropdown")[0]).find("li");$.each(i,function(){$(this).addClass("hide").removeClass("active")});for(var a in e)$(i[a-1]).removeClass("hide");$($($(".dropdown")[0]).find("li").not(".active")[0]).addClass("active"),$($(".dropdown")[0]).find(".title").html($($(".dropdown")[0]).find("li").not(".hide")[0].innerText)}),$("div.btn.blue").on("click",function(){var t,e=$(".search-selector li.active").data("url");option1=$($(".active[data-value]")[0]).data("value"),option2=$($(".active[data-value]")[1]).data("value"),t=data_activity_cat[option2][option1];var i=e||"";document.location=i+t});var a=["cottage_01.jpg","patio_01.jpg","house_01.jpg","interior_01.jpg","shale_01.jpg","land_01.jpg","interior_02.jpg"];$(".bgSlider").fadeSlideShow({width:1440,height:560,autoplay:!0})});