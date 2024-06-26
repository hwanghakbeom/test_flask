/*global console:false */
/*
 * jQuery paged scroll  - different approach for infinite scroll
 *
 * Copyright (c) 2013 Dmitry Mogilko
 * Licensed under the MIT license.
 */

/*
 /* Finish now
 TODO  : horizontal scroll.
/* Finish later
 TODO :  qunit ,simulate scroll - http://stackoverflow.com/questions/6761659/simulate-scroll-event-using-javascript
 TODO :  think about  giving option of calculating trigger on last element of the binder,may be use waypoints plugin.
 TODO  : think about disabling scroll until targetHtml is changed or callback called.
 */
(function ($, window, document, undefined) {
    'use strict';

    /*
     Constructor
     */
    $.ajax_scroll = function (element, options) {

        this.settings = $.extend({},$.ajax_scroll.defaults, options);

        /*
         check if we have everything valid before we start
         */
        this._validate(this.settings);

        /*
         init plugin
        */
        this.timerInterval = -1;
        this.lastDocHeight = 0;
        this.proccesingCallback = false;
        this.lastScrollPosition = 0;
        this.lastHtmlLength = $(this.settings.targetElement).html().length;
        this.instanceID = "paged_scroll" + Math.round(Math.random() * 9999999999);
        var $this = this;

        /*
            create on scroll event handler
         */
        var scrollProcess = (function ($this) {
            return function () {
                if ($this.settings.useScrollOptimization) {
                    if ($this.timerInterval === -1) {
                        $this._debug("Setting timeout:", $this.settings.checkScrollChange);
                        $this.timerInterval = setTimeout(function () {
                            //$this.debug("Running after timeout:");
                            $this._checkScroll(element, $, window, document, $this.settings);
                            $this.timerInterval = -1;

                        }, $this.settings.checkScrollChange);
                    }
                    else {
                        //$this._debug('Ignore this scroll...And saving all the DOM access and calculations');
                    }

                }
                else {
                    $this._checkScroll(element, $, window, document, $this.settings);
                }
            };

        })($this);

        //bind on scroll
        $(element).on('scroll', scrollProcess);
    };

    /*
     Plugin defaults
     */
    $.ajax_scroll.defaults = {

        /*
         required
         your  callback which called which will be called with current page number
         */
        handleScroll:function (page, container, doneCallback) {
            return true;
        },

        /*
         required
         amount of pixels or amount of percent of container (calculated to pixel by plugin) from bottom, to start scroll
         */
        triggerFromBottom:'10%',

        /*
            html to show when loading
        */
        loading : {
              html:'<div style="background: none repeat scroll 0 0 #000000; border-radius: 10px 10px 10px 10px; bottom: 40px; color: #FFFFFF; left: 44%; opacity: 0.7; padding: 1%; position: relative; text-align: center; width:10%; z-index:99;"><img src="data:image/gif;base64,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" alt="Loading..."><div><em>Loading next page...</em></div></div>'
//            html  : '<div class="paged-scroll-loading"><img alt="Loading..." src="data:image/gif;base64,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" /></div>'
        },

    /*
     required
     element where content will be inserted
     */
        targetElement:null,

        /*
         optional,default is 0
         page number to start with
         */
        startPage:0,

        /*
         optional
         null means infinite scroll
         */
        pagesToScroll:null,

        /*  optional
         before page hook ,if returns false execution stops
         */
        beforePageChanged:function (page, container) {
            return true;
        },

        /*
         optional
         after page scroll callback
         */
        afterPageChanged:function (page, container) {
            return true;
        },

        /*
         optional
         NOT RECOMMENDED to CHANGE!!!
         default : true
         if scroll optimization used ,plugin will not access DOM each time scroll is triggered and will save a lot of overhead,because of not calling callback logic each time
         */
        useScrollOptimization:true,

        /*
         timeout in milliseconds to use in order to check  if scroll change is significant enough to call the "handleScroll" callback
         */
        checkScrollChange:500,

        /*
            frequency to check that target html is checked
        */
        monitorChangeInterval : 300,

        /*
         if monitor target element where finally generated content is inserted
         */
        monitorTargetChange:true,
        /*
         if use debug
         */
        debug:false
    };

    /*
     Use prototype to optimize multiple instances
     */
    $.ajax_scroll.prototype = {

        _calculateStep:function (settings) {
            return (settings.triggerFromBottom.toString().indexOf('%') > -1) ? parseFloat(settings.triggerFromBottom.replace('%', '')) : parseFloat(settings.triggerFromBottom);
        },

        _validate:function (settings) {
            var step = this._calculateStep(settings);
            if (isNaN(step)) {
                throw "Step need to be provided as number or percentage,50 or 5% fro percent for example";
            }
            if (!settings.targetElement || $(settings.targetElement).length === 0) {
                throw "Please provide the selector of target element.(Element where you finally insert the new content)";
            }

        },

        _checkCallbackDone : function(settings,loadingHtml){
            this._debug("Checking target html for change...");
            if (settings.monitorTargetChange && $(settings.targetElement).is(":visible") ) {
                var lastHtmlLength = $(settings.targetElement).html().length;
                if (lastHtmlLength !== this.lastHtmlLength) {
                    this._debug("Html is changed");
                    this.lastHtmlLength = lastHtmlLength;
                    this.proccesingCallback = false;
                    $(loadingHtml).hide();
                }
                else{
                    var $this = this;
                    this._debug("Html is not changed.Check later");
                    setTimeout(function(){$this._checkCallbackDone.call($this,$this.settings,loadingHtml);},$this.settings.monitorChangeInterval);
                }

            }
        },

        _getScrollData:function ($, element, window, document, $this, settings) {
            var elemHeight = parseFloat($(element).height()) , elemScroll = parseFloat($(element).scrollTop()),
                isWindow = (element.self === window) , docHeight = isWindow ? parseFloat($(document).height()) : elemHeight,
                step = docHeight / $this._calculateStep(settings);
            return {elemHeight:elemHeight, elemScroll:elemScroll, isWindow:isWindow, docHeight:docHeight, step:step};
        },

        /*
            plugin logic which check if we need to call the callback
        */
        _checkScroll:function (element, $, window, document, settings) {
            this._debug("Checking scroll on  : " + this.instanceID);
            var $this = this;
            //if element on which content is inserted became not visible don't do exit
            if (settings.targetElement && !$(settings.targetElement).is(":visible")) {
                $this._debug("Ignoring the call because target element is not  visible.Exit scroll check ..");
                return;
            }

            /*
                check if callback is still in process
             */
            if ($this.proccesingCallback) {
                $this._debug("Processing callback.Exit...");
                return;
            }


            /*
                get all scroll data in order to understand if we at requested scroll point
            */
            var scrollData = $this._getScrollData($, element, window, document, $this, settings);
            var elemHeight = scrollData.elemHeight;
            var elemScroll = scrollData.elemScroll;
            var isWindow = scrollData.isWindow;
            var docHeight = scrollData.docHeight;
            var step = scrollData.step;

            $this._debug(["Elem height : ", elemHeight, ".Elem scroll :", elemScroll, ".Step is :", step, ".DocHeight :", docHeight, ".Last element height:", $this.lastDocHeight].join(""));
             /*
                calculate  window height + scroll  + step
             */
            var position = isWindow ? elemHeight + elemScroll + step : elemScroll + step;
            $this._debug("Position:" + position + ".Last position:" + $this.lastScrollPosition + ".Last element height:" + $this.lastDocHeight);
            var isPos = (position > $this.lastScrollPosition);
            /*
             understand if we have infinite pages number to scroll and if not, understand we are still not scrolled maximum o page requested.
             */
            var isPageMax = !settings.pagesToScroll || (settings.pagesToScroll && (settings.startPage < settings.pagesToScroll));


            /*
             check that we are at the requested scroll position
             */
            if (position >= docHeight) {
                /*
                 don't handle scrolling back to top and also check if we got to maximum pages to scroll
                 */
                if (isPos && isPageMax) {
                    this.lastScrollPosition = position;
                    this.lastDocHeight = docHeight;
                    settings.startPage = settings.startPage + 1;
                    settings.beforePageChanged(settings.startPage, element);
                    $this._debug("Calling 'handleScroll' callback");
                    $this.proccesingCallback = true;
                    var loadingHtml = $($this.settings.loading.html).appendTo($($this.settings.targetElement));
                    $this.lastHtmlLength = $(settings.targetElement).html().length;
                    settings.handleScroll(settings.startPage, element, function () {
                        $this._debug("Callback done.");
                        $this.proccesingCallback = false;
                        loadingHtml.hide();
                    });

                    $this._checkCallbackDone.call($this, $this.settings, loadingHtml);
                    settings.afterPageChanged(settings.startPage, element);


                }

            }
        }, ///check scroll

        /*
         borrowed from  paul irish infinite scroll : hhttps://github.com/paulirish/infinite-scroll - make use of console safe
         */
        _debug:function () {
            try
            {


            if (!this.settings.debug) {
                return;
            }

            if (typeof console !== 'undefined' && typeof console.log === 'function') {
                // Modern browsers
                // Single argument, which is a string
                if ((Array.prototype.slice.call(arguments)).length === 1 && typeof Array.prototype.slice.call(arguments)[0] === 'string') {
                    console.log((Array.prototype.slice.call(arguments)).toString());
                } else {
                    console.log(Array.prototype.slice.call(arguments));
                }
            } else if (!Function.prototype.bind && typeof console !== 'undefined' && typeof console.log === 'object') {
                // IE8
                Function.prototype.call.call(console.log, console, Array.prototype.slice.call(arguments));
            }
        }
        catch(e){

        }


        }



    };

    /*
     create scroll instances
     */
    $.fn.paged_scroll = function (options) {
        return this.each(function () {
            var instance = new $.ajax_scroll(this, options);
            $.data(this, 'jqueryPagedScroll', instance);
        });
    };


}(jQuery, window, document));