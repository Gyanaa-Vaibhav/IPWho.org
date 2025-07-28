import '../styles/Response.css'
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import a11yDark from "react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark"

export function Response() {
    return(
        <>
            <div className='responseContainer'>
                <h3>Example Response</h3>
                <div className="responseTable">
            <table className="apiTable">
                <thead>
                <tr>
                    <th>Field</th>
                    <th>Type</th>
                    <th>Description</th>
                </tr>
                </thead>
                <tbody>
                <tr><td>success</td><td>boolean</td><td>Query Result</td></tr>
                <tr><td>ip</td><td>string</td><td>IP address queried</td></tr>
                <tr><td>continent</td><td>string</td><td>Continent name</td></tr>
                <tr><td>continentCode</td><td>string</td><td>ISO continent code</td></tr>
                <tr><td>country</td><td>string</td><td>Country name</td></tr>
                <tr><td>countryCode</td><td>string</td><td>2-letter ISO country code</td></tr>
                <tr><td>capital</td><td>string</td><td>Capital city of the country</td></tr>
                <tr><td>region</td><td>string</td><td>Region/state name</td></tr>
                <tr><td>regionCode</td><td>string</td><td>Region/state code</td></tr>
                <tr><td>city</td><td>string</td><td>City name</td></tr>
                <tr><td>postal_Code</td><td>string</td><td>Postal/ZIP code</td></tr>
                <tr><td>time_zone</td><td>string</td><td>IANA time zone (e.g. America/New_York)</td></tr>
                <tr><td>latitude</td><td>number</td><td>Geographic latitude</td></tr>
                <tr><td>longitude</td><td>number</td><td>Geographic longitude</td></tr>
                <tr><td>accuracy_radius</td><td>number</td><td>Estimated accuracy in kilometers</td></tr>
                <tr><td>is_in_eu</td><td>boolean</td><td>True if country is in the EU</td></tr>
                <tr><td>dial_code</td><td>string</td><td>Country dialing code</td></tr>
                <tr><td>flag</td><td>string</td><td>Country emoji flag</td></tr>
                <tr><td>flag_unicode</td><td>string</td><td>Unicode code for the flag</td></tr>
                <tr><td>currency.code</td><td>string</td><td>Currency code (e.g. USD)</td></tr>
                <tr><td>currency.symbol</td><td>string</td><td>Currency symbol (e.g. $)</td></tr>
                <tr><td>currency.name</td><td>string</td><td>Full currency name</td></tr>
                <tr><td>currency.name_plural</td><td>string</td><td>Plural currency name</td></tr>
                <tr><td>asn.number</td><td>number</td><td>Autonomous System Number</td></tr>
                <tr><td>asn.org</td><td>string</td><td>ASN organization or ISP name</td></tr>
                </tbody>
            </table>
                </div>
                <SyntaxHighlighter customStyle={{padding:"0.5rem 2rem"}} language={'https'} style={a11yDark}>
                    {"{\n" +
                        "  \"success\": true,\n" +
                        "  \"data\": {\n" +
                        "    \"ip\": \"12.34.2.0\",\n" +
                        "    \"continent\": \"North America\",\n" +
                        "    \"continentCode\": \"NA\",\n" +
                        "    \"country\": \"United States\",\n" +
                        "    \"countryCode\": \"US\",\n" +
                        "    \"capital\": \"Washington\",\n" +
                        "    \"region\": \"Maryland\",\n" +
                        "    \"regionCode\": \"MD\",\n" +
                        "    \"city\": \"Baltimore\",\n" +
                        "    \"postal_Code\": \"21275\",\n" +
                        "    \"time_zone\": \"America/New_York\",\n" +
                        "    \"latitude\": 39.2889,\n" +
                        "    \"longitude\": -76.623,\n" +
                        "    \"accuracy_radius\": 20,\n" +
                        "    \"is_in_eu\": false,\n" +
                        "    \"dial_code\": \"+1\",\n" +
                        "    \"flag\": \"🇺🇸\",\n" +
                        "    \"flag_unicode\": \"U+1F1FA U+1F1F8\",\n" +
                        "    \"currency\": {\n" +
                        "      \"code\": \"USD\",\n" +
                        "      \"symbol\": \"$\",\n" +
                        "      \"name\": \"US Dollar\",\n" +
                        "      \"name_plural\": \"US dollars\"\n" +
                        "    },\n" +
                        "    \"asn\": {\n" +
                        "      \"number\": 7018,\n" +
                        "      \"org\": \"ATT-INTERNET4\"\n" +
                        "    }\n" +
                        "  }\n" +
                        "}"}
                </SyntaxHighlighter>
            </div>
        </>
    )
}