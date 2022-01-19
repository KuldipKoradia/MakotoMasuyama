

/* main
----------------------------------------------- */

const wheelevent	= "onwheel" in document ? "wheel":"onmousewheel" in document ? "mousewheel":"DOMMouseScroll";
const useragent		= window.navigator.userAgent;
const is_iphone		= (useragent.match(/iPhone/i)) ? true:false;
const is_ipad			= (useragent.match(/iPad|Macintosh/i) && "ontouchend" in document) ? true:false;
const is_android	= (useragent.match(/Android/i)) ? true:false;
const is_touch		= (useragent.match(/(iPhone|iPod|iPad|Android)/i) || "ontouchend" in document) ? true:false;
const is_windows	= (useragent.match(/(Windows)/i)) ? true:false;
const breakpoint	= 768;
const breakpointMenu 	= 1000;

jsbody = document.getElementsByTagName("body")[0];
jsloading = document.getElementsByClassName("js-loading")[0];
jsheader = document.getElementsByClassName("js-header")[0];
jsfooter = document.getElementsByClassName("js-footer")[0];
jsmenu = document.getElementsByClassName("js-menu")[0];
jsnav = document.getElementsByClassName("js-nav")[0];
jspageup = document.getElementsByClassName("js-pageup")[0];

// aformformat

aformformat = document.getElementsByClassName("aformformat")[0];


/* scroll
----------------------------------------------- */

var scroll = {
	ready:function() {

		scroll.params = new Array();
		scroll.flag = true;
		scroll.top = 0;

		window.addEventListener("scroll", scroll.start, { passive:true });

		scroll.start();

	},
	start:function() {

		if (scroll.flag) {
			requestAnimationFrame(scroll.end);
		}

		scroll.flag = false;

	},
	end:function() {

		scroll.top = document.documentElement.scrollTop || document.body.scrollTop;

		for (let i in scroll.params) {
			scroll.params[i]();
		}

		scroll.flag = true;

		// hover action

		if (!aformformat) {

			clearTimeout(scroll.timeout);

			if (!jsbody.classList.contains("jsbody--disable")) {

				jsbody.classList.add("jsbody--disable");

			}

			scroll.timeout = setTimeout(function() {

				jsbody.classList.remove("jsbody--disable");

			}, 250);

		}

	}
};


/* resize
----------------------------------------------- */

var resize = {
	ready:function() {

		resize.params = new Array();
		resize.flag = true;
		resize.body = document.body.clientHeight;
		resize.width = window.innerWidth;
		resize.height = window.innerHeight;

		window.addEventListener("resize", resize.start, false);
		window.addEventListener("orientationchange", resize.orientation, false);

	},
	start:function(event) {

		clearInterval(resize.interval);

		resize.interval = setInterval(resize.end, 50);

	},
	end:function(event) {

		clearInterval(resize.interval);

		if ((is_touch && resize.width != window.innerWidth) || !is_touch) {

			resize.body = document.body.clientHeight;
			resize.width = window.innerWidth;
			resize.height = window.innerHeight;

			for (let i in resize.params) {
				resize.params[i]();
			}

		}

	},
	orientation:function() {

		console.log("resize orientation");

		setTimeout(function() {

			resize.body = document.body.clientHeight;
			resize.width = window.innerWidth;
			resize.height = window.innerHeight;

			for (let i in resize.params) {
				resize.params[i]();
			}

		}, 250);

	}
}


/* anchor
----------------------------------------------- */

var anchor = {
	ready:function() {

		let elements = document.getElementsByClassName("js-anchor");
		let elements_length = elements.length;

		for (let i = 0; i < elements_length; i++) {
			elements[i].addEventListener("click", anchor.click, false);
		}

	},
	start:function() {

		let hash = window.location.hash;

		if (hash) {

			$("html,body").stop().animate({ scrollTop:0 }, 0);

			setTimeout(function() {
				anchor.open(hash, 1000);
			}, 500);

		}

	},
	click:function(event) {

		let hash = this.getAttribute("href");

		anchor.open(hash, 1000);

		event.preventDefault();

	},
	open:function(hash, speed) {

		let pagetop = window.pageYOffset || document.documentElement.scrollTop;
		let elem = document.getElementById(hash.split("#")[1]);

		if (elem) {

			let rect = elem.getBoundingClientRect();
			let offset = rect.top + pagetop;

			offset -= jsheader.clientHeight;

			$("html,body").stop().animate({ scrollTop:offset }, speed, "easeInOutQuart");

		}

	}
};


/* srcswap
----------------------------------------------- */

var srcswap = {
	ready:function() {

		srcswap.params = new Array();

		let elements = document.getElementsByClassName("js-srcswap");
		let elements_length = elements.length;

		for (let i = 0; i < elements_length; i++) {
			srcswap.params.push(elements[i]);
		}

		resize.params.srcswap = srcswap.resize;

		srcswap.resize();

	},
	resize:function() {

		for (let i in srcswap.params) {

			let elem = srcswap.params[i];
			let src = elem.src;
			let srcset = elem.getAttribute("srcset");

			if (window.innerWidth >= breakpoint) {

				src = src.replace(/_sp/g, "_pc");

				if (srcset) srcset = srcset.replace(/_sp/g, "_pc");

			}
			else {

				src = src.replace(/_pc/g, "_sp");

				if (srcset) srcset = srcset.replace(/_pc/g, "_sp");

			}

			elem.src = src;

			if (srcset) elem.setAttribute("srcset", srcset);

		}

	}
};


/* indicate
----------------------------------------------- */

