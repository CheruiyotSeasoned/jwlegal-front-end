import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { LegalCategories } from "@/components/LegalCategories";
import { UserTypes } from "@/components/UserTypes";
import { Pricing } from "@/components/Pricing";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <LegalCategories />
      <UserTypes />
      <Pricing />
      <Footer />
    </div>
  );
};

export default Index;
