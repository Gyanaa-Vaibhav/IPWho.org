import "../styles/FAQComponent.css";
import { FAQComponent } from "./FAQComponent";

export function FAQSection() {
    
    return (
        <>
            <section className='FAQSection'>
                <h2 className="FAQSectionTitle">Got Questions? We’ve Got Answers.</h2>
                <div className="questionContainer">
                    <FAQComponent />
                </div>
            </section>
        </>
    )
}