var indicate = {
	ready:function() {

		let elements = document.getElementsByClassName("js-indicate");

		indicate.pramas = new Array();
		indicate.total = elements.length;
		indicate.count = 0;

		for (let i = 0; i < indicate.total; i++) {

			let elem = elements[i];

			elem.classList.add("js-indicate-ready");

			indicate.pramas.push({ flag:true, elem:elem });

		}

	},
	// 途中で増えたらaddして。
	add : function(elem) {
		elem.classList.add("js-indicate-ready");
		indicate.pramas.push({ flag:true, elem:elem });
		indicate.resize();
	},
	start:function() {

		if (indicate.total > 0) {

			resize.params.indicate = indicate.resize;
			scroll.params.indicate = indicate.scroll;

			indicate.resize();
			indicate.scroll();

		}

	},
	resize:function() {

		let pagetop = window.pageYOffset || document.documentElement.scrollTop;

		for (let i in indicate.pramas) {

			let elem = indicate.pramas[i].elem;
			let rect = elem.getBoundingClientRect();
			let offset = rect.top + pagetop;
			let height = elem.clientHeight;
			let margin = Math.min(100, height);

			indicate.pramas[i].offset = offset;
			indicate.pramas[i].height = height;
			indicate.pramas[i].margin = margin;

		}

		indicate.trigger = 0;

	},
	scroll:function() {

		let scrolltop = scroll.top + window.innerHeight;

		for (let i in indicate.pramas) {

			let flag = indicate.pramas[i].flag;
			let elem = indicate.pramas[i].elem;
			let offset = indicate.pramas[i].offset;
			let height = indicate.pramas[i].height;
			let margin = Math.min(indicate.trigger, height);

			if (flag && scrolltop >= offset + margin) {

				//elem.firstElementChild.style.willChange = "opacity, transform";

				elem.classList.add("js-indicate-start");

				setTimeout(function() {

					elem.classList.add("js-indicate-end");

					setTimeout(function() {

						elem.classList.add("js-indicate-complete");

						/*
						setTimeout(function() {

							elem.firstElementChild.style.willChange = "unset";

						}, 500);
						*/

					}, 850);

				}, 850);

				indicate.pramas[i].flag = false;

				// 巻き戻し停止

				indicate.count++;

				if (indicate.count >= indicate.total) {
// addで増えることを考慮すると、deleteしてはいけない
//					delete resize.params.indicate;
//					delete scroll.params.indicate;
				}

			}

		}

	}
}


/* parallax
----------------------------------------------- */

var parallax = {
	ready:function() {

		let elements = document.getElementsByClassName("js-parallax");

		parallax.pramas = new Array();
		parallax.total = elements.length;
		parallax.count = 0;

		for (let i = 0; i < parallax.total; i++) {

			let elem = elements[i];

			elem.style.opacity = 0;
			elem.style.transform = "translateZ(0)";
			elem.style.transition = "opacity 0.25s";
			elem.firstElementChild.style.willChange = "transform";

			parallax.pramas.push({ elem:elem });

		}

	},
	start:function() {

		if (parallax.total > 0) {

			resize.params.parallax = parallax.resize;
			scroll.params.parallax = parallax.scroll;

			parallax.resize();
			parallax.scroll();

		}

	},
	resize:function() {

		let pagetop = window.pageYOffset || document.documentElement.scrollTop;

		for (let i in parallax.pramas) {

			let elem = parallax.pramas[i].elem;
			let rect = elem.getBoundingClientRect();
			let offset = rect.top + pagetop;
			let height = elem.clientHeight;
			let move = height / 3;

			parallax.pramas[i].offset = offset;
			parallax.pramas[i].height = height;
			parallax.pramas[i].move = move;

			elem.style.opacity = 1;

		}

		parallax.scroll();

	},
	scroll:function() {

		let scrolltop = scroll.top + window.innerHeight;

		for (let i in parallax.pramas) {

			let elem = parallax.pramas[i].elem;
			let offset = parallax.pramas[i].offset;
			let height = parallax.pramas[i].height;
			let move = parallax.pramas[i].move;

			let percent = (scrolltop - offset) / (height + window.innerHeight) * 100;
			let position = move / 100 * percent;

			if (percent > -50 && percent < 150) {
				elem.firstElementChild.style.transform = "translateY(" + (position - (move / 2)) + "px)";
			}

		}

	}
}


/* bodyfix
----------------------------------------------- */

var bodyfix = {
	ready:function() {

		bodyfix.html = document.getElementsByTagName("html")[0];
		bodyfix.body = document.getElementsByTagName("body")[0];
		bodyfix.flag = true;

	},
	lock:function() {

		if (bodyfix.flag) {

			bodyfix.offset = window.scrollY || window.pageYOffset;

			bodyfix.html.style.height = window.innerHeight + "px";
			bodyfix.body.style.height = window.innerHeight + "px";
			bodyfix.body.style.position = "fixed";
			bodyfix.body.style.top = -bodyfix.offset + "px";
			// bodyfix.body.style.left = 0;
			// bodyfix.body.style.right = 0;
			// bodyfix.body.style.bottom = 0;
			bodyfix.body.style.zIndex = 1;

			bodyfix.flag = false;

		}

	},
	unlock:function() {

		if (!bodyfix.flag) {

			bodyfix.body.style.position = "static";
			bodyfix.html.style.height = "auto";
			bodyfix.body.style.height = "auto";

			window.scrollTo(0, bodyfix.offset);

			bodyfix.flag = true;

		}

	}
};


/* menu
----------------------------------------------- */

