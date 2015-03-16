var Complex = {};

Complex.SliderGallery = function(){
    var $container = $('.slider-gallery'),
        $frame = $container.find('.frame');

    this.init = function(){
        $frame.sly({
            horizontal: 1,
            itemNav: 'basic',
            smart: 1,
            activateOn: 'click',
            mouseDragging: 1,
            touchDragging: 1,
            releaseSwing: 1,
            forceCenter: 1,
            centered: 1,
            startAt: 1,
            scrollBy: 1,
            activatePageOn: 'click',
            speed: 700,
            elasticBounds: 1,
            easing: 'easeOutExpo',
            dragHandle: 1,
            dynamicHandle: 1,
            clickBar: 1,
            prevPage: $container.find('.left'),
            nextPage: $container.find('.right')
        });

        return this;
    };

    this.resize = function(){
        $frame.sly('reload');
    };

    return this;
};

Complex.init = function(){
    this.sliderGallery = new this.SliderGallery().init();
};

$(function(){
    Complex.init();
});