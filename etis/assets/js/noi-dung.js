/* Nội dung động của trang trình bày: bài toán, hành trình đơn, một ngày theo vị trí.
   Sửa chữ ở đây, không cần đụng app.js. Ảnh nằm trong assets/demo/. */
window.ETIS = {
  // Bài toán → cách xử lý (mã B* khớp tài liệu kế hoạch giải pháp)
  problems: [
    {
      tab: "Chủ phải hỏi mới biết", icon: "fa-eye-slash",
      before: "Muốn biết đơn đâu, đóng chưa, ai làm gì — phải gọi, phải hỏi. Vắng vài ngày là việc chững.",
      after: "Mọi việc hiện trên một màn hình. Chủ mở điện thoại là thấy.",
      who: "Mỗi khâu có một người chịu trách nhiệm, báo cáo lên chủ",
      how: "Giao ban đầu tuần bằng số liệu, không bằng trí nhớ",
      tool: "Báo cáo ngày / tuần / tháng trên điện thoại",
      measure: "Số lần chủ phải hỏi, nhắc việc mỗi ngày"
    },
    {
      tab: "Một đơn, nhập nhiều lần", icon: "fa-copy",
      before: "Sale gửi Excel, Zalo, ảnh chụp tin nhắn. Văn phòng chép lại vào máy. Kho lại tự lấy để in.",
      after: "Đơn tạo một lần. Kho, kế toán thấy ngay, chỉ việc xác nhận.",
      who: "Sale tự lên đơn; trợ lý kinh doanh lên đơn thay chủ",
      how: "Chốt đơn trước giờ cố định mỗi ngày",
      tool: "Bán hàng: khách, đơn, bảng giá theo kênh",
      measure: "Số người chạm vào một đơn · thời gian từ chốt đơn tới kho nhận"
    },
    {
      tab: "Tồn trên máy ≠ tồn thật", icon: "fa-boxes-stacked",
      before: "Không kiểm kê. Tồn lệch nhiều. Xếp xe mới biết thiếu hàng, phải chờ xe đi xưởng lấy.",
      after: "Tồn đúng thực tế. Chiều nay biết sáng mai thiếu gì, cử người đi lấy trước.",
      who: "Một quản kho chịu trách nhiệm tồn và hàng cho đơn ngày mai",
      how: "Nhập, xuất theo phiếu · kiểm kê định kỳ giờ rảnh · lệch thì giải trình",
      tool: "Kho: tồn tự trừ khi xuất, cảnh báo sắp hết, kiểm kê",
      measure: "Tỷ lệ lệch tồn sau kiểm kê · số chuyến trễ vì thiếu hàng"
    },
    {
      tab: "Sài Gòn chờ Hà Nội", icon: "fa-route",
      before: "Đơn Sài Gòn do Hà Nội lên, xuất file gửi vào. Có người đứng giữa chỉ để chuyển thông tin.",
      after: "Kho Sài Gòn tự nhận đơn, tự in phiếu, tự giao, tự xác nhận.",
      who: "Kho Sài Gòn tự điều phối",
      how: "Bỏ khâu chuyển tay trung gian",
      tool: "Một hệ thống chung, nhiều kho",
      measure: "Số bước chuyển tay cho một đơn Sài Gòn"
    },
    {
      tab: "Xe chưa chạy hết sức", icon: "fa-truck",
      before: "Không biết xe giao bao nhiêu đơn, mất bao lâu. Lương cố định, khó khoán.",
      after: "Mỗi chuyến có danh sách, có ảnh giao, có thời gian. Đủ số để khoán, để thưởng.",
      who: "Tài xế có định mức đơn / chuyến",
      how: "Ghép đơn cùng tuyến thành chuyến · giao xong chụp biên nhận",
      tool: "App tài xế: chuyến hôm nay, chụp ảnh, tiền thu",
      measure: "Đơn / xe / ngày · thời gian chuyến so định mức"
    },
    {
      tab: "Kế toán ôm việc vận hành", icon: "fa-calculator",
      before: "Lên đơn, in phiếu, gọi hàng, sổ tiền mặt… đều dồn về phòng kế toán. Biên nhận, tiền thu qua nhiều tay.",
      after: "Kế toán làm đúng việc kế toán. Việc vận hành về đúng người. Tiền thu ghi ngay.",
      who: "Xếp lại vị trí: trợ lý kinh doanh, quản kho, kế toán",
      how: "Biên nhận có chữ ký là căn cứ thu tiền, xuất hóa đơn",
      tool: "Tài chính: thu chi, quỹ, công nợ, phiếu đề nghị có duyệt",
      measure: "Số vị trí làm kế toán · số ngày từ giao hàng tới thu tiền"
    },
    {
      tab: "Kinh doanh thiếu người dẫn dắt", icon: "fa-users",
      before: "Chưa có quản lý, chưa có mục tiêu. Thông tin khách nằm trong điện thoại riêng của sale.",
      after: "Đội có người dẫn dắt, có mục tiêu. Khách là của công ty, nằm trên hệ thống.",
      who: "Quản lý kinh doanh · đội sale mới có mục tiêu",
      how: "Báo cáo ngày · bảng giá thống nhất · đào tạo sản phẩm",
      tool: "Khách gắn sale phụ trách; sale chỉ thấy khách của mình",
      measure: "Khách mới / tháng · tỷ lệ khách có trên hệ thống"
    }
  ],

  // Hành trình một đơn hàng sỉ
  journey: [
    { icon: "fa-pen-to-square", name: "Tạo đơn", sub: "Sale / Trợ lý", who: "Sale · Trợ lý kinh doanh",
      title: "Khách gọi — lên đơn ngay trên điện thoại",
      pts: ["Chọn khách, chọn hàng, giá lấy theo kênh", "Không còn Excel, không còn chụp tin nhắn", "Kho, kế toán thấy đơn cùng lúc"],
      img: "crm-orders.jpg", url: "crm.etis.vn" },
    { icon: "fa-clipboard-check", name: "Chốt & soạn", sub: "Quản kho / Thủ kho", who: "Quản kho · Thủ kho",
      title: "Chiều nay biết sáng mai cần gì",
      pts: ["Gom hàng cho mọi đơn ngày mai", "Đủ hàng: soạn một lượt. Thiếu: cử người đi lấy ngay", "Tồn tự trừ khi xuất kho"],
      img: "wms-inventory.jpg", url: "wms.etis.vn" },
    { icon: "fa-map-location-dot", name: "Xếp chuyến", sub: "Điều phối", who: "Quản kho / điều phối",
      title: "Đơn cùng tuyến lên cùng một xe",
      pts: ["Ghép đơn nhiều khách cùng tuyến thành chuyến", "Sắp thứ tự điểm giao", "Đơn gấp được chèn chuyến"],
      img: "wms.jpg", url: "wms.etis.vn" },
    { icon: "fa-camera", name: "Giao & biên nhận", sub: "Tài xế", who: "Tài xế",
      title: "Giao xong — chụp ảnh là xong",
      pts: ["Ảnh hàng đã giao + ảnh biên nhận có chữ ký", "Ghi số lượng thực giao, tiền thu", "Văn phòng thấy ngay, không chờ xe về"],
      img: null, url: "App tài xế — đang hoàn thiện" },
    { icon: "fa-sack-dollar", name: "Thu tiền", sub: "Kế toán", who: "Kế toán",
      title: "Tiền về đâu, ai còn nợ — rõ ngay",
      pts: ["Tiền mặt tài xế nộp ghi ngay", "Chuyển khoản đối chiếu ngân hàng", "Khách chưa trả: công nợ, sale phụ trách đi thu"],
      img: "fnm.jpg", url: "fnm.etis.vn" },
    { icon: "fa-file-invoice", name: "Hóa đơn", sub: "Kế toán", who: "Kế toán",
      title: "Có biên nhận mới xuất hóa đơn",
      pts: ["Đơn nào cần hóa đơn được đánh dấu từ đầu", "Hóa đơn gắn vào đơn", "Kế toán thuế vẫn làm trên MISA như cũ"],
      img: "fnm-requests.jpg", url: "fnm.etis.vn" },
    { icon: "fa-chart-line", name: "Chủ xem", sub: "Chủ doanh nghiệp", who: "Chủ doanh nghiệp",
      title: "Không cần hỏi ai",
      pts: ["Đơn hôm nay, xe đang chạy, tiền thu, tồn kho", "Doanh số theo sale, theo kênh", "Xem trên điện thoại, ở đâu cũng được"],
      img: "rp-orders.jpg", url: "report.etis.vn" }
  ],

  // Một ngày làm việc mới theo vị trí
  roles: [
    { key: "sale", icon: "fa-handshake", name: "Sale", img: "crm-customers.jpg",
      day: [["Sáng", "Đi gặp khách, mời hàng — có bảng giá chung trên điện thoại"], ["Khi chốt", "Lên đơn tại chỗ, khách gắn tên mình"], ["Trước giờ chốt", "Xác nhận đơn giao ngày mai"], ["Cuối ngày", "Xem đơn đã giao, khách nào còn nợ để đi thu"]],
      gain: "Không còn gửi Excel, không bị hỏi lại. Khách của mình — mình thấy, người khác không thấy." },
    { key: "troly", icon: "fa-user-pen", name: "Trợ lý kinh doanh", img: "crm-orders.jpg",
      day: [["Cả ngày", "Nhận yêu cầu của chủ, lên đơn thay chủ"], ["Khi khách hỏi", "Báo giá, trả lời tin nhắn"], ["Chiều", "Kiểm đơn khách lớn đã xác nhận đủ chưa"], ["Cuối ngày", "Gửi chủ tình hình khách quan trọng"]],
      gain: "Chủ không còn tự lên đơn, tự chụp tin nhắn gửi nhóm." },
    { key: "quankho", icon: "fa-warehouse", name: "Quản kho / điều phối", img: "wms-inventory.jpg",
      day: [["Sau giờ chốt", "Xem tổng hàng cần cho ngày mai, theo từng kho"], ["Thiếu hàng", "Cử người đi xưởng, làng nghề lấy trước"], ["Tối / sáng sớm", "Ghép đơn thành chuyến theo tuyến, giao tài xế"], ["Giữa ngày", "Kiểm kê một khu, giải trình nếu lệch"]],
      gain: "Một người nắm toàn bộ hàng và xe. Chủ không phải tự điều phối." },
    { key: "thukho", icon: "fa-dolly", name: "Thủ kho", img: "wms.jpg",
      day: [["Hàng về", "Đếm, nhập kho theo phiếu"], ["Có lệnh soạn", "Soạn hàng theo danh sách, xác nhận xong"], ["Xe xuất", "Xuất kho theo chuyến"], ["Giờ rảnh", "Kiểm kê theo lịch"]],
      gain: "Làm theo danh sách trên máy, ít nhầm hàng. Kho Sài Gòn tự chạy." },
    { key: "taixe", icon: "fa-truck-fast", name: "Tài xế", img: null,
      day: [["Đầu ca", "Mở app: chuyến hôm nay, thứ tự điểm giao"], ["Mỗi điểm", "Giao, chụp hàng + biên nhận, ghi số thực giao"], ["Có thu tiền", "Ghi số tiền ngay trên app"], ["Về kho", "Nộp tiền, xác nhận trên app"]],
      gain: "Không cầm phiếu giấy chạy về. Làm tốt có số liệu để được ghi nhận." },
    { key: "ketoan", icon: "fa-calculator", name: "Kế toán", img: "fnm-requests.jpg",
      day: [["Sáng", "Đối chiếu tiền về ngân hàng"], ["Xe về", "Ghi tiền mặt tài xế nộp, theo biên nhận trên hệ thống"], ["Trong ngày", "Xuất hóa đơn cho đơn đã giao; duyệt phiếu chi"], ["Cuối tuần", "Xuất dữ liệu cho MISA, gửi công nợ quá hạn"]],
      gain: "Không còn chép đơn, chạy theo chứng từ. Làm đúng việc kế toán." },
    { key: "chu", icon: "fa-user-tie", name: "Chủ doanh nghiệp", img: "rp-orders.jpg",
      day: [["Sáng", "Mở điện thoại: đơn hôm nay, xe đang chạy"], ["Bất kỳ lúc nào", "Duyệt phiếu chi trên điện thoại"], ["Đầu tuần", "Giao ban theo báo cáo: doanh số, công nợ, tồn"], ["Cuối tháng", "Xem KPI từng bộ phận"]],
      gain: "Đi công tác vẫn nắm được. Làm việc qua người quản lý, không qua từng người." }
  ]
};
