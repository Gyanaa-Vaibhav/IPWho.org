import React from 'react';

const CodeOfConduct: React.FC = () => {

    React.useEffect(() => {
        document.title = "IPWHO | Code of Conduct"
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
                Code of Conduct
            </h1>

            <p style={{ fontSize: '0.95rem', marginBottom: '2rem' }}>
                <strong>Effective Date:</strong> May 15, 2025
            </p>

            <h2 style={headingStyle}>1. Respect and Inclusion</h2>
            <p style={pStyle}>
                We value a welcoming, respectful environment. All contributors, users, and visitors are expected to treat others with dignity and kindness.
            </p>

            <h2 style={headingStyle}>2. No Abuse or Harassment</h2>
            <p style={pStyle}>
                Harassment, hate speech, or any kind of personal attack will not be tolerated. Violators may be removed and blocked from the project.
            </p>

            <h2 style={headingStyle}>3. Responsible Use</h2>
            <p style={pStyle}>
                Do not abuse the service, spam endpoints, or attempt to circumvent rate limits. Help us keep the API clean and fair for everyone.
            </p>

            <h2 style={headingStyle}>4. Open Source Collaboration</h2>
            <p style={pStyle}>
                Contributions are welcome! Be constructive in pull requests and respectful in discussions. We believe in building with integrity.
            </p>

            <h2 style={headingStyle}>5. Reporting Issues</h2>
            <p style={pStyle}>
                To report violations or behavior that goes against this code, email us at <strong>admin@ipwho.org</strong>. We take concerns seriously and act quickly.
            </p>

            <div style={{ marginTop: '3rem', fontSize: '0.9rem' }}>
                Thank you for helping make ipwho.org a respectful space.
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

export default CodeOfConduct;