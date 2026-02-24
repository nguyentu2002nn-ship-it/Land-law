import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("data.db");

// Initialize database - Drop and recreate to ensure schema matches code
db.exec(`
  DROP TABLE IF EXISTS lessons;
  DROP TABLE IF EXISTS quizzes;

  CREATE TABLE lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    category TEXT,
    chapter TEXT,
    content TEXT,
    summary TEXT,
    genz_summary TEXT,
    image_url TEXT
  );

  CREATE TABLE quizzes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_id INTEGER,
    question TEXT,
    options TEXT,
    answer TEXT,
    type TEXT -- 'theory' or 'practical'
  );
`);

// Seed data helper
const insertLesson = db.prepare(`INSERT INTO lessons (title, category, chapter, content, summary, genz_summary, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)`);
const insertQuiz = db.prepare(`INSERT INTO quizzes (lesson_id, question, options, answer, type) VALUES (?, ?, ?, ?, ?)`);

function addLesson(
  title: string, 
  category: string, 
  chapter: string, 
  content: string, 
  summary: string, 
  genz_summary: string, 
  quizzes: { question: string, options: string[], answer: string, type: 'theory' | 'practical' }[]
) {
  const info = insertLesson.run(title, category, chapter, content, summary, genz_summary, null);
  const lessonId = info.lastInsertRowid;
  quizzes.forEach(q => {
    insertQuiz.run(lessonId, q.question, JSON.stringify(q.options), q.answer, q.type);
  });
}

// --- LUẬT ĐẤT ĐAI 2024 ---
addLesson(
  "Chương I: Quy định chung (2024)",
  "Luật Đất đai 2024",
  "Điều 1 - Điều 11",
  "1. Phạm vi điều chỉnh (Điều 1): \nLuật này quy định về chế độ sở hữu đất đai, quyền hạn và trách nhiệm của Nhà nước đại diện chủ sở hữu toàn dân về đất đai và thống nhất quản lý về đất đai, chế độ quản lý và sử dụng đất đai, quyền và nghĩa vụ của công dân, người sử dụng đất đối với đất đai thuộc lãnh thổ Việt Nam. \n\n2. Người sử dụng đất (Điều 4): \nBao gồm tổ chức trong nước; cá nhân trong nước, người Việt Nam định cư ở nước ngoài là công dân Việt Nam; cộng đồng dân cư; tổ chức tôn giáo; tổ chức nước ngoài có chức năng ngoại giao; người gốc Việt Nam định cư ở nước ngoài; tổ chức kinh tế có vốn đầu tư nước ngoài. \n\n3. Các hành vi bị nghiêm cấm (Điều 11): \n- Lấn đất, chiếm đất, hủy hoại đất. \n- Vi phạm quy định của pháp luật về quản lý nhà nước về đất đai. \n- Vi phạm chính sách về đất đai đối với đồng bào dân tộc thiểu số. \n- Lợi dụng chức vụ, quyền hạn để làm trái quy định về quản lý đất đai. \n- Không cung cấp thông tin hoặc cung cấp thông tin đất đai không chính xác. \n- Cản trở, gây khó khăn đối với việc thực hiện quyền của người sử dụng đất.",
  "Luật 2024 nhấn mạnh tính minh bạch và bảo vệ quyền lợi người dân, đặc biệt là các nhóm yếu thế.",
  "Chương 1: 'Hiến pháp' của ngành đất. Quy định rõ ai được dùng đất, ai làm admin (Nhà nước) và đặc biệt là list các việc 'cấm sờ vào hiện vật' như lấn chiếm hay làm giả hồ sơ.",
  [
    { question: "Theo Luật Đất đai 2024, ai là đại diện chủ sở hữu toàn dân về đất đai?", options: ["Cá nhân sử dụng đất", "Nhà nước", "Cộng đồng dân cư", "UBND xã"], answer: "Nhà nước", type: "theory" },
    { question: "Bạn phát hiện hàng xóm lấn chiếm đất công để xây chuồng gà. Hành vi này vi phạm điều nào?", options: ["Quyền sử dụng đất", "Các hành vi bị nghiêm cấm (Điều 11)", "Nghĩa vụ nộp thuế", "Quy định tách thửa"], answer: "Các hành vi bị nghiêm cấm (Điều 11)", type: "practical" }
  ]
);

addLesson(
  "Chương II: Quyền và Trách nhiệm của Nhà nước",
  "Luật Đất đai 2024",
  "Điều 12 - Điều 22",
  "1. Sở hữu đất đai (Điều 12): \nĐất đai thuộc sở hữu toàn dân do Nhà nước đại diện chủ sở hữu và thống nhất quản lý. \n\n2. Quyền của Nhà nước (Điều 13): \n- Quyết định quy hoạch, kế hoạch sử dụng đất. \n- Quyết định mục đích sử dụng đất. \n- Quy định hạn mức sử dụng đất, thời hạn sử dụng đất. \n- Quyết định thu hồi đất, trưng dụng đất. \n- Quyết định giá đất. \n- Quyết định giao đất, cho thuê đất, cho phép chuyển mục đích sử dụng đất. \n\n3. Trách nhiệm của Nhà nước (Điều 14-18): \n- Bảo đảm quyền sử dụng đất cho người sử dụng đất. \n- Cung cấp thông tin đất đai cho người dân. \n- Giải quyết tranh chấp, khiếu nại, tố cáo về đất đai.",
  "Nhà nước đóng vai trò 'Admin' tối cao, vừa có quyền sinh quyền sát nhưng cũng phải chịu trách nhiệm bảo vệ 'user' (người dân).",
  "Chương 2: Nhà nước là 'Chủ phòng', có quyền set luật, định giá và thu hồi đất khi cần. Nhưng đổi lại, Nhà nước phải bảo kê quyền lợi và cung cấp 'data' sạch cho anh em tra cứu.",
  [
    { question: "Cơ quan nào có thẩm quyền quyết định quy hoạch, kế hoạch sử dụng đất quốc gia?", options: ["Chính phủ", "Quốc hội", "Bộ Tài nguyên và Môi trường", "UBND cấp tỉnh"], answer: "Quốc hội", type: "theory" },
    { question: "Nhà nước thu hồi đất của ông A để làm dự án phát triển kinh tế. Trách nhiệm nào của Nhà nước là quan trọng nhất đối với ông A?", options: ["Cấp sổ đỏ mới", "Bồi thường, hỗ trợ, tái định cư theo quy định", "Cho ông A vay vốn", "Tuyển dụng ông A vào làm việc"], answer: "Bồi thường, hỗ trợ, tái định cư theo quy định", type: "practical" }
  ]
);

addLesson(
  "Chương III: Quyền và Nghĩa vụ của Người sử dụng đất",
  "Luật Đất đai 2024",
  "Điều 26 - Điều 31",
  "1. Quyền chung (Điều 26): \n- Được cấp Giấy chứng nhận (Sổ đỏ/Sổ hồng). \n- Hưởng thành quả lao động, kết quả đầu tư trên đất. \n- Được Nhà nước hướng dẫn và giúp đỡ trong việc cải tạo, phục hồi đất. \n- Được Nhà nước bảo hộ khi người khác xâm phạm quyền, lợi ích hợp pháp. \n- Được bồi thường khi Nhà nước thu hồi đất. \n- Khiếu nại, tố cáo, khởi kiện về hành vi vi phạm quyền sử dụng đất. \n\n2. Quyền chuyển đổi, chuyển nhượng, cho thuê... (Điều 27): \nNgười sử dụng đất được thực hiện các quyền giao dịch dân sự theo quy định của Luật này và pháp luật có liên quan. \n\n3. Nghĩa vụ chung (Điều 31): \n- Sử dụng đất đúng mục đích, đúng ranh giới, đúng quy định về độ sâu và chiều cao. \n- Thực hiện kê khai đăng ký đất đai; làm đầy đủ thủ tục khi chuyển dịch quyền sử dụng đất. \n- Thực hiện nghĩa vụ tài chính (thuế, phí). \n- Tuân thủ quy định về bảo vệ môi trường, không làm tổn hại đến lợi ích hợp pháp của người xung quanh.",
  "Quyền lợi luôn đi đôi với trách nhiệm. Bạn được tự do giao dịch nhưng phải 'ngoan' và nộp thuế đầy đủ.",
  "Chương 3: 'User Manual' cho chủ đất. Bạn có quyền cầm sổ đi 'flex', bán đất lấy tiền hoặc đòi đền bù. Nhưng nhớ dùng đất đúng mục đích, đừng lấn ranh hàng xóm và đừng quên 'ting ting' tiền thuế cho Nhà nước.",
  [
    { question: "Người sử dụng đất có nghĩa vụ nào sau đây?", options: ["Được bồi thường khi thu hồi đất", "Sử dụng đất đúng mục đích", "Được cho thuê quyền sử dụng đất", "Được thế chấp quyền sử dụng đất"], answer: "Sử dụng đất đúng mục đích", type: "theory" },
    { question: "Anh Nam được Nhà nước giao đất lúa nhưng anh lại tự ý đổ đất xây xưởng cơ khí. Anh Nam đã vi phạm nghĩa vụ gì?", options: ["Nghĩa vụ nộp thuế", "Nghĩa vụ sử dụng đất đúng mục đích", "Nghĩa vụ bảo vệ đất", "Nghĩa vụ đăng ký đất đai"], answer: "Nghĩa vụ sử dụng đất đúng mục đích", type: "practical" }
  ]
);

addLesson(
  "Chương VI: Thu hồi đất & Trưng dụng đất",
  "Luật Đất đai 2024",
  "Điều 78 - Điều 90",
  "1. Thu hồi đất vì mục đích Quốc phòng, An ninh (Điều 78): \nBao gồm 10 trường hợp cụ thể như làm nơi đóng quân, căn cứ quân sự, cảng quân sự, trường bắn... \n\n2. Thu hồi đất để phát triển kinh tế - xã hội vì lợi ích quốc gia, công cộng (Điều 79): \nLiệt kê chi tiết 31 trường hợp như xây công trình giao thông, thủy lợi, năng lượng, nhà ở xã hội, khu công nghiệp... \n\n3. Thu hồi đất do vi phạm pháp luật (Điều 81): \n- Sử dụng đất không đúng mục đích và đã bị xử phạt mà vẫn tái phạm. \n- Hủy hoại đất. \n- Đất giao không đúng đối tượng. \n- Người sử dụng đất không thực hiện nghĩa vụ tài chính. \n\n4. Trưng dụng đất (Điều 90): \nNhà nước trưng dụng đất trong trường hợp thật cần thiết để thực hiện nhiệm vụ quốc phòng, an ninh hoặc trong tình trạng chiến tranh, tình trạng khẩn cấp, phòng, chống thiên tai.",
  "Luật 2024 siết chặt các trường hợp thu hồi để tránh lạm dụng, đảm bảo chỉ thu hồi khi thực sự cần thiết cho cộng đồng.",
  "Chương 6: Khi nào đất bị 'bay màu'? Chỉ khi Nhà nước cần làm việc lớn (quốc phòng, hạ tầng) hoặc khi bạn 'chơi xấu' vi phạm luật. Trưng dụng thì chỉ là mượn tạm thời trong lúc 'biến căng' thôi.",
  [
    { question: "Nhà nước trưng dụng đất trong trường hợp nào?", options: ["Để làm đường giao thông", "Trong tình trạng khẩn cấp về quốc phòng, an ninh, thiên tai", "Để xây dựng khu công nghiệp", "Để bán đấu giá quyền sử dụng đất"], answer: "Trong tình trạng khẩn cấp về quốc phòng, an ninh, thiên tai", type: "theory" },
    { question: "Dự án xây dựng trụ sở UBND huyện cần thu hồi đất của dân. Đây là trường hợp thu hồi đất vì mục đích gì?", options: ["Quốc phòng, an ninh", "Phát triển kinh tế - xã hội vì lợi ích quốc gia, công cộng", "Vi phạm pháp luật đất đai", "Chấm dứt việc sử dụng đất theo pháp luật"], answer: "Phát triển kinh tế - xã hội vì lợi ích quốc gia, công cộng", type: "practical" }
  ]
);

addLesson(
  "Chương VII: Bồi thường, Hỗ trợ, Tái định cư",
  "Luật Đất đai 2024",
  "Điều 91 - Điều 111",
  "1. Nguyên tắc bồi thường (Điều 91): \n- Phải bảo đảm dân chủ, khách quan, công bằng, công khai, kịp thời và đúng quy định. \n- Người có đất bị thu hồi phải có điều kiện sống bằng hoặc tốt hơn nơi ở cũ. \n\n2. Các hình thức bồi thường: \n- Bồi thường bằng đất có cùng mục đích sử dụng. \n- Bồi thường bằng tiền theo giá đất cụ thể. \n- Bồi thường bằng đất khác mục đích sử dụng hoặc bằng nhà ở. \n\n3. Hỗ trợ khi Nhà nước thu hồi đất (Điều 108): \n- Hỗ trợ ổn định đời sống và sản xuất. \n- Hỗ trợ đào tạo, chuyển đổi nghề và tìm kiếm việc làm. \n- Hỗ trợ tái định cư. \n\n4. Khu tái định cư (Điều 110): \nPhải hoàn thiện hạ tầng kỹ thuật (đường, điện, nước) và hạ tầng xã hội (trường học, trạm y tế) trước khi đưa dân đến ở.",
  "Điểm sáng nhất của Luật 2024 là nguyên tắc 'sống tốt hơn nơi ở cũ', xóa bỏ nỗi lo trắng tay khi bị thu hồi đất.",
  "Chương 7: 'Gói cứu trợ' khi mất đất. Nhà nước cam kết đền bù thỏa đáng, không để bạn thiệt thòi. Khu tái định cư phải xịn, có đủ điện đường trường trạm rồi mới được mời bạn sang ở.",
  [
    { question: "Nguyên tắc bồi thường khi Nhà nước thu hồi đất là gì?", options: ["Càng thấp càng tốt", "Phải đảm bảo người có đất bị thu hồi có điều kiện sống bằng hoặc tốt hơn nơi ở cũ", "Chỉ bồi thường bằng tiền", "Không cần hỗ trợ tái định cư"], answer: "Phải đảm bảo người có đất bị thu hồi có điều kiện sống bằng hoặc tốt hơn nơi ở cũ", type: "theory" },
    { question: "Nhà bạn bị thu hồi toàn bộ đất ở. Theo Luật 2024, bạn được ưu tiên bồi thường bằng hình thức nào nếu địa phương có quỹ đất?", options: ["Tiền mặt", "Đất ở hoặc nhà ở tái định cư", "Đất nông nghiệp", "Cổ phiếu công ty dự án"], answer: "Đất ở hoặc nhà ở tái định cư", type: "practical" }
  ]
);

addLesson(
  "Chương IX: Giao đất, Cho thuê đất, Chuyển mục đích",
  "Luật Đất đai 2024",
  "Điều 116 - Điều 127",
  "1. Căn cứ để giao đất, cho thuê đất (Điều 116): \n- Quy hoạch sử dụng đất cấp huyện hoặc quy hoạch chi tiết xây dựng. \n- Kế hoạch sử dụng đất hàng năm. \n\n2. Giao đất không thu tiền sử dụng đất (Điều 118): \n- Hộ gia đình, cá nhân trực tiếp sản xuất nông nghiệp trong hạn mức. \n- Đất xây dựng trụ sở cơ quan, công trình công cộng không nhằm mục đích kinh doanh. \n\n3. Giao đất có thu tiền sử dụng đất (Điều 119): \n- Hộ gia đình, cá nhân được giao đất ở. \n- Tổ chức kinh tế được giao đất để thực hiện dự án nhà ở. \n\n4. Chuyển mục đích sử dụng đất (Điều 121): \nCác trường hợp phải xin phép: \n- Chuyển đất trồng lúa sang đất phi nông nghiệp. \n- Chuyển đất rừng sang mục đích khác. \n- Chuyển đất phi nông nghiệp không phải là đất ở sang đất ở.",
  "Quy định mới giúp việc tiếp cận đất đai minh bạch hơn thông qua đấu giá và đấu thầu.",
  "Chương 9: Cách Nhà nước 'phát' đất. Có chỗ free (đất nông nghiệp), có chỗ phải trả tiền (đất ở). Muốn đổi màu đất (chuyển mục đích) thì phải xin phép admin và check quy hoạch kỹ nhé.",
  [
    { question: "Trường hợp nào được Nhà nước giao đất không thu tiền sử dụng đất?", options: ["Tổ chức kinh tế làm dự án nhà ở", "Hộ gia đình, cá nhân trực tiếp sản xuất nông nghiệp trong hạn mức", "Cá nhân được giao đất ở", "Doanh nghiệp thuê đất làm kho"], answer: "Hộ gia đình, cá nhân trực tiếp sản xuất nông nghiệp trong hạn mức", type: "theory" },
    { question: "Ông B là nông dân canh tác trên đất lúa được giao trong hạn mức. Ông có phải nộp tiền sử dụng đất hàng năm không?", options: ["Có, theo giá thị trường", "Không, vì là giao đất không thu tiền sử dụng đất", "Có, nhưng giảm 50%", "Chỉ nộp khi bán đất"], answer: "Không, vì là giao đất không thu tiền sử dụng đất", type: "practical" }
  ]
);

addLesson(
  "Chương X: Đăng ký đất đai & Cấp Giấy chứng nhận",
  "Luật Đất đai 2024",
  "Điều 128 - Điều 152",
  "1. Nguyên tắc đăng ký (Điều 128): \nĐăng ký đất đai là bắt buộc đối với người sử dụng đất và người được giao đất để quản lý. \n\n2. Đăng ký lần đầu (Điều 132): \nÁp dụng cho thửa đất đang sử dụng mà chưa đăng ký hoặc đất được Nhà nước giao, cho thuê. \n\n3. Đăng ký biến động (Điều 133): \nThực hiện khi có thay đổi về quyền sử dụng, hình thể, diện tích, mục đích sử dụng hoặc thông tin chủ sở hữu. \n\n4. Thẩm quyền cấp GCN (Điều 136): \n- UBND cấp tỉnh cấp cho tổ chức. \n- UBND cấp huyện cấp cho cá nhân, hộ gia đình. \n- Văn phòng đăng ký đất đai cấp đổi, cấp lại và đăng ký biến động.",
  "Sổ đỏ là chứng thư pháp lý cao nhất bảo vệ quyền lợi của bạn.",
  "Chương 10: Thủ tục làm 'giấy khai sinh' cho đất. Đăng ký là bắt buộc nhé anh em. Sổ đỏ giờ đây có thể do huyện hoặc tỉnh ký tùy đối tượng, nhưng quan trọng nhất là thông tin phải chuẩn đét trên hệ thống.",
  [
    { question: "Đăng ký đất đai là bắt buộc đối với ai?", options: ["Chỉ người muốn bán đất", "Người sử dụng đất và người được giao đất để quản lý", "Chỉ người có tranh chấp", "Chỉ người ở đô thị"], answer: "Người sử dụng đất và người được giao đất để quản lý", type: "theory" },
    { question: "Bạn mới mua một mảnh đất bằng giấy viết tay từ năm 2010 và chưa làm sổ. Theo Luật 2024, bạn phải thực hiện thủ tục gì đầu tiên?", options: ["Đăng ký biến động", "Đăng ký đất đai lần đầu", "Xin phép xây dựng", "Nộp thuế thu nhập"], answer: "Đăng ký đất đai lần đầu", type: "practical" }
  ]
);

addLesson(
  "Chương XI: Tài chính đất đai & Giá đất",
  "Luật Đất đai 2024",
  "Điều 153 - Điều 162",
  "1. Các khoản thu ngân sách (Điều 153): \n- Tiền sử dụng đất, tiền thuê đất. \n- Thuế sử dụng đất. \n- Thuế thu nhập từ chuyển quyền sử dụng đất. \n- Tiền xử phạt vi phạm hành chính. \n\n2. Bảng giá đất (Điều 159): \nĐược xây dựng theo khu vực, vị trí. Từ 2026, bảng giá đất sẽ được cập nhật hàng năm để sát với giá thị trường. \n\n3. Giá đất cụ thể (Điều 160): \nĐược quyết định cho từng trường hợp cụ thể như tính tiền bồi thường khi thu hồi đất, tính tiền sử dụng đất khi giao đất không qua đấu giá.",
  "Bỏ khung giá đất là bước ngoặt lớn để đền bù sát giá thị trường hơn.",
  "Chương 11: Chuyện tiền nong. Bảng giá đất giờ đây sẽ 'update' hàng năm như giá iPhone, đảm bảo không bị lạc hậu. Khi bị thu hồi, bạn sẽ được đền bù theo 'giá đất cụ thể' cực kỳ sát thực tế.",
  [
    { question: "Từ năm nào bảng giá đất sẽ được cập nhật hàng năm?", options: ["2024", "2025", "2026", "2030"], answer: "2026", type: "theory" },
    { question: "Năm 2027, bạn muốn tra giá đất để tính thuế. Bạn nên xem ở đâu để sát thực tế nhất?", options: ["Khung giá đất Chính phủ", "Bảng giá đất UBND tỉnh ban hành hàng năm", "Hỏi hàng xóm", "Tự định giá"], answer: "Bảng giá đất UBND tỉnh ban hành hàng năm", type: "practical" }
  ]
);

  // --- THÔNG TƯ 25/2014 ---
