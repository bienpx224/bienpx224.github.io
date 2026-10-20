/*
 * Homepage scroll reveal: fades in .reveal elements, runs count-up on .counter
 * and fills the process line when it enters the viewport.
 * Loaded before home-main.js so content is revealed even if language setup fails.
 */
(function () {
	'use strict';

	var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	/* ---------- Count-up numbers ---------- */
	function countUp(el) {
		var to = parseFloat(el.getAttribute('data-to')) || 0;
		var suffix = el.getAttribute('data-suffix') || '';
		if (reduceMotion) { el.textContent = to + suffix; return; }
		var start = null;
		var duration = 1600;
		function step(ts) {
			if (start === null) start = ts;
			var progress = Math.min((ts - start) / duration, 1);
			var eased = 1 - Math.pow(1 - progress, 3);
			el.textContent = Math.round(to * eased) + suffix;
			if (progress < 1) requestAnimationFrame(step);
		}
		requestAnimationFrame(step);
	}

	/* ---------- Scroll reveal + counters + process line ---------- */
	function initReveal() {
		var items = document.querySelectorAll('.reveal, .counter, .process');
		if (!('IntersectionObserver' in window)) {
			items.forEach(function (el) { el.classList.add('is-visible'); });
			document.querySelectorAll('.counter').forEach(countUp);
			return;
		}
		var io = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (!entry.isIntersecting) return;
				var el = entry.target;
				el.classList.add('is-visible');
				if (el.classList.contains('counter')) countUp(el);
				if (el.classList.contains('process')) el.style.setProperty('--progress', '1');
				io.unobserve(el);
			});
		}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
		items.forEach(function (el) { io.observe(el); });
	}

	document.addEventListener('DOMContentLoaded', initReveal);
})();
