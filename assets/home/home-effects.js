/*
 * Homepage visual effects: hero particle network, cursor glow, card tilt,
 * spotlight hover and magnetic buttons. Pointer effects are skipped on touch
 * devices; everything is skipped or frozen under prefers-reduced-motion.
 */
(function () {
	'use strict';

	var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

	/* Particle network on the hero canvas; pauses when the hero is off-screen or the tab is hidden */
	function initParticles() {
		var canvas = document.querySelector('.hero__canvas');
		if (!canvas || !canvas.getContext) return;
		var ctx = canvas.getContext('2d');
		var hero = canvas.parentElement;
		var dpr = Math.min(window.devicePixelRatio || 1, 2);
		var points = [];
		var mouse = { x: -9999, y: -9999 };
		var width = 0;
		var height = 0;
		var running = false;
		var LINK = 130;

		function resize() {
			var nextWidth = hero.clientWidth;
			var nextHeight = hero.clientHeight;
			// iOS fires resize when the URL bar shows/hides: keep points unless the size really changed
			var keepPoints = points.length && nextWidth === width && Math.abs(nextHeight - height) < 120;
			width = nextWidth;
			height = nextHeight;
			canvas.width = width * dpr;
			canvas.height = height * dpr;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			if (keepPoints) { if (!running) draw(); return; }
			var count = Math.min(90, Math.round((width * height) / 16000));
			points = [];
			for (var i = 0; i < count; i++) {
				points.push({
					x: Math.random() * width,
					y: Math.random() * height,
					vx: (Math.random() - 0.5) * 0.35,
					vy: (Math.random() - 0.5) * 0.35
				});
			}
			if (!running) draw();
		}

		function draw() {
			ctx.clearRect(0, 0, width, height);
			for (var i = 0; i < points.length; i++) {
				var p = points[i];
				if (running) {
					p.x += p.vx;
					p.y += p.vy;
					if (p.x < 0 || p.x > width) p.vx *= -1;
					if (p.y < 0 || p.y > height) p.vy *= -1;
					// Gentle pull toward the cursor
					var mdx = mouse.x - p.x;
					var mdy = mouse.y - p.y;
					var md = Math.sqrt(mdx * mdx + mdy * mdy);
					if (md < 180) {
						p.x += mdx * 0.006;
						p.y += mdy * 0.006;
					}
				}
				for (var j = i + 1; j < points.length; j++) {
					var q = points[j];
					var dx = p.x - q.x;
					var dy = p.y - q.y;
					var d = Math.sqrt(dx * dx + dy * dy);
					if (d < LINK) {
						ctx.strokeStyle = 'rgba(240,144,122,' + (1 - d / LINK) * 0.35 + ')';
						ctx.lineWidth = 1;
						ctx.beginPath();
						ctx.moveTo(p.x, p.y);
						ctx.lineTo(q.x, q.y);
						ctx.stroke();
					}
				}
				ctx.fillStyle = 'rgba(255,214,190,0.75)';
				ctx.beginPath();
				ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
				ctx.fill();
			}
		}

		function loop() {
			if (!running) return;
			draw();
			requestAnimationFrame(loop);
		}

		function setRunning(next) {
			if (reduceMotion || next === running) return;
			running = next;
			if (running) requestAnimationFrame(loop);
		}

		resize();
		var resizeTimer;
		window.addEventListener('resize', function () {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(resize, 150);
		});
		hero.addEventListener('pointermove', function (e) {
			var rect = hero.getBoundingClientRect();
			mouse.x = e.clientX - rect.left;
			mouse.y = e.clientY - rect.top;
		});
		hero.addEventListener('pointerleave', function () { mouse.x = mouse.y = -9999; });

		var heroVisible = true;
		if ('IntersectionObserver' in window) {
			new IntersectionObserver(function (entries) {
				heroVisible = entries[0].isIntersecting;
				setRunning(heroVisible && !document.hidden);
			}).observe(hero);
		}
		document.addEventListener('visibilitychange', function () { setRunning(heroVisible && !document.hidden); });
		setRunning(true);
	}

	/* Soft glow that follows the cursor across the page */
	function initCursorGlow() {
		var glow = document.querySelector('.cursor-glow');
		if (!glow) return;
		document.body.classList.add('has-pointer');
		window.addEventListener('pointermove', function (e) {
			document.body.classList.add('pointer-moved');
			glow.style.transform = 'translate(' + (e.clientX - 260) + 'px,' + (e.clientY - 260) + 'px)';
		}, { passive: true });
	}

	/* 3D tilt toward the cursor for portrait and project cards */
	function initTilt() {
		document.querySelectorAll('.tilt').forEach(function (el) {
			var max = el.classList.contains('portrait') ? 8 : 6;
			el.addEventListener('pointermove', function (e) {
				var r = el.getBoundingClientRect();
				var px = (e.clientX - r.left) / r.width - 0.5;
				var py = (e.clientY - r.top) / r.height - 0.5;
				el.style.transform = 'perspective(900px) rotateX(' + (-py * max) + 'deg) rotateY(' + (px * max) + 'deg) translateY(-4px)';
			});
			el.addEventListener('pointerleave', function () { el.style.transform = ''; });
		});
	}

	/* Radial highlight that follows the cursor inside cards */
	function initSpotlight() {
		document.querySelectorAll('.spotlight').forEach(function (el) {
			el.addEventListener('pointermove', function (e) {
				var r = el.getBoundingClientRect();
				el.style.setProperty('--x', e.clientX - r.left + 'px');
				el.style.setProperty('--y', e.clientY - r.top + 'px');
			});
		});
	}

	/* Buttons drift slightly toward the cursor */
	function initMagnetic() {
		document.querySelectorAll('.magnetic').forEach(function (el) {
			el.addEventListener('pointermove', function (e) {
				var r = el.getBoundingClientRect();
				el.style.setProperty('--mx', (e.clientX - r.left - r.width / 2) * 0.18 + 'px');
				el.style.setProperty('--my', (e.clientY - r.top - r.height / 2) * 0.28 + 'px');
			});
			el.addEventListener('pointerleave', function () {
				el.style.setProperty('--mx', '0px');
				el.style.setProperty('--my', '0px');
			});
		});
	}

	document.addEventListener('DOMContentLoaded', function () {
		initParticles();
		if (reduceMotion || !finePointer) return;
		initCursorGlow();
		initTilt();
		initSpotlight();
		initMagnetic();
	});
})();
