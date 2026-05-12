import type { ArchetypeData, ArchetypeKey } from "./types"

// ============================================================================
// LOCAL STORAGE
// ============================================================================

export const LS_DRAFT_KEY = "acf_onboarding_draft_v1"
export const DRAFT_VERSION = "1.0"

// ============================================================================
// INDUSTRIES (12 lựa chọn)
// ============================================================================

export const INDUSTRIES = [
  { value: "fitness_gym", label: "Fitness & Gym" },
  { value: "fnb", label: "F&B (Nhà hàng, cafe, quán ăn)" },
  { value: "beauty_spa", label: "Beauty & Spa" },
  { value: "retail", label: "Bán lẻ (Retail)" },
  { value: "education", label: "Giáo dục & Đào tạo" },
  { value: "healthcare", label: "Y tế & Phòng khám" },
  { value: "real_estate", label: "Bất động sản" },
  { value: "travel_hotel", label: "Du lịch & Khách sạn" },
  { value: "fashion", label: "Thời trang" },
  { value: "tech", label: "Công nghệ" },
  { value: "professional", label: "Dịch vụ chuyên môn (Luật, kế toán, tư vấn)" },
  { value: "other", label: "Khác" },
] as const

// ============================================================================
// AGE RANGES
// ============================================================================

export const AGE_RANGES = [
  { value: "18-25", label: "18-25 (Gen Z)" },
  { value: "26-35", label: "26-35 (Millennials trẻ)" },
  { value: "36-45", label: "36-45 (Millennials chín, Gen X trẻ)" },
  { value: "46-55", label: "46-55 (Gen X)" },
  { value: "55+", label: "55+ (Boomer)" },
] as const

// ============================================================================
// TOPICS PER INDUSTRY (rút gọn cho MVP, mở rộng sau)
// ============================================================================

export const TOPICS_BY_INDUSTRY: Record<string, string[]> = {
  fitness_gym: [
    "Giảm cân",
    "Tăng cơ bắp",
    "Dinh dưỡng",
    "Tập luyện tại nhà",
    "Phục hồi sau chấn thương",
    "Tâm lý và động lực",
    "Tập sau sinh",
    "Cardio",
    "HIIT",
    "Yoga và Pilates",
    "Mobility và Flexibility",
    "Khuyến mãi và Sự kiện",
    "Câu chuyện khách hàng",
    "Khoa học thể thao",
  ],
  fnb: [
    "Món mới",
    "Câu chuyện đầu bếp",
    "Nguyên liệu sạch",
    "Khuyến mãi",
    "Sự kiện",
    "Đánh giá khách hàng",
    "Hướng dẫn nấu ăn",
    "Văn hoá ẩm thực",
    "Combo tiết kiệm",
    "Giao hàng tận nơi",
  ],
  beauty_spa: [
    "Chăm sóc da",
    "Trị liệu chuyên sâu",
    "Sản phẩm mới",
    "Khuyến mãi",
    "Câu chuyện khách hàng",
    "Mẹo làm đẹp",
    "Trang điểm",
    "Massage và Thư giãn",
    "Tư vấn miễn phí",
  ],
  retail: [
    "Sản phẩm mới",
    "Khuyến mãi",
    "Sale theo mùa",
    "Câu chuyện thương hiệu",
    "Hướng dẫn sử dụng",
    "Đánh giá khách hàng",
    "Bộ sưu tập",
    "Phối đồ",
    "Sự kiện",
  ],
  education: [
    "Phương pháp học",
    "Câu chuyện học viên",
    "Khóa học mới",
    "Giảng viên",
    "Học bổng",
    "Sự kiện",
    "Tài liệu miễn phí",
    "Lộ trình học",
    "Tư vấn nghề nghiệp",
  ],
  healthcare: [
    "Bệnh lý phổ biến",
    "Phòng ngừa",
    "Khám sức khoẻ",
    "Dinh dưỡng",
    "Câu chuyện bệnh nhân",
    "Bác sĩ chuyên môn",
    "Công nghệ y tế",
    "Sức khoẻ tâm thần",
    "Sức khoẻ trẻ em",
  ],
  real_estate: [
    "Dự án mới",
    "Tư vấn đầu tư",
    "Xu hướng thị trường",
    "Phong thuỷ",
    "Thiết kế nội thất",
    "Khu vực hot",
    "Vay ngân hàng",
    "Pháp lý",
  ],
  travel_hotel: [
    "Điểm đến",
    "Khuyến mãi",
    "Mẹo du lịch",
    "Trải nghiệm khách",
    "Ẩm thực địa phương",
    "Sự kiện",
    "Tour mới",
    "Combo tiết kiệm",
  ],
  fashion: [
    "Bộ sưu tập mới",
    "Phối đồ",
    "Xu hướng",
    "Câu chuyện thương hiệu",
    "Khuyến mãi",
    "Behind the scenes",
    "Khách hàng nổi bật",
    "Lookbook",
  ],
  tech: [
    "Sản phẩm mới",
    "Hướng dẫn sử dụng",
    "So sánh sản phẩm",
    "Tin công nghệ",
    "Case study",
    "Khuyến mãi",
    "Tutorial",
    "Đánh giá",
  ],
  professional: [
    "Tư vấn miễn phí",
    "Case study",
    "Thay đổi pháp lý",
    "Kinh nghiệm chuyên gia",
    "Hướng dẫn",
    "Câu chuyện khách hàng",
    "Sự kiện",
    "Webinar",
  ],
  other: [
    "Sản phẩm",
    "Dịch vụ",
    "Khuyến mãi",
    "Câu chuyện thương hiệu",
    "Khách hàng",
    "Sự kiện",
    "Mẹo hữu ích",
    "Văn hoá doanh nghiệp",
  ],
}

