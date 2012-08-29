var DATA = [
    {"value": "actionscript", "label": "ActionScript", "type": "language"}, 
    {"value": "applescript", "label": "AppleScript", "type": "language"}, 
    {"value": "asp", "label": "Asp", "type": "language"}, 
    {"value": "basic", "label": "BASIC", "type": "language"}, 
    {"value": "c", "label": "C", "type": "language"}, 
    {"value": "c++", "label": "C++", "type": "language"}, 
    {"value": "clojure", "label": "Clojure", "type": "language"}, 
    {"value": "cobol", "label": "COBOL", "type": "language"}, 
    {"value": "coldfusion", "label": "ColdFusion", "type": "language"}, 
    {"value": "erlang", "label": "Erlang", "type": "language"}, 
    {"value": "fortran", "label": "Fortran", "type": "language"}, 
    {"value": "groovy", "label": "Groovy", "type": "language"}, 
    {"value": "haskell", "label": "Haskell", "type": "language"}, 
    {"value": "java", "label": "Java", "type": "language"}, 
    {"value": "javascript", "label": "JavaScript", "type": "language"}, 
    {"value": "lisp", "label": "Lisp", "type": "language"}, 
    {"value": "perl", "label": "Perl", "type": "language"}, 
    {"value": "php", "label": "PHP", "type": "language"}, 
    {"value": "python", "label": "Python", "type": "language"}, 
    {"value": "ruby", "label": "Ruby", "type": "language"}, 
    {"value": "scala", "label": "Scala", "type": "language"}, 
    {"value": "scheme", "label": "Scheme", "type": "language"}
];
(function() {
    RegExp.escape = function(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }

    $.fn.intertag = function(options) {
        $(this).each(function() {
            var subinput = '<input type="text" class="ui-intertag-subinput" />';
            var tag = '<span class="ui-tag"><span class="ui-label"></span><span class="ui-icon ui-icon-close"></span></span>';

            var container = $('<div>').addClass('ui-intertag');
            var tags = $("<div class='ui-intertag-tags'></div>");
            container.append(tags);

            var $this = $(this);
            $this.replaceWith(container);

            var resize_input = function() {
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
                    if (last.length == 0) {
                        response([]);
                    } else {
                        response($.grep(DATA, function(el, idx) {
                            return el.label.toLowerCase().substring(0, last.length) == last;
                        }));
                    }
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
                    $(this).data('autocomplete').menu.element.find('li').each(function(idx, item) {
                        var $item = $(item);
                        var data = $item.data('item.autocomplete');
                        if (data.type) {
                            $item.addClass('ui-tag-type-' + data.type)
                        }
                    });
                }
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