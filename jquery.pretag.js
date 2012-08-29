(function() {
    RegExp.escape = function(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }

    $.fn.intertag = function(options) {
        $(this).each(function() {
            options = $.extend({
                'source': function(request, response) { response([]); }
            }, options);

            var subinput = '<input type="text" class="ui-intertag-subinput" />';
            var tag = '<span class="ui-tag"><span class="ui-label"></span><span class="ui-icon ui-icon-close"></span></span>';

            var container = $('<div>').addClass('ui-intertag');
            var tags = $("<div class='ui-intertag-tags'></div>");
            container.append(tags);

            var $this = $(this);
            $this.replaceWith(container);

            var menu_area = $("<div>").addClass("ui-menu-area");
            container.after(menu_area);

            var resize_input = function() {
                var container_width = container.width();
                var tags_width = tags.width() - parseInt($input.css('padding-left'));
                if (tags_width> (container_width / 2)) {
                    var itags = tags.find('.ui-tag .ui-label');
                    itags.css({'max-width': (.4 * container_width) / itags.length});
                } else {
                    tags.find('.ui-tag .ui-label').css({'max-width':'auto'});
                }

                tags_width = tags.width() - parseInt($input.css('padding-left'));
                $input.width(container.width() - tags.width() - parseInt($input.css('padding-left')));
            }

            var $input = $(subinput).addClass('ui-intertag-first').addClass('ui-intertag-last');
            container.append($input);
            var clear = $('<div>').css('clear', 'both');
            container.append(clear);

            resize_input();

            var caret = 0;
            var last = "";
            $input.autocomplete({
                source: function(request, response) {
                    caret = this.element.caret().end;
                    last = request.term.substring(0, caret).split(/\s+/g).pop().toLowerCase();

                    var nrequest = $.extend({}, request, {'term': last});
                    options.source.call(this, nrequest, response);
                },
                select: function(event, ui) {
                    var $this = $(this);
                    var val = $this.val();
                    var pre_tag = val.substring(0, caret).split(new RegExp(RegExp.escape(last) + '$', 'ig'))[0];
                    var post_tag = val.substring(caret, val.length);

                    $this.val(pre_tag + post_tag);

                    var new_tag = $(tag);
                    new_tag.find('.ui-label').html(ui.item.label);
                    new_tag.data('value', ui.item.value);
                    if (ui.item.type) {
                        new_tag.addClass('ui-tag-type-' + ui.item.type);
                    }
                    new_tag.appendTo(tags);

                    $this.focus();
                    $this.caret(pre_tag.length,pre_tag.length);

                    resize_input();

                    return false;
                },
                focus: function(event, ui) {
                    return false;
                },
                open: function(event, ui) {
                    var menu = $(this).data('autocomplete').menu.element;
                    menu.find('li').each(function(idx, item) {
                        var $item = $(item);
                        var data = $item.data('item.autocomplete');
                        if (data.type) {
                            $item.addClass('ui-tag-type-' + data.type)
                        }
                    });
                    menu.width(container.width() - (parseInt(menu.css('padding-left')) + parseInt(menu.css('padding-right'))));
                },
                appendTo: menu_area,
                position: {of: menu_area}
            })
            
            var size = Math.round(.8 * parseInt($this.css('fontSize')));

            $input.on('keydown.intertag', function(e) {
                if (e.which == 8) { // backspace
                    if ($input.caret().end == 0) {
                        removeTag(tags.children().eq(-1))
                    }
                }
            })

            var removeTag = function(tag_element) {
                tag_element.remove();
                resize_input();
                $input.focus();
            }

            container.on('click.intertag', '.ui-icon-close', function() {
                removeTag($(this).parents('.ui-tag'));
            });


            container.on('click.intertag', function(event) {
                if (this == event.target) {
                    var inputs = $(this).find('input');
                    var last_input = inputs.eq(inputs.length - 1);
                    last_input.focus();

                    var length = last_input.val().length;
                    last_input.caret(length, length);
                }
            });
        });
    }
})(jQuery);