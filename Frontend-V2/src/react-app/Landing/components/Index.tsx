import { CardSection } from "./CardSection";
import { FAQSection } from "./FAQSection";
import { FeatureSection } from "./FeatureSection";
import { HeroSection } from "./HeroSection";

function IndexPage() {
    return (
        <>
            <HeroSection />
            <CardSection />
            <FeatureSection />
            <FAQSection />
        </>
    )
}

export default IndexPage