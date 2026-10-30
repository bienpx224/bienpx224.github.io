/* Dựng các hình động từ noi-dung.js: sơ đồ lãnh đạo → một hệ thống, danh sách chuyển việc,
   cây mở rộng, hành trình đơn (phụ lục), số đếm, điện thoại cập nhật trực tiếp, lá bay. */
window.HU = (() => {
  const D = window.ETIS;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const NS = "http://www.w3.org/2000/svg";
  const IMG = "assets/demo/";

  // Đặt các nút quanh một tâm, vẽ đường nối về tâm
  function ring(box, svg, items, cx, cy, rx, ry, cls, order) {
    items.forEach((it, i) => {
      const slot = order ? order[i] : i;
      const a = (-90 + slot * (360 / items.length)) * Math.PI / 180;
      const x = cx + rx * Math.cos(a), y = cy + ry * Math.sin(a);
      const line = document.createElementNS(NS, "line");
      Object.entries({ x1: x, y1: y, x2: cx, y2: cy }).forEach(([k, v]) => line.setAttribute(k, v));
      line.setAttribute("class", "ln" + (it.add ? " add" : ""));
      line.style.setProperty("--d", i * 0.08 + "s");
      svg.appendChild(line);
      const n = document.createElement("div");
      n.className = cls + (it.add ? " add" : "");
      n.style.cssText = `left:${x}px;top:${y}px;--d:${i * 0.08}s`;
      n.innerHTML = `<i class="fa-solid ${it.icon}"></i><b>${it.name}</b>${it.sub ? `<small><span class="a">${it.sub}</span>${it.ok ? `<span class="b">${it.ok}</span>` : ""}</small>` : ""}`;
      box.appendChild(n);
    });
  }

  function buildHub() {
    const hub = $("#hub");
    ring(hub, $(".hub-lines", hub), D.hub, 360, 330, 270, 245, "hn");
  }

  function buildGrow() {
    const box = $("#grow-nodes"), svg = $(".grow-lines");
    // Nhánh có sẵn ở ô chẵn, nhánh thêm sau ở ô lẻ để xen kẽ quanh vòng
    let now = 0, add = 0;
    const order = D.grow.map(g => (g.add ? add++ * 2 + 1 : now++ * 2));
    ring(box, svg, D.grow, 300, 270, 235, 205, "gn", order);
  }

  function buildHandover() {
    $("#ho-list").innerHTML = D.handover.map((h, i) => `<div class="ho" style="--d:${0.25 + i * 0.22}s">
      <span class="task">${h.task}</span><i class="fa-solid fa-arrow-right arr"></i>
      <span class="to"><i class="fa-solid ${h.icon}"></i>${h.to}</span></div>`).join("");
  }

  // Phụ lục: hành trình đơn, bấm từng chặng để xem
  function buildJourney() {
    const steps = $("#j-steps"), detail = $("#j-detail"), bar = $("#j-track span");
    steps.innerHTML = D.journey.map((s, i) => `<button class="step" data-i="${i}">
      <span class="bub"><i class="fa-solid ${s.icon}"></i></span><b>${s.name}</b></button>`).join("");
    const show = i => {
      const s = D.journey[i];
      $$(".step", steps).forEach((el, k) => { el.classList.toggle("on", k === i); el.classList.toggle("done", k < i); });
      bar.style.width = (i / (D.journey.length - 1)) * 100 + "%";
      const img = s.img
        ? `<div class="shot" data-zoom="${IMG + s.img}" data-cap="${s.url} · số liệu minh họa"><div class="bar"><i></i><i></i><i></i><em>${s.url}</em></div><img src="${IMG + s.img}" alt="Màn hình ${s.url}"></div>`
        : `<div class="shot empty"><i class="fa-solid fa-truck-fast"></i><b>${s.url}</b></div>`;
      detail.innerHTML = `<div class="pop"><span class="who"><i class="fa-solid fa-user"></i> ${s.who}</span><h3>${s.title}</h3>
        <ul>${s.pts.map(t => `<li><i class="fa-solid fa-circle-check"></i>${t}</li>`).join("")}</ul></div><div class="pop">${img}</div>`;
    };
    steps.addEventListener("click", e => { const b = e.target.closest(".step"); if (b) show(+b.dataset.i); });
    show(0);
  }

  // Slide Xem thật: thẻ ảnh (bấm phóng to) + nút mở hệ thống demo
  function buildDemo() {
    $("#demo6").innerHTML = D.demo.map(d => `<div class="dcard">
      <div class="shot" data-zoom="${IMG + d.img}" data-cap="${d.url.replace("https://", "")} · số liệu minh họa"><div class="bar"><i></i><i></i><i></i><em>${d.url.replace("https://", "")}</em></div><img src="${IMG + d.img}" alt="${d.title}"></div>
      <div class="dc-b"><div><b>${d.title}</b><small>${d.sub}</small></div>
      <a href="${d.url}" target="_blank" rel="noopener">Mở bản thử <i class="fa-solid fa-arrow-up-right-from-square"></i></a></div></div>`).join("");
  }

  // Thanh các giá trị trên đầu mỗi slide giá trị
  function buildValuePills() {
    const vals = $$(".slide.value");
    vals.forEach(s => {
      const k = +s.dataset.value;
      const pills = document.createElement("div");
      pills.className = "vpills";
      pills.innerHTML = vals.map((v, i) => `<span class="${i === k ? "on" : i < k ? "done" : ""}">${i + 1}. ${v.dataset.label}</span>`).join("");
      $(".vhead", s).appendChild(pills);
    });
  }

  const countUp = el => {
    const end = +el.dataset.to, t0 = performance.now(), dur = 1300;
    const tick = now => {
      const k = Math.min(1, (now - t0) / dur);
      el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  // Đếm số cho những số vừa hiện (không nằm trong bước chưa mở)
  function count(root) {
    $$("[data-to]", root).forEach(el => {
      const hidden = el.closest("[data-step]:not(.on)");
      if (!hidden && !el.dataset.done) { el.dataset.done = 1; countUp(el); }
    });
  }
  const resetCount = root => $$("[data-to]", root).forEach(el => { delete el.dataset.done; el.textContent = 0; });

  // Điện thoại slide 3: số nhảy như đang chạy thật
  function liveTicker() {
    const phone = $(".phone.live");
    let mins = 9 * 60 + 42;
    setInterval(() => {
      if (!phone.closest(".slide.active") && !document.body.classList.contains("flow")) return;
      mins++;
      $(".clock", phone).textContent = `${String(Math.floor(mins / 60) % 24).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
      $$("[data-live]", phone).forEach(el => {
        if (Math.random() < 0.55) {
          el.textContent = +el.textContent + 1 + Math.floor(Math.random() * (+el.dataset.live > 100 ? 9 : 2));
          el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump");
        }
      });
    }, 2200);
  }

  function leaves() {
    const hero = $(".hero");
    for (let i = 0; i < 9; i++) {
      const l = document.createElement("i");
      l.className = "fa-solid fa-leaf leaf";
      l.style.cssText = `left:${Math.random() * 100}%;font-size:${14 + Math.random() * 26}px;animation-duration:${12 + Math.random() * 12}s;animation-delay:${-Math.random() * 20}s`;
      hero.appendChild(l);
    }
  }

  buildHub(); buildGrow(); buildHandover(); buildDemo(); buildJourney(); buildValuePills(); liveTicker(); leaves();
  return { count, resetCount };
})();
