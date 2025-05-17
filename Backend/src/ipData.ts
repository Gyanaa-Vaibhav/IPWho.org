import * as path from 'node:path';
import * as fs from 'node:fs';
import * as url from "node:url";
import maxmind, { CityResponse, AsnResponse, Reader } from 'maxmind';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cityPath = path.resolve(__dirname, '../mainFiles/GeoLite2-City/GeoLite2-City.mmdb');
const asnPath = path.resolve(__dirname, '../mainFiles/GeoLite2-ASN/GeoLite2-ASN.mmdb');
const currencyPath = path.resolve(__dirname, '../mainFiles/json/FinalCountryCurrencyMap.json');
const currencyMap = JSON.parse(fs.readFileSync(currencyPath, 'utf-8'));
const countryExtraPath = path.resolve(__dirname, '../mainFiles/json/CountryExtras2.json');
const countryExtraMap = JSON.parse(fs.readFileSync(countryExtraPath, 'utf-8'));

class IPData{
    static ipData: IPData | null;
    static cityLookup: Reader<CityResponse> | null = null;
    static asnLookup: Reader<AsnResponse> | null = null;

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
        try {
            return this.getGeoData(ip)
        } catch (e) {
            console.log(e);
            return false
        }
    }

    private getGeoData(ip: string) {
        const valid = maxmind.validate(ip)
        if (!valid) {
            throw new Error("Invalid IP address")
        }
        if(!IPData.cityLookup || !IPData.asnLookup) {
            throw new Error("Initiation failed please make sure you using the class like this 'await IPData.getInstance()'")
        }
        const cityData = IPData.cityLookup.get(ip);
        const asnData = IPData.asnLookup.get(ip);
        let subdivisions
        
        if(!cityData || !asnData) return
        
        if (cityData.subdivisions) {
            subdivisions = cityData.subdivisions[0]
        }
        const currencyData = this.getCurrency(cityData?.country?.iso_code ?? '')
        const extraData = this.getExtras(cityData?.country?.iso_code ?? '')
        
        return {
            ip,
            continent: cityData?.continent?.names?.en,
            continentCode: cityData?.continent?.code,
            country: cityData?.country?.names?.en,
            countryCode: cityData?.country?.iso_code,
            capital: extraData?.capital,
            region: subdivisions?.names?.en || null,
            regionCode: subdivisions?.iso_code || null,
            city: cityData?.city?.names?.en || null,
            postal_Code: cityData?.postal?.code,
            time_zone: cityData?.location?.time_zone,
            latitude: cityData?.location?.latitude,
            longitude: cityData?.location?.longitude,
            accuracy_radius: cityData?.location?.accuracy_radius,
            is_in_eu: extraData?.is_in_eu,
            dial_code: extraData?.dial_code,
            flag: extraData?.flag,
            flag_unicode: extraData?.unicode,
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

export const ipDataService = await IPData.getInstance()

