/*
 * Homepage behaviour: VI/EN language switch, typing rotator,
 * nav state, scroll progress and copy-email button.
 * Depends on window.HOME_I18N from home-i18n.js.
 */
(function () {
	'use strict';

	var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var dict = window.HOME_I18N || { en: {}, viExtra: {}, rotator: { vi: [], en: [] } };
	var viSource = {};
	var lang = 'vi';

	function storageGet(key) {
		try { return window.localStorage.getItem(key); } catch (e) { return null; }
	}
	function storageSet(key, value) {
		try { window.localStorage.setItem(key, value); } catch (e) { /* storage blocked: preference is not kept */ }
	}

	/* ---------- Language ---------- */
	function t(key) {
		if (lang === 'en' && dict.en[key] !== undefined) return dict.en[key];
		return viSource[key] !== undefined ? viSource[key] : dict.viExtra[key];
	}

	// Attribute translations: data-i18n-aria -> aria-label, data-i18n-alt -> alt
	var ATTRS = [['data-i18n-aria', 'aria-label'], ['data-i18n-alt', 'alt']];

	function applyLang(next) {
		lang = next === 'en' ? 'en' : 'vi';
		document.documentElement.lang = lang;
		document.querySelectorAll('[data-i18n]').forEach(function (el) {
			var value = t(el.getAttribute('data-i18n'));
			if (value === undefined) return;
			if (el.tagName === 'TITLE') document.title = value;
			else el.innerHTML = value;
		});
		ATTRS.forEach(function (pair) {
			document.querySelectorAll('[' + pair[0] + ']').forEach(function (el) {
				var value = t(el.getAttribute(pair[0]));
				if (value !== undefined) el.setAttribute(pair[1], value);
			});
		});
		syncBurgerLabel();
		rotator.restart();
		storageSet('home-lang', lang);
	}

	function initLang() {
		document.querySelectorAll('[data-i18n]').forEach(function (el) {
			viSource[el.getAttribute('data-i18n')] = el.tagName === 'TITLE' ? document.title : el.innerHTML;
		});
		ATTRS.forEach(function (pair) {
			document.querySelectorAll('[' + pair[0] + ']').forEach(function (el) {
				viSource[el.getAttribute(pair[0])] = el.getAttribute(pair[1]);
			});
		});
		var param = new URLSearchParams(window.location.search).get('lang');
		var fromParam = /^(vi|en)$/i.test(param || '') ? param.toLowerCase() : null;
		var initial = fromParam || storageGet('home-lang') || 'vi';
		var toggle = document.querySelector('.lang-toggle');
		if (toggle) toggle.addEventListener('click', function () {
			applyLang(lang === 'vi' ? 'en' : 'vi');
			// Explicit choice wins over ?lang= on reload
			if (window.location.search && window.history.replaceState) {
				window.history.replaceState(null, '', window.location.pathname + window.location.hash);
			}
		});
		applyLang(initial);
	}

	function syncBurgerLabel() {
		var burger = document.querySelector('.nav__burger');
		var nav = document.querySelector('.nav');
		if (!burger || !nav) return;
		burger.setAttribute('aria-label', t(nav.classList.contains('is-open') ? 'aria.menu_close' : 'aria.menu_open'));
	}

	/* ---------- Typing rotator ---------- */
	var rotator = (function () {
		var el = document.querySelector('.rotator__word');
		var timer = null;
		var index = 0;

		function words() { return dict.rotator[lang] || []; }

		function type(word, i) {
			el.textContent = word.slice(0, i);
			if (i < word.length) timer = setTimeout(function () { type(word, i + 1); }, 55);
			else timer = setTimeout(function () { erase(word, word.length); }, 2200);
		}
		function erase(word, i) {
			el.textContent = word.slice(0, i);
			if (i > 0) timer = setTimeout(function () { erase(word, i - 1); }, 28);
			else {
				index = (index + 1) % words().length;
				timer = setTimeout(function () { type(words()[index], 0); }, 250);
			}
		}
		function restart() {
			if (!el || !words().length) return;
			clearTimeout(timer);
			index = 0;
			if (reduceMotion) { el.textContent = words()[0]; return; }
			type(words()[0], 0);
		}
		return { restart: restart };
	})();

	/* ---------- Nav: scrolled state, hide on scroll down, active link, mobile menu ---------- */
	function initNav() {
		var nav = document.querySelector('.nav');
		var burger = document.querySelector('.nav__burger');
		var bar = document.querySelector('.scroll-progress');
		var links = Array.prototype.slice.call(document.querySelectorAll('.nav__links a'));
		var lastY = window.scrollY;
		var ticking = false;

		function onScroll() {
			var y = window.scrollY;
			var max = document.documentElement.scrollHeight - window.innerHeight;
			nav.classList.toggle('is-scrolled', y > 20);
			nav.classList.toggle('is-hidden', y > lastY && y > 400 && !nav.classList.contains('is-open'));
			if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
			lastY = y;
			ticking = false;
		}
		window.addEventListener('scroll', function () {
			if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
		}, { passive: true });
		onScroll();

		function closeMenu() {
			nav.classList.remove('is-open');
			burger.setAttribute('aria-expanded', 'false');
			syncBurgerLabel();
		}
		burger.addEventListener('click', function () {
			var open = nav.classList.toggle('is-open');
			burger.setAttribute('aria-expanded', String(open));
			syncBurgerLabel();
		});
		links.forEach(function (a) { a.addEventListener('click', closeMenu); });
		document.addEventListener('keydown', function (e) {
			if (e.key !== 'Escape' || !nav.classList.contains('is-open')) return;
			closeMenu();
			burger.focus();
		});

		if ('IntersectionObserver' in window) {
			var spy = new IntersectionObserver(function (entries) {
				entries.forEach(function (entry) {
					if (!entry.isIntersecting) return;
					links.forEach(function (a) {
						a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
					});
				});
			}, { rootMargin: '-45% 0px -50% 0px' });
			links.forEach(function (a) {
				var section = document.querySelector(a.getAttribute('href'));
				if (section) spy.observe(section);
			});
		}
	}

	/* ---------- Copy email ---------- */
	function initCopyEmail() {
		var btn = document.querySelector('.copy-email');
		if (!btn) return;
		var label = btn.querySelector('.copy-email__label');
		btn.addEventListener('click', function () {
			var email = btn.getAttribute('data-email');
			var done = function () {
				btn.classList.add('is-copied');
				label.textContent = t('ct.copied');
				setTimeout(function () {
					btn.classList.remove('is-copied');
					label.innerHTML = t('ct.copy');
				}, 1800);
			};
			if (navigator.clipboard && window.isSecureContext) {
				navigator.clipboard.writeText(email).then(done, function () { window.location.href = 'mailto:' + email; });
			} else {
				window.location.href = 'mailto:' + email;
			}
		});
	}

	document.addEventListener('DOMContentLoaded', function () {
		var year = document.querySelector('.year');
		if (year) year.textContent = new Date().getFullYear();
		try { initLang(); } catch (e) { /* page stays in Vietnamese */ }
		initNav();
		initCopyEmail();
	});
})();