addLesson(
  "Độ chính xác Bản đồ địa chính (TT25)",
  "Thông tư 25/2014",
  "Điều 7",
  "1. Sai số trung phương vị trí mặt phẳng của điểm khống chế đo vẽ, điểm trạm đo so với điểm khởi tính sau bình sai không vượt quá 0,1 mm tính theo tỷ lệ bản đồ cần lập. \n\n2. Sai số biểu thị các điểm tọa độ quốc gia, địa chính lên bản đồ số được quy định bằng 0 (không có sai số). \n\n3. Đối với bản đồ địa chính giấy: \n- Sai số kích thước khung bản đồ không vượt quá 0,2 mm. \n- Sai số đường chéo khung bản đồ không vượt quá 0,3 mm. \n- Sai số khoảng cách giữa điểm tọa độ và điểm góc khung bản đồ không vượt quá 0,2 mm.",
  "Độ chính xác cực cao là yêu cầu bắt buộc để tránh tranh chấp ranh giới sau này.",
  "TT25 Điều 7: 'Thước đo' chuẩn chỉnh. Sai số trên giấy chỉ được tính bằng phần mười milimét. Với bản đồ số thì các điểm tọa độ gốc là chuẩn 100%, không có chuyện 'lệch một li đi một dặm' đâu.",
  [
    { question: "Sai số trung phương vị trí mặt phẳng điểm khống chế đo vẽ không vượt quá bao nhiêu mm trên bản đồ?", options: ["0.1 mm", "0.2 mm", "0.3 mm", "0.5 mm"], answer: "0.1 mm", type: "theory" },
    { question: "Trên một tờ bản đồ địa chính giấy, bạn đo đường chéo khung và thấy lệch 0.5mm. Theo TT25, tờ bản đồ này có đạt chuẩn không?", options: ["Có, vì lệch dưới 1mm", "Không, vì sai số đường chéo tối đa là 0.3mm", "Có, nếu ranh giới thửa đất vẫn rõ", "Không, vì không được có sai số"], answer: "Không, vì sai số đường chéo tối đa là 0.3mm", type: "practical" }
  ]
);

addLesson(
  "Sai số vị trí điểm ranh giới (TT25)",
  "Thông tư 25/2014",
  "Điều 8",
  "Sai số vị trí của điểm bất kỳ trên ranh giới thửa đất biểu thị trên bản đồ địa chính số so với vị trí của điểm khống chế đo vẽ gần nhất không được vượt quá: \n\n- Tỷ lệ 1:200: 5 cm \n\n- Tỷ lệ 1:500: 7 cm \n\n- Tỷ lệ 1:1.000: 15 cm \n\n- Tỷ lệ 1:2.000: 30 cm \n\n- Tỷ lệ 1:5.000: 150 cm (1.5 m) \n\n- Tỷ lệ 1:10.000: 300 cm (3 m) \n\n* Lưu ý: Đối với khu vực đất nông nghiệp đo vẽ bản đồ tỷ lệ 1:1000, 1:2000 thì sai số cho phép tăng 1,5 lần.",
  "Bảng tra cứu này giúp bạn biết được độ lệch tối đa cho phép khi cán bộ địa chính xuống cắm mốc.",
  "TT25 Điều 8: Bảng 'Hạn mức lệch'. Đất phố (1:500) chỉ được lệch 7cm, đất ruộng (1:2000) được lệch 30cm. Nếu lệch hơn mức này là cán bộ phải đo lại, bạn có quyền 'ý kiến' ngay!",
  [
    { question: "Đối với bản đồ tỷ lệ 1:500, sai số vị trí điểm ranh giới không được vượt quá bao nhiêu?", options: ["5 cm", "7 cm", "15 cm", "30 cm"], answer: "7 cm", type: "theory" },
    { question: "Cán bộ đo ranh giới nhà bạn ở phố (tỷ lệ 1:500) và phát hiện lệch 10cm. Kết quả này có được chấp nhận không?", options: ["Được, vì 10cm là nhỏ", "Không, vì sai số tối đa chỉ 7cm", "Được, nếu hàng xóm đồng ý", "Không, vì bản đồ phố phải chính xác 100%"], answer: "Không, vì sai số tối đa chỉ 7cm", type: "practical" }
  ]
);

addLesson(
  "Ký hiệu loại đất trên bản đồ (TT25)",
  "Thông tư 25/2014",
  "Phụ lục 01",
  "Mã ký hiệu các loại đất phổ biến: \n\n1. Nhóm đất nông nghiệp: \n- LUC: Đất chuyên trồng lúa nước. \n- LUA: Đất trồng lúa còn lại. \n- LUN: Đất lúa nương. \n- BHK: Đất bằng trồng cây hàng năm khác. \n- NHK: Đất nương rẫy trồng cây hàng năm khác. \n- CLN: Đất trồng cây lâu năm. \n- RSX: Đất rừng sản xuất. \n- RPH: Đất rừng phòng hộ. \n- RDD: Đất rừng đặc dụng. \n- NTS: Đất nuôi trồng thủy sản. \n- LMU: Đất làm muối. \n- NKH: Đất nông nghiệp khác. \n\n2. Nhóm đất phi nông nghiệp: \n- ONT: Đất ở tại nông thôn. \n- ODT: Đất ở tại đô thị. \n- TSC: Đất xây dựng trụ sở cơ quan. \n- DTS: Đất xây dựng trụ sở của tổ chức sự nghiệp. \n- DVH: Đất xây dựng cơ sở văn hóa. \n- DYT: Đất xây dựng cơ sở y tế. \n- DGD: Đất xây dựng cơ sở giáo dục và đào tạo. \n- DTT: Đất xây dựng cơ sở thể dục thể thao. \n- DKH: Đất xây dựng cơ sở khoa học và công nghệ. \n- DXH: Đất xây dựng cơ sở dịch vụ xã hội. \n- DNG: Đất xây dựng cơ sở ngoại giao. \n- DSK: Đất xây dựng công trình sự nghiệp khác. \n- CQP: Đất quốc phòng. \n- CAN: Đất an ninh. \n- SKK: Đất khu công nghiệp. \n- SKT: Đất khu chế xuất. \n- SKN: Đất cụm công nghiệp. \n- SKC: Đất cơ sở sản xuất phi nông nghiệp. \n- TMD: Đất thương mại, dịch vụ. \n- SKS: Đất sử dụng cho hoạt động khoáng sản. \n- SKX: Đất sản xuất vật liệu xây dựng, làm đồ gốm. \n- DGT: Đất giao thông. \n- DTL: Đất thủy lợi.",
  "Việc nắm rõ mã loại đất giúp bạn đọc hiểu nhanh Sổ đỏ và Bản đồ địa chính.",
  "Đọc Map như Pro: Nhìn thấy ONT là đất nhà ở quê, ODT là đất phố. Thấy LUA hay CLN là đất ruộng vườn. Nhớ kỹ mấy mã này để không bị 'lùa gà' khi đi xem đất nhé.",
  [
    { question: "Ký hiệu 'ODT' trên bản đồ địa chính nghĩa là gì?", options: ["Đất ở nông thôn", "Đất ở đô thị", "Đất trồng cây lâu năm", "Đất giao thông"], answer: "Đất ở đô thị", type: "theory" },
    { question: "Bạn xem bản đồ thấy thửa đất ghi 'CLN'. Bạn có nên mua để xây nhà ở ngay không?", options: ["Nên mua vì CLN là đất ở", "Không nên vì CLN là đất trồng cây lâu năm, phải xin chuyển mục đích", "Mua được vì là đất biệt thự", "Mua được vì đã có hạ tầng"], answer: "Không nên vì CLN là đất trồng cây lâu năm, phải xin chuyển mục đích", type: "practical" }
  ]
);

addLesson(
  "Quy định về ranh giới thửa đất (TT25)",
  "Thông tư 25/2014",
  "Điều 13",
  "1. Xác định ranh giới: \n- Ranh giới thửa đất được xác định theo đường phân chia phần đất giữa các người sử dụng đất liền kề. \n- Phải phù hợp với quy định về ranh giới giữa các bất động sản của pháp luật dân sự. \n\n2. Thể hiện trên bản đồ: \n- Ranh giới thửa đất được thể hiện bằng đường thẳng nối các đỉnh thửa liền kề tạo thành đường bao khép kín. \n- Đối với ranh giới dạng đường cong: Khoảng cách từ đường nối hai điểm thay đổi hướng đến đỉnh cong không lớn hơn 0,2 mm theo tỷ lệ bản đồ. \n\n3. Trường hợp đặc biệt: \n- Đất nông nghiệp có bờ thửa/rãnh nước rộng dưới 0,5m: Ranh giới là đường tâm của bờ/rãnh. \n- Nếu bờ/rãnh dùng chung cho cả khu vực: Ranh giới xác định theo mép bờ/rãnh. \n- Ruộng bậc thang: Ranh giới là đường bao ngoài cùng của các bậc thang liền kề có cùng loại đất.",
  "Ranh giới là yếu tố sống còn để xác định diện tích và quyền lợi, cần được đo đạc và xác nhận kỹ lưỡng.",
  "TT25 Điều 13: 'Kẻ ranh' chuẩn bài. Ranh giới phải khép kín, nếu là đường cong thì phải 'mượt' (lệch không quá 0.2mm trên giấy). Riêng ruộng bậc thang thì gộp chung ranh giới ngoài cho gọn, không cần vẽ từng bậc đâu.",
  [
    { question: "Ranh giới thửa đất nông nghiệp có bờ thửa rộng dưới 0.5m được xác định là đường nào?", options: ["Mép bờ thửa phía Bắc", "Mép bờ thửa phía Nam", "Đường tâm của bờ thửa", "Toàn bộ diện tích bờ thửa"], answer: "Đường tâm của bờ thửa", type: "theory" },
    { question: "Hai nhà hàng xóm tranh chấp ranh giới là một bức tường chung rộng 20cm. Theo nguyên tắc địa chính, ranh giới thường được xác định ở đâu?", options: ["Mép tường nhà A", "Mép tường nhà B", "Đường tâm của bức tường", "Nhà nào xây tường thì thuộc nhà đó"], answer: "Đường tâm của bức tường", type: "practical" }
  ]
);

addLesson(
  "Lưới địa chính & Khống chế đo vẽ (TT25)",
  "Thông tư 25/2014",
  "Điều 11 - Điều 12",
  "1. Mật độ điểm địa chính: \n- Tỷ lệ 1:200: Trung bình 30 ha có 1 điểm. \n- Tỷ lệ 1:500, 1:1000, 1:2000: Trung bình 125 ha có 1 điểm. \n- Tỷ lệ 1:5000, 1:10000: Trung bình 500 ha có 1 điểm. \n\n2. Yêu cầu kỹ thuật lưới khống chế (Bảng 01): \n- Sai số trung phương vị trí điểm: ≤ 5 cm. \n- Sai số tương đối cạnh: ≤ 1:50.000. \n\n3. Đo bằng công nghệ GNSS (Bảng 02): \n- Số vệ tinh khỏe liên tục: ≥ 4. \n- PDOP lớn nhất: ≤ 4. \n- Thời gian đo ngắm đồng thời: ≥ 60 phút. \n- Sai số khép hình giới hạn tương đối (fS/[S]): ≤ 1:10.000.",
  "Hệ thống lưới tọa độ là 'xương sống' để định vị mọi thửa đất trên bản đồ quốc gia.",
  "TT25: 'GPS' ngành đất. Muốn đo chuẩn thì phải có các điểm mốc tọa độ quốc gia. Càng zoom kỹ (1:200) thì mốc càng dày. Khi đo bằng vệ tinh thì phải chờ ít nhất 1 tiếng để máy 'ăn' đủ sóng mới chuẩn được.",
  [
    { question: "Thời gian đo ngắm đồng thời tối thiểu khi sử dụng công nghệ GNSS cho lưới địa chính là bao nhiêu?", options: ["15 phút", "30 phút", "60 phút", "120 phút"], answer: "60 phút", type: "theory" },
    { question: "Một kỹ thuật viên đo lưới địa chính bằng GPS nhưng chỉ thu được tín hiệu từ 3 vệ tinh. Kết quả này có đảm bảo độ chính xác không?", options: ["Có, 3 vệ tinh là đủ", "Không, yêu cầu tối thiểu phải có 4 vệ tinh khỏe liên tục", "Có, nếu thời gian đo lâu hơn", "Không, vì GPS không dùng để đo địa chính"], answer: "Không, yêu cầu tối thiểu phải có 4 vệ tinh khỏe liên tục", type: "practical" }
  ]
);

addLesson(
  "Nguyên tắc cấp Giấy chứng nhận (TT26)",
  "Thông tư 26/2024",
  "Điều 135",
  "1. Cấp theo từng thửa đất: \nGiấy chứng nhận được cấp theo từng thửa đất cho người sử dụng đất, chủ sở hữu tài sản gắn liền với đất có nhu cầu và đủ điều kiện. \n\n2. Cấp chung cho nhiều thửa: \nTrường hợp người sử dụng đất đang sử dụng nhiều thửa đất nông nghiệp tại cùng 01 xã, phường, thị trấn thì được cấp 01 Giấy chứng nhận chung cho các thửa đất đó nếu có yêu cầu. \n\n3. Thửa đất có nhiều người chung quyền: \n- Phải ghi đầy đủ tên của những người chung quyền và cấp cho mỗi người 01 Giấy chứng nhận. \n- Nếu có yêu cầu thì cấp chung 01 Giấy chứng nhận và trao cho người đại diện. \n\n4. Thời điểm nhận sổ: \nNgười sử dụng đất được nhận sổ sau khi đã hoàn thành nghĩa vụ tài chính (trừ trường hợp được miễn, giảm hoặc ghi nợ).",
  "Nguyên tắc này đảm bảo mỗi mảnh đất đều có 'chứng minh thư' riêng biệt và minh bạch về chủ sở hữu.",
  "TT26 Điều 135: 'Một mảnh một sổ'. Nhưng nếu bạn có nhiều ruộng ở cùng một xã thì có thể gộp chung vào 1 sổ cho đỡ thất lạc. Đất chung thì ai cũng có phần, mỗi người cầm 1 cuốn sổ cho chắc cú!",
  [
    { question: "Trường hợp thửa đất có nhiều người chung quyền sử dụng thì Giấy chứng nhận được cấp như thế nào?", options: ["Chỉ cấp cho người lớn tuổi nhất", "Ghi tên tất cả và cấp cho mỗi người 1 bản", "Chỉ cấp 1 bản cho người đại diện", "Không cấp cho ai cả"], answer: "Ghi tên tất cả và cấp cho mỗi người 1 bản", type: "theory" },
    { question: "Ba anh em cùng thừa kế một mảnh đất và muốn đứng tên chung. Theo quy định mới, họ sẽ nhận được bao nhiêu cuốn sổ đỏ?", options: ["1 cuốn cho cả ba", "3 cuốn, mỗi người giữ 1 cuốn ghi tên cả ba", "1 cuốn cho người anh cả", "Không được đứng tên chung"], answer: "3 cuốn, mỗi người giữ 1 cuốn ghi tên cả ba", type: "practical" }
  ]
);

addLesson(
  "Đăng ký lần đầu & Đăng ký biến động (TT26)",
  "Thông tư 26/2024",
  "Điều 132 - Điều 133",
  "1. Đăng ký lần đầu (Điều 132): \nThực hiện cho các trường hợp: \n- Thửa đất đang sử dụng mà chưa đăng ký. \n- Thửa đất được Nhà nước giao, cho thuê để sử dụng. \n- Thửa đất được giao để quản lý mà chưa đăng ký. \n\n2. Đăng ký biến động (Điều 133): \nThực hiện khi có thay đổi so với thông tin đã đăng ký: \n- Chuyển đổi, chuyển nhượng, thừa kế, tặng cho, thế chấp, góp vốn. \n- Thay đổi thông tin về người sử dụng đất (tên, số định danh). \n- Thay đổi về hình dạng, kích thước, diện tích, số hiệu, địa chỉ thửa đất. \n- Chuyển mục đích sử dụng đất. \n- Thay đổi thời hạn sử dụng đất. \n- Thay đổi về tài sản gắn liền với đất.",
  "Đăng ký đất đai là nghĩa vụ bắt buộc để Nhà nước quản lý và bảo vệ quyền lợi hợp pháp của bạn.",
  "TT26: 'Khai sinh' và 'Cập nhật' cho đất. Đất mới khai hoang hay Nhà nước mới giao là phải đi làm 'giấy khai sinh' ngay. Còn khi bán, cho hay đổi tên thì phải đi 'update profile' trong vòng 30 ngày nhé.",
  [
    { question: "Trường hợp nào sau đây phải thực hiện đăng ký biến động?", options: ["Đất mới được giao chưa đăng ký", "Thay đổi diện tích thửa đất do đo đạc lại", "Đất đang sử dụng từ xưa chưa có sổ", "Đất khai hoang mới"], answer: "Thay đổi diện tích thửa đất do đo đạc lại", type: "theory" },
    { question: "Bạn vừa xây thêm một tầng lầu và muốn cập nhật vào sổ đỏ. Đây là thủ tục gì?", options: ["Đăng ký lần đầu", "Đăng ký biến động về tài sản gắn liền với đất", "Cấp đổi sổ đỏ", "Xin phép sửa chữa"], answer: "Đăng ký biến động về tài sản gắn liền với đất", type: "practical" }
  ]
);


  // --- THÔNG TƯ 26/2024 ---
addLesson(
  "Cơ sở dữ liệu đất đai quốc gia (TT26)",
  "Thông tư 26/2024",
  "Điều 3",
  "Thành phần cơ sở dữ liệu quốc gia về đất đai bao gồm: \n\n1. Dữ liệu không gian đất đai: Ranh giới thửa đất, tọa độ, bản đồ địa chính, quy hoạch. \n\n2. Dữ liệu thuộc tính đất đai: Thông tin chủ sử dụng, diện tích, loại đất, giá đất, tình trạng pháp lý. \n\n3. Dữ liệu đất đai phi cấu trúc: Các tệp quét (scan) từ Sổ đỏ, hồ sơ đăng ký, văn bản pháp lý. \n\n4. Siêu dữ liệu đất đai: Thông tin mô tả về nguồn gốc, thời điểm cập nhật và chất lượng của dữ liệu.",
  "Mục tiêu là số hóa toàn bộ để người dân có thể tra cứu 'lịch sử' mảnh đất chỉ bằng vài cú click.",
  "TT26 Điều 3: 'Wikipedia' của đất đai. Mọi thứ từ hình dáng mảnh đất đến tên chủ cũ, giá tiền đều đưa lên hệ thống. Không còn cảnh phải ôm đống hồ sơ giấy đi hỏi khắp nơi nữa.",
  [
    { question: "Thành phần nào thuộc dữ liệu không gian đất đai?", options: ["Tên chủ sử dụng", "Ranh giới thửa đất, tọa độ", "Giá đất", "Lịch sử nộp thuế"], answer: "Ranh giới thửa đất, tọa độ", type: "theory" },
    { question: "Bạn muốn biết mảnh đất định mua có đang bị thế chấp hay không thông qua hệ thống online. Dữ liệu này thuộc nhóm nào?", options: ["Dữ liệu không gian", "Dữ liệu thuộc tính (tình trạng pháp lý)", "Dữ liệu phi cấu trúc", "Siêu dữ liệu"], answer: "Dữ liệu thuộc tính (tình trạng pháp lý)", type: "practical" }
  ]
);

addLesson(
  "Đăng ký biến động trong 30 ngày (TT26)",
  "Thông tư 26/2024",
  "Chương III",
  "1. Các trường hợp phải đăng ký: \n- Chuyển nhượng, tặng cho, thừa kế. \n- Thay đổi diện tích, kích thước, số hiệu thửa đất. \n- Chuyển mục đích sử dụng đất. \n- Thay đổi thông tin về người sử dụng đất (đổi tên, đổi số CCCD). \n- Thế chấp hoặc xóa thế chấp. \n\n2. Thời hạn: \nTrong thời hạn không quá 30 ngày kể từ ngày có biến động, người sử dụng đất phải thực hiện thủ tục đăng ký biến động tại cơ quan có thẩm quyền. \n\n3. Hậu quả khi chậm đăng ký: \nSẽ bị xử phạt vi phạm hành chính theo quy định của Chính phủ.",
  "Luật mới yêu cầu sự cập nhật tức thời để đảm bảo dữ liệu quốc gia luôn chính xác.",
  "TT26: Đất có 'biến' là phải báo ngay! Bán đất, cho con hay đổi CCCD thì trong vòng 1 tháng phải ra phường/quận báo cáo. Đừng để quá hạn là bị 'ăn phạt' tiền triệu đấy.",
  [
    { question: "Thời hạn đăng ký biến động kể từ ngày có biến động là bao nhiêu ngày?", options: ["15 ngày", "30 ngày", "60 ngày", "90 ngày"], answer: "30 ngày", type: "theory" },
    { question: "Anh A ký hợp đồng mua đất đã công chứng nhưng 2 tháng sau mới đi nộp hồ sơ. Anh A sẽ gặp vấn đề gì?", options: ["Không sao", "Bị xử phạt hành chính vì quá hạn 30 ngày", "Hợp đồng bị hủy", "Phải công chứng lại"], answer: "Bị xử phạt hành chính vì quá hạn 30 ngày", type: "practical" }
  ]
);