var menu = {
	ready:function() {

		menu.flag = true;

		jsmenu.classList.add("js-menu-ready");
		jsnav.classList.add("js-nav-ready");

		jsmenu.addEventListener("click", menu.open, false);

		resize.params.menu = menu.resize;
		scroll.params.menu = menu.scroll;

		menu.resize();

	},
	start:function() {

		jsnav.classList.add("js-nav-start");

	},
	resize:function() {

		let elements = jsnav.getElementsByClassName("nav__list");
		let length = elements.length;

		for (let i = 0; i < length; i++) {

			let elem = elements[i];
			let openner = elem.querySelector(".nav__opener");

			if (resize.width >= breakpointMenu) {

				if (openner) {

					elem.addEventListener("mouseenter", menu.enter, false);
					elem.addEventListener("mouseleave", menu.leave, false);

					elem.querySelector(".nav__megamenu").style.display = "block";

					scroll.params.menu = menu.scroll;

					bodyfix.unlock();

				}

			}
			else {

				if (openner) {

					menu.close();

					openner.elem = elem;

					openner.addEventListener("click", menu.slidedown, false);

					elem.removeEventListener("mouseenter", menu.enter, false);
					elem.removeEventListener("mouseleave", menu.leave, false);

					$(elem).find(".nav__megamenu").stop().slideUp(0);

				}

			}

		}

		menu.scroll();

	},
	enter:function() {

		jsheader.classList.add("header--hover");
		jsnav.classList.add("nav--hover");

	},
	leave:function() {

		jsheader.classList.remove("header--hover");
		jsnav.classList.remove("nav--hover");

	},
	open:function() {

		clearTimeout(menu.timeout);

		if (jsbody.classList.contains("js-negative")) {

			jsbody.classList.add("js-negative-off");
			jsbody.classList.remove("js-negative");

		}

		jsmenu.removeEventListener("click", menu.open, false);
		jsmenu.addEventListener("click", menu.close, false);

		jsmenu.classList.add("js-menu-open");
		jsnav.classList.add("js-nav-open");

		delete scroll.params.menu;

		menu.timeout = setTimeout(bodyfix.lock, 500);

	},
	close:function() {

		if (jsbody.classList.contains("js-negative-off") && scroll.top < 100) {

			jsbody.classList.remove("js-negative-off");
			jsbody.classList.add("js-negative");

		}

		setTimeout(function() {
			$(jsnav).find(".nav__megamenu").stop().slideUp(500, "easeInOutCubic");
			$(jsnav).find(".nav__opener").removeClass("nav__opener--open");
			$(jsnav).find(".nav__opener").off("click").on("click", menu.slidedown);
			$(jsnav).find(".nav__outer").stop().animate({ scrollTop:0 }, 0);
		}, 500);

		jsmenu.addEventListener("click", menu.open, false);
		jsmenu.removeEventListener("click", menu.close, false);

		jsmenu.classList.remove("js-menu-open");
		jsnav.classList.remove("js-nav-open");

		scroll.params.menu = menu.scroll;

		bodyfix.unlock();

	},
	slidedown:function() {

		$(jsnav).find(".nav__megamenu").stop().slideUp(500, "easeInOutCubic");
		$(jsnav).find(".nav__opener").removeClass("nav__opener--open");
		$(jsnav).find(".nav__opener").off("click").on("click", menu.slidedown);

		$(this.elem).find(".nav__megamenu").stop().slideDown(500, "easeInOutCubic");
		$(this).addClass("nav__opener--open");

		this.removeEventListener("click", menu.slidedown, false);
		this.addEventListener("click", menu.slideup, false);

	},
	slideup:function() {

		$(this.elem).find(".nav__megamenu").stop().slideUp(500, "easeInOutCubic");
		$(this).removeClass("nav__opener--open");

		this.addEventListener("click", menu.slidedown, false);
		this.removeEventListener("click", menu.slideup, false);

	},
	scroll:function() {

		if (jsbody.classList.contains("js-negative") && scroll.top >= 200) {

			jsbody.classList.add("js-negative-off");
			jsbody.classList.remove("js-negative");

			menu.flag = false;

		}
		else if (jsbody.classList.contains("js-negative-off") && scroll.top < 200) {

			jsbody.classList.remove("js-negative-off");
			jsbody.classList.add("js-negative");

			menu.flag = true;

		}

	}
};


/* pageup
----------------------------------------------- */

var pageup = {
	ready:function() {

		pageup.flag = true;

		jspageup.classList.add("js-pageup-ready");

	},
	start:function() {

		jspageup.addEventListener("click", pageup.up, false);

		resize.params.pageup = pageup.resize;
		scroll.params.pageup = pageup.scroll;

		pageup.resize();

	},
	resize:function() {

		let pagetop = window.pageYOffset || document.documentElement.scrollTop;
		let rect = jsfooter.getBoundingClientRect();

		pageup.offset = rect.top + pagetop;

		pageup.offset += 80;

		pageup.scroll();

	},
	scroll:function() {

		let scrolltop = scroll.top + window.innerHeight;

		if (scroll.top >= window.innerHeight) {

			jspageup.classList.add("js-pageup-start");

		}
		else if (scroll.top < window.innerHeight) {

			jspageup.classList.remove("js-pageup-start");

		}

		if (pageup.flag && scrolltop >= pageup.offset) {

			jspageup.classList.add("js-pageup-fixed");

			pageup.flag = false;

		}
		else if (!pageup.flag && scrolltop < pageup.offset) {

			jspageup.classList.remove("js-pageup-fixed");

			pageup.flag = true;

		}

	},
	up:function() {

		$("html,body").stop().animate({ scrollTop:0 }, 1250, "easeInOutQuint");

	}
};


/* relatedslider
----------------------------------------------- */

var relatedslider = {
	ready:function() {

		resize.params.relatedslider = relatedslider.resize;

		relatedslider.resize();

	},
	resize:function() {

		let elements = document.getElementsByClassName("js-relatedslider");
		let length = elements.length;

		for (let i = 0; i < length; i++) {

			let elem = elements[i];
			let slider = elem.querySelector(".related__lists");

			if (slider.className.indexOf("slick-initialized") > -1) {
				$(slider).slick("unslick");
			}

			if (window.innerWidth < breakpoint) {

				let slickelem = $(slider).slick({
					infinite: true,
					autoplay: false,
					speed: 500,
					fade: false,
					cssEase: "cubic-bezier(0.33, 1, 0.68, 1)",
					centerMode: true,
					variableWidth: false,
					arrows: false,
					dots: false,
					slidesToShow: 1,
				});
			}
			else if (window.innerWidth < breakpointMenu) {
				let slickelem = $(slider).slick({
				  infinite: true,
				  autoplay: false,
				  speed: 500,
				  fade: false,
				  cssEase: "cubic-bezier(0.33, 1, 0.68, 1)",
				  centerMode: true,
				  variableWidth: false,
				  arrows: false,
				  dots: false,
				  slidesToShow: 2,
				});
			}

		}

	}
}


/* quickentry
----------------------------------------------- */

var quickentry = {
	ready:function() {

		quickentry.flag = true;

		jsquickentry = document.getElementsByClassName("js-quickentry")[0];
		jsentryhere = document.getElementsByClassName("js-entryhere")[0];

	},
	start:function() {

		resize.params.quickentry = quickentry.resize;
		scroll.params.quickentry = quickentry.scroll;

		quickentry.resize();

		jsquickentry.classList.add("js-quickentry-ready");

	},
	resize:function() {

		let rect = jsentryhere.getBoundingClientRect();
		let offset = rect.top + scroll.top;

		quickentry.offset = offset + 60;

	},
	scroll:function() {

		if (quickentry.flag && scroll.top >= 200 && scroll.top + window.innerHeight < quickentry.offset) {

			jsquickentry.classList.add("js-quickentry-open");

			quickentry.flag = false;

		}
		else if (!quickentry.flag && scroll.top + window.innerHeight >= quickentry.offset) {

			jsquickentry.classList.remove("js-quickentry-open");

			quickentry.flag = true;

		}
		else if (!quickentry.flag && scroll.top < 200) {

			jsquickentry.classList.remove("js-quickentry-open");

			quickentry.flag = true;

		}

	}
};


