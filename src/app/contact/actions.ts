"use server";

// Server Action xử lý form liên hệ
import { createClient } from "@/lib/supabase/server";

export interface ContactFormState {
  success?: boolean;
  error?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !subject || !message) {
    return { error: "Vui lòng điền đầy đủ tất cả các trường." };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { error: "Địa chỉ email không hợp lệ." };
  }
  if (message.length < 10) {
    return { error: "Nội dung tin nhắn cần tối thiểu 10 ký tự." };
  }

  try {
    const supabase = await createClient();
    // TODO: tạo bảng "contact_messages" trong Supabase rồi bật insert dưới đây.
    // await supabase
    //   .from("contact_messages")
    //   .insert({ name, email, subject, message } as never);
    void supabase;
    console.log("[contact] message received:", { name, email, subject });
  } catch (err) {
    // Không để lỗi lưu trữ làm hỏng trải nghiệm gửi tin nhắn của người dùng.
    console.error("[contact] failed to persist message:", err);
  }

  return { success: true };
}
