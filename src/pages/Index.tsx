import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import RFIDScanner from "@/components/RFIDScanner";
import TransactionDashboard from "@/components/TransactionDashboard";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <RFIDScanner />
        <TransactionDashboard />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
