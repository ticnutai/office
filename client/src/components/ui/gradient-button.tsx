import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GradientButtonProps {
  type: "overview" | "build" | "excel" | "csv" | "settings" | "advanced";
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

const gradientStyles = {
  overview: "bg-gradient-to-r from-green-400 to-green-600 shadow-green-500/30",
  build: "bg-gradient-to-r from-orange-400 to-orange-600 shadow-orange-500/30", 
  excel: "bg-gradient-to-r from-blue-400 to-blue-600 shadow-blue-500/30",
  csv: "bg-gradient-to-r from-cyan-400 to-cyan-600 shadow-cyan-500/30",
  settings: "bg-gradient-to-r from-pink-400 to-pink-600 shadow-pink-500/30",
  advanced: "bg-gradient-to-r from-purple-400 to-purple-600 shadow-purple-500/30",
};

export function GradientButton({ type, children, onClick, className }: GradientButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "text-white font-semibold px-5 py-2.5 rounded-full border-0 transition-all duration-300 flex items-center gap-2 text-sm shadow-lg hover:shadow-xl hover:scale-105 active:scale-95",
        gradientStyles[type],
        className
      )}
    >
      {children}
    </Button>
  );
}
