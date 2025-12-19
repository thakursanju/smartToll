import { motion } from "framer-motion";
import { useState, useEffect } from "react";
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
  FileText,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAccount, useBalance } from "wagmi";
import { supabase } from "@/integrations/supabase/client";
import { formatEther } from "viem";
import { useAnonAadhaar } from "@/hooks/useAnonAadhaar";

interface Transaction {
  id: string;
  wallet_address: string;
  rfid_tag_id: string;
  toll_booth_name: string;
  amount_eth: number;
  tx_hash: string;
  status: string;
  anon_aadhaar_verified: boolean;
  created_at: string;
}

const Dashboard = () => {
  const [copied, setCopied] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { isVerified } = useAnonAadhaar();

  // Fetch transactions from database
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!address) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('toll_transactions')
        .select('*')
        .eq('wallet_address', address)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching transactions:', error);
      } else {
        setTransactions(data || []);
      }
      setLoading(false);
    };

    fetchTransactions();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('toll-transactions')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'toll_transactions',
          filter: `wallet_address=eq.${address}`,
        },
        (payload) => {
          setTransactions((prev) => [payload.new as Transaction, ...prev].slice(0, 10));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [address]);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const totalPaid = transactions.reduce((acc, tx) => acc + tx.amount_eth, 0);
  const tripCount = transactions.length;

  const displayAddress = address 
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : 'Not Connected';

  const displayBalance = balance 
    ? `${parseFloat(formatEther(balance.value)).toFixed(4)} ${balance.symbol}`
    : '0.0000 ETH';

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
                <p className="text-3xl md:text-4xl font-bold mb-4">{displayBalance}</p>
                <div className="flex items-center gap-2">
                  <code className="bg-primary-foreground/20 px-3 py-1.5 rounded-lg text-sm">
                    {displayAddress}
                  </code>
                  {isConnected && (
                    <button 
                      onClick={copyAddress}
                      className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
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
              { label: "Total Paid", value: `${totalPaid.toFixed(4)} ETH`, icon: ArrowUpRight, color: "text-primary" },
              { label: "Gas Saved", value: "~0.01 ETH", icon: TrendingUp, color: "text-accent" },
              { label: "Trips", value: tripCount.toString(), icon: History, color: "text-primary" },
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
                {loading ? (
                  <div className="p-8 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No transactions yet</p>
                    <p className="text-sm mt-1">Scan an NFC tag to make your first toll payment</p>
                  </div>
                ) : (
                  transactions.map((tx) => (
                    <div key={tx.id} className="p-4 hover:bg-secondary/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10">
                            <ArrowUpRight className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{tx.toll_booth_name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <code>{tx.tx_hash?.slice(0, 10)}...{tx.tx_hash?.slice(-6)}</code>
                              <span>•</span>
                              <span>{formatTimeAgo(tx.created_at)}</span>
                              {tx.anon_aadhaar_verified && (
                                <>
                                  <span>•</span>
                                  <span className="text-accent">✓ Verified</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{tx.amount_eth} ETH</p>
                          <div className="flex gap-1 mt-1">
                            <a
                              href={`/payment-proof?tx=${tx.tx_hash}`}
                              className="p-1 rounded hover:bg-secondary"
                            >
                              <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                            </a>
                            <a
                              href={`https://sepolia.etherscan.io/tx/${tx.tx_hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded hover:bg-secondary"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
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
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isVerified ? 'bg-accent/10' : 'bg-secondary'
                  }`}>
                    <Shield className={`w-5 h-5 ${isVerified ? 'text-accent' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <p className="font-semibold">
                      {isVerified ? 'Identity Verified' : 'Not Verified'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isVerified ? 'Anon-Aadhaar Active' : 'Click Anon-Aadhaar in header'}
                    </p>
                  </div>
                </div>
                {isVerified && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/5 border border-accent/20">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-sm text-accent">ZK Proof Valid</span>
                  </div>
                )}
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
                  CDP Paymaster sponsors gas fees for all toll payments
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