addLesson(
  "Quy trình xây dựng CSDL Đất đai (TT26)",
  "Thông tư 26/2024",
  "Chương II",
  "Quy trình kỹ thuật xây dựng cơ sở dữ liệu đất đai bao gồm: \n\n1. Công tác chuẩn bị: Lập kế hoạch, chuẩn bị nhân lực, vật tư, phần mềm. \n\n2. Thu thập tài liệu: Bản đồ địa chính, Giấy chứng nhận, hồ sơ đăng ký, sổ mục kê... \n\n3. Rà soát, đánh giá: Kiểm tra tính đầy đủ, pháp lý của tài liệu. \n\n4. Số hóa & Xây dựng dữ liệu: \n- Xây dựng dữ liệu không gian (ranh giới, tọa độ). \n- Xây dựng dữ liệu thuộc tính (thông tin chủ, diện tích). \n- Xây dựng dữ liệu phi cấu trúc (quét hồ sơ giấy). \n\n5. Kiểm tra, nghiệm thu: Đảm bảo dữ liệu chính xác 100% trước khi đưa vào vận hành.",
  "Chuyển đổi số toàn diện ngành địa chính giúp quản lý đất đai thông minh và minh bạch hơn.",
  "TT26: Cách tạo ra 'Big Data' đất đai. Từ đống hồ sơ giấy bụi bặm, cán bộ sẽ quét sạch đưa lên cloud, 'check var' ranh giới và thông tin chủ đất để anh em ngồi nhà cũng tra cứu được.",
  [
    { question: "Bước nào thực hiện việc chuyển hồ sơ giấy thành tệp tin số (scan)?", options: ["Thu thập tài liệu", "Rà soát đánh giá", "Xây dựng dữ liệu phi cấu trúc", "Kiểm tra nghiệm thu"], answer: "Xây dựng dữ liệu phi cấu trúc", type: "theory" },
    { question: "Trong quá trình xây dựng CSDL, cán bộ phát hiện ranh giới trên bản đồ lệch so với sổ đỏ của dân. Bước nào trong quy trình sẽ xử lý việc này?", options: ["Công tác chuẩn bị", "Rà soát, đánh giá tài liệu", "Nghiệm thu", "Vận hành"], answer: "Rà soát, đánh giá tài liệu", type: "practical" }
  ]
);

addLesson(
  "Quản lý, vận hành CSDL Đất đai (TT26)",
  "Thông tư 26/2024",
  "Chương V",
  "1. Trách nhiệm quản lý: \n- Trung ương quản lý cơ sở dữ liệu đất đai quốc gia. \n- Địa phương quản lý cơ sở dữ liệu đất đai cấp tỉnh. \n\n2. Kết nối, chia sẻ dữ liệu: \nCơ sở dữ liệu đất đai được kết nối liên thông với cơ sở dữ liệu quốc gia về dân cư và các cơ sở dữ liệu chuyên ngành khác. \n\n3. Khai thác thông tin: \nNgười dân và tổ chức được quyền truy cập, khai thác thông tin đất đai thông qua Cổng thông tin đất đai quốc gia hoặc tại cơ quan đăng ký đất đai (trừ các thông tin thuộc bí mật nhà nước).",
  "Hệ thống thông tin đất đai là tài sản quốc gia, phục vụ phát triển kinh tế - xã hội.",
  "TT26: 'Mạng xã hội' đất đai. Dữ liệu được thông não với hệ thống dân cư (CCCD), giúp việc làm thủ tục nhanh như chớp. Bạn có quyền lên mạng tra cứu thông tin mảnh đất mình định mua để tránh bị 'lừa tình' quy hoạch.",
  [
    { question: "Cơ sở dữ liệu đất đai được kết nối liên thông với cơ sở dữ liệu nào để xác thực thông tin chủ đất?", options: ["CSDL về thuế", "CSDL quốc gia về dân cư", "CSDL về xây dựng", "CSDL về tư pháp"], answer: "CSDL quốc gia về dân cư", type: "theory" },
    { question: "Bạn đi làm thủ tục sang tên đất nhưng quên mang CCCD bản giấy. Nhờ kết nối CSDL, cán bộ có thể kiểm tra thông tin của bạn không?", options: ["Không, bắt buộc phải có giấy", "Có, thông qua kết nối liên thông với CSDL dân cư", "Có, nếu bạn nhớ số", "Không, vì hai hệ thống khác nhau"], answer: "Có, thông qua kết nối liên thông với CSDL dân cư", type: "practical" }
  ]
);

addLesson(
  "Mẫu Giấy chứng nhận mới (TT26)",
  "Thông tư 26/2024",
  "Chương IV",
  "Giấy chứng nhận mới có tên gọi: 'Giấy chứng nhận quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất'. \n\nĐặc điểm nổi bật: \n- Có mã QR code để tra cứu thông tin nhanh. \n- Tích hợp đầy đủ dữ liệu về đất và tài sản trên đất. \n- Thống nhất mẫu mã trên toàn quốc. \n- Quản lý phôi sổ chặt chẽ bằng công nghệ số.",
  "Mẫu sổ mới giúp hạn chế làm giả và thuận tiện cho việc quản lý bằng công nghệ số.",
  "Sổ Đỏ 4.0: Sổ mới cực xịn, có cả QR code để 'check var' thông tin chính chủ ngay lập tức. Không còn lo sổ giả hay thông tin mập mờ nữa.",
  [
    { question: "Đặc điểm công nghệ mới trên mẫu Giấy chứng nhận từ năm 2024 là gì?", options: ["Chữ ký số của Bộ trưởng", "Mã QR code để tra cứu thông tin", "Gắn chip điện tử", "In bằng mực vàng"], answer: "Mã QR code để tra cứu thông tin", type: "theory" },
    { question: "Bạn cầm một cuốn sổ đỏ mẫu mới và muốn biết thông tin trên sổ có khớp với hệ thống không. Bạn nên làm gì nhanh nhất?", options: ["Lên quận hỏi", "Dùng điện thoại quét mã QR trên sổ", "So sánh với sổ hàng xóm", "Gửi thư yêu cầu xác minh"], answer: "Dùng điện thoại quét mã QR trên sổ", type: "practical" }
  ]
);

  // --- DEEP DIVE ---
addLesson(
  "Điều kiện Tách thửa chi tiết (Full)",
  "Deep Dive",
  "Quy định 2024",
  "Để thực hiện tách thửa, người sử dụng đất phải đáp ứng đầy đủ các nhóm điều kiện sau: \n\n1. Nhóm điều kiện pháp lý: \n- Phải có Giấy chứng nhận (Sổ đỏ/Sổ hồng). \n- Đất không có tranh chấp (hoặc tranh chấp đã được giải quyết bằng bản án có hiệu lực). \n- Đất không bị kê biên, không bị áp dụng biện pháp khẩn cấp tạm thời. \n- Đất còn trong thời hạn sử dụng. \n\n2. Nhóm điều kiện kỹ thuật: \n- Đảm bảo diện tích tối thiểu: Thửa đất mới và thửa còn lại phải lớn hơn hoặc bằng mức tối thiểu quy định tại địa phương. \n- Đảm bảo kích thước tối thiểu: Chiều rộng mặt tiền và chiều sâu thửa đất phải đạt chuẩn (thường từ 3m-4m tùy vùng). \n- Lối đi: Thửa đất sau khi tách phải có lối đi kết nối với đường giao thông công cộng. \n\n3. Nhóm điều kiện quy hoạch: \n- Phải phù hợp với quy hoạch sử dụng đất và quy hoạch chi tiết xây dựng của địa phương. \n- Không thuộc khu vực đã có thông báo thu hồi đất hoặc quyết định thu hồi đất.",
  "Lưu ý: Nếu tách thửa mà hình thành lối đi chung thì phải làm thủ tục thỏa thuận lối đi và đăng ký biến động kèm theo.",
  "Deep Dive Tách Thửa: Ngoài việc có 'Sổ đỏ' and không 'drama' tranh chấp, bạn phải đảm bảo thửa đất mới không được quá 'mỏng' hoặc quá 'ngắn'. Đặc biệt, luật mới yêu cầu đất tách xong phải có đường vào, không được để thửa đất bị 'cô lập' đâu nhé!",
  [
    { question: "Điều kiện kỹ thuật bắt buộc khi tách thửa liên quan đến giao thông là gì?", options: ["Phải gần chợ", "Thửa đất sau khi tách phải có lối đi kết nối với đường giao thông công cộng", "Phải có vỉa hè", "Phải gần trạm xe buýt"], answer: "Thửa đất sau khi tách phải có lối đi kết nối với đường giao thông công cộng", type: "theory" },
    { question: "Bạn muốn tách thửa nhưng sổ đỏ đang thế chấp ngân hàng. Bạn có được làm thủ tục không?", options: ["Được, nếu ngân hàng đồng ý", "Không, vì đất đang có biện pháp bảo đảm", "Được, nếu diện tích lớn", "Được, nếu xã xác nhận"], answer: "Không, vì đất đang có biện pháp bảo đảm", type: "practical" }
  ]
);

addLesson(
  "Điều kiện cấp Sổ đỏ lần đầu (Không giấy tờ)",
  "Deep Dive",
  "Quy định 2024",
  "Đất không có giấy tờ trước 01/7/2014 được cấp sổ nếu: \n\n1. Sử dụng ổn định, lâu dài. \n\n2. Không vi phạm pháp luật về đất đai (lấn chiếm). \n\n3. Được UBND cấp xã xác nhận là không có tranh chấp. \n\n4. Phù hợp với quy hoạch sử dụng đất tại địa phương. \n\n5. Tùy vào thời điểm sử dụng (trước 1993, 1993-2004, 2004-2014) mà mức nộp tiền sử dụng đất sẽ khác nhau.",
  "Luật 2024 mở rộng thời hạn xét cấp sổ cho đất không giấy tờ đến trước ngày 01/7/2014, tạo cơ hội cho hàng triệu hộ gia đình.",
  "Cấp sổ 'tay không': Dù không có giấy tờ cũ nhưng nếu bạn ở ổn định, hàng xóm không kiện cáo và xã xác nhận 'đất sạch' thì vẫn có cơ hội cầm Sổ đỏ trong tay. Cơ hội vàng từ Luật 2024!",
  [
    { question: "Đất không giấy tờ được cấp sổ nếu sử dụng ổn định trước thời điểm nào theo Luật 2024?", options: ["01/07/2004", "01/07/2014", "01/01/2020", "01/08/2024"], answer: "01/07/2014", type: "theory" },
    { question: "Gia đình ông M ở trên mảnh đất khai hoang từ năm 2010, không tranh chấp, phù hợp quy hoạch nhưng không có giấy tờ gì. Ông M có được cấp sổ không?", options: ["Không, vì không có giấy tờ", "Có, vì sử dụng ổn định trước 01/07/2014 và không tranh chấp", "Chỉ được cấp nếu là hộ nghèo", "Phải mua lại từ nhà nước"], answer: "Có, vì sử dụng ổn định trước 01/07/2014 và không tranh chấp", type: "practical" }
  ]
);

addLesson(
  "Điều kiện Chuyển mục đích sử dụng đất",
  "Deep Dive",
  "Quy định 2024",
  "Điều kiện để chuyển từ đất nông nghiệp sang đất ở (ONT/ODT): \n\n1. Phải phù hợp với quy hoạch sử dụng đất cấp huyện đã được phê duyệt. \n\n2. Thửa đất phải nằm trong kế hoạch sử dụng đất hàng năm của cấp huyện cho phép chuyển mục đích. \n\n3. Người sử dụng đất phải hoàn thành nghĩa vụ tài chính (nộp tiền sử dụng đất). \n\n4. Đất không có tranh chấp and còn thời hạn sử dụng.",
  "Luật 2024 quy định căn cứ chuyển mục đích dựa trên quy hoạch sử dụng đất thay vì chỉ dựa vào kế hoạch hàng năm như trước, giúp người dân chủ động hơn.",
  "Lên thổ cư: Muốn đất vườn thành đất ở thì phải check 'Map' quy hoạch xem có được phép không. Nếu 'Map' xanh thì chuẩn bị tiền nộp thuế là 'lên đời' được ngay.",
  [
    { question: "Căn cứ quan trọng nhất để cho phép chuyển mục đích sử dụng đất theo Luật 2024 là gì?", options: ["Đơn xin của dân", "Quy hoạch sử dụng đất cấp huyện", "Sổ hộ khẩu", "Ý kiến hàng xóm"], answer: "Quy hoạch sử dụng đất cấp huyện", type: "theory" },
    { question: "Bạn có đất lúa (LUC) muốn xây nhà. Bước đầu tiên bạn cần làm là gì?", options: ["Cứ xây rồi nộp phạt", "Check quy hoạch xem có được chuyển sang đất ở không", "Xin tạm trú", "Mua gạch về tập kết"], answer: "Check quy hoạch xem có được chuyển sang đất ở không", type: "practical" }
  ]
);

addLesson(
  "Điều kiện cấp Sổ đỏ đất không giấy tờ (Điều 138)",
  "Deep Dive",
  "Luật Đất đai 2024",
  "Chi tiết các nhóm đối tượng được cấp GCN theo Điều 138 Luật 2024: \n\n1. Nhóm 1: Sử dụng đất trước 18/12/1980 \n- Được UBND cấp xã xác nhận không có tranh chấp. \n- Diện tích đất ở được công nhận theo hạn mức quy định tại địa phương. \n\n2. Nhóm 2: Sử dụng đất từ 18/12/1980 đến trước 15/10/1993 \n- Được UBND cấp xã xác nhận không có tranh chấp. \n- Hạn mức công nhận đất ở căn cứ theo quy định của UBND cấp tỉnh tại thời điểm cấp sổ. \n\n3. Nhóm 3: Sử dụng đất từ 15/10/1993 đến trước 01/7/2014 \n- Được UBND cấp xã xác nhận không có tranh chấp. \n- Phải phù hợp với quy hoạch sử dụng đất hoặc quy hoạch chi tiết xây dựng. \n\n* Lưu ý quan trọng: \n- Không vi phạm pháp luật về đất đai (không lấn, chiếm). \n- Không thuộc trường hợp đất được giao không đúng thẩm quyền. \n- Nghĩa vụ tài chính: Được tính toán dựa trên thời điểm bắt đầu sử dụng đất và hạn mức giao đất.",
  "Luật 2024 nới lỏng điều kiện, cho phép đất sử dụng ổn định đến trước 2014 có cơ hội được cấp sổ.",
  "Kèo thơm cho đất không giấy tờ: Chỉ cần bạn ở ổn định, không 'va chạm' tranh chấp và xã xác nhận đất sạch là có cơ hội lên Sổ đỏ. Thời hạn xét duyệt đã được kéo dài đến tận năm 2014, anh em tranh thủ check ngay!",
  [
    { question: "Đối với đất không giấy tờ sử dụng từ 15/10/1993 đến trước 01/7/2014, điều kiện về quy hoạch là gì?", options: ["Không cần phù hợp quy hoạch", "Phải phù hợp với quy hoạch sử dụng đất hoặc quy hoạch chi tiết xây dựng", "Chỉ cần xã đồng ý", "Phải nằm trong khu công nghiệp"], answer: "Phải phù hợp với quy hoạch sử dụng đất hoặc quy hoạch chi tiết xây dựng", type: "theory" },
    { question: "Bà Lan sử dụng đất từ năm 2000, không giấy tờ. Nay bà xin cấp sổ nhưng đất nằm trong quy hoạch công viên cây xanh đã công bố. Bà có được cấp sổ đỏ đất ở không?", options: ["Có, vì ở lâu rồi", "Không, vì không phù hợp quy hoạch sử dụng đất", "Có, nếu bà nộp thêm tiền", "Được cấp sổ nhưng ghi là đất công viên"], answer: "Không, vì không phù hợp quy hoạch sử dụng đất", type: "practical" }
  ]
);

addLesson(
  "Điều kiện Tách thửa & Hợp thửa (Điều 220)",
  "Deep Dive",
  "Luật Đất đai 2024",
  "Nguyên tắc và điều kiện tách thửa, hợp thửa đất theo Điều 220: \n\n1. Điều kiện chung: \n- Phải có Giấy chứng nhận (Sổ đỏ/Sổ hồng). \n- Đất còn trong thời hạn sử dụng. \n- Đất không có tranh chấp, không bị kê biên, không bị phong tỏa. \n\n2. Điều kiện về kỹ thuật (Tách thửa): \n- Thửa đất mới và thửa đất còn lại sau khi tách phải đảm bảo diện tích và kích thước tối thiểu theo quy định của UBND cấp tỉnh. \n- Trường hợp tách thửa mà có hình thành đường giao thông, hạ tầng kỹ thuật thì phải được cơ quan nhà nước có thẩm quyền phê duyệt trước khi thực hiện. \n\n3. Điều kiện về kỹ thuật (Hợp thửa): \n- Các thửa đất phải liền kề nhau. \n- Phải có cùng mục đích sử dụng đất, cùng thời hạn sử dụng đất và cùng hình thức thuê đất/giao đất. \n- Nếu không cùng các yếu tố trên thì phải thực hiện thủ tục đăng ký biến động/chuyển mục đích trước khi hợp thửa.",
  "Việc tách thửa hiện nay yêu cầu khắt khe về hạ tầng và lối đi để tránh hình thành các khu dân cư tự phát không đạt chuẩn.",
  "Muốn 'chia tay' (tách thửa) hay 'về chung một nhà' (hợp thửa) thì đất phải sạch, còn hạn và đặc biệt là phải đúng size tối thiểu của tỉnh. Tách xong mà muốn có đường đi riêng thì phải xin phép 'admin' duyệt quy hoạch hạ tầng trước nhé.",
  [
    { question: "Điều kiện để hợp hai thửa đất là gì?", options: ["Phải cùng chủ", "Phải liền kề nhau và cùng mục đích sử dụng", "Phải cùng diện tích", "Phải cùng năm cấp sổ"], answer: "Phải liền kề nhau và cùng mục đích sử dụng", type: "theory" },
    { question: "Anh Tuấn có 1 thửa đất ở và 1 thửa đất trồng cây lâu năm liền kề. Anh có thể hợp nhất chúng thành 1 thửa đất ở ngay được không?", options: ["Được luôn", "Không, phải chuyển mục đích thửa đất trồng cây sang đất ở trước", "Được, nếu xã đồng ý", "Không, đất ở không được hợp with đất khác"], answer: "Không, phải chuyển mục đích thửa đất trồng cây sang đất ở trước", type: "practical" }
  ]
);

addLesson(
  "Hồ sơ Đăng ký biến động (TT26/2024)",
  "Thông tư 26/2024",
  "Điều 20 - Điều 25",
  "Chi tiết thành phần hồ sơ cho các trường hợp biến động phổ biến: \n\n1. Chuyển nhượng, tặng cho: \n- Đơn đăng ký biến động (Mẫu số 11/ĐK). \n- Hợp đồng chuyển nhượng/tặng cho có công chứng/chứng thực. \n- Bản gốc Giấy chứng nhận đã cấp. \n\n2. Chuyển mục đích sử dụng đất (phải xin phép): \n- Đơn xin chuyển mục đích sử dụng đất. \n- Giấy chứng nhận quyền sử dụng đất. \n- Bản thiết kế/Sơ đồ vị trí thửa đất (nếu cần). \n\n3. Thay đổi thông tin chủ sở hữu (CCCD, địa chỉ): \n- Đơn đăng ký biến động. \n- Bản sao CCCD mới hoặc giấy xác nhận thay đổi thông tin cư trú. \n- Bản gốc Giấy chứng nhận để cập nhật thông tin vào trang bổ sung hoặc cấp đổi.",
  "Thông tư 26 chuẩn hóa các mẫu đơn và đơn giản hóa thành phần hồ sơ để người dân dễ dàng thực hiện.",
  "Checklist hồ sơ: Muốn đổi tên, bán đất hay lên thổ cư thì cứ bám sát TT26. Quan trọng nhất là cái Sổ đỏ gốc và hợp đồng công chứng. Giờ đây mọi thứ đều có mẫu sẵn, anh em chỉ việc điền vào chỗ trống là xong.",
  [
    { question: "Mẫu đơn đăng ký biến động đất đai theo Thông tư 26 là mẫu số mấy?", options: ["Mẫu số 01/ĐK", "Mẫu số 09/ĐK", "Mẫu số 11/ĐK", "Mẫu số 12/ĐK"], answer: "Mẫu số 11/ĐK", type: "theory" },
    { question: "Bạn đi làm thủ tục tặng cho đất cho con. Ngoài đơn và sổ đỏ gốc, giấy tờ nào là quan trọng nhất?", options: ["Giấy khai sinh của con", "Hợp đồng tặng cho có công chứng", "Sổ hộ khẩu cũ", "Giấy xác nhận tình trạng hôn nhân"], answer: "Hợp đồng tặng cho có công chứng", type: "practical" }
  ]
);

addLesson(
  "Các bước thành lập Bản đồ địa chính (TT25)",
  "Thông tư 25/2014",
  "Quy trình kỹ thuật",
  "Quy trình 05 bước tiêu chuẩn để thành lập bản đồ địa chính: \n\n1. Công tác chuẩn bị: \n- Xác định khu vực đo đạc, lập thiết kế kỹ thuật - dự toán. \n- Chuẩn bị máy móc (Toàn đạc điện tử, GNSS), nhân lực. \n\n2. Thiết lập lưới khống chế: \n- Xây dựng lưới tọa độ địa chính cấp 1, cấp 2 hoặc lưới khống chế đo vẽ. \n- Đảm bảo kết nối với hệ tọa độ quốc gia VN-2000. \n\n3. Đo đạc chi tiết ranh giới thửa đất: \n- Xác định ranh giới, mốc giới thửa đất tại thực địa. \n- Sử dụng phương pháp đo trực tiếp hoặc công nghệ vệ tinh để lấy tọa độ các đỉnh thửa. \n\n4. Biên tập bản đồ địa chính: \n- Xử lý số liệu đo đạc, vẽ ranh giới thửa đất lên phần mềm chuyên dụng (MicroStation, Famis). \n- Gán mã loại đất, số thửa, diện tích và các đối tượng địa lý liên quan. \n\n5. Kiểm tra, nghiệm thu và lưu trữ: \n- Kiểm tra nội nghiệp và ngoại nghiệp (đối soát thực địa). \n- Ký xác nhận bản đồ và đưa vào cơ sở dữ liệu đất đai.",
  "Quy trình này đảm bảo tính thống nhất và độ chính xác pháp lý cho mọi thửa đất trên toàn quốc.",
  "5 bước 'build' Map địa chính: Từ việc chuẩn bị máy móc, cắm mốc tọa độ, đi đo từng mét đất, rồi về 'vẽ' lên app chuyên dụng. Cuối cùng là 'check var' lại lần cuối trước khi đưa lên hệ thống quốc gia.",
  [
    { question: "Bước nào thực hiện việc xác định ranh giới, mốc giới thửa đất tại thực địa?", options: ["Công tác chuẩn bị", "Thiết lập lưới khống chế", "Đo đạc chi tiết", "Biên tập bản đồ"], answer: "Đo đạc chi tiết", type: "theory" },
    { question: "Sau khi đi đo về, kỹ thuật viên dùng phần mềm MicroStation để vẽ ranh giới. Đây là bước nào?", options: ["Đo đạc chi tiết", "Biên tập bản đồ địa chính", "Nghiệm thu", "Lưu trữ"], answer: "Biên tập bản đồ địa chính", type: "practical" }
  ]
);

