jQuery(document).ready(function(){

  var homeSwiper = new Swiper('.swiper-home-container', {
    speed: 600,
    loop:true,
    pagination: {
        el: '.swiper-home-pagination',
        clickable: true,
      },
  });
  var wrapSwiperOption = {
    autoHeight: true,
    loop:true,
    simulateTouch: true,
    hashNavigation: {
      watchState: true,
    },
    on: {
      init: function(){
        setTimeout(function(){
          var idx = wrapSwiper.realIndex;
          if (idx <= 0) {
            idx = 0;
          }
          $('.navigation-mobile-button').removeClass('active').eq(idx).addClass('active')
          $('.wrap-delivery').css('min-height',$(window).height());
        }, 10)
      }
    }
  };

  if ( $(window).width() > 768) {
    wrapSwiperOption.simulateTouch = false;
  }
  //var wrapSwiper = new Swiper('.swiper-wrap-container',wrapSwiperOption);

/*
  $(window).resize(function(){
    if ( $(window).width() > 768) {
      wrapSwiperOption.simulateTouch = false;
      wrapSwiper.destroy(true,true)
      wrapSwiper = new Swiper('.swiper-wrap-container',wrapSwiperOption);
    } else {
      wrapSwiperOption.simulateTouch = true;
      wrapSwiper.destroy(true,true)
      wrapSwiper = new Swiper('.swiper-wrap-container',wrapSwiperOption);
    }
  })
*/


/*
  wrapSwiper.on('slideChange', function () {
    var idx = wrapSwiper.realIndex;
    if (idx <= 0) {
      idx = 0;
    }
    $('.navigation-mobile-button').removeClass('active').eq(idx).addClass('active')
    $('html, body').scrollTop(0);
    $('.wrap-delivery').css('min-height',$(window).height());
  });
*/




  // var wrapSwiper = undefined;
  // function initSwiper() {
  //     var screenWidth = $(window).width();
  //     if(screenWidth < 768 && wrapSwiper == undefined) {
  //         wrapSwiper = new Swiper('.swiper-wrap-container',{
  //           autoHeight: true,
  //           loop:true,
  //           hashNavigation: {
  //             watchState: true,
  //           },
  //         });
  //
  //         $('.navigation-mobile-button').on('click',function() {
  //           var idx = $(this).attr('data-slide-idx');
  //           wrapSwiper.slideTo(idx, 600);
  //         });
  //
  //         wrapSwiper.on('slideChange', function () {
  //           var idx = wrapSwiper.realIndex;
  //           if (idx <= 0) {
  //             idx = 0;
  //           }
  //           $('.navigation-mobile-button').removeClass('active').eq(idx).addClass('active')
  //           $('html, body').scrollTop(0);
  //         });
  //
  //
  //     } else if (screenWidth > 768 && wrapSwiper != undefined) {
  //         wrapSwiper.destroy(true,true);
  //         wrapSwiper = undefined;
  //         jQuery('.swiper-wrapper').removeAttr('style');
  //         jQuery('.swiper-slide').removeAttr('style');
  //
  //         $('.navigation-mobile-button').unbind('click');
  //     }
  // }
  //
  //   initSwiper();
  //
  //   $(window).on('resize', function(){
  //       initSwiper();
  //   });

})
