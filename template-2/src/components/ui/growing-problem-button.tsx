import { MoveRight } from "lucide-react";

interface GrowingProblemButtonProps {
  onClick: () => void;
  isHidden?: boolean;
  className?: string;
}

export function GrowingProblemButton({
  onClick,
  isHidden = false,
  className = "",
}: GrowingProblemButtonProps) {
  return (
    <div
      className={`relative isolate z-50 ${
        isHidden ? "hidden" : ""
      } ${className}`}
    >
      <button
        type="button"
        onClick={onClick}
        className="group relative z-50 inline-flex items-center gap-2 px-8 py-3 text-sm font-medium text-white rounded-full bg-[#1a1a1a] hover:bg-[#2a2a2a] transition-all duration-300"
      >
        <span>The Growing Problem</span>
        <MoveRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
      </button>
    </div>
  );
}
