import { StrictMode } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Nav } from "./Nav/components/Nav.tsx";
import { Landing } from "./Landing/components/Landing.tsx";
import {App, TerminalTypewriter} from "./App.tsx";
import PrivacyPolicy from "./Legal/PrivacyPolicy.tsx";
import TermsAndConditions from "./Legal/TermsAndConditions.tsx";
import CodeOfConduct from "./Legal/CodeOfConduct.tsx";
import { Footer } from "./Footer/Footer.tsx";

const jsonMode = false; // toggle with a button

const rawData = {
  ip: "49.206.110.31",
  country: "India",
  country_code: "IN",
  org: "Airtel Broadband",
  latitude: 17.3850,
  longitude: 78.4867,
  currency: { code: "INR", symbol: "₹" },
  is_vpn: false
};

const lines = jsonMode
  ? formatJsonToLines(JSON.stringify(rawData))
  : formatHumanFriendly(rawData);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/home" element={<Landing />} />
        <Route path="/app" element={<App />} />
        <Route path="/app2" element={<TerminalTypewriter lines={lines}/>} />
        <Route path="/legal/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/legal/terms-and-condition" element={<TermsAndConditions />} />
        <Route path="/legal/code-of-conduct" element={<CodeOfConduct />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </StrictMode>
);


export function formatHumanFriendly(ipData: any): string[] {
  return [
    "> Detecting IP...",
    `> Found: ${ipData.ip}`,
    `> Location: ${ipData.country} ${ipData.country_code ? getFlagEmoji(ipData.country_code) : ''}`,
    `> ISP: ${ipData.org || "Unknown"}`,
    `> Lat: ${ipData.latitude}, Long: ${ipData.longitude}`,
    `> Currency: ${ipData.currency?.code || "?"} (${ipData.currency?.symbol || "?"})`,
    `> Status: ✅ ${ipData.is_vpn ? "VPN/Proxy Detected" : "Non-VPN"}`
  ];
}

function getFlagEmoji(code: string): string {
  return code
    .toUpperCase()
    .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt(0)));
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

// TODO ADD THIS  [Your site name or product name] uses the IP2Location LITE database for <a href="https://lite.ip2location.com">IP geolocation</a>.