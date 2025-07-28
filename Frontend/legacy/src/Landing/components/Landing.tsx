import React from "react";
import { CardSection } from "./CardSection";
import { FAQSection } from "./FAQSection";
import { FeatureSection } from "./FeatureSection";
import { HeroSection } from "./HeroSection";

export function Landing() {

    React.useEffect(() => {
        document.title = "Open Source IP Intelligence API"
    }, [])
    
    return (
        <>
            <HeroSection />
            <CardSection />
            <FeatureSection />
            <FAQSection />
        </>
    )
}