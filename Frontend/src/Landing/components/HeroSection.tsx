import '../styles/HeroSection.css';
import globe from '../../assets/svg/Globe.svg'

export function HeroSection(){ 
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

            </div>
        </main>
    );
}