addLesson(
  "Quy trình cấp Sổ đỏ lần đầu (Luật 2024)",
  "Deep Dive",
  "Quy trình pháp lý",
  "Các bước thực hiện cấp Giấy chứng nhận quyền sử dụng đất lần đầu: \n\n1. Nộp hồ sơ: \n- Người dân nộp hồ sơ tại Bộ phận Một cửa hoặc Văn phòng đăng ký đất đai cấp huyện. \n- Hồ sơ gồm: Đơn đăng ký, giấy tờ về quyền sử dụng đất (nếu có), sơ đồ thửa đất. \n\n2. Tiếp nhận và Kiểm tra: \n- Cán bộ tiếp nhận kiểm tra tính đầy đủ của hồ sơ. \n- Nếu đủ điều kiện, viết phiếu hẹn trả kết quả. \n\n3. Xác minh và Công khai (tại xã): \n- UBND cấp xã xác nhận tình trạng đất, nguồn gốc và thời điểm sử dụng. \n- Niêm yết công khai kết quả kiểm tra tại trụ sở UBND xã trong 15 ngày để kiểm tra tranh chấp. \n\n4. Thực hiện nghĩa vụ tài chính: \n- Cơ quan thuế ra thông báo nộp tiền sử dụng đất, lệ phí trước bạ. \n- Người dân nộp tiền và nộp lại chứng từ cho cơ quan đăng ký. \n\n5. Ký cấp và Trao sổ: \n- UBND cấp huyện ký quyết định cấp Giấy chứng nhận. \n- Văn phòng đăng ký đất đai thực hiện in sổ và trao cho người dân.",
  "Luật 2024 hướng tới việc rút ngắn thời gian và minh bạch hóa quy trình để người dân dễ dàng tiếp cận.",
  "Lộ trình 'săn' Sổ đỏ: Nộp đơn -> Xã 'check var' 15 ngày xem có ai kiện không -> Nhận thông báo 'ting ting' nộp thuế -> Chờ huyện ký duyệt là có sổ cầm tay flex with hàng xóm ngay!",
  [
    { question: "Thời gian niêm yết công khai kết quả kiểm tra hồ sơ tại xã là bao nhiêu ngày?", options: ["7 ngày", "10 ngày", "15 ngày", "30 ngày"], answer: "15 ngày", type: "theory" },
    { question: "Hồ sơ của bạn đã qua bước niêm yết 15 ngày tại xã và không ai khiếu nại. Bước tiếp theo bạn cần chờ đợi là gì?", options: ["Nhận sổ ngay", "Thông báo nộp nghĩa vụ tài chính (thuế, phí)", "Xã đi đo lại đất", "Huyện xuống phỏng vấn"], answer: "Thông báo nộp nghĩa vụ tài chính (thuế, phí)", type: "practical" }
  ]
);

addLesson(
  "Cơ sở toán học của Bản đồ địa chính (TT25)",
  "Thông tư 25/2014",
  "Yêu cầu kỹ thuật",
  "Bản đồ địa chính phải được thành lập trên cơ sở toán học thống nhất: \n\n1. Hệ quy chiếu và Hệ tọa độ: \n- Sử dụng Hệ quy chiếu và Hệ tọa độ quốc gia VN-2000. \n- Elipsoid quy chiếu: WGS-84. \n\n2. Lưới chiếu: \n- Sử dụng lưới chiếu hình trụ ngang đồng góc Gauss-Kruger (đối với tỷ lệ 1:2000, 1:5000, 1:10000). \n- Sử dụng lưới chiếu hình trụ ngang đồng góc UTM (đối với tỷ lệ 1:200, 1:500, 1:1000). \n\n3. Kinh tuyến trục và Múi chiếu: \n- Kinh tuyến trục được quy định riêng cho từng tỉnh, thành phố trực thuộc Trung ương. \n- Múi chiếu 3 độ (hệ số biến dạng chiều dài k0 = 0.9999). \n\n4. Hệ thống độ cao: \n- Sử dụng Hệ độ cao quốc gia (Hòn Dấu - Hải Phòng).",
  "Việc thống nhất cơ sở toán học giúp các bản đồ từ các địa phương khác nhau có thể ghép nối chính xác trên toàn quốc.",
  "Map địa chính không dùng Google Maps đâu nhé! Nó dùng hệ VN-2000, múi chiếu 3 độ và kinh tuyến trục riêng của từng tỉnh. Mọi thứ phải chuẩn đét để khi ghép các mảnh lại không bị lệch một li nào.",
  [
    { question: "Hệ tọa độ quốc gia chính thức của Việt Nam là gì?", options: ["WGS-84", "VN-2000", "HN-72", "UTM"], answer: "VN-2000", type: "theory" },
    { question: "Bạn thấy bản đồ địa chính tỉnh mình dùng múi chiếu 3 độ. Hệ số biến dạng chiều dài k0 là bao nhiêu?", options: ["0.9996", "0.9999", "1.0000", "0.9991"], answer: "0.9999", type: "practical" }
  ]
);

addLesson(
  "Nội dung biểu thị trên Bản đồ địa chính",
  "Thông tư 25/2014",
  "Yêu cầu nội dung",
  "Bản đồ địa chính phải thể hiện đầy đủ 07 nhóm yếu tố nội dung sau: \n\n1. Khung bản đồ: Gồm các đường khung, tọa độ góc khung, tên bản đồ, tỷ lệ, sơ đồ phân mảnh. \n\n2. Điểm khống chế tọa độ, độ cao: Các điểm tọa độ quốc gia, điểm địa chính, điểm khống chế đo vẽ. \n\n3. Địa giới hành chính: Đường địa giới các cấp (tỉnh, huyện, xã), các mốc địa giới và điểm đặc trưng trên đường địa giới. \n\n4. Thửa đất (Yếu tố quan trọng nhất): Ranh giới thửa đất, số hiệu thửa, diện tích và mã loại đất. \n\n5. Các đối tượng chiếm đất nhưng không tạo thành thửa đất: Đường giao thông, hệ thống thủy lợi, đê điều, sông ngòi, kênh rạch. \n\n6. Địa danh và các ghi chú thuyết minh: Tên các đơn vị hành chính, tên đường, tên sông, tên các công trình lớn. \n\n7. Các yếu tố liên quan đến quy hoạch: Chỉ giới quy hoạch, hành lang an toàn lưới điện, hành lang bảo vệ nguồn nước (nếu có).",
  "Thửa đất là linh hồn của bản đồ địa chính, mọi yếu tố khác đều phục vụ việc xác định vị trí và tình trạng của thửa đất.",
  "Trên Map địa chính có gì? Có 7 món ăn chơi: Từ cái khung, mốc tọa độ, ranh giới xã/huyện, cho đến nhân vật chính là các thửa đất. Ngoài ra còn có đường xá, sông ngòi và các ghi chú để bạn không bị lạc trôi khi xem Map.",
  [
    { question: "Yếu tố nào là quan trọng nhất trên bản đồ địa chính?", options: ["Địa giới hành chính", "Thửa đất", "Giao thông", "Địa danh"], answer: "Thửa đất", type: "theory" },
    { question: "Trên bản đồ, bạn thấy một đường kẻ nét đứt kèm ghi chú 'Chỉ giới quy hoạch'. Yếu tố này thuộc nhóm nào?", options: ["Thửa đất", "Địa giới hành chính", "Các yếu tố liên quan đến quy hoạch", "Địa danh"], answer: "Các yếu tố liên quan đến quy hoạch", type: "practical" }
  ]
);

addLesson(
  "Yêu cầu về Chia mảnh và Đánh số bản đồ",
  "Thông tư 25/2014",
  "Yêu cầu trình bày",
  "Quy định về việc phân chia và quản lý các tờ bản đồ: \n\n1. Kích thước khung trong tờ bản đồ: \n- Tỷ lệ 1:500: 50 x 50 cm (diện tích thực tế 6.25 ha). \n- Tỷ lệ 1:1000: 50 x 50 cm (diện tích thực tế 25 ha). \n- Tỷ lệ 1:2000: 50 x 50 cm (diện tích thực tế 100 ha). \n- Tỷ lệ 1:5000: 50 x 80 cm (diện tích thực tế 1000 ha). \n\n2. Cách đánh số hiệu mảnh bản đồ: \n- Số hiệu mảnh bản đồ địa chính gồm số thứ tự tờ bản đồ trong phạm vi đơn vị hành chính cấp xã. \n- Ví dụ: Tờ bản đồ số 01, 02... \n\n3. Sơ đồ phân mảnh: \n- Mỗi xã phải có một sơ đồ tổng thể chỉ rõ vị trí và số hiệu của tất cả các tờ bản đồ trong xã đó. \n- Giúp việc tra cứu và quản lý hồ sơ địa chính được hệ thống.",
  "Việc chia mảnh giúp quản lý dữ liệu hiệu quả hơn, tránh việc một tệp tin quá nặng khó xử lý.",
  "Map địa chính được chia thành các 'mảnh' nhỏ như miếng pizza. Tùy tỷ lệ mà mỗi mảnh bao phủ diện tích khác nhau. Mỗi mảnh có một số hiệu riêng (ví dụ Tờ số 10) để bạn dễ dàng 'order' đúng mảnh đất mình cần tìm.",
  [
    { question: "Kích thước khung trong của tờ bản đồ địa chính tỷ lệ 1:500 là bao nhiêu?", options: ["40x40 cm", "50x50 cm", "50x80 cm", "60x60 cm"], answer: "50x50 cm", type: "theory" },
    { question: "Một xã có 50 tờ bản đồ địa chính. Việc đánh số hiệu các tờ này được thực hiện như thế nào?", options: ["Đánh từ 1 đến 50", "Đánh theo bảng chữ cái", "Đánh theo tên thôn", "Đánh ngẫu nhiên"], answer: "Đánh từ 1 đến 50", type: "practical" }
  ]
);

addLesson(
  "Hệ thống phân mảnh Bản đồ địa chính mới nhất",
  "Thông tư 25/2014",
  "Quy chuẩn kỹ thuật",
  "Quy định chi tiết về cách chia mảnh và đánh số hiệu tờ bản đồ địa chính theo hệ tọa độ VN-2000: \n\n1. Chia mảnh theo tỷ lệ: \n- Tỷ lệ 1:10.000: Chia mảnh bản đồ địa hình tỷ lệ 1:25.000 thành 04 mảnh (ký hiệu bằng chữ cái a, b, c, d). \n- Tỷ lệ 1:5.000: Chia mảnh 1:10.000 thành 04 mảnh (ký hiệu bằng số 1, 2, 3, 4). \n- Tỷ lệ 1:2.000: Chia mảnh 1:5.000 thành 09 mảnh (ký hiệu bằng số La Mã I, II... IX). \n- Tỷ lệ 1:1.000: Chia mảnh 1:2.000 thành 04 mảnh (ký hiệu bằng số 1, 2, 3, 4). \n- Tỷ lệ 1:500: Chia mảnh 1:2.000 thành 16 mảnh (ký hiệu bằng số 1, 2... 16). \n\n2. Đánh số hiệu tờ bản đồ: \n- Số hiệu mảnh bản đồ địa chính gồm số thứ tự tờ bản đồ trong phạm vi đơn vị hành chính cấp xã. \n- Số thứ tự tờ bản đồ được đánh bằng số Ả Rập (1, 2, 3...) từ trái sang phải, từ trên xuống dưới. \n\n3. Kích thước khung trong: \n- Tỷ lệ 1:500, 1:1000, 1:2000: Khung trong có kích thước 50x50 cm. \n- Tỷ lệ 1:5000: Khung trong có kích thước 50x80 cm. \n- Tỷ lệ 1:10000: Khung trong có kích thước 50x50 cm. \n\n4. Tên gọi tờ bản đồ: \n- Gồm tên đơn vị hành chính cấp xã, huyện, tỉnh; số hiệu tờ bản đồ; tỷ lệ bản đồ.",
  "Hệ thống phân mảnh này giúp quản lý dữ liệu đất đai một cách khoa học, dễ dàng tra cứu và tích hợp vào cơ sở dữ liệu quốc gia.",
  "Chia mảnh Map địa chính giống như chia nhỏ một bức tranh lớn thành các mảnh ghép. Tùy vào độ chi tiết (tỷ lệ) mà ta chia thành 4, 9 hay 16 mảnh nhỏ hơn. Mỗi mảnh được đánh số thứ tự rõ ràng để bạn không bao giờ bị 'lạc' giữa rừng dữ liệu đất đai.",
  [
    { question: "Một mảnh bản đồ tỷ lệ 1:2000 được chia thành bao nhiêu mảnh tỷ lệ 1:500?", options: ["4 mảnh", "9 mảnh", "16 mảnh", "25 mảnh"], answer: "16 mảnh", type: "theory" },
    { question: "Bạn đang xem mảnh 1:2000 ký hiệu 'VI'. Nếu chia nhỏ mảnh này sang 1:500, các mảnh con sẽ được đánh số từ mấy đến mấy?", options: ["1 đến 4", "1 đến 9", "1 đến 16", "a đến d"], answer: "1 đến 16", type: "practical" }
  ]
);

  // --- LUẬT ĐẤT ĐAI 2013 (CŨ) ---
addLesson(
  "Quy định chung (2013)",
  "Luật Đất đai 2013",
  "Chương I",
  "Quy định về sở hữu đất đai, quản lý nhà nước về đất đai, chế độ sử dụng đất.",
  "Luật cũ quy định đất đai thuộc sở hữu toàn dân do Nhà nước đại diện chủ sở hữu.",
  "Chương 1 (2013): Bản 'classic' của luật đất đai. Vẫn là Nhà nước làm admin nhưng các quy định về quản lý còn khá thủ công so với bản 2024.",
  [
    { question: "Theo Luật 2013, đất đai thuộc sở hữu của ai?", options: ["Tư nhân", "Toàn dân do Nhà nước đại diện chủ sở hữu", "Chính phủ", "UBND tỉnh"], answer: "Toàn dân do Nhà nước đại diện chủ sở hữu", type: "theory" },
    { question: "Năm 2020, bạn mua đất. Luật nào đang điều chỉnh giao dịch của bạn lúc đó?", options: ["Luật 2003", "Luật 2013", "Luật 2024", "Luật Dân sự"], answer: "Luật 2013", type: "practical" }
  ]
);

addLesson(
  "Quyền và nghĩa vụ (2013)",
  "Luật Đất đai 2013",
  "Chương XI",
  "Quyền và nghĩa vụ của người sử dụng đất trong việc chuyển đổi, chuyển nhượng, cho thuê, thừa kế.",
  "Quy định các quyền cơ bản nhưng thủ tục hành chính còn khá phức tạp.",
  "Chương 11 (2013): Quyền lợi của bạn ở bản này vẫn có đủ, nhưng 'user interface' hành chính thì hơi rắc rối, nhiều giấy tờ hơn bản mới.",
  [
    { question: "Quyền nào cho phép người sử dụng đất để lại đất cho người thân sau khi qua đời?", options: ["Quyền chuyển nhượng", "Quyền thừa kế", "Quyền tặng cho", "Quyền thế chấp"], answer: "Quyền thừa kế", type: "theory" },
    { question: "Ông K muốn thế chấp sổ đỏ vay vốn ngân hàng năm 2022. Ông thực hiện quyền này dựa trên chương nào của Luật 2013?", options: ["Chương về thu hồi đất", "Chương về quyền và nghĩa vụ của người sử dụng đất", "Chương về giá đất", "Chương về thanh tra"], answer: "Chương về quyền và nghĩa vụ của người sử dụng đất", type: "practical" }
  ]
);

addLesson(
  "Bồi thường, hỗ trợ (2013)",
  "Luật Đất đai 2013",
  "Chương VI",
  "Quy định về bồi thường, hỗ trợ, tái định cư khi Nhà nước thu hồi đất.",
  "Cơ chế bồi thường dựa trên khung giá đất của Nhà nước, thường thấp hơn giá thị trường.",
  "Chương 6 (2013): Điểm yếu của bản cũ là đền bù theo 'khung giá' cố định, đôi khi khiến dân cảm thấy 'bị hớ' vì thấp hơn giá thực tế.",
  [
    { question: "Giá đất để tính bồi thường theo Luật 2013 dựa trên cơ sở nào?", options: ["Giá thị trường tự do", "Khung giá đất và bảng giá đất của Nhà nước", "Giá người dân yêu cầu", "Giá do doanh nghiệp đưa ra"], answer: "Khung giá đất và bảng giá đất của Nhà nước", type: "theory" },
    { question: "Năm 2021, nhà bạn bị thu hồi đất. Bạn cảm thấy giá đền bù quá thấp so với thực tế. Nguyên nhân chính thường là do đâu theo cơ chế Luật 2013?", options: ["Do cán bộ làm sai", "Do áp dụng khung giá đất khống chế của Chính phủ", "Do đất bạn xấu", "Do bạn không nộp thuế"], answer: "Do áp dụng khung giá đất khống chế của Chính phủ", type: "practical" }
  ]
);

addLesson(
  "Điều kiện thực hiện quyền của Người sử dụng đất",
  "Luật Đất đai 2024",
  "Điều 45",
  "Người sử dụng đất được thực hiện các quyền chuyển đổi, chuyển nhượng, cho thuê, thừa kế, tặng cho, thế chấp, góp vốn khi có đủ các điều kiện: \n\n1. Có Giấy chứng nhận (Sổ đỏ/Sổ hồng). \n\n2. Đất không có tranh chấp (hoặc tranh chấp đã được giải quyết bằng bản án/quyết định có hiệu lực). \n\n3. Quyền sử dụng đất không bị kê biên hoặc áp dụng biện pháp bảo đảm thi hành án. \n\n4. Đất còn trong thời hạn sử dụng. \n\n5. Quyền sử dụng đất không bị áp dụng biện pháp khẩn cấp tạm thời.",
  "Đây là 'điều kiện cần' để bạn có thể thực hiện bất kỳ giao dịch nào liên quan đến mảnh đất của mình.",
  "Điều kiện 5 'Không': Không thiếu sổ, không tranh chấp, không bị kê biên, không hết hạn và không bị phong tỏa khẩn cấp. Hội đủ 5 yếu tố này là bạn có thể tự tin mang đất đi giao dịch rồi nhé.",
  [
    { question: "Điều kiện nào là bắt buộc để thực hiện quyền chuyển nhượng đất?", options: ["Có Giấy chứng nhận", "Đất không tranh chấp", "Đất còn hạn sử dụng", "Tất cả các phương án trên"], answer: "Tất cả các phương án trên", type: "theory" },
    { question: "Đất nhà bạn đang bị Tòa án phong tỏa để giải quyết một vụ kiện. Bạn có thể ra công chứng bán đất được không?", options: ["Được, vì là chủ", "Không, vì vi phạm điều kiện đất không bị áp dụng biện pháp khẩn cấp tạm thời", "Được, nếu người mua đồng ý", "Được, nếu nộp phạt"], answer: "Không, vì vi phạm điều kiện đất không bị áp dụng biện pháp khẩn cấp tạm thời", type: "practical" }
  ]
);

addLesson(
  "Hồ sơ ranh giới sử dụng đất (Công ty)",
  "Thông tư 26/2024",
  "Điều 26",
  "Hồ sơ ranh giới sử dụng đất của các công ty nông, lâm nghiệp bao gồm: \n\n1. Bản đồ địa chính có chứa đường ranh giới quản lý, sử dụng đất rõ ràng, chi tiết, liên tục. \n\n2. Bản mô tả ranh giới, mốc giới thửa đất (Mẫu 12a). \n\n3. Bản xác nhận đường ranh giới sử dụng đất (Mẫu 12b). \n\n4. Bảng thống kê tọa độ các điểm mốc ranh giới, điểm đặc trưng (Mẫu 14a). \n\n5. Biên bản về các trường hợp tranh chấp chưa giải quyết xong (nếu có). \n\n6. Bảng kê diện tích đất của công ty (Mẫu 16a).",
  "Quy định này giúp quản lý chặt chẽ quỹ đất rộng lớn của các công ty nông, lâm nghiệp, tránh tình trạng lấn chiếm.",
  "TT26: 'Profile' ranh giới cho các Big Boss (công ty nông lâm nghiệp). Mọi ranh giới phải được vẽ rõ, cắm mốc chuẩn và có biên bản xác nhận để tránh việc đất công bị 'bốc hơi' hoặc tranh chấp kéo dài.",
  [
    { question: "Mẫu bản mô tả ranh giới, mốc giới thửa đất cho công ty nông lâm nghiệp là mẫu số mấy?", options: ["Mẫu 11a", "Mẫu 12a", "Mẫu 14a", "Mẫu 16a"], answer: "Mẫu 12a", type: "theory" },
    { question: "Một công ty cao su muốn xác định lại ranh giới để tránh dân lấn chiếm. Tài liệu nào là quan trọng nhất để đối soát?", options: ["Báo cáo tài chính", "Bản đồ địa chính có đường ranh giới chi tiết và bản xác nhận ranh giới", "Danh sách nhân viên", "Hợp đồng xuất khẩu"], answer: "Bản đồ địa chính có đường ranh giới chi tiết và bản xác nhận ranh giới", type: "practical" }
  ]
);

