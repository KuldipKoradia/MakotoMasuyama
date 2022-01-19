(function($) {




// egg


const Egg = {
	
	
	canvas: null,
	context: null,
	canvasWidth: 0,
	canvasHeight: 0,
	timer: null,
	wait: 12,
	count: 11,
	numToAddEachFrame: 0,
	particleList: {},
	recycleBin: {},
	m: 0,
	fLen: 520,
	zMax: 518,
	projCenterX: 0,
	projCenterY: 0,
	pi2: Math.PI * 2,
	turnSpeed: Math.PI * 2 / 1000,
	turnAngle: 0,
	sphereRad: 0,
	sphereCenterX: 0,
	sphereCenterY: 0,
	sphereCenterZ: 0,
	particleRad: 1,
	particleElp: 3,
	particleAlpha: .55,
	zeroAlphaDepth: -600,
	maxAge: 400,
	ellipticity: 1.15,
	p: 0,
	nextParticle: 0,
	sinAngle: 0,
	cosAngle: 0,
	rotX: 0,
	rotZ: 0,
	depthAlphaFactor: 0,
	i: 0,
	theta: 0,
	phi: 0,
	x0: 0,
	y0: 0,
	z0: 0,
	lastImage: {},
	pixelData: [],
	resized: false,
	
	
	init: function() {
		
		this.canvas = document.getElementById("egg");
		this.context = this.canvas.getContext("2d");
		
		this.setCanvasSize();
		
	},
	
	
	tick: function() {
		
		this.lastImage = this.context.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
		this.pixelData = this.lastImage.data;
		this.len = this.pixelData.length;
		for (this.i = 3; this.i < this.len; this.i += 4) {
			if (this.pixelData[this.i] > 0) {
				this.pixelData[this.i] -= 1;
			}
		}
		this.context.putImageData(this.lastImage, 0, 0);
		
		this.count++;
		
		if (this.count >= this.wait) {
			
			this.count = 0;
			
			for (this.i = 0; this.i < this.numToAddEachFrame; this.i++) {
				
				this.theta = Math.random() * this.pi2;
				this.phi = Math.acos(Math.random() * 2 - 1);
				this.x0 = this.sphereRad * Math.sin(this.phi) * Math.cos(this.theta);
				this.y0 = this.sphereRad * Math.sin(this.phi) * Math.sin(this.theta);
				this.z0 = this.sphereRad * Math.cos(this.phi);
				
				let p = this.addParticle(this.x0, this.sphereCenterY + this.y0, this.sphereCenterZ + this.z0, 0.002 * this.x0, Math.random() * .12 - .06, 0.002 * this.z0);
				
				p.attack = this.maxAge * .2;
				p.hold = this.maxAge * .4;
				p.decay = this.maxAge * .7;
				p.initValue = 0;
				p.holdValue = this.particleAlpha;
				p.lastValue = 0;
				p.turnSpeed = this.turnSpeed * (Math.random() * 1.5 + .7);
				p.turnAngle = (this.turnAngle + p.turnSpeed) % this.pi2;
				
			}
			
		}
		
		this.p = this.particleList.first;
		
		while (this.p != null) {
			
			this.nextParticle = this.p.next;
			
			this.p.age++;
			this.p.y += this.p.velY;
			this.p.turnAngle = (this.p.turnAngle + this.p.turnSpeed) % this.pi2;
			this.sinAngle = Math.sin(this.p.turnAngle);
			this.cosAngle = Math.cos(this.p.turnAngle);
			this.rotX = this.cosAngle * this.p.x + this.sinAngle * (this.p.z - this.sphereCenterZ);
			this.rotZ = -this.sinAngle * this.p.x + this.cosAngle * (this.p.z - this.sphereCenterZ) + this.sphereCenterZ;
			this.m = this.fLen / (this.fLen - this.rotZ);
			this.p.projX = this.rotX * this.m + this.projCenterX;
			this.p.projY = this.p.y * this.m + this.projCenterY;

			if (this.p.age < this.p.attack + this.p.hold + this.p.decay) {
				if (this.p.age < this.p.attack) {
					this.p.alpha = (this.p.holdValue - this.p.initValue) / this.p.attack * this.p.age + this.p.initValue;
				} else if (this.p.age < this.p.attack + this.p.hold) {
					this.p.alpha = this.p.holdValue;
				} else if (this.p.age < this.p.attack + this.p.hold + this.p.decay) {
					this.p.alpha = (this.p.lastValue - this.p.holdValue) / this.p.decay * (this.p.age - this.p.attack - this.p.hold) + this.p.holdValue;
				}
			} else {
				this.p.dead = true;
			}
			
			if (this.p.dead) {
				this.recycle(this.p);
			} else {
				this.depthAlphaFactor = (1 - this.rotZ / this.zeroAlphaDepth);
				this.depthAlphaFactor = (this.depthAlphaFactor > 1) ? 1 : ((this.depthAlphaFactor < 0) ? 0 : this.depthAlphaFactor);
				this.context.fillStyle = this.p.particleColor + this.depthAlphaFactor * this.p.alpha + ")";
				this.context.globalCompositeOperation = 'overlay';
				this.context.beginPath();
				if (_ie11) {
					this.context.fillRect(this.p.projX, this.p.projY * this.ellipticity, this.m * this.particleRad * this.particleElp * 1.6, this.m * this.particleRad * 1.6);
				} else {
					this.context.ellipse(this.p.projX, this.p.projY * this.ellipticity, this.m * this.particleRad * this.particleElp, this.m * this.particleRad, 0, 0, this.pi2);
				}
				this.context.closePath();
				this.context.shadowColor = this.p.glowColor;
				this.context.shadowBlur = 4;
				this.context.shadowOffsetX = 0;
				this.context.shadowOffsetY = 0;
				this.context.fill();
			}
			
			this.p = this.nextParticle;
			
		}
		
		this.timer = requestAnimationFrame(this.tick.bind(this));
		
	},
	
	
	addParticle: function(x0, y0, z0, vx0, vy0, vz0) {
		
		let newParticle;
		let color;
		
		if (this.recycleBin.first != null) {
			newParticle = this.recycleBin.first;
			if (newParticle.next != null) {
				this.recycleBin.first = newParticle.next;
				newParticle.next.prev = null;
			} else {
				this.recycleBin.first = null;
			}
		} else {
			newParticle = {};
		}
		
		if (this.particleList.first == null) {
			this.particleList.first = newParticle;
			newParticle.prev = null;
			newParticle.next = null;
		} else {
			newParticle.next = this.particleList.first;
			this.particleList.first.prev = newParticle;
			this.particleList.first = newParticle;
			newParticle.prev = null;
		}
		
		let yPos = y0 / this.sphereRad;
		let r = Math.random();
		if (yPos < -.7) {
			if (r > .5) {
				newParticle.particleColor = 'rgba(246,248,250,';
				newParticle.glowColor = '#28abe3';
			} else {
				newParticle.particleColor = 'rgba(248,180,172,';
				newParticle.glowColor = '#cc1800';
			}
		} else if (yPos < -.5) {
			if (r > .4) {
				newParticle.particleColor = 'rgba(180,200,210,';
				newParticle.glowColor = '#1793dd';
			} else {
				newParticle.particleColor = 'rgba(244,156,80,';
				newParticle.glowColor = '#ee6c00';
			}
		} else if (yPos < -.1) {
			if (r > .2) {
				newParticle.particleColor = 'rgba(108,172,228,';
				newParticle.glowColor = '#004286';
			} else {
				newParticle.particleColor = 'rgba(208,196,80,';
				newParticle.glowColor = '#a49408';
			}
		} else if (yPos < .3) {
			if (r > .4) {
				newParticle.particleColor = 'rgba(108,172,228,';
				newParticle.glowColor = '#004286';
			} else {
				newParticle.particleColor = 'rgba(80,224,140,';
				newParticle.glowColor = '#00903c';
			}
		} else if (yPos < .8) {
			if (r > .7) {
				newParticle.particleColor = 'rgba(200,220,230,';
				newParticle.glowColor = '#1793dd';
			} else {
				newParticle.particleColor = 'rgba(116,148,232,';
				newParticle.glowColor = '#00407c';
			}
		} else {
			if (r > .5) {
				newParticle.particleColor = 'rgba(200,220,230,';
				newParticle.glowColor = '#1793dd';
			} else {
				newParticle.particleColor = 'rgba(240,196,232,';
				newParticle.glowColor = '#d030b2';
			}
		}
		
		newParticle.x = x0;
		newParticle.y = y0;
		newParticle.z = z0;
		newParticle.velX = vx0;
		newParticle.velY = vy0;
		newParticle.velZ = vz0;
		newParticle.age = 0;
		newParticle.dead = false;
		
		return newParticle;
		
	},
	
	
	recycle: function(p) {
		
		if (this.particleList.first == p) {
			if (p.next != null) {
				p.next.prev = null;
				this.particleList.first = p.next;
			} else {
				this.particleList.first = null;
			}
		} else {
			if (p.next == null) {
				p.prev.next = null;
			} else {
				p.prev.next = p.next;
				p.next.prev = p.prev;
			}
		}
		
		if (this.recycleBin.first == null) {
			this.recycleBin.first = p;
			p.prev = null;
			p.next = null;
		} else {
			p.next = this.recycleBin.first;
			this.recycleBin.first.prev = p;
			this.recycleBin.first = p;
			p.prev = null;
		}
		
	},
	
	
	setCanvasSize: function() {
		
		cancelAnimationFrame(this.timer);
		
		const winWidth = window.innerWidth, winHeight = window.innerHeight;
		const ratio = window.devicePixelRatio;
		let canvasWidth = 0, canvasHeight = 0, canvasTop = 0, cc = 0;
		
		if (winWidth > 999) {
			if (winWidth / winHeight > 1.6) {
				canvasWidth = Math.floor(winWidth * .28);
			} else {
				canvasWidth = Math.floor(winHeight * .44);
			}
			cc = .5;
		} else {
			if (winWidth / winHeight > .625) {
				canvasWidth = Math.floor(winWidth * .6);
			} else {
				canvasWidth = Math.floor(winHeight * .38);
			}
			cc = .46;
		}
		canvasHeight = Math.floor(canvasWidth * 1.175);
		canvasTop = Math.floor((winHeight - canvasHeight) * cc);
		$(".egg-container").css({ paddingTop: canvasTop });
		$("#egg").css({ width: canvasWidth, height: canvasHeight });
		
		this.canvasWidth = this.canvas.clientWidth * ratio;
		this.canvasHeight = this.canvas.clientHeight * ratio;
		
		this.canvas.setAttribute('width', this.canvasWidth);
		this.canvas.setAttribute('height', this.canvasHeight);
		
		this.projCenterX = this.canvasWidth * .5;
		this.projCenterY = this.canvasHeight * .45;
		
		this.sphereRad = this.canvasWidth * .6;
		this.sphereCenterZ = -this.sphereRad;
		this.particleRad = Math.ceil(this.canvasWidth / 40) / 10;
		//this.particleRad = Math.ceil(1 * ratio * .5);
		
		this.numToAddEachFrame = Math.floor(this.canvas.clientWidth / 36);
		
		this.particleList = {};
		this.recycleBin = {};
		
		this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		
		this.timer = requestAnimationFrame(this.tick.bind(this));
		
	}
	
	
}




// logo


function introLogo() {
	
	if (!Cookies.get("visited") || location.search == "?showlogo") {
		
		$(".intro__logo").addClass("show");
		
		setTimeout(intro.start, 2700);
		setTimeout(function() {
			Egg.init();
			$(".wrapper").addClass("unlocked");
		}, 3300);
		
		Cookies.set("visited", 1, 7);
		
	} else {
	
		$(".intro__logo").addClass("hide");
		$(".wrapper").addClass("unlocked");
		
		setTimeout(intro.start, 500);
		setTimeout(Egg.init.bind(Egg), 1100);
		
	}
	
}




// lights


function moveLights() {
	
	const lights = document.querySelectorAll(".intro__base div");
	let lightsX = 0, mouseX = 0;
	
	document.addEventListener("touchstart", checkMouseDevice);
	document.addEventListener("mousemove", checkMouseDevice);
	
	function checkMouseDevice(e) {
		
		document.removeEventListener("touchstart", checkMouseDevice);
		document.removeEventListener("mousemove", checkMouseDevice);
		
		if (e.type == "mousemove") start();
		
	}
	
	function start() {
		
		document.querySelector(".intro").addEventListener("mousemove", setMousePosition);
		
		animate();
		
	}
	
	function animate() {
		
		lightsX += (((mouseX / _windowWidth - .5) - lightsX) / 20);
		
		lights[0].style.transform = "translateX(" + lightsX * 24 + "%)";
		lights[1].style.transform = "translateX(" + lightsX * 12 + "%)";
		
		requestAnimationFrame(animate);
		
	}
	
	function setMousePosition(e) {
		
		mouseX = e.clientX;
		
	}
	
}




// cookie


const Cookies = {
	
	get: function(key) {
		
		if (!this.has(key)) return null;
		
		return decodeURIComponent(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + encodeURIComponent(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
		
	},
	
	set: function(key, value, days, path, domain, secure) {
		
		if (days) {
			var expires = new Date();
			expires.setMilliseconds(expires.getMilliseconds() + days * 864e+5);
			expires = expires.toUTCString();
		} else {
			var expires = "";
		}
		
		document.cookie = encodeURIComponent(key) + "=" + encodeURIComponent(value) + (expires ? "; expires=" + expires : "") + (domain ? "; domain=" + domain : "") + (path ? "; path=" + path : "") + (secure ? "; secure" : "");
		
	},
	
	has: function(key) {
		
		return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
		
	},
	
	del: function(key) {
		
		document.cookie = encodeURIComponent(key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
		
	}
	
};




// on ready


const _ie11 = !!(window.navigator.userAgent.toLowerCase().indexOf("trident") !== -1)
let _windowWidth = 0;


$(function() {
	
	
	introLogo();
	moveLights();
	
	
	// on resize
	
	_windowWidth = window.innerWidth;
	let resizeTimer, w = 0;
	
	$(window).on("resize", function() {
		
		clearTimeout(resizeTimer);
		
		resizeTimer = setTimeout(function() {
			
			w = window.innerWidth;
			
			if (w != _windowWidth) {
				Egg.setCanvasSize();
				_windowWidth = w;
			}
			
		}, 300);
		
	});
	
	
});




})(jQuery);
