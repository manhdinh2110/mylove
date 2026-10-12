/**
 * ============================================================
 *  DỮ LIỆU MẶC ĐỊNH CỦA WEBSITE
 * ============================================================
 *  Có 2 cách chỉnh:
 *   1. Bấm nút "Chỉnh sửa" (biểu tượng cây bút) ngay trên web → sửa trực tiếp.
 *      Thay đổi tự lưu trên trình duyệt. Muốn mọi người cùng thấy:
 *      bấm "Tải data.js" rồi thay file này trên GitHub.
 *   2. Sửa tay file này.
 *
 *  Mỗi hoạt động (stop):
 *    time      "HH:MM"            giờ bắt đầu
 *    end       "HH:MM" (tuỳ chọn) giờ kết thúc
 *    type      food | coffee | place | move | stay | shop | rest
 *    title     tên hoạt động
 *    place     tên địa điểm (dùng để mở Google Maps)
 *    address   địa chỉ (tuỳ chọn)
 *    transport cách di chuyển tới đây
 *    cost      chi phí ước tính cho 2 người (VNĐ)
 *    note      ghi chú / mẹo
 *    love      lời nhắn nhỏ cho người ấy (tuỳ chọn)
 *
 *  Giá & giờ mở cửa chỉ để tham khảo — kiểm tra lại trước khi đi.
 * ============================================================
 */
