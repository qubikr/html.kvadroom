(function($) {
    $.fn.KVMetaLink = function(method) {
        var settings = {
            new_window: false
        };

        var methods = {
            init: function(options) {
                return this.each(function() {
                    var $this = $(this),
                        data = $this.data('KVMetaLink');

                    if (!data) {
                        $this.addClass('cursor-pointer').data('KVMetaLink', {
                            settings: $.extend(settings, options)
                        });

                        $this.find('a').off('click').on('click', function(e) {
                            e.preventDefault();
                        });

                        $this.off('click.KVMetaLink').on('click.KVMetaLink', function(e) {
                            e.preventDefault();
                            //e.stopPropagation();

                            if ($this.data('meta_direct_selector')) {
                                if (!$(e.target).is($this.data('meta_direct_selector'))) {
                                    return;
                                }
                            }

                            if ($this.data('meta_direct_selector_exclude')) {
                                if (
                                    $(e.target).is($this.data('meta_direct_selector_exclude')) ||
                                    $(e.target).parents($this.data('meta_direct_selector_exclude')).length > 0
                                ) {
                                    return;
                                }
                            }

                            if ($this.data('meta_add_class')) {
                                $this.addClass($this.data('meta_add_class'));
                            }

                            if ($this.data('KVMetaLink').settings.new_window === true || $this.data('meta_blank') === true) {
                                window.open($this.data('meta_url'), '_blank');
                            } else {
                                document.location.href = $this.data('meta_url');
                            }
                        });
                    }
                });
            }
        };

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('KVMetaLink Invalid method!');
        }
    };
})(jQuery);