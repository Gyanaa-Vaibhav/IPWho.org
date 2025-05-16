import "../styles/FAQComponent.css";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const faqs = [
  {
    question: "Is IPWHO really free?",
    answer:"Yes! You can make up to 100,000 requests per month for free — no credit card required. The free tier includes all core features like geolocation, WHOIS/ASN info, and country-level data.",
  },
  {
    question: "How accurate is the location data?",
    answer:"We use MaxMind’s GeoLite2 database, which is one of the most reliable IP geolocation sources available.",
  },
  {
    question: "Can I self-host the API?",
      answer: "Yes. IPWHO is open-source, and you can deploy it to your own VPS or container. Perfect if you need full control or unlimited requests.",
  },
  {
      question: "How often is the data updated?",
      answer: "We update the core MaxMind databases weekly to ensure fresh and accurate data. Country metadata and static mappings (currency, language, etc.) are kept in sync manually as needed.",
  },
  {
      question: "Is this suitable for GDPR compliance?",
      answer: "Yes. You can use the is_in_eu flag to dynamically adjust privacy or cookie settings based on whether a user is located in the EU.",
  },
];

export function FAQComponent() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faqHolder">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className="faqComponentHolder">
            <button className="faqQuestion" onClick={() => toggleFAQ(index)}>
              {faq.question}
                    <span className={`arrow ${isOpen ? "open" : ""}`}>
                        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 14.4286H13.4286V23H10.5714V14.4286H2V11.5714H10.5714V3H13.4286V11.5714H22V14.4286Z" fill="#14B8A6" />
                        </svg>
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="faq-motion-wrapper"
                >
                  <div className="faq-answer">{faq.answer}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}