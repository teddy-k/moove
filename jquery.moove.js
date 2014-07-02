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
                            $(this).removeClass(settings.animName).addClass(settings.animClass + " " + settings.animName).dequeue();
                            settings.onStart.call(this, $(this));
                        });
                    });
                } else {
                    self.each(function (k, v) {
                        $(this).removeClass(settings.animName).addClass(settings.animClass + " " + settings.animName);
                        settings.onStart.call(this, $(this));
                    })
                }

                self.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                    $(this).removeClass(settings.animClass).removeClass(settings.animName);
                    settings.onEnd.call(this, $(this));
                });
            },
            animateArray = function () {
                if (settings.stagger) {
                    self.each(function (k, v) {
                        $(this).delay(k * settings.stagger).queue(function () {
                            var currentAnimationName = settings.animNames[k] || settings.animNames[0];
                            $(this).removeClass(currentAnimationName).addClass(settings.animClass + " " + currentAnimationName).dequeue();
                            settings.onStart.call(this, $(this));
                        });
                    });
                } else {
                    self.each(function (k, v) {
                        var currentAnimationName = settings.animNames[k] || settings.animNames[0];
                        $(this).removeClass(currentAnimationName).addClass(settings.animClass + " " + currentAnimationName);
                        settings.onStart.call(this, $(this));
                    })
                }

                self.each(function (k, v) {
                    $(this).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                        var currentAnimationName = settings.animNames[k] || settings.animNames[0];
                        $(this).removeClass(settings.animClass).removeClass(currentAnimationName);
                        settings.onEnd.call(this, $(this));
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