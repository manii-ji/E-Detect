import jsPDF from "jspdf";

interface Issue {
  type: "high" | "medium" | "low" | "info";
  message: string;
  score?: number;
  confidence?: number;
}

interface AnalysisData {
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

export function exportToPDF(data: AnalysisData) {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Helper functions
  const addText = (text: string, size: number, style: "normal" | "bold" = "normal", color: number[] = [255, 255, 255]) => {
    pdf.setFontSize(size);
    pdf.setFont("helvetica", style);
    pdf.setTextColor(color[0], color[1], color[2]);
    const lines = pdf.splitTextToSize(text, contentWidth);
    pdf.text(lines, margin, y);
    y += lines.length * (size * 0.5);
    return lines.length;
  };

  const addLine = () => {
    y += 5;
    pdf.setDrawColor(80, 80, 100);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 10;
  };

  const checkPageBreak = (neededSpace: number) => {
    if (y + neededSpace > pdf.internal.pageSize.getHeight() - margin) {
      pdf.addPage();
      y = margin;
      return true;
    }
    return false;
  };

  // Set dark background
  pdf.setFillColor(15, 23, 42);
  pdf.rect(0, 0, pageWidth, pdf.internal.pageSize.getHeight(), "F");

  // Header
  pdf.setFillColor(30, 41, 59);
  pdf.rect(0, 0, pageWidth, 50, "F");

  y = 20;
  pdf.setTextColor(56, 189, 248);
  pdf.setFontSize(24);
  pdf.setFont("helvetica", "bold");
  pdf.text("E-DETECT", margin, y);

  y = 30;
  pdf.setTextColor(148, 163, 184);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text("Phishing Email Analysis Report", margin, y);

  // Report info
  y = 40;
  pdf.setTextColor(100, 116, 139);
  pdf.setFontSize(8);
  pdf.text(`Report ID: #${data.id.toString().padStart(4, "0")}`, margin, y);
  pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin - 60, y);

  y = 60;

  // Risk Score Section
  const getClassificationColor = (): number[] => {
    switch (data.classification) {
      case "SAFE": return [34, 197, 94];
      case "SUSPICIOUS": return [234, 179, 8];
      case "HIGH RISK": return [239, 68, 68];
      default: return [148, 163, 184];
    }
  };

  pdf.setFillColor(30, 41, 59);
  pdf.roundedRect(margin, y, contentWidth, 45, 3, 3, "F");

  y += 15;
  addText("RISK ASSESSMENT", 12, "bold", [148, 163, 184]);
  
  y += 10;
  const classColor = getClassificationColor();
  pdf.setTextColor(classColor[0], classColor[1], classColor[2]);
  pdf.setFontSize(28);
  pdf.setFont("helvetica", "bold");
  pdf.text(`${data.score}/100`, margin + 10, y);
  
  pdf.setFontSize(14);
  pdf.text(data.classification, margin + 60, y);

  pdf.setTextColor(148, 163, 184);
  pdf.setFontSize(10);
  pdf.text(`Confidence: ${data.confidence}%`, margin + 130, y);

  y += 25;
  addLine();

  // WHAT'S WRONG SECTION - Prominent summary of issues
  const allIssues = [...data.emailIssues, ...data.urlIssues, ...data.attachmentIssues];
  const criticalIssues = allIssues.filter(i => i.type === "high");
  const warningIssues = allIssues.filter(i => i.type === "medium");
  const totalProblems = criticalIssues.length + warningIssues.length;