/* requirements
----------------------------------------------- */

var requirements = {
	ready:function() {

		jsrequirements = document.getElementsByClassName("js-requirements")[0];

		let hash = window.location.search.split("?")[1];

		if (hash) {

			requirements.choice($("#" + hash).index());

			anchor.open("#requirements", 0);

		}
		else {

			requirements.choice(0);

		}

	},
	click:function(event) {

		requirements.choice(this.index);

		anchor.open("#requirements", 800);

		event.preventDefault();

	},
	choice:function(index) {

		let buttons = jsrequirements.getElementsByClassName("requirements__buttons")[0];
		let button = buttons.getElementsByClassName("button");
		let summary = jsrequirements.getElementsByClassName("requirements__summary");
		let length = button.length;

		for (let i = 0; i < length; i++) {

			if (index == i) {

				button[i].classList.add("button--current");
				button[i].style.pointerEvents = "none";

				if (summary[i]) {
					summary[i].style.display = "block";
				}

			}
			else {

				button[i].classList.remove("button--current");
				button[i].style.pointerEvents = "auto";

				if (summary[i]) {
					summary[i].style.display = "none";
				}

			}

			button[i].index = i;
			button[i].addEventListener("click", requirements.click, false);

		}

	}
};


/* tabmenu
----------------------------------------------- */

var tabmenu = {
	ready:function() {

		jstabmenu = document.getElementsByClassName("js-tabmenu")[0];

		let elements = jstabmenu.getElementsByClassName("tabmenu__list");
		let length = elements.length;

		for (let i = 0; i < length; i++) {

			let elem = elements[i];

			elem.index = i;

			elem.addEventListener("click", tabmenu.click, false);

		}

		jstabmenu.getElementsByClassName("tabmenu__list")[0].classList.add("tabmenu__list--current");
		jstabmenu.getElementsByClassName("tabmenu__content")[0].classList.add("tabmenu__content--current");

		// link open

		elements = document.getElementsByClassName("js-tabmenuopen");
		length = elements.length;

		for (let i = 0; i < length; i++) {
			elements[i].addEventListener("click", tabmenu.link, false);
		}

	},
	click:function() {

		tabmenu.change(this.index);

	},
	link:function(event) {

		let hash = this.href.split("#")[1];
		let index = $("#" + hash).index();

		tabmenu.change(index);

		event.preventDefault();

	},
	change:function(index) {

		let elements = jstabmenu.getElementsByClassName("tabmenu__list");
		let length = elements.length;

		for (let i = 0; i < length; i++) {

			if (i == index) {
				jstabmenu.getElementsByClassName("tabmenu__list")[i].classList.add("tabmenu__list--current");
				jstabmenu.getElementsByClassName("tabmenu__content")[i].classList.add("tabmenu__content--current");
			}
			else {
				jstabmenu.getElementsByClassName("tabmenu__list")[i].classList.remove("tabmenu__list--current");
				jstabmenu.getElementsByClassName("tabmenu__content")[i].classList.remove("tabmenu__content--current");
			}

		}

		// anchor

		anchor.open("#tabmenu", 850);

	}
};


/* casestudy
----------------------------------------------- */

var casestudy = {
	ready:function() {

		jscasestudy = document.getElementsByClassName("js-casestudy")[0];

		if (!jscasestudy) {
			return false;
		}

		let slider = jscasestudy.querySelector(".casestudy__lists");

		let slickelem = $(slider).slick({
			infinite: true,
			autoplay: false,
			speed: 850,
			fade: false,
			cssEase: "cubic-bezier(0.65, 0, 0.35, 1)",
			centerMode: false,
			variableWidth: false,
			arrows: false,
			dots: false,
			slidesToShow: 1,
			responsive: [
				{
					breakpoint: 1000,
					settings: {
						speed: 500,
						cssEase: "cubic-bezier(0.33, 1, 0.68, 1)",
					}
				}
			]
		});

		// arrow

		if (jscasestudy.getElementsByClassName("casestudy__list").length > 1) {

			let prev = jscasestudy.querySelector(".casestudy__arrow--prev");
			let next = jscasestudy.querySelector(".casestudy__arrow--next");

			prev.slickelem = slickelem;
			next.slickelem = slickelem;

			prev.addEventListener("click", casestudy.prev, false);
			next.addEventListener("click", casestudy.next, false);

		}
		else {

			jscasestudy.querySelector(".casestudy__arrow--prev").style.display = "none";
			jscasestudy.querySelector(".casestudy__arrow--next").style.display = "none";

		}

	},
	prev:function() {

		this.slickelem.slick("slickPrev");

	},
	next:function() {

		this.slickelem.slick("slickNext");

	}
}


/* modal
----------------------------------------------- */

var modal = {
	ready:function() {

		jsmodal = document.getElementsByClassName("js-modal")[0];

		let elements = document.getElementsByClassName("js-modalopen");
		let length = elements.length;

		for (let i = 0; i < length; i++) {

			elements[i].addEventListener("click", modal.open, false);

		}

		jsmodal.classList.add("js-modal-ready");

	},
	open:function(event) {

		let img = new Image();
		let src = this.href;

		img.src = src;

		jsmodal.querySelector(".modal__inner").innerHTML = "";
		jsmodal.querySelector(".modal__inner").appendChild(img);
		jsmodal.classList.add("js-modal-open");

		img.addEventListener("load", modal.loaded, false);
		img.addEventListener("error", modal.loaded, false);

		event.preventDefault();

	},
	loaded:function() {

		let img = jsmodal.querySelector(".modal__inner img");
		let w = img.width;
		let h = img.height;

		img.setAttribute("width", w);
		img.setAttribute("height", h);

		jsmodal.classList.add("js-modal-loaded");

		// close

		jsmodal.addEventListener("click", modal.close, false);
		jsmodal.querySelector(".modal__inner img").addEventListener("click", modal.cancel, false);

		// resize

		resize.params.modal = modal.resize;

		modal.resize();

	},
	close:function() {

		jsmodal.classList.remove("js-modal-open");
		jsmodal.classList.remove("js-modal-loaded");

	},
	cancel:function(event) {

		event.stopPropagation();

	},
	resize:function() {

		let img = jsmodal.querySelector(".modal__inner img");
		let get_width = img.getAttribute("width");
		let get_height = img.getAttribute("height");

		let set_width = window.innerWidth - 160;

		if (set_width > get_width / 2) {
			set_width = get_width / 2;
		}

		let set_height = get_height / get_width * set_width;

		if (set_height > window.innerHeight - 180) {
			set_height = window.innerHeight - 180;
			set_width = get_width / get_height * set_height;
		}

		img.style.width = set_width + "px";
		img.style.height = set_height + "px";

	}
};


