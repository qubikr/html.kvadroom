/*! ResponsiveSlides.js v1.54
 * http://responsiveslides.com
 * http://viljamis.com
 *
 * Copyright (c) 2011-2012 @viljamis
 * Available under the MIT license
 */

/*jslint browser: true, sloppy: true, vars: true, plusplus: true, indent: 2 */

(function ($, window, i) {
  $.fn.responsiveSlides = function (options) {

    // Default settings
    var settings = $.extend({
      "auto": true,             // Boolean: Animate automatically, true or false
      "speed": 500,             // Integer: Speed of the transition, in milliseconds
      "timeout": 4000,          // Integer: Time between slide transitions, in milliseconds
      "pager": false,           // Boolean: Show pager, true or false
      "nav": false,             // Boolean: Show navigation, true or false
      "random": false,          // Boolean: Randomize the order of the slides, true or false
      "pause": false,           // Boolean: Pause on hover, true or false
      "pauseControls": true,    // Boolean: Pause when hovering controls, true or false
      "prevText": "Previous",   // String: Text for the "previous" button
      "nextText": "Next",       // String: Text for the "next" button
      "maxwidth": "",           // Integer: Max-width of the slideshow, in pixels
      "navContainer": "",       // Selector: Where auto generated controls should be appended to, default is after the <ul>
      "manualControls": "",     // Selector: Declare custom pager navigation
      "namespace": "rslides",   // String: change the default namespace used
      "before": $.noop,         // Function: Before callback
      "after": $.noop           // Function: After callback
    }, options);

    return this.each(function () {

      // Index for namespacing
      i++;

      var $this = $(this),

        // Local variables
        vendor,
        selectTab,
        startCycle,
        restartCycle,
        rotate,
        $tabs,

        // Helpers
        index = 0,
        $slide = $this.children(),
        length = $slide.size(),
        fadeTime = parseFloat(settings.speed),
        waitTime = parseFloat(settings.timeout),
        maxw = parseFloat(settings.maxwidth),

        // Namespacing
        namespace = settings.namespace,
        namespaceIdx = namespace + i,

        // Classes
        navClass = namespace + "_nav " + namespaceIdx + "_nav",
        activeClass = namespace + "_here",
        visibleClass = namespaceIdx + "_on",
        slideClassPrefix = namespaceIdx + "_s",

        // Pager
        $pager = $("<ul class='" + namespace + "_tabs " + namespaceIdx + "_tabs' />"),

        // Styles for visible and hidden slides
        visible = {"float": "left", "position": "relative", "opacity": 1, "zIndex": 2},
        hidden = {"float": "none", "position": "absolute", "opacity": 0, "zIndex": 1},

        // Detect transition support
        supportsTransitions = (function () {
          var docBody = document.body || document.documentElement;
          var styles = docBody.style;
          var prop = "transition";
          if (typeof styles[prop] === "string") {
            return true;
          }
          // Tests for vendor specific prop
          vendor = ["Moz", "Webkit", "Khtml", "O", "ms"];
          prop = prop.charAt(0).toUpperCase() + prop.substr(1);
          var i;
          for (i = 0; i < vendor.length; i++) {
            if (typeof styles[vendor[i] + prop] === "string") {
              return true;
            }
          }
          return false;
        })(),

        // Fading animation
        slideTo = function (idx) {
          settings.before(idx);
          // If CSS3 transitions are supported
          if (supportsTransitions) {
            $slide
              .removeClass(visibleClass)
              .css(hidden)
              .eq(idx)
              .addClass(visibleClass)
              .css(visible);
            index = idx;
            setTimeout(function () {
              settings.after(idx);
            }, fadeTime);
          // If not, use jQuery fallback
          } else {
            $slide
              .stop()
              .fadeOut(fadeTime, function () {
                $(this)
                  .removeClass(visibleClass)
                  .css(hidden)
                  .css("opacity", 1);
              })
              .eq(idx)
              .fadeIn(fadeTime, function () {
                $(this)
                  .addClass(visibleClass)
                  .css(visible);
                settings.after(idx);
                index = idx;
              });
          }
        };

      // Random order
      if (settings.random) {
        $slide.sort(function () {
          return (Math.round(Math.random()) - 0.5);
        });
        $this
          .empty()
          .append($slide);
      }

      // Add ID's to each slide
      $slide.each(function (i) {
        this.id = slideClassPrefix + i;
      });

      // Add max-width and classes
      $this.addClass(namespace + " " + namespaceIdx);
      if (options && options.maxwidth) {
        $this.css("max-width", maxw);
      }

      // Hide all slides, then show first one
      $slide
        .hide()
        .css(hidden)
        .eq(0)
        .addClass(visibleClass)
        .css(visible)
        .show();

      // CSS transitions
      if (supportsTransitions) {
        $slide
          .show()
          .css({
            // -ms prefix isn't needed as IE10 uses prefix free version
            "-webkit-transition": "opacity " + fadeTime + "ms ease-in-out",
            "-moz-transition": "opacity " + fadeTime + "ms ease-in-out",
            "-o-transition": "opacity " + fadeTime + "ms ease-in-out",
            "transition": "opacity " + fadeTime + "ms ease-in-out"
          });
      }

      // Only run if there's more than one slide
      if ($slide.size() > 1) {

        // Make sure the timeout is at least 100ms longer than the fade
        if (waitTime < fadeTime + 100) {
          return;
        }

        // Pager
        if (settings.pager && !settings.manualControls) {
          var tabMarkup = [];
          $slide.each(function (i) {
            var n = i + 1;
            tabMarkup +=
              "<li>" +
              "<a href='#' class='" + slideClassPrefix + n + "'>" + n + "</a>" +
              "</li>";
          });
          $pager.append(tabMarkup);

          // Inject pager
          if (options.navContainer) {
            $(settings.navContainer).append($pager);
          } else {
            $this.after($pager);
          }
        }

        // Manual pager controls
        if (settings.manualControls) {
          $pager = $(settings.manualControls);
          $pager.addClass(namespace + "_tabs " + namespaceIdx + "_tabs");
        }

        // Add pager slide class prefixes
        if (settings.pager || settings.manualControls) {
          $pager.find('li').each(function (i) {
            $(this).addClass(slideClassPrefix + (i + 1));
          });
        }

        // If we have a pager, we need to set up the selectTab function
        if (settings.pager || settings.manualControls) {
          $tabs = $pager.find('a');

          // Select pager item
          selectTab = function (idx) {
            $tabs
              .closest("li")
              .removeClass(activeClass)
              .eq(idx)
              .addClass(activeClass);
          };
        }

        // Auto cycle
        if (settings.auto) {

          startCycle = function () {
            rotate = setInterval(function () {

              // Clear the event queue
              $slide.stop(true, true);

              var idx = index + 1 < length ? index + 1 : 0;

              // Remove active state and set new if pager is set
              if (settings.pager || settings.manualControls) {
                selectTab(idx);
              }

              slideTo(idx);
            }, waitTime);
          };

          // Init cycle
          startCycle();
        }

        // Restarting cycle
        restartCycle = function () {
          if (settings.auto) {
            // Stop
            clearInterval(rotate);
            // Restart
            startCycle();
          }
        };

        // Pause on hover
        if (settings.pause) {
          $this.hover(function () {
            clearInterval(rotate);
          }, function () {
            restartCycle();
          });
        }

        // Pager click event handler
        if (settings.pager || settings.manualControls) {
          $tabs.bind("click", function (e) {
            e.preventDefault();

            if (!settings.pauseControls) {
              restartCycle();
            }

            // Get index of clicked tab
            var idx = $tabs.index(this);

            // Break if element is already active or currently animated
            if (index === idx || $("." + visibleClass).queue('fx').length) {
              return;
            }

            // Remove active state from old tab and set new one
            selectTab(idx);

            // Do the animation
            slideTo(idx);
          })
            .eq(0)
            .closest("li")
            .addClass(activeClass);

          // Pause when hovering pager
          if (settings.pauseControls) {
            $tabs.hover(function () {
              clearInterval(rotate);
            }, function () {
              restartCycle();
            });
          }
        }

        // Navigation
        if (settings.nav) {
          var navMarkup =
            "<a href='#' class='" + navClass + " prev'>" + settings.prevText + "</a>" +
            "<a href='#' class='" + navClass + " next'>" + settings.nextText + "</a>";

          // Inject navigation
          if (options.navContainer) {
            $(settings.navContainer).append(navMarkup);
          } else {
            $this.after(navMarkup);
          }

          var $trigger = $("." + namespaceIdx + "_nav"),
            $prev = $trigger.filter(".prev");

          // Click event handler
          $trigger.bind("click", function (e) {
            e.preventDefault();

            var $visibleClass = $("." + visibleClass);

            // Prevent clicking if currently animated
            if ($visibleClass.queue('fx').length) {
              return;
            }

            //  Adds active class during slide animation
            //  $(this)
            //    .addClass(namespace + "_active")
            //    .delay(fadeTime)
            //    .queue(function (next) {
            //      $(this).removeClass(namespace + "_active");
            //      next();
            //  });

            // Determine where to slide
            var idx = $slide.index($visibleClass),
              prevIdx = idx - 1,
              nextIdx = idx + 1 < length ? index + 1 : 0;

            // Go to slide
            slideTo($(this)[0] === $prev[0] ? prevIdx : nextIdx);
            if (settings.pager || settings.manualControls) {
              selectTab($(this)[0] === $prev[0] ? prevIdx : nextIdx);
            }

            if (!settings.pauseControls) {
              restartCycle();
            }
          });

          // Pause when hovering navigation
          if (settings.pauseControls) {
            $trigger.hover(function () {
              clearInterval(rotate);
            }, function () {
              restartCycle();
            });
          }
        }

      }

      // Max-width fallback
      if (typeof document.body.style.maxWidth === "undefined" && options.maxwidth) {
        var widthSupport = function () {
          $this.css("width", "100%");
          if ($this.width() > maxw) {
            $this.css("width", maxw);
          }
        };

        // Init fallback
        widthSupport();
        $(window).bind("resize", function () {
          widthSupport();
        });
      }

    });

  };
})(jQuery, this, 0);


