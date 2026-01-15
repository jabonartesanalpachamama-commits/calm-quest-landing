import HeroSection from "@/components/HeroSection";
import ConnectionSection from "@/components/ConnectionSection";
import BenefitsSection from "@/components/BenefitsSection";
import SocialProofSection from "@/components/SocialProofSection";
import GuaranteeSection from "@/components/GuaranteeSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ConnectionSection />
      <BenefitsSection />
      <SocialProofSection />
      <GuaranteeSection />
      <Footer />
    </main>
  );
};

export default Index;
