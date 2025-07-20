import { Loader2 } from "lucide-react";

export default function ShimmerLoader() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#17153B]/40 backdrop-blur-sm">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-[#433D8B] via-[#C8ACD6] to-[#2E236C] animate-shimmer" />
        <div className="relative z-10 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-[#C8ACD6] animate-spin" />
          <span className="mt-4 text-[#C8ACD6] font-semibold text-lg">Loading...</span>
        </div>
      </div>
      <style>{`
        @keyframes shimmer {
          0% { filter: blur(12px); opacity: 0.7; }
          50% { filter: blur(2px); opacity: 1; }
          100% { filter: blur(12px); opacity: 0.7; }
        }
        .animate-shimmer {
          animation: shimmer 1.2s infinite linear;
        }
      `}</style>
    </div>
  );
}