var data_activity_cat = {
    1: {
        1: 'novostroyki'
    },
    2: {
        1: 'kupit-kvartiru',
        2: 'sniat-kvartiru',
        3: 'kvartiri-posutochno'
    },
    3: {
        1: 'kupit-komnatu',
        2: 'sniat-komnatu',
        3: 'komnati-posutochno'
    },
    4: {
        1: 'kupit-taunhaus',
        2: 'sniat-taunhaus'
    },
    5: {
        1: 'kupit-dom',
        2: 'sniat-dom',
        3: 'kottedji-posutochno'
    },
    6: {
        1: 'zemelnie-uchastki'
    },
    7: {
        1: 'garaji-kupit',
        2: 'garaji-sniat'
    },
    8: {
        1: 'ofisy-kupit',
        2: 'ofisy-sniat'
    }
};


$(function(){

    var methods = {

        getState: function(){
            return this.data('searchString').searchSelector.hasClass('active');
        },

        assume: function(){
            var data = this.data('searchString');

            if(data.searchSelector.hasClass('active')) {
                data.entryBlock.trigger('keyup');
            }
        },

        setCurrentCity: function(id){
            this.data('searchString').city = id;
        },

        init : function(options) {
            var $this = this;

            $this.data('searchString', {
                entryBlock: $('<input class="entry main-page-search-strings" tabindex="1" placeholder="'+$this.data("placeholder")+'" />'),
                searchSelector: $('<ul class="search-selector" />')
            });

            var thisData = $this.data('searchString');

            $this.append(thisData.entryBlock).after(thisData.searchSelector);

            thisData.entryBlock.css('width', $this.data('width'));

            function highlight(content, what) {
                what = $.trim(what);
                what = what.replace(/[\.,\/#!$%\^&\*;:"'(){}=_`~()]/g, '');
                what.replace(/\s{2,}/g, ' ');

                var whatArr = what.split(' ');

                whatArr.sort(function(a, b){
                    return b.length - a.length;
                });

                for(var i = 0, l = whatArr.length; i < l; i++){
                    var pattern = new RegExp(whatArr[i], 'gi');

                    content = content.replace(pattern, function(matched){
                        return '<span>' + matched + '</span>';
                    });
                }

                return content;
            }

            var t, cache = {};

            function process(data){


                thisData.searchSelector.html('').removeClass('active')

                if(data && data.length > 0){
                    var count = 0;

                    _.each(data, function(item){
                        if(item && item.title){
                            var $obj = $('<li />');


                            $obj.attr('data-region', thisData.city);
                            $obj.attr('data-title_small', item.title_small);
                            $obj.attr('data-url', item.url);
                            if(item.main != 0)
                                $obj.attr('data-region', item.main);

                            item.title = highlight(item.title, thisData.entryBlock.val());

                            $obj.html(item.title).data(item).appendTo(thisData.searchSelector);

                            if(item.type){
                                $obj.addClass(item.type);
                            }

                            count++;
                        }
                    });

                    if(count > 0){
                        thisData.searchSelector.addClass('active');
                    }
                }
            }

            function getData() {

                var val = thisData.entryBlock.val();

                cat = $($('.active[data-value]')[1]).data('value');


                val = val.replace(/[\.,\/#!$%\^&\*;:"'(){}=_`~()]/g, '');


                var data = options.dataGetter(val, cat),
                    token = options.url + JSON.stringify(data);

                if(val && val.length > 1){
                    if(cache[token]){
                        process(cache[token]);
                    } else {
                        console.log(data)
                        $.ajax({
                            url: options.url,
                            data: data,
                            success: function(data){
                                cache[token] = data;
                                process(data);
                            }
                        });
                    }
                }
            }

            thisData.entryBlock.on('keydown', function(e){
                if(!$(this).val() && $.inArray(e.keyCode, [37,38,39,40,13,8]) < 0){
                    $(this).prop('placeholder', '');
                    // $(this).css('width', 40);
                }
            });

            thisData.entryBlock.on('keyup', function(e){
                clearTimeout(t);

                if($(this).val() == '') {
                    thisData.searchSelector.removeClass('active');
                    thisData.entryBlock.attr('placeholder',thisData.entryBlock.parent().data('placeholder'));
                    return false;
                }

                if($.inArray(e.keyCode, [37,38,39,40,13]) < 0) {
                    t = setTimeout(function(){
                        getData();
                    }, 200);
                } else {
                    e.preventDefault();

                    var active = thisData.searchSelector.find('li.active');

                    if(e.keyCode == 40 && active.next().is('li'))
                        active.removeClass('active').next().addClass('active');
                    if(e.keyCode == 38 && active.prev().is('li'))
                        active.removeClass('active').prev().addClass('active');
                    if(e.keyCode == 13)
                        active.click();
                }
            });


            $(document).on('click.searchString', function(){
                thisData.searchSelector.removeClass('active');
            });

            thisData.entryBlock.on('focus', function(){
                $this.addClass('focused');
            });

            thisData.entryBlock.on('blur', function(){
                $this.removeClass('focused');
            });

            $('.search-string, .search-selector').on('click', function(e){
                e.stopPropagation();
                thisData.entryBlock.focus();

                if(thisData.entryBlock.html() != '')
                    thisData.searchSelector.addClass('active');
            });

            thisData.searchSelector.on('click.li', 'li', function(e){

                var data = $(this).data('title_small');
                    thisData.searchSelector.find('li').remove('.active');
                    $(this).addClass('active');

                e.stopPropagation();
                thisData.searchSelector.removeClass('active');
                thisData.entryBlock.val(data);

            });
        }
    };

    $.fn.KVTestSearchString = function(methodOrOptions) {
        if ( methods[methodOrOptions] ) {
            return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.KVSearchString' );
        }
        return this;
    };

    $('.sp-wrapper .inner-image img').on('load', function(){
        $(this).show();
    });

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

    var co = new ClickOutside({
        selector: '.filter',
        onClickOutside: function() {
            $('.search-selector').removeClass('active');
        }
    });

    co.bind();

    /**
    *
    *
    */
    $('.filter').KVTestSearchString({
        "dataGetter":function(val, cat){
            return {'text':val, 'cat': cat};}
        ,'url':'http://www.kvadroom.ru/action/search_text_main/'}
    );

    $($('.dropdown')[1]).find('li').on('mousedown', function(){
        var objectId = $(this).data('value');
        var actions = data_activity_cat[objectId];

        var elems = $($('.dropdown')[0]).find('li');
        $.each(elems, function(){
            $(this).addClass('hide').removeClass('active');
        });

        for(var i in actions ){
            $(elems[i-1]).removeClass('hide');
        }
        $($($('.dropdown')[0]).find('li').not('.active')[0]).addClass('active');
        $($('.dropdown')[0]).find('.title').html($($('.dropdown')[0]).find('li').not('.hide')[0].innerText);
    });


    //@TODO: оформить в функцию
    $('div.btn.blue').on('click', function(){

        var cat;
        var url = $('.search-selector li.active').data('url');
            option1 = $($('.active[data-value]')[0]).data('value');
            option2 = $($('.active[data-value]')[1]).data('value');
            cat = data_activity_cat[option2][option1];

        var prefix = url || '';
        document.location = prefix + cat;

    });

    
    var images = ['cottage_01.jpg','patio_01.jpg','house_01.jpg','interior_01.jpg', 'shale_01.jpg', 'land_01.jpg', 'interior_02.jpg'];
    $('.bgSlider').responsiveSlides({
        autoplay: true
    });
    
});


