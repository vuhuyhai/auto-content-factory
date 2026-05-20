"use client";

// Form liên hệ nhanh - dùng useActionState
import { useActionState } from "react";
import { submitContactForm, type ContactFormState } from "./actions";

const initialState: ContactFormState = {};

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 " +
  "focus:border-accent-acf focus:outline-none focus:ring-1 focus:ring-accent-acf";

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    initialState
  );

  if (state.success) {
    return (
      <div className="rounded-lg border border-accent-acf bg-red-50 px-6 py-8 text-center">
        <p className="text-lg font-semibold text-slate-900">
          Cảm ơn bạn! Chúng tôi sẽ phản hồi sớm.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="contact-name"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Họ tên
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="contact-email"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="contact-subject"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Tiêu đề
        </label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Nội dung
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          required
          className={inputClass}
        />
      </div>

      {state.error ? (
        <p className="text-sm text-accent-acf">{state.error}</p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-accent-acf px-5 py-2.5 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {isPending ? "Đang gửi…" : "Gửi tin nhắn"}
      </button>
    </form>
  );
}
