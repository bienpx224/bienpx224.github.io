/* Nội dung động của trang trình bày: sơ đồ, danh sách việc, hành trình đơn và ghi chú người nói.
   Sửa chữ ở đây, không cần đụng app.js. Ảnh nằm trong assets/demo/. */
window.ETIS = {
  // Slide 2: các đầu việc đang đổ về lãnh đạo
  hub: [
    { icon: "fa-handshake", name: "Sale", sub: "~8 người", ok: "khách của công ty" },
    { icon: "fa-building", name: "Khách lớn", sub: "lãnh đạo tự chăm", ok: "trợ lý lo đơn" },
    { icon: "fa-warehouse", name: "Kho Hà Nội", sub: "tồn lệch", ok: "tồn đúng" },
    { icon: "fa-truck", name: "Đội xe", sub: "xếp chuyến tay", ok: "chuyến đầy" },
    { icon: "fa-location-dot", name: "Kho Sài Gòn", sub: "chờ Hà Nội", ok: "tự chạy" },
    { icon: "fa-calculator", name: "Văn phòng", sub: "7 người", ok: "đúng việc" },
    { icon: "fa-store", name: "Online", sub: "Shopee · TikTok", ok: "đơn về chung" }
  ],

  // Slide 5: việc lãnh đạo đang tự làm → chuyển cho ai
  handover: [
    { task: "Lên đơn, chụp tin nhắn gửi nhóm", to: "Trợ lý kinh doanh", icon: "fa-user-pen" },
    { task: "Điều phối kho, gọi hàng thiếu", to: "Quản kho", icon: "fa-clipboard-list" },
    { task: "Xếp xe, ghép chuyến", to: "Quản kho / điều phối", icon: "fa-route" },
    { task: "Nhắc nợ, đòi tiền khách", to: "Sale · hệ thống tự nhắc", icon: "fa-bell" },
    { task: "Hỏi số, gom tình hình", to: "Báo cáo tự động", icon: "fa-chart-pie" },
    { task: "Chấm lương thưởng", to: "Theo số trên hệ thống", icon: "fa-medal" }
  ],

  // Slide 6: nhánh có sẵn (now) và nhánh thêm sau (add)
  grow: [
    { icon: "fa-warehouse", name: "Kho Hà Nội" },
    { icon: "fa-location-dot", name: "Kho Sài Gòn", sub: "tự chạy" },
    { icon: "fa-truck", name: "Đội xe" },
    { icon: "fa-handshake", name: "Sale hiện tại" },
    { icon: "fa-bag-shopping", name: "Shopee" },
    { icon: "fa-plus", name: "Kho mới", add: true },
    { icon: "fa-plus", name: "Đội sale mới", add: true },
    { icon: "fa-plus", name: "TikTok Shop", add: true },
    { icon: "fa-plus", name: "Website", add: true },
    { icon: "fa-plus", name: "Xe mới", add: true }
  ],

  // Phụ lục: hành trình một đơn hàng sỉ
  journey: [
    { icon: "fa-pen-to-square", name: "Tạo đơn", who: "Sale · Trợ lý kinh doanh",
      title: "Khách gọi: lên đơn ngay trên điện thoại",
      pts: ["Chọn khách, chọn hàng, giá theo kênh", "Không còn Excel, không chụp tin nhắn", "Kho, kế toán thấy đơn cùng lúc"],
      img: "crm-orders.jpg", url: "crm.etis.vn" },
    { icon: "fa-clipboard-check", name: "Soạn hàng", who: "Quản kho · Thủ kho",
      title: "Chiều nay biết sáng mai cần gì",
      pts: ["Gom hàng cho mọi đơn ngày mai", "Thiếu thì cử người đi lấy ngay", "Tồn tự trừ khi xuất kho"],
      img: "wms-inventory.jpg", url: "wms.etis.vn" },
    { icon: "fa-map-location-dot", name: "Xếp chuyến", who: "Quản kho / điều phối",
      title: "Đơn cùng tuyến lên cùng một xe",
      pts: ["Ghép đơn nhiều khách cùng tuyến", "Sắp thứ tự điểm giao", "Đơn gấp được chèn chuyến"],
      img: "wms.jpg", url: "wms.etis.vn" },
    { icon: "fa-camera", name: "Giao", who: "Tài xế",
      title: "Giao xong: chụp ảnh là xong",
      pts: ["Ảnh hàng + ảnh biên nhận có chữ ký", "Ghi số thực giao, tiền thu", "Văn phòng thấy ngay"],
      img: null, url: "App tài xế · đang hoàn thiện" },
    { icon: "fa-sack-dollar", name: "Thu tiền", who: "Kế toán",
      title: "Tiền về đâu, ai còn nợ: rõ ngay",
      pts: ["Tiền mặt tài xế nộp ghi ngay", "Chuyển khoản đối chiếu ngân hàng", "Khách chưa trả: sale phụ trách đi thu"],
      img: "fnm.jpg", url: "fnm.etis.vn" },
    { icon: "fa-chart-line", name: "Chủ xem", who: "Lãnh đạo",
      title: "Không cần hỏi ai",
      pts: ["Đơn hôm nay, xe đang chạy, tiền thu, tồn", "Doanh số theo sale, theo kênh", "Xem trên điện thoại"],
      img: "rp-orders.jpg", url: "report.etis.vn" }
  ],

  // Slide Xem thật: ảnh bản thử + đường dẫn mở hệ thống demo
  demo: [
    { img: "rp-orders.jpg", url: "https://report.etis.vn", title: "Báo cáo đơn hàng", sub: "Doanh số theo ngày, theo sale, theo kênh" },
    { img: "rp-stock.jpg", url: "https://report.etis.vn", title: "Báo cáo kho, mua hàng", sub: "Tồn, nhập, xuất, sắp hết hàng" },
    { img: "fnm.jpg", url: "https://fnm.etis.vn", title: "Dòng tiền thu – chi", sub: "Quỹ, ngân hàng, số dư theo ngày" },
    { img: "fnm-requests.jpg", url: "https://fnm.etis.vn", title: "Phiếu đề nghị có duyệt", sub: "Tạm ứng, thanh toán, trưởng phòng – kế toán duyệt" },
    { img: "crm-orders.jpg", url: "https://crm.etis.vn", title: "Lên đơn một lần", sub: "Kho, kế toán thấy cùng lúc" },
    { img: "wms-inventory.jpg", url: "https://wms.etis.vn", title: "Tồn hai kho", sub: "Hà Nội, Sài Gòn, cảnh báo sắp hết" }
  ],

  // Ghi chú người nói theo id slide: min = phút gợi ý, say = ý chính, ask = câu hỏi lãnh đạo
  notes: {
    "mo-dau": { min: 1, say: ["Cảm ơn lãnh đạo đã dành thời gian cho Upnet.", "Hôm nay không nói phần mềm trước. Nói lãnh đạo được gì.", "Ba điều: bớt việc, số liệu rõ ràng, sẵn sàng mở rộng."] },
    "hom-nay": { min: 2, say: ["ETIS bán tốt: 13–14 tỷ/tháng. Đó là công của lãnh đạo.", "Nhưng mọi đơn, mọi câu hỏi, mọi khoản tiền đều chạy qua lãnh đạo.", "→ Bấm: hình đổi. Mọi người làm trên một hệ thống, lãnh đạo chỉ xem và quyết."], ask: "Tuần rồi lãnh đạo phải gọi hỏi tình hình bao nhiêu lần?" },
    "gt-so-lieu": { min: 2, say: ["Nỗi đau chính: muốn biết số phải hỏi. Ý nhỏ đọc lướt keyword.", "→ Bấm: Excel, Zalo, sổ tay gom về một chỗ. Điện thoại cập nhật trực tiếp.", "→ Bấm: một lần nhập. Đơn, kho, tiền tự khớp. Ai sửa gì có dấu.", "MISA vẫn làm thuế như cũ, không đụng."], ask: "Muốn biết tồn kho giấy cuộn hôm nay thì hỏi ai, mất bao lâu?" },
    "gt-hieu-qua": { min: 2, say: ["Hôm nay đánh giá người bằng cảm giác. Chính ETIS nói xe chạy 60–70% sức.", "→ Bấm: mỗi khối một bảng điểm. Sale, xe, kho, văn phòng.", "→ Bấm: ghép chuyến đầy, mỗi xe thêm 25–40% đơn. Ước tính, đo thật 2 tuần đầu.", "Lương thưởng theo kết quả: có số thì công bằng, người giỏi ở lại."] },
    "gt-dong-tien": { min: 2, say: ["Hàng cồng kềnh, lãi mỏng: dòng tiền là sống còn.", "→ Bấm: thu – chi theo ngày, công nợ theo tuổi nợ, cảnh báo hôm nay.", "→ Bấm: mỗi ngày biết tiền vào, ra, ai nợ. Cảnh báo sớm thay vì cuối tháng mới biết.", "Rủi ro: tiền tài xế cầm, nợ quá hạn, lệch tồn. Hệ thống báo trước."], ask: "Hiện lãnh đạo biết tổng công nợ khách vào lúc nào trong tháng?" },
    "gt-bot-viec": { min: 2, say: ["Phần quan trọng nhất. Nói chậm.", "→ Bấm: từng việc lãnh đạo đang làm chuyển về đúng người.", "Lãnh đạo giữ ba việc: khách lớn, định hướng, duyệt.", "→ Bấm: 6 việc có người chịu trách nhiệm. Đi vắng một tuần, việc vẫn chạy."], ask: "Nếu lãnh đạo đi vắng một tuần, việc gì sẽ dừng đầu tiên?" },
    "gt-mo-rong": { min: 1.5, say: ["ETIS muốn mở rộng miền Nam, mở TikTok Shop, thêm xe.", "→ Bấm: thêm kho, thêm kênh, thêm người là thêm một dòng cài đặt. Cùng một cách làm.", "→ Bấm: Sài Gòn tự chạy. Chạy đầy xe trước khi mua xe."] },
    "cach-di": { min: 1.5, say: ["Người trước, máy sau. Mua phần mềm mà giữ cách làm cũ thì chỉ thêm chỗ phải nhập.", "→ Bấm: ba bước, tránh dồn việc mùa Tết.", "→ Bấm: hỗ trợ 24/7, hệ thống ổn định, đo trước – sau."] },
    "demo": { min: 5, say: ["Mở report.etis.vn bằng tài khoản giám đốc (xem tài liệu môi trường demo).", "Thứ tự: báo cáo → dòng tiền → lên một đơn → đơn hiện ở kho.", "Không dùng tài khoản quản trị. Không bấm đăng nhập Zalo."] },
    "gia-tri-lau-dai": { min: 1.5, say: ["Trái: thấy ngay sau 3 tháng, có số đo.", "→ Bấm: mục tiêu lớn hơn. ETIS chuyên nghiệp từ bên trong ra bên ngoài.", "Khách lớn (tòa nhà, bệnh viện) nhìn vào thấy ETIS có hệ thống, đáng tin cậy."] },
    "bat-dau": { min: 1.5, say: ["Chốt lại: một hệ thống ERP cho toàn ETIS, sáu mảng trên một tài khoản.", "Upnet đi cùng: phần mềm, tư vấn quy trình, đào tạo, hỗ trợ 24/7.", "→ Bấm: lời cảm ơn. Chuyển sang hỏi đáp."] },
    "pl-don-hang": { min: 0, say: ["Mở khi lãnh đạo hỏi chi tiết luồng đơn."] },
    "pl-to-chuc": { min: 0, say: ["Mở khi bàn ai làm việc gì. Không nêu tên người."] },
    "pl-tai-xe": { min: 0, say: ["App tài xế đang hoàn thiện. Nói rõ là hình minh họa."] },
    "pl-du-lieu": { min: 0, say: ["Mở khi lãnh đạo hỏi dữ liệu để ở đâu, ai xem được, MISA thế nào."] }
  }
};