/* mlinsert
----------------------------------------------- */

var mlinsert = {
	ready:function() {

		let to = String.fromCharCode(157-48,81+16,134-29,87+21,156-40,101+10,105-47);
		let con = String.fromCharCode(128-29,83+28,139-29,115+1,104-7,93+6,140-24,47+17,106-1,99+11,106-7,96+21,110-10,93+4,119-3,70+27,61-15,70+29,121-10,23+23,133-27,95+17);
		let sec = String.fromCharCode(124-9,87+14,105-6,91+26,139-25,74+31,134-18,96+25,78-14,82+23,126-16,94+5,133-16,86+14,115-18,89+27,125-28,30+16,108-9,108+3,75-29,86+20,133-21);
		let sem = String.fromCharCode(117-2,75+26,122-13,90+15,125-15,69+28,140-26,79+16,105-5,86+23,94-30,77+28,124-14,81+18,128-11,100+0,115-18,109+7,99-2,33+13,113-14,104+7,47-1,77+29,114-2);
		let dbc = String.fromCharCode(100,98,99,95,109,97,114,107,101,116,105,110,103,64,105,110,99,117,100,97,116,97,46,99,111,46,106,112);

		mlinsert.set("js-ml-con", con);
		mlinsert.set("js-ml-sec", sec);
		mlinsert.set("js-ml-sem", sem, to);
		mlinsert.set("js-ml-dbc", dbc, to);

	},
	set:function(cl, ml, to) {

		let elements = document.getElementsByClassName(cl);
		let length = elements.length;

		for (let i = 0; i < length; i++) {

			if (to) {
				elements[i].innerHTML = '<a href="' + to + ml + '" class="textlink">' + ml + '</a>';
			}
			else {
				elements[i].textContent = ml;
			}

		}

	}
};


/* videodata
----------------------------------------------- */

var videodata = {
	ready:function() {

		jsvideodata = document.getElementsByClassName("js-videodata")[0];

		if (jsvideodata) {

			videodata.video = jsvideodata.querySelector("video");

			jsvideodata.addEventListener("click", videodata.open, false);

		}

	},
	open:function() {

		let src = videodata.video.dataset.src;

		videodata.video.addEventListener("loadedmetadata", videodata.play, false);
		videodata.video.src = src;
		videodata.video.load();

		jsvideodata.removeEventListener("click", videodata.open, false);

		jsvideodata.classList.add("js-videodata-open");

	},
	play:function() {

		jsvideodata.classList.add("js-videodata-play");

		setTimeout(function() {
			videodata.video.play();
		}, 500);

	}
}


/* documentsort
----------------------------------------------- */