// ============================================================================
// PAIN POINT PLACEHOLDERS (theo industry)
// ============================================================================

export const PAIN_POINT_PLACEHOLDERS: Record<string, string> = {
  fitness_gym:
    "VD: Không có thời gian đến phòng tập / Sợ tập không đúng dễ chấn thương / Đã thử nhiều nơi nhưng không giữ được động lực",
  fnb:
    "VD: Không biết quán nào ngon mà sạch / Giá cao mà chất lượng không tương xứng / Sợ ăn ngoài tăng cân",
  beauty_spa:
    "VD: Da xấu do stress / Tăng cân sau sinh / Tự ti vì ngoại hình",
  retail:
    "VD: Khó tìm size vừa / Giá cao chất lượng không tương xứng / Sợ mua online bị lừa",
  education:
    "VD: Học không hiệu quả / Không biết bắt đầu từ đâu / Sợ học xong không áp dụng được",
  healthcare:
    "VD: Sợ bệnh viện quá đông / Không biết tin bác sĩ nào / Chi phí khám chữa cao",
  real_estate:
    "VD: Không biết chọn dự án nào / Sợ mua xong giá rớt / Pháp lý phức tạp",
  travel_hotel:
    "VD: Không có thời gian lên kế hoạch / Sợ bị chặt chém / Trẻ con đi cùng phiền",
  fashion:
    "VD: Phối đồ không hợp dáng / Mua online không ưng / Giá đắt mà mặc nhanh chán",
  tech:
    "VD: Không biết chọn sản phẩm nào / Sợ mua xong lỗi thời / Khó sử dụng",
  professional:
    "VD: Tốn thời gian tự nghiên cứu / Sợ bị tư vấn sai / Chi phí thuê chuyên gia cao",
  other:
    "VD: Mô tả 2-3 vấn đề chính khách hàng gặp phải khi tìm đến sản phẩm/dịch vụ của bạn",
}

// ============================================================================
// 6 ARCHETYPES (rule-based mapping)
// ============================================================================

