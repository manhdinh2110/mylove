/**
 * Đồng bộ kế hoạch giữa các máy qua Firebase Realtime Database (REST + EventSource).
 *
 * Không cần email: dữ liệu nằm ở /plans/<khoá>, khoá = PBKDF2(mật khẩu chung).
 * Ai gõ đúng mật khẩu mới tính ra được khoá → mới đọc/ghi được.
 * Mật khẩu không lưu ở đâu cả, trên máy chỉ giữ khoá sau khi đăng nhập.
 *
 * Cấu trúc:  /plans/<khoá>/plan  = { json, by, at }   (toàn bộ kế hoạch, dạng chuỗi JSON)
 *            /plans/<khoá>/check = { json, by, at }   (các mục checklist đã tick)
 */
window.LoveCloud = (() => {
  const KEY = "loveCloudKey";
  const url = () => String((window.LOVE_CLOUD && window.LOVE_CLOUD.databaseURL) || "").trim().replace(/\/+$/, "");
  const enabled = () => /^https:\/\/[\w.-]+$/.test(url());
  const me = Math.random().toString(36).slice(2, 10); // mã của tab này, để bỏ qua tiếng vọng của chính mình
  const norm = s => String(s || "").normalize("NFC").toLowerCase().replace(/[\s/.\-]+/g, "");

  const getKey = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
  const setKey = k => { try { k ? localStorage.setItem(KEY, k) : localStorage.removeItem(KEY); } catch {} };
  const node = (k, p = "") => `${url()}/plans/${k}${p}.json`;

  async function deriveKey(pw) {
    if (!crypto?.subtle) throw new Error("Trình duyệt không hỗ trợ mã hoá (cần mở bằng https)");
    const enc = new TextEncoder();
    const base = await crypto.subtle.importKey("raw", enc.encode(norm(pw)), "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: enc.encode("mylove|" + url()), iterations: 200000 }, base, 256);
    return [...new Uint8Array(bits)].map(b => b.toString(16).padStart(2, "0")).join("");
  }
  async function req(method, path, body) {
    const r = await fetch(path, { method, body: body === undefined ? undefined : JSON.stringify(body), cache: "no-store" });
    if (!r.ok) throw new Error(`Firebase ${r.status}`);
    return r.json();
  }
  const pack = obj => ({ json: JSON.stringify(obj), by: me, at: Date.now() });
  const unpack = v => { try { return v && typeof v.json === "string" ? JSON.parse(v.json) : null; } catch { return null; } };

  /* ---------- Đăng nhập ---------- */
  // Trả về true nếu mật khẩu đúng (đã có kế hoạch ứng với mật khẩu này)
  async function login(pw) {
    const k = await deriveKey(pw);
    const plan = await req("GET", node(k, "/plan/at"));
    if (plan == null) return false;
    setKey(k); return true;
  }
  // Tạo kế hoạch mới gắn với mật khẩu (dùng 1 lần lúc thiết lập)
  async function create(pw, plan, check = []) {
    const k = await deriveKey(pw);
    if (await req("GET", node(k, "/plan/at")) != null) throw new Error("Mật khẩu này đã có kế hoạch rồi, hãy đăng nhập");
    await req("PUT", node(k), { plan: pack(plan), check: pack(check) });
    setKey(k); return true;
  }

  /* ---------- Đọc / ghi ---------- */
  const load = async () => {
    const v = await req("GET", node(getKey()));
    return { plan: unpack(v?.plan), check: unpack(v?.check) };
  };
  const timers = {};
  const write = (part, obj, delay = 400) => new Promise((ok, fail) => {
    clearTimeout(timers[part]?.t);
    timers[part] = { t: setTimeout(() => req("PUT", node(getKey(), "/" + part), pack(obj)).then(ok, fail), delay) };
  });

  // Lắng nghe thay đổi từ máy khác. cb(part, value) với part = "plan" | "check"
  function listen(cb, onState) {
    const es = new EventSource(node(getKey()));
    const apply = async e => {
      let msg; try { msg = JSON.parse(e.data); } catch { return; }
      const path = msg.path || "/";
      // "/" = toàn bộ dữ liệu (lúc mới kết nối / kết nối lại)
      if (path === "/") { ["plan", "check"].forEach(p => { if (msg.data?.[p] && msg.data[p].by !== me) cb(p, unpack(msg.data[p])); }); return; }
      const m = path.match(/^\/(plan|check)$/);
      if (m) { if (msg.data?.by !== me) cb(m[1], unpack(msg.data)); return; }
      // Thay đổi ở đường dẫn khác (hiếm) → tải lại toàn bộ
      const all = await load().catch(() => null);
      if (all) { cb("plan", all.plan); cb("check", all.check); }
    };
    es.addEventListener("put", apply);
    es.addEventListener("patch", apply);
    es.onopen = () => onState?.(true);
    es.onerror = () => onState?.(false);
    return () => es.close();
  }

  return {
    enabled,
    ready: () => enabled() && !!getKey(),
    login, create, load, write, listen,
    logout: () => setKey(null)
  };
})();