addLesson(
  "Tiêu chuẩn Quét (Scan) tài liệu đất đai",
  "Thông tư 26/2024",
  "Phụ lục kỹ thuật",
  "Tiêu chuẩn kỹ thuật quét (scan) tài liệu để xây dựng CSDL đất đai: \n\n1. Định dạng tệp tin: \n- Sử dụng định dạng .PDF (đa trang) hoặc .TIFF. \n- Khuyến khích sử dụng PDF có khả năng tìm kiếm văn bản (OCR). \n\n2. Độ phân giải (Resolution): \n- Tối thiểu 200 dpi đến 300 dpi để đảm bảo độ nét và dung lượng tối ưu. \n\n3. Chế độ màu: \n- Tài liệu có màu (Giấy chứng nhận, bản đồ màu): Quét màu (Color). \n- Tài liệu văn bản thông thường: Quét thang xám (Grayscale) hoặc đen trắng (Black & White). \n\n4. Yêu cầu chất lượng: \n- Hình ảnh phải ngay ngắn, không bị nghiêng lệch quá 3 độ. \n- Nội dung văn bản, chữ ký, con dấu phải rõ ràng, không bị mất nét hoặc nhòe. \n- Không được tẩy xóa hoặc chỉnh sửa nội dung tệp tin sau khi quét. \n\n5. Quy tắc đặt tên tệp: \n- Đặt tên theo mã định danh thửa đất hoặc số hiệu hồ sơ để dễ dàng liên kết dữ liệu.",
  "Việc tuân thủ tiêu chuẩn quét giúp bảo tồn giá trị pháp lý của hồ sơ giấy trong môi trường số.",
  "Scan chuẩn 4.0: Không phải cứ chụp ảnh là xong đâu nhé! Phải quét đúng 300 dpi, định dạng PDF, giữ nguyên màu sắc của Sổ đỏ để khi 'check var' trên máy tính vẫn thấy rõ từng nét ký của cán bộ.",
  [
    { question: "Độ phân giải tối thiểu khi quét tài liệu đất đai là bao nhiêu?", options: ["72 dpi", "150 dpi", "200 dpi", "600 dpi"], answer: "200 dpi", type: "theory" },
    { question: "Khi quét Giấy chứng nhận (Sổ đỏ) để đưa vào CSDL, bạn nên chọn chế độ màu nào?", options: ["Đen trắng", "Thang xám", "Màu (Color)", "Chế độ nào cũng được"], answer: "Màu (Color)", type: "practical" }
  ]
);

addLesson(
  "Phương pháp định giá đất (Luật 2024)",
  "Luật Đất đai 2024",
  "Điều 158",
  "Luật Đất đai 2024 quy định 04 phương pháp định giá đất chính: \n\n1. Phương pháp so sánh: \nĐược thực hiện bằng cách điều chỉnh mức giá của các thửa đất có cùng mục đích sử dụng đất, tương đồng về nhất định các yếu tố có ảnh hưởng đến giá đất đã chuyển nhượng trên thị trường. \n\n2. Phương pháp thu nhập: \nĐược thực hiện bằng cách lấy thu nhập ròng bình quân năm trên một diện tích đất chia cho lãi suất tiền gửi tiết kiệm bình quân của loại tiền gửi bằng Việt Nam đồng kỳ hạn 12 tháng. \n\n3. Phương pháp thặng dư: \nĐược thực hiện bằng cách lấy tổng doanh thu phát triển ước tính trừ đi tổng chi phí phát triển ước tính của thửa đất, khu đất trên cơ sở sử dụng đất có hiệu quả cao nhất. \n\n4. Phương pháp hệ số điều chỉnh giá đất: \nĐược thực hiện bằng cách lấy giá đất trong bảng giá đất nhân với hệ số điều chỉnh giá đất (hệ số K). \n\n* Lưu ý: Chính phủ quy định chi tiết các trường hợp áp dụng cụ thể cho từng phương pháp để đảm bảo tính sát thực với thị trường.",
  "Việc đa dạng hóa phương pháp giúp định giá đất công bằng và minh bạch hơn.",
  "Định giá đất 2024: Không còn cảnh 'nhìn mặt gửi vàng'. Có 4 công thức chuẩn để tính tiền: So sánh với hàng xóm, tính theo tiền lời thu hoạch, tính theo tiềm năng xây dựng hoặc dùng hệ số K của tỉnh. Mọi thứ đều có số liệu rõ ràng!",
  [
    { question: "Phương pháp định giá nào dựa trên việc so sánh với các thửa đất tương đồng đã giao dịch?", options: ["Phương pháp thu nhập", "Phương pháp so sánh", "Phương pháp thặng dư", "Phương pháp hệ số K"], answer: "Phương pháp so sánh", type: "theory" },
    { question: "Bạn muốn tính giá một khu đất trống dựa trên doanh thu dự kiến sau khi xây chung cư. Phương pháp nào là phù hợp nhất?", options: ["So sánh", "Thu nhập", "Thặng dư", "Hệ số điều chỉnh"], answer: "Thặng dư", type: "practical" }
  ]
);

addLesson(
  "Quyền sử dụng đất của Việt kiều (Luật 2024)",
  "Luật Đất đai 2024",
  "Điều 4",
  "Luật 2024 mở rộng quyền tiếp cận đất đai cho người Việt Nam định cư ở nước ngoài: \n\n1. Đối tượng: \nNgười gốc Việt Nam định cư ở nước ngoài được hưởng các quyền và nghĩa vụ như cá nhân trong nước. \n\n2. Quyền sở hữu nhà ở: \nĐược quyền mua, thuê mua nhà ở gắn liền với quyền sử dụng đất ở, nhận quyền sử dụng đất ở trong các dự án phát triển nhà ở. \n\n3. Quyền giao dịch: \nĐược nhận thừa kế, tặng cho quyền sử dụng đất ở, đất nông nghiệp (nếu đủ điều kiện như cá nhân trong nước). \n\n4. Thủ tục: \nCần có giấy tờ chứng minh là người gốc Việt Nam theo quy định của pháp luật về quốc tịch.",
  "Sự thay đổi này giúp thu hút nguồn lực từ kiều bào và đảm bảo quyền lợi bình đẳng cho người Việt khắp thế giới.",
  "Việt kiều 'về làng' mua đất: Giờ đây anh em Việt kiều có quyền mua nhà, nhận đất thừa kế y hệt như người ở trong nước. Không còn rào cản 'người nước ngoài' nữa, chỉ cần chứng minh được gốc gác Việt Nam là 'chốt đơn' thoải mái!",
  [
    { question: "Theo Luật 2024, người gốc Việt Nam định cư ở nước ngoài có quyền gì đối với đất ở?", options: ["Chỉ được thuê", "Được mua, nhận tặng cho, thừa kế như cá nhân trong nước", "Không được đứng tên sổ đỏ", "Chỉ được mua chung cư"], answer: "Được mua, nhận tặng cho, thừa kế như cá nhân trong nước", type: "theory" },
    { question: "Một người gốc Việt đang sống tại Mỹ muốn về Việt Nam mua một căn nhà phố để dưỡng già. Theo Luật 2024, họ có được đứng tên Sổ đỏ không?", options: ["Được, nếu có giấy tờ chứng minh gốc Việt", "Không, phải nhờ người thân đứng tên hộ", "Chỉ được đứng tên nếu có quốc tịch Việt Nam", "Được, nhưng chỉ có thời hạn 50 năm"], answer: "Được, nếu có giấy tờ chứng minh gốc Việt", type: "practical" }
  ]
);

addLesson(
  "Giải quyết tranh chấp đất đai (Luật 2024)",
  "Luật Đất đai 2024",
  "Điều 235 - Điều 236",
  "Quy trình giải quyết tranh chấp đất đai theo quy định mới: \n\n1. Hòa giải tại cơ sở: \n- Nhà nước khuyến khích các bên tự hòa giải. \n- Nếu không tự hòa giải được, gửi đơn đến UBND cấp xã nơi có đất để hòa giải. \n- Thời hạn hòa giải tại xã: Không quá 30 ngày. \n\n2. Thẩm quyền giải quyết: \n- Tranh chấp đất đai mà đương sự có Giấy chứng nhận: Do Tòa án nhân dân giải quyết. \n- Tranh chấp mà đương sự không có Giấy chứng nhận: \n  + Lựa chọn 1: Yêu cầu UBND cấp có thẩm quyền giải quyết (Huyện hoặc Tỉnh). \n  + Lựa chọn 2: Khởi kiện tại Tòa án nhân dân. \n\n3. Hiệu lực: \nQuyết định giải quyết tranh chấp có hiệu lực pháp luật phải được các bên nghiêm túc chấp hành.",
  "Hòa giải là bước đệm quan trọng để giữ gìn tình làng nghĩa xóm trước khi đưa nhau ra tòa.",
  "Xử lý 'drama' đất đai: Đầu tiên là ngồi lại nói chuyện, không được thì ra xã nhờ hòa giải. Nếu vẫn 'căng' mà đã có sổ thì cứ ra Tòa. Chưa có sổ thì có thể chọn ra Tòa hoặc nhờ UBND huyện/tỉnh phân xử. Văn minh, đúng luật, không dùng 'vũ lực' nhé!",
  [
    { question: "Thời hạn hòa giải tranh chấp đất đai tại UBND cấp xã là bao nhiêu ngày?", options: ["15 ngày", "30 ngày", "45 ngày", "60 ngày"], answer: "30 ngày", type: "theory" },
    { question: "Hai nhà hàng xóm tranh chấp ranh giới, cả hai đều đã có Sổ đỏ. Cơ quan nào có thẩm quyền giải quyết cuối cùng?", options: ["UBND xã", "UBND huyện", "Tòa án nhân dân", "Cơ quan công an"], answer: "Tòa án nhân dân", type: "practical" }
  ]
);

addLesson(
  "Bản đồ địa chính vs Bản đồ hiện trạng (TT25)",
  "Thông tư 25/2014",
  "Điều 3",
  "Phân biệt hai loại bản đồ quan trọng trong quản lý đất đai: \n\n1. Bản đồ địa chính: \n- Là bản đồ thể hiện các thửa đất và các yếu tố địa lý có liên quan. \n- Được lập theo đơn vị hành chính cấp xã, mảnh bản đồ địa chính. \n- Có giá trị pháp lý lâu dài, là cơ sở để cấp Giấy chứng nhận. \n\n2. Bản đồ hiện trạng sử dụng đất: \n- Thể hiện sự phân bố các loại đất tại một thời điểm nhất định. \n- Được lập theo đơn vị hành chính xã, huyện, tỉnh, vùng và cả nước. \n- Phục vụ mục đích thống kê, kiểm kê đất đai định kỳ (5 năm/lần). \n\n3. Điểm khác biệt chính: \n- Bản đồ địa chính tập trung vào ranh giới thửa đất và chủ sở hữu. \n- Bản đồ hiện trạng tập trung vào mục đích sử dụng đất thực tế trên diện rộng.",
  "Hiểu đúng loại bản đồ giúp bạn tra cứu thông tin chính xác cho từng mục đích cụ thể.",
  "Phân biệt Map: Bản đồ địa chính là 'Sổ hộ khẩu' của từng miếng đất, cực kỳ chi tiết. Bản đồ hiện trạng là 'Ảnh chụp từ trên cao' để xem khu nào là lúa, khu nào là phố, dùng để quy hoạch tầm vĩ mô.",
  [
    { question: "Loại bản đồ nào là cơ sở pháp lý để xác định ranh giới thửa đất và cấp Sổ đỏ?", options: ["Bản đồ hiện trạng sử dụng đất", "Bản đồ địa chính", "Bản đồ quy hoạch", "Bản đồ giao thông"], answer: "Bản đồ địa chính", type: "theory" },
    { question: "Cơ quan nhà nước muốn thống kê xem trong 5 năm qua diện tích đất rừng thay đổi thế nào. Họ sẽ dùng bản đồ nào?", options: ["Bản đồ địa chính", "Bản đồ hiện trạng sử dụng đất", "Bản đồ phân lô", "Bản đồ địa hình"], answer: "Bản đồ hiện trạng sử dụng đất", type: "practical" }
  ]
);

addLesson(
  "Hồ sơ địa chính (TT24/2014)",
  "Thông tư 24/2014",
  "Điều 4",
  "Hồ sơ địa chính là tập hợp các tài liệu thể hiện thông tin chi tiết về đất đai, bao gồm: \n\n1. Bản đồ địa chính: \nThể hiện vị trí, hình thể, diện tích thửa đất. \n\n2. Sổ địa chính: \nGhi nhận thông tin về người sử dụng đất, quyền sử dụng đất, các biến động (chuyển nhượng, thế chấp...). \n\n3. Bản lưu Giấy chứng nhận: \nBản sao hoặc tệp quét của các Sổ đỏ đã cấp. \n\n4. Sổ mục kê đất đai: \nLiệt kê các thửa đất theo thứ tự số tờ, số thửa để quản lý tổng quát. \n\n* Hình thức lưu trữ: Hiện nay hồ sơ địa chính được ưu tiên xây dựng và lưu trữ dưới dạng số (CSDL đất đai) để tra cứu nhanh chóng.",
  "Hồ sơ địa chính là 'bộ nhớ' của ngành đất đai, lưu giữ mọi lịch sử của từng tấc đất.",
  "Hồ sơ địa chính: Là 'Profile' đầy đủ của miếng đất. Gồm có: Ảnh (Bản đồ), Thông tin cá nhân (Sổ địa chính), CMND (Sổ đỏ) và Danh sách tổng (Sổ mục kê). Giờ tất cả đều được 'số hóa' để anh em check var nhanh như chớp!",
  [
    { question: "Tài liệu nào trong hồ sơ địa chính ghi nhận chi tiết các biến động như thế chấp, chuyển nhượng?", options: ["Bản đồ địa chính", "Sổ địa chính", "Sổ mục kê", "Bản đồ hiện trạng"], answer: "Sổ địa chính", type: "theory" },
    { question: "Bạn muốn biết thửa đất số 50, tờ bản đồ số 10 đang do ai đứng tên và có đang thế chấp ngân hàng không. Bạn cần tra cứu tài liệu nào?", options: ["Sổ mục kê", "Sổ địa chính", "Bản đồ quy hoạch", "Thông báo thuế"], answer: "Sổ địa chính", type: "practical" }
  ]
);

addLesson(
  "Hạn mức giao đất nông nghiệp (Luật 2024)",
  "Luật Đất đai 2024",
  "Điều 176",
  "Quy định về hạn mức giao đất nông nghiệp cho cá nhân: \n\n1. Đất trồng cây hàng năm, đất nuôi trồng thủy sản, đất làm muối: \n- Không quá 03 ha cho mỗi loại đất đối với tỉnh, thành phố trực thuộc trung ương thuộc khu vực Đông Nam Bộ và khu vực đồng bằng sông Cửu Long. \n- Không quá 02 ha cho mỗi loại đất đối với tỉnh, thành phố trực thuộc trung ương khác. \n\n2. Đất trồng cây lâu năm: \n- Không quá 10 ha đối với xã, phường, thị trấn ở đồng bằng. \n- Không quá 30 ha đối với xã, phường, thị trấn ở trung du, miền núi. \n\n3. Đất rừng phòng hộ, đất rừng sản xuất: \n- Không quá 30 ha đối với mỗi loại đất. \n\n* Lưu ý: Trường hợp cá nhân được giao nhiều loại đất thì tổng hạn mức không quá 05 ha (không tính đất rừng).",
  "Hạn mức này nhằm đảm bảo quỹ đất được phân chia công bằng và tránh tích tụ đất đai quá mức ở một số ít cá nhân.",
  "Hạn mức đất nông nghiệp: Nhà nước không 'phát' đất vô hạn đâu nhé. Mỗi người chỉ được nhận vài ha tùy khu vực để làm ăn. Muốn làm 'đại điền chủ' thì phải đi thuê hoặc nhận chuyển nhượng thêm, nhưng cũng có trần đấy!",
  [
    { question: "Hạn mức giao đất trồng cây hàng năm cho cá nhân tại khu vực Đồng bằng sông Cửu Long là bao nhiêu?", options: ["2 ha", "3 ha", "5 ha", "10 ha"], answer: "3 ha", type: "theory" },
    { question: "Anh Ba ở miền núi muốn xin Nhà nước giao đất để trồng rừng sản xuất. Hạn mức tối đa anh có thể được giao là bao nhiêu?", options: ["10 ha", "20 ha", "30 ha", "50 ha"], answer: "30 ha", type: "practical" }
  ]
);

addLesson(
  "Thời hạn sử dụng đất (Luật 2024)",
  "Luật Đất đai 2024",
  "Điều 171 - Điều 172",
  "Phân biệt đất sử dụng ổn định lâu dài và đất có thời hạn: \n\n1. Đất sử dụng ổn định lâu dài (Điều 171): \n- Đất ở (thổ cư). \n- Đất rừng phòng hộ, đất rừng đặc dụng, đất rừng sản xuất do tổ chức quản lý. \n- Đất thương mại, dịch vụ, đất cơ sở sản xuất phi nông nghiệp của cá nhân đang sử dụng ổn định mà không phải là đất được Nhà nước giao có thời hạn, cho thuê. \n\n2. Đất sử dụng có thời hạn (Điều 172): \n- Đất nông nghiệp giao cho cá nhân trực tiếp sản xuất: 50 năm (khi hết hạn được tiếp tục sử dụng mà không phải làm thủ tục gia hạn). \n- Đất cho thuê để thực hiện dự án đầu tư: Thường không quá 50 năm (trường hợp đặc biệt không quá 70 năm). \n- Đất xây dựng công trình sự nghiệp của tổ chức tự chủ tài chính: Không quá 50 năm.",
  "Việc nắm rõ thời hạn giúp bạn chủ động trong kế hoạch đầu tư và thực hiện các thủ tục gia hạn cần thiết.",
  "Đất có 'Hạn sử dụng' không? Đất ở thì 'vĩnh viễn' nhé. Đất nông nghiệp thường là 50 năm, nhưng tin vui là hết hạn cứ thế dùng tiếp, không cần chạy vạy xin xỏ gia hạn cực khổ như trước!",
  [
    { question: "Loại đất nào sau đây được sử dụng ổn định lâu dài?", options: ["Đất trồng lúa", "Đất ở (thổ cư)", "Đất thương mại dịch vụ 50 năm", "Đất khu công nghiệp"], answer: "Đất ở (thổ cư)", type: "theory" },
    { question: "Sổ đỏ đất trồng cây lâu năm của bạn ghi thời hạn đến năm 2025. Theo Luật 2024, bạn có phải làm đơn xin gia hạn không?", options: ["Có, phải làm trước 6 tháng", "Không, được tiếp tục sử dụng theo thời hạn quy định", "Có, và phải nộp thêm tiền sử dụng đất", "Không, nhưng phải đổi sổ mới"], answer: "Không, được tiếp tục sử dụng theo thời hạn quy định", type: "practical" }
  ]
);

addLesson(
  "Điều kiện tách thửa, hợp thửa (Luật 2024)",
  "Luật Đất đai 2024",
  "Điều 220",
  "Các nguyên tắc và điều kiện để tách một thửa đất thành nhiều thửa hoặc gộp nhiều thửa thành một: \n\n1. Điều kiện chung: \n- Thửa đất đã được cấp Giấy chứng nhận (Sổ đỏ/Sổ hồng). \n- Đất không có tranh chấp, không bị kê biên, còn thời hạn sử dụng. \n\n2. Điều kiện về diện tích, kích thước: \n- Phải đảm bảo diện tích tối thiểu và kích thước cạnh tối thiểu theo quy định của UBND cấp tỉnh. \n- Phải có lối đi hoặc kết nối với đường giao thông công cộng. \n\n3. Trường hợp hợp thửa: \n- Các thửa đất phải liền kề nhau. \n- Phải có cùng mục đích sử dụng đất (nếu khác mục đích phải làm thủ tục chuyển mục đích trước). \n\n4. Lưu ý: Không được tách thửa nếu thuộc khu vực đã có thông báo thu hồi đất hoặc quy hoạch chi tiết xây dựng tỷ lệ 1/500 đã được phê duyệt.",
  "Tách thửa là nhu cầu phổ biến khi chia tài sản hoặc chuyển nhượng một phần, nhưng phải tuân thủ nghiêm ngặt quy hoạch của địa phương.",
  "Chia đất (Tách thửa): Không phải cứ muốn chia là chia đâu. Phải có Sổ đỏ, không tranh chấp và quan trọng nhất là diện tích sau khi chia không được 'tí hon' quá mức quy định của tỉnh. Và nhớ là phải có đường đi vào nhé!",
  [
    { question: "Điều kiện nào là bắt buộc khi muốn hợp hai thửa đất lại thành một?", options: ["Hai thửa đất phải cùng chủ sở hữu", "Hai thửa đất phải liền kề nhau", "Hai thửa đất phải có diện tích bằng nhau", "Hai thửa đất phải nằm ở hai xã khác nhau"], answer: "Hai thửa đất phải liền kề nhau", type: "theory" },
    { question: "Bạn có mảnh đất 100m2 ở phố, muốn tách làm đôi cho 2 con. Quy định của tỉnh là diện tích tối thiểu để tách thửa là 60m2. Bạn có tách được không?", options: ["Được, vì là đất của mình", "Không, vì diện tích sau khi tách (50m2) nhỏ hơn mức tối thiểu (60m2)", "Được, nếu nộp thêm phí", "Được, nếu các con đồng ý"], answer: "Không, vì diện tích sau khi tách (50m2) nhỏ hơn mức tối thiểu (60m2)", type: "practical" }
  ]
);

