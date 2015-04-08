function makeOffersWider(){
	var $rows = $('.offers-row').not('.wide');

	$('.grid-16.offers')
		.addClass('grid-24')
		.removeClass('grid-16')
		.next('.grid-8')
			.hide();

	$rows.each(function(){
		var $item = $(this);

		console.log($item);

		var $threeCol = $('<div class="grid-4 omega"></div>');

		$item
			.addClass('wide')
			.find('>.grid-12.omega')
				.removeClass('grid-12 omega')
				.addClass('grid-16')
				.after($threeCol);

		if($item.is('.offer-row-closed')){
			$item.find('.grid-14')
				.removeClass('grid-14')
				.addClass('grid-22');
		}

		$item
			.find('>.grid-16')
				.find('>.grid-8')
					.removeClass('grid-8')
					.addClass('grid-12');

		var $spLabels = $item.find('.sp-labels');

		$item.data('spLabelsPrev', $spLabels.prev());

		$spLabels.appendTo($threeCol);
	});
}

function makeOffersNarrower(){
	var $rows = $('.offers-row').filter('.wide');

	$('.grid-24.offers')
		.addClass('grid-16')
		.removeClass('grid-24')
		.next('.grid-8')
			.show();

	$rows.each(function(){
		var $item = $(this);

		$item
			.removeClass('wide')
			.find('>.grid-16')
				.removeClass('grid-16')
				.addClass('grid-12 omega');

		if($item.is('.offer-row-closed')){
			$item.find('.grid-22')
				.removeClass('grid-22')
				.addClass('grid-14');
		}

		var $spLabels = $item.find('.sp-labels');

		if($item.data('spLabelsPrev')){
			$spLabels.insertAfter($item.data('spLabelsPrev'));
		}else{
			$item
				.find('.offer-image-block')
					.append($spLabels);
		}

		$item
			.find('.grid-4:last')
				.remove();

		$item
			.find('>.grid-12.omega')
				.find('>.grid-12')
					.removeClass('grid-12')
					.addClass('grid-8');
	});
}



$(window).on('scroll', function(){
	var st = $(window).scrollTop(),
		ot = $('.offers').offset().top + 300;

	if(st > ot){
		makeOffersWider();
	}else{
		makeOffersNarrower();
	}
});