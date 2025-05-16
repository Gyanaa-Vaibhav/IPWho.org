import React from 'react';

const PrivacyPolicy: React.FC = () => {

    React.useEffect(() => {
        document.title = "IPWHO | Privacy and Policy"
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
                Privacy Policy
            </h1>

            <p style={{ fontSize: '0.95rem', marginBottom: '2rem' }}>
                <strong>Effective Date:</strong> May 15, 2025
            </p>

            <h2 style={headingStyle}>What We Collect</h2>
            <ul style={listStyle}>
                <li>IP addresses (for geolocation)</li>
                <li>Geographic metadata (country, region, city)</li>
                <li>Request details (timestamp, headers, errors)</li>
            </ul>

            <h2 style={headingStyle}>How We Use the Data</h2>
            <ul style={listStyle}>
                <li>To provide accurate geolocation responses</li>
                <li>To monitor performance and detect abuse</li>
                <li>To ensure fair usage for all users</li>
            </ul>

            <h2 style={headingStyle}>Data Retention</h2>
            <p style={pStyle}>
                We keep anonymized logs temporarily (7–30 days) for monitoring. We do not permanently store or link data to individuals.
            </p>

            <h2 style={headingStyle}>Third-Party Services</h2>
            <p style={pStyle}>
                We do not sell or share your data. We may use infrastructure services (e.g. hosting, analytics) that handle anonymized technical info only.
            </p>

            <h2 style={headingStyle}>Your Rights</h2>
            <p style={pStyle}>
                You may contact us at <strong>admin@ipwho.org</strong> to request data clarification or deletion.
            </p>

            <h2 style={headingStyle}>Changes to This Policy</h2>
            <p style={pStyle}>
                We may revise this privacy policy occasionally. We will post updates directly on this page.
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

const listStyle: React.CSSProperties = {
    paddingLeft: '1.5rem',
    marginBottom: '1.5rem',
    fontSize: '0.95rem',
};

const pStyle: React.CSSProperties = {
    fontSize: '0.95rem',
    marginBottom: '1.5rem',
};

export default PrivacyPolicy;