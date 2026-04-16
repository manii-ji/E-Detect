// Enhanced phishing detection logic with confidence scoring

const HIGH_RISK_KEYWORDS = [
  "password", "login", "verify", "account suspended", "wire transfer",
  "immediate action", "security alert", "unusual activity", "invoice due",
  "OTP", "bank", "credit card", "update payment", "ssn", "social security",
  "reset password", "verify identity", "confirm identity", "unauthorized access",
  "locked account", "suspended account", "limited access", "restricted access",
  "reactivate your account", "validate", "security info", "precautionary measure"
];

const MEDIUM_RISK_KEYWORDS = [
  "urgent", "click here", "download", "confirm", "dear customer",
  "transaction", "notification", "expired", "failed delivery",
  "action required", "important notice", "attention", "immediately",
  "verify now", "update now", "click below", "link below", "irregular activity",
  "unable to access", "issue has been resolved", "prevent further"
];

const LOW_RISK_KEYWORDS = [
  "unsubscribe", "privacy policy", "terms of service", "contact us"
];

const HIGH_RISK_EXTENSIONS = [
  "exe", "js", "vbs", "scr", "hta", "docm", "xlsm",
  "zip", "iso", "rar", "7z", "html", "htm", "bat", "cmd",
  "ps1", "msi", "jar", "pif", "com", "wsf"
];

const LURE_KEYWORDS = [
  "invoice", "payment", "kyc", "statement", "refund", "tax", "salary", 
  "account", "order", "receipt", "billing", "purchase", "delivery"
];

const SUSPICIOUS_DOMAINS = [
  "paypal-secure", "microsoft-verify", "google-login", "amazon-security",
  "bank-verify", "account-update", "secure-login"
];

interface Issue {
  type: "high" | "medium" | "low" | "info";
  message: string;
  score?: number;
  confidence?: number;
}

interface AnalysisResult {
  score: number;
  confidence: number;
  classification: "SAFE" | "SUSPICIOUS" | "HIGH RISK";
  emailIssues: Issue[];
  urlIssues: Issue[];
  attachmentIssues: Issue[];
}

