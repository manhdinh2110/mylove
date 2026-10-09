# ♥ Hành trình của hai ta

Website tĩnh (HTML/CSS/JS thuần, không cần build) để lên kế hoạch hẹn hò / chuyến đi của hai đứa, **chỉnh sửa trực tiếp trên web**: lịch trình từng ngày theo giờ, nơi ăn, nơi chơi, cách di chuyển, chi phí, checklist và lưu ý.

## Tính năng

- **Lịch trình theo ngày** dạng timeline: giờ bắt đầu/kết thúc, địa điểm, địa chỉ, cách di chuyển, chi phí, ghi chú, lời nhắn yêu thương
- **Nút "Chỉ đường" / "Xem bản đồ"** mở thẳng Google Maps cho từng điểm
- **Lọc** theo loại: ăn uống, cà phê, tham quan, di chuyển, lưu trú, mua sắm, nghỉ ngơi
- **Chế độ "Hôm nay"**: trong ngày đi, tự mở đúng ngày, làm mờ hoạt động đã qua, nhấp nháy hoạt động đang diễn ra và cuộn tới đó
- **Đếm ngược** tới giờ khởi hành + **đếm số ngày yêu nhau**
- **Ngân sách** tự tính tổng, theo loại, theo ngày, chia đầu người
- **Checklist hành lý** lưu trên trình duyệt
- Giao diện **sáng/tối**, **responsive** trên điện thoại, **in / lưu PDF** gọn gàng, hỗ trợ bàn phím

## Cài đặt hiển thị ⚙️

Bấm nút **bánh răng** để mở bảng cài đặt. Mọi thay đổi áp dụng ngay và được lưu cùng kế hoạch (nên cũng đi theo **Chia sẻ link** và **Tải data.js**).

- **Ẩn / hiện từng mục**: đồng hồ đếm ngược, dải "đã bên nhau … ngày", thư tay, bộ lọc, Ngân sách, Chuẩn bị, Lưu ý
- **Chi tiết mỗi hoạt động**: chi phí (tắt là ẩn mọi con số tiền), địa chỉ & di chuyển, ghi chú, lời nhắn, nút chỉ đường; **chế độ gọn** chỉ giữ giờ, tên, địa điểm
- **Cách tính chi phí**: tổng 2 người hoặc mỗi người
- **Giao diện**: 5 màu chủ đạo, 3 cỡ chữ, giờ 24h hoặc 12h (SA/CH)
- **Chế độ bất ngờ** 🎁: các hoạt động chưa tới giờ chỉ hiện "Bất ngờ" và tự hé lộ đúng giờ (có nút hé lộ sớm). Khi bạn bật chỉnh sửa thì vẫn thấy hết.
- **Tim bay lơ lửng**: hiệu ứng nhẹ trên nền (tự tắt nếu máy bật giảm chuyển động)
- **Thư tay** ✉️: phong bì nhỏ trên trang, chạm để mở. Sửa tiêu đề, nội dung, chữ ký ngay trong cài đặt; để trống nội dung là ẩn thư.

## Nhạc 🎵

Nút **nốt nhạc** ở góc dưới bên trái mở trình phát: phát/dừng, bài trước/sau, tua, ngẫu nhiên, lặp lại, danh sách bài.

Danh sách có sẵn: *My Love*, *Một Đời*, *Ngày Còn Đôi Mươi*, *Secret* — **mỗi bài cần dán link một lần**:

1. Bấm **Tìm** cạnh bài → YouTube mở ra, chọn đúng bài
2. Trên YouTube bấm **Chia sẻ → Sao chép đường liên kết**
3. Quay lại trang, bấm **Dán link** → dán → **Lưu & phát**

Thêm / xoá / đổi thứ tự bài, sửa tên, ca sĩ, link: **Cài đặt → Nhạc**. Link được lưu cùng kế hoạch nên đi theo **Chia sẻ link** và **Tải data.js**.

