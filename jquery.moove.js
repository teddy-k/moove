/*global jQuery */
/*!
 * moove.js 0.3
 *
 * Copyright 2015, Teddy Kishi http://teddyk.be
 * Released under the WTFPL license
 * http://sam.zoy.org/wtfpl/
 *
 * Date: Wed Jul 02 14:23:00 2014 -0600
 * You can use it to trigger animate.css animations. But you can easily change the settings to your favorite animation library.
 */
!(function ($, window) {

    $.fn.mooveQueue = $.fn.mooveQueue || [];

    $.fn.moove = function () {
        //animationName, options
        var self = this, i, options = options || {},
            animations = [
            'bounce','flash','pulse','rubberBand','shake','swing','tada','wobble','jello',
            'bounceIn','bounceInDown','bounceInLeft','bounceInRight','bounceInUp','bounceOut','bounceOutDown','bounceOutLeft','bounceOutRight','bounceOutUp',
            'fadeIn','fadeInDown','fadeInDownBig','fadeInLeft','fadeInLeftBig','fadeInRight','fadeInRightBig','fadeInUp','fadeInUpBig',
            'fadeOut','fadeOutDown','fadeOutDownBig','fadeOutLeft','fadeOutLeftBig','fadeOutRight','fadeOutRightBig','fadeOutUp','fadeOutUpBig',
            'flipInX','flipInY','flipOutX','flipOutY',
            'lightSpeedIn','lightSpeedOut',
            'hinge','rotateIn','rotateInDownLeft','rotateInDownRight','rotateInUpLeft','rotateInUpRight','rotateOut','rotateOutDownLeft','rotateOutDownRight','rotateOutUpLeft','rotateOutUpRight',
            'rollIn','rollOut',
            'zoomIn','zoomInDown','zoomInLeft','zoomInRight','zoomInUp','zoomOut','zoomOutDown','zoomOutLeft','zoomOutRight','zoomOutUp',
            'slideInDown','slideInLeft','slideInRight','slideInUp','slideOutDown','slideOutLeft','slideOutRight','slideOutUp'
        ];

        // a animation string is given
        if(arguments.length == 1 && typeof arguments[0] == 'string'){
            options.animName = arguments[0];
            if(arguments[0] == 'random'){
                options.animName = animations[Math.floor(Math.random() * animations.length)];
            }
        } 
        // multiples animations inside an array
        else if(arguments.length == 1 && arguments[0] instanceof Array) { 
            //check if an random animation has been set
            i = 0;
            while(i < arguments[0].length){
                if(arguments[0][i] == 'random'){
                    arguments[0][i] = animations[Math.floor(Math.random() * animations.length)]
                }
                i++;
            }
            options.animNames = arguments[0];
        } 
        // an object setting is given
        else if(arguments.length == 1 && typeof arguments[0] == 'object'){
            options = arguments[0];
        }
        // a string animation and an object setting is given
        else if( arguments.length == 2 && typeof arguments[0] == 'string' && typeof arguments[1] == 'object'){
            options = arguments[1];
            options.animName = arguments[0];
        }
        // an array animation and an object setting is given
        else if( arguments.length == 2 && arguments[0] instanceof Array && typeof arguments[1] == 'object'){
            options = arguments[1];
            options.animNames = arguments[0];
        }       

        /*
        animation speed
        -webkit-animation-duration: 1s;
                animation-duration: 1s;
        */

        // This is the easiest way to have default options.
        var animate, i,
            count = 0,
            settings = $.extend({
                // These are the defaults.
                animName: '',
                animClass: "animated",
                queue : false,
                stagger: false,
                animNames: false,
                delay : false,
                onStart: function () {},
                onEnd: function () {}
            }, options),

            animateSingle = function () {
                
                if (settings.stagger) {
                    self.each(function (k, v) {
                        $(this).delay(k * settings.stagger).queue(function () {
                            $(this).removeClass(settings.animName).addClass(settings.animClass + ' ' + settings.animName).dequeue();
                            settings.onStart.call(this, $(this));
                        });
                    });
                } else {
                    self.each(function (k, v) {
                        $(this).removeClass(settings.animName).addClass(settings.animClass + ' ' + settings.animName);
                        settings.onStart.call(this, $(this));
                    })
                }

                self.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                    $(this).removeClass(settings.animClass).removeClass(settings.animName);
                    settings.onEnd.call(this, $(this));

                    if(settings.queue){
                        if(count == self.length-1){
                            //find where id
                            $.fn.mooveQueue.splice(0, 1);

                            if($.fn.mooveQueue[0] && !$.fn.mooveQueue[0].animating){
                                $.fn.mooveQueue[0].action();
                                $.fn.mooveQueue[0].animating = true;
                            }
                        }
                    }
                    count++;
                });
            },

            animateArray = function () {
                var currentAnimationName, endpos = pos = 0;
                if (settings.stagger) {
                    self.each(function (k, v) {
                        $(this).delay(k * settings.stagger).queue(function () {
                            if( !settings.animNames[pos] ){
                                pos = 0;
                            }
                            currentAnimationName = settings.animNames[pos]; // || settings.animNames[0];
                            $(this).removeClass(currentAnimationName).addClass(settings.animClass + ' ' + currentAnimationName).dequeue();
                            settings.onStart.call(this, $(this));
                            
                            pos++;
                        });
                    });
                } else {
                    self.each(function (k, v) {
                        if( !settings.animNames[pos] ){
                            pos = 0;
                        }
                        currentAnimationName = settings.animNames[pos]; // || settings.animNames[0];
                        $(this).removeClass(currentAnimationName).addClass(settings.animClass + ' ' + currentAnimationName);
                        settings.onStart.call(this, $(this));
                        pos++;
                    })
                }

                self.each(function (k, v) {
                    $(this).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                        if( !settings.animNames[endpos] ){
                            endpos = 0;
                        }
                        currentAnimationName = settings.animNames[endpos];// || settings.animNames[0];
                        $(this).removeClass(settings.animClass).removeClass(currentAnimationName);
                        settings.onEnd.call(this, $(this));
                        endpos++;
                    });
                })
            },

            myAnim = {
                animating : false,
                action : function(){
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
                }
            }

        if(settings.queue){
            $.fn.mooveQueue.push(myAnim);
            if(!$.fn.mooveQueue[0].animating){
                $.fn.mooveQueue[0].action();
                $.fn.mooveQueue[0].animating = true;
            }
        } else {
            myAnim.action();
        }

        return self;
    };

}(jQuery, window));