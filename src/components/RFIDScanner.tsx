import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Scan, CheckCircle2, AlertCircle, Wifi, WifiOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNFC } from "@/hooks/useNFC";
import { useTollPayment } from "@/hooks/useTollPayment";
import { useAnonAadhaar } from "@/hooks/useAnonAadhaar";
import { useAccount } from "wagmi";
import { toast } from "sonner";

const RFIDScanner = () => {
  const { status: nfcStatus, error: nfcError, tagData, isSupported, startScan, reset: resetNFC } = useNFC();
  const { status: paymentStatus, error: paymentError, lastPayment, processTollPayment, reset: resetPayment, isConnected } = useTollPayment();
  const { isVerified } = useAnonAadhaar();
  const { address } = useAccount();
  
  const [displayState, setDisplayState] = useState<'idle' | 'scanning' | 'processing' | 'success' | 'error'>('idle');

  // Update display state based on NFC and payment status
  useEffect(() => {
    if (nfcStatus === 'scanning') {
      setDisplayState('scanning');
    } else if (paymentStatus === 'pending' || paymentStatus === 'confirming' || paymentStatus === 'preparing') {
      setDisplayState('processing');
    } else if (paymentStatus === 'success') {
      setDisplayState('success');
    } else if (nfcStatus === 'error' || paymentStatus === 'error') {
      setDisplayState('error');
    } else {
      setDisplayState('idle');
    }
  }, [nfcStatus, paymentStatus]);

  const handleScan = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!isSupported) {
      // Fallback for demo: simulate NFC scan
      setDisplayState('scanning');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockTagId = `RFID-${Date.now().toString(36).toUpperCase()}`;
      
      const result = await processTollPayment(mockTagId, 'TB001', isVerified);
      
      if (result) {
        toast.success(`Toll paid: ${result.amount} ETH`);
      }
      return;
    }

    const tagResult = await startScan();
    
    if (tagResult) {
      const tagId = tagResult.serialNumber || tagResult.records[0]?.data || `TAG-${Date.now()}`;
      const result = await processTollPayment(tagId, 'TB001', isVerified);
      
      if (result) {
        toast.success(`Toll paid: ${result.amount} ETH`);
      }
    }
  };

  const handleReset = () => {
    resetNFC();
    resetPayment();
    setDisplayState('idle');
  };

  const getStatusMessage = () => {
    if (!isConnected) return "Connect wallet to scan";
    if (displayState === 'idle') return isSupported ? "Tap NFC tag to scan" : "Tap to simulate scan (NFC not available)";
    if (displayState === 'scanning') return "Hold phone near NFC tag...";
    if (displayState === 'processing') return paymentStatus === 'confirming' ? "Confirming on blockchain..." : "Processing payment...";
    if (displayState === 'success') return `Paid ${lastPayment?.amount} ETH ✓`;
    if (displayState === 'error') return nfcError || paymentError || "Scan failed. Try again.";
    return "";
  };

  const getButtonText = () => {
    if (!isConnected) return "Connect Wallet First";
    if (displayState === 'idle') return "Start Scan";
    if (displayState === 'scanning') return "Scanning...";
    if (displayState === 'processing') return "Processing...";
    if (displayState === 'success') return "Scan Another";
    if (displayState === 'error') return "Try Again";
    return "Start Scan";
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
            Scan Your <span className="text-gradient-primary">NFC Tag</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {isSupported 
              ? "Hold your phone near the vehicle's NFC tag to initiate instant, secure toll payment."
              : "NFC scanning requires Chrome on Android. Demo mode is available."}
          </p>
          
          {/* NFC Support Badge */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {isSupported ? (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm">
                <Wifi className="w-4 h-4" />
                NFC Supported
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-warning/10 text-warning text-sm">
                <WifiOff className="w-4 h-4" />
                Demo Mode
              </span>
            )}
            {isVerified && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm">
                ✓ Anon-Aadhaar Verified
              </span>
            )}
          </div>
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
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-[3px] border-l-[3px] border-primary rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-[3px] border-r-[3px] border-primary rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[3px] border-l-[3px] border-primary rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[3px] border-r-[3px] border-primary rounded-br-lg" />
                  
                  {/* Scanning animation */}
                  <AnimatePresence>
                    {displayState === 'scanning' && (
                      <motion.div
                        initial={{ top: "0%" }}
                        animate={{ top: "100%" }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_20px_hsl(var(--primary))]"
                      />
                    )}
                  </AnimatePresence>
                  
                  {/* Status icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      {displayState === 'idle' && (
                        <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <Scan className="w-12 h-12 text-primary/50" />
                        </motion.div>
                      )}
                      {displayState === 'scanning' && (
                        <motion.div
                          key="scanning"
                          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <Wifi className="w-12 h-12 text-primary" />
                        </motion.div>
                      )}
                      {displayState === 'processing' && (
                        <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        </motion.div>
                      )}
                      {displayState === 'success' && (
                        <motion.div
                          key="success"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          <CheckCircle2 className="w-16 h-16 text-accent" />
                        </motion.div>
                      )}
                      {displayState === 'error' && (
                        <motion.div key="error" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          <AlertCircle className="w-16 h-16 text-destructive" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Status text */}
              <div className="absolute bottom-6 left-0 right-0 text-center px-4">
                <p className="text-primary-foreground/80 text-sm font-medium">
                  {getStatusMessage()}
                </p>
                {lastPayment && displayState === 'success' && (
                  <p className="text-primary-foreground/60 text-xs mt-1 truncate">
                    TX: {lastPayment.txHash.slice(0, 10)}...{lastPayment.txHash.slice(-8)}
                  </p>
                )}
              </div>
            </div>

            {/* Bottom controls */}
            <div className="absolute bottom-4 left-4 right-4">
              <Button
                variant={displayState === 'scanning' || displayState === 'processing' ? "glass" : displayState === 'success' ? "success" : "hero"}
                size="lg"
                className="w-full"
                onClick={displayState === 'success' || displayState === 'error' ? handleReset : handleScan}
                disabled={displayState === 'scanning' || displayState === 'processing' || !isConnected}
              >
                {(displayState === 'scanning' || displayState === 'processing') && (
                  <Loader2 className="w-5 h-5 animate-spin" />
                )}
                {displayState === 'idle' && <Scan className="w-5 h-5" />}
                {displayState === 'success' && <CheckCircle2 className="w-5 h-5" />}
                {displayState === 'error' && <AlertCircle className="w-5 h-5" />}
                {getButtonText()}
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 space-y-2">
            {[
              "Connect your Web3 wallet",
              "Hold phone near vehicle NFC tag",
              "Payment processes automatically on-chain",
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
