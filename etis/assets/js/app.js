/* Điều khiển trang trình bày: từng slide một, bấm → mở từng bước (như PowerPoint),
   cửa sổ ghi chú người nói (N), phụ lục (A), toàn màn hình (F), phóng to ảnh.
   Màn hẹp (điện thoại) chuyển sang chế độ cuộn, hiện đủ mọi bước. */
(() => {
  const D = window.ETIS, HU = window.HU;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const W = 1600, H = 900;

  const all = $$("section.slide");
  const main = all.filter(s => !s.hasAttribute("data-appendix"));
  const apx = all.filter(s => s.hasAttribute("data-appendix"));
  const maxStep = s => Math.max(0, ...$$("[data-step]", s).map(e => +e.dataset.step));

  let seq = main, idx = 0, at = 0, flow = false;

  /* ---------- Khung: co giãn 1600×900 vừa màn hình, hoặc cuộn trên điện thoại ---------- */
  function layout() {
    flow = innerWidth < 860;
    document.body.classList.toggle("flow", flow);
    if (flow) {
      $$("[data-step]").forEach(e => e.classList.add("on"));
      // Sơ đồ vẽ theo toạ độ cố định: thu nhỏ theo bề ngang màn
      [[".hub", 720], [".grow", 600]].forEach(([q, w]) => $(q).style.setProperty("--hz", Math.min(1, (innerWidth - 32) / w)));
      HU.count(document);
      return;
    }
    document.documentElement.style.setProperty("--s", Math.min(innerWidth / W, innerHeight / H));
    show(idx, at, true);
  }

  /* ---------- Hiện slide i, mở tới bước a ---------- */
  function show(i, a = 0, quiet = false) {
    i = Math.max(0, Math.min(seq.length - 1, i));
    const s = seq[i], changed = s !== seq[idx] || !s.classList.contains("active");
    a = Math.max(0, Math.min(maxStep(s), a));
    if (changed) {
      all.forEach(x => x.classList.remove("active", "back"));
      if (!quiet && i < idx) s.classList.add("back");
      s.classList.add("active");
      HU.resetCount(s);
    }
    idx = i; at = a;
    $$("[data-step]", s).forEach(e => e.classList.toggle("on", +e.dataset.step <= at));
    s.dataset.at = at;
    document.body.classList.toggle("on-dark", s.classList.contains("dark"));
    HU.count(s);

    const inApx = seq === apx;
    $("#c-num").textContent = (inApx ? "Phụ lục " : "") + (idx + 1) + " / " + seq.length;
    $(".bar-top span").style.width = ((idx + (maxStep(s) ? at / (maxStep(s) + 1) : 0)) / (seq.length - 1 || 1)) * 100 + "%";
    $("#c-app").classList.toggle("on", inApx);
    $$("#pager a").forEach((p, k) => p.classList.toggle("on", !inApx && k === idx));
    history.replaceState(null, "", "#" + s.id + (at ? "/" + at : ""));
    notes.render();
  }

  const next = () => (at < maxStep(seq[idx]) ? show(idx, at + 1) : idx < seq.length - 1 && show(idx + 1, 0));
  const prev = () => (at > 0 ? show(idx, at - 1) : idx > 0 && show(idx - 1, maxStep(seq[idx - 1])));
  function toggleAppendix() {
    if (seq === apx) { seq = main; show(main.length - 1, maxStep(main[main.length - 1])); }
    else { seq = apx; show(0); }
  }

  /* ---------- Cửa sổ ghi chú người nói ---------- */
  const notes = (() => {
    let win = null, t0 = Date.now(), tSlide = Date.now(), lastId = "";
    const fmt = ms => { const s = Math.floor(ms / 1000); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
    const css = `body{font:16px/1.5 "Be Vietnam Pro",system-ui,sans-serif;margin:0;padding:20px;background:#0f241e;color:#eaf5db}
      h1{font-size:22px;margin:4px 0 2px;color:#fff}.m{color:#92c347;font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
      .t{display:flex;gap:16px;margin:12px 0;font-size:28px;font-weight:800}.t span{background:#17332b;border-radius:12px;padding:6px 14px}
      .t small{display:block;font-size:11px;font-weight:600;color:#9fc3b2}.over{color:#f0a37f}
      ul{padding-left:20px}li{margin:8px 0;font-size:19px}.ask{background:#f5e199;color:#17332b;border-radius:12px;padding:10px 14px;font-weight:600;margin-top:12px}
      .nx{margin-top:18px;color:#9fc3b2;font-size:14px}.k{margin-top:18px;font-size:12px;color:#6f9483}`;
    function render() {
      if (!win || win.closed) return;
      const s = seq[idx], n = D.notes[s.id] || { say: [] };
      if (s.id !== lastId) { tSlide = Date.now(); lastId = s.id; }
      const nx = at < maxStep(s) ? "Bước tiếp trên slide này" : (seq[idx + 1] ? seq[idx + 1].dataset.label : "Hết");
      win.document.body.innerHTML = `<div class="m">Slide ${idx + 1}/${seq.length} · bước ${at}/${maxStep(s)}</div>
        <h1>${s.dataset.label}</h1>
        <div class="t"><span id="tt"><small>Tổng</small>${fmt(Date.now() - t0)}</span><span id="ts"><small>Slide này · gợi ý ${n.min || 0}′</small>${fmt(Date.now() - tSlide)}</span></div>
        <ul>${n.say.map(x => `<li>${x}</li>`).join("")}</ul>${n.ask ? `<div class="ask">Hỏi lãnh đạo: ${n.ask}</div>` : ""}
        <div class="nx">Tiếp theo: ${nx}</div><div class="k">→ / ← chuyển · R đặt lại giờ · A phụ lục</div>`;
    }
    setInterval(() => {
      if (!win || win.closed) return;
      const tt = win.document.getElementById("tt"), ts = win.document.getElementById("ts"), n = D.notes[seq[idx].id] || {};
      if (tt) tt.lastChild.textContent = fmt(Date.now() - t0);
      if (ts) { ts.lastChild.textContent = fmt(Date.now() - tSlide); ts.classList.toggle("over", n.min && Date.now() - tSlide > n.min * 60000); }
    }, 1000);
    function open() {
      if (win && !win.closed) { win.focus(); return; }
      win = window.open("", "etis-nguoi-noi", "width=560,height=780");
      if (!win) { alert("Trình duyệt chặn cửa sổ mới. Cho phép cửa sổ bật lên rồi bấm N lại."); return; }
      win.document.title = "Ghi chú người nói · ETIS";
      const st = win.document.createElement("style"); st.textContent = css; win.document.head.appendChild(st);
      win.addEventListener("keydown", onKey);
      t0 = tSlide = Date.now(); lastId = ""; render();
    }
    return { render, open, reset: () => { t0 = tSlide = Date.now(); render(); } };
  })();

  /* ---------- Phím tắt, nút bấm ---------- */
  function onKey(e) {
    if ($(".lightbox").classList.contains("open")) { if (e.key === "Escape") closeLb(); return; }
    if (flow) return;
    const k = e.key;
    if (["ArrowRight", "ArrowDown", "PageDown", " ", "Enter"].includes(k)) { e.preventDefault(); next(); }
    else if (["ArrowLeft", "ArrowUp", "PageUp", "Backspace"].includes(k)) { e.preventDefault(); prev(); }
    else if (k === "Home") show(0);
    else if (k === "End") show(seq.length - 1, maxStep(seq[seq.length - 1]));
    else if (/^[1-9]$/.test(k) && seq === main) show(+k - 1);
    else if (k.toLowerCase() === "n") notes.open();
    else if (k.toLowerCase() === "r") notes.reset();
    else if (k.toLowerCase() === "a") toggleAppendix();
    else if (k.toLowerCase() === "f") document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
  }
  addEventListener("keydown", onKey);
  $("#c-next").onclick = next;
  $("#c-prev").onclick = prev;
  $("#c-notes").onclick = () => notes.open();
  $("#c-app").onclick = toggleAppendix;
  $("#pager").innerHTML = main.map((s, k) => `<a title="${k + 1}. ${s.dataset.label}"></a>`).join("");
  $$("#pager a").forEach((a, k) => (a.onclick = () => { seq = main; show(k); }));

  /* ---------- Phóng to ảnh ---------- */
  const lb = $(".lightbox");
  const closeLb = () => lb.classList.remove("open");
  document.addEventListener("click", e => {
    const z = e.target.closest("[data-zoom]");
    if (z) { $("img", lb).src = z.dataset.zoom; $("p", lb).textContent = z.dataset.cap || ""; lb.classList.add("open"); }
  });
  lb.addEventListener("click", closeLb);

  /* ---------- Mở lại đúng slide theo địa chỉ (#id/bước) ---------- */
  const [hid, hat] = location.hash.slice(1).split("/");
  const start = all.find(s => s.id === hid);
  if (start) { seq = start.hasAttribute("data-appendix") ? apx : main; idx = seq.indexOf(start); at = +hat || 0; }
  addEventListener("resize", layout);
  layout();
})();
