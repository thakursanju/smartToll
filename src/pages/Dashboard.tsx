import { motion } from "framer-motion";
import { useState } from "react";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  Shield, 
  TrendingUp,
  Bell,
  Settings,
  Copy,
  Check,
  Plus,
  ExternalLink,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const recentTransactions = [
  { id: "0x7f3a...8e21", toll: "Mumbai-Pune Expressway", amount: "₹85", time: "2 mins ago", type: "payment" },
  { id: "0x9c4d...2f18", toll: "Delhi-Gurgaon Toll", amount: "₹45", time: "1 hour ago", type: "payment" },
  { id: "0x1a2b...3c4d", toll: "Wallet Top-up", amount: "+₹500", time: "Yesterday", type: "deposit" },
  { id: "0x2e8b...5d42", toll: "Bangalore-Mysore Exp.", amount: "₹120", time: "2 days ago", type: "payment" },
];

const Dashboard = () => {
  const [copied, setCopied] = useState(false);
  const walletAddress = "0x742d...F8a9";

  const copyAddress = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Manage your toll payments and wallet</p>
          </motion.div>

          {/* Wallet Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="gradient-primary rounded-2xl p-6 md:p-8 text-primary-foreground mb-8 shadow-elevated"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Wallet className="w-5 h-5 opacity-80" />
                  <span className="text-sm opacity-80">Available Balance</span>
                </div>
                <p className="text-4xl md:text-5xl font-bold mb-4">₹2,450.00</p>
                <div className="flex items-center gap-2">
                  <code className="bg-primary-foreground/20 px-3 py-1.5 rounded-lg text-sm">
                    {walletAddress}
                  </code>
                  <button 
                    onClick={copyAddress}
                    className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="glass" size="lg" className="flex-1 md:flex-none bg-primary-foreground/20 text-primary-foreground border-0 hover:bg-primary-foreground/30">
                  <Plus className="w-5 h-5" />
                  Top Up
                </Button>
                <Button variant="glass" size="lg" className="flex-1 md:flex-none bg-primary-foreground/20 text-primary-foreground border-0 hover:bg-primary-foreground/30">
                  <ArrowUpRight className="w-5 h-5" />
                  Withdraw
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Paid", value: "₹12,850", icon: ArrowUpRight, color: "text-primary" },
              { label: "Gas Saved", value: "₹342", icon: TrendingUp, color: "text-accent" },
              { label: "Trips", value: "47", icon: History, color: "text-primary" },
              { label: "Disputes", value: "0", icon: Shield, color: "text-accent" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="bg-card rounded-xl p-4 border border-border/50"
              >
                <div className={`w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-3 ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Transactions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 bg-card rounded-2xl border border-border/50 overflow-hidden"
            >
              <div className="p-5 border-b border-border/50 flex items-center justify-between">
                <h2 className="font-semibold text-lg">Recent Transactions</h2>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              <div className="divide-y divide-border/50">
                {recentTransactions.map((tx, i) => (
                  <div key={i} className="p-4 hover:bg-secondary/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          tx.type === "deposit" ? "bg-accent/10" : "bg-primary/10"
                        }`}>
                          {tx.type === "deposit" ? (
                            <ArrowDownLeft className="w-5 h-5 text-accent" />
                          ) : (
                            <ArrowUpRight className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{tx.toll}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <code>{tx.id}</code>
                            <span>•</span>
                            <span>{tx.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${tx.type === "deposit" ? "text-accent" : ""}`}>
                          {tx.amount}
                        </p>
                        <div className="flex gap-1 mt-1">
                          <button className="p-1 rounded hover:bg-secondary">
                            <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                          <button className="p-1 rounded hover:bg-secondary">
                            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              {/* Anon Status */}
              <div className="bg-card rounded-2xl border border-border/50 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold">Identity Verified</p>
                    <p className="text-xs text-muted-foreground">Anon-Aadhaar Active</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/5 border border-accent/20">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-sm text-accent">ZK Proof Valid</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-card rounded-2xl border border-border/50 p-5">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Bell className="w-4 h-4" />
                    Notification Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4" />
                    Account Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4" />
                    Download Statements
                  </Button>
                </div>
              </div>

              {/* Gas Savings */}
              <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl border border-accent/20 p-5">
                <h3 className="font-semibold mb-2">Gas-Free Payments</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  You've saved ₹342 in gas fees this month with CDP Paymaster
                </p>
                <div className="h-2 bg-accent/20 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 gradient-success rounded-full" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">75% more efficient than traditional payments</p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
