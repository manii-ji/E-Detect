import { cn } from "@/lib/utils";

interface RiskGaugeProps {
  score: number;
  confidence: number;
  classification: "SAFE" | "SUSPICIOUS" | "HIGH RISK";
}

const RiskGauge = ({ score, confidence, classification }: RiskGaugeProps) => {
  const getClassificationStyles = () => {
    switch (classification) {
      case "SAFE":
        return {
          color: "text-success",
          bgColor: "bg-success",
          glowClass: "glow-success",
          gradientFrom: "from-success",
        };
      case "SUSPICIOUS":
        return {
          color: "text-warning",
          bgColor: "bg-warning",
          glowClass: "glow-warning",
          gradientFrom: "from-warning",
        };
      case "HIGH RISK":
        return {
          color: "text-destructive",
          bgColor: "bg-destructive",
          glowClass: "glow-destructive",
          gradientFrom: "from-destructive",
        };
    }
  };

  const styles = getClassificationStyles();
  const rotation = (score / 100) * 180;

  const getConfidenceLabel = () => {
    if (confidence >= 85) return "High";
    if (confidence >= 70) return "Medium";
    return "Low";
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Semi-circular gauge */}
      <div className="relative w-48 h-24 overflow-hidden">
        {/* Background arc */}
        <div className="absolute inset-0 rounded-t-full border-8 border-secondary" />
        
        {/* Colored arc based on score */}
        <div
          className={cn("absolute inset-0 rounded-t-full border-8 origin-bottom transition-all duration-1000", styles.bgColor)}
          style={{
            clipPath: `polygon(0 100%, 0 0, ${score}% 0, ${score}% 100%)`,
          }}
        />

        {/* Needle */}
        <div
          className="absolute bottom-0 left-1/2 w-1 h-20 origin-bottom transition-transform duration-1000"
          style={{ transform: `translateX(-50%) rotate(${rotation - 90}deg)` }}
        >
          <div className={cn("w-full h-full rounded-full", styles.bgColor, styles.glowClass)} />
        </div>

        {/* Center dot */}
        <div className={cn("absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 rounded-full", styles.bgColor, styles.glowClass)} />
      </div>

      {/* Score display */}
      <div className="text-center">
        <div className={cn("text-5xl font-bold font-mono", styles.color)}>
          {score}
        </div>
        <div className="text-sm text-muted-foreground">Risk Score</div>
      </div>

      {/* Classification badge */}
      <div
        className={cn(
          "px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wider",
          styles.bgColor,
          "text-background",
          styles.glowClass
        )}
      >
        {classification}
      </div>

      {/* Confidence indicator */}
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs text-muted-foreground">Confidence:</span>
        <div className="flex items-center gap-1.5">
          <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className={cn("h-full rounded-full transition-all duration-1000", styles.bgColor)}
              style={{ width: `${confidence}%` }}
            />
          </div>
          <span className={cn("text-xs font-mono font-medium", styles.color)}>
            {confidence}% ({getConfidenceLabel()})
          </span>
        </div>
      </div>
    </div>
  );
};

export default RiskGauge;
