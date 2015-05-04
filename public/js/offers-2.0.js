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

			$dd.find('li').off('click').on('click', function(e){
				$dd.find('li').removeClass('active');
				$(this).addClass('active');
				$dd.find('.title').html($(this).html());
				$dd.removeClass('active');
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