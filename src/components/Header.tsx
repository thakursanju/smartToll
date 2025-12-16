import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Scanner", href: "#scanner" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "How It Works", href: "#how-it-works" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-4 mt-4">
        <nav className="container max-w-5xl mx-auto px-4 py-3 rounded-2xl glass-card shadow-soft">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">TollChain</span>
            </a>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" size="sm">
                Connect Wallet
              </Button>
              <Button variant="hero" size="sm">
                Get Started
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden overflow-hidden"
              >
                <div className="pt-4 pb-2 space-y-1">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                  <div className="pt-4 space-y-2">
                    <Button variant="outline" size="lg" className="w-full">
                      Connect Wallet
                    </Button>
                    <Button variant="hero" size="lg" className="w-full">
                      Get Started
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>
    </header>
  );
};

export default Header;
