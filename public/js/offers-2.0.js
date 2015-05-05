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

	$('.dropdown, .input-select, .input-hybrid, .expandable-selector').off('click').on('click', function(){
		var $dd = $(this);

		if(!$dd.hasClass('active')){
			var co = new ClickOutside({
				selector: '#' + $dd.attr('id'),
				onClickOutside: function(){
					$dd.removeClass('active');
					$(document).off('keydown.filter3dropdown');
				}
			});

			co.bind();

			$dd.addClass('active');

			$dd.find('li.highlight').removeClass('highlight');

			$dd.find('li').off('mouseover').on('mouseover', function(e){
				$dd.find('li').removeClass('highlight');
				$dd.data('keysNav', false);
			});

			$(document).off('keydown.filter3dropdown').on('keydown.filter3dropdown', function(e){
				if(!$dd.data('keysNav')){
					$dd.find('li').removeClass('highlight');
					$dd.data('keysNav', true);
				}

				switch(e.keyCode){
					case 27 : {
						$dd.removeClass('active');
						$(document).off('keydown.filter3dropdown');
					} break;

					case 13 : {
						$dd.find('li.highlight').trigger('click');
						$dd.removeClass('active');
						$(document).off('keydown.filter3dropdown');
					} break;

					case 38 : {
						var $next = $dd.find('li.highlight').prev('li');

						if($next.length === 0){
							$next = $dd.find('li:last');
						}

						$dd.find('li.highlight').removeClass('highlight');

						$next.addClass('highlight');

						e.preventDefault();
						e.stopPropagation();
					} break;

					case 40 : {
						var $next = $dd.find('li.highlight').next('li');

						if($next.length === 0){
							$next = $dd.find('li').eq(0);
						}

						$dd.find('li.highlight').removeClass('highlight');

						$next.addClass('highlight');

						e.preventDefault();
						e.stopPropagation();
					} break;
				}
			});

			$dd.find('li').off('click').on('click', function(e){
				$dd.find('li').removeClass('active');
				$(this).addClass('active');

				if($dd.is('.expandable-selector')){
					$dd.parents('.selector').find('a').removeClass('active');
					$dd.addClass('selected');
				}else{
					if($dd.find('.title').is('input')){
						$dd.find('.title').val($(this).html());
					}else{
						$dd.find('.title').html($(this).html());
					}
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
						$(this).off('keydown').on('keydown', function(e){
							if(e.keyCode === 13){
								$dd.find('.title').val($(this).val());
								$(this).off('keyup focus');
								$dd.removeClass('active');
								$(this).val('');
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
			$dd.find('li.highlight').removeClass('highlight');
			$dd.removeClass('active');
			$(document).off('keydown.filter3dropdown');
		}
	});

	$('.selector').each(function(){
		var $selector = $(this);

		$selector.find('a').on('click', function(e){
			e.preventDefault();

			$selector.find('a').removeClass('active');
			$(this).addClass('active');

			$selector.find('.expandable-selector').removeClass('selected');
			$selector.find('.expandable-selector ul li').removeClass('active');
		});
	});

	$('.prices .selector li').off('click').on('click', function(){
		$('.prices .selector li').removeClass('active');
		$(this).addClass('active');
		$('.prices .selector .title').html($(this).data('title'));
	});

	$('aside').css({ 
		height: $('aside').parents('.container-main').outerHeight() 
	});

	$('.sticky-block').stick_in_parent({
		offset_top: 20
	});

	$('.sticky-block').on('click', function(e){
		e.preventDefault();
		$('html, body').animate({
            scrollTop: $('aside').offset().top - 20
        }, 600, "swing");
	});
});