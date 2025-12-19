import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Shield } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { WalletButton } from "@/components/WalletButton";
import { AnonAadhaarButton } from "@/components/AnonAadhaarButton";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "Scanner", href: "/#scanner" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Operator", href: "/operator" },
  { label: "Proof", href: "/payment-proof" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-4 mt-4">
        <nav className="container max-w-5xl mx-auto px-4 py-3 rounded-2xl glass-card shadow-soft">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">SmartToll</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                link.href.startsWith("/#") && isHome ? (
                  <a
                    key={link.href}
                    href={link.href.replace("/", "")}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                ) : link.href.startsWith("/#") ? (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      location.pathname === link.href 
                        ? "text-primary" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <AnonAadhaarButton />
              <WalletButton />
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
                    link.href.startsWith("/#") ? (
                      <a
                        key={link.href}
                        href={isHome ? link.href.replace("/", "") : link.href}
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-3 rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                          location.pathname === link.href 
                            ? "bg-primary/10 text-primary" 
                            : "hover:bg-secondary"
                        }`}
                      >
                        {link.label}
                      </Link>
                    )
                  ))}
                  <div className="pt-4 space-y-2">
                    <div className="px-4">
                      <AnonAadhaarButton />
                    </div>
                    <div className="px-4">
                      <WalletButton />
                    </div>
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
