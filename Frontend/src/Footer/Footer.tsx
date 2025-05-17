import './Footer.css';

export function Footer() {
    return (
        <footer>
            <div className='footerContainer'>
                <div className='footerNavigation'>
                    <h4>Navigation</h4>
                    <ul>
                        <li><a href="">Docs</a></li>
                        <li><a href="https://github.com/Gyanaa-Vaibhav/ipwho.org" target="_blank">GitHub</a></li>
                        <li><a href="">API Status</a></li>
                    </ul>
                </div>
                <div className='footerOpenSource'>
                    <h4>Open Source</h4>
                    <ul>
                        <li><a href="https://github.com/Gyanaa-Vaibhav/IPWho.org/blob/main/LICENSE" target="_blank">MIT License</a></li>
                        <li><a href="https://github.com/Gyanaa-Vaibhav/ipwho.org" target="_blank">Contribute on Github</a></li>
                    </ul>
                </div>
                <div className='footerLegal'>
                    <h4>Legal</h4>
                    <ul>
                        <li><a href="/legal/terms-and-condition">Terms and Condition</a></li>
                        <li><a href="/legal/privacy-policy">Privacy Policy</a></li>
                        <li><a href="/legal/code-of-conduct">Code of Conduct</a></li>
                    </ul>
                </div>
            </div>
            <div className='credits'>© {new Date().getFullYear()} ipwho.org — Made with ❤️ by <a href="">Gyanaa Vaibhav</a></div>
        </footer>
    )
}