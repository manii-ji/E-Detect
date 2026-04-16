import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X, Shield, Mail, Link2, Paperclip, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { exportToPDF } from "@/lib/pdfExport";

interface Issue {
  type: "high" | "medium" | "low" | "info";
  message: string;
  score?: number;
  confidence?: number;
}

interface HistoryItemFull {
  id: number;
  date: string;
  emailContent: string;
  score: number;
  confidence: number;
  classification: "SAFE" | "SUSPICIOUS" | "HIGH RISK";
  emailIssues: Issue[];
  urlIssues: Issue[];
  attachmentIssues: Issue[];
}

interface EmailViewModalProps {
  item: HistoryItemFull | null;
  open: boolean;
  onClose: () => void;
}

const EmailViewModal = ({ item, open, onClose }: EmailViewModalProps) => {
  if (!item) return null;

  const getClassificationStyles = (classification: string) => {
    switch (classification) {
      case "SAFE":
        return "bg-success/10 text-success border-success/30";
      case "SUSPICIOUS":
        return "bg-warning/10 text-warning border-warning/30";
      case "HIGH RISK":
        return "bg-destructive/10 text-destructive border-destructive/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "high":
        return "bg-destructive/10 text-destructive";
      case "medium":
        return "bg-warning/10 text-warning";
      case "low":
        return "bg-primary/10 text-primary";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleExportPDF = () => {
    exportToPDF(item);
  };

  const sections = [
    { title: "Email Issues", icon: Mail, issues: item.emailIssues },
    { title: "URL Issues", icon: Link2, issues: item.urlIssues },
    { title: "Attachment Issues", icon: Paperclip, issues: item.attachmentIssues },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3 text-foreground">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              Analysis Report #{item.id.toString().padStart(4, "0")}
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Summary */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold font-mono text-foreground">{item.score}</div>
                <div className="text-xs text-muted-foreground">Risk Score</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold text-primary">{item.confidence}%</div>
                <div className="text-xs text-muted-foreground">Confidence</div>
              </div>
              <span className={cn("px-3 py-1 rounded-full text-sm font-semibold border", getClassificationStyles(item.classification))}>
                {item.classification}
              </span>
            </div>
            <Button onClick={handleExportPDF} className="gap-2">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </div>

          {/* Date */}
          <div className="text-sm text-muted-foreground">
            Analyzed on {new Date(item.date).toLocaleString()}
          </div>

          {/* Email Content */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Email Content</h3>
            <div className="p-4 rounded-lg bg-secondary/30 border border-border max-h-40 overflow-y-auto">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
                {item.emailContent}
              </p>
            </div>
          </div>

          {/* Issues Breakdown */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Detailed Findings</h3>
            {sections.map((section) => {
              const Icon = section.icon;
              const issueCount = section.issues.filter(i => i.type !== "info").length;
              
              return (
                <div key={section.title} className="p-4 rounded-lg bg-secondary/30 border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground">{section.title}</span>
                    {issueCount > 0 && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-xs">
                        <AlertTriangle className="h-3 w-3" />
                        {issueCount}
                      </span>
                    )}
                  </div>
                  
                  {section.issues.length > 0 ? (
                    <div className="space-y-2">
                      {section.issues.map((issue, idx) => (
                        <div key={idx} className="flex items-start justify-between gap-2 text-sm">
                          <div className="flex items-start gap-2 flex-1 min-w-0">
                            <span className={cn("px-2 py-0.5 rounded text-xs font-medium shrink-0", getTypeStyles(issue.type))}>
                              {issue.type.toUpperCase()}
                            </span>
                            <span className="text-muted-foreground break-words">{issue.message}</span>
                          </div>
                          {issue.confidence && (
                            <span className="text-xs text-muted-foreground shrink-0">{issue.confidence}%</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No issues detected</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailViewModal;
