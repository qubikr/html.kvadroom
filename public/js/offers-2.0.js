var ClickOutside = function(options){
	var _this = this,
		_id = _.uniqueId('UIClickOutside_');

	this.options = $.extend({
		selector: '', 
		onClickOutside: function($target){}
	}, options);

	this.bind = function(){
		this.unbind();
		
		$(document).on('mouseup.' + _id, function (e){
			var $container = $(_this.options.selector);

			if (!$container.is(e.target) && $container.has(e.target).length === 0){
			    _this.options.onClickOutside(e.target);
			}
		});
	};
 
	this.unbind = function(){
		$(document).off('mouseup.' + _id);
	};
};


$(function(){
	$('.offers-2 .list>.item').each(function(){
		var $frame  = $(this).find('.frames');
		var $slidee = $frame.children('.frames-content').eq(0);
		var $wrap   = $frame.parent();

		$frame.sly({
			horizontal: 1,
			itemNav: 'basic',
			smart: 1,
			activateOn: 'click',
			mouseDragging: 0,
			touchDragging: 1,
			releaseSwing: 1,
			startAt: 3,
			scrollBar: $wrap.find('.scrollbar'),
			scrollBy: 1,
			pagesBar: $wrap.find('.pages'),
			activatePageOn: 'click',
			speed: 300,
			elasticBounds: 1,
			easing: 'easeOutExpo',
			dragHandle: 1,
			dynamicHandle: 1,
			clickBar: 1,

			// Buttons
			forward: $wrap.find('.forward'),
			backward: $wrap.find('.backward'),
			prev: $wrap.find('.slide-left'),
			next: $wrap.find('.slide-right'),
			prevPage: $wrap.find('.prevPage'),
			nextPage: $wrap.find('.nextPage')
		});
	});

	$('.dropdown, #is-date, .input-hybrid').off('click').on('click', function(){
		var $dd = $(this);

		if(!$dd.hasClass('active')){
			var co = new ClickOutside({
				selector: '#' + $dd.attr('id'),
				onClickOutside: function(){
					$dd.removeClass('active');
				}
			});

			co.bind();

			$dd.addClass('active');

			$(document).off('keyup.filter3dropdown').on('keyup.filter3dropdown', function(e){
				switch(e.keyCode){
					case 27 : {
						$dd.removeClass('active');
						$(document).off('keyup.filter3dropdown');
					} break;

					case 40 : {
						var $next = $dd.find('li.highlight').next();

						if($next.length > 0){
							$next = $dd.find('li:first');
						}

						$next.addClass('highlight');

						e.preventDefault();
					} break;
				}
			});

			$dd.find('li').off('click').on('click', function(e){
				$dd.find('li').removeClass('active');
				$(this).addClass('active');

				if($dd.find('.title').is('input')){
					$dd.find('.title').val($(this).html());
				}else{
					$dd.find('.title').html($(this).html());
				}

				$dd.removeClass('active');
				e.stopPropagation();
			});

			$dd
				.find('.val')
					.off('click')
					.on('click', function(e){
						e.stopPropagation();
					})
					.off('focus')
					.on('focus', function(e){
						$(this).off('keyup').on('keyup', function(e){
							if(e.keyCode === 13){
								$dd.find('.title').val($(this).val());
								$(this).off('keyup focus');
								$dd.removeClass('active');
							}
						});
					})
					.focus();

			$dd.find('.ok').off('click').on('click', function(e){
				$dd.removeClass('active');
				$dd.find('.title').val($dd.find('.val').val());
				e.preventDefault();
				e.stopPropagation();
			});
		}else{
			$dd.removeClass('active');
		}
	});

	$('.prices .selector li').off('click').on('click', function(){
		$('.prices .selector li').removeClass('active');
		$(this).addClass('active');
		$('.prices .selector .title').html($(this).data('title'));
	});
});