- Nhạc phát qua trình phát YouTube nhúng chính thức (hiện khung video nhỏ trong trình phát). Nếu một video bị chủ kênh chặn nhúng, trang sẽ báo — hãy dán link bản *Official Audio* hoặc *Lyric Video* khác.
- Trình duyệt không cho tự phát nhạc có tiếng, nên trang sẽ **mời bật nhạc** khi mở, và có thể **tự phát khi mở thư tay** (tắt được trong Cài đặt).
- Có file nhạc của riêng mình? Đặt vào thư mục `music/` và dán link `music/ten-bai.mp3`. Đừng đưa nhạc có bản quyền lên repo công khai.
- YouTube nhúng cần chạy trên web thật (GitHub Pages). Mở trực tiếp file `index.html` trên máy có thể không phát được video YouTube.

## Chỉnh sửa ngay trên web ✏️

Bấm nút **cây bút** ở góc trên bên phải để vào chế độ chỉnh sửa:

- **Sửa thông tin chung**: tên hai người, ngày yêu, tên chuyến đi, thời tiết…
- **Thêm / sửa / nhân bản / xoá hoạt động**: giờ, loại, địa điểm, địa chỉ, di chuyển, chi phí, ghi chú, lời nhắn. Hoạt động tự sắp xếp theo giờ.
- **Thêm / sửa / xoá ngày**, nhóm checklist, từng mục checklist, lưu ý
- **Hoàn tác** (hoặc Ctrl+Z) nếu lỡ tay xoá
- Mọi thay đổi **tự lưu trên trình duyệt** của máy đang dùng

Thanh công cụ phía dưới có:

| Nút | Dùng để |
|---|---|
| **Chia sẻ link** | Sao chép một link chứa toàn bộ kế hoạch. Người ấy mở link là thấy đúng bản bạn vừa sửa, không cần đẩy lên GitHub. |
| **Tải data.js** | Tải file dữ liệu. Thay file `assets/js/data.js` trên GitHub bằng file này → mọi người vào trang đều thấy bản mới. |
| Thêm → Xuất / Nhập file | Sao lưu hoặc chuyển kế hoạch sang máy khác |
| Thêm → Khôi phục bản gốc | Quay về nội dung trong `data.js` |

> Vì GitHub Pages là trang tĩnh, sửa trên web chỉ lưu ở máy bạn. Muốn cập nhật "chính thức" thì dùng **Tải data.js** rồi commit file đó (trên GitHub có thể bấm *Add file → Upload files* ngay trong thư mục `assets/js`). Khi `data.js` trên web thay đổi, trang tự dùng bản mới và vẫn cho bạn mở lại bản nháp cũ.

## Chỉnh nội dung bằng tay

Mọi nội dung mặc định nằm trong **`assets/js/data.js`** — không cần đụng tới HTML/CSS.

- `couple`: tên hai người, ngày bắt đầu yêu
- `trip`: tên chuyến đi, nơi đi/đến, chỗ ở, thời tiết (đồng hồ đếm ngược tự lấy theo ngày đầu tiên + giờ của hoạt động đầu tiên)
- `days`: mỗi ngày gồm `stops` — xem chú thích đầu file để biết từng trường
- `checklist`, `tips`: chuẩn bị & lưu ý
- `letter`: thư tay; `music.songs`: danh sách nhạc; `settings`: cài đặt hiển thị mặc định

Muốn thêm ngày → copy một khối `{ label, date, ... }` trong `days`.

## Chạy thử trên máy

Mở thẳng `index.html` bằng trình duyệt là chạy (kể cả chế độ chỉnh sửa).

## Đưa lên GitHub Pages

```bash
cd love-site
git init
git add .
git commit -m "Trang kế hoạch chuyến đi của hai ta"
git branch -M main
git remote add origin https://github.com/<ten-ban>/<ten-repo>.git
git push -u origin main
```

Sau đó vào repo trên GitHub → **Settings → Pages** → *Source*: **Deploy from a branch** → chọn `main` / `/ (root)` → **Save**.
Khoảng 1–2 phút sau trang sẽ có ở `https://<ten-ban>.github.io/<ten-repo>/`.

> Lưu ý: repo public thì ai có link cũng xem được. Đừng đưa thông tin nhạy cảm (số điện thoại, mã đặt phòng…) vào `data.js`.

## Cấu trúc

```
love-site/
├── index.html
├── .nojekyll
├── music/          ← (tuỳ chọn) file nhạc riêng
├── assets/
│   ├── css/style.css
│   └── js/
│       ├── data.js   ← sửa nội dung ở đây
│       └── app.js
└── README.md
```
