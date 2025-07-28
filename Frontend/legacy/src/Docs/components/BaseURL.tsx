import '../styles/BaseURL.css'
import {a11yDark} from "react-syntax-highlighter/dist/esm/styles/hljs";
import SyntaxHighlighter from "react-syntax-highlighter";

export function BaseURL() {
    return(
        <>
            <div className='baseurl'>
                <h2>Endpoints</h2>
                <div className="endPointTable">
                <table className="apiTable">
                    <thead>
                    <tr>
                        <th>Method</th>
                        <th>Endpoint</th>
                        <th>Description</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>GET</td>
                        <td>/me</td>
                        <td>Returns geolocation data of the caller</td>
                    </tr>
                    <tr>
                        <td>GET</td>
                        <td>/:ip</td>
                        <td>Returns data for a specific IP address</td>
                    </tr>
                    <tr>
                        <td>GET</td>
                        <td>/:ip?get=country,city,currency</td>
                        <td>Filters response to specific fields only</td>
                    </tr>
                    <tr>
                        <td>GET</td>
                        <td>/bulk/:ip1,ip2,...</td>
                        <td>Returns geolocation data for multiple IPs</td>
                    </tr>
                    </tbody>
                </table>
                </div>
                <h3>Example Requests</h3>

                <pre>
                    Get your own IP info:
                    <SyntaxHighlighter language={'https'} style={a11yDark}>
                        {"GET https://api.ipwho.org/me"}
                    </SyntaxHighlighter>
                    Get info for a specific IP:
                    <SyntaxHighlighter language={'https'} style={a11yDark}>
                        {"GET https://api.ipwho.org/8.8.8.8"}
                    </SyntaxHighlighter>
                    Filter response (only country, city, currency):
                    <SyntaxHighlighter language={'https'} style={a11yDark}>
                        {"GET https://api.ipwho.org/8.8.8.8?get=country,city,currency"}
                    </SyntaxHighlighter>
                    Bulk lookup:
                    <SyntaxHighlighter language={'https'} style={a11yDark}>
                        {"GET https://api.ipwho.org/bulk/8.8.8.8,1.1.1.1"}
                    </SyntaxHighlighter>
                </pre>

                <h3>JavaScript Fetch Example</h3>
                <pre>
                    <SyntaxHighlighter language="javascript" style={a11yDark}>
                        {`fetch('https://api.ipwho.org/8.8.8.8?get=country,city,currency')\n.then(res => res.json())\n.then(data => console.log(data));`}
                    </SyntaxHighlighter>
                </pre>

                <h3>cURL Examples</h3>
                <pre>
                    <SyntaxHighlighter language="bash" style={a11yDark}>
                        {`curl "https://api.ipwho.org/me"\ncurl "https://api.ipwho.org/1.1.1.1"\ncurl "https://api.ipwho.org/1.1.1.1?get=country,city"\ncurl "https://api.ipwho.org/bulk/1.1.1.1,8.8.8.8"`}
                    </SyntaxHighlighter>
</pre>
            </div>
        </>
    )
}