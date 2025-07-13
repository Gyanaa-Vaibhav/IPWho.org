import '../styles/Overview.css'

export function Overview() {
    return(
        <>
            <div className="overviewContainer">
                <div className="overview">
                    <h2>Overview</h2>
                    <p>
                        <em>IPWho</em> is a fast, free, and open-source IP Geolocation API built for developers who need accurate location and network data from an IP address — with zero signup required. Whether you're building dashboards, analytics, fraud detection, or personalization features, IPWho helps you enrich user data with just one simple API call.
                    </p>
                </div>
                <div className='whyIPWHO'>
                    <h3>Why IPWho?</h3>
                    <ul>
                        <li>No API key required — zero signup</li>
                        <li>Fast Redis-cached IP lookup</li>
                        <li>Supports IPv4 & IPv6</li>
                        <li>Accurate data from MaxMind + IP2Location LITE</li>
                        <li>Clean JSON response with country, city, timezone, currency, ASN, and more</li>
                    </ul>
                </div>
                <div className="builtFor">
                    <h3>Built For</h3>
                    <ul>
                        <li>Web apps and dashboards</li>
                        <li>Location-aware features</li>
                        <li>Ad-tech, analytics, fintech, e-commerce</li>
                        <li>Developers who want full control and no BS</li>
                    </ul>
                </div>
            </div>
        </>
    )
}