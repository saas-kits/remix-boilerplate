import type { MetaFunction } from "@remix-run/node";
import { HeroSection } from "./hero-section";
import { LogoCloud } from "./logo-cloud";
import { FeatureSection } from "./feature-section";
import Pricing from "./pricing";
import Faqs from "./faq";
import FeaturesVariantB from "./features-variant-b";
import Footer from "./footer";
export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="h-full">
      <HeroSection />
      <div className="relative z-10">
        <LogoCloud />
        <FeatureSection />
        <FeaturesVariantB />
        <Pricing />
        <Faqs />
        <Footer />
      </div>
    </div>
  );
}
