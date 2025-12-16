import { motion } from "framer-motion";
import { Fingerprint, Scan, Zap, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: Fingerprint,
    title: "Authenticate",
    description: "Prove your identity with Anon-Aadhaar. No personal data shared.",
    color: "bg-accent",
  },
  {
    icon: Scan,
    title: "Scan Tag",
    description: "Point your phone at the RFID tag on your windshield.",
    color: "bg-primary",
  },
  {
    icon: Zap,
    title: "Auto-Pay",
    description: "Smart contract processes payment. Paymaster covers gas fees.",
    color: "bg-accent",
  },
  {
    icon: CheckCircle2,
    title: "Get Proof",
    description: "Receive on-chain receipt instantly. Disputes? Just show the proof.",
    color: "bg-primary",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-24">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It <span className="text-gradient-primary">Works</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Four simple steps to anonymous, instant toll payments.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Connection line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-primary to-accent hidden md:block md:-translate-x-1/2" />
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-primary to-accent md:hidden" />

            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`relative flex items-start gap-6 mb-12 last:mb-0 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Mobile layout - always left aligned */}
                <div className="md:hidden flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl ${step.color} flex items-center justify-center flex-shrink-0 shadow-lg relative z-10`}>
                    <step.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-muted-foreground mb-1 block">
                      STEP {i + 1}
                    </span>
                    <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>

                {/* Desktop layout */}
                <div className={`hidden md:flex items-center gap-6 w-full ${
                  i % 2 === 0 ? "flex-row" : "flex-row-reverse"
                }`}>
                  <div className={`flex-1 ${i % 2 === 0 ? "text-right" : "text-left"}`}>
                    <span className="text-xs font-bold text-muted-foreground mb-1 block">
                      STEP {i + 1}
                    </span>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                  <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center flex-shrink-0 shadow-lg relative z-10`}>
                    <step.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div className="flex-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
