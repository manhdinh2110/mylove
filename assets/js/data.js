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
    me: "Anh",
    you: "Em",
    since: "2024-02-14",
    tagline: "Sài Gòn quen thuộc, nhưng đi cùng em thì ngày nào cũng mới."
  },

  // Thư tay hiện dạng phong bì — sửa trong Cài đặt (bánh răng)
  letter: {
    title: "Gửi em",
    body: "Cảm ơn em đã luôn ở bên anh.\nHôm nay anh muốn cùng em đi lại những con đường quen, nhưng theo một cách thật mới.\nCứ thả lỏng và tận hưởng, mọi thứ để anh lo nhé.",
    sign: "Thương em, Anh"
  },

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
    budget: true, checklist: true, tips: true,
    cost: true, perPerson: false, details: true, note: true, love: true, mapBtns: true, compact: false,
    clock24: true, font: "m", accent: "rose",
    surprise: false, hearts: false,
    music: true, musicPrompt: true, letterMusic: true, shuffle: false, repeat: true
  },

  trip: {
    title: "Sài Gòn — Một ngày của hai ta",
    subtitle: "Phở sáng, phố cũ, hoàng hôn trên sông và đèn đêm Quận 1.",
    from: "Nhà",
    to: "Quận 1, TP. Hồ Chí Minh",
    stay: "Đi trong ngày",
    weather: "Mùa mưa: nắng sáng, có thể mưa rào chiều tối — mang áo mưa"
  },

  days: [
    {
      label: "Ngày hẹn hò",
      date: "2026-10-10",
      theme: "Một ngày yêu giữa lòng Sài Gòn",
      summary: "Phở sáng, dạo phố Pháp cổ, bánh xèo trưa, trốn nắng ở bảo tàng, buýt sông ngắm hoàng hôn, tối ốc và đi dạo phố đi bộ.",
      stops: [
        { time: "07:30", end: "08:15", type: "food", title: "Ăn sáng phở", place: "Phở Hòa Pasteur", address: "260C Pasteur, Quận 3, TP.HCM", transport: "Grab Bike / xe máy", cost: 180000, note: "Quán đông cuối tuần, đến sớm cho có chỗ ngồi.", love: "Ngày đẹp bắt đầu bằng tô phở nóng nha." },
        { time: "08:30", end: "09:15", type: "place", title: "Nhà thờ Đức Bà & Bưu điện Thành phố", place: "Bưu điện Trung tâm Sài Gòn", address: "2 Công xã Paris, Quận 1, TP.HCM", transport: "Xe máy (~10 phút)", cost: 0, note: "Gửi xe gần Công xã Paris, chụp ảnh đôi bên hàng cây trước nhà thờ. Có thể gửi một tấm bưu thiếp cho nhau." },
        { time: "09:15", end: "10:00", type: "shop", title: "Đường sách Nguyễn Văn Bình", place: "Đường sách Nguyễn Văn Bình", address: "Nguyễn Văn Bình, Quận 1, TP.HCM", transport: "Đi bộ (2 phút)", cost: 150000, note: "Chọn tặng nhau một cuốn sách, ghi vài dòng ở trang đầu." },
        { time: "10:15", end: "11:30", type: "coffee", title: "Cà phê chung cư 42 Nguyễn Huệ", place: "Chung cư 42 Nguyễn Huệ", address: "42 Nguyễn Huệ, Quận 1, TP.HCM", transport: "Đi bộ (~10 phút)", cost: 140000, note: "Thang máy có thu phí nhỏ. Chọn quán có ban công nhìn xuống phố đi bộ." },
        { time: "11:45", end: "12:45", type: "food", title: "Trưa: bánh xèo", place: "Bánh xèo 46A Đinh Công Tráng", address: "46A Đinh Công Tráng, Quận 1, TP.HCM", transport: "Grab Car (~10 phút)", cost: 300000, note: "Cuốn với rau sống, chấm nước mắm chua ngọt." },
        { time: "13:00", end: "14:45", type: "place", title: "Bảo tàng Mỹ thuật TP.HCM", place: "Bảo tàng Mỹ thuật TP.HCM", address: "97A Phó Đức Chính, Quận 1, TP.HCM", transport: "Grab Car (~15 phút)", cost: 60000, note: "Trốn nắng trưa, toà nhà cổ rất đẹp để chụp ảnh. Kiểm tra giờ mở cửa trước khi đi." },
        { time: "15:00", end: "15:45", type: "food", title: "Kem Bạch Đằng", place: "Kem Bạch Đằng", address: "26 Lê Lợi, Quận 1, TP.HCM", transport: "Grab Bike (~10 phút)", cost: 120000, note: "Kem dừa trái là món nên thử." },
        { time: "16:00", end: "16:45", type: "rest", title: "Nghỉ chân, tránh mưa chiều", place: "Phố đi bộ Nguyễn Huệ", transport: "Đi bộ", cost: 0, note: "Nếu trời mưa, ngồi lại quán cà phê gần đó chờ tạnh rồi đi tiếp." },
        { time: "17:00", end: "18:15", type: "move", title: "Buýt sông ngắm hoàng hôn", place: "Bến Bạch Đằng", address: "Tôn Đức Thắng, Quận 1, TP.HCM", transport: "Đi bộ ra bến, đi buýt sông khứ hồi", cost: 120000, note: "Kiểm tra lịch chạy và giá vé buýt sông trước. Ngồi phía ngoài boong để ngắm rõ hơn.", love: "Hoàng hôn trên sông Sài Gòn, chỉ có hai đứa." },
        { time: "18:45", end: "20:00", type: "food", title: "Tối: ốc", place: "Ốc Đào", address: "212B Nguyễn Trãi, Quận 1, TP.HCM", transport: "Grab Car (~10 phút)", cost: 450000, note: "Gọi ốc len xào dừa, sò điệp nướng mỡ hành." },
        { time: "20:15", end: "21:30", type: "place", title: "Dạo phố đi bộ & bờ sông về đêm", place: "Phố đi bộ Nguyễn Huệ", transport: "Grab Bike / đi bộ", cost: 50000, note: "Đi dọc ra bờ sông ngắm cầu Ba Son lên đèn.", love: "Nắm tay đi chậm thôi, tối nay không vội gì cả." },
        { time: "21:45", end: "22:15", type: "move", title: "Đưa em về", place: "Nhà", transport: "Xe máy / Grab", cost: 0, love: "Cảm ơn em vì một ngày thật đẹp ♥" }
      ]
    }
  ],

  checklist: [
    { group: "Mang theo", items: ["Áo mưa / ô gấp", "Sạc dự phòng", "Kem chống nắng", "Khăn giấy ướt", "Tiền mặt lẻ (gửi xe, quán nhỏ)"] },
    { group: "Chuẩn bị trước", items: ["Đặt lịch buýt sông", "Kiểm tra giờ mở cửa bảo tàng", "Nạp tiền ví Grab", "Chọn đồ đôi"] },
    { group: "Bất ngờ nhỏ", items: ["Bưu thiếp viết sẵn", "Một món quà nhỏ", "Playlist cho đường về"] }
  ],

  tips: [
    { title: "Thời tiết", text: "Mùa mưa ở Sài Gòn thường có mưa rào chiều tối. Sắp hoạt động ngoài trời vào buổi sáng và sau mưa." },
    { title: "Gửi xe", text: "Khu trung tâm nên gửi xe một chỗ rồi đi bộ. Giữ vé xe cẩn thận." },
    { title: "Di chuyển", text: "Khoảng cách trong Quận 1 cũ ngắn, đi bộ hoặc Grab Bike là nhanh nhất. Giờ cao điểm 17–19h kẹt xe." },
    { title: "An toàn", text: "Cầm điện thoại cẩn thận khi đi bộ sát lề đường, nhất là khu đông khách du lịch." }
  ]
};