export const ARCHETYPES: Record<ArchetypeKey, ArchetypeData> = {
  caregiver: {
    key: "caregiver",
    emoji: "👩‍🏫",
    name: "NGƯỜI CHĂM SÓC",
    tagline:
      "Như một người chị, người mẹ. Ấm áp, không phán xét, luôn động viên.",
    examples: "Ladysfit, phòng khám nhi, dịch vụ family",
    voice_principles: [
      "Ấm áp, không phán xét",
      "Luôn động viên, không áp lực",
      "Dùng ngôn ngữ gần gũi như chị gái",
    ],
    vocabulary_yes: [
      "chị em",
      "đồng hành",
      "an toàn",
      "không áp lực",
      "tự tin",
      "yêu thương",
      "chăm sóc",
    ],
    vocabulary_no: [
      "mất sức",
      "kiệt quệ",
      "hardcore",
      "đốt cháy",
      "khốc liệt",
      "ép buộc",
    ],
    sample_hook:
      "Chị em ơi, em vừa nghe được câu chuyện này...",
  },
  sage: {
    key: "sage",
    emoji: "🎓",
    name: "CHUYÊN GIA",
    tagline:
      "Có kiến thức sâu, nói có sức nặng, dữ liệu rõ ràng. Không màu mè.",
    examples: "VSE, tổ chức tư vấn, công ty B2B",
    voice_principles: [
      "Có dữ liệu, có dẫn chứng",
      "Lật ngược giả định phổ biến",
      "Giải thích phức tạp bằng ví dụ đời thường",
    ],
    vocabulary_yes: [
      "hệ thống",
      "cốt lõi",
      "minh bạch",
      "nền tảng",
      "dẫn chứng",
      "phân tích",
      "chuyên môn",
    ],
    vocabulary_no: [
      "thần kỳ",
      "bí mật",
      "đột phá",
      "cách mạng",
      "siêu phẩm",
      "đỉnh cao",
    ],
    sample_hook:
      "Đây là điều ít ai để ý nhưng quyết định 80% kết quả...",
  },
  explorer: {
    key: "explorer",
    emoji: "🚀",
    name: "NGƯỜI TIÊN PHONG",
    tagline:
      "Dám khám phá, đi trước thời đại, truyền cảm hứng phá vỡ giới hạn.",
    examples: "Startup tech, brand thể thao mạo hiểm",
    voice_principles: [
      "Khích lệ thử nghiệm, dám khác biệt",
      "Kể câu chuyện hành trình",
      "Không sợ thất bại, học từ trải nghiệm",
    ],
    vocabulary_yes: [
      "khám phá",
      "tiên phong",
      "bứt phá",
      "hành trình",
      "tự do",
      "thử thách",
      "phá vỡ",
    ],
    vocabulary_no: [
      "an toàn",
      "ổn định",
      "truyền thống",
      "đại trà",
      "quen thuộc",
    ],
    sample_hook:
      "Hầu hết mọi người không dám thử điều này, nhưng...",
  },
  everyman: {
    key: "everyman",
    emoji: "🎭",
    name: "NGƯỜI BẠN",
    tagline:
      "Gần gũi, thân thiện, không xa cách. Như nói chuyện với bạn thân.",
    examples: "Quán cafe nhỏ, shop online tự do",
    voice_principles: [
      "Nói chuyện như bạn bè",
      "Không màu mè, không khoa trương",
      "Chia sẻ thật, không lên gân",
    ],
    vocabulary_yes: [
      "mình",
      "bạn",
      "ổn",
      "đơn giản",
      "thật",
      "vui",
      "thoải mái",
    ],
    vocabulary_no: [
      "đỉnh cao",
      "siêu phẩm",
      "khẳng định đẳng cấp",
      "xa xỉ",
      "tinh hoa",
    ],
    sample_hook:
      "Hôm nay mình muốn kể một chuyện vui...",
  },
  hero: {
    key: "hero",
    emoji: "⚡",
    name: "NGƯỜI HÙNG",
    tagline:
      "Quyết liệt, kỷ luật, vượt khó. Truyền động lực hành động.",
    examples: "Gym hardcore, brand boxing, military training",
    voice_principles: [
      "Thẳng thắn, không vòng vo",
      "Khích lệ vượt giới hạn bản thân",
      "Kỷ luật là nền tảng",
    ],
    vocabulary_yes: [
      "kỷ luật",
      "vượt qua",
      "chinh phục",
      "mạnh mẽ",
      "quyết tâm",
      "không bỏ cuộc",
      "chiến đấu",
    ],
    vocabulary_no: [
      "nhẹ nhàng",
      "thư giãn",
      "thoải mái",
      "đủ rồi",
      "đừng cố",
    ],
    sample_hook:
      "Nếu bạn vẫn còn lý do để không bắt đầu hôm nay, đọc cái này...",
  },
  creator: {
    key: "creator",
    emoji: "💎",
    name: "NHÀ THẨM MỸ",
    tagline:
      "Tinh tế, đẹp đẽ, chú trọng chi tiết. Aesthetic là tất cả.",
    examples: "Brand thời trang, art studio, fine dining",
    voice_principles: [
      "Tôn vinh vẻ đẹp và chi tiết",
      "Kể câu chuyện đằng sau sản phẩm",
      "Ngôn ngữ giàu hình ảnh",
    ],
    vocabulary_yes: [
      "tinh tế",
      "thẩm mỹ",
      "tỉ mỉ",
      "nghệ thuật",
      "chiều sâu",
      "sáng tạo",
      "độc bản",
    ],
    vocabulary_no: [
      "đại trà",
      "rẻ tiền",
      "nhanh gọn",
      "tiện lợi",
      "phổ thông",
    ],
    sample_hook:
      "Đằng sau mỗi chi tiết nhỏ này là một câu chuyện...",
  },
}