addLesson(
  "8 Quyền cơ bản của người sử dụng đất (Luật 2024)",
  "Luật Đất đai 2024",
  "Điều 37",
  "Cá nhân sử dụng đất có 08 quyền chung rất quan trọng: \n\n1. Quyền chuyển đổi: Đổi đất nông nghiệp trong cùng xã với cá nhân khác. \n2. Quyền chuyển nhượng: Bán quyền sử dụng đất cho người khác. \n3. Quyền cho thuê/cho thuê lại: Cho người khác thuê đất trong thời hạn mình được sử dụng. \n4. Quyền thừa kế: Để lại đất cho người thừa kế theo di chúc hoặc pháp luật. \n5. Quyền tặng cho: Tặng đất cho Nhà nước, cộng đồng hoặc cá nhân. \n6. Quyền thế chấp: Dùng quyền sử dụng đất để vay vốn tại các tổ chức tín dụng. \n7. Quyền góp vốn: Dùng quyền sử dụng đất để góp vốn kinh doanh. \n8. Quyền trả lại đất: Tự nguyện trả lại đất cho Nhà nước nếu không còn nhu cầu sử dụng.",
  "Việc hiểu rõ các quyền này giúp bạn bảo vệ lợi ích hợp pháp và khai thác tối đa giá trị từ mảnh đất của mình.",
  "8 Quyền 'quyền lực': Bạn có quyền Bán, Cho thuê, Cầm cố (thế chấp), Tặng, Đổi, Để lại cho con cháu, Góp vốn làm ăn hoặc Trả lại nếu chán. Nói chung là 'full option' như chủ sở hữu thực thụ!",
  [
    { question: "Người sử dụng đất có quyền nào sau đây để vay vốn ngân hàng?", options: ["Quyền chuyển đổi", "Quyền thế chấp", "Quyền tặng cho", "Quyền trả lại đất"], answer: "Quyền thế chấp", type: "theory" },
    { question: "Bạn muốn góp vốn bằng quyền sử dụng đất vào công ty của bạn thân. Luật Đất đai có cho phép không?", options: ["Có, đây là quyền góp vốn", "Không, chỉ được góp bằng tiền mặt", "Có, nhưng phải xin phép UBND tỉnh", "Không, đất đai thuộc sở hữu toàn dân"], answer: "Có, đây là quyền góp vốn", type: "practical" }
  ]
);

addLesson(
  "Đăng ký đất đai lần đầu (Luật 2024)",
  "Luật Đất đai 2024",
  "Điều 131",
  "Quy trình đăng ký đất đai lần đầu đối với đất đang sử dụng mà chưa đăng ký: \n\n1. Đối tượng: \nCá nhân đang sử dụng đất mà chưa được cấp Giấy chứng nhận. \n\n2. Hồ sơ: \n- Đơn đăng ký theo mẫu. \n- Một trong các loại giấy tờ về quyền sử dụng đất quy định tại Điều 137 (nếu có). \n- Chứng từ thực hiện nghĩa vụ tài chính (nếu có). \n\n3. Trình tự: \n- Nộp hồ sơ tại bộ phận một cửa hoặc Văn phòng đăng ký đất đai. \n- Cơ quan chức năng kiểm tra hiện trạng, xác nhận nguồn gốc, tình trạng tranh chấp. \n- Công khai kết quả kiểm tra. \n- Cấp Giấy chứng nhận nếu đủ điều kiện.",
  "Đăng ký đất đai là nghĩa vụ của người sử dụng đất để được Nhà nước bảo hộ quyền lợi.",
  "Làm Sổ đỏ lần đầu: Nếu đất nhà bạn chưa có sổ, hãy gom hết giấy tờ cũ (từ thời ông bà cũng được) rồi ra phường/xã làm đơn. Cán bộ sẽ xuống đo đạc, xác minh xem có tranh chấp với hàng xóm không rồi mới cấp sổ nhé!",
  [
    { question: "Việc đăng ký đất đai lần đầu là?", options: ["Quyền của người dân", "Nghĩa vụ của người dân", "Sở thích của người dân", "Không bắt buộc"], answer: "Nghĩa vụ của người dân", type: "theory" },
    { question: "Gia đình bạn sử dụng đất từ năm 1990 nhưng không có giấy tờ gì. Theo Luật 2024, bạn có được đăng ký cấp Sổ đỏ không?", options: ["Không bao giờ", "Được, nếu đất không tranh chấp và phù hợp quy hoạch", "Được, nhưng phải nộp phạt rất nặng", "Chỉ được cấp nếu có hộ khẩu tại đó"], answer: "Được, nếu đất không tranh chấp và phù hợp quy hoạch", type: "practical" }
  ]
);

addLesson(
  "Nguyên tắc bồi thường khi thu hồi đất (Luật 2024)",
  "Luật Đất đai 2024",
  "Điều 91",
  "Các nguyên tắc cốt lõi khi Nhà nước bồi thường cho người dân bị thu hồi đất: \n\n1. Kịp thời, công bằng, công khai: \nViệc bồi thường phải được thực hiện trước khi thu hồi đất (trừ trường hợp khẩn cấp). \n\n2. Đa dạng hình thức bồi thường: \n- Bồi thường bằng đất có cùng mục đích sử dụng. \n- Bồi thường bằng tiền theo giá đất cụ thể. \n- Bồi thường bằng đất khác mục đích sử dụng hoặc bằng nhà ở. \n\n3. Đảm bảo đời sống: \nNgười có đất bị thu hồi phải có chỗ ở, đảm bảo thu nhập và điều kiện sống bằng hoặc tốt hơn nơi ở cũ. \n\n4. Ưu tiên tái định cư tại chỗ: \nNếu khu vực thu hồi có dự án nhà ở, người dân được ưu tiên tái định cư tại chỗ nếu đủ điều kiện.",
  "Luật 2024 nhấn mạnh việc đảm bảo quyền lợi thực tế và đời sống ổn định cho người dân sau khi bàn giao đất.",
  "Đền bù khi mất đất: Không chỉ là tiền đâu nhé! Bạn có thể được đổi miếng đất khác, hoặc nhận nhà chung cư. Quan trọng nhất là Nhà nước hứa chỗ ở mới phải 'ngon' bằng hoặc hơn chỗ cũ thì mới được thu hồi!",
  [
    { question: "Việc bồi thường khi thu hồi đất phải được thực hiện khi nào?", options: ["Sau khi thu hồi 1 năm", "Trước khi thu hồi đất", "Khi nào dự án có lãi", "Tùy thỏa thuận"], answer: "Trước khi thu hồi đất", type: "theory" },
    { question: "Nhà bạn bị thu hồi để làm đường. Bạn muốn được tái định cư ngay tại khu vực đó vì đã quen buôn bán. Luật 2024 có hỗ trợ không?", options: ["Không, phải đi khu tái định cư tập trung", "Có, ưu tiên tái định cư tại chỗ nếu khu vực đó có dự án nhà ở", "Chỉ hỗ trợ bằng tiền", "Phải bốc thăm may rủi"], answer: "Có, ưu tiên tái định cư tại chỗ nếu khu vực đó có dự án nhà ở", type: "practical" }
  ]
);

addLesson(
  "Chính sách đất đai cho dân tộc thiểu số (Luật 2024)",
  "Luật Đất đai 2024",
  "Điều 16",
  "Luật 2024 có những chính sách đặc thù để bảo đảm đất ở, đất sản xuất cho đồng bào dân tộc thiểu số: \n\n1. Trách nhiệm của Nhà nước: \nCó chính sách bảo đảm đất sinh hoạt cộng đồng; giao đất, cho thuê đất cho cá nhân là người dân tộc thiểu số thuộc diện hộ nghèo, hộ cận nghèo tại vùng đồng bào dân tộc thiểu số và miền núi. \n\n2. Hỗ trợ lần đầu: \n- Giao đất ở trong hạn mức và được miễn, giảm tiền sử dụng đất. \n- Cho phép chuyển mục đích sử dụng đất sang đất ở trong hạn mức và được miễn, giảm tiền sử dụng đất. \n- Giao đất nông nghiệp trong hạn mức không thu tiền sử dụng đất. \n\n3. Hỗ trợ lần thứ hai: \nÁp dụng đối với người đã được hỗ trợ nhưng nay không còn đất hoặc thiếu đất vì lý do khách quan (thiên tai, sạt lở...). \n\n4. Quản lý nghiêm ngặt: \nNgười được giao đất theo chính sách này không được chuyển nhượng, tặng cho, thế chấp... trong thời hạn 10 năm kể từ ngày được giao đất (trừ trường hợp thừa kế hoặc chuyển nhượng cho người cùng dân tộc thiểu số thuộc diện hỗ trợ).",
  "Chính sách này thể hiện tính nhân văn và quyết tâm ổn định đời sống cho đồng bào vùng sâu vùng xa.",
  "Bảo vệ đất cho đồng bào: Nhà nước ưu tiên cấp đất ở, đất ruộng cho anh em dân tộc thiểu số nghèo. Đặc biệt, để tránh bị 'lừa' mất đất, Luật quy định trong 10 năm đầu không được bán hay cầm cố cho người ngoài đâu nhé!",
  [
    { question: "Đối tượng nào được hưởng chính sách hỗ trợ đất đai cho dân tộc thiểu số?", options: ["Tất cả người dân tộc thiểu số", "Người dân tộc thiểu số thuộc diện hộ nghèo, hộ cận nghèo tại vùng miền núi", "Người dân tộc thiểu số có thu nhập cao", "Người dân tộc thiểu số sống ở thành phố"], answer: "Người dân tộc thiểu số thuộc diện hộ nghèo, hộ cận nghèo tại vùng miền núi", type: "theory" },
    { question: "Gia đình anh Y-Blô được Nhà nước giao đất ở theo diện hỗ trợ năm 2025. Đến năm 2028, anh muốn bán miếng đất này cho một người kinh ở phố để lấy tiền làm ăn. Anh có được phép không?", options: ["Được, vì là đất của anh", "Không, vì chưa đủ thời hạn 10 năm và không đúng đối tượng nhận chuyển nhượng", "Được, nếu UBND xã đồng ý", "Chỉ được bán một nửa"], answer: "Không, vì chưa đủ thời hạn 10 năm và không đúng đối tượng nhận chuyển nhượng", type: "practical" }
  ]
);

addLesson(
  "Quyền của Tổ chức kinh tế sử dụng đất (Luật 2024)",
  "Luật Đất đai 2024",
  "Điều 33",
  "Tổ chức kinh tế được Nhà nước giao đất có thu tiền sử dụng đất hoặc cho thuê đất trả tiền một lần có các quyền: \n\n1. Quyền chung: \nĐược hưởng các quyền như cá nhân (chuyển nhượng, cho thuê, thừa kế, tặng cho, thế chấp, góp vốn). \n\n2. Quyền đối với tài sản gắn liền với đất: \nĐược sở hữu, bán, cho thuê, thế chấp tài sản do mình đầu tư xây dựng trên đất. \n\n3. Trường hợp thuê đất trả tiền hàng năm: \n- Không được chuyển nhượng, thế chấp quyền sử dụng đất. \n- Chỉ được bán hoặc thế chấp tài sản thuộc sở hữu của mình gắn liền với đất và quyền thuê trong hợp đồng thuê đất. \n\n4. Nghĩa vụ: \nSử dụng đất đúng mục đích dự án, thực hiện đầy đủ nghĩa vụ tài chính và bảo vệ môi trường.",
  "Quy định rõ ràng giúp doanh nghiệp chủ động trong việc huy động vốn và thực hiện các dự án đầu tư.",
  "Doanh nghiệp dùng đất: Nếu trả tiền một lần thì quyền 'to' như cá nhân, muốn bán hay cắm ngân hàng đều được. Nếu trả tiền hàng năm thì chỉ được bán cái nhà/xưởng trên đất thôi, còn quyền dùng đất thì phải theo hợp đồng thuê với Nhà nước.",
  [
    { question: "Tổ chức kinh tế thuê đất trả tiền hàng năm có quyền nào sau đây?", options: ["Thế chấp quyền sử dụng đất", "Bán tài sản gắn liền với đất và quyền thuê trong hợp đồng", "Tặng cho quyền sử dụng đất cho cá nhân", "Chuyển đổi quyền sử dụng đất"], answer: "Bán tài sản gắn liền với đất và quyền thuê trong hợp đồng", type: "theory" },
    { question: "Công ty X thuê đất 50 năm, trả tiền thuê đất một lần cho cả thời gian thuê. Họ có được dùng miếng đất này để thế chấp vay vốn ngân hàng không?", options: ["Có, vì đã trả tiền một lần", "Không, chỉ được thế chấp tài sản trên đất", "Chỉ được thế chấp nếu có sự đồng ý của Bộ Tài nguyên", "Không, tổ chức không có quyền thế chấp"], answer: "Có, vì đã trả tiền một lần", type: "practical" }
  ]
);

addLesson(
  "Quy hoạch và Kế hoạch sử dụng đất (Luật 2024)",
  "Luật Đất đai 2024",
  "Điều 60 - Điều 76",
  "Hệ thống quy hoạch, kế hoạch sử dụng đất đảm bảo tính thống nhất và tầm nhìn dài hạn: \n\n1. Các cấp quy hoạch: \n- Quy hoạch sử dụng đất quốc gia. \n- Quy hoạch sử dụng đất cấp tỉnh. \n- Quy hoạch sử dụng đất cấp huyện. \n- Quy hoạch sử dụng đất quốc phòng; Quy hoạch sử dụng đất an ninh. \n\n2. Thời kỳ quy hoạch: \nQuy hoạch sử dụng đất là 10 năm. Tầm nhìn của quy hoạch cấp quốc gia là từ 30 năm đến 50 năm, cấp tỉnh và cấp huyện là từ 20 năm đến 30 năm. \n\n3. Kế hoạch sử dụng đất hàng năm cấp huyện: \nLà căn cứ trực tiếp để Nhà nước thu hồi đất, giao đất, cho thuê đất, cho phép chuyển mục đích sử dụng đất. \n\n4. Công bố công khai: \nQuy hoạch, kế hoạch sử dụng đất sau khi được phê duyệt phải được công bố công khai tại trụ sở cơ quan nhà nước và trên cổng thông tin điện tử.",
  "Việc công khai quy hoạch giúp người dân tránh mua phải đất 'dính' quy hoạch treo và bảo vệ quyền lợi chính đáng.",
  "Check quy hoạch: Quy hoạch là 'bản đồ tương lai' 10 năm của đất đai. Muốn biết miếng đất mình định mua có bị làm đường hay công viên không thì phải check 'Kế hoạch sử dụng đất hàng năm' của huyện. Mọi thứ phải được công khai trên mạng cho dân xem nhé!",
  [
    { question: "Thời kỳ quy hoạch sử dụng đất ở các cấp là bao nhiêu năm?", options: ["5 năm", "10 năm", "15 năm", "20 năm"], answer: "10 năm", type: "theory" },
    { question: "Bạn định mua một miếng đất nhưng nghe đồn khu đó sắp làm khu công nghiệp. Bạn nên tra cứu tài liệu nào để có thông tin chính xác nhất?", options: ["Sổ địa chính", "Quy hoạch sử dụng đất cấp huyện và Kế hoạch sử dụng đất hàng năm", "Bản đồ địa hình", "Sổ mục kê"], answer: "Quy hoạch sử dụng đất cấp huyện và Kế hoạch sử dụng đất hàng năm", type: "practical" }
  ]
);

addLesson(
  "Thu hồi đất vì Quốc phòng, An ninh (Luật 2024)",
  "Luật Đất đai 2024",
  "Điều 78",
  "Nhà nước thu hồi đất trong các trường hợp thật cần thiết để thực hiện nhiệm vụ quốc phòng, an ninh: \n\n1. Các trường hợp cụ thể: \n- Làm nơi đóng quân, trụ sở làm việc. \n- Làm căn cứ quân sự, cảng quân sự, sân bay quân sự. \n- Làm công trình phòng thủ quốc gia, trận địa, công trình đặc biệt. \n- Làm ga, cảng quân sự; làm kho tàng của lực lượng vũ trang. \n- Làm trường bắn, thao trường, bãi thử vũ khí. \n- Làm cơ sở đào tạo, trung tâm huấn luyện, bệnh viện của lực lượng vũ trang. \n\n2. Thẩm quyền: \nUBND cấp tỉnh quyết định thu hồi đất. \n\n3. Quyền lợi người dân: \nĐược bồi thường, hỗ trợ, tái định cư theo quy định chung của pháp luật.",
  "Việc thu hồi đất cho mục đích này là bắt buộc để bảo vệ chủ quyền và an ninh quốc gia.",
  "Thu hồi đất làm căn cứ quân sự: Nếu đất nhà bạn nằm trong khu vực cần làm sân bay quân sự hay doanh trại thì Nhà nước sẽ thu hồi. Yên tâm là vẫn được đền bù thỏa đáng theo luật nhé!",
  [
    { question: "Cơ quan nào có thẩm quyền quyết định thu hồi đất vì mục đích quốc phòng, an ninh?", options: ["Bộ Quốc phòng", "UBND cấp tỉnh", "UBND cấp huyện", "Chính phủ"], answer: "UBND cấp tỉnh", type: "theory" },
    { question: "Nhà nước muốn thu hồi đất để làm trường bắn cho bộ đội tập luyện. Đây là trường hợp thu hồi đất vì mục đích gì?", options: ["Phát triển kinh tế", "Lợi ích công cộng", "Quốc phòng, an ninh", "An sinh xã hội"], answer: "Quốc phòng, an ninh", type: "practical" }
  ]
);

addLesson(
  "Thu hồi đất phát triển Kinh tế - Xã hội (Luật 2024)",
  "Luật Đất đai 2024",
  "Điều 79",
  "Luật 2024 quy định cụ thể 31 trường hợp thu hồi đất để phát triển kinh tế - xã hội vì lợi ích quốc gia, công cộng: \n\n1. Các dự án trọng điểm: \nXây dựng công trình giao thông, thủy lợi, năng lượng, bưu chính viễn thông. \n\n2. Dự án an sinh: \nXây dựng cơ sở y tế, giáo dục, văn hóa, thể thao, khoa học công nghệ, chợ, nhà ở xã hội. \n\n3. Dự án khu công nghiệp, khu công nghệ cao: \nThu hồi đất để thực hiện dự án khu công nghiệp, cụm công nghiệp, khu chế xuất. \n\n4. Dự án nhà ở thương mại: \nChỉ thu hồi đất đối với dự án nhà ở thương mại, dự án hỗn hợp nhà ở và kinh doanh thương mại, dịch vụ khi là dự án đầu tư xây dựng khu đô thị. \n\n5. Nguyên tắc: \nPhải đảm bảo tính công khai, minh bạch và có phương án bồi thường được phê duyệt trước khi thu hồi.",
  "Quy định chi tiết 31 trường hợp giúp hạn chế việc thu hồi đất tràn lan, bảo vệ quyền lợi người dân.",
  "31 trường hợp thu hồi đất: Luật mới liệt kê rõ 31 'gạch đầu dòng' Nhà nước được phép lấy đất để làm dự án (như đường xá, trường học, khu đô thị...). Nếu dự án không nằm trong danh sách này thì Nhà nước không được thu hồi đâu, chủ đầu tư phải tự thỏa thuận với dân!",
  [
    { question: "Dự án nào sau đây thuộc trường hợp Nhà nước thu hồi đất theo Điều 79?", options: ["Xây dựng khách sạn tư nhân", "Xây dựng nhà ở xã hội", "Xây dựng nhà hàng", "Xây dựng văn phòng cho thuê của cá nhân"], answer: "Xây dựng nhà ở xã hội", type: "theory" },
    { question: "Một công ty muốn lấy đất của dân để làm khu du lịch nghỉ dưỡng cao cấp. Dự án này không thuộc 31 trường hợp tại Điều 79. Công ty phải làm gì?", options: ["Yêu cầu Nhà nước thu hồi hộ", "Tự thỏa thuận nhận chuyển nhượng hoặc thuê quyền sử dụng đất của dân", "Cưỡng chế dân bàn giao đất", "Xin phép Quốc hội thu hồi"], answer: "Tự thỏa thuận nhận chuyển nhượng hoặc thuê quyền sử dụng đất của dân", type: "practical" }
  ]
);

addLesson(
  "Cấp Sổ đỏ cho đất không giấy tờ (Luật 2024)",
  "Luật Đất đai 2024",
  "Điều 138",
  "Mở rộng cơ hội cấp Giấy chứng nhận cho hộ gia đình, cá nhân đang sử dụng đất không có giấy tờ trước ngày 01/7/2014: \n\n1. Nhóm 1: Sử dụng đất trước ngày 15/10/1993. \n2. Nhóm 2: Sử dụng đất từ ngày 15/10/1993 đến trước ngày 01/7/2004. \n3. Nhóm 3: Sử dụng đất từ ngày 01/7/2004 đến trước ngày 01/7/2014. \n\nĐiều kiện chung: \n- Được UBND cấp xã xác nhận là đất không có tranh chấp. \n- Phù hợp với quy hoạch sử dụng đất. \n- Không vi phạm pháp luật về đất đai (hoặc đã xử lý vi phạm). \n\nNghĩa vụ tài chính: \nNgười sử dụng đất phải nộp tiền sử dụng đất theo quy định của Chính phủ (có các mức miễn, giảm tùy thời điểm sử dụng).",
  "Đây là quy định mang tính đột phá, giúp giải quyết tồn đọng và hợp pháp hóa quyền sử dụng đất cho hàng triệu hộ dân.",
  "Tin vui cho đất không giấy tờ: Nếu nhà bạn dùng đất từ lâu (trước 2014) mà chưa có sổ, giờ có cơ hội cực lớn để làm Sổ đỏ. Chỉ cần xã xác nhận không tranh chấp và đúng quy hoạch là ok. Thời điểm dùng đất càng lâu thì tiền nộp càng rẻ!",
  [
    { question: "Luật 2024 cho phép cấp Sổ đỏ cho đất không giấy tờ sử dụng đến trước thời điểm nào?", options: ["01/7/2004", "01/7/2014", "01/7/2024", "15/10/1993"], answer: "01/7/2014", type: "theory" },
    { question: "Gia đình ông B sử dụng đất từ năm 2000, không có giấy tờ. Năm 2025 ông đi làm Sổ đỏ. Điều kiện quan trọng nhất để ông được cấp sổ là gì?", options: ["Phải có hộ khẩu tại đó", "Đất không tranh chấp và phù hợp quy hoạch", "Phải có biên lai nộp thuế từ năm 2000", "Phải có con làm cán bộ địa chính"], answer: "Đất không tranh chấp và phù hợp quy hoạch", type: "practical" }
  ]
);