export function analyzeEmail(content: string, files: File[]): AnalysisResult {
  let totalScore = 0;
  let confidenceFactors: number[] = [];
  const emailIssues: Issue[] = [];
  const urlIssues: Issue[] = [];
  const attachmentIssues: Issue[] = [];

  const lowerContent = content.toLowerCase();

  // Enhanced Keyword Analysis with confidence
  let keywordScore = 0;
  let keywordMatches = 0;

  HIGH_RISK_KEYWORDS.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = content.match(regex);
    if (matches) {
      keywordScore += 10;
      keywordMatches++;
      emailIssues.push({
        type: "high",
        message: `High-risk keyword: "${keyword}"`,
        score: 10,
        confidence: 85,
      });
    }
  });

  MEDIUM_RISK_KEYWORDS.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = content.match(regex);
    if (matches) {
      keywordScore += 5;
      keywordMatches++;
      emailIssues.push({
        type: "medium",
        message: `Suspicious keyword: "${keyword}"`,
        score: 5,
        confidence: 70,
      });
    }
  });

  if (keywordMatches > 0) {
    confidenceFactors.push(Math.min(60 + keywordMatches * 10, 95));
  }
  totalScore += Math.min(keywordScore, 45);

  // Enhanced Social Engineering Detection
  let seScore = 0;

  // Authority claims with specific patterns
  const authorityPatterns = [
    { pattern: /from\s+(the\s+)?(it\s+department|security\s+team|ceo|cfo|admin|support\s+team)/i, confidence: 90 },
    { pattern: /(official|authorized)\s+(representative|message|communication)/i, confidence: 85 },
    { pattern: /your\s+(bank|account|service)\s+(provider|administrator|team)/i, confidence: 80 },
    { pattern: /(department\s+of|ministry\s+of|government)/i, confidence: 85 },
    { pattern: /technical\s+support|customer\s+service/i, confidence: 75 },
  ];

  let authorityFound = false;
  authorityPatterns.forEach(({ pattern, confidence }) => {
    if (pattern.test(content) && !authorityFound) {
      seScore += 15;
      confidenceFactors.push(confidence);
      emailIssues.push({
        type: "high",
        message: "Authority impersonation detected",
        score: 15,
        confidence,
      });
      authorityFound = true;
    }
  });

  // Urgency manipulation patterns
  const urgencyPatterns = [
    { pattern: /act\s+(now|immediately|fast|quickly)/i, confidence: 88 },
    { pattern: /within\s+(\d+)\s+(hours?|days?|minutes?)/i, confidence: 85 },
    { pattern: /expires?\s+(today|soon|immediately|tonight)/i, confidence: 82 },
    { pattern: /last\s+(chance|warning|notice|reminder)/i, confidence: 80 },
    { pattern: /limited\s+time|don'?t\s+delay|time\s+sensitive/i, confidence: 78 },
    { pattern: /failure\s+to\s+(respond|comply|act)/i, confidence: 85 },
  ];

  let urgencyFound = false;
  urgencyPatterns.forEach(({ pattern, confidence }) => {
    if (pattern.test(content) && !urgencyFound) {
      seScore += 12;
      confidenceFactors.push(confidence);
      emailIssues.push({
        type: "medium",
        message: "Urgency manipulation detected",
        score: 12,
        confidence,
      });
      urgencyFound = true;
    }
  });

  // Fear/threat patterns
  const threatPatterns = [
    { pattern: /will\s+be\s+(suspended|terminated|closed|deleted)/i, confidence: 88 },
    { pattern: /legal\s+action|law\s+enforcement/i, confidence: 82 },
    { pattern: /unauthorized\s+(access|transaction|activity)/i, confidence: 80 },
    { pattern: /your\s+account\s+(has\s+been|will\s+be)\s+(compromised|hacked|locked)/i, confidence: 90 },
  ];

  let threatFound = false;
  threatPatterns.forEach(({ pattern, confidence }) => {
    if (pattern.test(content) && !threatFound) {
      seScore += 15;
      confidenceFactors.push(confidence);
      emailIssues.push({
        type: "high",
        message: "Threat/fear tactics detected",
        score: 15,
        confidence,
      });
      threatFound = true;
    }
  });

  // Request for sensitive info
  const sensitivePatterns = [
    { pattern: /(enter|provide|confirm|verify)\s+(your\s+)?(password|credentials|ssn|credit\s+card)/i, confidence: 95 },
    { pattern: /click\s+(here|below|the\s+link)\s+to\s+(verify|confirm|update)/i, confidence: 88 },
    { pattern: /update\s+your\s+(payment|billing|account)\s+information/i, confidence: 85 },
  ];

  sensitivePatterns.forEach(({ pattern, confidence }) => {
    if (pattern.test(content)) {
      seScore += 18;
      confidenceFactors.push(confidence);
      emailIssues.push({
        type: "high",
        message: "Request for sensitive information",
        score: 18,
        confidence,
      });
    }
  });

  totalScore += Math.min(seScore, 55);

  // Enhanced URL Analysis
  const urlPattern = /https?:\/\/[^\s<>"']+|www\.[^\s<>"']+/gi;
  const urls = content.match(urlPattern) || [];

  urls.forEach((url) => {
    const lowerUrl = url.toLowerCase();

    // IP-based URLs (high confidence)
    if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url)) {
      totalScore += 18;
      confidenceFactors.push(95);
      urlIssues.push({
        type: "high",
        message: `IP-based URL: ${url.substring(0, 40)}...`,
        score: 18,
        confidence: 95,
      });
    }

    // Suspicious domain patterns (brand impersonation)
    SUSPICIOUS_DOMAINS.forEach((domain) => {
      if (lowerUrl.includes(domain)) {
        totalScore += 20;
        confidenceFactors.push(92);
        urlIssues.push({
          type: "high",
          message: `Suspicious domain pattern: ${domain}`,
          score: 20,
          confidence: 92,
        });
      }
    });

    // Suspicious URL patterns (forms, contact pages with random IDs)
    if (/contact-form|form.*\d{3,}|\.html.*@/i.test(url)) {
      totalScore += 15;
      confidenceFactors.push(88);
      urlIssues.push({
        type: "high",
        message: `Suspicious form URL pattern`,
        score: 15,
        confidence: 88,
      });
    }

    // Homograph attacks (mixed characters)
    if (/[а-яА-Яα-ωΑ-Ω]/.test(url)) {
      totalScore += 25;
      confidenceFactors.push(98);
      urlIssues.push({
        type: "high",
        message: `Homograph attack: non-Latin characters`,
        score: 25,
        confidence: 98,
      });
    }

    // Non-HTTPS (increased score)
    if (url.startsWith("http://")) {
      totalScore += 12;
      confidenceFactors.push(85);
      urlIssues.push({
        type: "medium",
        message: `Non-secure HTTP URL - data can be intercepted`,
        score: 12,
        confidence: 85,
      });
    }

    // URL shorteners
    const shorteners = ["bit.ly", "tinyurl", "goo.gl", "t.co", "ow.ly", "is.gd", "buff.ly"];
    if (shorteners.some((s) => lowerUrl.includes(s))) {
      totalScore += 12;
      confidenceFactors.push(80);
      urlIssues.push({
        type: "medium",
        message: `Shortened URL detected`,
        score: 12,
        confidence: 80,
      });
    }

    // Long/obfuscated URLs
    if (url.length > 100) {
      totalScore += 8;
      confidenceFactors.push(70);
      urlIssues.push({
        type: "medium",
        message: `Unusually long URL`,
        score: 8,
        confidence: 70,
      });
    }
  });

  if (urls.length === 0) {
    urlIssues.push({
      type: "info",
      message: "No URLs detected in the email",
      confidence: 100,
    });
  }

  // Enhanced Attachment Analysis
  if (files.length > 0) {
    files.forEach((file) => {
      const fileName = file.name.toLowerCase();
      const extension = fileName.split(".").pop() || "";

      // High-risk extensions
      if (HIGH_RISK_EXTENSIONS.includes(extension)) {
        totalScore += 18;
        confidenceFactors.push(92);
        attachmentIssues.push({
          type: "high",
          message: `High-risk file: .${extension}`,
          score: 18,
          confidence: 92,
        });
      }

      // Lure keywords in filename
      LURE_KEYWORDS.forEach((lure) => {
        if (fileName.includes(lure)) {
          totalScore += 10;
          confidenceFactors.push(75);
          attachmentIssues.push({
            type: "medium",
            message: `Lure keyword: "${lure}"`,
            score: 10,
            confidence: 75,
          });
        }
      });

      // Double extensions (high confidence threat)
      const parts = fileName.split(".");
      if (parts.length > 2) {
        totalScore += 35;
        confidenceFactors.push(98);
        attachmentIssues.push({
          type: "high",
          message: `Double extension: ${file.name}`,
          score: 35,
          confidence: 98,
        });
      }

      // Large file size warning
      if (file.size > 10 * 1024 * 1024) {
        attachmentIssues.push({
          type: "low",
          message: `Large file: ${(file.size / 1024 / 1024).toFixed(1)}MB`,
          confidence: 60,
        });
      }
    });
  } else {
    attachmentIssues.push({
      type: "info",
      message: "No attachments provided",
      confidence: 100,
    });
  }

  // Grammar/spelling indicators (basic check)
  const grammarPatterns = [
    /dear\s+(valued\s+)?customer/i,
    /kindly\s+(do|click|verify|confirm)/i,
    /please\s+revert\s+back/i,
    /do\s+the\s+needful/i,
    /dear\s+(mr|ms|mrs)\s+\w+/i,
  ];

  grammarPatterns.forEach((pattern) => {
    if (pattern.test(content)) {
      totalScore += 5;
      confidenceFactors.push(65);
      emailIssues.push({
        type: "low",
        message: "Generic/suspicious phrasing",
        score: 5,
        confidence: 65,
      });
    }
  });

  // Malformed email address detection (e.g., double @@ or suspicious patterns)
  const emailAddressPattern = /[\w.-]+@{2,}[\w.-]+|<[^>]*@{2,}[^>]*>/gi;
  const malformedEmails = content.match(emailAddressPattern);
  if (malformedEmails) {
    totalScore += 20;
    confidenceFactors.push(95);
    emailIssues.push({
      type: "high",
      message: `Malformed sender email detected (double @@ symbol)`,
      score: 20,
      confidence: 95,
    });
  }

  // Suspicious sender pattern (generic service names)
  const suspiciousSenderPatterns = [
    /from:?\s*[<"]?[\w\s]*service[\w\s]*@/i,
    /from:?\s*[<"]?[\w\s]*support[\w\s]*@/i,
    /from:?\s*[<"]?[\w\s]*noreply[\w\s]*@/i,
  ];
  
  suspiciousSenderPatterns.forEach((pattern) => {
    if (pattern.test(content) && !emailIssues.some(i => i.message.includes("sender"))) {
      totalScore += 8;
      confidenceFactors.push(70);
      emailIssues.push({
        type: "medium",
        message: "Generic service sender address",
        score: 8,
        confidence: 70,
      });
    }
  });

  // Cap the score at 100
  const finalScore = Math.min(totalScore, 100);

  // Calculate overall confidence
  let overallConfidence: number;
  if (confidenceFactors.length === 0) {
    overallConfidence = finalScore < 20 ? 85 : 50;
  } else {
    // Weighted average with more weight on higher confidence findings
    const sortedFactors = confidenceFactors.sort((a, b) => b - a);
    const topFactors = sortedFactors.slice(0, 5);
    overallConfidence = Math.round(
      topFactors.reduce((sum, val, idx) => sum + val * (1 / (idx + 1)), 0) /
      topFactors.reduce((sum, _, idx) => sum + 1 / (idx + 1), 0)
    );
  }

  // Determine classification
  let classification: "SAFE" | "SUSPICIOUS" | "HIGH RISK";
  if (finalScore < 25) {
    classification = "SAFE";
  } else if (finalScore < 55) {
    classification = "SUSPICIOUS";
  } else {
    classification = "HIGH RISK";
  }

  // Add positive indicators if safe
  if (classification === "SAFE" && emailIssues.filter((i) => i.type !== "info").length === 0) {
    emailIssues.push({
      type: "info",
      message: "No suspicious patterns found",
      confidence: overallConfidence,
    });
  }

  return {
    score: finalScore,
    confidence: overallConfidence,
    classification,
    emailIssues,
    urlIssues,
    attachmentIssues,
  };
}

export interface HistoryItemFull {
  id: number;
  date: string;
  emailContent: string;
  preview: string;
  score: number;
  confidence: number;
  classification: "SAFE" | "SUSPICIOUS" | "HIGH RISK";
  emailIssues: Issue[];
  urlIssues: Issue[];
  attachmentIssues: Issue[];
}

const sampleEmails = [
  "Dear valued customer, Your account has been suspended due to suspicious activity. Click here immediately to verify your identity and restore access. Failure to respond within 24 hours will result in permanent account closure.",
  "Hi John, Please find attached the Q3 financial report as requested. Let me know if you have any questions. Best regards, Sarah",
  "URGENT: Your PayPal account needs verification! Click http://paypal-secure-login.com to update your payment information now before your account is locked.",
  "Meeting reminder: Team standup tomorrow at 10 AM. Please review the attached agenda and come prepared with your updates.",
  "Congratulations! You've won a $1000 Amazon gift card. Click here to claim your prize immediately. Limited time offer expires today!",
  "Invoice #12345 attached. Payment due within 30 days. Please contact accounting@company.com if you have questions.",
  "Your password will expire in 2 days. Click this link to reset: http://192.168.1.1/reset?token=abc123. Act now to avoid losing access.",
  "Hi team, Just wanted to share the meeting notes from yesterday. Let me know if I missed anything important.",
  "FINAL WARNING: Your subscription is about to be cancelled. Update your billing information at www.netflix-billing-update.com to continue service.",
  "Thanks for your order! Your package is on its way. Track your delivery at the link below."
];

export function generateMockHistory(): HistoryItemFull[] {
  const classifications: Array<"SAFE" | "SUSPICIOUS" | "HIGH RISK"> = [
    "SAFE",
    "SUSPICIOUS",
    "HIGH RISK",
  ];

  return Array.from({ length: 10 }, (_, i) => {
    const emailContent = sampleEmails[i];
    const classification = classifications[Math.floor(Math.random() * 3)];
    const score = classification === "SAFE" ? Math.floor(Math.random() * 25) :
                  classification === "SUSPICIOUS" ? Math.floor(Math.random() * 30) + 25 :
                  Math.floor(Math.random() * 45) + 55;

    return {
      id: i + 1,
      date: new Date(Date.now() - i * 86400000).toISOString(),
      emailContent,
      preview: emailContent.substring(0, 60) + "...",
      score,
      confidence: Math.floor(Math.random() * 20) + 75,
      classification,
      emailIssues: classification !== "SAFE" ? [
        { type: "high" as const, message: "Suspicious keyword detected", confidence: 85 },
        { type: "medium" as const, message: "Urgency manipulation", confidence: 78 },
      ] : [{ type: "info" as const, message: "No issues detected", confidence: 90 }],
      urlIssues: i % 3 === 0 ? [
        { type: "high" as const, message: "Suspicious domain pattern", confidence: 92 },
      ] : [{ type: "info" as const, message: "No suspicious URLs", confidence: 95 }],
      attachmentIssues: [{ type: "info" as const, message: "No attachments", confidence: 100 }],
    };
  });
}
