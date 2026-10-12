/**
 * Cửa mật khẩu đơn giản cho trang tĩnh.
 * Mật khẩu đặt ở LOVE_DATA.login.password (data.js). Đổi mật khẩu là
 * mọi máy đã đăng nhập trước đó phải nhập lại.
 * Lưu ý: đây chỉ là "cửa" để người lạ không mở nhầm, không phải bảo mật thật —
 * ai xem mã nguồn (data.js) vẫn đọc được nội dung.
 */
window.LoveAuth = (() => {
  const KEY = "loveAuth";
  const cfg = () => (window.LOVE_DATA && window.LOVE_DATA.login) || {};
  // Không phân biệt hoa/thường, dấu cách, / . - (gõ 03/10/2026 hay 03102026 đều được)
  const norm = s => String(s || "").normalize("NFC").toLowerCase().replace(/[\s/.\-]+/g, "");
  const hash = s => { let h = 5381; for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i); return (h >>> 0).toString(36); };
  const token = () => "v1." + hash("love|" + norm(cfg().password));
  const cloud = () => !!(window.LoveCloud && LoveCloud.enabled());
  // Có Firebase → luôn cần đăng nhập (mật khẩu không nằm trong data.js nữa)
  const enabled = () => cloud() || (cfg().enabled !== false && !!norm(cfg().password));
  const get = () => { try { return localStorage.getItem(KEY); } catch { return null; } };

  return {
    enabled,
    cloud,
    ok: () => cloud() ? LoveCloud.ready() : (!enabled() || get() === token()),
    login(pw) {
      if (norm(pw) !== norm(cfg().password)) return false;
      try { localStorage.setItem(KEY, token()); } catch {}
      return true;
    },
    logout() { try { localStorage.removeItem(KEY); } catch {} if (cloud()) LoveCloud.logout(); },
    // Trang cần quay lại sau khi đăng nhập (giữ cả #share=… nếu có)
    next() {
      const n = new URLSearchParams(location.search).get("next") || "";
      return /^(index\.html)?([?#][^]*)?$/.test(n) ? (n || "index.html") : "index.html";
    },
    guard() {
      if (this.ok()) return;
      const here = "index.html" + location.search + location.hash;
      location.replace("login.html?next=" + encodeURIComponent(here));
    }
  };
})();
