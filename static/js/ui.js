$(window).scroll(function() 
{
	var position_btn = $(".btn-scroll-top").offset().top || 0;
	var position_footer = $(".footer").offset().top || 0;
	
	if( position_btn > (position_footer - 160)) 
	{
		if (  $(".btn-scroll-top a").css('bottom') === '10px') {
			$(".btn-scroll-top a ").css('bottom','240px');
		}
	}
	else {
		$(".btn-scroll-top a ").css('bottom','10px');
	}
});

/*
$('.navigation-mobile-button').on('click',function() {
	var href = '';
	var idx = $(this).attr('data-slide-idx');
	console.log(idx);
	switch(idx)
	{
		case '1': href = '/main'; break;
		case '2': href = '/order'; break;
		case '3': href = '/pigup'; break;
		case '4': href = '/customer'; break;
		case '5': href = '/photo'; break;
		case '6': href = '/themore'; break;
	}
	//console.log(href);
	window.location.href = href;
	//wrapSwiper.slideTo(idx, 600);
});
*/