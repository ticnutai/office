import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProgressCardProps {
  title: string;
  completed: number;
  total: number;
  percentage: number;
  type: "group-a" | "group-b";
  className?: string;
}

export function ProgressCard({ title, completed, total, percentage, type, className }: ProgressCardProps) {
  const progressColor = percentage === 100 ? "from-green-500 to-green-600" : "from-blue-500 to-blue-600";
  const textColor = percentage === 100 ? "text-green-600" : "text-blue-600";

  return (
    <Card className={cn("bg-white shadow-sm", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 text-right">{title}</h3>
          <span className={cn("text-2xl font-bold", textColor)}>{percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div 
            className={cn("h-3 rounded-full transition-all duration-500 bg-gradient-to-l", progressColor)}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>{completed} הושלמו מתוך {total}</span>
          <span>יחד {total} משימות</span>
        </div>
      </CardContent>
    </Card>
  );
}
