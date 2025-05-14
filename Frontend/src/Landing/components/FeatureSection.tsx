import '../styles/FeatureSection.css'
import { FeatureComponent } from "./FeatureComponent";

type data = {
    title: string,
    para1: string,
    para2: string,
}

export function FeatureSection() {

    const data: data[] = [
        {
            title: "Pinpoint Any IP in the World",
            para1: "IPWHO gives you high-accuracy IP geolocation without complexity. You’ll get precise information like city, region, postal code, and timezone — down to the GPS-level coordinates with an estimated accuracy radius. Whether you’re building a security layer, location-based customization, or analytics dashboards, this data is vital.",
            para2: "Traditional APIs hide this behind paywalls. We’re offering full geolocation data built on top of MaxMind’s GeoLite2 — for free. You don’t even need to set up billing to start using it.",
        },
        {
            title: "Currency, Language, and Cultural Context",
            para1: "Every IP tells a deeper story than just location. IPWHO enriches your data with powerful country-level intelligence — including currency info, phone calling code, official languages, flag emoji, capital city, and even whether the IP is inside the EU (great for GDPR compliance).",
            para2: "This kind of enriched data is usually spread across several APIs. We bring it together in one fast, free call — perfect for building localized apps, regional pricing, or showing contextual details to users worldwide.",
        },
        {
            title: "Know Who Owns the IP",
            para1: "Understanding who owns or operates an IP is critical for fraud detection, infrastructure decisions, and even customer intelligence. IPWHO provides real-time ASN (Autonomous System Number) and ISP information — telling you if it’s a datacenter, residential IP, or tied to a big player like Google, AWS, or Cloudflare.",
            para2: "This gives context about the IP’s trustworthiness and source. Many premium APIs reserve ASN/ISP data for higher tiers — we deliver it by default.",
        },
        {
            title: "No Tokens. No Waiting. Just Speed.",
            para1: "Every call to ipwho.org is blazing fast and completely rate-limit-free for up to 100,000 requests/month. You don’t need a credit card, signup, or API token to try it — just make a request. That means faster development, better prototyping, and one less barrier between you and your users.",
            para2: "Most IP APIs gate everything behind tokens, keys, quotas, and sometimes even region blocks. We want to change that — with an API that feels like it was made for devs first.",
        },

    ]

    const filledData = data.map(d => <FeatureComponent title={ d.title } para1={ d.para1 } para2={ d.para2 } />)

    return (
        <>
            <section className='featureSection'>
                <h3 className={ "featureSectionTitle" }>Powerful Features, Zero Cost</h3>
                <div className='featureHolder'>
                    {filledData}
                </div>
            </section>
        </>
    )
}