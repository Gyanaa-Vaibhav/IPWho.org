import { CardSection } from "./CardSection";
import { FAQSection } from "./FAQSection";
import { FeatureSection } from "./FeatureSection";
import { HeroSection } from "./HeroSection";

export function Landing() {
    return (
        <>
            <HeroSection />
            <CardSection />
            <FeatureSection />
            <FAQSection />
        </>
    )
}