  if (totalProblems > 0) {
    checkPageBreak(80);
    
    // Red header for issues
    pdf.setFillColor(60, 30, 30);
    pdf.roundedRect(margin, y, contentWidth, 20, 3, 3, "F");
    y += 14;
    pdf.setTextColor(239, 68, 68);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text(`⚠ ${totalProblems} ISSUES DETECTED - WHAT'S WRONG`, margin + 5, y);
    y += 15;

    // Critical issues
    if (criticalIssues.length > 0) {
      pdf.setTextColor(239, 68, 68);
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text(`CRITICAL ISSUES (${criticalIssues.length})`, margin, y);
      y += 8;

      criticalIssues.forEach((issue) => {
        checkPageBreak(15);
        pdf.setFillColor(60, 30, 30);
        pdf.roundedRect(margin, y - 4, contentWidth, 12, 2, 2, "F");
        
        pdf.setTextColor(239, 68, 68);
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "bold");
        pdf.text("CRITICAL", margin + 3, y + 2);
        
        pdf.setTextColor(255, 200, 200);
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "normal");
        const msgLines = pdf.splitTextToSize(issue.message, contentWidth - 50);
        pdf.text(msgLines[0], margin + 30, y + 2);
        
        if (issue.confidence) {
          pdf.setTextColor(200, 150, 150);
          pdf.text(`${issue.confidence}%`, pageWidth - margin - 15, y + 2);
        }
        y += 14;
      });
      y += 5;
    }

    // Warning issues
    if (warningIssues.length > 0) {
      pdf.setTextColor(234, 179, 8);
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text(`WARNING ISSUES (${warningIssues.length})`, margin, y);
      y += 8;

      warningIssues.forEach((issue) => {
        checkPageBreak(15);
        pdf.setFillColor(50, 45, 20);
        pdf.roundedRect(margin, y - 4, contentWidth, 12, 2, 2, "F");
        
        pdf.setTextColor(234, 179, 8);
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "bold");
        pdf.text("WARNING", margin + 3, y + 2);
        
        pdf.setTextColor(255, 230, 150);
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "normal");
        const msgLines = pdf.splitTextToSize(issue.message, contentWidth - 50);
        pdf.text(msgLines[0], margin + 30, y + 2);
        
        if (issue.confidence) {
          pdf.setTextColor(200, 180, 100);
          pdf.text(`${issue.confidence}%`, pageWidth - margin - 15, y + 2);
        }
        y += 14;
      });
    }

    y += 5;
    addLine();
  }

  // Email Content Preview
  checkPageBreak(60);
  addText("ANALYZED EMAIL CONTENT", 12, "bold", [148, 163, 184]);
  y += 5;
  
  pdf.setFillColor(30, 41, 59);
  pdf.roundedRect(margin, y, contentWidth, 40, 3, 3, "F");
  y += 10;
  
  const preview = data.emailContent.substring(0, 300) + (data.emailContent.length > 300 ? "..." : "");
  addText(preview, 9, "normal", [203, 213, 225]);
  
  y += 15;
  addLine();

  // Detailed Issues Sections
  const renderIssuesSection = (title: string, issues: Issue[]) => {
    checkPageBreak(40);
    addText(title, 12, "bold", [148, 163, 184]);
    y += 5;

    if (issues.length === 0 || issues.every(i => i.type === "info")) {
      addText("✓ No issues detected", 10, "normal", [34, 197, 94]);
      y += 10;
      return;
    }

    issues.forEach((issue) => {
      if (issue.type === "info") return;
      checkPageBreak(20);
      
      const typeColors: Record<string, number[]> = {
        high: [239, 68, 68],
        medium: [234, 179, 8],
        low: [56, 189, 248],
        info: [100, 116, 139],
      };

      const typeLabels: Record<string, string> = {
        high: "CRITICAL",
        medium: "WARNING",
        low: "LOW",
        info: "INFO",
      };

      const color = typeColors[issue.type] || typeColors.info;
      
      // Type badge
      pdf.setFillColor(color[0], color[1], color[2]);
      pdf.roundedRect(margin, y - 3, 18, 6, 1, 1, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(6);
      pdf.text(typeLabels[issue.type], margin + 2, y);

      // Message
      pdf.setTextColor(203, 213, 225);
      pdf.setFontSize(9);
      const messageLines = pdf.splitTextToSize(issue.message, contentWidth - 60);
      pdf.text(messageLines, margin + 22, y);

      // Confidence
      if (issue.confidence) {
        pdf.setTextColor(100, 116, 139);
        pdf.setFontSize(8);
        pdf.text(`${issue.confidence}%`, pageWidth - margin - 15, y);
      }

      y += messageLines.length * 5 + 8;
    });

    y += 5;
  };

  renderIssuesSection("EMAIL CONTENT ANALYSIS", data.emailIssues);
  renderIssuesSection("URL ANALYSIS", data.urlIssues);
  renderIssuesSection("ATTACHMENT ANALYSIS", data.attachmentIssues);

  // Recommendations
  checkPageBreak(60);
  addLine();
  addText("RECOMMENDATIONS", 12, "bold", [148, 163, 184]);
  y += 5;

  const recommendations = getRecommendations(data);
  recommendations.forEach((rec, idx) => {
    checkPageBreak(15);
    addText(`${idx + 1}. ${rec}`, 9, "normal", [203, 213, 225]);
    y += 3;
  });

  // Footer
  const footerY = pdf.internal.pageSize.getHeight() - 15;
  pdf.setTextColor(100, 116, 139);
  pdf.setFontSize(8);
  pdf.text("Generated by E-detect Phishing Detection System", margin, footerY);
  pdf.text(`Analysis Date: ${new Date(data.date).toLocaleString()}`, pageWidth - margin - 60, footerY);

  // Save
  pdf.save(`e-detect-report-${data.id}.pdf`);
}

function getRecommendations(data: AnalysisData): string[] {
  const recommendations: string[] = [];

  if (data.classification === "HIGH RISK") {
    recommendations.push("Do NOT click any links or download attachments from this email.");
    recommendations.push("Report this email to your IT security team immediately.");
    recommendations.push("Delete the email from your inbox and trash folder.");
    recommendations.push("If you've already interacted with this email, change your passwords immediately.");
  } else if (data.classification === "SUSPICIOUS") {
    recommendations.push("Verify the sender's identity through an alternative communication channel.");
    recommendations.push("Hover over links to check the actual destination before clicking.");
    recommendations.push("Be cautious of any urgency or pressure tactics in the email.");
    recommendations.push("When in doubt, consult with your IT security team.");
  } else {
    recommendations.push("This email appears to be safe, but always remain vigilant.");
    recommendations.push("Continue to verify senders before sharing sensitive information.");
    recommendations.push("Keep your security software updated.");
  }

  // Add specific recommendations based on issues
  const hasUrlIssues = data.urlIssues.some(i => i.type === "high" || i.type === "medium");
  const hasAttachmentIssues = data.attachmentIssues.some(i => i.type === "high" || i.type === "medium");

  if (hasUrlIssues) {
    recommendations.push("Avoid clicking on any links in this email - type URLs directly in your browser.");
  }

  if (hasAttachmentIssues) {
    recommendations.push("Do not open attachments - scan with antivirus software first if necessary.");
  }

  return recommendations.slice(0, 6);
}
