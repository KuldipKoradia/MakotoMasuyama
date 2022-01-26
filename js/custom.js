// on page scroll animations js
$(window).on('load',function() {
	$('.loader-wrapper').fadeOut('slow');
	$(function() {
		var observer = new IntersectionObserver(function(entries) {
			entries.forEach(function(e) {
				if (!e.isIntersecting) return;
				e.target.classList.add('move'); // 交差した時の処理
				observer.unobserve(e.target);
				// target element:
				//   e.target				ターゲット
				//   e.isIntersecting		交差しているかどうか
				//   e.intersectionRatio	交差している領域の割合
				//   e.intersectionRect		交差領域のgetBoundingClientRect()
				//   e.boundingClientRect	ターゲットのgetBoundingClientRect()
				//   e.rootBounds			ルートのgetBoundingClientRect()
				//   e.time					変更が起こったタイムスタンプ
			})
		},{
			// オプション設定
			rootMargin: '0px 0px -5% 0px' //下端から5%入ったところで発火
			//threshold: [0, 0.5, 1.0]
		});
		var target = document.querySelectorAll('.io'); //監視したい要素をNodeListで取得
		for(var i = 0; i < target.length; i++ ) {
			observer.observe(target[i]); // 要素の監視を開始
		}
		//アニメーションによる各要素のはみ出しを解消
		$("body").wrapInner("<div style='overflow:hidden;'></div>");
		// $("#id_selectbox").on("change", function() {
		// 	$(this).removeClass("holder_col").addClass("active_col");
		// });
	});
});
$(document).ready(function(){
	// navbar toggle js
	$('.navbar_toggler').click(function(){
		$('body').toggleClass('no_scroll');
		$(this).toggleClass('open_menu');
		$(this).next("nav").toggleClass('navbar_animate');
		$('.header_logo').toggleClass('open_menu');
		$('.social_icon').toggleClass('open_menu');
	});
	$('.custom_navbar_links li a').click(function(){
		$('body').removeClass('no_scroll');
		$('.navbar_toggler').removeClass('open_menu');
		$('.custom_navbar').removeClass('navbar_animate');
		$('.header_logo').removeClass('open_menu');
		$('.social_icon').removeClass('open_menu');
	});
	$(window).scroll(function(){
        var windowheight = $(window).height();
        var scrollTop = $(window).scrollTop();
        var headerheight = $('header').innerHeight();

        if(scrollTop > windowheight / 2 ){
            $(".site_header").addClass("header_animate");
        } else{
            $(".site_header").removeClass("header_animate");
        }
        if(scrollTop > headerheight){
            $(".site_header").addClass("fixed_header");
        } else{
            $(".site_header").removeClass("fixed_header");
        }
    });
	// got to page top js
	// $(window).on('load scroll',function(){
	// 	var	windowTop = $(window).scrollTop();
	// 	if(windowTop > 600) {
	// 		$('.top_btn_inner_page').fadeIn();
	// 	} else {
	// 		$('.top_btn_inner_page').fadeOut();
	// 	}
	// });
	$('.top_btn_inner_page').on('click', function (event) {
		event.preventDefault();
		$('body,html').animate({
			scrollTop: 0,
		}, 800);
	});
});