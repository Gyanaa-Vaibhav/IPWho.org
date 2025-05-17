import '../styles/CardSection.css'
import { CardComponent } from "./CardComponent";
import LightningLogo from '../../assets/svg/Lightning.svg'
import World from '../../assets/svg/World.svg'
import Tool from '../../assets/svg/Tool-kit.svg'
import Money from '../../assets/svg/Money.svg'
import Brain from '../../assets/svg/Brain.svg'
import SafeAndSecure from '../../assets/svg/Secure-window.svg'

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
            imageAlt: "Lightning Bolt Icon",
            title: "Blazing Fast API",
            desc: "Hosted on high-speed VPS. Low latency. No rate-limiting headaches.",
        },
        {
            image: World,
            imageAlt: "Globe Icon",
            title: "Geolocation + ASN",
            desc: "Get accurate location, country, city, ASN, and ISP from a single endpoint.",
        },
        {
            image: Tool,
            imageAlt: "Tool Kit Icon",
            title: "Easy Integration",
            desc: "REST API. JSON responses. Copy-paste examples in curl, JS, and Python.",
        },
        {
            image: Money,
            imageAlt: "Cash Icon",
            title: "100% Free, No BS",
            desc: "Free up to 100K requests/month. No credit card. No hidden throttling.",
        },
        {
            image: Brain,
            imageAlt: "Brain Icon",
            title: "Open Source & Auditable",
            desc: "MIT licensed. Built on MaxMind, open for contributions.",
        },
        {
            image: SafeAndSecure,
            imageAlt: "Icon of Shield on Screen",
            title: "Safe and Secure",
            desc: "All data sent to and processed by our servers is secured via 256-bit SSL encryption (HTTPS).",
        },
    ]

    const filledData = data.map((d,i) => {
        return <CardComponent key={i} image={d.image} imageAlt={d.image} title={d.title} desc={d.desc} />
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