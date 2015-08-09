(function ($, window, document) {
  'use strict';

  // Main function
  $.fn.scrollUp = function (options) {

    // Ensure that only one scrollUp exists
    if (!$.data(document.body, 'scrollUp')) {
      $.data(document.body, 'scrollUp', true);
      $.fn.scrollUp.init(options);
    }
  };

  // Init
  $.fn.scrollUp.init = function (options) {

    // Define vars
    var o = $.fn.scrollUp.settings = $.extend({}, $.fn.scrollUp.defaults, options),
      triggerVisible = false,
      animIn, animOut, animSpeed, scrollDis, scrollEvent, scrollTarget, $self,scrollDefaultStyle;

    // Create element
    if (o.scrollTrigger) {
      $self = $(o.scrollTrigger);
    } else {
      $self = $('<a/>', {
        id: o.scrollName,
        href: '#top'
      });
    }

    // Set scrollTitle if there is one
    if (o.scrollTitle) {
      $self.attr('title', o.scrollTitle);
    }

    $self.appendTo('body');

    // If not using an image display text
    if (! o.scrollTrigger) {
      $self.html(o.scrollText);
    }




    // Minimum CSS to make the magic happen
    scrollDefaultStyle=$.extend({},o.scrollStyle,
      {
        display: 'none',
        position: 'fixed',
        zIndex: o.zIndex
      });

    if(typeof o.scrollPosition==="string" ){
      switch (o.scrollPosition){
        case "RM":
          scrollDefaultStyle.right="20px";
          scrollDefaultStyle.top=$(window).height()/2+"px";
          break;
        case "LM":
          scrollDefaultStyle.left="20px";
          scrollDefaultStyle.top=$(window).height()/2+"px";
          break;
        case "TL":
          scrollDefaultStyle.top="20px";
          scrollDefaultStyle.left="20px";
          break;

        case "TR":
          scrollDefaultStyle.top="20px";
          scrollDefaultStyle.right="20px";
          break;
        case "BL":
          scrollDefaultStyle.bottom="20px";
          scrollDefaultStyle.left="20px";
          break;
        case "BR":
        default :
          scrollDefaultStyle.bottom="20px";
          scrollDefaultStyle.right="20px";
          break;
      }
    }else if(!$.isEmptyObject(o.scrollPosition)){
      if($.isNumeric(o.scrollPosition.top)){
        scrollDefaultStyle.top=o.scrollPosition.top+"px";
      }
      if($.isNumeric(o.scrollPosition.bottom)){
        scrollDefaultStyle.bottom=o.scrollPosition.bottom+"px";
      }
      if($.isNumeric(o.scrollPosition.left)){
        scrollDefaultStyle.left=o.scrollPosition.left+"px";
      }
      if($.isNumeric(o.scrollPosition.right)){
        scrollDefaultStyle.right=o.scrollPosition.right+"px";
      }
    }



    $self.css(scrollDefaultStyle);


    // Active point overlay
    if (o.activeOverlay) {
      $('<div/>', {
        id: o.scrollName + '-active'
      }).css({
        position: 'absolute',
        'top': o.scrollDistance + 'px',
        width: '100%',
        borderTop: '1px dotted' + o.activeOverlay,
        zIndex: o.zIndex
      }).appendTo('body');
    }

    // Switch animation type
    switch (o.animation) {
      case 'fade':
        animIn = 'fadeIn';
        animOut = 'fadeOut';
        animSpeed = o.animationSpeed;
        break;

      case 'slide':
        animIn = 'slideDown';
        animOut = 'slideUp';
        animSpeed = o.animationSpeed;
        break;

      default:
        animIn = 'show';
        animOut = 'hide';
        animSpeed = 0;
    }

    // If from top or bottom
    if (o.scrollFrom === 'top') {
      scrollDis = o.scrollDistance;
    } else {
      scrollDis = $(document).height() - $(window).height() - o.scrollDistance;
    }

    // Scroll function
    scrollEvent = $(window).scroll(function () {
      if ($(window).scrollTop() > scrollDis) {
        if (!triggerVisible) {
          $self[animIn](animSpeed);
          triggerVisible = true;
          o.animIn()

        }
      } else {
        if (triggerVisible) {
          $self[animOut](animSpeed);
          triggerVisible = false;
          o.animOut()
        }
      }
    });

    if (o.scrollTarget) {
      if (typeof o.scrollTarget === 'number') {
        scrollTarget = o.scrollTarget;
      } else if (typeof o.scrollTarget === 'string') {
        scrollTarget = Math.floor($(o.scrollTarget).offset().top);
      }
    } else {
      scrollTarget = 0;
    }

    // To the top
    $self.click(function (e) {
      e.preventDefault();

      $('html, body').animate({
        scrollTop: scrollTarget
      }, o.scrollSpeed, o.easingType);
    });
  };

  // Defaults
  $.fn.scrollUp.defaults = {
    scrollName: 'scrollUp',      // Element ID
    scrollDistance: 300,         // Distance from top/bottom before showing element (px)
    scrollFrom: 'top',           // 'top' or 'bottom'
    scrollSpeed: 300,            // Speed back to top (ms)
    easingType: 'linear',        // Scroll to top easing (see http://easings.net/)
    animation: 'fade',           // Fade, slide, none
    animationSpeed: 200,         // Animation in speed (ms)
    scrollTrigger: false,        // Set a custom triggering element. Can be an HTML string or jQuery object
    scrollTarget: false,         // Set a custom target element for scrolling to. Can be element or number
    scrollText: 'Scroll to top', // Text for element, can contain HTML
    scrollTitle: false,          // Set a custom <a> title if required. Defaults to scrollText
    activeOverlay: false,        // Set CSS color to display scrollUp active point, e.g '#00FFFF'
    zIndex: 2147483647      ,     // Z-Index for the overlay
    scrollPosition:"RM",
    scrollStyle:{
      'background': '#555',
      'color': '#fff',
      'font-size': '12px',
      'font-family': 'sans-serif',
      'text-decoration': 'none',
      'opacity': '.9',
      'padding': '10px 10px',
      '-webkit-border-radius': '16px',
      '-moz-border-radius': '16px',
      'border-radius': '16px',
      '-webkit-transition': 'background 200ms linear',
      '-moz-transition':' background 200ms linear',
      'transition': 'background 200ms linear'
    },
    animIn:function(){},
    animOut:function(){}
  };

  // Destroy scrollUp plugin and clean all modifications to the DOM
  $.fn.scrollUp.destroy = function (scrollEvent) {
    $.removeData(document.body, 'scrollUp');
    $('#' + $.fn.scrollUp.settings.scrollName).remove();
    $('#' + $.fn.scrollUp.settings.scrollName + '-active').remove();

    // If 1.7 or above use the new .off()
    if ($.fn.jquery.split('.')[1] >= 7) {
      $(window).off('scroll', scrollEvent);

      // Else use the old .unbind()
    } else {
      $(window).unbind('scroll', scrollEvent);
    }
  };

  $.scrollUp = $.fn.scrollUp;

})(jQuery, window, document);
