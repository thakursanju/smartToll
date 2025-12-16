import { motion } from "framer-motion";
import { useState } from "react";
import { 
  Search, 
  FileCheck, 
  Download, 
  ExternalLink, 
  CheckCircle2,
  Clock,
  MapPin,
  Car,
  Shield,
  Copy,
  Check,
  QrCode,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const mockProof = {
  paymentId: "0x7f3a8b2c9d4e5f1a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8e21",
  status: "confirmed",
  timestamp: "2024-01-15 14:32:45 IST",
  blockNumber: "12847392",
  blockHash: "0x4a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f9c3d",
  tollBooth: {
    name: "Mumbai-Pune Expressway Plaza 1",
    location: "Khalapur, Maharashtra",
    id: "BOOTH_001"
  },
  amount: "₹85.00",
  vehicleHash: "0x9f8e7d6c5b4a3...2c1d",
  zkProofHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
  gasSponsored: true,
  gasSaved: "₹2.34"
};

const PaymentProof = () => {
  const [searchId, setSearchId] = useState("");
  const [showProof, setShowProof] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowProof(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container px-4">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="w-16 h-16 rounded-2xl gradient-success flex items-center justify-center mx-auto mb-4">
              <FileCheck className="w-8 h-8 text-success-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Payment Proof</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Verify any toll payment with immutable on-chain proof. Perfect for dispute resolution.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto mb-10"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Enter transaction ID (0x...)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full h-14 pl-12 pr-32 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <Button variant="hero" size="default" className="absolute right-2 top-1/2 -translate-y-1/2">
                Search
              </Button>
            </div>
          </motion.form>

          {/* Proof Card */}
          {showProof && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-3xl mx-auto"
            >
              <div className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-card">
                {/* Header */}
                <div className="p-6 border-b border-border/50 bg-gradient-to-r from-accent/5 to-transparent">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center">
                        <CheckCircle2 className="w-7 h-7 text-accent" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent">
                            VERIFIED
                          </span>
                          <span className="text-xs text-muted-foreground">On-chain confirmed</span>
                        </div>
                        <h2 className="text-xl font-bold">Payment Proof #{mockProof.paymentId.slice(-8)}</h2>
                      </div>
                    </div>
                    <div className="hidden md:block">
                      <QrCode className="w-20 h-20 text-muted-foreground/30" />
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-6">
                  {/* Transaction Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-muted-foreground uppercase tracking-wide">Transaction ID</label>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="text-sm bg-secondary px-3 py-1.5 rounded-lg truncate flex-1">
                            {mockProof.paymentId}
                          </code>
                          <button 
                            onClick={() => copyToClipboard(mockProof.paymentId, 'txId')}
                            className="p-2 rounded-lg hover:bg-secondary transition-colors"
                          >
                            {copied === 'txId' ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground uppercase tracking-wide">Block Hash</label>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="text-sm bg-secondary px-3 py-1.5 rounded-lg truncate flex-1">
                            {mockProof.blockHash}
                          </code>
                          <button 
                            onClick={() => copyToClipboard(mockProof.blockHash, 'blockHash')}
                            className="p-2 rounded-lg hover:bg-secondary transition-colors"
                          >
                            {copied === 'blockHash' ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="text-xs text-muted-foreground uppercase tracking-wide">Timestamp</label>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{mockProof.timestamp}</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <label className="text-xs text-muted-foreground uppercase tracking-wide">Block</label>
                          <div className="mt-1">
                            <span className="text-sm font-medium">#{mockProof.blockNumber}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground uppercase tracking-wide">Amount Paid</label>
                        <div className="mt-1">
                          <span className="text-2xl font-bold text-gradient-primary">{mockProof.amount}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Toll Booth Info */}
                  <div className="p-4 rounded-xl bg-secondary/50 border border-border/50">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{mockProof.tollBooth.name}</p>
                        <p className="text-sm text-muted-foreground">{mockProof.tollBooth.location}</p>
                        <code className="text-xs text-muted-foreground">ID: {mockProof.tollBooth.id}</code>
                      </div>
                    </div>
                  </div>

                  {/* Privacy & ZK Proof */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5 text-accent" />
                        <span className="font-semibold text-accent">Privacy Protected</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Vehicle identity verified via ZK proof without revealing actual data.
                      </p>
                      <div>
                        <label className="text-xs text-muted-foreground">Vehicle Hash</label>
                        <code className="text-xs bg-accent/10 px-2 py-1 rounded block mt-1 truncate">
                          {mockProof.vehicleHash}
                        </code>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Car className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-primary">Gas-Free Transaction</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        This transaction was sponsored by CDP Paymaster.
                      </p>
                      <div className="flex items-center gap-1">
                        <span className="text-sm">You saved:</span>
                        <span className="font-bold text-accent">{mockProof.gasSaved}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/50">
                    <Button variant="hero" size="lg" className="flex-1">
                      <Download className="w-5 h-5" />
                      Download Proof PDF
                    </Button>
                    <Button variant="outline" size="lg" className="flex-1">
                      <ExternalLink className="w-5 h-5" />
                      View on Block Explorer
                    </Button>
                  </div>

                  {/* Dispute Option */}
                  <div className="p-4 rounded-xl bg-warning/5 border border-warning/20">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-warning">Need to raise a dispute?</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          If you believe this charge is incorrect, you can raise a dispute within 7 days of the transaction.
                        </p>
                        <Button variant="ghost" size="sm" className="mt-2 text-warning hover:text-warning hover:bg-warning/10">
                          Raise Dispute →
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentProof;
