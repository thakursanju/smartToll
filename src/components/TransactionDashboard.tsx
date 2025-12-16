import { motion } from "framer-motion";
import { useState } from "react";
import { 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  FileText, 
  ChevronRight,
  Download,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";

const transactions = [
  {
    id: "0x7f3a...8e21",
    tollName: "Mumbai-Pune Expressway",
    amount: "₹85",
    timestamp: "2 mins ago",
    status: "confirmed",
    blockHash: "0x4a2b...9c3d",
  },
  {
    id: "0x9c4d...2f18",
    tollName: "Delhi-Gurgaon Toll",
    amount: "₹45",
    timestamp: "1 hour ago",
    status: "confirmed",
    blockHash: "0x8e5f...1a7b",
  },
  {
    id: "0x2e8b...5d42",
    tollName: "Bangalore-Mysore Exp.",
    amount: "₹120",
    timestamp: "3 hours ago",
    status: "confirmed",
    blockHash: "0x3c9a...6d2e",
  },
  {
    id: "0x6f1c...9a73",
    tollName: "Chennai Bypass",
    amount: "₹35",
    timestamp: "Yesterday",
    status: "confirmed",
    blockHash: "0x7b4d...8f1c",
  },
];

const TransactionDashboard = () => {
  const [selectedTx, setSelectedTx] = useState<string | null>(null);

  return (
    <section id="dashboard" className="py-16 md:py-24 bg-secondary/30">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Transaction <span className="text-gradient-primary">Proof Dashboard</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Complete transparency with on-chain proofs. Download transaction receipts for any disputes.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Dashboard header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-semibold">Recent Transactions</h3>
              <p className="text-sm text-muted-foreground">4 transactions this month</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4" />
                Export All
              </Button>
            </div>
          </div>

          {/* Transaction list */}
          <div className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-card">
            {transactions.map((tx, i) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-4 sm:p-5 border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors cursor-pointer ${
                  selectedTx === tx.id ? "bg-secondary/50" : ""
                }`}
                onClick={() => setSelectedTx(selectedTx === tx.id ? null : tx.id)}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{tx.tollName}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <code className="bg-secondary px-1.5 py-0.5 rounded">{tx.id}</code>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {tx.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-semibold text-accent">{tx.amount}</span>
                    <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${
                      selectedTx === tx.id ? "rotate-90" : ""
                    }`} />
                  </div>
                </div>

                {/* Expanded details */}
                {selectedTx === tx.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 pt-4 border-t border-border/50"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Block Hash</p>
                        <code className="text-xs bg-secondary px-2 py-1 rounded block truncate">
                          {tx.blockHash}
                        </code>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Status</p>
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-accent">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                          Confirmed on-chain
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm" className="flex-1">
                        <FileText className="w-4 h-4" />
                        Download Proof
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <ExternalLink className="w-4 h-4" />
                        View on Explorer
                      </Button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { label: "Total Paid", value: "₹285" },
              { label: "Gas Saved", value: "₹42" },
              { label: "Avg. Time", value: "1.2s" },
            ].map((stat, i) => (
              <div key={i} className="text-center p-4 rounded-xl bg-card border border-border/50">
                <p className="text-2xl font-bold text-gradient-primary">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TransactionDashboard;
