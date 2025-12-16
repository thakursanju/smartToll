import { motion } from "framer-motion";
import { useState } from "react";
import { 
  Building2, 
  Plus, 
  TrendingUp, 
  Users, 
  DollarSign,
  MapPin,
  Edit,
  MoreVertical,
  ArrowUpRight,
  AlertCircle,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const tollBooths = [
  { 
    id: 1, 
    name: "Mumbai-Pune Expressway Plaza 1", 
    location: "Khalapur, Maharashtra",
    fee: "₹85",
    status: "active",
    todayRevenue: "₹12,450",
    todayTransactions: 147
  },
  { 
    id: 2, 
    name: "Mumbai-Pune Expressway Plaza 2", 
    location: "Lonavala, Maharashtra",
    fee: "₹85",
    status: "active",
    todayRevenue: "₹9,860",
    todayTransactions: 116
  },
  { 
    id: 3, 
    name: "Old Mumbai Highway Toll", 
    location: "Panvel, Maharashtra",
    fee: "₹45",
    status: "maintenance",
    todayRevenue: "₹0",
    todayTransactions: 0
  },
];

const recentActivity = [
  { type: "payment", booth: "Plaza 1", amount: "₹85", time: "Just now" },
  { type: "payment", booth: "Plaza 2", amount: "₹85", time: "2 mins ago" },
  { type: "payment", booth: "Plaza 1", amount: "₹85", time: "5 mins ago" },
  { type: "dispute", booth: "Plaza 2", amount: "₹85", time: "15 mins ago" },
  { type: "payment", booth: "Plaza 1", amount: "₹85", time: "18 mins ago" },
];

const Operator = () => {
  const [selectedBooth, setSelectedBooth] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container px-4">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Operator Panel</h1>
              <p className="text-muted-foreground">Manage your toll booths and monitor revenue</p>
            </div>
            <Button variant="hero" size="lg">
              <Plus className="w-5 h-5" />
              Add New Booth
            </Button>
          </motion.div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Today's Revenue", value: "₹22,310", icon: DollarSign, change: "+12.5%", color: "text-accent" },
              { label: "Active Booths", value: "2/3", icon: Building2, change: "", color: "text-primary" },
              { label: "Transactions", value: "263", icon: TrendingUp, change: "+8.3%", color: "text-accent" },
              { label: "Avg. Wait Time", value: "1.2s", icon: Clock, change: "-0.3s", color: "text-primary" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="bg-card rounded-xl p-4 border border-border/50"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-secondary flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  {stat.change && (
                    <span className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-accent' : 'text-primary'}`}>
                      {stat.change}
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Toll Booths List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-4"
            >
              <h2 className="font-semibold text-lg">Your Toll Booths</h2>
              {tollBooths.map((booth, i) => (
                <div
                  key={booth.id}
                  className={`bg-card rounded-xl border transition-all cursor-pointer ${
                    selectedBooth === booth.id 
                      ? "border-primary shadow-card" 
                      : "border-border/50 hover:border-border"
                  }`}
                  onClick={() => setSelectedBooth(selectedBooth === booth.id ? null : booth.id)}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          booth.status === "active" ? "bg-accent/10" : "bg-warning/10"
                        }`}>
                          <Building2 className={`w-6 h-6 ${
                            booth.status === "active" ? "text-accent" : "text-warning"
                          }`} />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">{booth.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="w-3.5 h-3.5" />
                            {booth.location}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          booth.status === "active" 
                            ? "bg-accent/10 text-accent" 
                            : "bg-warning/10 text-warning"
                        }`}>
                          {booth.status === "active" ? "Active" : "Maintenance"}
                        </span>
                        <button className="p-1.5 rounded-lg hover:bg-secondary">
                          <MoreVertical className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Toll Fee</p>
                        <p className="font-semibold">{booth.fee}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Today's Revenue</p>
                        <p className="font-semibold text-accent">{booth.todayRevenue}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Transactions</p>
                        <p className="font-semibold">{booth.todayTransactions}</p>
                      </div>
                    </div>

                    {selectedBooth === booth.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className="mt-4 pt-4 border-t border-border/50"
                      >
                        <div className="flex gap-3">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="w-4 h-4" />
                            Edit Details
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <TrendingUp className="w-4 h-4" />
                            View Analytics
                          </Button>
                          <Button variant="success" size="sm" className="flex-1">
                            <ArrowUpRight className="w-4 h-4" />
                            Withdraw
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Activity Feed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              {/* Live Activity */}
              <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
                <div className="p-4 border-b border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <h3 className="font-semibold">Live Activity</h3>
                  </div>
                  <span className="text-xs text-muted-foreground">Auto-updating</span>
                </div>
                <div className="divide-y divide-border/50 max-h-80 overflow-y-auto">
                  {recentActivity.map((activity, i) => (
                    <div key={i} className="p-3 flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        activity.type === "payment" ? "bg-accent/10" : "bg-warning/10"
                      }`}>
                        {activity.type === "payment" ? (
                          <CheckCircle2 className="w-4 h-4 text-accent" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-warning" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {activity.type === "payment" ? "Payment received" : "Dispute raised"}
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.booth}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{activity.amount}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revenue Summary */}
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20 p-5">
                <h3 className="font-semibold mb-4">This Month</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Gross Revenue</span>
                    <span className="font-semibold">₹5,42,800</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Platform Fee (1%)</span>
                    <span className="font-medium text-muted-foreground">-₹5,428</span>
                  </div>
                  <div className="h-px bg-border/50" />
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Net Earnings</span>
                    <span className="font-bold text-accent">₹5,37,372</span>
                  </div>
                </div>
                <Button variant="success" size="lg" className="w-full mt-4">
                  <ArrowUpRight className="w-5 h-5" />
                  Withdraw Earnings
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Operator;
