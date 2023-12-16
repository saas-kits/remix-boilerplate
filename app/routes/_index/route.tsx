import type { MetaFunction } from "@remix-run/node";
import { HeroSection } from "./hero-section";
import { LogoCloud } from "./logo-cloud";
import { FeatureSection } from "./feature-section";
import Faqs from "./faq";
import FeaturesVariantB from "./features-variant-b";
import Footer from "./footer";
import FeatureWithImage from "./feature-with-image";
export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const loginFeatures = [
  "Lorem ipsum, dolor sit amet consectetur adipisicing elit aute id magna.",
  "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.",
  "Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus.",
];

export default function Index() {
  return (
    <div className="h-full">
      <HeroSection />
      <div className="relative z-10">
        <LogoCloud />
        <FeatureSection />
        <FeatureWithImage
          features={loginFeatures}
          title="Social and Email Password Login"
          darkFeatureImage="/login-dark.jpeg"
          lightFeatureImage="/login-light.jpeg"
        />
        <FeaturesVariantB />
        <Faqs />
        <Footer />
      </div>
    </div>
  );
}
