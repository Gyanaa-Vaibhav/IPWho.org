// import { motion } from "framer-motion";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// const sampleJson = `{
//   "ip": "8.8.8.8",
//   "city": "Mountain View",
//   "region": "California",
//   "country": "United States",
//   "postal": "94035",
//   "timezone": "America/Los_Angeles",
//   "latitude": 37.386,
//   "longitude": -122.0838
// }`;

// export function App() {
//   return (
//     <div
//       style={{
//         background: "#0f172a",
//         color: "#f8f8f2",
//         borderRadius: "8px",
//         padding: "1rem",
//         fontSize: "0.9rem",
//         fontFamily: "Fira Code, Menlo, monospace",
//         overflowX: "auto",
//         maxWidth: "700px",
//         margin: "0 auto",
//         boxShadow: "0 0 0 1px #1e293b"
//       }}
//     >
//       <div style={{ marginBottom: "1rem", color: "#38bdf8" }}>
//         curl https://ipwho.org/ip/8.8.8.8
//       </div>
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.3, duration: 0.4 }}
//       >
//         <SyntaxHighlighter language="json" style={atomDark} wrapLines>
//           {sampleJson}
//         </SyntaxHighlighter>
//       </motion.div>
//     </div>
//   );
// }

import {useEffect, useState} from "react";
import {motion} from "framer-motion";

export function App() {
    const [displayedLines, setDisplayedLines] = useState<string[]>([]);
    const [currentLine, setCurrentLine] = useState('');
    const [lineIndex, setLineIndex] = useState(0);
    const [cursorVisible, setCursorVisible] = useState(true);
    const [responseLines, setResponseLines] = useState<string[]>([]);

    // Example: after fetch
    useEffect(() => {
        const mockResponse = {
            ip: "8.8.8.8",
            city: "Mountain View",
            region: "California",
            country: "United States",
            postal: "94035",
            timezone: "America/Los_Angeles",
            latitude: 37.386,
            longitude: -122.0838,
        };

        const json = JSON.stringify(mockResponse);
        const lines = formatJsonToLines(json);
        setResponseLines(lines);
    }, []);

    useEffect(() => {
        const blink = setInterval(() => {
            setCursorVisible((prev) => !prev);
        }, 500);
        return () => clearInterval(blink);
    }, []);

    useEffect(() => {
        if (lineIndex >= responseLines.length) return;

        let charIndex = 0;
        const line = responseLines[lineIndex];
        const interval = setInterval(() => {
            charIndex++;
            setCurrentLine(line.slice(0, charIndex));

            if (charIndex >= line.length) {
                clearInterval(interval);
                setTimeout(() => {
                    setDisplayedLines((prev) => [...prev, line]);
                    setCurrentLine('');
                    setLineIndex((prev) => prev + 1);
                }, 100);
            }
        }, 10);

        return () => clearInterval(interval);
    }, [lineIndex, responseLines]);

    return (
        <div
            style={{
                background: "#0f172a",
                color: "#f8f8f2",
                borderRadius: "8px",
                padding: "1rem",
                fontSize: "0.9rem",
                fontFamily: "Fira Code, monospace",
                maxWidth: "700px",
                margin: "0 auto",
                whiteSpace: "pre-wrap",
            }}
        >
            <motion.div
                initial={{opacity: 0, y: -10}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.2, duration: 0.4}}
                style={{color: "#38bdf8", marginBottom: "1rem"}}
            >
                curl https://ipwho.org/ip/8.8.8.8
            </motion.div>

            {displayedLines.map((line, i) => (
                <motion.div
                    key={i}
                    initial={{opacity: 1}}
                    animate={{opacity: 1}}
                    transition={{delay: 0.1 * i}}
                >
                    {line}
                </motion.div>
            ))}
            {currentLine && (
                <div>
                    {currentLine}
                    {cursorVisible && <span style={{color: "#38bdf8"}}>|</span>}
                </div>
            )}
        </div>
    );
}

function formatJsonToLines(json: string): string[] {
    try {
        const parsed = JSON.parse(json);
        const pretty = JSON.stringify(parsed, null, 2); // 2-space indentation
        return pretty.split('\n');
    } catch {
        return [`{ "error": "Invalid JSON" }`];
    }
}

export function TerminalTypewriter({lines}: { lines: string[] }) {
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
                        {cursorVisible && <span style={{color: "#38bdf8"}}>|</span>}
                    </div>
                )}
            </div>
        </div>
    );
}