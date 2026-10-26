/* Tương tác trang trình bày ETIS: điều hướng theo slide, hiệu ứng xuất hiện,
   đếm số, tab bài toán, hành trình đơn, một ngày theo vị trí, phóng to ảnh. */
(() => {
  const D = window.ETIS;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const IMG = "assets/demo/";

  // Khung trình duyệt nhỏ bao quanh ảnh demo
  const shot = (file, url) => file
    ? `<div class="shot" data-zoom="${IMG + file}" data-cap="${url} · dữ liệu minh họa">
         <div class="bar"><i></i><i></i><i></i><em>${url}</em></div>
         <img src="${IMG + file}" alt="Màn hình ${url}" loading="lazy"></div>`
    : `<div class="card" style="text-align:center;padding:48px 24px">
         <div class="icon" style="margin:0 auto 14px"><i class="fa-solid fa-mobile-screen"></i></div>
         <h3>${url}</h3><p>Xem mô phỏng ở phần "Tài xế: chụp ảnh là xong"</p>
         <span class="tag soon" style="margin-top:10px">Đang hoàn thiện</span></div>`;

  // Tên ảnh "wms-inventory.jpg" → "wms.etis.vn"; ảnh báo cáo bắt đầu bằng "rp"
  const appUrl = file => {
    if (!file) return "App tài xế — đang hoàn thiện";
    const app = file.replace(/\.jpg$/, "").split("-")[0];
    return (app === "rp" ? "report" : app) + ".etis.vn";
  };

  /* ---------- Bài toán → cách xử lý ---------- */
  const tabs = $("#pb-tabs"), panel = $("#pb-panel");
  function showProblem(i) {
    const p = D.problems[i];
    $$("button", tabs).forEach((b, k) => b.classList.toggle("on", k === i));
    panel.innerHTML = `<div class="solve panel">
      <div class="card before"><h4><i class="fa-solid fa-triangle-exclamation"></i> Hôm nay</h4>
        <p class="big">${p.tab}</p><p>${p.before}</p></div>
      <div class="card after"><h4><i class="fa-solid fa-seedling"></i> Cách làm mới</h4>
        <p class="big">${p.after}</p>
        <div class="trio">
          <div><b><i class="fa-solid fa-user-check"></i> Ai làm</b><p>${p.who}</p></div>
          <div><b><i class="fa-solid fa-arrows-spin"></i> Làm thế nào</b><p>${p.how}</p></div>
          <div><b><i class="fa-solid fa-mobile-screen-button"></i> Công cụ</b><p>${p.tool}</p></div>
        </div>
        <div class="measure"><i class="fa-solid fa-ruler"></i> Đo bằng: ${p.measure}</div></div></div>`;
  }
  tabs.innerHTML = D.problems.map((p, i) => `<button data-i="${i}"><i class="fa-solid ${p.icon}"></i> ${p.tab}</button>`).join("");
  tabs.addEventListener("click", e => { const b = e.target.closest("button"); if (b) showProblem(+b.dataset.i); });
  showProblem(0);

  /* ---------- Hành trình đơn hàng (tự chạy khi thấy) ---------- */
  const steps = $("#j-steps"), detail = $("#j-detail"), bar = $("#j-track span");
  steps.innerHTML = D.journey.map((s, i) => `<div class="step" data-i="${i}">
      <div class="bub"><i class="fa-solid ${s.icon}"></i></div><b>${s.name}</b><small>${s.sub}</small></div>`).join("");
  let jIdx = 0, jTimer = null;
  function showStep(i) {
    jIdx = (i + D.journey.length) % D.journey.length;
    const s = D.journey[jIdx];
    $$(".step", steps).forEach((el, k) => { el.classList.toggle("on", k === jIdx); el.classList.toggle("done", k < jIdx); });
    bar.style.width = (jIdx / (D.journey.length - 1)) * 100 + "%";
    detail.innerHTML = `<div class="panel"><span class="who"><i class="fa-solid fa-user"></i> ${s.who}</span>
        <h3>${s.title}</h3><ul>${s.pts.map(t => `<li><i class="fa-solid fa-circle-check"></i>${t}</li>`).join("")}</ul></div>
      <div class="panel">${shot(s.img, s.url)}</div>`;
  }
  const play = () => { stop(); jTimer = setInterval(() => showStep(jIdx + 1), 5200); $("#j-play").innerHTML = '<i class="fa-solid fa-pause"></i> Dừng'; };
  const stop = () => { clearInterval(jTimer); jTimer = null; $("#j-play").innerHTML = '<i class="fa-solid fa-play"></i> Tự chạy'; };
  steps.addEventListener("click", e => { const s = e.target.closest(".step"); if (s) { stop(); showStep(+s.dataset.i); } });
  $("#j-prev").onclick = () => { stop(); showStep(jIdx - 1); };
  $("#j-next").onclick = () => { stop(); showStep(jIdx + 1); };
  $("#j-play").onclick = () => (jTimer ? stop() : play());
  showStep(0);
  new IntersectionObserver(([e]) => { if (e.isIntersecting && !jTimer) play(); else if (!e.isIntersecting) stop(); }, { threshold: .4 }).observe($("#hanh-trinh"));

  /* ---------- Một ngày theo vị trí ---------- */
  const rlist = $("#r-list"), rday = $("#r-day");
  rlist.innerHTML = D.roles.map((r, i) => `<button data-i="${i}"><i class="fa-solid ${r.icon}"></i>${r.name}</button>`).join("");
  function showRole(i) {
    const r = D.roles[i];
    $$("button", rlist).forEach((b, k) => b.classList.toggle("on", k === i));
    rday.innerHTML = `<div class="panel"><ol class="timeline">${r.day.map(([t, d]) => `<li><time>${t}</time><p>${d}</p></li>`).join("")}</ol>
        <div class="gain"><b>Bớt được:</b> ${r.gain}</div></div>
      <div class="panel">${shot(r.img, appUrl(r.img))}</div>`;
  }
  rlist.addEventListener("click", e => { const b = e.target.closest("button"); if (b) showRole(+b.dataset.i); });
  showRole(0);

  /* ---------- Hiệu ứng xuất hiện + đếm số ---------- */
  const countUp = el => {
    const end = +el.dataset.to, dec = +(el.dataset.dec || 0), t0 = performance.now(), dur = 1400;
    const tick = now => {
      const k = Math.min(1, (now - t0) / dur), v = end * (1 - Math.pow(1 - k, 3));
      el.textContent = v.toFixed(dec).replace(".", ",");
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    $$("[data-to]", e.target).forEach(countUp);
    io.unobserve(e.target);
  }), { threshold: .15 });
  $$(".reveal").forEach(el => io.observe(el));

  /* ---------- Thanh tiến độ, chấm điều hướng, phím tắt ---------- */
  const slides = $$("section.slide");
  const dots = $(".dots");
  dots.innerHTML = slides.map(s => `<a href="#${s.id}" data-label="${s.dataset.label}"></a>`).join("");
  const dotLinks = $$("a", dots);
  let cur = 0;
  const slideObs = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    cur = slides.indexOf(e.target);
    dotLinks.forEach((d, k) => d.classList.toggle("on", k === cur));
    $(".topbar").classList.toggle("show", cur > 0);
  }), { threshold: .45 });
  slides.forEach(s => slideObs.observe(s));

  addEventListener("scroll", () => {
    const h = document.documentElement;
    $(".progress span").style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + "%";
  }, { passive: true });

  const go = i => slides[Math.max(0, Math.min(slides.length - 1, i))].scrollIntoView({ behavior: "smooth" });
  addEventListener("keydown", e => {
    if ($(".lightbox").classList.contains("open")) { if (e.key === "Escape") closeLb(); return; }
    if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(e.key)) { e.preventDefault(); go(cur + 1); }
    if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); go(cur - 1); }
    if (e.key === "Home") go(0);
    if (e.key === "End") go(slides.length - 1);
    if (e.key.toLowerCase() === "f") document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
  });

  /* ---------- Phóng to ảnh ---------- */
  const lb = $(".lightbox");
  const closeLb = () => lb.classList.remove("open");
  document.addEventListener("click", e => {
    const z = e.target.closest("[data-zoom]");
    if (z) { $("img", lb).src = z.dataset.zoom; $("p", lb).textContent = z.dataset.cap || ""; lb.classList.add("open"); }
  });
  lb.addEventListener("click", closeLb);

  /* ---------- Lá bay ở phần mở đầu ---------- */
  const hero = $(".hero");
  for (let i = 0; i < 9; i++) {
    const l = document.createElement("i");
    l.className = "fa-solid fa-leaf leaf";
    l.style.left = Math.random() * 100 + "%";
    l.style.fontSize = 14 + Math.random() * 26 + "px";
    l.style.animationDuration = 12 + Math.random() * 12 + "s";
    l.style.animationDelay = -Math.random() * 20 + "s";
    hero.appendChild(l);
  }
})();
