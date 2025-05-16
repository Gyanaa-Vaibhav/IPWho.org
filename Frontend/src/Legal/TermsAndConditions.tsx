import React from 'react';

const TermsAndConditions: React.FC = () => {

    React.useEffect(() => {
            document.title = "IPWHO | Terms and Conditions"
        },[])

    return (
        <section
            style={{
                fontFamily: 'Inter, sans-serif',
                // backgroundColor: 'var(--Text-Background)',
                color: 'var(--Text-Light)',
                padding: '4rem 1rem',
                maxWidth: '800px',
                margin: '0 auto',
                lineHeight: '1.8',
            }}
        >
            <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: '2.5rem', color: 'var(--Primary-Color)', marginBottom: '1rem' }}>
                Terms & Conditions
            </h1>

            <p style={{ fontSize: '0.95rem', marginBottom: '2rem' }}>
                <strong>Effective Date:</strong> May 15, 2025
            </p>

            <h2 style={headingStyle}>1. Use of the Service</h2>
            <p style={pStyle}>
                By using <strong>ipwho.org</strong>, you agree to comply with these Terms. The service is provided "as-is" and may change without notice.
            </p>

            <h2 style={headingStyle}>2. Free Tier Limits</h2>
            <p style={pStyle}>
                Free usage is capped at 100,000 requests per month. Abuse of the service or attempts to bypass rate limits may result in access revocation.
            </p>

            <h2 style={headingStyle}>3. Data Accuracy</h2>
            <p style={pStyle}>
                We strive to provide accurate geolocation data but do not guarantee 100% precision. All data is provided without warranty.
            </p>

            <h2 style={headingStyle}>4. Intellectual Property</h2>
            <p style={pStyle}>
                All code, branding, and original content are the intellectual property of ipwho.org unless otherwise noted. Respect all licenses if using our open-source parts.
            </p>

            <h2 style={headingStyle}>5. Termination</h2>
            <p style={pStyle}>
                We reserve the right to suspend or terminate access to users who violate these Terms or abuse the service.
            </p>

            <h2 style={headingStyle}>6. Changes</h2>
            <p style={pStyle}>
                These Terms may be updated. Continued use of the service implies acceptance of the latest version.
            </p>

            <div style={{ marginTop: '3rem', fontSize: '0.9rem' }}>
                Questions? Contact us at <strong>admin@ipwho.org</strong>.
            </div>
        </section>
    );
};

const headingStyle: React.CSSProperties = {
    color: 'var(--Accent-Color)',
    fontSize: '1.25rem',
    fontWeight: 600,
    marginTop: '2rem',
    marginBottom: '0.5rem',
};

const pStyle: React.CSSProperties = {
    fontSize: '0.95rem',
    marginBottom: '1.5rem',
};

export default TermsAndConditions;