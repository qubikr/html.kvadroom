var data_activity_cat={1:{1:"novostroyki"},2:{1:"kupit-kvartiru",2:"sniat-kvartiru",3:"kvartiri-posutochno"},3:{1:"kupit-komnatu",2:"sniat-komnatu",3:"komnati-posutochno"},4:{1:"kupit-taunhaus",2:"sniat-taunhaus"},5:{1:"kupit-dom",2:"sniat-dom",3:"kottedji-posutochno"},6:{1:"zemelnie-uchastki"},7:{1:"garaji-kupit",2:"garaji-sniat"},8:{1:"ofisy-kupit",2:"ofisy-sniat"}};$(function(){var t={getState:function(){return this.data("searchString").searchSelector.hasClass("active")},assume:function(){var t=this.data("searchString");t.searchSelector.hasClass("active")&&t.entryBlock.trigger("keyup")},setCurrentCity:function(t){this.data("searchString").city=t},init:function(t){function e(t,e){e=$.trim(e),e=e.replace(/[\.,\/#!$%\^&\*;:"'(){}=_`~()]/g,""),e.replace(/\s{2,}/g," ");var a=e.split(" ");a.sort(function(t,e){return e.length-t.length});for(var i=0,n=a.length;n>i;i++){var r=new RegExp(a[i],"gi");t=t.replace(r,function(t){return"<span>"+t+"</span>"})}return t}function a(t){if(r.searchSelector.html("").removeClass("active"),t&&t.length>0){var a=0;_.each(t,function(t){if(t&&t.title){var i=$("<li />");i.attr("data-region",r.city),i.attr("data-title_small",t.title_small),i.attr("data-url",t.url),t.title=e(t.title,r.entryBlock.val()),i.html(t.title).data(t).appendTo(r.searchSelector),t.type&&i.addClass(t.type),a++}}),a>0&&r.searchSelector.addClass("active")}}function i(){var e=r.entryBlock.val();cat=$($(".active[data-value]")[1]).data("value"),e=e.replace(/[\.,\/#!$%\^&\*;:"'(){}=_`~()]/g,"");var i=t.dataGetter(e,cat),n=t.url+JSON.stringify(i);e&&e.length>1&&(c[n]?a(c[n]):(console.log(i),$.ajax({url:t.url,data:i,success:function(t){c[n]=t,a(t)}})))}var n=this;n.data("searchString",{entryBlock:$('<input class="entry main-page-search-strings" tabindex="1" placeholder="'+n.data("placeholder")+'" />'),searchSelector:$('<ul class="search-selector" />')});var r=n.data("searchString");n.append(r.entryBlock).after(r.searchSelector),r.entryBlock.css("width",n.data("width"));var o,c={};r.entryBlock.on("keydown",function(t){!$(this).val()&&$.inArray(t.keyCode,[37,38,39,40,13,8])<0&&$(this).prop("placeholder","")}),r.entryBlock.on("keyup",function(t){if(clearTimeout(o),""==$(this).val())return r.searchSelector.removeClass("active"),r.entryBlock.attr("placeholder",r.entryBlock.parent().data("placeholder")),!1;if($.inArray(t.keyCode,[37,38,39,40,13])<0)o=setTimeout(function(){i()},200);else{t.preventDefault();var e=r.searchSelector.find("li.active");40==t.keyCode&&e.next().is("li")&&e.removeClass("active").next().addClass("active"),38==t.keyCode&&e.prev().is("li")&&e.removeClass("active").prev().addClass("active"),13==t.keyCode&&e.click()}}),$(document).on("click.searchString",function(){r.searchSelector.removeClass("active")}),r.entryBlock.on("focus",function(){n.addClass("focused")}),r.entryBlock.on("blur",function(){n.removeClass("focused")}),$(".search-string, .search-selector").on("click",function(t){t.stopPropagation(),r.entryBlock.focus(),""!=r.entryBlock.html()&&r.searchSelector.addClass("active")}),r.searchSelector.on("click.li","li",function(t){var e=$(this).data("title_small");r.searchSelector.find("li").remove(".active"),$(this).addClass("active"),t.stopPropagation(),r.searchSelector.removeClass("active"),r.entryBlock.val(e)})}};$.fn.KVTestSearchString=function(e){return t[e]?t[e].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof e&&e?($.error("Method "+e+" does not exist on jQuery.KVSearchString"),this):t.init.apply(this,arguments)},$(".sp-wrapper .inner-image img").on("load",function(){$(this).show()});var e=function(t){var e=this,a=_.uniqueId("UIClickOutside_");this.options=$.extend({selector:"",onClickOutside:function(t){}},t),this.bind=function(){this.unbind(),$(document).on("mouseup."+a,function(t){var a=$(e.options.selector);a.is(t.target)||0!==a.has(t.target).length||e.options.onClickOutside(t.target)})},this.unbind=function(){$(document).off("mouseup."+a)}},a=new e({selector:".filter",onClickOutside:function(){$(".search-selector").removeClass("active")}});a.bind(),$(".filter").KVTestSearchString({dataGetter:function(t,e){return{text:t,cat:e}},url:"http://www.kvadroom.ru/action/search_text_main/"}),$($(".dropdown")[1]).find("li").on("mousedown",function(){var t=$(this).data("value"),e=data_activity_cat[t],a=$($(".dropdown")[0]).find("li");$.each(a,function(){$(this).addClass("hide").removeClass("active")});for(var i in e)$(a[i-1]).removeClass("hide");$($($(".dropdown")[0]).find("li").not(".active")[0]).addClass("active"),$($(".dropdown")[0]).find(".title").html($($(".dropdown")[0]).find("li").not(".hide")[0].innerText)}),$("div.btn.blue").on("click",function(){var t,e=$(".search-selector li.active").data("url");option1=$($(".active[data-value]")[0]).data("value"),option2=$($(".active[data-value]")[1]).data("value"),t=data_activity_cat[option2][option1];var a=e||"";document.location=a+t});var i=0,n=["townhouses_01.jpg","house_01.jpg","interior_01.jpg"],r=setInterval(function(){$(".dop_div").fadeTo("slow",.3,function(){$(".dop_div").css("background-image","url(../i/"+n[i]+")"),$(".dop_div").fadeTo("fast",1)}),i++,i>=3&&(i=0)},1e4)});