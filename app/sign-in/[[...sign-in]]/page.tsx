import { SignIn } from "@clerk/nextjs";
import { AuthLayout } from "@/components/auth/auth-layout";

export default function SignInPage() {
  return (
    <AuthLayout>
      <SignIn
        fallbackRedirectUrl="/editor"
        appearance={{
          elements: {
            // ── Outer wrappers ──────────────────────────────────
            rootBox:
              "w-full flex items-center justify-center",
            cardBox:
              "w-full max-w-[430px]",

            // ── Card — dark rounded container matching reference ──
            card:
              "w-full bg-[#0C0D14] rounded-[20px] border border-white/[0.06] px-8 pt-8 pb-6 font-sans overflow-hidden",

            // ── Header ──────────────────────────────────────────
            headerTitle:
              "text-[19px] font-bold text-white tracking-[-0.01em] text-center leading-tight",
            headerSubtitle:
              "text-[13px] text-[#6B7280] text-center mt-1 font-normal",

            // ── Social buttons — 2-column grid ──────────────────
            socialButtons:
              "grid grid-cols-2 gap-2.5 mt-5",
            socialButtonsBlockButton:
              "flex items-center justify-center gap-2 bg-[#161720] hover:bg-[#1e1f2e] active:bg-[#161720] border border-white/[0.08] text-white rounded-xl h-10 px-4 text-[13px] font-medium transition-colors cursor-pointer w-full",
            socialButtonsBlockButtonText:
              "text-[#d1d5db] font-medium text-[13px]",
            socialButtonsBlockButtonIcon:
              "w-[15px] h-[15px] shrink-0",
            socialButtonsProviderIcon:
              "w-[15px] h-[15px] shrink-0",

            // ── Divider ─────────────────────────────────────────
            dividerRow:
              "my-4 flex items-center gap-3",
            dividerLine:
              "bg-white/[0.08] flex-1 h-px",
            dividerText:
              "text-[12px] text-[#4B5563] font-normal",

            // ── Form field ──────────────────────────────────────
            formFieldRow:
              "mb-3",
            formFieldLabelRow:
              "flex justify-between items-center mb-1.5",
            formFieldLabel:
              "text-[13px] font-medium text-[#d1d5db] block",
            formFieldHintText:
              "text-[11px] text-[#4B5563]",
            formFieldInput:
              "w-full bg-[#141419] border border-white/[0.09] focus:border-[#00C8D4] focus:ring-0 text-white rounded-xl h-11 px-4 text-[13px] placeholder:text-[#374151] transition-all outline-none",
            formInput:
              "w-full bg-[#141419] border border-white/[0.09] focus:border-[#00C8D4] focus:ring-0 text-white rounded-xl h-11 px-4 text-[13px] placeholder:text-[#374151] transition-all outline-none",

            // ── Primary CTA ─────────────────────────────────────
            formButtonPrimary:
              "w-full bg-[#00C8D4] hover:bg-[#00b8c4] active:bg-[#00a8b4] text-black font-semibold rounded-xl h-11 text-[13px] tracking-wide transition-all flex items-center justify-center gap-2 mt-1 cursor-pointer",

            // ── Footer ──────────────────────────────────────────
            footer:
              "bg-[#0a0b11] border-t-0 mt-4 pt-4 pb-2 -mx-8 px-8 flex flex-col items-center gap-2 rounded-b-[20px]",
            footerActionText:
              "text-[13px] text-[#6B7280]",
            footerActionLink:
              "text-[13px] text-[#00C8D4] hover:text-[#00b8c4] font-semibold transition-colors",
            footerPages:
              "hidden",

            // ── Identity preview ────────────────────────────────
            identityPreviewText:
              "text-white text-sm font-medium",
            identityPreviewEditButton:
              "text-[#00C8D4] text-xs hover:underline",

            // ── OTP ─────────────────────────────────────────────
            otpCodeFieldInput:
              "bg-[#141419] border border-white/[0.09] focus:border-[#00C8D4] text-white rounded-xl text-center text-lg font-semibold h-12 w-12",

            // ── Alerts ──────────────────────────────────────────
            alertText:
              "text-[13px] text-red-400",
            formFieldErrorText:
              "text-[12px] text-red-400 mt-1",
          },
        }}
      />
    </AuthLayout>
  );
}
