import { useState, useEffect } from "react";
import { History as HistoryIcon, Trash2, Eye, Download, Search } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { generateMockHistory, HistoryItemFull } from "@/lib/phishingDetector";
import EmailViewModal from "@/components/EmailViewModal";
import { exportToPDF } from "@/lib/pdfExport";

const History = () => {
  const [history, setHistory] = useState<HistoryItemFull[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<HistoryItemFull | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setHistory(generateMockHistory());
  }, []);

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

  const filteredHistory = history.filter((item) =>
    item.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.classification.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.emailContent.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    setHistory([]);
  };

  const handleView = (item: HistoryItemFull) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleDownload = (item: HistoryItemFull) => {
    exportToPDF(item);
  };

  return (
    <div className="min-h-screen bg-background cyber-grid">
      <Header />

      <main className="container py-8 px-4">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <HistoryIcon className="h-6 w-6 text-primary" />
              </div>
              Analysis History
            </h1>
            <p className="text-muted-foreground mt-1">
              Review past email analysis results
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64 bg-input border-border"
              />
            </div>
            {history.length > 0 && (
              <Button variant="destructive" size="sm" onClick={handleClearAll}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* History List */}
        {filteredHistory.length > 0 ? (
          <div className="space-y-4">
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                className="group rounded-xl bg-card border border-border p-5 transition-all duration-300 hover:border-primary/30"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-mono text-muted-foreground">
                        #{item.id.toString().padStart(4, "0")}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(item.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-foreground truncate">{item.preview}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Score */}
                    <div className="text-center">
                      <div className="text-2xl font-bold font-mono text-foreground">
                        {item.score}
                      </div>
                      <div className="text-xs text-muted-foreground">Score</div>
                    </div>

                    {/* Confidence */}
                    <div className="text-center">
                      <div className="text-lg font-semibold text-primary">
                        {item.confidence}%
                      </div>
                      <div className="text-xs text-muted-foreground">Conf.</div>
                    </div>

                    {/* Classification Badge */}
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap",
                        getClassificationStyles(item.classification)
                      )}
                    >
                      {item.classification}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(item)}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownload(item)}
                        title="Download PDF"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                        className="text-destructive hover:text-destructive"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-4 rounded-full bg-secondary mb-4">
              <HistoryIcon className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No History Found
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              {searchQuery
                ? "No results match your search query"
                : "Start analyzing emails to build your history"}
            </p>
          </div>
        )}
      </main>

      {/* View Modal */}
      <EmailViewModal
        item={selectedItem}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default History;
