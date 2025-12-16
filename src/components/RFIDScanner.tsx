import { motion } from "framer-motion";
import { useState } from "react";
import { Camera, Scan, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type ScanState = "idle" | "scanning" | "success" | "error";

const RFIDScanner = () => {
  const [scanState, setScanState] = useState<ScanState>("idle");

  const handleScan = () => {
    setScanState("scanning");
    setTimeout(() => {
      setScanState("success");
      setTimeout(() => setScanState("idle"), 3000);
    }, 2500);
  };

  return (
    <section id="scanner" className="py-16 md:py-24 bg-secondary/30">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Scan Your <span className="text-gradient-primary">RFID Tag</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Point your phone camera at your vehicle's RFID tag to initiate instant, secure toll payment.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-sm mx-auto"
        >
          {/* Scanner interface */}
          <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-foreground/95 shadow-elevated">
            {/* Camera viewfinder */}
            <div className="absolute inset-4 rounded-2xl overflow-hidden bg-gradient-to-br from-foreground/80 to-foreground/60">
              {/* Scan overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Corner brackets */}
                <div className="relative w-48 h-48">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-3 border-l-3 border-primary rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-3 border-r-3 border-primary rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-3 border-l-3 border-primary rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-3 border-r-3 border-primary rounded-br-lg" />
                  
                  {/* Scanning line */}
                  {scanState === "scanning" && (
                    <motion.div
                      initial={{ top: "0%" }}
                      animate={{ top: "100%" }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_20px_hsl(var(--primary))]"
                    />
                  )}
                  
                  {/* Status icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {scanState === "idle" && (
                      <Scan className="w-12 h-12 text-primary/50" />
                    )}
                    {scanState === "scanning" && (
                      <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Scan className="w-12 h-12 text-primary" />
                      </motion.div>
                    )}
                    {scanState === "success" && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        <CheckCircle2 className="w-16 h-16 text-accent" />
                      </motion.div>
                    )}
                    {scanState === "error" && (
                      <AlertCircle className="w-16 h-16 text-destructive" />
                    )}
                  </div>
                </div>
              </div>

              {/* Status text */}
              <div className="absolute bottom-6 left-0 right-0 text-center">
                <p className="text-primary-foreground/80 text-sm font-medium">
                  {scanState === "idle" && "Position RFID tag within frame"}
                  {scanState === "scanning" && "Scanning..."}
                  {scanState === "success" && "Tag detected! Processing payment..."}
                  {scanState === "error" && "Scan failed. Try again."}
                </p>
              </div>
            </div>

            {/* Bottom controls */}
            <div className="absolute bottom-4 left-4 right-4">
              <Button
                variant={scanState === "scanning" ? "glass" : "hero"}
                size="lg"
                className="w-full"
                onClick={handleScan}
                disabled={scanState === "scanning"}
              >
                <Camera className="w-5 h-5" />
                {scanState === "idle" && "Start Scan"}
                {scanState === "scanning" && "Scanning..."}
                {scanState === "success" && "Scan Complete"}
                {scanState === "error" && "Try Again"}
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 space-y-2">
            {[
              "Hold phone steady 10-15cm from tag",
              "Ensure good lighting conditions",
              "Payment processes automatically",
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  {i + 1}
                </div>
                {text}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RFIDScanner;
