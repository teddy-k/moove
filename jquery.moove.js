/*global jQuery */
/*!
 * moove.js 0.1
 *
 * Copyright 2014, Teddy Kishi http://teddyk.be
 * Released under the WTFPL license
 * http://sam.zoy.org/wtfpl/
 *
 * Date: Wed Jul 02 14:23:00 2014 -0600
 * You can use it to trigger animate.css animations. But you can easily change the settings to your favorite animation library.
 */
(function ($) {
    $.fn.moove = function (animationName, options) {
        var self = this;

        if (options && typeof options == "object") {
            options = options;
        } else {
            options = {};
        }

        if (animationName && typeof animationName == "string") {
            options.animName = animationName;
        } else if (animationName && animationName instanceof Array) {
            options.animNames = animationName;
        }

        // This is the easiest way to have default options.
        var animate,
            settings = $.extend({
                // These are the defaults.
                animName: "",
                animClass: "animated",
                stagger: false,
                animNames: false,
                onStart: function () {},
                onEnd: function () {}
            }, options),
            animateSingle = function () {
                if (settings.stagger) {
                    self.each(function (k, v) {
                        $(this).delay(k * settings.stagger).queue(function () {
                            settings.onStart($(this));
                            $(this).removeClass(settings.animName).addClass(settings.animClass + " " + settings.animName).dequeue();
                        });
                    });
                } else {
                    settings.onStart($(this));
                    self.removeClass(settings.animName).addClass(settings.animClass + " " + settings.animName);
                }

                self.on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                    $(this).removeClass(settings.animClass).removeClass(settings.animName)
                    settings.onEnd($(this));
                });
            },
            animateArray = function () {
                if (settings.stagger) {
                    self.each(function (k, v) {
                        $(this).delay(k * settings.stagger).queue(function () {
                            settings.onStart($(this));
                            var currentAnimationName = settings.animNames[k] || settings.animNames[0];
                            $(this).removeClass(currentAnimationName).addClass(settings.animClass + " " + currentAnimationName).dequeue();
                        });
                    });
                } else {
                    self.each(function (k, v) {
                        settings.onStart($(this));
                        var currentAnimationName = settings.animNames[k] || settings.animNames[0];
                        $(this).removeClass(currentAnimationName).addClass(settings.animClass + " " + currentAnimationName);
                    })
                }

                self.each(function (k, v) {
                    $(this).on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                        var currentAnimationName = settings.animNames[k] || settings.animNames[0];
                        $(this).removeClass(settings.animClass).removeClass(currentAnimationName);
                        settings.onEnd($(this));
                    });
                })

            }

        if (settings.animNames) {
            animate = animateArray;
        } else {
            animate = animateSingle;
        }

        if (settings.delay && typeof settings.delay == "number") {
            setTimeout(animate, settings.delay);
        } else {
            animate();
        }

        return self;
    };

}(jQuery));