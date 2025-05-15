import * as path from 'node:path';
import * as fs from 'node:fs';
import * as url from "node:url";
import maxmind, { CityResponse, AsnResponse } from 'maxmind';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cityPath = path.resolve(__dirname, '../mainFiles/GeoLite2-City/GeoLite2-City.mmdb');
const asnPath = path.resolve(__dirname, '../mainFiles/GeoLite2-ASN/GeoLite2-ASN.mmdb');
const currencyPath = path.resolve(__dirname, '../mainFiles/json/FinalCountryCurrencyMap.json');
const currencyMap = JSON.parse(fs.readFileSync(currencyPath, 'utf-8'));
const countryExtraPath = path.resolve(__dirname, '../mainFiles/json/CountryExtras2.json');
const countryExtraMap = JSON.parse(fs.readFileSync(countryExtraPath, 'utf-8'));

class IPData{
    static ipData;
    static cityLookup: maxmind.Reader<CityResponse> | null = null;
    static asnLookup: maxmind.Reader<AsnResponse> | null = null;

    static async getInstance() {
        if (!IPData.cityLookup || !IPData.asnLookup) {
            IPData.cityLookup = await maxmind.open<CityResponse>(cityPath);
            IPData.asnLookup = await maxmind.open<AsnResponse>(asnPath);
        }
        if (this.ipData) return this.ipData
        this.ipData = new IPData()
        return new IPData()
    }

    public getData(ip: string) {
        return this.getGeoData(ip)
    }

    private getGeoData(ip: string) {
        const valid = maxmind.validate(ip)
        if (!valid) {
            throw new Error("Invalid IP address")
        }
        const cityData = IPData.cityLookup.get(ip);
        const asnData = IPData.asnLookup.get(ip);
        let subdivisions
        console.log(cityData);
        
        
        if (cityData.subdivisions) {
            subdivisions = cityData.subdivisions[0]
        }
        const currencyData = this.getCurrency(cityData?.country?.iso_code)
        const extraData = this.getExtras(cityData?.country?.iso_code)
        
        return {
            ip,
            continent: cityData?.continent?.names?.en,
            continentCode: cityData?.continent?.code,
            country: cityData?.country?.names?.en,
            countryCode: cityData?.country?.iso_code,
            region: subdivisions?.names?.en || null,
            regionCode: subdivisions?.iso_code || null,
            city: cityData?.city?.names?.en || null,
            postal_Code: cityData?.postal?.code,
            time_zone: cityData?.location?.time_zone,
            latitude: cityData?.location?.latitude,
            longitude: cityData?.location?.longitude,
            accuracy_radius: cityData?.location?.accuracy_radius,
            is_in_eu: extraData.is_in_eu,
            dial_code: extraData.dial_code,
            flag: extraData.flag,
            flag_unicode: extraData.unicode,
            currency: { ...currencyData },
            asn: {
                number: asnData?.autonomous_system_number || null,
                org: asnData?.autonomous_system_organization || null,
            },
        }
    }

    private getCurrency(countryCode:string) {
        return currencyMap[countryCode] || null
    }

    private getExtras(countryCode:string) {
        return countryExtraMap[countryCode] || null;
    }

}

// const ipDataInit = new IPData()
export const ipDataService = await IPData.getInstance()
console.log(ipDataService.getData('157.45.67.214'))
// console.log(ipDataService.getData('92.97.230.6'))







// const baseDir = path.resolve(__dirname, '../mainFiles/json');
// const euData = JSON.parse(fs.readFileSync(path.join(baseDir, 'Countries_With_EU_Tag.json'), 'utf-8'));
// const dialEmojiData = JSON.parse(fs.readFileSync(path.join(baseDir, 'Country_With_Dial_And_Emoji.json'), 'utf-8'));

// const result = {};

// for (const country of dialEmojiData) {
//     const countryName = country.code;
//     const euInfo = euData.find(e => {
//         const clean = e.name.replace(/\s+/g, '').toUpperCase();
//         const target = countryName.replace(/\s+/g, '').toUpperCase();
//         return clean === target;
//     });
//     result[countryName] = {
//         flag: country.emoji || null,
//         dial_code: country.dial_code || null,
//         unicode: country.unicode || null,
//         is_in_eu: euInfo ? euInfo.eu : false
//     };
// }

// fs.writeFileSync(path.join(baseDir, 'CountryExtras2.json'), JSON.stringify(result, null, 2));
// console.log("✅ CountryExtras.json generated with flag, dial_code, and is_in_eu.");