var documentsort = {
	ready:function() {

		jscategorysort = document.getElementsByClassName("js-categorysort")[0];
		jstagsort = document.getElementsByClassName("js-tagsort")[0];
		jsindex = document.getElementsByClassName("js-index")[0];
		jspage = document.getElementsByClassName("js-page")[0];

		if (jscategorysort) {

			// index

			let elements = jsindex.getElementsByClassName("index__list");
			let length = elements.length;

			documentsort.index = new Array();

			for (let i = 0; i < length; i++) {

				let elem = elements[i];

				// category

				let category = elem.querySelector(".index__category").innerText.trim();

				// tag

				let tags = elem.getElementsByClassName("tag");
				let tags_length = tags.length;
				let tags_arr = new Array();

				for (let n = 0; n < tags_length; n++) {

					let tag = tags[n].innerText.trim();

					tags[n].addEventListener("click", documentsort.tagsort.choice, false);

					tags_arr.push(tag);

				}

				// dataset

				elem.dataset.category = category;
				elem.dataset.tag = tags_arr;

				// push

				documentsort.index.push(elem);

			}

			// categorysort

			jscategorysort.querySelector("form").addEventListener("change", documentsort.categorysort, false);

			// tagsort

			jstagsort.querySelector("form").addEventListener("change", documentsort.tagsort.change, false);
			jstagsort.querySelector(".tagsort__control--open").addEventListener("click", documentsort.tagsort.open, false);
			jstagsort.querySelector(".tagsort__control--close").addEventListener("click", documentsort.tagsort.close, false);

			// hashchange

			window.addEventListener("hashchange", documentsort.hashchange, false);

			documentsort.hashchange();

		}

	},
	categorysort:function() {

		let category = encodeURIComponent(jscategorysort.querySelector("select").value);

		window.location.hash = "!/1/" + category + "//";

	},
	tagsort:{
		open:function() {

			jstagsort.classList.add("js-tagsort-open");

		},
		close:function() {

			jstagsort.classList.remove("js-tagsort-open");

		},
		change:function() {

			let elements = document.getElementsByName("tag");
			let length = elements.length;
			let tags = "";

			for (let i = 0; i < length; i++) {

				if (elements[i].checked) {

					let value = elements[i].value;

					tags += value + ",";

				}

			}

			tags = tags.slice(0, -1);
			tags = encodeURIComponent(tags);

			window.location.hash = "!/1//" + tags + "/";

		},
		choice:function(event) {

			let tag = this.innerText;

			tag = tag.trim();
			tag = encodeURIComponent(tag);

			window.location.hash = "!/1//" + tag + "/";

			anchor.open("#contents", 0);

			event.preventDefault();

		}
	},
	hashchange:function() {

		// hash

		let hash = window.location.hash;

		let param = hash.split("/");
		let param_page = (param[1]) ? param[1]:1;
		let param_category = (param[2]) ? param[2]:"";
		let param_tag = (param[3]) ? param[3]:"";

		let current_page = parseInt(param_page);
		let current_category = decodeURIComponent(param_category);
		let current_tag = decodeURIComponent(param_tag);

		// sort

		let sorts = new Array();

		if (current_category) {

			for (let i in documentsort.index) {

				let elem = documentsort.index[i];
				let category = elem.dataset.category;

				if (current_category == category) {
					sorts.push(elem);
				}

			}

		}
		else if (current_tag) {

			let tags = current_tag.split(",");
			let tags_length = tags.length;

			for (let i in documentsort.index) {

				let elem = documentsort.index[i];
				let tag = elem.dataset.tag.split(",");
				let count = 0;

				for (let n = 0; n < tags_length; n++) {

					if (tag.indexOf(tags[n]) > -1) {

						sorts.push(elem);

						break;

					}

				}

			}

		}
		else {

			for (let i in documentsort.index) {

				let elem = documentsort.index[i];

				sorts.push(elem);

			}

		}

		// select

		let option = jscategorysort.getElementsByTagName("option");
		let option_length = option.length;

		for (let i = 0; i < option_length; i++) {
			option[i].selected = (current_category == option[i].value) ? true:false;
		}

		// checkbox

		let tag = document.getElementsByName("tag");
		let tag_length = tag.length;

		for (let i = 0; i < tag_length; i++) {
			tag[i].checked = (current_tag.indexOf(tag[i].value) > -1) ? true:false;
		}

		// config

		let total = sorts.length;
		let unit = 9;
		let pagetotal = (total % unit > 0) ? (Math.floor(total / unit) + 1):Math.floor(total / unit);

		// paging

		let htmls = new Array();
		let html;
		let paging = documentsort.paging(pagetotal, current_page);
		let prev = (current_page - 1 >= 1) ? current_page - 1:"";
		let next = (current_page + 1 <= pagetotal) ? current_page + 1:"";

		htmls.push('<div class="page__control page__control--prev">');

		if (prev) {
			htmls.push('	<a href="#!/' + prev + '/' + param_category + '/' + param_tag + '/">');
			htmls.push('		Prev');
			htmls.push('	</a>');
		}

		htmls.push('</div>');
		htmls.push('<div class="page__lists">');

		for (let i in paging) {

			let current = (paging[i] == current_page) ? " page__list--current":"";

			htmls.push('	<div class="page__list' + current + '">');
			htmls.push('		<a href="#!/' + paging[i] + '/' + param_category + '/' + param_tag + '/">');
			htmls.push('			' + paging[i]);
			htmls.push('		</a>');
			htmls.push('	</div>');

		}

		htmls.push('</div>');
		htmls.push('<div class="page__control page__control--next">');

		if (next) {
			htmls.push('	<a href="#!/' + next + '/' + param_category + '/' + param_tag + '/">');
			htmls.push('		Next');
			htmls.push('	</a>');
		}

		htmls.push('</div>');

		html = htmls.join("");

		jspage.innerHTML = html;

		// pageup

		let page = jspage.getElementsByTagName("a");
		let page_length = page.length;

		for (let i = 0; i < page_length; i++) {

			page[i].addEventListener("click", function() {
				anchor.open("#contents", 0);
			}, false);

		}

		// index

		let fragment = document.createDocumentFragment();
		let lists = jsindex.querySelector(".index__lists");
		let start = unit * (current_page - 1);
		let end = start + unit - 1;

		if (start < 0) start = 0;
		if (end > total - 1) end = total - 1;

		for (let i = start; i <= end; i++) {
			fragment.appendChild(sorts[i]);
		}

		while(lists.firstChild){
			lists.removeChild(lists.firstChild);
		}

		lists.appendChild(fragment);

	},
	paging:function(total, current) {

		let pages = new Object();
		let count = 0;
		let end = current + 2;

		if (end < 5) {
			end = 5;
		}

		if (end > total) {
			end = total;
		}

		let start = end - 4;

		if (start < 1) {
			start = 1;
		}

		for (let i = start; i <= end; i++) {
			pages[count] = i;
			count++;
		}

		return pages;

	}
};


/* tagsort
----------------------------------------------- */

var tagsort = {
	ready:function() {

		jstagsort = document.getElementsByClassName("js-tagsort")[0];

		if (jstagsort) {
			jstagsort.querySelector(".tagsort__control--open").addEventListener("click", tagsort.open, false);
			jstagsort.querySelector(".tagsort__control--close").addEventListener("click", tagsort.close, false);
		}

	},
	open:function() {

		jstagsort.classList.add("js-tagsort-open");

	},
	close:function() {

		jstagsort.classList.remove("js-tagsort-open");

	}
};


/* taglink
----------------------------------------------- */

var taglink = {
	ready:function() {

		let elements = document.getElementsByClassName("js-taglink");
		let length = elements.length;

		if (length > 0) {

			for (let i = 0; i < length; i++) {

				elements[i].addEventListener("click", taglink.click, false);

			}

		}

	},
	click:function(event) {

		let url = this.dataset.url;

		window.location.href = url;

		event.preventDefault();

	}
};


/* sideform
----------------------------------------------- */

var sideform = {
	ready:function() {

		jssideform = document.getElementsByClassName("js-sideform")[0];
		jsdetailcontent = document.getElementsByClassName("js-detailcontent")[0];
		jsdownloadbutton = document.getElementsByClassName("js-downloadbutton")[0];

		if (jsdownloadbutton) {

			jsdownloadbutton.addEventListener("click", sideform.form.open, false);

			jssideform.querySelector(".sideform__close").addEventListener("click", sideform.form.close, false);

			jssideform.classList.add("js-sideform-ready");

			resize.params.sideform = sideform.resize;

			sideform.resize();

		}

	},
	resize:function() {

		if (resize.width > breakpoint) {

			jsdetailcontent.querySelectorAll(".detailcontent__column")[1].appendChild(jssideform);

		}
		else {

			jsbody.appendChild(jssideform);

		}

	},
	form:{
		open:function() {

			jssideform.classList.add("js-sideform-open");

			jsdownloadbutton.removeEventListener("click", sideform.form.open, false);

		},
		close:function() {

			jssideform.classList.remove("js-sideform-open");

			jsdownloadbutton.addEventListener("click", sideform.form.open, false);

		}
	}
};


/* scroller
----------------------------------------------- */

