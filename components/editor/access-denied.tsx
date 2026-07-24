import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AccessDenied() {
  return (
    <div className="min-h-screen bg-[#000000] text-[#f0f0f4] flex flex-col items-center justify-center p-4">
      {/* Centered Workspace Access Denied Card */}
      <div className="w-full max-w-[440px] bg-[#0e1017] border border-[#1e2230] rounded-[28px] px-8 py-10 flex flex-col items-center text-center shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        {/* Lock Icon Box */}
        <div className="w-[68px] h-[68px] rounded-[20px] bg-[#161824] border border-[#262a3e] flex items-center justify-center text-[#94a3b8] mb-6 shadow-inner">
          <Lock className="w-[30px] h-[30px]" strokeWidth={1.75} />
        </div>

        {/* Heading & Explanation */}
        <div className="space-y-2 mb-7">
          <h1 className="text-[19px] font-bold tracking-tight text-white leading-snug">
            You don&apos;t have access to this workspace.
          </h1>
          <p className="text-[13px] leading-relaxed text-[#7e8597] max-w-[310px] mx-auto">
            Head back to your editor home to open a project you can access.
          </p>
        </div>

        {/* Back to Editor Button */}
        <Button
          asChild
          className="bg-[#00c8d4] hover:bg-[#00b2bd] text-[#000000] font-semibold text-[14px] h-[40px] px-6 rounded-full transition-all shadow-md active:scale-95 border-none"
        >
          <Link href="/editor">
            Back to Editor
          </Link>
        </Button>
      </div>
    </div>
  );
}
