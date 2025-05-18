import { StrictMode } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Nav } from "./Nav/components/Nav.tsx";
import { Landing } from "./Landing/components/Landing.tsx";
import PrivacyPolicy from "./Legal/PrivacyPolicy.tsx";
import TermsAndConditions from "./Legal/TermsAndConditions.tsx";
import CodeOfConduct from "./Legal/CodeOfConduct.tsx";
import { Footer } from "./Footer/Footer.tsx";
import {Docs} from "./Docs/components/Docs.tsx";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/home" element={<Landing />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/legal/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/legal/terms-and-condition" element={<TermsAndConditions />} />
        <Route path="/legal/code-of-conduct" element={<CodeOfConduct />} />
        <Route path="/*" element={<Landing />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </StrictMode>
);

// TODO ADD THIS  [Your site name or product name] uses the IP2Location LITE database for <a href="https://lite.ip2location.com">IP geolocation</a>.