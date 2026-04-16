import { AlertTriangle, AlertCircle, CheckCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface Issue {
  type: "high" | "medium" | "low" | "info";
  message: string;
  score?: number;
  confidence?: number;
}

interface IssuesListProps {
  issues: Issue[];
}

const IssuesList = ({ issues }: IssuesListProps) => {
  const getIssueStyles = (type: Issue["type"]) => {
    switch (type) {
      case "high":
        return {
          icon: AlertCircle,
          color: "text-destructive",
          bgColor: "bg-destructive/10",
          borderColor: "border-destructive/30",
          confidenceColor: "text-destructive/80",
        };
      case "medium":
        return {
          icon: AlertTriangle,
          color: "text-warning",
          bgColor: "bg-warning/10",
          borderColor: "border-warning/30",
          confidenceColor: "text-warning/80",
        };
      case "low":
        return {
          icon: Info,
          color: "text-primary",
          bgColor: "bg-primary/10",
          borderColor: "border-primary/30",
          confidenceColor: "text-primary/80",
        };
      case "info":
        return {
          icon: CheckCircle,
          color: "text-success",
          bgColor: "bg-success/10",
          borderColor: "border-success/30",
          confidenceColor: "text-success/80",
        };
    }
  };

  if (issues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 py-8 text-center h-full">
        <CheckCircle className="h-12 w-12 text-success mb-3" />
        <p className="text-foreground font-medium">No issues detected</p>
        <p className="text-sm text-muted-foreground">This email appears to be safe</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {issues.map((issue, index) => {
        const styles = getIssueStyles(issue.type);
        const Icon = styles.icon;

        return (
          <div
            key={index}
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg border transition-all duration-300",
              styles.bgColor,
              styles.borderColor
            )}
          >
            <Icon className={cn("h-4 w-4 flex-shrink-0 mt-0.5", styles.color)} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground break-words leading-relaxed">{issue.message}</p>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                {issue.score && (
                  <span className={cn("text-xs font-mono", styles.color)}>
                    +{issue.score} pts
                  </span>
                )}
                {issue.confidence && (
                  <span className={cn("text-xs font-mono px-1.5 py-0.5 rounded bg-background/50", styles.confidenceColor)}>
                    {issue.confidence}% conf
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default IssuesList;
