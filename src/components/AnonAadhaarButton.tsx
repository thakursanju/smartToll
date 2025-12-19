import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ShieldCheck, Loader2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAnonAadhaar } from '@/hooks/useAnonAadhaar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export const AnonAadhaarButton = () => {
  const { status, proof, isVerified, startVerification, logout, error } = useAnonAadhaar();

  if (isVerified && proof) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20">
          <ShieldCheck className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-accent">Verified</span>
        </div>
        <Button variant="ghost" size="icon" onClick={logout} className="h-8 w-8">
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Shield className="w-4 h-4" />
          Anon-Aadhaar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Anonymous Identity Verification
          </DialogTitle>
          <DialogDescription>
            Verify your identity using Anon-Aadhaar without revealing personal information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Anon-Aadhaar uses zero-knowledge proofs to verify your Indian citizenship without exposing:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Your name or address</li>
              <li>Your Aadhaar number</li>
              <li>Any personal identifiable information</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
            <h4 className="font-medium mb-2">How it works:</h4>
            <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
              <li>Upload your Aadhaar QR code</li>
              <li>Generate a zero-knowledge proof</li>
              <li>Proof is verified on-chain</li>
            </ol>
          </div>

          <AnimatePresence mode="wait">
            {status === 'verifying' ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3 py-4"
              >
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Generating ZK proof...</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {error && (
                  <p className="text-sm text-destructive mb-4">{error}</p>
                )}
                <Button
                  onClick={startVerification}
                  className="w-full"
                  variant="hero"
                >
                  <Shield className="w-4 h-4" />
                  Start Verification
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-3">
                  Demo mode: Click to simulate verification
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};
