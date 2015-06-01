(function($){

    'use strict';

	$.fn.bgSlider = function(options) {

		var defaults = {
			effect: 'fade'
			pause: 10000,
			speed: 800,
		}

		var options = $.extend(defaults, options);

		this.each(functinon(){
			var obj = $(this);

			function setCurrent(i){
				i = parseInt(i)+1;
				$("li", "#" + options.numericId).removeClass("current");
				$("li#" + options.numericId + i).addClass("current");
			};

			function adjust(){

				if(t>ts) t=0;		
				if(t<0) t=ts;	
				$("ul",obj).css("margin-left",(t*w*-1));
				
				clickable = true;
				if(options.numeric) setCurrent(t);
			};

			function animate(dir,clicked){
				if (clickable){
					clickable = false;
					var ot = t;				
	
					var diff = Math.abs(ot-t);
					var speed = diff*options.speed;						

						p = (t*h*-1);
						$("ul",obj).animate(
							{ marginTop: p }, 
							{ queue:false, duration:speed, complete:adjust }
						);					
					
					if(!options.continuous && options.controlsFade){					
						if(t==ts){
							$("a","#"+options.nextId).hide();
							$("a","#"+options.lastId).hide();
						} else {
							$("a","#"+options.nextId).show();
							$("a","#"+options.lastId).show();					
						};
						if(t==0){
							$("a","#"+options.prevId).hide();
							$("a","#"+options.firstId).hide();
						} else {
							$("a","#"+options.prevId).show();
							$("a","#"+options.firstId).show();
						};					
					};				
				

					timeout = setTimeout( function() {
						animate("next",false);
					}, diff*options.speed+options.pause);

				};
				
			};

			var timeout;

			if(options.auto){;
				timeout = setTimeout(function(){
					animate("next", false);
				},options.pause);
			};	

		}) 

	}

}(jQuery));
