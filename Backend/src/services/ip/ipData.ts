import * as path from 'node:path';
import * as url from "node:url";
import moment from 'moment-timezone';
import maxmind, { CityResponse, AsnResponse, Reader } from 'maxmind';
import {isBlocked, getCurrencyMap, getCountryExtras} from './functions/functionExport.js'

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cityPath = path.resolve(__dirname, '../../../mainFiles/GeoLite2-City/GeoLite2-City.mmdb');
const asnPath = path.resolve(__dirname, '../../../mainFiles/GeoLite2-ASN/GeoLite2-ASN.mmdb');
const currencyMap = getCurrencyMap();
const countryExtraMap = getCountryExtras();

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
        ip = ip.trim();
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
        const timeData = this.getTimeInfo(cityData?.location?.time_zone ?? '')
        const isProxy = isBlocked(ip);
        console.log(isProxy)
        
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
            dial_code: extraData?.dial_code,
            is_in_eu: extraData?.is_in_eu,
            latitude: cityData?.location?.latitude,
            longitude: cityData?.location?.longitude,
            accuracy_radius: cityData?.location?.accuracy_radius,
            timezone:{
                time_zone: cityData?.location?.time_zone,
                abbr: timeData?.abbr,
                offset: timeData?.offset,
                is_dst: timeData?.is_dst,
                utc: timeData?.time_zone,
                current_time: timeData?.current_time,
            },
            flag:{
                flag_Icon: extraData?.flag,
                flag_unicode: extraData?.unicode,
            },
            currency: { ...currencyData },
            connection: {
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

    private getTimeInfo(timeZone: string) {
        const now = new Date();
        const getAbbrIst = this.getAbbrAndDST(timeZone);

        const options: Intl.DateTimeFormatOptions = {
            timeZone,
            hour12: false,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short',
        };

        const parts = new Intl.DateTimeFormat('en-GB', options).formatToParts(now);
        const getPart = (type: string) => parts.find(p => p.type === type)?.value ?? '00';
        const localTimeString = `${getPart('year')}-${getPart('month')}-${getPart('day')}T${getPart('hour')}:${getPart('minute')}:${getPart('second')}`;

        // Get offset in minutes using Intl for the right time zone
        const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
        const localDate = new Date(now.toLocaleString('en-US', { timeZone }));

        const offsetMinutes = Math.round((localDate.getTime() - utcDate.getTime()) / 60000);
        const sign = offsetMinutes >= 0 ? '+' : '-';
        const absOffset = Math.abs(offsetMinutes);
        const offsetHours = String(Math.floor(absOffset / 60)).padStart(2, '0');
        const offsetMins = String(absOffset % 60).padStart(2, '0');
        const offset = `${sign}${offsetHours}:${offsetMins}`;

        return {
            current_time: `${localTimeString}${offset}`,
            time_zone: offset,
            offset: offsetMinutes*60,
            abbr: getAbbrIst?.abbr,
            is_dst: getAbbrIst?.is_dst,
        };
    }

    private getAbbrAndDST(timeZone: string) {
        const now = new Date();
        const abbr = moment.tz(timeZone).format('z');

        const jan = new Date(Date.UTC(now.getFullYear(), 0, 1));
        const offsetNow = -now.toLocaleString('en-US', { timeZone }).localeCompare('', undefined);
        const offsetJan = -jan.toLocaleString('en-US', { timeZone }).localeCompare('', undefined);
        const is_dst = offsetNow !== offsetJan;

        return { abbr, is_dst };
    }

}

export const ipDataService = await IPData.getInstance()
console.log(ipDataService.getData('223.241.100.90'))
// console.log(ipDataService.getData('171.25.193.25'))

