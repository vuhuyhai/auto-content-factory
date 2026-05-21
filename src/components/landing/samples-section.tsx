// Samples Section - 3 bài thật do ACF tạo cho 3 brand khác giọng
// Server Component: bằng chứng giọng văn linh hoạt, đặt trước Pricing
// Anchor id="samples" cho CTA secondary trong Hero scroll tới

interface SampleCard {
  badge: string;
  badgeClass: string;
  brand: string;
  voice: string;
  title: string;
  hook: string;
  body: string;
  hashtags: string;
}

const SAMPLE_CARDS: SampleCard[] = [
  {
    badge: "Fitness phụ nữ sau sinh",
    badgeClass: "bg-pink-100 text-pink-800",
    brand: "Ladysfit",
    voice: "Giọng Everyman · ấm áp · chị em với chị em",
    title:
      "Bụng dưới sau sinh: bạn không lười, cơ thể bạn đang phục hồi",
    hook: "Sao 6 tháng sau sinh bụng vẫn chưa về? Vì cơ bụng thẳng đã giãn ra 50% lúc bầu, và nó cần thời gian co lại đúng cách, không phải cố gắng hơn.",
    body: "Có một thứ ít ai nói với chị em sau sinh: cơ bụng thẳng (diastasis recti) giãn ra 50% trong thai kỳ. 6 tháng đầu sau sinh, nó co lại tự nhiên một phần. Nhưng từ tháng thứ 7, nếu không tập đúng, nó sẽ ở yên đó. Plank và sit-up KHÔNG giúp lúc này. Nó còn làm nặng thêm.",
    hashtags: "#Ladysfit #SauSinh #BungDuoi #DiastasisRecti #TapDungCach",
  },
  {
    badge: "B2B Operational Excellence",
    badgeClass: "bg-blue-100 text-blue-800",
    brand: "Vietnam Society of Excellence",
    voice: "Giọng Sage · chuyên môn · phân tích sâu",
    title:
      "Toyota mất 22 năm để dạy 'kaizen' cho mọi người. Bạn đang vội.",
    hook: "Khi McKinsey hỏi 1500 CEO về điểm yếu lớn nhất của Lean transformation, câu trả lời số 1 không phải technology. Là speed of culture change.",
    body: "Toyota Production System ra đời 1948. Đến 1970 mới chính thức gọi là 'kaizen'. Tức 22 năm từ 'có vài thực hành tốt' đến 'ai cũng biết, ai cũng làm'. Doanh nghiệp Việt 2026 muốn implement Lean trong 6 tháng. Cùng lúc đó muốn nhân viên 'tự giác cải tiến' như Toyota. Hai việc đó không cùng tồn tại.",
    hashtags: "#VSE #OperationalExcellence #Lean #Kaizen #LongTermThinking",
  },
  {
    badge: "F&B specialty coffee",
    badgeClass: "bg-amber-100 text-amber-800",
    brand: "Cafe Hạt Mộc Châu (mẫu)",
    voice: "Giọng Creator · vui vẻ · kể chuyện đời thường",
    title:
      "Khách order cà phê đen đá. Sao tụi mình lại hỏi 'anh thích chua hay đắng?'",
    hook: "Có ngày cô khách quen hỏi: 'Sao quán mày phức tạp vậy, gọi cà phê đen mà còn hỏi mấy câu'. Tụi mình cười, kéo cổ ghế xuống, kể.",
    body: "Cà phê đen đá có 30+ vị khác nhau. Robusta Đắk Lắk: đậm, đắng, hậu dài. Arabica Cầu Đất: chua thanh, mùi hoa. Mix 70/30: cân bằng, dễ uống. Khách quen 'đen đá nhạt nhạt' thì hợp Arabica. Khách quen 'cà phê phải đậm' thì Robusta. Hỏi 1 câu đỡ pha 1 ly không vừa miệng.",
    hashtags: "#SpecialtyCoffee #CaPheVietnam #ChamKhachKieuCu #ArabicaCauDat",
  },
];

export function SamplesSection() {
  return (
    <section
      id="samples"
      className="w-full scroll-mt-20 bg-gray-50 py-16 px-4 md:py-20 md:px-6"
    >
      <div className="max-w-6xl mx-auto">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent-acf mb-3">
          Bằng chứng giọng văn
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Cùng một hệ thống. 3 giọng khác nhau. Hoàn toàn Việt.
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mb-12">
          Mỗi brand có persona riêng. ACF học giọng văn từ 8 câu hỏi rồi viết
          đúng tone. Đây là 3 bài thật do hệ thống tạo cho 3 brand khác nhau.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {SAMPLE_CARDS.map((card) => (
            <article
              key={card.brand}
              className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-200 hover:border-accent-acf hover:shadow-lg"
            >
              <span
                className={`inline-block rounded px-2 py-1 text-xs font-semibold uppercase tracking-wider ${card.badgeClass}`}
              >
                {card.badge}
              </span>
              <span className="mt-2 text-sm font-semibold text-gray-900">
                {card.brand}
              </span>
              <span className="text-xs text-gray-500">{card.voice}</span>

              <div className="mt-4 mb-4 border-t border-gray-200" />

              <h3 className="text-base font-bold text-gray-900 leading-snug">
                {card.title}
              </h3>
              <p className="mt-2 text-sm italic text-gray-600">{card.hook}</p>
              <p className="mt-3 text-sm leading-relaxed text-gray-700 line-clamp-5">
                {card.body}
              </p>
              <div className="mt-3 flex flex-wrap gap-1 text-xs text-blue-600">
                {card.hashtags}
              </div>
            </article>
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-gray-600">
          3 bài này do ACF tạo. Brand Ladysfit và VSE là pilot user thật. Brand
          cà phê là mẫu minh hoạ khả năng linh hoạt giọng văn.
        </p>
      </div>
    </section>
  );
}