addLesson(
  "Sử dụng đất đa mục đích (Luật 2024)",
  "Luật Đất đai 2024",
  "Điều 218",
  "Luật 2024 cho phép người sử dụng đất kết hợp mục đích sử dụng chính với các mục đích phụ để tăng hiệu quả: \n\n1. Các trường hợp áp dụng: \n- Đất nông nghiệp kết hợp với thương mại, dịch vụ, chăn nuôi, trồng cây dược liệu. \n- Đất ở kết hợp với thương mại, dịch vụ, công trình sự nghiệp. \n- Đất có mặt nước kết hợp đa mục đích. \n\n2. Điều kiện: \n- Không làm thay đổi mục đích sử dụng đất chính. \n- Không làm ảnh hưởng đến quốc phòng, an ninh. \n- Phải đăng ký sử dụng đất đa mục đích với cơ quan nhà nước có thẩm quyền. \n\n3. Lợi ích: \nTạo điều kiện cho người dân đa dạng hóa nguồn thu nhập trên cùng một diện tích đất mà không cần làm thủ tục chuyển mục đích sử dụng đất phức tạp.",
  "Quy định này mở ra cơ hội lớn cho mô hình du lịch nông nghiệp và kinh tế hộ gia đình.",
  "Đất 'đa nhiệm': Giờ bạn có thể vừa trồng lúa vừa làm homestay, hoặc vừa ở vừa mở shop mà không cần làm thủ tục chuyển đổi phức tạp. Chỉ cần đăng ký 'nhẹ' với chính quyền là xong!",
  [
    { question: "Việc sử dụng đất đa mục đích có yêu cầu gì về mục đích chính?", options: ["Phải thay đổi mục đích chính", "Không làm thay đổi mục đích chính", "Bỏ qua mục đích chính", "Tùy ý người sử dụng"], answer: "Không làm thay đổi mục đích chính", type: "theory" },
    { question: "Bạn có mảnh vườn trồng cây ăn trái và muốn mở thêm quán cafe nhỏ để đón khách du lịch. Theo Luật 2024, bạn cần làm gì?", options: ["Phải chuyển toàn bộ sang đất kinh doanh", "Chỉ cần đăng ký sử dụng đất đa mục đích", "Không cần làm gì cả", "Phải xin phép Thủ tướng"], answer: "Chỉ cần đăng ký sử dụng đất đa mục đích", type: "practical" }
  ]
);

addLesson(
  "Chuyển mục đích sử dụng đất (Luật 2024)",
  "Luật Đất đai 2024",
  "Điều 121",
  "Các trường hợp chuyển mục đích sử dụng đất phải được cơ quan nhà nước có thẩm quyền cho phép: \n\n1. Các trường hợp phổ biến: \n- Chuyển đất trồng lúa, đất rừng sang loại đất khác. \n- Chuyển đất nông nghiệp sang đất phi nông nghiệp (thổ cư, sản xuất kinh doanh). \n- Chuyển đất phi nông nghiệp không thu tiền sang đất phi nông nghiệp có thu tiền hoặc thuê đất. \n- Chuyển đất phi nông nghiệp không phải là đất ở sang đất ở. \n\n2. Căn cứ cho phép: \n- Quy hoạch sử dụng đất cấp huyện hoặc kế hoạch sử dụng đất hàng năm. \n- Nhu cầu sử dụng đất thể hiện trong đơn xin chuyển mục đích. \n\n3. Nghĩa vụ tài chính: \nNgười sử dụng đất phải nộp tiền sử dụng đất hoặc tiền thuê đất theo chênh lệch giữa giá đất của loại đất mới và loại đất cũ.",
  "Hiểu rõ quy định giúp bạn thực hiện đúng trình tự và chuẩn bị tài chính phù hợp khi muốn 'nâng cấp' giá trị đất.",
  "'Đổi màu' cho đất: Muốn biến vườn thành nhà hay ruộng thành xưởng thì phải xin phép nhé. Luật mới quy định rõ cái nào phải xin, cái nào chỉ cần báo cáo, giúp anh em đỡ rối!",
  [
    { question: "Trường hợp nào sau đây phải xin phép khi chuyển mục đích sử dụng đất?", options: ["Chuyển đất trồng cây hàng năm sang trồng cây lâu năm", "Chuyển đất nông nghiệp sang đất ở", "Chuyển đất ở sang đất trồng hoa", "Chuyển đất rừng sản xuất sang rừng phòng hộ"], answer: "Chuyển đất nông nghiệp sang đất ở", type: "theory" },
    { question: "Anh Nam muốn xây nhà trên mảnh đất trồng lúa của gia đình. Anh cần thực hiện thủ tục gì trước tiên?", options: ["Cứ xây rồi nộp phạt sau", "Xin chuyển mục đích sử dụng đất sang đất ở", "Chỉ cần báo cáo UBND xã", "Mua vật liệu về xây luôn"], answer: "Xin chuyển mục đích sử dụng đất sang đất ở", type: "practical" }
  ]
);

addLesson(
  "Gia hạn sử dụng đất khi hết hạn (Luật 2024)",
  "Luật Đất đai 2024",
  "Điều 172, 175",
  "Quy định về việc tiếp tục sử dụng đất khi hết thời hạn ghi trên Giấy chứng nhận: \n\n1. Đất nông nghiệp của cá nhân: \nKhi hết thời hạn 50 năm, cá nhân trực tiếp sản xuất nông nghiệp được tiếp tục sử dụng đất theo thời hạn quy định mà không phải làm thủ tục gia hạn. \n\n2. Các loại đất khác (Đất dự án, đất thuê): \n- Phải làm thủ tục gia hạn nếu có nhu cầu tiếp tục sử dụng. \n- Thời hạn nộp hồ sơ: Tối thiểu 06 tháng trước khi hết hạn sử dụng đất. \n\n3. Trường hợp không được gia hạn: \n- Không có nhu cầu sử dụng tiếp. \n- Vi phạm pháp luật đất đai mà không khắc phục. \n- Không phù hợp với quy hoạch tại thời điểm gia hạn.",
  "Việc chủ động gia hạn giúp đảm bảo quyền lợi liên tục và tránh rủi ro bị thu hồi đất do hết hạn.",
  "'Renew' hạn dùng đất: Đất nông nghiệp thì 'auto-renew' 50 năm tiếp theo. Còn đất dự án thì phải nhớ 'gia hạn' trước nửa năm kẻo bị Nhà nước lấy lại thì trắng tay đấy!",
  [
    { question: "Cá nhân sử dụng đất nông nghiệp hết hạn có phải làm thủ tục gia hạn không?", options: ["Có, bắt buộc", "Không, được tiếp tục sử dụng", "Phải nộp tiền mua lại", "Tùy từng tỉnh"], answer: "Không, được tiếp tục sử dụng", type: "theory" },
    { question: "Công ty A thuê đất làm nhà xưởng, thời hạn đến tháng 12/2025. Để được tiếp tục sử dụng, công ty phải nộp hồ sơ gia hạn chậm nhất là khi nào?", options: ["Tháng 12/2025", "Tháng 06/2025", "Tháng 01/2026", "Bất cứ lúc nào"], answer: "Tháng 06/2025", type: "practical" }
  ]
);

addLesson(
  "Hệ thống thông tin và CSDL đất đai (Luật 2024)",
  "Luật Đất đai 2024",
  "Điều 163 - Điều 167",
  "Nhà nước xây dựng hệ thống thông tin đất đai quốc gia tập trung, thống nhất và đa mục tiêu: \n\n1. Thành phần CSDL đất đai: \n- CSDL về văn bản quy phạm pháp luật. \n- CSDL địa chính (quan trọng nhất). \n- CSDL quy hoạch, kế hoạch sử dụng đất. \n- CSDL giá đất. \n- CSDL thống kê, kiểm kê đất đai. \n\n2. Quyền tiếp cận thông tin: \nCơ quan, tổ chức, cá nhân được khai thác và sử dụng thông tin trong CSDL đất đai theo quy định. \n\n3. Dịch vụ công trực tuyến: \nĐẩy mạnh việc nộp hồ sơ và trả kết quả thủ tục hành chính về đất đai qua môi trường điện tử.",
  "Chuyển đổi số giúp ngành địa chính minh bạch hơn, giảm thiểu nhũng nhiễu và tiết kiệm thời gian cho người dân.",
  "'Google Maps' phiên bản địa chính: Mọi thông tin về chủ đất, quy hoạch, giá đất sẽ được đưa lên mạng. Anh em chỉ cần ngồi nhà click chuột là check được 'tiểu sử' miếng đất định mua!",
  [
    { question: "CSDL nào là hạt nhân của hệ thống thông tin đất đai?", options: ["CSDL giá đất", "CSDL địa chính", "CSDL thống kê", "CSDL văn bản"], answer: "CSDL địa chính", type: "theory" },
    { question: "Bạn muốn biết thông tin về quy hoạch của một thửa đất ở tỉnh khác mà không muốn đi lại xa. Bạn có thể làm gì?", options: ["Bắt buộc phải đến tận nơi", "Tra cứu qua cổng thông tin điện tử hoặc hệ thống thông tin đất đai", "Hỏi người dân xung quanh", "Không thể tra cứu được"], answer: "Tra cứu qua cổng thông tin điện tử hoặc hệ thống thông tin đất đai", type: "practical" }
  ]
);

addLesson(
  "Quyền của người thuê đất trả tiền hàng năm (Luật 2024)",
  "Luật Đất đai 2024",
  "Điều 34",
  "Điểm mới đột phá của Luật 2024 đối với người thuê đất trả tiền hàng năm: \n\n1. Quyền đối với tài sản: \nĐược bán, cho thuê, thế chấp tài sản thuộc sở hữu của mình gắn liền với đất. \n\n2. Quyền đối với quyền thuê: \nNgười sử dụng đất được bán, thế chấp 'quyền thuê trong hợp đồng thuê đất'. Đây là điểm mới giúp đất thuê hàng năm có giá trị thương mại cao hơn. \n\n3. Điều kiện thực hiện: \n- Đã hoàn thành việc xây dựng công trình theo dự án. \n- Đã đăng ký tài sản gắn liền với đất. \n\n4. Quyền của người mua: \nNgười mua tài sản và quyền thuê sẽ được Nhà nước tiếp tục cho thuê đất theo mục đích đã xác định.",
  "Quy định này giúp tăng tính thanh khoản cho các dự án đầu tư sử dụng hình thức thuê đất trả tiền hàng năm.",
  "Thuê đất vẫn có quyền 'sang tay': Dù bạn thuê đất trả tiền hàng năm, bạn vẫn có quyền bán cái xưởng trên đất và chuyển nhượng luôn cái 'hợp đồng thuê' đó cho người khác. Cực kỳ linh hoạt cho dân kinh doanh!",
  [
    { question: "Luật 2024 cho phép người thuê đất trả tiền hàng năm được thế chấp cái gì?", options: ["Quyền sử dụng đất", "Quyền thuê trong hợp đồng thuê đất và tài sản gắn liền với đất", "Toàn bộ khu đất", "Không được thế chấp gì"], answer: "Quyền thuê trong hợp đồng thuê đất và tài sản gắn liền with đất", type: "theory" },
    { question: "Doanh nghiệp B thuê đất trả tiền hàng năm, đã xây xong nhà xưởng. Nay họ muốn chuyển nhượng dự án cho đối tác. Họ có được bán quyền thuê đất không?", options: ["Không, chỉ được bán nhà xưởng", "Có, được bán cả nhà xưởng và quyền thuê trong hợp đồng", "Phải chuyển sang trả tiền một lần mới được bán", "Chỉ được cho thuê lại"], answer: "Có, được bán cả nhà xưởng và quyền thuê trong hợp đồng", type: "practical" }
  ]
);

addLesson(
  "Phương pháp thặng dư (Deep Dive)",
  "Deep Dive",
  "Định giá đất",
  "Phương pháp thặng dư được dùng để định giá thửa đất có tiềm năng phát triển theo quy hoạch: \n\n1. Công thức cơ bản: \nGiá trị thửa đất = Tổng doanh thu phát triển giả định - Tổng chi phí phát triển giả định. \n\n2. Tổng doanh thu phát triển: \nĐược ước tính trên cơ sở giá bán, giá cho thuê của các sản phẩm bất động sản tương tự trên thị trường sau khi dự án hoàn thành. \n\n3. Tổng chi phí phát triển: \nBao gồm chi phí xây dựng, chi phí thiết kế, chi phí quảng cáo, lãi vay và lợi nhuận định mức của nhà đầu tư. \n\n4. Ý nghĩa: \nGiúp xác định giá trị thực tế của đất dựa trên khả năng sinh lời trong tương lai, thường áp dụng cho các khu đất lớn để làm dự án khu đô thị, trung tâm thương mại.",
  "Đây là phương pháp định giá kỹ thuật cao, đòi hỏi sự am hiểu về thị trường bất động sản và chi phí xây dựng.",
  "Định giá đất 'kiểu startup': Bạn tính xem sau khi xây nhà lên bán được bao nhiêu tiền, trừ đi tiền xây dựng và lợi nhuận kỳ vọng, phần còn lại chính là giá trị miếng đất. Nghe như tính ROI cho dự án vậy!",
  [
    { question: "Phương pháp thặng dư dựa trên nguyên tắc nào?", options: ["So sánh trực tiếp", "Khả năng sinh lời trong tương lai", "Giá thành xây dựng", "Hệ số K của Nhà nước"], answer: "Khả năng sinh lời trong tương lai", type: "theory" },
    { question: "Bạn muốn định giá một khu đất trống 1ha được quy hoạch làm chung cư. Phương pháp nào sau đây là tối ưu nhất?", options: ["Phương pháp so sánh", "Phương pháp thặng dư", "Phương pháp thu nhập", "Phương pháp chiết trừ"], answer: "Phương pháp thặng dư", type: "practical" }
  ]
);

addLesson(
  "Quy trình hòa giải tranh chấp (Deep Dive)",
  "Deep Dive",
  "Tranh chấp",
  "Hòa giải tại UBND cấp xã là thủ tục bắt buộc trước khi khởi kiện đối với tranh chấp ai là người có quyền sử dụng đất: \n\n1. Tiếp nhận đơn: \nUBND xã tiếp nhận đơn yêu cầu giải quyết tranh chấp đất đai. \n\n2. Thẩm tra, xác minh: \nCán bộ địa chính kiểm tra hiện trạng, nguồn gốc đất, thu thập tài liệu từ các bên liên quan. \n\n3. Tổ chức cuộc họp hòa giải: \nThành phần gồm Chủ tịch UBND xã, Hội đồng hòa giải, các bên tranh chấp và người có uy tín trong cộng đồng. \n\n4. Kết quả hòa giải: \n- Hòa giải thành: Lập biên bản, các bên thực hiện theo thỏa thuận. \n- Hòa giải không thành: Lập biên bản, hướng dẫn các bên gửi đơn lên Tòa án hoặc UBND cấp có thẩm quyền.",
  "Việc hòa giải thành giúp tiết kiệm thời gian, chi phí và giữ gìn tình làng nghĩa xóm.",
  "7749 bước hòa giải: Khi 'combat' với hàng xóm về ranh đất, đừng vội ra tòa. Phải qua bước hòa giải ở xã trước. Cán bộ sẽ mời hai bên lên 'uống trà đàm đạo', nếu không chốt được thì mới cầm biên bản ra tòa 'chiến' tiếp!",
  [
    { question: "Hòa giải tại UBND xã là bắt buộc đối với loại tranh chấp nào?", options: ["Tranh chấp thừa kế quyền sử dụng đất", "Tranh chấp ai là người có quyền sử dụng đất", "Tranh chấp hợp đồng đặt cọc", "Tranh chấp tài sản gắn liền với đất"], answer: "Tranh chấp ai là người có quyền sử dụng đất", type: "theory" },
    { question: "Sau khi hòa giải tại xã mà vẫn không thống nhất được ranh giới, bước tiếp theo bạn nên làm gì?", options: ["Tự ý dời hàng rào", "Yêu cầu xã hòa giải lại lần 2", "Gửi đơn khởi kiện ra Tòa án nhân dân", "Bỏ qua không giải quyết nữa"], answer: "Gửi đơn khởi kiện ra Tòa án nhân dân", type: "practical" }
  ]
);

addLesson(
  "Đất xây dựng công trình ngầm (Luật 2024)",
  "Luật Đất đai 2024",
  "Điều 216",
  "Luật 2024 quy định cụ thể về việc sử dụng không gian dưới lòng đất để xây dựng công trình ngầm: \n\n1. Quyền sử dụng không gian ngầm: \nNgười sử dụng đất được sử dụng không gian ngầm trong phạm vi ranh giới thửa đất theo quy định về xây dựng và quy hoạch. \n\n2. Công trình ngầm quốc gia: \nNhà nước có quyền xây dựng các công trình ngầm phục vụ lợi ích quốc gia, công cộng dưới lòng đất của người sử dụng đất mà không cần thu hồi đất trên bề mặt (trừ trường hợp ảnh hưởng đến việc sử dụng đất trên bề mặt). \n\n3. Ưu tiên sử dụng: \nNgười sử dụng đất trên bề mặt được ưu tiên thuê đất để xây dựng công trình ngầm phù hợp với quy hoạch. \n\n4. Nghĩa vụ: \nPhải đảm bảo an toàn cho các công trình trên bề mặt và không làm ảnh hưởng đến môi trường lòng đất.",
  "Quy định này thúc đẩy việc phát triển các không gian đô thị hiện đại như bãi đỗ xe ngầm, trung tâm thương mại ngầm.",
  "'Thế giới ngầm': Giờ không chỉ dùng đất trên mặt mà còn có thể xây hầm, bãi xe dưới lòng đất. Luật mới bảo vệ quyền lợi cho anh em muốn 'đào sâu' để kinh doanh hoặc làm tiện ích!",
  [
    { question: "Người sử dụng đất có được ưu tiên gì đối với không gian ngầm dưới thửa đất của mình?", options: ["Được sở hữu vĩnh viễn", "Được ưu tiên thuê đất để xây dựng công trình ngầm", "Được tự ý xây dựng không cần xin phép", "Không có quyền gì"], answer: "Được ưu tiên thuê đất để xây dựng công trình ngầm", type: "theory" },
    { question: "Nhà nước muốn xây dựng đường tàu điện ngầm chạy dưới lòng đất nhà bạn. Theo Luật 2024, Nhà nước có phải thu hồi miếng đất trên mặt của bạn không?", options: ["Có, bắt buộc thu hồi", "Không, nếu việc xây dựng không ảnh hưởng đến việc sử dụng đất trên bề mặt", "Chỉ thu hồi nếu bạn yêu cầu", "Phải mua lại toàn bộ ngôi nhà"], answer: "Không, nếu việc xây dựng không ảnh hưởng đến việc sử dụng đất trên bề mặt", type: "practical" }
  ]
);

addLesson(
  "Đất có di tích lịch sử - văn hóa (Luật 2024)",
  "Luật Đất đai 2024",
  "Điều 213",
  "Quản lý và sử dụng đất có di tích lịch sử - văn hóa, danh lam thắng cảnh đã được xếp hạng: \n\n1. Trách nhiệm bảo vệ: \nNgười sử dụng đất có di tích phải chịu trách nhiệm chính trong việc bảo vệ và giữ gìn hiện trạng di tích. \n\n2. Hạn chế quyền: \nKhông được tự ý xây dựng, sửa chữa làm thay đổi yếu tố gốc cấu thành di tích. Mọi hoạt động xây dựng phải có ý kiến bằng văn bản của cơ quan quản lý văn hóa. \n\n3. Thu hồi đất: \nNhà nước thu hồi đất có di tích trong trường hợp cần thiết để bảo tồn, tôn tạo hoặc phát huy giá trị di tích. \n\n4. Khuyến khích: \nNhà nước khuyến khích tổ chức, cá nhân đầu tư vào việc bảo tồn và phát huy giá trị di tích gắn với sử dụng đất hiệu quả.",
  "Sử dụng đất có di tích đòi hỏi sự cân bằng giữa lợi ích kinh tế và trách nhiệm bảo tồn di sản văn hóa.",
  "Sống cùng di sản: Nếu nhà bạn nằm trong khu di tích thì 'vừa mừng vừa lo'. Mừng vì có view đẹp, lo vì muốn sửa sang gì cũng phải xin phép kỹ càng để không làm hỏng 'vibe' lịch sử của đất nước!",
  [
    { question: "Ai là người chịu trách nhiệm chính trong việc bảo vệ di tích trên đất đang sử dụng?", options: ["Nhà nước", "Người sử dụng đất đó", "Khách du lịch", "Công ty du lịch"], answer: "Người sử dụng đất đó", type: "theory" },
    { question: "Bạn sở hữu một căn nhà cổ được xếp hạng di tích cấp tỉnh. Bạn muốn sơn lại mặt tiền bằng màu sắc hiện đại. Bạn có được tự ý làm không?", options: ["Được, vì là nhà của mình", "Không, phải có ý kiến của cơ quan quản lý văn hóa", "Chỉ cần báo cáo tổ dân phố", "Được, nếu hàng xóm không phản đối"], answer: "Không, phải có ý kiến của cơ quan quản lý văn hóa", type: "practical" }
  ]
);

