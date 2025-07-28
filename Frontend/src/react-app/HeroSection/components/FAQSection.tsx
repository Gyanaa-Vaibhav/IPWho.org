import "../styles/FAQComponent.css";
import { FAQComponent } from "./UIComponents/FAQComponent.tsx";

export default function FAQSection() {
    
    return (
        <>
            <section id="FAQ" className='FAQSection'>
                <h2 className="FAQSectionTitle">Got Questions? We’ve Got Answers.</h2>
                {/*<div className="questionContainer">*/}
                    <FAQComponent />
                {/*</div>*/}
            </section>
        </>
    )
}