window.LOVE_DATA = {
  couple: {
    me: "Dinh",
    you: "Kiều Mi",
    since: "2026-10-03",
    tagline: "Sài Gòn quen thuộc, nhưng đi cùng em thì ngày nào cũng mới."
  },

  // Trang đăng nhập (login.html) — đổi mật khẩu ở đây. Tắt login: enabled: false
  // Không phân biệt hoa/thường, gõ 03/10/2026 hay 03102026 đều được.
  login: {
    enabled: true,
    password: "03102026",
    hint: "Ngày mình bắt đầu quen nhau (ngày tháng năm, viết liền)",
    welcome: "Có một ngày thứ Bảy thật đẹp đang chờ em ở phía sau cánh cửa này."
  },

  // Thư tay hiện dạng phong bì — sửa trong Cài đặt (bánh răng)
  // letter: {
  //   title: "Gửi em",
  //   body: "Cảm ơn em đã luôn ở bên anh.\nHôm nay anh muốn cùng em đi lại những con đường quen, nhưng theo một cách thật mới.\nCứ thả lỏng và tận hưởng, mọi thứ để anh lo nhé.",
  //   sign: "Thương em, Anh"
  // },

  // Nhạc — dán link YouTube (hoặc link file .mp3 của bạn) vào "url".
  // Có thể dán ngay trên web: bấm nút nốt nhạc → "Dán link", hoặc Cài đặt → Nhạc.
  music: {
    songs: [
      { title: "My Love", artist: "Westlife", url: "" },
      { title: "Một Đời", artist: "14 Casper & Bon Nghiêm", url: "" },
      { title: "Ngày Còn Đôi Mươi", artist: "", url: "" },
      { title: "Secret", artist: "", url: "" }
    ]
  },

  // Cài đặt hiển thị — chỉnh trong nút Cài đặt, hoặc sửa tay ở đây
  settings: {
    countdown: true, loveStrip: true, showLetter: true, filters: true,
    budget: false, checklist: true, tips: true,
    cost: false, perPerson: false, details: true, note: true, love: true, mapBtns: true, compact: false,
    clock24: true, font: "m", accent: "blush",
    surprise: false, hearts: false, flowers: true,
    music: true, musicPrompt: true, letterMusic: true, shuffle: false, repeat: true
  },

  trip: {
    title: "Thứ Bảy của hai ta",
    subtitle: "Một buổi sáng tự tay làm nên điều xinh xắn, một buổi trưa lấp lánh ở Thủ Đức, và một buổi tối chỉ có ăm chả và bè chẽ.",
    from: "Củ Chi",
    to: "Quận 3 → TP. Thủ Đức",
    stay: "Đi trong ngày",
    weather: "Tháng 10 vẫn còn mùa mưa: sáng nắng nhẹ, chiều tối có thể mưa rào, quên mang ô thì để anh che cho nha ☂️"  
  },

  days: [
    {
      label: "Thứ Bảy",
      date: "2026-10-17",
      theme: "Một ngày dành trọn cho tụi mình",
      summary: "Sáng đi workshop tự tay làm một món kỷ niệm, trưa ăn và dạo ở GigaMall Thủ Đức, chiều về home nghỉ một chút, rồi đi cà phê, ăn tối và anh đưa em về.",
      stops: [
        { time: "09:00", end: "11:00", type: "place", title: "Workshop: cùng nhau làm một món kỷ niệm", cost: 500000, place: "Sundate Matcha Shelter", address: "102 Trần Quốc Toản, Xuân Hòa, Quận 3, TPHCM", love: "Món đồ mình làm hôm nay sẽ là thứ đầu tiên giữ lại kỷ niệm của ngày này và cả những tháng ngày sau đó của đôi ta" },
        { time: "11:00", end: "11:30", type: "move", title: "Lên đường tới GigaMall", place: "GigaMall Thủ Đức", address: "240–242 Phạm Văn Đồng, Hiệp Bình Chánh, TP. Thủ Đức", transport: "Xe máy từ Quận 3 (~30–40 phút)", cost: 10000, note: "Gửi xe ở hầm, chụp lại vị trí chỗ để xe cho dễ tìm lúc về.", love: "Em ngồi sau ôm chặt anh là được, đường để anh lo." },
        { time: "11:30", end: "12:15", type: "food", title: "Bữa trưa ở GigaMall Thủ Đức", place: "GigaMall Thủ Đức", address: "240–242 Phạm Văn Đồng, Hiệp Bình Chánh, TP. Thủ Đức", transport: "Đi bộ trong trung tâm", cost: 400000, note: "Tên quán sẽ chọn sau. Trưa cuối tuần khá đông, nên đặt bàn trước hoặc tới sớm vài phút.", love: "Hôm nay dợ là tuyệt với nhất" },
        { time: "12:15", end: "13:00", type: "shop", title: "Tay trong tay dạo GigaMall & chụp photobooth", place: "GigaMall Thủ Đức", address: "240–242 Phạm Văn Đồng, Hiệp Bình Chánh, TP. Thủ Đức", transport: "Đi bộ", cost: 150000, note: "Ghé xem đồ, chụp vài tấm ảnh", love: "Không cần mua gì, chỉ cần được đi bên em là đủ." },
        { time: "13:00", end: "15:30", type: "rest", title: "Về home nghỉ trưa", place: "—", transport: "Xe máy", cost: 0, note: "Trốn nắng trưa, nghỉ ngơi, sạc điện thoại và chuẩn bị cho buổi chiều.", love: "Nghỉ một chút để buổi chiều mình còn xinh tươi đi tiếp nha." },
        { time: "15:30", end: "17:00", type: "coffee", title: "Cà phê chiều & chụp hình đôi ta", place: "—", transport: "Xe máy", cost: 150000, note: "Quán sẽ chọn sau. Ưu tiên chỗ có ô cửa lớn và yên tĩnh để ngồi nói chuyện.", love: "Một ly cà phê, một buổi chiều chậm rãi, và em." },
        { time: "17:00", end: "19:00", type: "food", title: "Bữa tối của tụi mình", place: "—", transport: "Xe máy", cost: 600000, note: "Quán sẽ chọn sau. Giờ cao điểm 17–19h kẹt xe, nên đặt bàn trước.", love: "Bữa tối hôm nay là để cảm ơn dợ vì đã ở bên anh." },
        { time: "19:00", end: "21:00", type: "move", title: "Đưa em về nhà", place: "—", transport: "Xe máy", cost: 0, note: "Buổi tối đường Củ Chi gió lạnh, nhớ đưa em bé iuu áo khoác nếu em bé iu hăm có", love: "Cảm ơn dợ vì một ngày thật đẹp. Về tới nhà nhắn chằm nhé ♥" }
      ]
    }
  ],

  checklist: [
    { group: "Mang theo", items: ["Ô gấp / áo mưa", "Áo khoác cho đường về Củ Chi buổi tối", "Kem chống nắng", "Khăn giấy ướt", "Tiền mặt lẻ (gửi xe, quán nhỏ)"] },
    { group: "Chuẩn bị trước", items: ["Đặt chỗ workshop", "Chọn quán ăn trưa ở GigaMall", "Chọn quán cà phê chiều", "Đặt bàn ăn tối", "Đổ đầy xăng, kiểm tra xe (hôm nay chạy xa)"] },
    { group: "Bất ngờ nhỏ", items: ["Một bó hoa nhỏ", "Thư tay viết sẵn", "Playlist cho đường về"] }
  ],

  tips: [
    { title: "Thời tiết", text: "Tháng 10 ở Sài Gòn vẫn có mưa rào chiều tối. Buổi chiều đã có giờ nghỉ ở nhà, tiện tránh mưa." },
    { title: "Gửi xe", text: "GigaMall có hầm gửi xe. Chụp lại tầng và khu đỗ để lúc về khỏi phải đi tìm." },
    { title: "Di chuyển", text: "Chạy xe từ từ đưa, chở dợ iuu mụt cách an toàn" },
    { title: "Đường về", text: "Nhớ đưa dợ iuu gần củ chi nhất có thể" },
  ]
};