addLesson(
  "Xử lý vi phạm đất đai (Luật 2024)",
  "Luật Đất đai 2024",
  "Điều 239 - Điều 242",
  "Các biện pháp xử lý đối với hành vi vi phạm pháp luật về đất đai: \n\n1. Xử phạt hành chính: \nPhạt tiền, tịch thu tang vật, phương tiện vi phạm. \n\n2. Biện pháp khắc phục hậu quả: \nBuộc khôi phục tình trạng ban đầu của đất, buộc nộp lại số lợi bất hợp pháp có được do vi phạm. \n\n3. Thu hồi đất: \nÁp dụng đối với các vi phạm nghiêm trọng như: Sử dụng đất không đúng mục đích đã được Nhà nước giao, cho thuê và đã bị xử phạt hành chính mà vẫn tái phạm; Cố ý hủy hoại đất. \n\n4. Xử lý cán bộ: \nNgười có hành vi vi phạm trong khi thi hành công vụ về đất đai sẽ bị xử lý kỷ luật hoặc truy cứu trách nhiệm hình sự tùy theo mức độ vi phạm.",
  "Quy định nghiêm khắc nhằm răn đe và đảm bảo mọi hành vi vi phạm đều phải bị xử lý công bằng trước pháp luật.",
  "'Pay giá' khi làm sai: Lấn chiếm, sử dụng sai mục đích hay chậm nộp thuế đều có cái giá phải trả. Nhẹ thì phạt tiền, nặng thì 'bay' luôn miếng đất. Đừng đùa với pháp luật nhé anh em!",
  [
    { question: "Hành vi nào sau đây có thể dẫn đến việc bị thu hồi đất?", options: ["Chậm nộp thuế 1 tháng", "Sử dụng đất sai mục đích và đã bị phạt hành chính nhưng vẫn tái phạm", "Quên không mang Sổ đỏ khi đi giao dịch", "Để cỏ mọc cao trên đất"], answer: "Sử dụng đất sai mục đích và đã bị phạt hành chính nhưng vẫn tái phạm", type: "theory" },
    { question: "Một cán bộ địa chính cố tình làm sai lệch hồ sơ để trục lợi. Theo Luật 2024, cán bộ này sẽ bị xử lý thế nào?", options: ["Chỉ cần xin lỗi dân", "Bị xử lý kỷ luật hoặc truy cứu trách nhiệm hình sự", "Chỉ bị phạt tiền", "Không bị xử lý vì là người nhà nước"], answer: "Bị xử lý kỷ luật hoặc truy cứu trách nhiệm hình sự", type: "practical" }
  ]
);

addLesson(
  "Đất xây dựng công trình ngầm (Luật 2024)",
  "Luật Đất đai 2024",
  "Điều 216",
  "Quy định về việc sử dụng không gian ngầm để xây dựng công trình: \n\n1. Quyền sử dụng: \nNgười sử dụng đất được sử dụng lòng đất theo phương thẳng đứng trong phạm vi ranh giới thửa đất và độ sâu được Nhà nước cho phép. \n\n2. Xây dựng công trình ngầm của Nhà nước: \nNhà nước có quyền xây dựng các công trình ngầm (tàu điện ngầm, đường ống kỹ thuật...) dưới lòng đất của người dân mà không cần thu hồi đất bề mặt, nhưng phải bồi thường thiệt hại (nếu có). \n\n3. Ưu tiên: \nKhuyến khích các tổ chức, cá nhân đầu tư xây dựng bãi đỗ xe ngầm, trung tâm thương mại ngầm tại các đô thị lớn.",
  "Quy định này giúp tối ưu hóa không gian đô thị và xác định rõ ranh giới quyền lợi giữa bề mặt và lòng đất.",
  "Khai phá lòng đất: Bạn không chỉ có quyền trên mặt đất mà còn có quyền ở dưới lòng đất nữa (đến một độ sâu nhất định). Nếu Nhà nước đào hầm tàu điện qua nhà bạn mà làm nứt tường thì bạn có quyền đòi đền bù nhé!",
  [
    { question: "Người sử dụng đất được sử dụng lòng đất đến đâu?", options: ["Vô tận", "Đến tâm trái đất", "Trong phạm vi ranh giới và độ sâu được cho phép", "Chỉ được dùng mặt đất"], answer: "Trong phạm vi ranh giới và độ sâu được cho phép", type: "theory" },
    { question: "Nhà nước xây đường hầm xuyên qua lòng đất nhà bạn nhưng không làm ảnh hưởng gì đến việc ở trên mặt đất. Nhà nước có phải thu hồi đất của bạn không?", options: ["Có, phải thu hồi toàn bộ", "Không, chỉ cần bồi thường thiệt hại nếu phát sinh", "Có, nhưng chỉ thu hồi phần ngầm", "Không cần làm gì cả"], answer: "Không, chỉ cần bồi thường thiệt hại nếu phát sinh", type: "practical" }
  ]
);

addLesson(
  "Đất bãi bồi ven sông, ven biển (Luật 2024)",
  "Luật Đất đai 2024",
  "Điều 215",
  "Quản lý và sử dụng đất bãi bồi ven sông, ven biển để phát triển kinh tế: \n\n1. Hình thức sử dụng: \n- Nhà nước cho thuê đất trả tiền thuê đất hàng năm hoặc trả tiền thuê đất một lần cho cả thời gian thuê. \n- Ưu tiên cho cá nhân đang trực tiếp sản xuất nông nghiệp tại địa phương. \n\n2. Mục đích sử dụng: \nNuôi trồng thủy sản, sản xuất nông nghiệp, lâm nghiệp, du lịch sinh thái. \n\n3. Trách nhiệm bảo vệ: \nNgười sử dụng đất phải thực hiện các biện pháp bảo vệ đất, chống sạt lở, không làm ảnh hưởng đến dòng chảy và môi trường sinh thái.",
  "Đất bãi bồi là nguồn tài nguyên quan trọng, cần được khai thác bền vững gắn với bảo vệ môi trường.",
  "Kinh tế ven sông, ven biển: Nếu nhà bạn ở gần sông/biển và có bãi bồi bồi đắp thêm, bạn có thể thuê để nuôi tôm, trồng rừng. Nhớ là phải giữ gìn môi trường, không được làm sạt lở bờ sông đâu đấy!",
  [
    { question: "Nhà nước giao đất bãi bồi ven sông, ven biển theo hình thức nào?", options: ["Giao đất không thu tiền", "Cho thuê đất", "Tặng cho", "Công nhận quyền sử dụng đất miễn phí"], answer: "Cho thuê đất", type: "theory" },
    { question: "Ông C muốn thuê bãi bồi ven biển để nuôi hàu. Ông có được ưu tiên không nếu ông là dân địa phương đang làm nghề cá?", options: ["Có, được ưu tiên thuê", "Không, phải đấu giá công bằng", "Chỉ được thuê nếu có bằng đại học", "Không được thuê vì đất này của Nhà nước"], answer: "Có, được ưu tiên thuê", type: "practical" }
  ]
);

addLesson(
  "Đất di tích, danh lam thắng cảnh (Luật 2024)",
  "Luật Đất đai 2024",
  "Điều 212",
  "Quy định nghiêm ngặt về việc quản lý đất có di tích lịch sử - văn hóa, danh lam thắng cảnh: \n\n1. Trách nhiệm quản lý: \n- UBND cấp xã quản lý đất có di tích chưa được giao cho tổ chức, cá nhân. \n- Tổ chức, cá nhân được giao quản lý di tích có trách nhiệm bảo vệ đất di tích theo quy định của pháp luật về di sản văn hóa. \n\n2. Chuyển mục đích sử dụng: \nNghiêm cấm việc tự ý chuyển mục đích sử dụng đất di tích sang mục đích khác. Trường hợp đặc biệt phải có ý kiến của cơ quan quản lý nhà khoa học, văn hóa cấp trên. \n\n3. Khai thác du lịch: \nKhuyến khích việc kết hợp bảo tồn di tích với phát triển du lịch bền vững nhưng không được làm biến dạng di tích.",
  "Bảo vệ đất di tích là bảo vệ giá trị lịch sử và văn hóa của dân tộc.",
  "Bảo vệ 'di sản': Đất có đình, chùa hay danh lam thắng cảnh là đất 'bất khả xâm phạm'. Không ai được tự ý xây nhà hay đào bới ở đây. Muốn làm du lịch thì phải xin phép cực kỳ khắt khe để không làm hỏng cảnh quan!",
  [
    { question: "Cơ quan nào quản lý đất di tích nếu chưa giao cho ai?", options: ["Bộ Văn hóa", "UBND cấp xã", "UBND cấp huyện", "Công an"], answer: "UBND cấp xã", type: "theory" },
    { question: "Một doanh nghiệp muốn xây khách sạn ngay trong vùng lõi của một di tích quốc gia. Điều này có được phép không?", options: ["Được, nếu nộp nhiều tiền", "Không, vì vi phạm quy định bảo vệ di tích", "Được, nếu cam kết giữ vệ sinh", "Chỉ được xây nếu là khách sạn 5 sao"], answer: "Không, vì vi phạm quy định bảo vệ di tích", type: "practical" }
  ]
);

addLesson(
  "Hoạt động lấn biển (Luật 2024)",
  "Luật Đất đai 2024",
  "Điều 190",
  "Nhà nước khuyến khích tổ chức, cá nhân sử dụng vốn, công nghệ để thực hiện hoạt động lấn biển: \n\n1. Chính sách khuyến khích: \nNhà nước có chính sách ưu đãi về tiền sử dụng đất, tiền thuê đất và các ưu đãi khác cho dự án lấn biển. \n\n2. Giao đất, cho thuê đất: \nDiện tích đất hình thành từ hoạt động lấn biển được giao hoặc cho thuê để thực hiện dự án đầu tư theo quy định. \n\n3. Cấp Giấy chứng nhận: \nNgười thực hiện dự án lấn biển sau khi hoàn thành nghĩa vụ tài chính và nghiệm thu công trình lấn biển sẽ được cấp Sổ đỏ. \n\n4. Quản lý nhà nước: \nHoạt động lấn biển phải phù hợp với quy hoạch, bảo vệ môi trường và đa dạng sinh học.",
  "Quy định này giúp mở rộng quỹ đất và thúc đẩy phát triển kinh tế biển bền vững.",
  "'Mở rộng bờ cõi': Bạn có thể đầu tư tiền để lấn biển tạo thêm đất. Nhà nước cực kỳ khuyến khích và sẽ cấp Sổ đỏ cho phần đất mới này nếu làm đúng quy trình và bảo vệ môi trường!",
  [
    { question: "Nhà nước có thái độ thế nào đối với hoạt động lấn biển?", options: ["Cấm hoàn toàn", "Khuyến khích đầu tư", "Chỉ cho phép Nhà nước làm", "Hạn chế tối đa"], answer: "Khuyến khích đầu tư", type: "theory" },
    { question: "Sau khi lấn biển tạo ra đất mới và hoàn thành dự án, chủ đầu tư có được cấp Sổ đỏ không?", options: ["Không, đất biển là của chung", "Có, nếu hoàn thành nghĩa vụ tài chính và nghiệm thu", "Chỉ được thuê, không được cấp sổ", "Phải đợi 50 năm mới được cấp"], answer: "Có, nếu hoàn thành nghĩa vụ tài chính và nghiệm thu", type: "practical" }
  ]
);

addLesson(
  "Đất cho tổ chức tôn giáo (Luật 2024)",
  "Luật Đất đai 2024",
  "Điều 213",
  "Nhà nước bảo đảm quỹ đất cho các tổ chức tôn giáo hoạt động theo quy định của pháp luật: \n\n1. Hình thức giao đất: \nNhà nước giao đất không thu tiền sử dụng đất cho tổ chức tôn giáo để xây dựng chùa, nhà thờ, thánh thất, thánh đường, trụ sở của tổ chức tôn giáo. \n\n2. Cấp Giấy chứng nhận: \nTổ chức tôn giáo đang sử dụng đất ổn định, không có tranh chấp và được UBND cấp xã xác nhận thì được cấp Sổ đỏ. \n\n3. Hạn mức giao đất: \nUBND cấp tỉnh căn cứ vào quỹ đất thực tế và nhu cầu của tổ chức tôn giáo để quyết định diện tích giao đất. \n\n4. Nghiêm cấm: \nSử dụng đất tôn giáo vào mục đích kinh doanh, thương mại trái quy định.",
  "Quy định này tôn trọng quyền tự do tín ngưỡng và đảm bảo cơ sở vật chất cho các hoạt động tôn giáo hợp pháp.",
  "'Đất tâm linh': Chùa chiền, nhà thờ được Nhà nước giao đất không mất tiền. Nếu đất đã dùng từ lâu mà không tranh chấp thì cũng được cấp Sổ đỏ đàng hoàng để yên tâm tu tập nhé!",
  [
    { question: "Nhà nước giao đất cho tổ chức tôn giáo xây chùa theo hình thức nào?", options: ["Cho thuê trả tiền hàng năm", "Giao đất có thu tiền", "Giao đất không thu tiền sử dụng đất", "Đấu giá quyền sử dụng đất"], answer: "Giao đất không thu tiền sử dụng đất", type: "theory" },
    { question: "Một ngôi chùa đã tồn tại 50 năm, nay muốn làm Sổ đỏ. Điều kiện quan trọng nhất là gì?", options: ["Phải nộp rất nhiều tiền", "Đất sử dụng ổn định và không có tranh chấp", "Phải có sư trụ trì là người địa phương", "Phải xây lại chùa mới"], answer: "Đất sử dụng ổn định và không có tranh chấp", type: "practical" }
  ]
);

addLesson(
  "Đất cho doanh nghiệp FDI (Luật 2024)",
  "Luật Đất đai 2024",
  "Điều 44",
  "Doanh nghiệp có vốn đầu tư nước ngoài (FDI) được tiếp cận đất đai để thực hiện dự án tại Việt Nam: \n\n1. Hình thức sử dụng đất: \n- Thuê đất trả tiền hàng năm hoặc trả tiền một lần. \n- Giao đất có thu tiền sử dụng đất để thực hiện dự án nhà ở để bán hoặc để bán kết hợp cho thuê. \n\n2. Quyền thế chấp: \nĐược thế chấp quyền sử dụng đất và tài sản gắn liền với đất tại các tổ chức tín dụng được phép hoạt động tại Việt Nam. \n\n3. Nhận chuyển nhượng: \nĐược nhận chuyển nhượng vốn đầu tư là giá trị quyền sử dụng đất của doanh nghiệp đang sử dụng đất. \n\n4. Thời hạn sử dụng: \nThường là theo thời hạn của dự án đầu tư (không quá 50 năm, trường hợp đặc biệt không quá 70 năm).",
  "Chính sách này tạo môi trường đầu tư thông thoáng, thu hút dòng vốn ngoại vào phát triển kinh tế.",
  "'Đất cho đại gia ngoại': Các công ty nước ngoài vào Việt Nam sẽ được thuê đất làm nhà máy hoặc xây chung cư. Họ có quyền cắm sổ vào ngân hàng tại Việt Nam để vay vốn làm ăn như doanh nghiệp nội luôn!",
  [
    { question: "Doanh nghiệp FDI được thế chấp quyền sử dụng đất ở đâu?", options: ["Ngân hàng ở nước ngoài", "Tổ chức tín dụng được phép hoạt động tại Việt Nam", "Bất kỳ cá nhân nào", "Không được thế chấp"], answer: "Tổ chức tín dụng được phép hoạt động tại Việt Nam", type: "theory" },
    { question: "Một tập đoàn Hàn Quốc muốn thuê đất 50 năm để xây nhà máy điện tử. Họ nên chọn hình thức nào để có quyền sử dụng đất cao nhất?", options: ["Thuê trả tiền hàng năm", "Thuê trả tiền một lần cho cả thời gian thuê", "Mượn đất của dân", "Không cần hợp đồng"], answer: "Thuê trả tiền một lần cho cả thời gian thuê", type: "practical" }
  ]
);

addLesson(
  "Đất khu công nghệ cao (Luật 2024)",
  "Luật Đất đai 2024",
  "Điều 204",
  "Nhà nước ưu tiên quỹ đất và có chính sách đặc thù cho các khu công nghệ cao: \n\n1. Mục đích sử dụng: \nĐể thực hiện các hoạt động nghiên cứu, phát triển, ứng dụng công nghệ cao, đào tạo nhân lực và sản xuất sản phẩm công nghệ cao. \n\n2. Thẩm quyền quản lý: \nBan quản lý khu công nghệ cao được Nhà nước giao đất và có quyền cho thuê đất đối với các tổ chức, cá nhân thực hiện dự án. \n\n3. Ưu đãi: \nMiễn, giảm tiền thuê đất tùy theo loại hình dự án và lĩnh vực ưu đãi đầu tư. \n\n4. Nhà ở cho chuyên gia: \nQuy hoạch đất xây dựng nhà ở, công trình công cộng phục vụ đời sống của chuyên gia và người lao động làm việc trong khu.",
  "Phát triển khu công nghệ cao là mũi nhọn để đưa Việt Nam tiến sâu vào chuỗi giá trị toàn cầu.",
  "'Silicon Valley Việt Nam': Đất ở các khu công nghệ cao được ưu tiên cực lớn để thu hút nhân tài. Thuê đất ở đây thường được 'deal' giá hời, thời gian dùng lâu dài và có sẵn hạ tầng xịn xò!",
  [
    { question: "Ai là người trực tiếp cho thuê đất trong khu công nghệ cao?", options: ["UBND huyện", "Sở Tài nguyên và Môi trường", "Ban quản lý khu công nghệ cao", "Chính phủ"], answer: "Ban quản lý khu công nghệ cao", type: "theory" },
    { question: "Bạn thành lập một startup về AI và muốn thuê văn phòng trong Khu công nghệ cao Hòa Lạc. Bạn sẽ được hưởng lợi gì về đất đai?", options: ["Được cấp đất miễn phí vĩnh viễn", "Có cơ hội được miễn, giảm tiền thuê đất", "Phải mua đất với giá cao", "Không có ưu đãi gì"], answer: "Có cơ hội được miễn, giảm tiền thuê đất", type: "practical" }
  ]
);

addLesson(
  "Đăng ký biến động đất đai (Luật 2024)",
  "Luật Đất đai 2024",
  "Điều 133",
  "Người sử dụng đất phải đăng ký biến động khi có sự thay đổi về thông tin thửa đất hoặc quyền sử dụng: \n\n1. Các trường hợp phải đăng ký: \n- Chuyển nhượng, tặng cho, thừa kế, góp vốn bằng quyền sử dụng đất. \n- Thay đổi tên, thông tin về chủ sử dụng. \n- Thay đổi diện tích, hình dạng, số hiệu thửa đất. \n- Chuyển mục đích sử dụng đất. \n- Thế chấp hoặc xóa thế chấp. \n\n2. Thời hạn đăng ký: \nTrong thời hạn không quá 30 ngày kể từ ngày có biến động (trừ trường hợp thừa kế thì tính từ ngày phân chia xong di sản). \n\n3. Nơi nộp hồ sơ: \nVăn phòng đăng ký đất đai hoặc bộ phận một cửa cấp huyện/xã. \n\n4. Hậu quả pháp lý: \nViệc biến động chỉ có hiệu lực pháp lý kể từ thời điểm đăng ký vào sổ địa chính.",
  "Đăng ký biến động kịp thời giúp bảo vệ quyền sở hữu và tránh các tranh chấp, xử phạt hành chính không đáng có.",
  "'Update trạng thái đất': Khi bạn bán đất, đổi tên, hay đem đi cắm ngân hàng thì phải ra phường/huyện 'khai báo' trong vòng 30 ngày. Đừng để quá hạn kẻo bị phạt tiền và giao dịch không được công nhận đâu nhé!",
  [
    { question: "Thời hạn tối đa để đăng ký biến động đất đai là bao nhiêu ngày?", options: ["15 ngày", "30 ngày", "60 ngày", "90 ngày"], answer: "30 ngày", type: "theory" },
    { question: "Bạn vừa mua một mảnh đất và đã công chứng hợp đồng xong. Để tên bạn chính thức hiện trên Sổ đỏ, bạn phải làm gì tiếp theo?", options: ["Cất hợp đồng vào tủ là xong", "Đăng ký biến động tại Văn phòng đăng ký đất đai", "Chờ cán bộ tự đến nhà cập nhật", "Chụp ảnh đăng Facebook thông báo"], answer: "Đăng ký biến động tại Văn phòng đăng ký đất đai", type: "practical" }
  ]
);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/lessons", (req, res) => {
    const lessons = db.prepare("SELECT * FROM lessons").all();
    res.json(lessons);
  });

  app.get("/api/lessons/:id", (req, res) => {
    const lesson = db.prepare("SELECT * FROM lessons WHERE id = ?").get(req.params.id);
    res.json(lesson);
  });

  app.get("/api/quizzes", (req, res) => {
    const quizzes = db.prepare("SELECT * FROM quizzes").all();
    // Parse options string back to array
    const parsedQuizzes = quizzes.map((q: any) => ({
      ...q,
      options: JSON.parse(q.options)
    }));
    res.json(parsedQuizzes);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