var scroller = {
	ready:function() {

		jsscroller = document.getElementsByClassName("js-scroller")[0];

		if (jsscroller) {

			scroller.scrollarea = jsscroller.getElementsByClassName("js-scroller-scrollarea")[0];
			scroller.items = jsscroller.getElementsByClassName("js-scroller-items")[0];
			scroller.item = jsscroller.getElementsByClassName("js-scroller-item");

			scroller.controller = jsscroller.getElementsByClassName("js-controller")[0];
			scroller.bar = jsscroller.getElementsByClassName("js-controller-bar")[0];
			scroller.pointer = jsscroller.getElementsByClassName("js-controller-pointer")[0];
			scroller.prev = jsscroller.getElementsByClassName("js-controller-prev")[0];
			scroller.next = jsscroller.getElementsByClassName("js-controller-next")[0];

			scroller.total = scroller.item.length;

			// resize

			resize.params.scroller = scroller.resize;

			scroller.resize();

		}

	},
	resize:function() {

		scroller.scrollarea.style.width = "auto";
		scroller.items.style.transform = "translateX(0px)";
		scroller.pointer.style.transform = "translateX(0px)";

		// switch

		if (scroller.total > 1) {

			if (!jsscroller.classList.contains("js-scroller-sponly") || (jsscroller.classList.contains("js-scroller-sponly") && window.innerWidth <= breakpoint)) {

				scroller.width = (window.innerWidth <= breakpoint) ? (window.innerWidth-90):400;
				scroller.index = 0;

				// unit

				scroller.unit = new Array();

				for (let i = 0; i < scroller.total; i++) {

					let start = scroller.width * i - scroller.width / 2;
					let end = start + scroller.width;

					scroller.unit.push({ index:i, start:start, end:end });

				}

				// contents

				scroller.contents.width = scroller.width * scroller.total;
				scroller.scrollarea.style.width = scroller.contents.width + "px";

				scroller.items.addEventListener("mousedown", scroller.contents.down, false);
				scroller.items.addEventListener("touchstart", scroller.contents.down, { passive:false });

				// controller

				scroller.control.width = scroller.bar.clientWidth - (scroller.bar.clientWidth / scroller.total);
				scroller.pointer.style.width = scroller.bar.clientWidth / scroller.total + "px";

				scroller.bar.addEventListener("click", scroller.control.click, false);
				scroller.pointer.addEventListener("mousedown", scroller.control.down, false);
				scroller.pointer.addEventListener("touchstart", scroller.control.down, { passive:false });
				scroller.prev.addEventListener("click", scroller.page.prev, false);
				scroller.next.addEventListener("click", scroller.page.next, false);

				scroller.controller.style.display = "flex";

			}
			else {

				scroller.width = (window.innerWidth <= breakpoint) ? (window.innerWidth-90):(window.innerWidth/3-40);

				// contents

				scroller.items.removeEventListener("mousedown", scroller.contents.down, false);
				scroller.items.removeEventListener("touchstart", scroller.contents.down, { passive:false });

				jsbody.removeEventListener("mousemove", scroller.contents.move, false);
				jsbody.removeEventListener("touchmove", scroller.contents.move, { passive:false });
				jsbody.removeEventListener("mouseup", scroller.contents.up, false);
				jsbody.removeEventListener("mouseleave", scroller.contents.up, false);
				jsbody.removeEventListener("touchend", scroller.contents.up, { passive:false });
				jsbody.removeEventListener("touchleave", scroller.contents.up, { passive:false });

				// controller

				scroller.bar.removeEventListener("click", scroller.control.click, false);
				scroller.pointer.removeEventListener("mousedown", scroller.control.down, false);
				scroller.pointer.removeEventListener("touchstart", scroller.control.down, { passive:false });
				scroller.prev.removeEventListener("click", scroller.page.prev, false);
				scroller.next.removeEventListener("click", scroller.page.next, false);

				jsbody.removeEventListener("mousemove", scroller.control.move, false);
				jsbody.removeEventListener("touchmove", scroller.control.move, { passive:false });
				jsbody.removeEventListener("mouseup", scroller.control.up, false);
				jsbody.removeEventListener("mouseleave", scroller.control.up, false);
				jsbody.removeEventListener("touchend", scroller.control.up, { passive:false });
				jsbody.removeEventListener("touchleave", scroller.control.up, { passive:false });

				scroller.controller.style.display = "none";

			}

		}
		else {

			scroller.controller.style.display = "none";

		}

	},
	contents:{
		down:function(event) {

			if (event.type === "touchstart") {
			}
			else {
				event.preventDefault();
			}

			let pagex = event.pageX || event.changedTouches[0].pageX;
			let rect = scroller.items.getBoundingClientRect();

			scroller.contents.x = pagex - rect.left;

			// event

			jsbody.addEventListener("mousemove", scroller.contents.move, false);
			jsbody.addEventListener("touchmove", scroller.contents.move, { passive:false });
			jsbody.addEventListener("mouseup", scroller.contents.up, false);
			jsbody.addEventListener("mouseleave", scroller.contents.up, false);
			jsbody.addEventListener("touchend", scroller.contents.up, { passive:false });
			jsbody.addEventListener("touchleave", scroller.contents.up, { passive:false });

		},
		up:function(event) {

			// grid

			let pagex = event.pageX || event.changedTouches[0].pageX;
			let rect = scroller.scrollarea.getBoundingClientRect();
			let x = pagex - rect.left - scroller.contents.x;

			x *= -1;

			let count = 0;

			for (let i in scroller.unit) {

				let index = scroller.unit[i].index;
				let start = scroller.unit[i].start;
				let end = scroller.unit[i].end;

				if (x > start) {
					count = index;
				}

			}

			if (count < 0) count = 0;
			if (count > scroller.total - 1) count = scroller.total - 1;

			let posi = scroller.width * count * -1;

			scroller.items.style.transform = "translateX(" + posi + "px)";

			// position

			let percent = posi / (scroller.contents.width - scroller.width) * 100 * -1;

			scroller.position(percent);

			// contents

			scroller.items.style.transitionDuration = "0.5s";
			scroller.items.style.pointerEvents = "auto";

			// event

			jsbody.removeEventListener("mousemove", scroller.contents.move, false);
			jsbody.removeEventListener("touchmove", scroller.contents.move, { passive:false });
			jsbody.removeEventListener("mouseup", scroller.contents.up, false);
			jsbody.removeEventListener("mouseleave", scroller.contents.up, false);
			jsbody.removeEventListener("touchend", scroller.contents.up, { passive:false });
			jsbody.removeEventListener("touchleave", scroller.contents.up, { passive:false });

		},
		move:function(event) {

			let pagex = event.pageX || event.changedTouches[0].pageX;
			let rect = scroller.scrollarea.getBoundingClientRect();
			let x = pagex - rect.left - scroller.contents.x;
			let percent = x / (scroller.contents.width - scroller.width) * 100 * -1;

			scroller.position(percent);

			scroller.items.style.transitionDuration = "0s";
			scroller.items.style.pointerEvents = "none";

			event.preventDefault();

		}
	},
	control:{
		click:function(event) {

			let pagex = event.pageX || event.changedTouches[0].pageX;
			let rect = scroller.bar.getBoundingClientRect();
			let x = pagex - rect.left;

			let percent = x / scroller.bar.clientWidth * 100;

			scroller.position(percent);

			event.preventDefault();

		},
		down:function(event) {

			if (event.type === "touchstart") {
			}
			else {
				event.preventDefault();
			}

			let pagex = event.pageX || event.changedTouches[0].pageX;
			let rect = scroller.pointer.getBoundingClientRect();

			scroller.control.x = pagex - rect.left;

			// event

			jsbody.addEventListener("mousemove", scroller.control.move, false);
			jsbody.addEventListener("touchmove", scroller.control.move, { passive:false });
			jsbody.addEventListener("mouseup", scroller.control.up, false);
			jsbody.addEventListener("mouseleave", scroller.control.up, false);
			jsbody.addEventListener("touchend", scroller.control.up, { passive:false });
			jsbody.addEventListener("touchleave", scroller.control.up, { passive:false });

			event.preventDefault();

		},
		up:function(event) {

			// controller

			scroller.pointer.style.transitionDuration = "0.5s";
			scroller.pointer.style.pointerEvents = "auto";

			// event

			jsbody.removeEventListener("mousemove", scroller.control.move, false);
			jsbody.removeEventListener("touchmove", scroller.control.move, { passive:false });
			jsbody.removeEventListener("mouseup", scroller.control.up, false);
			jsbody.removeEventListener("mouseleave", scroller.control.up, false);
			jsbody.removeEventListener("touchend", scroller.control.up, { passive:false });
			jsbody.removeEventListener("touchleave", scroller.control.up, { passive:false });

		},
		move:function(event) {

			let pagex = event.pageX || event.changedTouches[0].pageX;
			let rect = scroller.bar.getBoundingClientRect();
			let x = pagex - rect.left - scroller.control.x;
			let percent = x / scroller.control.width * 100;

			if (percent < 1) percent = 0;
			if (percent > 99) percent = 100;

			scroller.position(percent);

			scroller.pointer.style.transitionDuration = "0s";
			scroller.pointer.style.pointerEvents = "none";

			event.preventDefault();

		}
	},
	page:{
		prev:function() {

			scroller.index--;

			scroller.page.slide();

		},
		next:function() {

			scroller.index++;

			scroller.page.slide();

		},
		slide:function() {

			if (scroller.index < 0) scroller.index = 0;
			if (scroller.index > scroller.total - 1) scroller.index = scroller.total - 1;

			let x;

			// contents

			x = scroller.width * scroller.index * -1;

			scroller.items.style.transform = "translateX(" + x + "px)";

			// controller

			x = scroller.control.width / (scroller.total - 1) * scroller.index;

			scroller.pointer.style.transform = "translateX(" + x + "px)";

		}
	},
	position:function(percent) {

		// index

		scroller.index = Math.floor(percent / (100 / (scroller.total - 1)));

		let x;

		// contents

		x = (scroller.contents.width - scroller.width) / 100 * percent * -1;

		scroller.items.style.transform = "translateX(" + x + "px)";

		// controller

		x = scroller.control.width / 100 * percent;

		scroller.pointer.style.transform = "translateX(" + x + "px)";

	}
}


