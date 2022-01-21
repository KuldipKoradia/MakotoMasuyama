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
	});

	// got to page top js
	// $(window).on('load scroll',function(){
	// 	var	windowTop = $(window).scrollTop();
	// 	if(windowTop > 600) {
	// 		$('.pagetop').fadeIn();
	// 	} else {
	// 		$('.pagetop').fadeOut();
	// 	}
	// });
	// $('.pagetop').on('click', function (event) {
	// 	event.preventDefault();
	// 	$('body,html').animate({
	// 		scrollTop: 0,
	// 	}, 800);
	// });

	// vertical slider main JS
	// $(".vertical_slider_main").slick({
	// 	dots: true,
	// 	infinite: false,
	// 	vertical: true,
	// 	slidesToShow: 1,
	// 	slidesToScroll: 1,
	// 	nextArrow: '.slider_next',
	// 	prevArrow: false,
	// });
	// const slider = $(".vertical_slider_main");

 //    slider.slick({
 //        dots: true,
 //        infinite: false,
 //        vertical: true,
 //        slidesToShow: 1,
 //        slidesToScroll: 1,
 //        nextArrow: '<button class="slick-next slick-arrow slider_next" type="button"><i class="fas fa-arrow-down"></i></button>',
 //        prevArrow: false,
 //        verticalSwiping: true,
 //    });

 //    slider.on('wheel', (function(e) {
 //        e.preventDefault();

 //        if (e.originalEvent.deltaY < 0) {
 //            $(this).slick('slickPrev');
 //        } else {
 //            $(this).slick('slickNext');
 //        }
 //    }));

    // $(".top_btn").click(function(){
    //     slider.slick("slickGoTo", 0);
    // });

	// policy content text slider JS
	// var screen = $(window).width();
	// if(screen <= 1700){
	// 	$(".policy_content_text_slider").slick({
	// 		dots: false,
	// 		arrows: false,
	// 		infinite: false,
	// 		slidesToShow: 1,
	// 		slidesToScroll: 1
	// 	});
	// };
	$(".policy_content_text_slider").slick({
		dots: false,
		arrows: false,
		infinite: false,
		slidesToShow:3,
		slidesToScroll: 1,
		responsive: [
		{
			breakpoint: 1701,
			settings: {
				slidesToShow: 1,
				dots: true
			}
		}
		]
	});

	// action content box slider JS
	$(".action_content_box_slider").slick({
		dots: false,
		infinite: false,
		slidesToShow: 3,
		slidesToScroll: 1,
		arrows: false,
		responsive: [
		{
			breakpoint: 1166,
			settings: {
				slidesToShow: 2
			}
		},
		{
			breakpoint: 676,
			settings: {
				slidesToShow: 1
			}
		}
		]
	});
});