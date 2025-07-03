import '../styles/CardSection.css'
import { CardComponent } from "./CardComponent";
import LightningLogo from '../../../assets/svg/Lightning.svg?url'
import World from '../../../assets/svg/World.svg?url'
import Tool from '../../../assets/svg/Tool-kit.svg?url'
import Money from '../../../assets/svg/Money.svg?url'
import Brain from '../../../assets/svg/Brain.svg?url'
import SafeAndSecure from '../../../assets/svg/Secure-window.svg?url'

type data = {
    image: string,
    imageAlt: string,
    title: string,
    desc: string
}

export function CardSection() {

    const data: data[] = [
        {
            image: LightningLogo,
            imageAlt: "Fast performance",
            title: "Blazing Fast API",
            desc: "Hosted on high-speed VPS. Low latency. No rate-limiting headaches.",
        },
        {
            image: World,
            imageAlt: "Global geolocation support",
            title: "Geolocation + ASN",
            desc: "Get accurate location, country, city, ASN, and ISP from a single endpoint.",
        },
        {
            image: Tool,
            imageAlt: "Easy integration tools",
            title: "Easy Integration",
            desc: "REST API. JSON responses. Copy-paste examples in curl, JS, and Python.",
        },
        {
            image: Money,
            imageAlt: "Free tier with generous limits",
            title: "100% Free, No BS",
            desc: "Free up to 100K requests/month. No credit card. No hidden throttling.",
        },
        {
            image: Brain,
            imageAlt: "Open source and transparent",
            title: "Open Source & Auditable",
            desc: "MIT licensed. Built on MaxMind, open for contributions.",
        },
        {
            image: SafeAndSecure,
            imageAlt: "Secure connection via HTTPS",
            title: "Safe and Secure",
            desc: "All data sent to and processed by our servers is secured via 256-bit SSL encryption (HTTPS).",
        },
    ]

    const filledData = data.map((d,i) => {
        return <CardComponent key={i} image={d.image} imageAlt={d.imageAlt} title={d.title} desc={d.desc} />
    })
        
    return (
        <>
            <section className='cardSection'>
                <h2 className="cardSectionTitle">Fast, Reliable, and Truly Free.</h2>
                <div className='cardHolder'>
                    {filledData}
                </div>
            </section>
        </>
    )
}