import type { AuthError } from '@supabase/supabase-js';

/**
 * Map Supabase AuthApiError sang message tiếng Việt friendly cho user.
 * Ưu tiên error.code (chính xác, stable across versions).
 * Fallback error.message.includes() cho versions cũ.
 * Default: generic "Có lỗi xảy ra, vui lòng thử lại sau."
 */
export function translateSignupError(
  error: AuthError | { message: string; code?: string },
): string {
  const code = 'code' in error ? error.code : undefined;

  switch (code) {
    case 'user_already_exists':
      return 'Email này đã được đăng ký. Vui lòng đăng nhập hoặc dùng email khác.';
    case 'email_address_invalid':
      return 'Địa chỉ email không hợp lệ. Vui lòng kiểm tra lại.';
    case 'weak_password':
      return 'Mật khẩu quá yếu hoặc trùng với password đã bị lộ. Vui lòng chọn mật khẩu khác mạnh hơn.';
    case 'over_email_send_rate_limit':
      return 'Bạn đã đăng ký quá nhiều lần. Vui lòng chờ vài phút rồi thử lại.';
    case 'signup_disabled':
      return 'Đăng ký tạm thời đang khóa. Vui lòng liên hệ hỗ trợ.';
    case 'email_provider_disabled':
      return 'Hệ thống email tạm thời gặp sự cố. Vui lòng thử lại sau.';
    case 'unexpected_failure':
      return 'Hệ thống đang gặp lỗi. Vui lòng thử lại sau vài phút.';
  }

  const message = error.message?.toLowerCase() ?? '';
  if (message.includes('already') || message.includes('registered')) {
    return 'Email này đã được đăng ký. Vui lòng đăng nhập hoặc dùng email khác.';
  }
  if (message.includes('password') && message.includes('weak')) {
    return 'Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn (8+ ký tự, có số và chữ cái).';
  }
  if (message.includes('rate limit')) {
    return 'Bạn đã đăng ký quá nhiều lần. Vui lòng chờ vài phút rồi thử lại.';
  }
  if (message.includes('invalid email')) {
    return 'Địa chỉ email không hợp lệ. Vui lòng kiểm tra lại.';
  }

  return 'Không thể tạo tài khoản lúc này. Vui lòng thử lại sau.';
}
