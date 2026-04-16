import {
  Shield,
  AlertTriangle,
  Mail,
  Link2,
  Paperclip,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Header from "@/components/Header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Awareness = () => {
  const warningSignsGroups = [
    {
      title: "Email Red Flags",
      icon: Mail,
      signs: [
        "Mismatched 'From' address and 'Reply-To' address",
        "Generic greetings like 'Dear Customer' or 'Dear User'",
        "Poor grammar and spelling errors",
        "Requests for personal information or credentials",
        "Claims of account suspension or security issues",
      ],
    },
    {
      title: "Suspicious URLs",
      icon: Link2,
      signs: [
        "IP addresses instead of domain names",
        "Misspelled brand names (e.g., 'paypa1.com')",
        "Shortened URLs hiding the true destination",
        "HTTP instead of HTTPS for sensitive pages",
        "Unusual domain extensions (.xyz, .top, etc.)",
      ],
    },
    {
      title: "Dangerous Attachments",
      icon: Paperclip,
      signs: [
        "Executable files (.exe, .scr, .js, .vbs)",
        "Macro-enabled documents (.docm, .xlsm)",
        "Archive files requiring extraction (.zip, .rar)",
        "Double extensions (invoice.pdf.exe)",
        "Unexpected attachments from unknown senders",
      ],
    },
  ];

  const bestPractices = [
    {
      do: "Verify sender identity through alternative channels",
      dont: "Click links in unexpected emails",
    },
    {
      do: "Hover over links to preview the actual URL",
      dont: "Download attachments from unknown sources",
    },
    {
      do: "Use multi-factor authentication on all accounts",
      dont: "Share passwords via email",
    },
    {
      do: "Report suspicious emails to your security team",
      dont: "Respond to urgent requests without verification",
    },
    {
      do: "Keep software and systems updated",
      dont: "Enable macros in documents from external sources",
    },
  ];

  const faqItems = [
    {
      question: "What is phishing?",
      answer:
        "Phishing is a cybercrime where attackers impersonate legitimate organizations via email, text, or other communications to trick victims into revealing sensitive information like passwords, credit card numbers, or personal data.",
    },
    {
      question: "How does E-detect analyze emails?",
      answer:
        "E-detect uses rule-based heuristics to analyze email content, URLs, and attachments. It looks for suspicious keywords, social engineering patterns, malicious URL structures, and high-risk file types—all without executing any files.",
    },
    {
      question: "Is it safe to upload email attachments?",
      answer:
        "Yes! E-detect performs static analysis only. Files are inspected for metadata, extensions, and known malicious patterns without being executed or opened. Your attachments are handled safely.",
    },
    {
      question: "What should I do if an email is flagged as HIGH RISK?",
      answer:
        "Do not click any links or download attachments. Report the email to your organization's security team, delete it from your inbox, and if you've already interacted with it, change any potentially compromised passwords immediately.",
    },
    {
      question: "Can phishing emails bypass spam filters?",
      answer:
        "Yes, sophisticated phishing emails can bypass traditional spam filters by using legitimate-looking domains, personalized content, and clean formatting. That's why manual verification and tools like E-detect are essential additional layers of defense.",
    },
  ];

  return (
    <div className="min-h-screen bg-background cyber-grid">
      <Header />

      <main className="container py-8 px-4 max-w-4xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Phishing Awareness
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Learn to identify and protect yourself from phishing attacks with these
            essential security guidelines.
          </p>
        </div>

        {/* Warning Signs */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-warning" />
            Warning Signs
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {warningSignsGroups.map((group) => {
              const Icon = group.icon;
              return (
                <div
                  key={group.title}
                  className="rounded-xl bg-card border border-border p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">{group.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {group.signs.map((sign, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="text-destructive mt-1">•</span>
                        {sign}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* Best Practices */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Eye className="h-6 w-6 text-primary" />
            Best Practices
          </h2>

          <div className="rounded-xl bg-card border border-border overflow-hidden">
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
              {/* Do Column */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <h3 className="font-semibold text-success">Do</h3>
                </div>
                <ul className="space-y-3">
                  {bestPractices.map((practice, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-foreground"
                    >
                      <span className="text-success mt-0.5">✓</span>
                      {practice.do}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Don't Column */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="h-5 w-5 text-destructive" />
                  <h3 className="font-semibold text-destructive">Don't</h3>
                </div>
                <ul className="space-y-3">
                  {bestPractices.map((practice, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-foreground"
                    >
                      <span className="text-destructive mt-0.5">✗</span>
                      {practice.dont}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Frequently Asked Questions
          </h2>

          <Accordion type="single" collapsible className="space-y-3">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-xl bg-card border border-border px-6"
              >
                <AccordionTrigger className="text-foreground hover:text-primary">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            <span className="text-primary font-semibold">E-detect</span> — Cybersecurity Defense & Education
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Awareness;
