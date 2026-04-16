import { Shield, Mail, Link2, Paperclip, AlertTriangle } from "lucide-react";
import RiskGauge from "./RiskGauge";
import IssuesList from "./IssuesList";
import { cn } from "@/lib/utils";

interface Issue {
  type: "high" | "medium" | "low" | "info";
  message: string;
  score?: number;
  confidence?: number;
}

interface AnalysisData {
  score: number;
  confidence: number;
  classification: "SAFE" | "SUSPICIOUS" | "HIGH RISK";
  emailIssues: Issue[];
  urlIssues: Issue[];
  attachmentIssues: Issue[];
}

interface AnalysisResultProps {
  data: AnalysisData;
}

const AnalysisResult = ({ data }: AnalysisResultProps) => {
  const sections = [
    {
      title: "Email Content",
      icon: Mail,
      issues: data.emailIssues,
      count: data.emailIssues.filter((i) => i.type !== "info").length,
    },
    {
      title: "URL Analysis",
      icon: Link2,
      issues: data.urlIssues,
      count: data.urlIssues.filter((i) => i.type !== "info").length,
    },
    {
      title: "Attachment Analysis",
      icon: Paperclip,
      issues: data.attachmentIssues,
      count: data.attachmentIssues.filter((i) => i.type !== "info").length,
    },
  ];

  const totalIssues = data.emailIssues.filter(i => i.type !== "info").length +
    data.urlIssues.filter(i => i.type !== "info").length +
    data.attachmentIssues.filter(i => i.type !== "info").length;

  const highIssues = [...data.emailIssues, ...data.urlIssues, ...data.attachmentIssues]
    .filter(i => i.type === "high");
  const mediumIssues = [...data.emailIssues, ...data.urlIssues, ...data.attachmentIssues]
    .filter(i => i.type === "medium");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Main Result Card */}
      <div className="relative overflow-hidden rounded-2xl bg-card border border-border p-8">
        {/* Background decoration */}
        <div className="absolute inset-0 cyber-grid opacity-30" />
        <div
          className={cn(
            "absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20",
            data.classification === "SAFE" && "bg-success",
            data.classification === "SUSPICIOUS" && "bg-warning",
            data.classification === "HIGH RISK" && "bg-destructive"
          )}
        />

        <div className="relative flex flex-col items-center">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Analysis Complete</h2>
          </div>

          <RiskGauge score={data.score} confidence={data.confidence} classification={data.classification} />

          {/* Quick Summary */}
          {totalIssues > 0 && (
            <div className="mt-6 w-full max-w-md">
              <div className="flex items-center justify-center gap-4 text-sm">
                {highIssues.length > 0 && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-destructive/10 text-destructive border border-destructive/30">
                    <AlertTriangle className="h-4 w-4" />
                    {highIssues.length} Critical
                  </span>
                )}
                {mediumIssues.length > 0 && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning/10 text-warning border border-warning/30">
                    <AlertTriangle className="h-4 w-4" />
                    {mediumIssues.length} Warning
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* What's Wrong Summary - Only show if there are issues */}
      {totalIssues > 0 && (
        <div className="rounded-xl bg-destructive/5 border border-destructive/20 p-6">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Detected Issues Summary
          </h3>
          <div className="grid gap-2">
            {highIssues.map((issue, idx) => (
              <div key={`high-${idx}`} className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-destructive text-destructive-foreground shrink-0">
                  CRITICAL
                </span>
                <span className="text-sm text-foreground break-words flex-1">{issue.message}</span>
                {issue.confidence && (
                  <span className="text-xs text-muted-foreground shrink-0">{issue.confidence}%</span>
                )}
              </div>
            ))}
            {mediumIssues.map((issue, idx) => (
              <div key={`med-${idx}`} className="flex items-start gap-3 p-3 rounded-lg bg-warning/10 border border-warning/30">
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-warning text-warning-foreground shrink-0">
                  WARNING
                </span>
                <span className="text-sm text-foreground break-words flex-1">{issue.message}</span>
                {issue.confidence && (
                  <span className="text-xs text-muted-foreground shrink-0">{issue.confidence}%</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Analysis Sections */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.title}
              className="flex flex-col rounded-xl bg-card border border-border p-6 transition-all duration-300 hover:border-primary/30 min-h-[280px]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{section.title}</h3>
                </div>
                {section.count > 0 && (
                  <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
                    <AlertTriangle className="h-3 w-3" />
                    {section.count}
                  </span>
                )}
              </div>

              <div className="flex-1 flex flex-col">
                <IssuesList issues={section.issues} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnalysisResult;
