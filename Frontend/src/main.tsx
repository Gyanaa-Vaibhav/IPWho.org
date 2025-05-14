import { StrictMode } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Nav } from "./Nav/components/Nav.tsx";
import { Landing } from "./Landing/components/Landing.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/home" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
