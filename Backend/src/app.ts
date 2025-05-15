import maxmind,{CityResponse} from 'maxmind';
import * as path from 'node:path';
import * as fs from 'node:fs';
import * as url from "node:url";
import { IP2Proxy } from 'ip2proxy-nodejs';
import express from 'express';
import { Reader } from '@maxmind/geoip2-node';

const app = express()
const PORT = 5172;
app.get('/', (req, res) => {
    res.json({success:true,message:"Hello"})
})

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cityPath = path.resolve(__dirname, '../mainFiles/GeoLite2-City/GeoLite2-City.mmdb');
const asnPath = path.resolve(__dirname, '../mainFiles/GeoLite2-ASN/GeoLite2-ASN.mmdb');
const cityLookup = await maxmind.open(cityPath);
const cityBuffer = fs.readFileSync(cityPath);
const cityReader = Reader.openBuffer(cityBuffer);
// const response = cityReader.city('128.101.101.101');
// console.log(response);

const asnLookup = await maxmind.open(asnPath);

const ip2proxy = new IP2Proxy();
const ipProxyPath = path.resolve(__dirname, "../mainFiles/IP2PROXY-LITE/IP2PROXY-LITE-PX11.BIN")
ip2proxy.open(ipProxyPath);

const ip2Location = new IP2Proxy();
const ipLocationPath = path.resolve(__dirname, "../mainFiles/IP2LOCATION-LITE-ipV4/IP2LOCATION-LITE-IPV4.BIN")
ip2Location.open(ipLocationPath);


function getLocation(ip:string) {
    if (ip2proxy.open(ipProxyPath) == 0) {
        console.log("GetModuleVersion: " + ip2proxy.getModuleVersion());
        console.log("GetPackageVersion: " + ip2proxy.getPackageVersion());
        console.log("GetDatabaseVersion: " + ip2proxy.getDatabaseVersion());

        // functions for individual fields
        console.log("isProxy: " + ip2proxy.isProxy(ip));
        console.log("ProxyType: " + ip2proxy.getProxyType(ip));
        console.log("CountryShort: " + ip2proxy.getCountryShort(ip));
        console.log("CountryLong: " + ip2proxy.getCountryLong(ip));
        console.log("Region: " + ip2proxy.getRegion(ip));
        console.log("City: " + ip2proxy.getCity(ip));
        console.log("ISP: " + ip2proxy.getISP(ip));
        console.log("Domain: " + ip2proxy.getDomain(ip));
        console.log("UsageType: " + ip2proxy.getUsageType(ip));
        console.log("ASN: " + ip2proxy.getASN(ip));
        console.log("AS: " + ip2proxy.getAS(ip));
        console.log("LastSeen: " + ip2proxy.getLastSeen(ip));
        console.log("Threat: " + ip2proxy.getThreat(ip));
        console.log("Provider: " + ip2proxy.getProvider(ip));
        console.log("FraudScore: " + ip2proxy.getFraudScore(ip));

        // function for all fields
        let all = ip2proxy.getAll(ip);
        console.log("isProxy: " + all.isProxy);
        console.log("proxyType: " + all.proxyType);
        console.log("countryShort: " + all.countryShort);
        console.log("countryLong: " + all.countryLong);
        console.log("region: " + all.region);
        console.log("city: " + all.city);
        console.log("isp: " + all.isp);
        console.log("domain: " + all.domain);
        console.log("usagetype: " + all.usageType);
        console.log("asn: " + all.asn);
        console.log("as: " + all.as);
        console.log("lastSeen: " + all.lastSeen);
        console.log("threat: " + all.threat);
        console.log("provider: " + all.provider);
        console.log("fraudScore: " + all.fraudScore);
    }
    else {
        console.log("Error reading BIN file.");
    }
    ip2proxy.close();
}
// getLocation("8.8.8.8")

export function lookupIP(ip: string) {
    const geo = cityLookup.get(ip);
    const asn = asnLookup.get(ip);
    const proxy = ip2proxy.getAll(ip);
    console.log(geo);
    console.log(asn);
    

    return {
        ip,
        city: geo?.city?.names?.en,
        region: geo?.subdivisions?.[0]?.names?.en,
        country: geo?.country?.names?.en,
        country_code: geo?.country?.iso_code,
        lat: geo?.location?.latitude,
        long: geo?.location?.longitude,
        timezone: geo?.location?.time_zone,
        asn: asn?.autonomous_system_number,
        org: asn?.autonomous_system_organization,
        is_proxy: proxy?.isProxy === 1,
        // proxy_type: proxy?.proxyType,
    };
}

// console.log(lookupIP("225.2.12.121"))


const lookup = await maxmind.open< CityResponse >(cityPath);
const asnlookup = await maxmind.open<CityResponse>(asnPath);
const proxylookup = ip2proxy.getAll('157.45.67.214');
console.log(proxylookup);
// console.log(ip2Location.getAll('8.8.8.8'));

// console.log(lookup.get('128.101.101.101'));
// console.log(asnLookup.get('128.101.101.101'));


app.listen(PORT,() => {
    console.log(`Listening on Port ${PORT}`);  
})