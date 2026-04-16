import { useState } from "react";
import { Upload, Search, FileText, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface EmailAnalyzerProps {
  onAnalyze: (content: string, files: File[]) => void;
  isAnalyzing: boolean;
}

const EmailAnalyzer = ({ onAnalyze, isAnalyzing }: EmailAnalyzerProps) => {
  const [emailContent, setEmailContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (emailContent.trim().length < 50) {
      toast({
        title: "Content too short",
        description: "Please paste a valid email with at least 50 characters.",
        variant: "destructive",
      });
      return;
    }
    onAnalyze(emailContent, files);
  };

  return (
    <div className="space-y-6">
      {/* Email Content Input */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <FileText className="h-4 w-4 text-primary" />
          Email Content
        </label>
        <Textarea
          placeholder="Paste the complete email content here (including headers if available)..."
          className="min-h-[200px] font-mono text-sm bg-input border-border focus:border-primary focus:ring-primary/20 resize-none"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Minimum 50 characters required for analysis
        </p>
      </div>

      {/* File Upload Area */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Upload className="h-4 w-4 text-primary" />
          Attachments (Optional)
        </label>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-secondary/30"
          )}
        >
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload
            className={cn(
              "h-10 w-10 mx-auto mb-3 transition-colors",
              isDragging ? "text-primary" : "text-muted-foreground"
            )}
          />
          <p className="text-sm text-foreground">
            Drag & drop files here or click to browse
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Supports: PDF, DOC, ZIP, EXE, and more
          </p>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-secondary rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground truncate max-w-[200px]">
                    {file.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-destructive/20 rounded transition-colors"
                >
                  <X className="h-4 w-4 text-destructive" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Analyze Button */}
      <Button
        onClick={handleSubmit}
        disabled={isAnalyzing || emailContent.trim().length < 50}
        variant="cyber"
        size="lg"
        className="w-full"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Search className="h-5 w-5" />
            Analyze Email
          </>
        )}
      </Button>
    </div>
  );
};

export default EmailAnalyzer;
