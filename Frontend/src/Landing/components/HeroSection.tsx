import '../styles/HeroSection.css';
import globe from '../../assets/svg/Globe.svg'
import { TerminalTypewriter } from '../../App';
import React from "react";

const url = import.meta.env.VITE_SERVER ? `${import.meta.env.VITE_SERVER}/me` : "/me";

function formatData(data: any) {
    return {
        ip:data.ip,
        country: data.country,
        country_code: data.country_code,
        location: {
            latitude:data.latitude,
            longitude:data.longitude,
            time_zone: data.time_zone,
        },
        is_in_eu: data.is_in_eu,
        asn: {
            number : data.asn.number,
            org:data.asn.org
        },
    };
}

export function HeroSection(){
    const [lines,setLines] = React.useState<string[]>([""]);

    React.useEffect(()=>{
        let rawData = {
            ip: "49.206.110.31",
            country: "India",
            country_code: "IN",
            org: "Airtel Broadband",
            latitude: 17.3850,
            longitude: 78.4867,
            currency: { code: "INR", symbol: "₹" },
            is_vpn: false
        };

        fetch(url).then(r => r.json()).then(d => {
            if(d.success){
                const data = formatJsonToLines(JSON.stringify(formatData(d.data)))
                setLines(data);
            }else{
                setLines(formatJsonToLines(JSON.stringify(rawData)))
            }
        })

    },[])

    return (
        <main>
            <div className='content'>
                <h1 className='title'>Open Source IP <br/>Intelligence API</h1>
                <h3 className='subTitle'>Fast response and accurate data</h3>
                <p>Get accurate IP location, ASN, and WHOIS data — no rate limits, no nonsense. Built for developers. Free up to 100,000 requests per month.</p>
                <button className='signUpCTA'>Sign up for <span>Free</span></button>
                <small>&#42; No credit card required</small>
                <img src={globe} alt="World Globe" />
            </div>
            <div>
                <TerminalTypewriter lines={lines}/>
            </div>
        </main>
    );
}

export function formatJsonToLines(json: string): string[] {
    try {
        const parsed = JSON.parse(json);
        const pretty = JSON.stringify(parsed, null, 2); // 2-space indentation
        return pretty.split('\n');
    } catch {
        return [`{ "error": "Invalid JSON" }`];
    }
  }
