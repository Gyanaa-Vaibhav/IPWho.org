import '../styles/HeroSection.css';
import globe from '../../../assets/svg/Globe.svg?url'
import React, { useEffect, useState } from "react";

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

    useEffect(()=>{
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
                <img src={globe} alt="World Globe" loading='lazy'/>
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


function TerminalTypewriter({ lines }: { lines: string[] }) {
    const [displayedLines, setDisplayedLines] = useState<string[]>([]);
    const [currentLine, setCurrentLine] = useState('');
    const [lineIndex, setLineIndex] = useState(0);
    const [cursorVisible, setCursorVisible] = useState(true);

    useEffect(() => {
        const blink = setInterval(() => setCursorVisible(prev => !prev), 500);
        return () => clearInterval(blink);
    }, []);

    useEffect(() => {
        if (lineIndex >= lines.length) return;
        let charIndex = 0;
        const line = lines[lineIndex];
        const interval = setInterval(() => {
            charIndex++;
            setCurrentLine(line.slice(0, charIndex));
            if (charIndex >= line.length) {
                clearInterval(interval);
                setTimeout(() => {
                    setDisplayedLines(prev => [...prev, line]);
                    setCurrentLine('');
                    setLineIndex(prev => prev + 1);
                }, 100);
            }
        }, 5);
        return () => clearInterval(interval);
    }, [lineIndex, lines]);

    return (
        <div>
            <div
                style={{
                    background: "#0f172a",
                    color: "#f8f8f2",
                    borderRadius: "8px",
                    minWidth: "30vw",
                    padding: "1rem",
                    fontSize: "0.9rem",
                    fontFamily: "Fira Code, monospace",
                    maxWidth: "700px",
                    margin: "0 auto",
                    whiteSpace: "pre-wrap"
                }}
            >
                {displayedLines.map((line, i) => (
                    <div className="line" key={i}><p>{line}</p></div>
                ))}
                {currentLine && (
                    <div>
                        <p className="line">{currentLine}</p>
                        {cursorVisible && <span style={{ color: "#38bdf8" }}>|</span>}
                    </div>
                )}
            </div>
        </div>
    );
}