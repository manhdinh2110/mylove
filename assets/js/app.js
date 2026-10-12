(() => {
  "use strict";

  const DEFAULT = window.LOVE_DATA;
  if (!DEFAULT) { console.error("Không tìm thấy LOVE_DATA — kiểm tra file data.js"); return; }

  /* =========================================================
     Helpers
     ========================================================= */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (s = "") => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = n => new Intl.NumberFormat("vi-VN").format(Math.round(+n || 0)) + " đ";
  const clone = o => JSON.parse(JSON.stringify(o));
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } },
    del(k) { try { localStorage.removeItem(k); } catch {} }
  };
  const hashStr = s => { let h = 5381; for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i); return (h >>> 0).toString(36); };
  const toMin = t => { const [h, m] = String(t || "0:0").split(":").map(Number); return (h || 0) * 60 + (m || 0); };
  const fmtDate = iso => {
    if (!iso) return "Chưa chọn ngày";
    const d = new Date(iso + "T00:00:00+07:00");
    if (isNaN(d)) return iso;
    return d.toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Ho_Chi_Minh" });
  };
  const addDays = (iso, n) => {
    const d = new Date((iso || new Date().toISOString().slice(0, 10)) + "T12:00:00Z");
    d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10);
  };
  const nowVN = () => {
    const p = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false })
      .formatToParts(new Date()).reduce((a, x) => (a[x.type] = x.value, a), {});
    return { date: `${p.year}-${p.month}-${p.day}`, minutes: (+p.hour % 24) * 60 + +p.minute };
  };
  const q = s => encodeURIComponent([s.place, s.address].filter(Boolean).join(", "));
  const mapsUrl = s => "https://www.google.com/maps/search/?api=1&query=" + q(s);
  const dirUrl = s => "https://www.google.com/maps/dir/?api=1&destination=" + q(s);
  const getPath = (o, p) => p.split(".").reduce((a, k) => a?.[k], o);
  const setPath = (o, p, v) => { const ks = p.split("."); const last = ks.pop(); const t = ks.reduce((a, k) => (a[k] ??= {}), o); if (v === "" || v === undefined) delete t[last]; else t[last] = v; };

  /* =========================================================
     Icons
     ========================================================= */
  const P = {
    food: '<path d="M4 3v8a3 3 0 0 0 3 3v7M10 3v8M7 3v8M17 21V3c-2 1.5-3 4-3 7v4h3"/>',
    place: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    move: '<path d="M3 13h18M5 13l1.5-5A2 2 0 0 1 8.4 6.5h7.2a2 2 0 0 1 1.9 1.5L19 13v5h-2M5 13v5h2M7 18a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0M14 18a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0"/>',
    stay: '<path d="M3 20V8M21 20v-6a3 3 0 0 0-3-3H10v9M3 16h18M7 11.5a1.5 1.5 0 1 0 0-.01"/>',
    rest: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    shop: '<path d="M5 8h14l-1 12H6L5 8zM9 8V6a3 3 0 0 1 6 0v2"/>',
    coffee: '<path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9zM17 10h1.5a2.5 2.5 0 0 1 0 5H17M8 3v3M12 3v3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    route: '<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h7a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h7"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    heart: '<path d="M12 21.2l-1.45-1.32C5.4 15.24 2 12.16 2 8.4 2 5.32 4.42 2.9 7.5 2.9c1.74 0 3.41.81 4.5 2.09A6 6 0 0 1 16.5 2.9c3.08 0 5.5 2.42 5.5 5.5 0 3.76-3.4 6.84-8.55 11.49L12 21.2z"/>',
    map: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14"/>',
    nav: '<path d="m3 11 18-8-8 18-2-8-8-2z"/>',
    all: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    up: '<path d="m6 15 6-6 6 6"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    alert: '<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/>',
    gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M5 12v9h14v-9M12 8C10.5 5 7 4.5 7 6.5S9.5 8 12 8zm0 0c1.5-3 5-3.5 5-1.5S14.5 8 12 8z"/>'
  };
  const icon = k => `<svg viewBox="0 0 24 24" aria-hidden="true">${P[k] || P.place}</svg>`;

  // Tên hai đứa — cố định, chỉ đổi được ở đây
  const NAMES = { me: "Dinh", you: "Kiều Mi" };

  const TYPES = {
    food:   { label: "Ăn uống",   c: "var(--t-food)" },
    coffee: { label: "Cà phê",    c: "var(--t-coffee)" },
    place:  { label: "Tham quan", c: "var(--t-place)" },
    move:   { label: "Di chuyển", c: "var(--t-move)" },
    stay:   { label: "Lưu trú",   c: "var(--t-stay)" },
    shop:   { label: "Mua sắm",   c: "var(--t-shop)" },
    rest:   { label: "Nghỉ ngơi", c: "var(--t-rest)" }
  };

  /* ---------- Cài đặt hiển thị ---------- */
  const DEFAULT_SETTINGS = {
    countdown: true, loveStrip: true, showLetter: true, filters: true,
    budget: true, checklist: true, tips: true,
    cost: true, perPerson: false, details: true, note: true, love: true, mapBtns: true, compact: false,
    clock24: true, font: "m", accent: "rose",
    surprise: false, hearts: false, flowers: true,
    music: true, musicPrompt: true, letterMusic: true, shuffle: false, repeat: true
  };
  const ACCENTS = {
    rose: { label: "Hồng rượu", c: "#b23a48" },
    blush: { label: "Hồng phấn", c: "#e88aa6" },
    peach: { label: "Cam đào", c: "#cf5f3d" },
    lavender: { label: "Tím oải hương", c: "#7656b8" },
    ocean: { label: "Xanh biển", c: "#2c6aa0" },
    sage: { label: "Xanh rêu", c: "#4a7a58" }
  };
  const SETTING_GROUPS = [
    { title: "Mục hiển thị", items: [
      ["countdown", "Đồng hồ đếm ngược"],
      ["loveStrip", "Dải “đã bên nhau … ngày”"],
      ["showLetter", "Thư tay", "Phong bì nhỏ, chạm để mở"],
      ["filters", "Bộ lọc loại hoạt động"],
      // ["budget", "Mục Ngân sách"], // tạm ẩn khỏi Cài đặt
      ["checklist", "Mục Chuẩn bị"],
      ["tips", "Mục Lưu ý"]
    ]},
    { title: "Chi tiết mỗi hoạt động", items: [
      // ["cost", "Chi phí", "Tắt sẽ ẩn mọi con số tiền, kể cả mục Ngân sách"], // tạm ẩn khỏi Cài đặt
      ["details", "Địa chỉ & cách di chuyển"],
      ["note", "Ghi chú / mẹo"],
      ["love", "Lời nhắn yêu thương"],
      ["mapBtns", "Nút Chỉ đường & Bản đồ"],
      ["compact", "Chế độ gọn", "Chỉ giữ giờ, tên và địa điểm"]
    ]}
  ];
  const S = () => data.settings;
  const fmtTime = t => {
    if (!t) return "";
    if (S().clock24) return t;
    const [h, m] = t.split(":").map(Number);
    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "SA" : "CH"}`;
  };
  const costText = n => S().perPerson ? `${money(n / 2)}/người` : money(n);
  const revealed = new Set((() => { try { return JSON.parse(sessionStorage.getItem("revealed") || "[]"); } catch { return []; } })());

  /* =========================================================
     State & persistence
     ========================================================= */
  const KEY = "loveData.v1";
  const BACKUP_KEY = "loveData.backup";
  const BASE = hashStr(JSON.stringify(DEFAULT)); // dấu vân tay của data.js hiện tại

  const valid = d => d && typeof d === "object" && d.couple && d.trip && Array.isArray(d.days) && d.days.length > 0 && d.days.every(x => x && Array.isArray(x.stops));
  const normalize = d => {
    d.couple ??= {}; d.trip ??= {};
    Object.assign(d.couple, NAMES); // tên cố định, không sửa trên web
    d.settings = { ...DEFAULT_SETTINGS, ...(d.settings || {}) };
    if (!ACCENTS[d.settings.accent]) d.settings.accent = "rose";
    d.letter = { title: "", body: "", sign: "", ...(d.letter || {}) };
    d.music = { songs: Array.isArray(d.music?.songs) ? d.music.songs.filter(Boolean).map(x => ({ title: "", artist: "", url: "", ...x })) : [] };
    // Bài nào data.js đã gắn link (vd file music/*.mp3) thì luôn dùng link đó, kể cả khi bản trên mạng khác
    (DEFAULT.music?.songs || []).forEach(f => { if (!f.url) return; const x = d.music.songs.find(y => y.title === f.title); if (x) x.url = f.url; });
    d.checklist = Array.isArray(d.checklist) ? d.checklist : [];
    d.tips = Array.isArray(d.tips) ? d.tips : [];
    d.days.forEach(day => {
      day.stops = day.stops.filter(Boolean);
      day.stops.forEach(s => { if (!TYPES[s.type]) s.type = "place"; if (s.cost !== undefined) s.cost = +s.cost || 0; });
      day.stops.sort((a, b) => toMin(a.time) - toMin(b.time));
    });
    d.checklist.forEach(g => { g.items = Array.isArray(g.items) ? g.items : []; });
    return d;
  };

  let data;
  let editing = false;
  let active = 0;
  let filter = "all";
  let firstRender = true;
  const undoStack = [];

  /* ---------- Đồng bộ realtime (Firebase) ---------- */
  const CLOUD = !!(window.LoveCloud && LoveCloud.ready());
  document.body.classList.toggle("cloud", CLOUD); // đã đồng bộ → ẩn nút chia sẻ / tải file
  const planForCloud = () => { const d = clone(data); delete d.login; return d; };
  const hhmm = () => new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  const setStatus = txt => { const st = $("#saveStatus"); st.textContent = txt; st.classList.remove("flash"); void st.offsetWidth; st.classList.add("flash"); };
  const pushCheck = () => { if (CLOUD) LoveCloud.write("check", [...checked]).catch(() => toast("Chưa lưu được checklist lên mạng — kiểm tra kết nối")); };

  const save = () => {
    const ok = store.set(KEY, { base: BASE, savedAt: Date.now(), data });
    if (CLOUD) {
      setStatus("Đang lưu lên mạng…");
      LoveCloud.write("plan", planForCloud())
        .then(() => setStatus(`Đã lưu lúc ${hhmm()} · hai máy cùng thấy`))
        .catch(() => setStatus("Chưa lưu được lên mạng — kiểm tra kết nối, sửa tiếp sẽ thử lại"));
      return;
    }
    setStatus(ok ? `Đã lưu lúc ${hhmm()} · trên máy này` : "Không lưu được (trình duyệt chặn bộ nhớ) — hãy tải data.js");
  };
  const mutate = (fn, msg) => {
    undoStack.push(JSON.stringify(data));
    if (undoStack.length > 60) undoStack.shift();
    fn(data);
    normalize(data); save(); render();
    if (msg) toast(msg, { label: "Hoàn tác", fn: undo });
  };
  const undo = () => {
    if (!undoStack.length) return toast("Không còn gì để hoàn tác");
    data = JSON.parse(undoStack.pop()); save(); render(); toast("Đã hoàn tác");
  };

  /* ---------- Chia sẻ qua link (nén dữ liệu vào URL) ---------- */
  const b64u = bytes => { let s = ""; bytes.forEach(b => s += String.fromCharCode(b)); return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); };
  const unb64u = str => { const s = atob(str.replace(/-/g, "+").replace(/_/g, "/")); return Uint8Array.from(s, c => c.charCodeAt(0)); };
  const encodeShare = async obj => {
    const bytes = new TextEncoder().encode(JSON.stringify(obj));
    if ("CompressionStream" in window) {
      const buf = await new Response(new Blob([bytes]).stream().pipeThrough(new CompressionStream("deflate-raw"))).arrayBuffer();
      return "z" + b64u(new Uint8Array(buf));
    }
    return "j" + b64u(bytes);
  };
  const decodeShare = async str => {
    const bytes = unb64u(str.slice(1));
    if (str[0] === "z") {
      const txt = await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"))).text();
      return JSON.parse(txt);
    }
    return JSON.parse(new TextDecoder().decode(bytes));
  };

  /* =========================================================
     Toast
     ========================================================= */
  let toastTimer;
  function toast(msg, action, ms = 4500) {
    const t = $("#toast");
    t.innerHTML = `<span>${esc(msg)}</span>${action ? `<button type="button">${esc(action.label)}</button>` : ""}`;
    if (action) $("button", t).onclick = () => { t.hidden = true; action.fn(); };
    t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, ms);
  }

  /* =========================================================
     Modal form
     ========================================================= */
  const modal = $("#modal");
  function openForm({ title, fields, values = {}, submit = "Lưu", onSave, onDelete }) {
    const fieldHTML = f => {
      const v = getPath(values, f.k) ?? "";
      const id = "f_" + f.k.replace(/\./g, "_");
      const req = f.req ? "required" : "";
      let input;
      if (f.type === "textarea") input = `<textarea id="${id}" name="${f.k}" rows="${f.rows || 2}" ${req} placeholder="${esc(f.ph || "")}">${esc(v)}</textarea>`;
      else if (f.type === "select") input = `<select id="${id}" name="${f.k}">${Object.entries(f.options).map(([k, o]) => `<option value="${k}" ${k === v ? "selected" : ""}>${esc(o.label || o)}</option>`).join("")}</select>`;
      else input = `<input id="${id}" name="${f.k}" type="${f.type || "text"}" value="${esc(v)}" ${req} ${f.type === "number" ? 'min="0" step="1000" inputmode="numeric"' : ""} placeholder="${esc(f.ph || "")}" />`;
      return `<label class="field ${f.half ? "field--half" : ""}" for="${id}"><span>${esc(f.label)}${f.req ? " *" : ""}</span>${input}${f.hint ? `<small>${esc(f.hint)}</small>` : ""}</label>`;
    };
    modal.innerHTML = `
      <form method="dialog" class="modal__form" novalidate>
        <header class="modal__head">
          <h3 id="modalTitle">${esc(title)}</h3>
          <button type="button" class="icon-btn icon-btn--sm" data-close aria-label="Đóng">${icon("x")}</button>
        </header>
        <div class="modal__body">${fields.map(fieldHTML).join("")}</div>
        <footer class="modal__foot">
          ${onDelete ? `<button type="button" class="btn btn--danger" data-delete>${icon("trash")} Xoá</button>` : "<span></span>"}
          <div><button type="button" class="btn" data-close>Huỷ</button>
          <button type="submit" class="btn btn--primary">${esc(submit)}</button></div>
        </footer>
      </form>`;
    const form = $("form", modal);
    $$("[data-close]", modal).forEach(b => b.onclick = () => modal.close());
    if (onDelete) $("[data-delete]", modal).onclick = () => { modal.close(); onDelete(); };
    form.onsubmit = e => {
      e.preventDefault();
      const bad = fields.find(f => f.req && !form.elements[f.k].value.trim());
      if (bad) { form.elements[bad.k].focus(); form.elements[bad.k].classList.add("invalid"); return; }
      const out = {};
      fields.forEach(f => {
        let v = form.elements[f.k].value.trim();
        if (f.type === "number") v = v === "" ? "" : Math.max(0, +v || 0);
        setPath(out, f.k, v);
      });
      modal.close();
      onSave(out);
    };
    modal.showModal();
    setTimeout(() => form.querySelector("input, textarea, select")?.focus(), 30);
  }
  modal.addEventListener("click", e => { if (e.target === modal) modal.close(); });

  const STOP_FIELDS = [
    { k: "time", label: "Bắt đầu", type: "time", req: true, half: true },
    { k: "end", label: "Kết thúc", type: "time", half: true },
    { k: "type", label: "Loại", type: "select", options: TYPES, half: true },
    { k: "cost", label: "Chi phí 2 người (VNĐ)", type: "number", half: true, ph: "0" },
    { k: "title", label: "Hoạt động", req: true, ph: "VD: Ăn sáng phở" },
    { k: "place", label: "Địa điểm", ph: "Tên quán / nơi chốn", hint: "Dùng để tìm trên Google Maps" },
    { k: "address", label: "Địa chỉ", ph: "Số nhà, đường, quận" },
    { k: "transport", label: "Di chuyển", ph: "VD: Grab Bike ~10 phút" },
    { k: "note", label: "Ghi chú / mẹo", type: "textarea" },
    { k: "love", label: "Lời nhắn cho người ấy", type: "textarea", rows: 2 }
  ];
  const DAY_FIELDS = [
    { k: "label", label: "Tên ngày", req: true, half: true, ph: "VD: Thứ Bảy" },
    { k: "date", label: "Ngày", type: "date", req: true, half: true },
    { k: "theme", label: "Chủ đề", req: true },
    { k: "summary", label: "Tóm tắt", type: "textarea" }
  ];
  const TRIP_FIELDS = [
    { k: "couple.since", label: "Ngày bắt đầu yêu", type: "date", half: true },
    { k: "trip.stay", label: "Chỗ ở", half: true },
    { k: "couple.tagline", label: "Câu thương", type: "textarea" },
    { k: "trip.title", label: "Tên chuyến đi", req: true, hint: "Dùng dấu — để phần sau in nghiêng màu hồng" },
    { k: "trip.subtitle", label: "Mô tả ngắn" },
    { k: "trip.from", label: "Xuất phát từ", half: true },
    { k: "trip.to", label: "Đến", half: true },
    { k: "trip.weather", label: "Thời tiết" }
  ];

  /* =========================================================
     Render
     ========================================================= */
  const dayCost = d => d.stops.reduce((n, s) => n + (+s.cost || 0), 0);
  const tripStart = () => {
    const d = data.days[0];
    return new Date(`${d.date}T${(d.stops[0]?.time || "00:00").padStart(5, "0")}:00+07:00`).getTime();
  };
  const tripEnd = () => new Date(`${data.days.at(-1).date}T23:59:59+07:00`).getTime();

  function renderHero() {
    const { couple: c, trip: t } = data;
    const names = `${c.me || "Anh"} & ${c.you || "Em"}`;
    ["#brandNames", "#footNames", "#loveNames"].forEach(s => $(s).textContent = names);
    $("#loveTag").textContent = c.tagline || "";
    $("#heroRoute").textContent = [t.from, t.to].filter(Boolean).join(" → ");
    const [a, ...b] = (t.title || "Hành trình của hai ta").split("—");
    $("#heroTitle").innerHTML = b.length ? `${esc(a.trim())} <em>${esc(b.join("—").trim())}</em>` : esc(a);
    $("#heroSub").textContent = t.subtitle || "";
    document.title = `${t.title || "Hành trình"} · ${names}`;
    const days = c.since ? Math.floor((Date.now() - new Date(c.since + "T00:00:00+07:00")) / 864e5) : 0;
    $("#loveDays").textContent = Math.max(0, days || 0).toLocaleString("vi-VN");
    $(".love-strip").hidden = !c.since;
    const n = data.days.reduce((s, d) => s + d.stops.length, 0);
    $("#facts").innerHTML = [
      ["Thời gian", `${data.days.length} ngày · ${n} hoạt động`],
      ["Chỗ ở", t.stay], ["Thời tiết", t.weather]
    ].filter(f => f[1]).map(([k, v]) => `<li>${esc(k)}: <strong>${esc(v)}</strong></li>`).join("");
  }

  function stopHTML(s, di, si, today, todayIdx) {
    const T = TYPES[s.type] || TYPES.place;
    const start = toMin(s.time), end = s.end ? toMin(s.end) : start + 60;
    const state = di === todayIdx && !editing ? (today.minutes >= end ? "is-past" : today.minutes >= start ? "is-now" : "") : "";
    const hasPlace = s.place && s.place !== "—";
    const dur = s.end && end > start ? ` · ${end - start} phút` : "";
    const key = `${data.days[di].date}|${s.time}|${s.title}`;
    const timeCol = `<div class="stop__time"><strong>${esc(fmtTime(s.time))}</strong>${s.end ? `<small>→ ${esc(fmtTime(s.end))}</small>` : ""}</div>`;
    const isSecret = S().surprise && !editing && !revealed.has(key) && new Date(`${data.days[di].date}T${s.time}:00+07:00`).getTime() > Date.now();
    if (isSecret) return `
      <li class="stop reveal is-secret" data-type="${esc(s.type)}" style="--c:var(--accent)">
        ${timeCol}
        <div class="stop__dot">${icon("gift")}</div>
        <article class="card card--secret">
          <div class="card__type">Bất ngờ</div>
          <h4 class="card__title">Một điều nhỏ đang chờ ${esc(data.couple.you || "em")}…</h4>
          <p class="secret__hint">Sẽ tự hé lộ lúc ${esc(fmtTime(s.time))}${data.days.length > 1 ? `, ${esc(data.days[di].label)}` : ""}.</p>
          <div class="card__actions"><button class="btn" type="button" data-act="reveal" data-key="${esc(key)}">${icon("gift")} Hé lộ sớm</button></div>
        </article>
      </li>`;
    return `
      <li class="stop reveal ${state}" data-type="${esc(s.type)}" style="--c:${T.c}">
        ${timeCol}
        <div class="stop__dot">${icon(s.type)}</div>
        <article class="card">
          <div class="card__top">
            <div>
              <div class="card__type">${T.label}${state === "is-now" ? " · Đang diễn ra" : ""}</div>
              <h4 class="card__title">${esc(s.title)}</h4>
            </div>
            ${s.cost ? `<span class="card__cost">${costText(s.cost)}</span>` : ""}
          </div>
          <div class="card__rows">
            ${hasPlace ? `<div class="row row--place">${icon("map")}<span><b>${esc(s.place)}</b></span></div>` : ""}
            ${s.address ? `<div class="row row--addr">${icon("pin")}<span>${esc(s.address)}</span></div>` : ""}
            ${s.transport ? `<div class="row row--move">${icon("route")}<span><b>Di chuyển:</b> ${esc(s.transport)}</span></div>` : ""}
            <div class="row row--time">${icon("clock")}<span>${esc(fmtTime(s.time))}${s.end ? " – " + esc(fmtTime(s.end)) : ""}${dur}</span></div>
          </div>
          ${s.note ? `<p class="card__note">${esc(s.note)}</p>` : ""}
          ${s.love ? `<p class="card__love">${icon("heart")}<span>${esc(s.love)}</span></p>` : ""}
          <div class="card__actions">
            ${hasPlace ? `<a class="btn btn--primary view-only map-btn" href="${dirUrl(s)}" target="_blank" rel="noopener">${icon("nav")} Chỉ đường</a>
            <a class="btn view-only map-btn" href="${mapsUrl(s)}" target="_blank" rel="noopener">${icon("map")} Xem bản đồ</a>` : ""}
            <button class="btn edit-only" type="button" data-act="edit-stop" data-d="${di}" data-s="${si}">${icon("edit")} Sửa</button>
            <button class="btn edit-only" type="button" data-act="dup-stop" data-d="${di}" data-s="${si}">${icon("copy")} Nhân bản</button>
            <button class="btn btn--danger edit-only" type="button" data-act="del-stop" data-d="${di}" data-s="${si}">${icon("trash")} Xoá</button>
          </div>
        </article>
      </li>`;
  }

  function renderPlan() {
    const today = nowVN();
    const todayIdx = data.days.findIndex(d => d.date === today.date);
    active = Math.min(Math.max(0, active), data.days.length - 1);

    $("#dayTabs").innerHTML = data.days.map((d, i) => `
      <button class="daytab" role="tab" id="tab-${i}" aria-controls="panel-${i}" aria-selected="${i === active}" tabindex="${i === active ? 0 : -1}" type="button" data-i="${i}">
        <span class="daytab__label">${esc(d.label)}${i === todayIdx ? '<span class="daytab__today">Hôm nay</span>' : ""}</span>
        <span class="daytab__date">${esc(fmtDate(d.date))}</span>
      </button>`).join("") +
      `<button class="daytab daytab--add edit-only" type="button" data-act="add-day">${icon("plus")} Thêm ngày</button>`;

    const used = [...new Set(data.days.flatMap(d => d.stops.map(s => s.type)))].filter(t => TYPES[t]);
    if (filter !== "all" && !used.includes(filter)) filter = "all";
    $("#filters").innerHTML = [`<button class="chip" type="button" data-f="all" aria-pressed="${filter === "all"}">${icon("all")} Tất cả</button>`]
      .concat(used.map(t => `<button class="chip" type="button" data-f="${t}" aria-pressed="${filter === t}" style="--c:${TYPES[t].c}">${icon(t)} ${TYPES[t].label}</button>`)).join("");

    $("#dayPanels").innerHTML = data.days.map((d, i) => {
      const last = d.stops.at(-1);
      const visible = d.stops.filter(s => filter === "all" || s.type === filter);
      return `
      <div class="daypanel" role="tabpanel" id="panel-${i}" aria-labelledby="tab-${i}" tabindex="0" ${i === active ? "" : "hidden"}>
        <div class="daypanel__head">
          <div>
            <p class="eyebrow">${esc(d.label)} · ${esc(fmtDate(d.date))}</p>
            <h3>${esc(d.theme)}</h3>
            ${d.summary ? `<p>${esc(d.summary)}</p>` : ""}
            <div class="daypanel__tools edit-only">
              <button class="btn" type="button" data-act="edit-day" data-d="${i}">${icon("edit")} Sửa ngày</button>
              ${data.days.length > 1 ? `<button class="btn btn--danger" type="button" data-act="del-day" data-d="${i}">${icon("trash")} Xoá ngày</button>` : ""}
            </div>
          </div>
          <div class="daypanel__meta">
            <strong class="cost-only">${costText(dayCost(d))}</strong>
            ${d.stops.length} hoạt động${d.stops.length ? ` · ${esc(fmtTime(d.stops[0].time))}–${esc(fmtTime(last.end || last.time))}` : ""}
          </div>
        </div>
        <ol class="timeline">${d.stops.map((s, si) => (filter === "all" || s.type === filter) ? stopHTML(s, i, si, today, todayIdx) : "").join("")}</ol>
        ${!visible.length ? `<p class="empty">${d.stops.length ? "Không có hoạt động thuộc loại đã chọn." : "Chưa có hoạt động nào."}</p>` : ""}
        <button class="add-stop edit-only" type="button" data-act="add-stop" data-d="${i}">${icon("plus")} Thêm hoạt động</button>
      </div>`;
    }).join("");
  }

  function renderBudget() {
    const all = data.days.flatMap(d => d.stops);
    const total = all.reduce((n, s) => n + (+s.cost || 0), 0);
    $("#budgetTotal").textContent = money(total);
    $("#budgetPer").textContent = `≈ ${money(total / 2)} / người`;
    const by = {};
    all.forEach(s => { by[s.type] = (by[s.type] || 0) + (+s.cost || 0); });
    const sorted = Object.entries(by).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
    const max = sorted[0]?.[1] || 1;
    $("#budgetBars").innerHTML = sorted.length ? sorted.map(([t, v]) => `
      <div style="--c:${(TYPES[t] || TYPES.place).c}">
        <div class="bar__head"><span>${(TYPES[t] || { label: t }).label}</span><span>${money(v)} · ${Math.round(v / total * 100)}%</span></div>
        <div class="bar__track"><div class="bar__fill" data-w="${(v / max * 100).toFixed(1)}" ${firstRender ? "" : `style="width:${(v / max * 100).toFixed(1)}%"`}></div></div>
      </div>`).join("") : `<p class="muted">Chưa có chi phí nào.</p>`;
    $("#budgetDays").innerHTML = data.days.map(d => `<div class="budget__day"><span>${esc(d.label)}</span><strong>${money(dayCost(d))}</strong></div>`).join("");
    $("#budgetDays").hidden = data.days.length < 2;
  }

  const checked = new Set(store.get("checklist", []));
  function renderChecklist() {
    const allKeys = data.checklist.flatMap(g => g.items.map(it => `${g.group}::${it}`));
    $("#checklist").innerHTML = data.checklist.map((g, gi) => `
      <div class="checkgroup reveal">
        <div class="checkgroup__head">
          <h3>${esc(g.group)}</h3>
          <span class="edit-only mini-tools">
            <button type="button" class="icon-btn icon-btn--sm" data-act="rename-group" data-g="${gi}" aria-label="Đổi tên nhóm ${esc(g.group)}">${icon("edit")}</button>
            <button type="button" class="icon-btn icon-btn--sm" data-act="del-group" data-g="${gi}" aria-label="Xoá nhóm ${esc(g.group)}">${icon("trash")}</button>
          </span>
        </div>
        ${g.items.map((it, ii) => {
          const k = `${g.group}::${it}`;
          return `<div class="check-row"><label class="check"><input type="checkbox" data-k="${esc(k)}" ${checked.has(k) ? "checked" : ""}><span>${esc(it)}</span></label>
            <button type="button" class="icon-btn icon-btn--sm edit-only" data-act="del-item" data-g="${gi}" data-i="${ii}" aria-label="Xoá ${esc(it)}">${icon("x")}</button></div>`;
        }).join("")}
        <form class="add-item edit-only" data-g="${gi}">
          <input type="text" placeholder="Thêm mục…" aria-label="Thêm mục vào ${esc(g.group)}" />
          <button type="submit" class="icon-btn icon-btn--sm" aria-label="Thêm">${icon("plus")}</button>
        </form>
      </div>`).join("") +
      `<button class="add-card edit-only" type="button" data-act="add-group">${icon("plus")} Thêm nhóm</button>`;
    const done = allKeys.filter(k => checked.has(k)).length;
    $("#checkCount").textContent = `${done}/${allKeys.length}`;
    $("#checkBar").style.width = (allKeys.length ? done / allKeys.length * 100 : 0) + "%";
  }

  function renderTips() {
    $("#tipsGrid").innerHTML = data.tips.map((t, i) => `
      <div class="tip reveal">
        <h3>${esc(t.title)}</h3><p>${esc(t.text)}</p>
        <div class="mini-tools edit-only">
          <button type="button" class="btn" data-act="edit-tip" data-i="${i}">${icon("edit")} Sửa</button>
          <button type="button" class="btn btn--danger" data-act="del-tip" data-i="${i}">${icon("trash")} Xoá</button>
        </div>
      </div>`).join("") +
      `<button class="add-card edit-only" type="button" data-act="add-tip">${icon("plus")} Thêm lưu ý</button>`;
  }

  function render() {
    document.body.classList.toggle("editing", editing);
    const eb = $("#editBtn");
    eb.setAttribute("aria-pressed", editing);
    eb.setAttribute("aria-label", editing ? "Tắt chế độ chỉnh sửa" : "Bật chế độ chỉnh sửa");
    applySettings();
    renderHero(); renderLetter(); renderMusic(); renderPlan(); renderBudget(); renderChecklist(); renderTips();
    revealIn(document);
    if (firstRender) { observeBars(); firstRender = false; }
  }

  /* ---------- Áp dụng cài đặt ---------- */
  function applySettings() {
    const s = S(), root = document.documentElement, b = document.body;
    const flags = {
      "no-countdown": !s.countdown, "no-lovestrip": !s.loveStrip, "no-letter": !s.showLetter, "no-filters": !s.filters,
      "no-budget": !s.budget || !s.cost, "no-checklist": !s.checklist, "no-tips": !s.tips,
      "no-music": !s.music, "no-cost": !s.cost, "no-details": !s.details, "no-note": !s.note, "no-love": !s.love, "no-mapbtns": !s.mapBtns,
      compact: s.compact, clock12: !s.clock24
    };
    Object.entries(flags).forEach(([k, v]) => b.classList.toggle(k, !!v));
    root.dataset.accent = s.accent;
    root.dataset.font = s.font;
    hearts(s.hearts);
    flowers(s.flowers);
  }

  /* ---------- Thư tay ---------- */
  function renderLetter() {
    const L = data.letter;
    $("#letterSec").hidden = !(L.body || "").trim();
    $("#letterTitle").textContent = L.title || "Gửi em";
    $("#letterText").textContent = L.body || "";
    $("#letterSign").textContent = L.sign || "";
  }
  $("#envelope").addEventListener("click", () => {
    const env = $("#envelope"), open = env.getAttribute("aria-expanded") !== "true";
    env.setAttribute("aria-expanded", open);
    $("#letterPaper").hidden = !open;
    $("#letterHint").textContent = open ? "Chạm để gấp thư" : "Chạm để mở thư";
    if (open) { burst(env); if (S().music && S().letterMusic && !player.started && player.playable().length) player.play(); }
  });
  function burst(el) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect(), layer = $("#hearts");
    for (let i = 0; i < 10; i++) {
      const h = document.createElement("span");
      h.className = "bheart"; h.innerHTML = icon("heart");
      const a = Math.random() * Math.PI * 2, dist = 50 + Math.random() * 70;
      h.style.cssText = `left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px;--x:${Math.cos(a) * dist}px;--y:${Math.sin(a) * dist - 30}px;font-size:${12 + Math.random() * 10}px`;
      h.addEventListener("animationend", () => h.remove());
      layer.append(h);
    }
  }

  /* ---------- Hoa rơi ---------- */
  const FLOWER_COLORS = ["#f4a7b9", "#f7c6d0", "#ffd1dc", "#f9b4ab", "#fbe3e8", "#e8a0bf", "#f6c89f"];
  const flowerSvg = (c, kind) => kind === "petal"
    ? `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="${c}" d="M12 2C7 6 5 11 7.5 16.5 9 19.5 12 22 12 22s3-2.5 4.5-5.5C19 11 17 6 12 2z"/><path d="M12 6v13" stroke="#fff" stroke-opacity=".45" stroke-width=".8" fill="none"/></svg>`
    : `<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="${c}">${[0, 72, 144, 216, 288].map(r => `<path transform="rotate(${r} 12 12)" d="M12 12C9.2 9.6 9 5.6 10.6 3.4c.5.8 1 1.1 1.4 1.1s.9-.3 1.4-1.1C15 5.6 14.8 9.6 12 12z"/>`).join("")}</g><circle cx="12" cy="12" r="2.1" fill="#f6d186"/><circle cx="12" cy="12" r="1" fill="#e8a33d"/></svg>`;
  const makeFlower = (cls, kind) => {
    const f = document.createElement("span");
    f.className = cls;
    f.innerHTML = `<i>${flowerSvg(FLOWER_COLORS[Math.random() * FLOWER_COLORS.length | 0], kind)}</i>`;
    return f;
  };
  let flowerTimer = null;
  function flowers(on) {
    const layer = $("#hearts");
    if (!on || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      clearInterval(flowerTimer); flowerTimer = null; $$(".fflower", layer).forEach(f => f.remove()); return;
    }
    if (flowerTimer) return;
    const spawn = () => {
      if (document.hidden || $$(".fflower", layer).length > 22) return;
      const f = makeFlower("fflower", Math.random() < .55 ? "petal" : "bloom");
      f.style.cssText = `left:${(Math.random() * 100).toFixed(1)}vw;font-size:${(12 + Math.random() * 16).toFixed(0)}px;animation-duration:${(9 + Math.random() * 8).toFixed(1)}s;--drift:${(Math.random() * 160 - 80).toFixed(0)}px;--o:${(.55 + Math.random() * .4).toFixed(2)};--sway:${(2.5 + Math.random() * 2).toFixed(1)}s;--spin:${(Math.random() < .5 ? -1 : 1) * (180 + Math.random() * 360) | 0}deg`;
      f.addEventListener("animationend", e => { if (e.target === f) f.remove(); });
      layer.append(f);
    };
    for (let i = 0; i < 6; i++) setTimeout(spawn, i * 250);
    flowerTimer = setInterval(spawn, 600);
  }
  function bloom(x, y) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const layer = $("#hearts");
    for (let i = 0; i < 9; i++) {
      const f = makeFlower("bflower", i % 3 ? "petal" : "bloom");
      const a = (i / 9) * Math.PI * 2 + Math.random() * .5, dist = 40 + Math.random() * 60;
      f.style.cssText = `left:${x}px;top:${y}px;--x:${Math.cos(a) * dist}px;--y:${Math.sin(a) * dist + 20}px;--r:${Math.random() * 360 | 0}deg;font-size:${12 + Math.random() * 10}px`;
      f.addEventListener("animationend", () => f.remove());
      layer.append(f);
    }
  }
  document.addEventListener("pointerdown", e => {
    if (!S().flowers || editing || e.target.closest("button, a, input, select, textarea, label, dialog, .music")) return;
    bloom(e.clientX, e.clientY);
  });

  /* ---------- Tim bay ---------- */
  let heartTimer = null;
  function hearts(on) {
    const layer = $("#hearts");
    if (!on || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      clearInterval(heartTimer); heartTimer = null; $$(".fheart", layer).forEach(h => h.remove()); return;
    }
    if (heartTimer) return;
    heartTimer = setInterval(() => {
      if (document.hidden || $$(".fheart", layer).length > 14) return;
      const h = document.createElement("span");
      h.className = "fheart"; h.innerHTML = icon("heart");
      h.style.cssText = `left:${(Math.random() * 100).toFixed(1)}vw;font-size:${(10 + Math.random() * 16).toFixed(0)}px;animation-duration:${(8 + Math.random() * 6).toFixed(1)}s;--drift:${(Math.random() * 80 - 40).toFixed(0)}px;--o:${(.3 + Math.random() * .45).toFixed(2)}`;
      h.addEventListener("animationend", () => h.remove());
      layer.append(h);
    }, 750);
  }

  /* ---------- Bảng cài đặt ---------- */
  const drawer = $("#settings");
  const sw = ([k, label, desc]) => `
    <label class="switch-row">
      <span><b>${esc(label)}</b>${desc ? `<small>${esc(desc)}</small>` : ""}</span>
      <input type="checkbox" role="switch" data-set="${k}" ${S()[k] ? "checked" : ""} />
    </label>`;
  const seg = (k, label, opts) => `
    <div class="seg-row"><span><b>${esc(label)}</b></span>
      <div class="seg" role="radiogroup" aria-label="${esc(label)}">
        ${opts.map(([v, l]) => `<label><input type="radio" name="set-${k}" value="${v}" data-set="${k}" ${String(S()[k]) === String(v) ? "checked" : ""} /><span>${esc(l)}</span></label>`).join("")}
      </div>
    </div>`;
  function renderSettings() {
    const L = data.letter;
    drawer.innerHTML = `
      <div class="drawer__inner">
        <header class="drawer__head">
          <h3 id="settingsTitle">Cài đặt</h3>
          <button type="button" class="icon-btn icon-btn--sm" data-close aria-label="Đóng">${icon("x")}</button>
        </header>
        <div class="drawer__body">
          ${SETTING_GROUPS.map(g => `<section class="set-group"><h4>${esc(g.title)}</h4>${g.items.map(i => sw(i) +
            (i[0] === "cost" && S().cost ? seg("perPerson", "Cách tính chi phí", [["false", "Tổng 2 người"], ["true", "Mỗi người"]]) : "")).join("")}
          </section>`).join("")}

          <section class="set-group">
            <h4>Giao diện</h4>
            <div class="seg-row"><span><b>Màu chủ đạo</b></span>
              <div class="swatches" role="radiogroup" aria-label="Màu chủ đạo">
                ${Object.entries(ACCENTS).map(([k, a]) => `<label title="${esc(a.label)}"><input type="radio" name="set-accent" value="${k}" data-set="accent" ${S().accent === k ? "checked" : ""} aria-label="${esc(a.label)}" /><span style="--sw:${a.c}"></span></label>`).join("")}
              </div>
            </div>
            ${seg("font", "Cỡ chữ", [["s", "Nhỏ"], ["m", "Vừa"], ["l", "Lớn"]])}
            ${seg("clock24", "Định dạng giờ", [["true", "19:30"], ["false", "7:30 CH"]])}
          </section>

          <section class="set-group">
            <h4>Lãng mạn một chút</h4>
            ${sw(["surprise", "Chế độ bất ngờ", "Giấu các hoạt động chưa tới giờ. Người ấy chỉ thấy “Bất ngờ” cho tới đúng giờ (vẫn có nút hé lộ sớm). Khi bạn đang chỉnh sửa thì vẫn thấy hết."])}
            ${sw(["hearts", "Tim bay lơ lửng", "Hiệu ứng trái tim nhẹ nhàng bay trên nền trang"])}
            ${sw(["flowers", "Hoa rơi", "Hoa anh đào và cánh hoa rơi lả tả, chạm vào trang sẽ nở một chùm hoa"])}
          </section>

          <section class="set-group" id="setMusic">
            <h4>Nhạc</h4>
            ${sw(["music", "Hiện trình phát nhạc"])}
            ${sw(["musicPrompt", "Mời bật nhạc khi mở trang", "Trình duyệt không cho tự phát có tiếng, nên trang sẽ hỏi nhẹ một câu"])}
            ${sw(["letterMusic", "Tự phát nhạc khi mở thư tay"])}
            <div class="songs">
              ${data.music.songs.map((x, i) => `
                <div class="song-edit">
                  <div class="song-edit__row">
                    <span class="song-edit__num">${i + 1}</span>
                    <input type="text" data-song="${i}" data-k="title" value="${esc(x.title)}" placeholder="Tên bài" aria-label="Tên bài ${i + 1}" />
                    <input type="text" data-song="${i}" data-k="artist" value="${esc(x.artist)}" placeholder="Ca sĩ" aria-label="Ca sĩ bài ${i + 1}" />
                  </div>
                  <div class="song-edit__row">
                    <input type="url" data-song="${i}" data-k="url" value="${esc(x.url)}" placeholder="Dán link YouTube hoặc .mp3" aria-label="Link bài ${i + 1}" class="${x.url && parseSource(x.url).kind === "bad" ? "invalid" : ""}" />
                    <button type="button" class="icon-btn icon-btn--sm" data-song-search="${i}" title="Tìm trên YouTube" aria-label="Tìm bài ${i + 1} trên YouTube">${icon("search")}</button>
                    <button type="button" class="icon-btn icon-btn--sm" data-song-up="${i}" title="Đưa lên" aria-label="Đưa bài ${i + 1} lên" ${i ? "" : "disabled"}>${icon("up")}</button>
                    <button type="button" class="icon-btn icon-btn--sm" data-song-del="${i}" title="Xoá" aria-label="Xoá bài ${i + 1}">${icon("trash")}</button>
                  </div>
                </div>`).join("")}
              <button type="button" class="add-card add-card--sm" data-song-add>${icon("plus")} Thêm bài</button>
              <p class="hint">Mẹo: bấm biểu tượng kính lúp để mở YouTube, chọn đúng bài, bấm <b>Chia sẻ → Sao chép đường liên kết</b> rồi dán vào ô link.</p>
            </div>
          </section>

          <section class="set-group">
            <h4>Thư tay</h4>
            <label class="field"><span>Tiêu đề phong bì</span><input type="text" data-letter="title" value="${esc(L.title)}" /></label>
            <label class="field"><span>Nội dung thư</span><textarea rows="5" data-letter="body" placeholder="Để trống để ẩn thư">${esc(L.body)}</textarea></label>
            <label class="field"><span>Ký tên</span><input type="text" data-letter="sign" value="${esc(L.sign)}" /></label>
          </section>
        </div>
        <footer class="drawer__foot">
          <button type="button" class="btn" data-reset-settings>Mặc định</button>
          <button type="button" class="btn btn--primary" data-close>Xong</button>
        </footer>
      </div>`;
  }
  const openSettings = () => { renderSettings(); drawer.showModal(); };
  $("#settingsBtn").addEventListener("click", openSettings);
  const rerenderDrawer = focusSel => {
    const y = $(".drawer__body", drawer)?.scrollTop || 0;
    renderSettings(); $(".drawer__body", drawer).scrollTop = y;
    if (focusSel) $(focusSel, drawer)?.focus();
  };
  drawer.addEventListener("click", e => {
    if (e.target === drawer || e.target.closest("[data-close]")) return drawer.close();
    const t = e.target.closest("[data-song-add],[data-song-del],[data-song-up],[data-song-search]");
    if (t) {
      const songs = data.music.songs;
      if (t.hasAttribute("data-song-add")) { songs.push({ title: "", artist: "", url: "" }); save(); renderMusic(); rerenderDrawer(`[data-song="${songs.length - 1}"][data-k="title"]`); }
      else if (t.dataset.songDel !== undefined) { const i = +t.dataset.songDel; const [gone] = songs.splice(i, 1); player.onRemoved(i); save(); renderMusic(); rerenderDrawer(); toast(`Đã xoá "${gone.title || "bài hát"}"`, { label: "Hoàn tác", fn: () => { songs.splice(i, 0, gone); save(); renderMusic(); if (drawer.open) rerenderDrawer(); } }); }
      else if (t.dataset.songUp !== undefined) { const i = +t.dataset.songUp; [songs[i - 1], songs[i]] = [songs[i], songs[i - 1]]; player.onSwapped(i - 1, i); save(); renderMusic(); rerenderDrawer(`[data-song-up="${i - 1}"]`); }
      else { const x = songs[+t.dataset.songSearch]; window.open(ytSearch(x), "_blank", "noopener"); }
      return;
    }
    if (e.target.closest("[data-reset-settings]")) {
      data.settings = { ...DEFAULT_SETTINGS }; save(); render(); renderSettings();
      toast("Đã đưa cài đặt về mặc định");
    }
  });
  drawer.addEventListener("change", e => {
    const k = e.target.dataset.set; if (!k) return;
    let v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    if (v === "true") v = true; else if (v === "false") v = false;
    data.settings[k] = v;
    save(); render();
    if (k === "cost") { const y = $(".drawer__body", drawer).scrollTop; renderSettings(); $(".drawer__body", drawer).scrollTop = y; $(`[data-set="cost"]`, drawer).focus(); }
  });
  let letterTimer;
  drawer.addEventListener("input", e => {
    if (e.target.dataset.song !== undefined) {
      const i = +e.target.dataset.song, k = e.target.dataset.k;
      data.music.songs[i][k] = e.target.value.trim();
      if (k === "url") e.target.classList.toggle("invalid", !!e.target.value.trim() && parseSource(e.target.value).kind === "bad");
      renderMusic();
      clearTimeout(letterTimer); letterTimer = setTimeout(save, 400);
      return;
    }
    const k = e.target.dataset.letter; if (!k) return;
    data.letter[k] = e.target.value;
    renderLetter();
    clearTimeout(letterTimer); letterTimer = setTimeout(save, 400);
  });

  /* =========================================================
     Trình phát nhạc (YouTube nhúng chính thức + file audio)
     ========================================================= */
  function parseSource(u) {
    u = (u || "").trim();
    if (!u) return null;
    if (/^[\w-]{11}$/.test(u)) return { kind: "yt", id: u };
    const m = u.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/);
    if (m) return { kind: "yt", id: m[1] };
    if (/\.(mp3|m4a|aac|ogg|oga|opus|wav|flac|webm)(\?.*)?$/i.test(u)) return { kind: "audio", src: u };
    return { kind: "bad" };
  }
  const ytSearch = x => "https://www.youtube.com/results?search_query=" + encodeURIComponent([x.title, x.artist].filter(Boolean).join(" ") || "nhạc tình yêu");
  const fmtSec = t => { t = Math.max(0, Math.floor(t || 0)); return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`; };

  const player = (() => {
    const box = $("#music");
    let idx = -1, started = false, playing = false, kind = null;
    let yt = null, ytReadyP = null, ytLoadedId = null, pollTimer = null, failed = new Set();
    const audio = new Audio();
    audio.preload = "none";

    const songs = () => data.music.songs;
    const ok = i => { const p = parseSource(songs()[i]?.url); return p && p.kind !== "bad" && !failed.has(songs()[i].url); };
    const playable = () => songs().map((_, i) => i).filter(ok);

    const loadYT = () => ytReadyP ||= new Promise(res => {
      if (window.YT?.Player) return res(window.YT);
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { prev?.(); res(window.YT); };
      const sc = document.createElement("script");
      sc.src = "https://www.youtube.com/iframe_api"; sc.async = true;
      sc.onerror = () => { ytReadyP = null; res(null); };
      document.head.append(sc);
    });

    const setState = st => {
      box.dataset.state = st;
      if (st !== "closed") box.classList.remove("bg"); // mở trình phát → thôi chạy ngầm
      $("#musicFab").setAttribute("aria-expanded", st !== "closed");
      $("#musicMin").innerHTML = icon(st === "mini" ? "up" : "down");
      $("#musicMin").setAttribute("aria-label", st === "mini" ? "Mở rộng trình phát" : "Thu gọn trình phát");
    };
    const setPlaying = v => {
      playing = v;
      box.classList.toggle("is-playing", v);
      $("#musicPlay").setAttribute("aria-label", v ? "Tạm dừng" : "Phát");
      clearInterval(pollTimer);
      if (v) pollTimer = setInterval(progress, 500);
      progress(); renderList();
    };
    const time = () => kind === "yt" && yt?.getCurrentTime ? [yt.getCurrentTime() || 0, yt.getDuration() || 0]
      : kind === "audio" ? [audio.currentTime || 0, isFinite(audio.duration) ? audio.duration : 0] : [0, 0];
    function progress() {
      const [c, d] = time();
      $("#musicFill").style.width = d ? `${(c / d) * 100}%` : "0%";
      $("#musicBar").setAttribute("aria-valuenow", d ? Math.round(c / d * 100) : 0);
      $("#musicCur").textContent = fmtSec(c);
      $("#musicDur").textContent = fmtSec(d);
    }
    const seekTo = frac => {
      const [, d] = time(); if (!d) return;
      if (kind === "yt") yt.seekTo(d * frac, true); else audio.currentTime = d * frac;
      progress();
    };

    const stopOther = k => {
      if (k !== "audio") { audio.pause(); }
      if (k !== "yt" && yt?.pauseVideo) { try { yt.pauseVideo(); } catch {} }
      $("#musicVideo").hidden = k !== "yt";
    };

    // bg = phát ngầm: không bật khung video lên, chỉ nút nốt nhạc nhảy nhịp
    async function playIndex(i, bg = false) {
      const x = songs()[i]; if (!x) return;
      const src = parseSource(x.url);
      idx = i; started = true;
      renderNow();
      if (!src || src.kind === "bad") {
        setState("open"); renderList();
        toast(src ? `Link của "${x.title}" chưa đúng — cần link YouTube hoặc file .mp3` : `"${x.title}" chưa có link — bấm Dán link nhé`);
        return;
      }
      if (box.dataset.state === "closed") {
        if (bg) box.classList.add("bg");
        else setState(src.kind === "yt" ? "mini" : "closed");
      }
      kind = src.kind; stopOther(kind);
      if (kind === "audio") {
        if (audio.src !== new URL(src.src, location.href).href) audio.src = src.src;
        try { await audio.play(); } catch (e) {
          if (bg) return setPlaying(false); // phát ngầm bị chặn → im lặng chờ lần chạm đầu tiên
          onFail(i, "Trình duyệt chưa cho phát — bấm nút phát lần nữa", false);
        }
        return;
      }
      $("#musicVideo").hidden = false;
      const YT = await loadYT();
      if (!YT) return onFail(i, "Không tải được YouTube (kiểm tra mạng)", false);
      if (idx !== i) return;
      if (!yt) {
        yt = new YT.Player("ytHost", {
          width: "100%", height: "100%", videoId: src.id,
          playerVars: { playsinline: 1, rel: 0, modestbranding: 1, origin: location.origin.startsWith("http") ? location.origin : undefined },
          events: {
            onReady: e => { ytLoadedId = src.id; e.target.playVideo(); },
            onStateChange: e => {
              if (kind !== "yt") return;
              if (e.data === YT.PlayerState.PLAYING) setPlaying(true);
              else if (e.data === YT.PlayerState.PAUSED) setPlaying(false);
              else if (e.data === YT.PlayerState.ENDED) { setPlaying(false); next(true); }
            },
            onError: () => onFail(idx, "Video này không cho phát nhúng — thử dán link khác (bản Official Audio / Lyric video)")
          }
        });
      } else if (ytLoadedId === src.id) yt.playVideo();
      else { ytLoadedId = src.id; yt.loadVideoById(src.id); }
    }
    function onFail(i, msg, markBad = true) {
      setPlaying(false);
      const x = songs()[i]; if (markBad && x?.url) failed.add(x.url);
      renderList(); toast(msg, null, 6000);
    }

    audio.addEventListener("playing", () => kind === "audio" && setPlaying(true));
    audio.addEventListener("pause", () => kind === "audio" && setPlaying(false));
    audio.addEventListener("ended", () => kind === "audio" && next(true));
    audio.addEventListener("error", () => kind === "audio" && audio.src && onFail(idx, "Không mở được file nhạc này"));
    audio.addEventListener("loadedmetadata", progress);

    function next(auto) {
      const list = playable(); if (!list.length) return;
      if (S().shuffle && list.length > 1) { let j; do { j = list[Math.floor(Math.random() * list.length)]; } while (j === idx); return playIndex(j); }
      const after = list.filter(i => i > idx);
      if (after.length) return playIndex(after[0]);
      if (auto && !S().repeat) return setPlaying(false);
      playIndex(list[0]);
    }
    function prev() {
      const [c] = time();
      if (c > 4) return seekTo(0);
      const list = playable(); if (!list.length) return;
      const before = list.filter(i => i < idx);
      playIndex(before.length ? before.at(-1) : list.at(-1));
    }
    function toggle() {
      if (!started || idx < 0 || !ok(idx)) {
        const list = playable();
        if (!list.length) { setState("open"); renderList(); return toast("Chưa có bài nào có link — bấm “Dán link” cạnh một bài nhé"); }
        return playIndex(S().shuffle ? list[Math.floor(Math.random() * list.length)] : list[0]);
      }
      if (playing) { kind === "yt" ? yt.pauseVideo() : audio.pause(); }
      else { kind === "yt" ? yt.playVideo() : audio.play().catch(() => {}); }
    }
    function pauseAll() { if (playing) toggle(); }

    function renderNow() {
      const x = songs()[idx];
      $("#musicNow").textContent = x ? (x.title || "Bài không tên") : (playable().length ? "Chọn một bài" : "Thêm link cho bài hát");
      $("#musicArtist").textContent = x?.artist || "";
    }
    function renderList() {
      const list = $("#musicList");
      list.innerHTML = songs().map((x, i) => {
        const src = parseSource(x.url), bad = src?.kind === "bad" || failed.has(x.url);
        const cur = i === idx;
        return `<li class="track ${cur ? "is-current" : ""} ${!src || bad ? "is-missing" : ""}">
          <button type="button" class="track__main" data-track="${i}" ${cur ? 'aria-current="true"' : ""}>
            <span class="track__idx">${cur && playing ? '<span class="eq eq--sm" aria-hidden="true"><i></i><i></i><i></i></span>' : i + 1}</span>
            <span class="track__text"><b>${esc(x.title || "Bài không tên")}</b><small>${esc(x.artist || (src ? (src.kind === "yt" ? "YouTube" : "File nhạc") : ""))}</small></span>
          </button>
          ${!src || bad ? `<span class="track__fix">
            ${bad ? `<span class="track__warn" title="Link không phát được">${icon("alert")}</span>` : ""}
            <a class="btn btn--xs" href="${ytSearch(x)}" target="_blank" rel="noopener">${icon("search")} Tìm</a>
            <button type="button" class="btn btn--xs btn--primary" data-track-link="${i}">${icon("link")} ${bad ? "Đổi link" : "Dán link"}</button>
          </span>` : ""}
        </li>`;
      }).join("") || `<li class="track track--empty">Chưa có bài nào. Thêm trong Cài đặt → Nhạc.</li>`;
      $("#musicShuffle").setAttribute("aria-pressed", !!S().shuffle);
      $("#musicRepeat").setAttribute("aria-pressed", !!S().repeat);
      renderNow();
    }

    $("#musicFab").addEventListener("click", () => setState("open"));
    $("#musicMin").addEventListener("click", () => setState(box.dataset.state === "mini" ? "open" : "mini"));
    $("#musicClose").addEventListener("click", () => { if (kind === "yt") pauseAll(); setState("closed"); });
    $("#musicPlay").addEventListener("click", toggle);
    $("#musicNext").addEventListener("click", () => next(false));
    $("#musicPrev").addEventListener("click", prev);
    $("#musicShuffle").addEventListener("click", () => { data.settings.shuffle = !S().shuffle; save(); renderList(); });
    $("#musicRepeat").addEventListener("click", () => { data.settings.repeat = !S().repeat; save(); renderList(); });
    const bar = $("#musicBar");
    bar.addEventListener("click", e => { const r = bar.getBoundingClientRect(); seekTo((e.clientX - r.left) / r.width); });
    bar.addEventListener("keydown", e => {
      const [c, d] = time(); if (!d) return;
      if (e.key === "ArrowRight") { e.preventDefault(); seekTo(Math.min(1, (c + 5) / d)); }
      if (e.key === "ArrowLeft") { e.preventDefault(); seekTo(Math.max(0, (c - 5) / d)); }
    });
    $("#musicList").addEventListener("click", e => {
      const t = e.target.closest("[data-track]");
      if (t) { const i = +t.dataset.track; return i === idx && started && ok(i) ? toggle() : playIndex(i); }
      const l = e.target.closest("[data-track-link]");
      if (l) {
        const i = +l.dataset.trackLink, x = songs()[i];
        openForm({
          title: `Link cho “${x.title || "bài hát"}”`,
          fields: [
            { k: "url", label: "Link YouTube hoặc file .mp3", req: true, ph: "https://youtu.be/…", hint: "Trên YouTube: Chia sẻ → Sao chép đường liên kết, rồi dán vào đây" },
            { k: "title", label: "Tên bài", half: true }, { k: "artist", label: "Ca sĩ", half: true }
          ],
          values: x, submit: "Lưu & phát",
          onSave: v => {
            const src = parseSource(v.url);
            if (!src || src.kind === "bad") return toast("Link chưa đúng — cần link YouTube hoặc file .mp3");
            failed.delete(x.url);
            Object.assign(x, { title: v.title || x.title, artist: v.artist ?? "", url: v.url });
            save(); renderList(); playIndex(i);
          }
        });
      }
    });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && box.dataset.state === "open" && !modal.open && !drawer.open) setState(kind === "yt" && playing ? "mini" : "closed");
    });

    return {
      get started() { return started; },
      get playing() { return playing; },
      playable, play: toggle, playIndex, renderList, pauseAll,
      onRemoved(i) { if (i === idx) { pauseAll(); idx = -1; started = false; } else if (i < idx) idx--; },
      onSwapped(a, b) { if (idx === a) idx = b; else if (idx === b) idx = a; }
    };
  })();
  function renderMusic() { player.renderList(); }

  /* ---------- Reveal on scroll ---------- */
  const io = "IntersectionObserver" in window
    ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" })
    : null;
  function revealIn(scope) {
    $$(".reveal:not(.is-in)", scope).forEach(el => (io && firstRender) ? io.observe(el) : el.classList.add("is-in"));
  }
  function observeBars() {
    const bars = $("#budgetBars");
    if (!("IntersectionObserver" in window)) return $$(".bar__fill", bars).forEach(f => f.style.width = f.dataset.w + "%");
    const o = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      $$(".bar__fill", bars).forEach(f => { f.style.width = f.dataset.w + "%"; });
      o.disconnect();
    }), { threshold: .3 });
    o.observe(bars);
  }

  /* =========================================================
     Countdown
     ========================================================= */
  const pad = n => String(n).padStart(2, "0");
  let lastMinute = -1;
  function tick() {
    const now = Date.now(), start = tripStart(), end = tripEnd(), cd = $("#countdown");
    const minute = Math.floor(now / 60000);
    if (lastMinute !== -1 && minute !== lastMinute && !editing && !modal.open && !drawer.open) { renderPlan(); revealIn($("#dayPanels")); }
    lastMinute = minute;
    if (isNaN(start)) { cd.hidden = true; return; }
    cd.hidden = false;
    if (now >= start) {
      cd.classList.add("is-live");
      $("#countdownLabel").textContent = now <= end ? "Hôm nay là ngày của hai ta — tận hưởng nhé ♥" : "Đã thành kỷ niệm đẹp ♥";
      return;
    }
    cd.classList.remove("is-live");
    $("#countdownLabel").textContent = "Còn lại đến lúc gặp nhau";
    let s = Math.floor((start - now) / 1000);
    $("#cdD").textContent = Math.floor(s / 86400); s %= 86400;
    $("#cdH").textContent = pad(Math.floor(s / 3600)); s %= 3600;
    $("#cdM").textContent = pad(Math.floor(s / 60));
    $("#cdS").textContent = pad(s % 60);
  }

  /* =========================================================
     Actions
     ========================================================= */
  const download = (name, text, type) => {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const a = Object.assign(document.createElement("a"), { href: url, download: name });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const dataJs = () => `/**
 * Dữ liệu website — xuất từ chế độ chỉnh sửa lúc ${new Date().toLocaleString("vi-VN")}.
 * Thay file assets/js/data.js trên GitHub bằng file này để mọi người cùng thấy bản mới.
 * Các trường của mỗi hoạt động: time, end, type (${Object.keys(TYPES).join(" | ")}),
 * title, place, address, transport, cost, note, love.
 */
window.LOVE_DATA = ${JSON.stringify(data, null, 2)};
`;

  const actions = {
    "edit-trip": () => openForm({ title: "Thông tin chung", fields: TRIP_FIELDS, values: data,
      onSave: v => mutate(d => { TRIP_FIELDS.forEach(f => setPath(d, f.k, getPath(v, f.k))); }, "Đã cập nhật thông tin chung") }),

    "add-day": () => {
      const last = data.days.at(-1);
      openForm({ title: "Thêm ngày", fields: DAY_FIELDS, submit: "Thêm",
        values: { label: `Ngày ${data.days.length + 1}`, date: addDays(last?.date, 1), theme: "" },
        onSave: v => mutate(d => { d.days.push({ ...v, stops: [] }); active = d.days.length - 1; }, "Đã thêm ngày") });
    },
    "edit-day": ({ d: di }) => openForm({ title: "Sửa ngày", fields: DAY_FIELDS, values: data.days[di],
      onSave: v => mutate(d => { Object.assign(d.days[di], { summary: "" }, v); }),
      onDelete: data.days.length > 1 ? () => actions["del-day"]({ d: di }) : null }),
    "del-day": ({ d: di }) => mutate(d => { d.days.splice(di, 1); active = Math.max(0, di - 1); }, `Đã xoá ${data.days[di].label}`),

    "add-stop": ({ d: di }) => {
      const prev = data.days[di].stops.at(-1);
      const t = prev ? (prev.end || prev.time) : "08:00";
      openForm({ title: "Thêm hoạt động", fields: STOP_FIELDS, submit: "Thêm", values: { time: t, type: "place" },
        onSave: v => mutate(d => { d.days[di].stops.push(v); }, "Đã thêm hoạt động") });
    },
    "edit-stop": ({ d: di, s: si }) => openForm({ title: "Sửa hoạt động", fields: STOP_FIELDS, values: data.days[di].stops[si],
      onSave: v => mutate(d => { d.days[di].stops[si] = v; }),
      onDelete: () => actions["del-stop"]({ d: di, s: si }) }),
    "dup-stop": ({ d: di, s: si }) => mutate(d => { d.days[di].stops.splice(si + 1, 0, { ...clone(d.days[di].stops[si]), title: d.days[di].stops[si].title + " (bản sao)" }); }, "Đã nhân bản"),
    "del-stop": ({ d: di, s: si }) => mutate(d => { d.days[di].stops.splice(si, 1); }, `Đã xoá "${data.days[di].stops[si].title}"`),

    "add-group": () => openForm({ title: "Thêm nhóm checklist", fields: [{ k: "group", label: "Tên nhóm", req: true }], submit: "Thêm",
      onSave: v => mutate(d => { d.checklist.push({ group: v.group, items: [] }); }) }),
    "rename-group": ({ g }) => openForm({ title: "Đổi tên nhóm", fields: [{ k: "group", label: "Tên nhóm", req: true }], values: data.checklist[g],
      onSave: v => mutate(d => { d.checklist[g].group = v.group; }) }),
    "del-group": ({ g }) => mutate(d => { d.checklist.splice(g, 1); }, `Đã xoá nhóm "${data.checklist[g].group}"`),
    "del-item": ({ g, i }) => mutate(d => { d.checklist[g].items.splice(i, 1); }, "Đã xoá mục"),

    "add-tip": () => openForm({ title: "Thêm lưu ý", fields: [{ k: "title", label: "Tiêu đề", req: true }, { k: "text", label: "Nội dung", type: "textarea", rows: 3, req: true }], submit: "Thêm",
      onSave: v => mutate(d => { d.tips.push(v); }) }),
    "edit-tip": ({ i }) => openForm({ title: "Sửa lưu ý", fields: [{ k: "title", label: "Tiêu đề", req: true }, { k: "text", label: "Nội dung", type: "textarea", rows: 3, req: true }], values: data.tips[i],
      onSave: v => mutate(d => { d.tips[i] = v; }), onDelete: () => actions["del-tip"]({ i }) }),
    "del-tip": ({ i }) => mutate(d => { d.tips.splice(i, 1); }, "Đã xoá lưu ý"),

    reveal: (_, el) => {
      revealed.add(el.dataset.key);
      try { sessionStorage.setItem("revealed", JSON.stringify([...revealed])); } catch {}
      renderPlan(); revealIn($("#dayPanels"));
      burst(el);
    },
    undo,
    done: () => setEditing(false),
    share: async () => {
      try {
        const url = `${location.origin}${location.pathname}#share=${await encodeShare(data)}`;
        try { await navigator.clipboard.writeText(url); toast("Đã sao chép link — gửi cho người ấy là xem được bản này"); }
        catch { window.prompt("Sao chép link này:", url); }
      } catch (e) { console.error(e); toast("Không tạo được link chia sẻ"); }
    },
    download: () => { download("data.js", dataJs(), "text/javascript"); toast("Đã tải data.js — thay vào assets/js/ trên GitHub"); },
    "export-json": () => download("ke-hoach.json", JSON.stringify(data, null, 2), "application/json"),
    import: () => $("#importFile").click(),
    reset: () => mutate(d => { Object.keys(d).forEach(k => delete d[k]); Object.assign(d, clone(DEFAULT)); active = 0; }, "Đã khôi phục bản gốc")
  };

  document.addEventListener("click", e => {
    const b = e.target.closest("[data-act]");
    if (!b) return;
    const name = b.dataset.act;
    if (!actions[name]) return;
    b.closest("details")?.removeAttribute("open");
    const args = Object.fromEntries(Object.entries(b.dataset).filter(([k]) => k !== "act" && k !== "key").map(([k, v]) => [k, +v]));
    actions[name](args, b);
  });

  document.addEventListener("submit", e => {
    const f = e.target.closest("form.add-item");
    if (!f) return;
    e.preventDefault();
    const v = $("input", f).value.trim(); if (!v) return;
    const g = +f.dataset.g;
    mutate(d => { d.checklist[g].items.push(v); });
    $(`form.add-item[data-g="${g}"] input`)?.focus();
  });

  $("#importFile").addEventListener("change", async e => {
    const file = e.target.files[0]; e.target.value = "";
    if (!file) return;
    try {
      const txt = await file.text();
      const json = JSON.parse(txt.slice(txt.indexOf("{"), txt.lastIndexOf("}") + 1));
      if (!valid(json)) throw new Error("Sai cấu trúc");
      mutate(d => { Object.keys(d).forEach(k => delete d[k]); Object.assign(d, normalize(json)); active = 0; }, "Đã nhập kế hoạch từ file");
    } catch (err) { console.error(err); toast("File không hợp lệ — cần file JSON hoặc data.js xuất từ trang này"); }
  });

  /* ---------- Tabs, filter, checklist ---------- */
  const selectDay = (i, focus) => {
    active = i;
    store.set("activeDay", i);
    $$("#dayTabs .daytab[role=tab]").forEach((t, j) => { t.setAttribute("aria-selected", j === i); t.tabIndex = j === i ? 0 : -1; if (j === i && focus) t.focus(); });
    $$(".daypanel").forEach((p, j) => p.hidden = j !== i);
  };
  $("#dayTabs").addEventListener("click", e => { const b = e.target.closest(".daytab[role=tab]"); if (b) selectDay(+b.dataset.i); });
  $("#dayTabs").addEventListener("keydown", e => {
    const n = data.days.length, m = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (e.key in m) { e.preventDefault(); selectDay((active + m[e.key] + n) % n, true); }
    else if (e.key === "Home") { e.preventDefault(); selectDay(0, true); }
    else if (e.key === "End") { e.preventDefault(); selectDay(n - 1, true); }
  });
  $("#filters").addEventListener("click", e => { const b = e.target.closest(".chip"); if (!b) return; filter = b.dataset.f; renderPlan(); revealIn($("#dayPanels")); });
  $("#checklist").addEventListener("change", e => {
    const k = e.target.dataset.k; if (!k) return;
    e.target.checked ? checked.add(k) : checked.delete(k);
    store.set("checklist", [...checked]); pushCheck(); renderChecklist(); revealIn($("#checklist"));
  });
  $("#checkReset").addEventListener("click", () => { checked.clear(); store.set("checklist", []); pushCheck(); renderChecklist(); revealIn($("#checklist")); });

  /* ---------- Edit mode, theme, print, keyboard ---------- */
  function setEditing(on) {
    editing = on; store.set("editMode", on); render();
    if (on) toast("Đang chỉnh sửa — thay đổi tự lưu trên trình duyệt này");
  }
  $("#editBtn").addEventListener("click", () => setEditing(!editing));
  /* ---------- Đăng xuất ---------- */
  if (window.LoveAuth && LoveAuth.enabled()) {
    $("#logoutBtn").hidden = false;
    $("#logoutBtn").addEventListener("click", () => { LoveAuth.logout(); location.replace("login.html"); });
  }

  $("#themeBtn").addEventListener("click", () => {
    const root = document.documentElement;
    const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch {}
  });
  $("#printBtn").addEventListener("click", () => window.print());
  document.addEventListener("keydown", e => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName);
    if (editing && !typing && !modal.open && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") { e.preventDefault(); undo(); }
  });

  /* =========================================================
     Init
     ========================================================= */
  (async function init() {
    let notice = null;
    if (CLOUD) {
      try {
        const remote = await LoveCloud.load();
        if (remote.plan && valid(remote.plan)) {
          data = normalize(remote.plan);
          store.set(KEY, { base: BASE, savedAt: Date.now(), data });
        }
        if (Array.isArray(remote.check)) { checked.clear(); remote.check.forEach(k => checked.add(k)); store.set("checklist", remote.check); }
      } catch (e) { console.warn("Không tải được từ Firebase", e); notice = ["Đang offline — hiện bản lưu trên máy này", null]; }
    }
    const m = location.hash.match(/^#share=([\w-]+)$/);
    if (m) {
      history.replaceState(null, "", location.pathname + location.search);
      try {
        const shared = await decodeShare(m[1]);
        if (valid(shared)) {
          const prev = store.get(KEY, null);
          if (prev?.data) store.set(BACKUP_KEY, prev);
          data = normalize(shared);
          store.set(KEY, { base: BASE, savedAt: Date.now(), data });
          notice = ["Đã mở kế hoạch được chia sẻ", prev?.data ? { label: "Dùng bản của mình", fn: () => { data = normalize(prev.data); save(); render(); } } : null];
        }
      } catch (e) { console.warn("Link chia sẻ lỗi", e); notice = ["Link chia sẻ bị lỗi — đang hiện bản gốc", null]; }
    }
    if (!data && CLOUD) {
      const saved = store.get(KEY, null);
      data = normalize(saved?.data && valid(saved.data) ? saved.data : clone(DEFAULT));
    }
    if (!data) {
      const saved = store.get(KEY, null);
      if (saved?.data && valid(saved.data)) {
        if (saved.base === BASE) data = normalize(saved.data);
        else {
          // data.js trên web đã được cập nhật kể từ khi bạn sửa → ưu tiên bản mới, giữ bản nháp để khôi phục
          store.set(BACKUP_KEY, saved);
          data = normalize(clone(DEFAULT));
          store.set(KEY, { base: BASE, savedAt: Date.now(), data });
          notice = ["Trang đã có bản cập nhật mới", { label: "Mở lại bản nháp cũ", fn: () => { data = normalize(saved.data); save(); render(); } }];
        }
      } else data = normalize(clone(DEFAULT));
    }

    editing = store.get("editMode", false);
    const todayIdx = data.days.findIndex(d => d.date === nowVN().date);
    active = todayIdx >= 0 ? todayIdx : store.get("activeDay", 0);

    render();
    tick(); setInterval(tick, 1000);
    if (CLOUD) {
      if (m) save(); // vừa mở link chia sẻ → đưa bản đó lên mạng
      LoveCloud.listen((part, v) => {
        if (part === "plan" && v && valid(v) && JSON.stringify(v) !== JSON.stringify(planForCloud())) {
          data = normalize(v);
          store.set(KEY, { base: BASE, savedAt: Date.now(), data });
          render();
        } else if (part === "check" && Array.isArray(v)) {
          checked.clear(); v.forEach(k => checked.add(k));
          store.set("checklist", v); renderChecklist(); revealIn($("#checklist"));
        }
      });
    }
    // Vừa đăng nhập xong → phát bài "Một Đời"
    let afterLogin = null;
    try { afterLogin = sessionStorage.getItem("playAfterLogin"); sessionStorage.removeItem("playAfterLogin"); } catch {}
    const loginSong = afterLogin && S().music ? data.music.songs.findIndex(x => (x.title || "").toLowerCase().includes(afterLogin.toLowerCase())) : -1;
    if (loginSong >= 0) {
      // click/touchend: iPhone chỉ cho phát nhạc trong 2 sự kiện này (pointerdown không tính)
      const evs = ["click", "touchend", "keydown"];
      const card = $("#listen");
      const hideCard = () => { if (card.hidden) return; card.classList.add("is-leaving"); setTimeout(() => { card.hidden = true; }, 450); };
      const go = e => {
        if (e?.target?.closest?.("#music")) return; // bấm vào trình phát thì để trình phát tự xử lý
        evs.forEach(ev => document.removeEventListener(ev, go, true));
        hideCard();
        if (!player.playing) player.playIndex(loginSong, true);
      };
      player.playIndex(loginSong, true);
      // Trình duyệt thường chặn tự phát có tiếng → hiện thiệp mời nghe; chạm thiệp (hoặc bất kỳ đâu) là phát ngầm
      if (player.playable().includes(loginSong)) {
        evs.forEach(ev => document.addEventListener(ev, go, true));
        setTimeout(() => { if (!player.playing) card.hidden = false; }, 900);
      }
    }
    else if (notice) toast(notice[0], notice[1], 8000);
    else if (S().music && S().musicPrompt && player.playable().length)
      setTimeout(() => { if (!player.started) toast("Bật chút nhạc cho lãng mạn hơn nhé?", { label: "♪ Bật nhạc", fn: () => player.play() }, 9000); }, 1500);

    const nowStop = $(".stop.is-now");
    if (nowStop && !location.hash) setTimeout(() => nowStop.scrollIntoView({ behavior: "smooth", block: "center" }), 400);
  })();
})();