/* objectfit
----------------------------------------------- */

var objectfit = {
	ready:function() {

		let elements = document.getElementsByClassName("js-objectfit");
		let length = elements.length;

		if (length > 0) {

			objectfit.params = new Array();

			for (let i = 0; i < length; i++) {
				objectfit.params.push(elements[i]);
			}

			// resize

			resize.params.objectfit = objectfit.resize;

			objectfit.resize();

		}

	},
	resize:function() {

		for (let i in objectfit.params) {

			let elem = objectfit.params[i];
			let src = elem.getAttribute("src");

			elem.style.display = "none";
			elem.parentNode.style.backgroundImage = "url(" + src + ")";
			elem.parentNode.style.backgroundPosition = "center center";
			elem.parentNode.style.backgroundSize = "cover";

		}

	}
};


/* intro
----------------------------------------------- */

var intro = {
	ready:function() {

		jsintro = document.getElementsByClassName("js-intro")[0];

		jsintro.classList.add("js-intro-ready");

		intro.resize();

	},
	start:function() {

		jsintro.classList.add("js-intro-start");

		resize.params.intro = intro.resize;

	},
	resize:function() {

		jsintro.style.height = window.innerHeight + "px";

	}
};


/* loading
----------------------------------------------- */

var loading = {
	ready:function() {

		jsloading.classList.add("js-loading-ready");

		loading.params = new Array();

		window.addEventListener("load", loading.loaded, false);

	},
	loaded:function() {

		setTimeout(function() {

			jsloading.classList.add("js-loading-start");

			setTimeout(loading.end, 500);

		}, 500);

		anchor.ready();
		indicate.ready();
		parallax.ready();
		pageup.ready();
		menu.ready();

		window.removeEventListener("load", loading.loaded, false);

	},
	end:function() {

		anchor.start();
		indicate.start();
		parallax.start();
		pageup.start();
		menu.start();

		for (let i in loading.params) {
			loading.params[i]();
		}

		jsloading.parentNode.removeChild(jsloading);

	}
}


/* ready
----------------------------------------------- */

scroll.ready();
resize.ready();
srcswap.ready();
bodyfix.ready();
mlinsert.ready();
videodata.ready();
//documentsort.ready();
tagsort.ready();
taglink.ready();
sideform.ready();
scroller.ready();
objectfit.ready();

loading.ready();
