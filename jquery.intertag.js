var DATA = [
    {"value": "actionscript", "label": "ActionScript"}, 
    {"value": "applescript", "label": "AppleScript"}, 
    {"value": "asp", "label": "Asp"}, 
    {"value": "basic", "label": "BASIC"}, 
    {"value": "c", "label": "C"}, 
    {"value": "c++", "label": "C++"}, 
    {"value": "clojure", "label": "Clojure"}, 
    {"value": "cobol", "label": "COBOL"}, 
    {"value": "coldfusion", "label": "ColdFusion"}, 
    {"value": "erlang", "label": "Erlang"}, 
    {"value": "fortran", "label": "Fortran"}, 
    {"value": "groovy", "label": "Groovy"}, 
    {"value": "haskell", "label": "Haskell"}, 
    {"value": "java", "label": "Java"}, 
    {"value": "javascript", "label": "JavaScript"}, 
    {"value": "lisp", "label": "Lisp"}, 
    {"value": "perl", "label": "Perl"}, 
    {"value": "php", "label": "PHP"}, 
    {"value": "python", "label": "Python"}, 
    {"value": "ruby", "label": "Ruby"}, 
    {"value": "scala", "label": "Scala"}, 
    {"value": "scheme", "label": "Scheme"}
];
(function() {
    RegExp.escape = function(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }

    $.fn.intertag = function(options) {
        $(this).each(function() {
            var subinput = '<input type="text" class="ui-intertag-subinput" />';
            var tag = '<span class="ui-tag"><span class="ui-label"></span><span class="ui-icon ui-icon-close"></span></span>';

            var input = $('<span>').addClass('ui-intertag')
            var container = $('<span>').addClass('ui-intertag-slider');

            input.append(container);

            $(this).replaceWith(input);

            var focus_handler = function() {
                var $this = $(this);
                if (!$this.hasClass('ui-autocomplete-input')) {
                    var caret = 0;
                    var last = "";
                    $this.autocomplete({
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
                            var pre_tag = $.trim(val.substring(0, caret).split(new RegExp(RegExp.escape(last) + '$', 'ig'))[0]);
                            var post_tag = $.trim(val.substring(caret, val.length));

                            $this.val(pre_tag);

                            var new_tag = $(tag);
                            new_tag.find('.ui-label').html(ui.item.label);
                            new_tag.data('value', ui.item.value);
                            new_tag.insertAfter(this);

                            var new_input = $(subinput);
                            new_input.val(post_tag);
                            new_input.insertAfter(new_tag);

                            new_input.focus();
                            new_input.caret(0,0);

                            if ($this.hasClass('ui-intertag-last')) {
                                $this.removeClass('ui-intertag-last');
                                new_input.addClass('ui-intertag-last');
                            }

                            return false;
                        },
                        focus: function(event, ui) {
                            return false;
                        }
                    })
                    
                    var size = Math.round(.8 * parseInt($this.css('fontSize')));
                    $this.css('width', size + 'px');
                    $this.autoGrowInput({comfortZone: size});

                    $this.on('keydown.intertag', function(e) {
                        if (e.which == 8) { // backspace
                            var $this = $(this);
                            if ($this.caret().end == 0 && !$this.hasClass('ui-intertag-first')) {
                                removeTag($this.prev());
                                return false;
                            }
                        } else if (e.which == 46) { // delete
                            var $this = $(this);
                            if ($this.caret().end == $this.val().length && !$this.hasClass('ui-intertag-last')) {
                                removeTag($this.next());
                                return false;
                            }
                        }
                        if (e.which == 37) { // left arrow
                            var $this = $(this);
                            if ($this.caret().end == 0 && !$this.hasClass('ui-intertag-first')) {
                                var $selected = $this.prev().prev();
                                $selected.focus();
                                var new_caret = $selected.val().length;
                                $selected.caret(new_caret, new_caret);
                                return false;
                            }
                        } else if (e.which == 39) { // right arrow
                            var $this = $(this);
                            if ($this.caret().end == $this.val().length && !$this.hasClass('ui-intertag-last')) {
                                var $selected = $this.next().next();
                                $selected.focus();
                                $selected.caret(0, 0);
                                return false;
                            }
                        }
                    })
                }
            }

            container.on('focus.intertag', 'input.ui-intertag-subinput', focus_handler);

            var removeTag = function(tag_element) {
                $tag = $(tag_element);
                var $prev = $tag.prev();
                var $next = $tag.next();

                var prev_contents = $prev.val();
                var next_contents = $next.val();
                var needs_space = (prev_contents !== "") && (next_contents !== "") && (prev_contents.substring(prev_contents.length - 1, prev_contents.length) !== " ") && (next_contents.substring(0, 1) !== " ");

                var new_contents = prev_contents + (needs_space ? " ": "") + next_contents;
                var new_caret = null;
                if ($prev.is(':focus')) {
                    new_caret = $prev.caret().end;
                } else if ($next.is(':focus')) {
                    new_caret = prev_contents.length + (needs_space ? 1 : 0) + $next.caret().end;
                }

                $prev.val(new_contents);
                if (new_caret !== null) {
                    $prev.caret(new_caret,new_caret);
                }

                if ($next.hasClass('ui-intertag-last')) {
                    $next.removeClass('ui-intertag-last');
                    $prev.addClass('ui-intertag-last');
                }

                // clean up after autogrow
                $($next.data('testSubject')).remove();

                $next.remove();

                $tag.remove();
                $prev.trigger('keydown');
            }

            container.on('click.intertag', '.ui-icon-close', function() {
                removeTag($(this).parents('.ui-tag'));
            });
            
            var initial_input = $(subinput).addClass('ui-intertag-first').addClass('ui-intertag-last');
            container.append(initial_input);
            focus_handler.call(initial_input);

            var clear = $('<div>').css('clear', 'both');
            container.append(clear);

            container.on('click.intertag', function(event) {
                if (this == event.target) {
                    var inputs = $(this).find('input');
                    var last_input = inputs.eq(inputs.length - 1);
                    last_input.focus();

                    var length = last_input.val().length;
                    last_input.caret(length, length);
                }
            });

            input.height(container.height());
        });
    }
})(jQuery);