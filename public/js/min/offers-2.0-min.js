$(function(){$(".offers-2 .list>.item").each(function(){var a=$(this).find(".frame"),e=a.children("ul").eq(0),i=a.parent();a.sly({horizontal:1,itemNav:"basic",smart:1,activateOn:"click",mouseDragging:0,touchDragging:1,releaseSwing:1,startAt:3,scrollBar:i.find(".scrollbar"),scrollBy:1,pagesBar:i.find(".pages"),activatePageOn:"click",speed:300,elasticBounds:1,easing:"easeOutExpo",dragHandle:1,dynamicHandle:1,clickBar:1,forward:i.find(".forward"),backward:i.find(".backward"),prev:i.find(".slide-left"),next:i.find(".slide-right"),prevPage:i.find(".prevPage"),nextPage:i.find(".nextPage")})})});