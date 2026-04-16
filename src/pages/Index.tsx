import { useState } from "react";
import { Shield, Zap, Lock, Eye } from "lucide-react";
import Header from "@/components/Header";
import EmailAnalyzer from "@/components/EmailAnalyzer";
import AnalysisResult from "@/components/AnalysisResult";
import { analyzeEmail } from "@/lib/phishingDetector";

const Index = () => {
  const [analysisResult, setAnalysisResult] = useState<ReturnType<typeof analyzeEmail> | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async (content: string, files: File[]) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const result = analyzeEmail(content, files);
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const features = [
    {
      icon: Shield,
      title: "Rule-Based Detection",
      description: "Advanced heuristics without ML dependency",
    },
    {
      icon: Lock,
      title: "Static Analysis",
      description: "Safe attachment inspection without execution",
    },
    {
      icon: Eye,
      title: "Explainable Scoring",
      description: "Transparent risk assessment with detailed breakdown",
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Real-time analysis with comprehensive reports",
    },
  ];

  return (
    <div className="min-h-screen bg-background cyber-grid">
      <Header />

      <main className="container py-8 px-4">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <h1 className="relative text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
              Phishing Email
              <span className="text-primary"> Detection</span>
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Protect yourself from phishing attacks with our advanced email analysis toolkit.
            Static analysis, no file execution, fully transparent scoring.
          </p>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="p-3 rounded-lg bg-primary/10 w-fit mb-3 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </section>

        {/* Analysis Section */}
        <section className="grid lg:grid-cols-2 gap-8">
          {/* Input Card */}
          <div className="rounded-2xl bg-card border border-border p-6 lg:p-8">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              Analyze Email
            </h2>
            <EmailAnalyzer onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
          </div>

          {/* Results Card */}
          <div className="lg:row-span-2">
            {isAnalyzing ? (
              <div className="h-full flex items-center justify-center rounded-2xl bg-card border border-border p-8">
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                    <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                    <div className="absolute inset-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="h-8 w-8 text-primary animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Scanning Email Content
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Analyzing for phishing indicators...
                  </p>
                </div>
              </div>
            ) : analysisResult ? (
              <AnalysisResult data={analysisResult} />
            ) : (
              <div className="h-full flex items-center justify-center rounded-2xl bg-card border border-border border-dashed p-8">
                <div className="text-center">
                  <div className="p-4 rounded-full bg-secondary w-fit mx-auto mb-4">
                    <Shield className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No Analysis Yet
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Paste an email and click "Analyze Email" to detect phishing indicators
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            <span className="text-primary font-semibold">E-detect</span> — Cybersecurity Defense & Education
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            No malicious content generated. Files are never executed.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
