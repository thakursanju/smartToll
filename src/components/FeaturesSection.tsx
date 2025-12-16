import { motion } from "framer-motion";
import { Shield, Zap, FileCheck, Fingerprint, Wallet, Link2 } from "lucide-react";

const features = [
  {
    icon: Fingerprint,
    title: "Anon-Aadhaar Auth",
    description: "Verify your identity without revealing personal data. Zero-knowledge proofs ensure complete privacy.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Zap,
    title: "Gas-Free Payments",
    description: "CDP Paymaster covers all transaction fees. Pay only for the toll - nothing extra.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: FileCheck,
    title: "On-Chain Proofs",
    description: "Every transaction is recorded on blockchain. Immutable evidence for any disputes.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Shield,
    title: "Smart Contracts",
    description: "Automated, trustless payments. No intermediaries, no manipulation possible.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Wallet,
    title: "Multi-Chain Support",
    description: "Top up your wallet from any chain using Socket bridge. One balance, everywhere.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Link2,
    title: "RFID Integration",
    description: "Seamless connection with your vehicle's existing RFID tag. No new hardware needed.",
    color: "bg-primary/10 text-primary",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-16 md:py-24">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Built for <span className="text-gradient-primary">Privacy & Speed</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Revolutionary toll payment infrastructure combining blockchain security with 
            zero-knowledge authentication and gas-free transactions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-card"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
