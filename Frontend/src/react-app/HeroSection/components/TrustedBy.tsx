import React from 'react';
import '../styles/TrustedBy.css';
import { motion } from "framer-motion";
import GoogleAnalytics from "../../../assets/svg/googleanalytics.svg?url";
import AWS from "../../../assets/svg/aws.svg?url";
import DataDog from "../../../assets/svg/datadog.svg?url";
import Github from "../../../assets/svg/github.svg?url";
import Akamai from "../../../assets/svg/akamai.svg?url";
import Supabase from "../../../assets/svg/supabase.svg?url";
import Netflix from "../../../assets/svg/netflix.svg?url";
import Postman from "../../../assets/svg/postman.svg?url";
import Docker from "../../../assets/svg/docker.svg?url";

const logos = [
    { src: GoogleAnalytics, name: "Google" },
    { src: AWS, name: "AWS" },
    { src: DataDog, name: "DataDog" },
    { src: Github, name: "Github" },
    { src: Akamai, name: "Akamai" },
    { src: Supabase, name: "Supabase" },
    { src: Netflix, name: "Netflix" },
    { src: Postman, name: "Postman" },
    { src: Docker, name: "Docker" },
];


export default function TrustedBySection() {
    return (
        <section className="trusted-section">
            <div className="trusted-container">
                <h2 className="trusted-heading">
                    Trusted by top developers and leading companies
                </h2>

                <div className="trusted-scroll-wrapper">
                    <motion.div
                        className="trusted-scroll"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{
                            ease: "linear",
                            duration: 25,
                            repeat: Infinity,
                        }}
                    >
                        {[...logos, ...logos].map((logo, i) => (
                            <div className="trusted-logo-item" key={i}>
                                <img src={logo.src} alt={`${logo.name} logo`} className="trusted-logo" />
                            </div>
                        ))}
                    </motion.div>

                    <div className="trusted-fade fade-left"></div>
                    <div className="trusted-fade fade-right"></div>
                </div>
            </div>
        </section>
    );
}